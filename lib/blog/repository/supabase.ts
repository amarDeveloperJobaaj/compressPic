import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/lib/supabase/database.types";

import { estimateReadTime, slugify } from "../utils";
import { buildSearchOrClause, normalizePostFilters, type BlogSort } from "../search";
import type { BlogRepository, BookmarkResult, LikeResult, NewsletterResult } from "./types";
import type { BlogBlock, BlogCategory, BlogComment, BlogPost, BlogStats, AdminComment, NewsletterSubscriber } from "../types";
import type { BlogSummary } from "../service";
import type { BlogInputValidated } from "../validation";

/**
 * Supabase BlogRepository — the production data layer.
 *
 * - Public reads  -> anon client (lib/supabase/server.ts): RLS enforces that
 *   visitors only ever see published posts, approved comments and public
 *   settings — even if a future query forgets a filter.
 * - Admin reads + all writes -> service-role client (lib/supabase/admin.ts):
 *   full access for the admin panel and the server actions.
 *
 * The content model is stored as JSONB (the BlogBlock[] union), and the
 * derived fields (readTime, category/tag/author names via joins) are mapped
 * back to the exact BlogPost shape the UI already consumes.
 */

// ---------------------------------------------------------------------------
// Selects (embedded relations: author, category, tags)
// ---------------------------------------------------------------------------

const SUMMARY_SELECT = `id, slug, title, subtitle, excerpt, cover_url, cover_alt, status, pinned, featured, trending, editors_pick, read_count, seo, published_at, created_at, updated_at, deleted_at, author:authors(name, role, slug), category:categories(slug, name, description), tags:blog_tags(tag:tags(name))`;

const FULL_SELECT = `id, slug, title, subtitle, excerpt, cover_url, cover_alt, content, status, pinned, featured, trending, editors_pick, read_count, seo, published_at, created_at, updated_at, deleted_at, author:authors(name, role, slug), category:categories(slug, name, description), tags:blog_tags(tag:tags(name))`;

type PostRow = Database["public"]["Tables"]["blogs"]["Row"] & {
  author?: { name: string; role: string; slug: string } | null;
  category?: { slug: string; name: string; description: string | null } | null;
  tags?: { tag: { name: string } | null }[] | null;
};

type SummaryRow = Omit<PostRow, "content">;

type Query = ReturnType<SupabaseClient<Database>["from"]>;

// ---------------------------------------------------------------------------
// Row mappers (database -> BlogPost / BlogSummary)
// ---------------------------------------------------------------------------

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

/** seo JSONB is stored snake_case (schema) but may contain legacy camelCase. */
function rowToSeo(seo: Json): BlogPost["seo"] {
  if (!isRecord(seo)) return undefined;
  const metaTitle = str(seo.meta_title) ?? str(seo.metaTitle);
  const metaDescription = str(seo.meta_description) ?? str(seo.metaDescription);
  const keywords = Array.isArray(seo.keywords)
    ? seo.keywords.filter((k): k is string => typeof k === "string")
    : undefined;
  const ogImage = str(seo.og_image) ?? str(seo.ogImage);
  const twitterImage = str(seo.twitter_image) ?? str(seo.twitterImage);
  if (!metaTitle && !metaDescription && !keywords?.length && !ogImage && !twitterImage) {
    return undefined;
  }
  return {
    ...(metaTitle ? { metaTitle } : {}),
    ...(metaDescription ? { metaDescription } : {}),
    ...(keywords?.length ? { keywords } : {}),
    ...(ogImage ? { ogImage } : {}),
    ...(twitterImage ? { twitterImage } : {}),
  };
}

function rowToSummary(row: SummaryRow): BlogSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    excerpt: row.excerpt,
    cover: row.cover_url ?? `/og?title=${encodeURIComponent(row.title)}`,
    coverAlt: row.cover_alt,
    category: row.category?.name ?? "General",
    tags: (row.tags ?? []).map((t) => t.tag?.name).filter((n): n is string => Boolean(n)),
    author: row.author?.name ?? "Vizo Tool",
    authorRole: row.author?.role,
    authorSlug: row.author?.slug ?? undefined,
    publishedAt: row.published_at ?? row.created_at,
    updatedAt: row.updated_at,
    // Summaries carry no content — derive a rough read time from the excerpt.
    readTime: `${Math.max(1, Math.round(row.excerpt.trim().split(/\s+/).filter(Boolean).length / 200))} min read`,
    // Preserve the full status union (draft/published/scheduled/archived) so
    // the admin list + dashboard reflect the real status in Supabase mode.
    status: row.status as BlogSummary["status"],
    featured: row.featured,
    trending: row.trending,
    editorsPick: row.editors_pick,
    pinned: row.pinned ?? false,
    deleted: row.deleted_at ? true : undefined,
    readCount: row.read_count,
    seo: rowToSeo(row.seo),
  };
}

function rowToPost(row: PostRow): BlogPost {
  const summary = rowToSummary(row);
  return {
    ...summary,
    readTime: estimateReadTime((row.content as BlogBlock[]) ?? []),
    content: (row.content as BlogBlock[]) ?? [],
  };
}

