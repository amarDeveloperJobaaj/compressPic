/**
 * Vizo Tool — blog content migration CLI.
 *
 * Migrates every existing post + guide from the current data source
 * (lib/blog/data.ts) into Supabase, preserving slugs, dates, content,
 * authors, categories, tags and SEO overrides — without renaming anything.
 *
 * Usage:
 *   npm run migrate:blogs -- --dry-run            # build plan + report only
 *   npm run migrate:blogs -- --apply              # write to Supabase (idempotent)
 *   npm run migrate:blogs -- --apply --json       # machine-readable output
 *
 * --dry-run needs no credentials. --apply reads:
 *   NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from the environment
 *   (.env.local is loaded automatically).
 *
 * The client is created here directly (NOT from lib/supabase/admin.ts, which
 * imports "server-only") so this script can run outside Next.js via tsx.
 */
import { createClient } from "@supabase/supabase-js";

import { buildMigrationPlan } from "../lib/blog/migrate";
import { runMigration } from "../lib/blog/migrate-supabase";
import type { Database } from "../lib/supabase/database.types";

// ---------------------------------------------------------------------------
// Arg parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const mode = args.includes("--apply") ? "apply" : "dry-run";
const json = args.includes("--json");

function printPlan(plan: ReturnType<typeof buildMigrationPlan>): void {
  const s = plan.summary;
  console.log("");
  console.log("================================================================");
  console.log("  VIZO TOOL — BLOG CONTENT MIGRATION PLAN");
  console.log("================================================================");
  console.log(`  Source            : ${plan.source}`);
  console.log(`  Generated at      : ${plan.generatedAt}`);
  console.log("");
  console.log(`  Posts             : ${s.posts}   (published: ${s.published}, drafts: ${s.drafts})`);
  console.log(`  Guides            : ${s.guides}`);
  console.log(`  Categories        : ${s.categories}`);
  console.log(`  Tags              : ${s.tags}`);
  console.log(`  Authors           : ${s.authors}`);
  console.log(`  Content blocks    : ${s.totalBlocks}`);
  console.log(`    tool embeds     : ${s.toolEmbeds}`);
  console.log(`    FAQ blocks      : ${s.faqBlocks}`);
  console.log(`    code blocks     : ${s.codeBlocks}`);
  console.log(`    image blocks    : ${s.imageBlocks}`);
  console.log(`  Oldest post       : ${s.oldestPost}`);
  console.log(`  Newest post       : ${s.newestPost}`);
  console.log(`  Duplicate slugs   : ${s.duplicateSlugs}`);
  console.log(`  Missing categories: ${s.missingCategories.length ? s.missingCategories.join(", ") : "none"}`);
  console.log("");
  console.log("  Slugs preserved verbatim (must equal live URLs):");
  for (const slug of s.slugs) console.log(`    - /blog/${slug}`);
  console.log("================================================================");
}

function printRun(result: Awaited<ReturnType<typeof runMigration>>): void {
  const created = result.posts.filter((p) => p.action === "created").length;
  const updated = result.posts.filter((p) => p.action === "updated").length;
  const skipped = result.posts.filter((p) => p.action === "skipped").length;
  const authorsCreated = result.authors.filter((a) => a.action === "created").length;
  const categoriesCreated = result.categories.filter((c) => c.action === "created").length;
  const tagsCreated = result.tags.filter((t) => t.action === "created").length;

  console.log("");
  console.log("--------------------------------------------------------------");
  console.log("  MIGRATION RESULT");
  console.log("--------------------------------------------------------------");
  console.log(`  Authors    : ${authorsCreated} created, ${result.authors.length - authorsCreated} updated`);
  console.log(`  Categories : ${categoriesCreated} created, ${result.categories.length - categoriesCreated} updated`);
  console.log(`  Tags       : ${tagsCreated} created, ${result.tags.length - tagsCreated} updated`);
  console.log(`  Posts      : ${created} created, ${updated} updated, ${skipped} skipped`);
  if (result.errors.length) {
    console.log("");
    console.log(`  ⚠ ${result.errors.length} error(s):`);
    for (const error of result.errors) console.log(`    - ${error}`);
  } else {
    console.log("  ✅ No errors.");
  }
  console.log("--------------------------------------------------------------");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const plan = buildMigrationPlan();

  if (mode === "dry-run") {
    printPlan(plan);
    console.log("");
    console.log("DRY RUN — nothing was written. Re-run with --apply to migrate.");
    if (json) console.log(JSON.stringify(plan, null, 2));
    return;
  }

  // --apply -----------------------------------------------------------------
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "Missing Supabase credentials.\n" +
        "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local " +
        "(loaded automatically) or export them before running."
    );
    process.exit(1);
  }

  printPlan(plan);

  const client = createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log(`\nApplying migration to ${url}…`);
  const result = await runMigration(client, plan);
  printRun(result);

  if (json) {
    console.log(JSON.stringify({ plan, result }, null, 2));
  }

  if (result.errors.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
