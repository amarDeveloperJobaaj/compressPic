/**
 * Content migration — Supabase executor.
 *
 * Runs the plan produced by lib/blog/migrate.ts against a Supabase project.
 *
 * Guarantees:
 *   - IDEMPOTENT: re-running refreshes content but never duplicates rows
 *     (everything keys on the preserved `slug`).
 *   - NON-DESTRUCTIVE: no DELETE (except each post's own tag links before
 *     re-syncing), no renames, no slug changes. Existing rows in the target
 *     database are updated in place; rows that already exist keep their
 *     `created_at` (we update, not upsert-replace).
 *   - PRESERVES: title, subtitle, excerpt, content blocks, cover, author,
 *     category, tags, published/updated dates, read counts, feature flags
 *     and SEO overrides.
 *
 * The client is injected (service-role) so this module can be run both from
 * the CLI (`scripts/migrate-blogs.ts --apply`) and from server-side code
 * (pass `createAdminClient()`). It intentionally does not import
 * "server-only" modules so `npx tsx` can execute it.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Json } from "../supabase/database.types";
import type { MigrationPlan, MigrationPost } from "./migrate";
import { slugify } from "./utils";

export interface PostRunResult {
  slug: string;
  action: "created" | "updated" | "skipped";
  id?: string;
  error?: string;
}

export interface MigrationRunResult {
  authors: { name: string; action: "created" | "updated" }[];
  categories: { name: string; action: "created" | "updated" }[];
  tags: { name: string; action: "created" | "updated" }[];
  posts: PostRunResult[];
  errors: string[];
}

/** Upsert a taxonomy row by its unique slug, returning the id. */
async function ensureBySlug(
  client: SupabaseClient<Database>,
  table: "authors" | "categories" | "tags",
  row: Record<string, unknown>,
  slug: string
): Promise<{ id: string; action: "created" | "updated" } | null> {
  const { data: existing } = await client
    .from(table)
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    const { error } = await client
      .from(table)
      .update(row as never)
      .eq("id", existing.id);
    if (error) return null;
    return { id: existing.id, action: "updated" };
  }

  const { data, error } = await client
    .from(table)
    .insert(row as never)
    .select("id")
    .single();

  if (error || !data) return null;
  return { id: data.id, action: "created" };
}

async function syncPostTags(
  client: SupabaseClient<Database>,
  blogId: string,
  tagSlugs: string[],
  tagIds: Map<string, string>
): Promise<void> {
  await client.from("blog_tags").delete().eq("blog_id", blogId);
  for (const slug of tagSlugs) {
    const tagId = tagIds.get(slug);
    if (tagId) {
      await client.from("blog_tags").insert({ blog_id: blogId, tag_id: tagId });
    }
  }
}

async function upsertPost(
  client: SupabaseClient<Database>,
  post: MigrationPost,
  authorId: string | null,
  categoryId: string | null
): Promise<PostRunResult> {
  const fields = {
    author_id: authorId,
    category_id: categoryId,
    slug: post.slug,
    title: post.title,
    subtitle: post.subtitle,
    excerpt: post.excerpt,
    cover_url: post.cover_url,
    cover_alt: post.cover_alt,
    content: post.content as Json,
    status: post.status,
    featured: post.featured,
    trending: post.trending,
    editors_pick: post.editors_pick,
    read_count: post.read_count,
    seo: post.seo as Json,
    published_at: post.published_at,
    updated_at: post.updated_at,
  };

  const { data: existing } = await client
    .from("blogs")
    .select("id")
    .eq("slug", post.slug)
    .maybeSingle();

  if (existing) {
    const { error } = await client.from("blogs").update(fields).eq("id", existing.id);
    if (error) return { slug: post.slug, action: "skipped", error: error.message };
    return { slug: post.slug, action: "updated", id: existing.id };
  }

  const { data, error } = await client
    .from("blogs")
    .insert(fields as never)
    .select("id")
    .single();

  if (error || !data) {
    return { slug: post.slug, action: "skipped", error: error?.message ?? "no row returned" };
  }
  return { slug: post.slug, action: "created", id: data.id };
}

/** Run the full migration. Returns per-row results + a flat error list. */
export async function runMigration(
  client: SupabaseClient<Database>,
  plan: MigrationPlan
): Promise<MigrationRunResult> {
  const result: MigrationRunResult = {
    authors: [],
    categories: [],
    tags: [],
    posts: [],
    errors: [],
  };

  const authorIds = new Map<string, string>();
  const categoryIds = new Map<string, string>();
  const tagIds = new Map<string, string>();

  // 1. Authors ---------------------------------------------------------------
  for (const author of plan.authors) {
    const res = await ensureBySlug(
      client,
      "authors",
      { name: author.name, slug: author.slug, role: author.role },
      author.slug
    );
    if (res) {
      authorIds.set(author.slug, res.id);
      result.authors.push({ name: author.name, action: res.action });
    } else {
      result.errors.push(`author "${author.name}" (${author.slug})`);
    }
  }

  // 2. Categories ------------------------------------------------------------
  for (const category of plan.categories) {
    const res = await ensureBySlug(
      client,
      "categories",
      { name: category.name, slug: category.slug, description: category.description },
      category.slug
    );
    if (res) {
      categoryIds.set(category.slug, res.id);
      result.categories.push({ name: category.name, action: res.action });
    } else {
      result.errors.push(`category "${category.name}" (${category.slug})`);
    }
  }

  // 3. Tags ------------------------------------------------------------------
  for (const tag of plan.tags) {
    const res = await ensureBySlug(
      client,
      "tags",
      { name: tag.name, slug: tag.slug },
      tag.slug
    );
    if (res) {
      tagIds.set(tag.slug, res.id);
      result.tags.push({ name: tag.name, action: res.action });
    } else {
      result.errors.push(`tag "${tag.name}" (${tag.slug})`);
    }
  }

  // 4. Posts (slug is the identity — never generated, never changed) ---------
  for (const post of plan.posts) {
    try {
      // Author/tag lookups are keyed by slugified name (same rule the plan
      // builder uses), so they always match the created taxonomy rows.
      const authorId = authorIds.get(slugify(post.authorName)) ?? null;
      const categoryId = categoryIds.get(post.categorySlug) ?? null;

      const run = await upsertPost(client, post, authorId, categoryId);
      result.posts.push(run);

      if (run.id) {
        await syncPostTags(
          client,
          run.id,
          post.tags.map((tag) => slugify(tag)).filter(Boolean),
          tagIds
        );
      }

      // Featured strips — preserve the featured flag (position = read rank).
      if (run.id && post.featured) {
        await client
          .from("featured_blogs")
          .upsert({ blog_id: run.id, position: Math.max(0, post.read_count) }, { onConflict: "blog_id" });
      }
    } catch (error) {
      result.posts.push({
        slug: post.slug,
        action: "skipped",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  result.errors = result.errors.filter(Boolean);
  return result;
}