/** camelCase SEO (BlogPost) -> snake_case JSONB stored on the row. */
function seoToDb(seo: NonNullable<BlogPost["seo"]>): Record<string, unknown> {
  return {
    ...(seo.metaTitle ? { meta_title: seo.metaTitle } : {}),
    ...(seo.metaDescription ? { meta_description: seo.metaDescription } : {}),
    ...(seo.keywords?.length ? { keywords: seo.keywords } : {}),
    ...(seo.ogImage ? { og_image: seo.ogImage } : {}),
    ...(seo.twitterImage ? { twitter_image: seo.twitterImage } : {}),
  };
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

function applySort(q: Query, sort: BlogSort): Query {
  switch (sort) {
    case "oldest":
      return q.order("published_at", { ascending: true, nullsFirst: false });
    case "most-read":
      return q.order("read_count", { ascending: false });
    case "featured":
      return q.order("featured", { ascending: false }).order("published_at", { ascending: false });
    case "trending":
      return q.order("trending", { ascending: false }).order("published_at", { ascending: false });
    case "editors-pick":
      return q.order("editors_pick", { ascending: false }).order("published_at", { ascending: false });
    case "newest":
    default:
      return q.order("published_at", { ascending: false, nullsFirst: false });
  }
}

// ---------------------------------------------------------------------------
// Write helpers (admin client)
// ---------------------------------------------------------------------------

async function ensureUniqueSlug(
  client: SupabaseClient<Database>,
  slug: string,
  excludeId?: string
): Promise<string> {
  const base = slugify(slug) || "untitled-post";
  let candidate = base;
  let i = 2;
  for (;;) {
    const { data } = await client.from("blogs").select("id").eq("slug", candidate).maybeSingle();
    if (!data || data.id === excludeId) return candidate;
    candidate = `${base}-${i++}`;
  }
}

async function resolveCategoryId(
  client: SupabaseClient<Database>,
  name: string
): Promise<string | null> {
  const slug = slugify(name) || "general";
  const { data } = await client.from("categories").select("id").eq("slug", slug).maybeSingle();
  if (data) return data.id;
  const { data: created } = await client
    .from("categories")
    .insert({ name, slug })
    .select("id")
    .maybeSingle();
  return created?.id ?? null;
}

async function resolveAuthorId(
  client: SupabaseClient<Database>,
  name: string,
  role?: string
): Promise<string | null> {
  const slug = slugify(name) || "author";
  const { data } = await client.from("authors").select("id").eq("slug", slug).maybeSingle();
  if (data) return data.id;
  const { data: created } = await client
    .from("authors")
    .insert({ name, slug, role: role ?? "Author" })
    .select("id")
    .maybeSingle();
  return created?.id ?? null;
}

async function syncTags(
  client: SupabaseClient<Database>,
  blogId: string,
  tags: string[]
): Promise<void> {
  await client.from("blog_tags").delete().eq("blog_id", blogId);
  for (const name of tags) {
    const slug = slugify(name);
    if (!slug) continue;
    let { data: tag } = await client.from("tags").select("id").eq("slug", slug).maybeSingle();
    if (!tag) {
      const { data: created } = await client.from("tags").insert({ name, slug }).select("id").maybeSingle();
      tag = created ?? null;
    }
    if (tag) {
      await client.from("blog_tags").insert({ blog_id: blogId, tag_id: tag.id });
    }
  }
}

// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------

export const supabaseBlogRepository: BlogRepository = {
  // --- Public reads ---------------------------------------------------------

  async getPostBySlug(slug) {
    const { data, error } = await (await createServerClient())
      .from("blogs")
      .select(FULL_SELECT)
      .eq("slug", slug)
      .eq("status", "published")
      .is("deleted_at", null)
      .maybeSingle();

    if (error) throw new Error(`getPostBySlug failed: ${error.message}`);
    return data ? rowToPost(data as PostRow) : null;
  },

  async listPublished(filters) {
    const f = normalizePostFilters(filters);
    let q: Query = (await createServerClient())
      .from("blogs")
      .select(SUMMARY_SELECT, { count: "exact" })
      .eq("status", "published")
      .is("deleted_at", null);

    if (f.category) q = q.eq("category.slug", f.category);
    if (f.tag) q = q.eq("tags.tag.slug", f.tag);
    if (f.author) q = q.eq("author.slug", f.author);
    if (f.query) {
      const orClause = buildSearchOrClause(f.query);
      if (orClause) q = q.or(orClause);
    }
    q = applySort(q, f.sort);

    const { data, count, error } = await q.range(f.from, f.to);
    if (error) throw new Error(`listPublished failed: ${error.message}`);

    const total = count ?? (data ?? []).length;
    return {
      items: (data ?? []).map((row: SummaryRow) => rowToSummary(row)),
      meta: { page: f.page, pageSize: f.pageSize, total, totalPages: Math.max(1, Math.ceil(total / f.pageSize)) },
    };
  },

  async getCategories() {
    const [cats, counts] = await Promise.all([
      (await createServerClient())
        .from("categories")
        .select("id, slug, name, description")
        .is("deleted_at", null)
        .order("name"),
      (await createServerClient())
        .from("blogs")
        .select("category_id")
        .eq("status", "published")
        .is("deleted_at", null),
    ]);

    const countMap = new Map<string, number>();
    for (const row of (counts.data ?? []) as { category_id: string | null }[]) {
      if (!row.category_id) continue;
      countMap.set(row.category_id, (countMap.get(row.category_id) ?? 0) + 1);
    }

    // Dedupe by name — duplicate names (e.g. same category created under two
    // slugs) would otherwise cause React key collisions in dropdowns and
    // filters. Keep the first occurrence per name.
    const seen = new Set<string>();
    const result: (BlogCategory & { count: number })[] = [];
    for (const c of cats.data ?? []) {
      if (seen.has(c.name)) continue;
      seen.add(c.name);
      result.push({
        slug: c.slug,
        name: c.name,
        description: c.description ?? "",
        count: countMap.get(c.id) ?? 0,
      });
    }
    return result;
  },

  async getTags() {
    const [tags, links] = await Promise.all([
      (await createServerClient()).from("tags").select("id, name").order("name"),
      (await createServerClient())
        .from("blog_tags")
        .select("tag_id, blog:blogs(status)")
        .eq("blog.status", "published"),
    ]);

    const countMap = new Map<string, number>();
    for (const link of (links.data ?? []) as { tag_id: string }[]) {
      countMap.set(link.tag_id, (countMap.get(link.tag_id) ?? 0) + 1);
    }

    return (tags.data ?? []).map((t) => ({ name: t.name, count: countMap.get(t.id) ?? 0 }));
  },

  async getFeaturedPosts(limit = 3) {
    return (await this.listPublished({ sort: "featured", pageSize: limit })).items;
  },

  async getTrendingPosts(limit = 4) {
    return (await this.listPublished({ sort: "trending", pageSize: limit })).items;
  },

  async getLatestPosts(limit = 6) {
    return (await this.listPublished({ sort: "newest", pageSize: limit })).items;
  },

  async getEditorsPicks(limit = 3) {
    return (await this.listPublished({ sort: "editors-pick", pageSize: limit })).items;
  },

  async getMostRead(limit = 4) {
    return (await this.listPublished({ sort: "most-read", pageSize: limit })).items;
  },

  async getRelatedPosts(post, limit = 3) {
    const { items } = await this.listPublished({ pageSize: 100 });
    const sameCategory = items.filter((p) => p.id !== post.id && p.category === post.category);
    const sharedTags = items
      .filter((p) => p.id !== post.id && p.tags.some((t) => post.tags.includes(t)))
      .sort((a, b) => b.readCount - a.readCount);
    const seen = new Set<string>();
    const related = [...sameCategory, ...sharedTags].filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
    return related.slice(0, limit);
  },

  async getPrevNext(post) {
    const { items } = await this.listPublished({ pageSize: 100 });
    const index = items.findIndex((p) => p.id === post.id);
    if (index === -1) return {};
    return {
      prev: index > 0 ? items[index - 1] : undefined,
      next: index < items.length - 1 ? items[index + 1] : undefined,
    };
  },

  // --- Admin reads ----------------------------------------------------------

  async getPostById(id) {
    const { data, error } = await createAdminClient()
      .from("blogs")
      .select(FULL_SELECT)
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`getPostById failed: ${error.message}`);
    return data ? rowToPost(data as PostRow) : null;
  },

  async listDrafts() {
    const { data, error } = await createAdminClient()
      .from("blogs")
      .select(SUMMARY_SELECT)
      .eq("status", "draft")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false });

    if (error) throw new Error(`listDrafts failed: ${error.message}`);
    return (data ?? []).map((row) => rowToSummary(row as SummaryRow));
  },

  async getBlogStats(): Promise<BlogStats> {
    const client = createAdminClient();
    const [
      total,
      published,
      drafts,
      scheduled,
      trending,
      featured,
      categories,
      reads,
      tags,
      authors,
      comments,
      pending,
      subscribers,
      trashed,
      views,
    ] = await Promise.all([
      client.from("blogs").select("id", { count: "exact", head: true }).is("deleted_at", null),
      client.from("blogs").select("id", { count: "exact", head: true }).eq("status", "published").is("deleted_at", null),
      client.from("blogs").select("id", { count: "exact", head: true }).eq("status", "draft").is("deleted_at", null),
      client.from("blogs").select("id", { count: "exact", head: true }).eq("status", "scheduled").is("deleted_at", null),
      client.from("blogs").select("id", { count: "exact", head: true }).eq("trending", true).is("deleted_at", null),
      client.from("blogs").select("id", { count: "exact", head: true }).eq("featured", true).is("deleted_at", null),
      client.from("categories").select("id", { count: "exact", head: true }).is("deleted_at", null),
      client.from("blogs").select("read_count").is("deleted_at", null),
      client.from("tags").select("id", { count: "exact", head: true }),
      client.from("authors").select("id", { count: "exact", head: true }).is("deleted_at", null),
      client.from("comments").select("id", { count: "exact", head: true }),
      client.from("comments").select("id", { count: "exact", head: true }).eq("status", "pending"),
      client.from("newsletter").select("id", { count: "exact", head: true }).eq("subscribed", true),
      client.from("blogs").select("id", { count: "exact", head: true }).not("deleted_at", "is", null),
      client.from("blog_views").select("id", { count: "exact", head: true }),
    ]);

    return {
      total: total.count ?? 0,
      published: published.count ?? 0,
      drafts: drafts.count ?? 0,
      scheduled: scheduled.count ?? 0,
      trending: trending.count ?? 0,
      featured: featured.count ?? 0,
      categories: categories.count ?? 0,
      totalReads: (reads.data ?? []).reduce((sum, r) => sum + (r.read_count ?? 0), 0),
      tags: tags.count ?? 0,
      authors: authors.count ?? 0,
      comments: comments.count ?? 0,
      pendingComments: pending.count ?? 0,
      subscribers: subscribers.count ?? 0,
      trashed: trashed.count ?? 0,
      views: views.count ?? 0,
    };
  },

  // --- Admin writes ---------------------------------------------------------

  async createPost(input: BlogInputValidated) {
    const client = createAdminClient();
    const slug = await ensureUniqueSlug(client, input.slug);
    const categoryId = input.category ? await resolveCategoryId(client, input.category) : null;
    const authorId = input.author ? await resolveAuthorId(client, input.author, input.authorRole) : null;

    const { data, error } = await client
      .from("blogs")
      .insert({
        author_id: authorId,
        category_id: categoryId,
        slug,
        title: input.title,
        subtitle: input.subtitle ?? "",
        excerpt: input.excerpt ?? "",
        cover_url: input.cover ?? null,
        cover_alt: input.coverAlt ?? input.title,
        content: (input.content ?? []) as unknown as Json,
        status: (input.status ?? "draft") as Database["public"]["Enums"]["blog_status"],
        featured: input.featured ?? false,
        trending: input.trending ?? false,
        editors_pick: input.editorsPick ?? false,
        pinned: input.pinned ?? false,
        read_count: input.readCount ?? 0,
        seo: input.seo ? (seoToDb(input.seo) as unknown as Json) : undefined,
        published_at: input.publishedAt ?? (input.status === "published" ? new Date().toISOString() : null),
      })
      .select(FULL_SELECT)
      .single();

    if (error) throw new Error(`createPost failed: ${error.message}`);
    if (input.tags?.length) await syncTags(client, data.id, input.tags);
    return rowToPost({ ...data, author: data.author, category: data.category, tags: data.tags } as PostRow);
  },

  async updatePost(id, input) {
    const client = createAdminClient();
    const existing = await client.from("blogs").select("id").eq("id", id).maybeSingle();
    if (!existing.data) return null;

    const slug = input.slug ? await ensureUniqueSlug(client, input.slug, id) : undefined;
    const categoryId = input.category ? await resolveCategoryId(client, input.category) : undefined;
    const authorId = input.author ? await resolveAuthorId(client, input.author, input.authorRole) : undefined;

    const patch: Record<string, unknown> = {};
    if (slug !== undefined) patch.slug = slug;
    if (input.title !== undefined) patch.title = input.title;
    if (input.subtitle !== undefined) patch.subtitle = input.subtitle;
    if (input.excerpt !== undefined) patch.excerpt = input.excerpt;
    if (input.cover !== undefined) patch.cover_url = input.cover;
    if (input.coverAlt !== undefined) patch.cover_alt = input.coverAlt;
    if (input.content !== undefined) patch.content = input.content as unknown as Json;
    if (input.status !== undefined) patch.status = input.status;
    if (input.featured !== undefined) patch.featured = input.featured;
    if (input.trending !== undefined) patch.trending = input.trending;
    if (input.editorsPick !== undefined) patch.editors_pick = input.editorsPick;
    if (input.pinned !== undefined) patch.pinned = input.pinned;
    if (input.readCount !== undefined) patch.read_count = input.readCount;
    if (input.seo !== undefined) patch.seo = seoToDb(input.seo) as unknown as Json;
    if (input.publishedAt !== undefined) patch.published_at = input.publishedAt;
    // Publishing without an explicit date stamps it now.
    if (input.status === "published" && !input.publishedAt) {
      patch.published_at = new Date().toISOString();
    }
    if (categoryId !== undefined) patch.category_id = categoryId;
    if (authorId !== undefined) patch.author_id = authorId;

    const { data, error } = await client
      .from("blogs")
      .update(patch as Database["public"]["Tables"]["blogs"]["Update"])
      .eq("id", id)
      .select(FULL_SELECT)
      .single();

    if (error) throw new Error(`updatePost failed: ${error.message}`);
    if (input.tags !== undefined) await syncTags(client, id, input.tags);
    return rowToPost({ ...data, author: data.author, category: data.category, tags: data.tags } as PostRow);
  },

  async deletePost(id) {
    // Soft delete; returning the row lets callers know the post actually existed.
    const { data, error } = await createAdminClient()
      .from("blogs")
      .update({ deleted_at: new Date().toISOString(), status: "archived" })
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(`deletePost failed: ${error.message}`);
    return Boolean(data);
  },

  async duplicatePost(id) {
    const client = createAdminClient();
    const src = await client
      .from("blogs")
      .select("id, author_id, category_id, cover_url, cover_alt, seo, slug, title, subtitle, excerpt, content")
      .eq("id", id)
      .maybeSingle();
    if (!src.data) return null;

    const slug = await ensureUniqueSlug(client, `${src.data.slug}-copy`);

    const { data, error } = await client
      .from("blogs")
      .insert({
        author_id: src.data.author_id,
        category_id: src.data.category_id,
        slug,
        title: `${src.data.title} (Copy)`,
        subtitle: src.data.subtitle,
        excerpt: src.data.excerpt,
        cover_url: src.data.cover_url,
        cover_alt: src.data.cover_alt,
        content: src.data.content,
        status: "draft" as Database["public"]["Enums"]["blog_status"],
        featured: false,
        trending: false,
        editors_pick: false,
        read_count: 0,
        seo: src.data.seo,
        published_at: null,
      })
      .select("id")
      .single();

    if (error) throw new Error(`duplicatePost failed: ${error.message}`);

    const { data: sourceTags } = await client.from("blog_tags").select("tag_id").eq("blog_id", id);
    if (sourceTags?.length) {
      await client
        .from("blog_tags")
        .insert(sourceTags.map((t) => ({ blog_id: data.id, tag_id: t.tag_id })));
    }

    return this.getPostById(data.id);
  },

  // --- Admin blog list / trash ----------------------------------------------

  async listAdminPosts({ query, status, page = 1, pageSize = 20 }) {
    const f = normalizePostFilters({ page, pageSize });
    let q: Query = createAdminClient()
      .from("blogs")
      .select(SUMMARY_SELECT, { count: "exact" })
      .is("deleted_at", null);

    if (status && status !== "all") q = q.eq("status", status);
    if (query?.trim()) {
      const orClause = buildSearchOrClause(query);
      if (orClause) q = q.or(orClause);
    }
    q = q.order("updated_at", { ascending: false }).range(f.from, f.to);

    const { data, count, error } = await q;
    if (error) throw new Error(`listAdminPosts failed: ${error.message}`);
    const total = count ?? (data ?? []).length;
    return {
      items: (data ?? []).map((row: SummaryRow) => rowToSummary(row)),
      meta: { page: f.page, pageSize: f.pageSize, total, totalPages: Math.max(1, Math.ceil(total / f.pageSize)) },
    };
  },

  async restorePost(id) {
    const { data, error } = await createAdminClient()
      .from("blogs")
      .update({ deleted_at: null, status: "draft" })
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(`restorePost failed: ${error.message}`);
    return Boolean(data);
  },

  async listTrashedPosts() {
    const { data, error } = await createAdminClient()
      .from("blogs")
      .select(SUMMARY_SELECT)
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false })
      .order("updated_at", { ascending: false });
    if (error) throw new Error(`listTrashedPosts failed: ${error.message}`);
    return (data ?? []).map((row) => rowToSummary(row as SummaryRow));
  },

  async purgePost(id) {
    const { error } = await createAdminClient().from("blogs").delete().eq("id", id);
    if (error) throw new Error(`purgePost failed: ${error.message}`);
    return true;
  },

  // --- Categories (admin CRUD, keyed by unique slug) ------------------------

  async createCategory(input) {
    const client = createAdminClient();
    const slug = input.slug || slugify(input.name) || "general";
    const seo = input.seo
      ? {
          ...(input.seo.metaTitle ? { meta_title: input.seo.metaTitle } : {}),
          ...(input.seo.metaDescription ? { meta_description: input.seo.metaDescription } : {}),
          ...(input.seo.keywords?.length ? { keywords: input.seo.keywords } : {}),
        }
      : {};
    const { data, error } = await client
      .from("categories")
      .insert({
        name: input.name,
        slug,
        description: input.description ?? "",
        seo: seo as unknown as Json,
        featured_image: input.featuredImage ?? null,
      })
      .select("id, slug, name, description")
      .single();
    if (error) throw new Error(`createCategory failed: ${error.message}`);
    return { slug: data.slug, name: data.name, description: data.description ?? "", id: data.id, count: 0 };
  },

  async updateCategory(slug, input) {
    const patch: Record<string, unknown> = {};
    if (input.name !== undefined) patch.name = input.name;
    if (input.slug !== undefined) patch.slug = input.slug;
    if (input.description !== undefined) patch.description = input.description;
    if (input.featuredImage !== undefined) patch.featured_image = input.featuredImage;
    if (input.seo !== undefined) {
      patch.seo = {
        ...(input.seo.metaTitle ? { meta_title: input.seo.metaTitle } : {}),
        ...(input.seo.metaDescription ? { meta_description: input.seo.metaDescription } : {}),
        ...(input.seo.keywords?.length ? { keywords: input.seo.keywords } : {}),
      } as unknown as Json;
    }
    const { data, error } = await createAdminClient()
      .from("categories")
      .update(patch as Database["public"]["Tables"]["categories"]["Update"])
      .eq("slug", slug)
      .select("id, slug, name, description")
      .maybeSingle();
    if (error) throw new Error(`updateCategory failed: ${error.message}`);
    if (!data) return null;
    return { slug: data.slug, name: data.name, description: data.description ?? "", id: data.id };
  },

  async deleteCategory(slug) {
    const { data, error } = await createAdminClient()
      .from("categories")
      .update({ deleted_at: new Date().toISOString() })
      .eq("slug", slug)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(`deleteCategory failed: ${error.message}`);
    return Boolean(data);
  },

  // --- Tags (admin CRUD, keyed by unique slug) ------------------------------

  async createTag(input) {
    const slug = input.slug || slugify(input.name) || "tag";
    const { data, error } = await createAdminClient()
      .from("tags")
      .insert({ name: input.name, slug })
      .select("id, slug, name")
      .single();
    if (error) throw new Error(`createTag failed: ${error.message}`);
    return data;
  },

  async updateTag(slug, input) {
    const patch: Record<string, unknown> = {};
    if (input.name !== undefined) patch.name = input.name;
    if (input.slug !== undefined) patch.slug = input.slug;
    const { data, error } = await createAdminClient()
      .from("tags")
      .update(patch as Database["public"]["Tables"]["tags"]["Update"])
      .eq("slug", slug)
      .select("id, slug, name")
      .maybeSingle();
    if (error) throw new Error(`updateTag failed: ${error.message}`);
    return data ?? null;
  },

  async deleteTag(slug) {
    const { data, error } = await createAdminClient()
      .from("tags")
      .delete()
      .eq("slug", slug)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(`deleteTag failed: ${error.message}`);
    return Boolean(data);
  },

  async mergeTags(sourceSlug, targetSlug) {
    if (sourceSlug === targetSlug) return false;
    const client = createAdminClient();
    const [source, target] = await Promise.all([
      client.from("tags").select("id").eq("slug", sourceSlug).maybeSingle(),
      client.from("tags").select("id").eq("slug", targetSlug).maybeSingle(),
    ]);
    if (!source.data || !target.data) return false;
    const { error } = await client
      .from("blog_tags")
      .update({ tag_id: target.data.id })
      .eq("tag_id", source.data.id);
    if (error) throw new Error(`mergeTags failed: ${error.message}`);
    await client.from("tags").delete().eq("id", source.data.id);
    return true;
  },

  async listTagsAdmin() {
    const [tags, links] = await Promise.all([
      createAdminClient().from("tags").select("id, slug, name").order("name"),
      createAdminClient().from("blog_tags").select("tag_id"),
    ]);
    const countMap = new Map<string, number>();
    for (const link of (links.data ?? []) as { tag_id: string }[]) {
      countMap.set(link.tag_id, (countMap.get(link.tag_id) ?? 0) + 1);
    }
    return (tags.data ?? []).map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      count: countMap.get(t.id) ?? 0,
    }));
  },

  // --- Authors (admin CRUD, keyed by unique slug) ---------------------------

  async getAuthorBySlug(slug) {
    const { data, error } = await (await createServerClient())
      .from("authors")
      .select("id, name, slug, role, bio, avatar_url, email, twitter, website, instagram, linkedin, created_at, updated_at")
      .eq("slug", slug)
      .is("deleted_at", null)
      .maybeSingle();
    if (error) throw new Error(`getAuthorBySlug failed: ${error.message}`);
    if (!data) return null;
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      role: data.role,
      bio: data.bio ?? "",
      avatarUrl: data.avatar_url ?? undefined,
      email: data.email ?? undefined,
      twitter: data.twitter ?? undefined,
      website: data.website ?? undefined,
      instagram: data.instagram ?? undefined,
      linkedin: data.linkedin ?? undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at ?? undefined,
    };
  },

  async listAuthors() {
    const { data, error } = await createAdminClient()
      .from("authors")
      .select("id, name, slug, role, bio, avatar_url, email, twitter, website, instagram, linkedin, created_at, updated_at")
      .is("deleted_at", null)
      .order("name");
    if (error) throw new Error(`listAuthors failed: ${error.message}`);
    return (data ?? []).map((a) => ({
      id: a.id,
      name: a.name,
      slug: a.slug,
      role: a.role,
      bio: a.bio ?? "",
      avatarUrl: a.avatar_url ?? undefined,
      email: a.email ?? undefined,
      twitter: a.twitter ?? undefined,
      website: a.website ?? undefined,
      instagram: a.instagram ?? undefined,
      linkedin: a.linkedin ?? undefined,
      createdAt: a.created_at,
      updatedAt: a.updated_at,
    }));
  },

  async createAuthor(input) {
    const { data, error } = await createAdminClient()
      .from("authors")
      .insert({
        name: input.name,
        slug: input.slug || slugify(input.name) || "author",
        role: input.role ?? "Author",
        bio: input.bio ?? "",
        avatar_url: input.avatarUrl ?? null,
        email: input.email ?? null,
        twitter: input.twitter ?? null,
        website: input.website ?? null,
        instagram: input.instagram ?? null,
        linkedin: input.linkedin ?? null,
      })
      .select("id, name, slug, role, bio, avatar_url, email, twitter, website, instagram, linkedin, created_at")
      .single();
    if (error) throw new Error(`createAuthor failed: ${error.message}`);
    const a = data;
    return {
      id: a.id,
      name: a.name,
      slug: a.slug,
      role: a.role,
      bio: a.bio ?? "",
      avatarUrl: a.avatar_url ?? undefined,
      email: a.email ?? undefined,
      twitter: a.twitter ?? undefined,
      website: a.website ?? undefined,
      instagram: a.instagram ?? undefined,
      linkedin: a.linkedin ?? undefined,
      createdAt: a.created_at,
    };
  },

  async updateAuthor(slug, input) {
    const patch: Record<string, unknown> = {};
    if (input.name !== undefined) patch.name = input.name;
    if (input.slug !== undefined) patch.slug = input.slug;
    if (input.role !== undefined) patch.role = input.role;
    if (input.bio !== undefined) patch.bio = input.bio;
    if (input.avatarUrl !== undefined) patch.avatar_url = input.avatarUrl;
    if (input.email !== undefined) patch.email = input.email;
    if (input.twitter !== undefined) patch.twitter = input.twitter;
    if (input.website !== undefined) patch.website = input.website;
    if (input.instagram !== undefined) patch.instagram = input.instagram;
    if (input.linkedin !== undefined) patch.linkedin = input.linkedin;
    const { data, error } = await createAdminClient()
      .from("authors")
      .update(patch as Database["public"]["Tables"]["authors"]["Update"])
      .eq("slug", slug)
      .select("id, name, slug, role, bio, avatar_url, email, twitter, website, instagram, linkedin, created_at")
      .maybeSingle();
    if (error) throw new Error(`updateAuthor failed: ${error.message}`);
    if (!data) return null;
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      role: data.role,
      bio: data.bio ?? "",
      avatarUrl: data.avatar_url ?? undefined,
      email: data.email ?? undefined,
      twitter: data.twitter ?? undefined,
      website: data.website ?? undefined,
      instagram: data.instagram ?? undefined,
      linkedin: data.linkedin ?? undefined,
      createdAt: data.created_at,
    };
  },

  async deleteAuthor(slug) {
    const { data, error } = await createAdminClient()
      .from("authors")
      .update({ deleted_at: new Date().toISOString() })
      .eq("slug", slug)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(`deleteAuthor failed: ${error.message}`);
    return Boolean(data);
  },

  // --- Engagement -----------------------------------------------------------

  async recordView(blogId, visitorId) {
    const { error } = await createAdminClient()
      .from("blog_views")
      .insert({ blog_id: blogId, visitor_id: visitorId ?? null });
    if (error) throw new Error(`recordView failed: ${error.message}`);
  },

  async getPostEngagement(blogId) {
    const client = createAdminClient();
    const [likes, bookmarks, views] = await Promise.all([
      client.from("blog_likes").select("id", { count: "exact", head: true }).eq("blog_id", blogId),
      client.from("blog_bookmarks").select("id", { count: "exact", head: true }).eq("blog_id", blogId),
      client.from("blog_views").select("id", { count: "exact", head: true }).eq("blog_id", blogId),
    ]);
    return {
      likes: likes.count ?? 0,
      bookmarks: bookmarks.count ?? 0,
      views: views.count ?? 0,
    };
  },

  async toggleLike(blogId, visitorId): Promise<LikeResult> {
    const client = createAdminClient();
    const existing = await client
      .from("blog_likes")
      .select("blog_id")
      .eq("blog_id", blogId)
      .eq("visitor_id", visitorId)
      .maybeSingle();

    let liked: boolean;
    if (existing.data) {
      await client.from("blog_likes").delete().eq("blog_id", blogId).eq("visitor_id", visitorId);
      liked = false;
    } else {
      await client.from("blog_likes").insert({ blog_id: blogId, visitor_id: visitorId });
      liked = true;
    }

    const { count } = await client
      .from("blog_likes")
      .select("blog_id", { count: "exact", head: true })
      .eq("blog_id", blogId);
    return { liked, count: count ?? 0 };
  },

  async toggleBookmark(blogId, visitorId): Promise<BookmarkResult> {
    const client = createAdminClient();
    const existing = await client
      .from("blog_bookmarks")
      .select("blog_id")
      .eq("blog_id", blogId)
      .eq("visitor_id", visitorId)
      .maybeSingle();

    let bookmarked: boolean;
    if (existing.data) {
      await client.from("blog_bookmarks").delete().eq("blog_id", blogId).eq("visitor_id", visitorId);
      bookmarked = false;
    } else {
      await client.from("blog_bookmarks").insert({ blog_id: blogId, visitor_id: visitorId });
      bookmarked = true;
    }
    return { bookmarked };
  },

  async listComments(blogId) {
    const { data, error } = await (await createServerClient())
      .from("comments")
      .select("id, blog_id, parent_id, author_name, content, created_at")
      .eq("blog_id", blogId)
      .eq("status", "approved")
      .is("deleted_at", null)
      .order("created_at", { ascending: true });

    if (error) throw new Error(`listComments failed: ${error.message}`);
    return (data ?? []).map<BlogComment>((c) => ({
      id: c.id,
      blogId: c.blog_id,
      parentId: c.parent_id ?? undefined,
      authorName: c.author_name,
      content: c.content,
      createdAt: c.created_at,
    }));
  },

  async createComment(input) {
    const { data, error } = await createAdminClient()
      .from("comments")
      .insert({
        blog_id: input.blogId,
        parent_id: input.parentId ?? null,
        author_name: input.authorName,
        author_email: input.authorEmail,
        content: input.content,
        status: "pending",
      })
      .select("id, blog_id, parent_id, author_name, content, created_at")
      .single();

    if (error) throw new Error(`createComment failed: ${error.message}`);
    return {
      id: data.id,
      blogId: data.blog_id,
      parentId: data.parent_id ?? undefined,
      authorName: data.author_name,
      content: data.content,
      createdAt: data.created_at,
    };
  },

  async updateCommentStatus(commentId, status) {
    const { data, error } = await createAdminClient()
      .from("comments")
      .update({ status })
      .eq("id", commentId)
      .select("id, blog_id, parent_id, author_name, content, created_at")
      .maybeSingle();

    if (error) throw new Error(`updateCommentStatus failed: ${error.message}`);
    if (!data) return null;
    return {
      id: data.id,
      blogId: data.blog_id,
      parentId: data.parent_id ?? undefined,
      authorName: data.author_name,
      content: data.content,
      createdAt: data.created_at,
    };
  },

  // --- Comments (admin moderation) -------------------------------------------

  async listAllComments() {
    const { data, error } = await createAdminClient()
      .from("comments")
      .select("id, blog_id, parent_id, author_name, author_email, content, status, created_at, blog:blogs(title)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`listAllComments failed: ${error.message}`);
    return (data ?? []).map<AdminComment>((c) => ({
      id: c.id,
      blogId: c.blog_id,
      blogTitle: (c.blog as unknown as { title?: string } | null)?.title ?? "Unknown",
      parentId: c.parent_id ?? undefined,
      authorName: c.author_name,
      authorEmail: c.author_email,
      content: c.content,
      status: c.status as AdminComment["status"],
      createdAt: c.created_at,
    }));
  },

  async deleteComment(id) {
    const { error } = await createAdminClient().from("comments").delete().eq("id", id);
    if (error) throw new Error(`deleteComment failed: ${error.message}`);
    return true;
  },

  async replyComment({ commentId, content }) {
    const parent = await createAdminClient()
      .from("comments")
      .select("blog_id")
      .eq("id", commentId)
      .maybeSingle();
    if (!parent.data) return null;
    const { data, error } = await createAdminClient()
      .from("comments")
      .insert({
        blog_id: parent.data.blog_id,
        parent_id: commentId,
        author_name: "Vizo Tool Team",
        author_email: "team@vizotool.com",
        content,
        status: "approved",
      })
      .select("id, blog_id, parent_id, author_name, content, created_at")
      .single();
    if (error) throw new Error(`replyComment failed: ${error.message}`);
    return {
      id: data.id,
      blogId: data.blog_id,
      parentId: data.parent_id ?? undefined,
      authorName: data.author_name,
      content: data.content,
      createdAt: data.created_at,
    };
  },

  async subscribeNewsletter(email, source = "blog"): Promise<NewsletterResult> {
    const client = createAdminClient();
    const existing = await client
      .from("newsletter")
      .select("id, subscribed")
      .eq("email", email)
      .maybeSingle();

    if (existing.data) {
      if (existing.data.subscribed) {
        return { subscribed: true, message: "You are already subscribed." };
      }
      await client.from("newsletter").update({ subscribed: true, unsubscribed_at: null }).eq("id", existing.data.id);
      return { subscribed: true, message: "Welcome back — you are subscribed again." };
    }

    const { error } = await client.from("newsletter").insert({ email, source });
    if (error) return { subscribed: false, message: "Could not subscribe. Please try again." };
    return { subscribed: true, message: "Subscribed successfully." };
  },

  // --- Newsletter (admin) ------------------------------------------------------

  async listNewsletterSubscribers() {
    const { data, error } = await createAdminClient()
      .from("newsletter")
      .select("id, email, source, subscribed, created_at, unsubscribed_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`listNewsletterSubscribers failed: ${error.message}`);
    return (data ?? []).map<NewsletterSubscriber>((s) => ({
      id: s.id,
      email: s.email,
      source: s.source,
      subscribed: s.subscribed,
      createdAt: s.created_at,
      unsubscribedAt: s.unsubscribed_at ?? undefined,
    }));
  },

  async deleteNewsletterSubscriber(id) {
    const { error } = await createAdminClient().from("newsletter").delete().eq("id", id);
    if (error) throw new Error(`deleteNewsletterSubscriber failed: ${error.message}`);
    return true;
  },

  // --- Settings -------------------------------------------------------------

  async getSettings(keys) {
    const client = createAdminClient();
    let query = client.from("settings").select("key, value");
    if (keys?.length) query = query.in("key", keys);
    const { data, error } = await query;
    if (error) throw new Error(`getSettings failed: ${error.message}`);
    const result: Record<string, unknown> = {};
    for (const row of (data ?? []) as { key: string; value: Json }[]) {
      const parsed = isRecord(row.value) ? (row.value as { value?: unknown }).value : row.value;
      result[row.key] = parsed !== undefined ? parsed : row.value;
    }
    return result;
  },

  async upsertSetting(input) {
    const client = createAdminClient();
    const existing = await client.from("settings").select("key").eq("key", input.key).maybeSingle();

    const fields = {
      value: input.value as Json,
      ...(input.description !== undefined ? { description: input.description } : {}),
    };

    // Update-then-insert so an existing row's description is never wiped.
    const { error } = existing.data
      ? await client.from("settings").update(fields).eq("key", input.key)
      : await client.from("settings").insert({ key: input.key, ...fields });

    if (error) throw new Error(`upsertSetting failed: ${error.message}`);
  },
};
