/**
 * Read-only probe of the live Supabase project — finds which blog tables and
 * columns exist so the migration scope is exact. Uses the service role key
 * from .env (never printed). No writes, no DDL.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const envRaw = readFileSync(resolve(process.cwd(), ".env"), "utf8");
const getEnv = (key) => {
  const line = envRaw.split("\n").find((l) => l.startsWith(`${key}=`));
  return line ? line.slice(key.length + 1).replace(/^["']|["']$/g, "").trim() : "";
};

const URL = getEnv("NEXT_PUBLIC_SUPABASE_URL");
const KEY = getEnv("SUPABASE_SERVICE_ROLE_KEY");
if (!URL || !KEY) {
  console.error("MISSING_ENV");
  process.exit(1);
}

const base = `${URL}/rest/v1`;

async function probeTable(name) {
  try {
    const res = await fetch(`${base}/${name}?select=*&limit=1`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      signal: AbortSignal.timeout(20000),
    });
    return res.status;
  } catch {
    return "ERR";
  }
}

async function probeColumn(table, column) {
  try {
    const res = await fetch(`${base}/${table}?select=${column}&limit=1`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      signal: AbortSignal.timeout(20000),
    });
    return res.status;
  } catch {
    return "ERR";
  }
}

const tables = [
  "blogs", "categories", "tags", "blog_tags", "authors", "comments",
  "newsletter", "blog_views", "blog_likes", "blog_bookmarks", "settings", "featured_blogs",
];
const blogColumns = [
  "pinned", "scheduled", "published_at", "deleted_at", "read_count",
  "editors_pick", "trending", "featured", "seo", "cover_url", "content", "slug", "status",
];
const authorColumns = ["website", "instagram", "linkedin"];
const categoryColumns = ["seo", "featured_image"];

console.log("== TABLES ==");
for (const t of tables) console.log(`${t} -> ${await probeTable(t)}`);

console.log("== blogs columns ==");
for (const c of blogColumns) console.log(`blogs.${c} -> ${await probeColumn("blogs", c)}`);

console.log("== authors columns ==");
for (const c of authorColumns) console.log(`authors.${c} -> ${await probeColumn("authors", c)}`);

console.log("== categories columns ==");
for (const c of categoryColumns) console.log(`categories.${c} -> ${await probeColumn("categories", c)}`);
