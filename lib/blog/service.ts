import "server-only";

import { ALL_TOOLS } from "@/lib/tools";
import { BLOG_CATEGORIES, BLOG_POSTS } from "./data";
import { estimateReadTime, slugify } from "./utils";
import type { BlogStats } from "./types";
import type {
  BlogBlock,
  BlogCategory,
  BlogPost,
  BlogSummary,
  BlogToolRef,
} from "./types";

/**
 * Blog repository — the ONLY file the UI talks to.
 *
 * Phase 1 ships a module-level in-memory store seeded from `data.ts` so every
 * page (public + admin) works end-to-end. To migrate to Supabase later you
 * replace the bodies of these functions with Supabase queries — the signatures
 * stay identical, so NO UI or route changes are required.
 *
 * NOTE: in-memory mutations do not survive a server restart or scale across
 * instances. That is intentional for the dummy phase; see
 * docs/supabase-migration.md.
 */

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

const store: BlogPost[] = [...BLOG_POSTS];

// ---------------------------------------------------------------------------
// Serialization helpers
// ---------------------------------------------------------------------------

export type { BlogSummary } from "./types";

export function toSummary(post: BlogPost): BlogSummary {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { content: _content, ...rest } = post;
  return { ...rest, authorSlug: rest.authorSlug ?? slugify(rest.author) };
}

// ---------------------------------------------------------------------------
// Reads (public + admin)
// ---------------------------------------------------------------------------

export function getAllPosts(): BlogPost[] {
  return store.filter((p) => !p.deleted);
}

export function getPublishedPosts(): BlogPost[] {
  return store
    .filter((p) => p.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getDraftPosts(): BlogPost[] {
  return store
    .filter((p) => p.status === "draft")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return store.find((p) => p.slug === slug);
}

export function getPostById(id: string): BlogPost | undefined {
  return store.find((p) => p.id === id);
}

export function getPostsByCategory(categorySlug: string): BlogPost[] {
  const cat = BLOG_CATEGORIES.find((c) => c.slug === categorySlug);
  return store
    .filter((p) => p.status === "published" && p.category === (cat?.name ?? categorySlug))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPostsByTag(tag: string): BlogPost[] {
  const normalized = tag.toLowerCase();
  return store
    .filter(
      (p) =>
        p.status === "published" &&
        p.tags.some((t) => t.toLowerCase() === normalized)
    )
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** Instant search across title, slug, category, tags and content text. */
export function searchPosts(query: string): BlogPost[] {
  const q = query.trim().toLowerCase();
  if (!q) return getPublishedPosts();
  const haystack = (p: BlogPost) =>
    [
      p.title,
      p.slug,
      p.category,
      p.tags.join(" "),
      p.subtitle,
      p.excerpt,
      ...p.content
        .map((b) => blockText(b))
        .filter(Boolean),
    ]
      .join(" ")
      .toLowerCase();
  return getPublishedPosts().filter((p) => haystack(p).includes(q));
}

function blockText(block: BlogBlock): string {
  switch (block.type) {
    case "heading":
    case "paragraph":
    case "quote":
    case "alert":
    case "callout":
      return block.text;
    case "customHtml":
      return block.html;
    case "code":
      return block.code;
    case "terminal":
      return block.lines;
    case "checklist":
    case "list":
      return block.items.join(" ");
    case "table":
      return block.rows.flat().join(" ");
    case "prosCons":
      return [...block.pros, ...block.cons].join(" ");
    case "timeline":
    case "steps":
    case "accordion":
      return block.items.map((i) => `${i.title} ${i.text}`).join(" ");
    case "faq":
      return block.items.map((i) => `${i.question} ${i.answer}`).join(" ");
    case "stats":
      return block.items.map((i) => `${i.value} ${i.label}`).join(" ");
    case "tabs":
      return block.tabs.map((t) => `${t.title} ${t.text}`).join(" ");
    case "button":
      return block.label;
    case "tweetEmbed":
    case "githubEmbed":
      return block.url;
    case "mermaid":
      return block.code;
    case "math":
      return block.formula;
    case "video":
    case "image":
    case "gallery":
    case "beforeAfter":
    case "chartPlaceholder":
    case "toolEmbed":
    case "downloadCta":
    case "toolCta":
    case "relatedToolCard":
    case "authorCard":
    case "newsletterCard":
    case "divider":
      return "";
  }
}

export function getCategories(): (BlogCategory & { count: number })[] {
  const counts = new Map<string, number>();
  for (const p of store) {
    if (p.status !== "published") continue;
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }
  return BLOG_CATEGORIES.map((c) => ({ ...c, count: counts.get(c.name) ?? 0 }));
}

export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}

export function getTags(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of store) {
    if (p.status !== "published") continue;
    for (const t of p.tags) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// ---------------------------------------------------------------------------
// Curated collections
// ---------------------------------------------------------------------------

export function getFeaturedPosts(): BlogSummary[] {
  return getPublishedPosts().filter((p) => p.featured).slice(0, 3);
}

export function getTrendingPosts(): BlogSummary[] {
  return [...getPublishedPosts()]
    .sort((a, b) => Number(b.trending) - Number(a.trending) || b.readCount - a.readCount)
    .slice(0, 4);
}

export function getLatestPosts(): BlogSummary[] {
  return getPublishedPosts().slice(0, 6);
}

export function getEditorsPicks(): BlogSummary[] {
  return getPublishedPosts().filter((p) => p.editorsPick).slice(0, 3);
}

export function getMostRead(): BlogSummary[] {
  return [...getPublishedPosts()].sort((a, b) => b.readCount - a.readCount).slice(0, 4);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogSummary[] {
  const sameCategory = getPublishedPosts().filter(
    (p) => p.id !== post.id && p.category === post.category
  );
  const sharedTags = getPublishedPosts()
    .filter((p) => p.id !== post.id && p.tags.some((t) => post.tags.includes(t)))
    .sort((a, b) => b.readCount - a.readCount);
  const seen = new Set<string>();
  const related = [...sameCategory, ...sharedTags].filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
  return related.slice(0, limit);
}

export function getPrevNext(post: BlogPost): { prev?: BlogSummary; next?: BlogSummary } {
  const published = getPublishedPosts();
  const index = published.findIndex((p) => p.id === post.id);
  if (index === -1) return {};
  return {
    prev: index > 0 ? toSummary(published[index - 1]) : undefined,
    next: index < published.length - 1 ? toSummary(published[index + 1]) : undefined,
  };
}

// ---------------------------------------------------------------------------
// Related tools (embedded in the post + popular fillers)
// ---------------------------------------------------------------------------

/** Map slug -> BlogToolRef, derived from the server-safe tools registry. */
const TOOL_REF_MAP = new Map<string, BlogToolRef>(
  ALL_TOOLS.map((t) => [
    t.slug,
    { slug: t.slug, name: t.name, href: t.href, description: t.description, tagline: t.tagline },
  ])
);

export function getToolRef(slug: string): BlogToolRef | undefined {
  return TOOL_REF_MAP.get(slug);
}

/** Tool slugs referenced by a post's content blocks (embeds, CTAs, cards). */
export function getEmbeddedToolSlugs(post: BlogPost): string[] {
  const slugs = new Set<string>();
  for (const block of post.content) {
    if (block.type === "toolEmbed" || block.type === "toolCta" || block.type === "relatedToolCard") {
      slugs.add(block.toolSlug);
    }
  }
  return [...slugs];
}

export function getRelatedTools(post: BlogPost, limit = 4): BlogToolRef[] {
  const embedded = getEmbeddedToolSlugs(post)
    .map((slug) => getToolRef(slug))
    .filter((t): t is BlogToolRef => Boolean(t));
  const popular = ["compress", "remove-background", "json-formatter", "resize", "qr-code-generator"]
    .map((slug) => getToolRef(slug))
    .filter((t): t is BlogToolRef => Boolean(t));
  const seen = new Set<string>();
  const tools = [...embedded, ...popular].filter((t) => {
    if (seen.has(t.slug)) return false;
    seen.add(t.slug);
    return true;
  });
  return tools.slice(0, limit);
}

// ---------------------------------------------------------------------------
// Admin mutations
// ---------------------------------------------------------------------------

export interface BlogInput {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  cover?: string;
  coverAlt?: string;
  category?: string;
  tags?: string[];
  author?: string;
  authorRole?: string;
  publishedAt?: string;
  updatedAt?: string;
  status?: "published" | "draft" | "scheduled" | "archived";
  featured?: boolean;
  trending?: boolean;
  editorsPick?: boolean;
  pinned?: boolean;
  readCount?: number;
  seo?: BlogPost["seo"];
  content?: BlogBlock[];
}

function ensureValidSlug(slug: string, excludeId?: string): string {
  let candidate = slugify(slug || "untitled-post");
  if (!candidate) candidate = "untitled-post";
  let final = candidate;
  let i = 2;
  while (store.some((p) => p.slug === final && p.id !== excludeId)) {
    final = `${candidate}-${i++}`;
  }
  return final;
}

export function createPost(input: BlogInput): BlogPost {
  const now = new Date().toISOString();
  const content = input.content ?? [];
  const post: BlogPost = {
    id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    slug: ensureValidSlug(input.slug),
    title: input.title || "Untitled post",
    subtitle: input.subtitle ?? "",
    excerpt: input.excerpt ?? "",
    cover: input.cover || `/og?title=${encodeURIComponent(input.title || "Vizo Tool Blog")}`,
    coverAlt: input.coverAlt ?? input.title ?? "Blog cover",
    category: input.category ?? "General",
    tags: input.tags ?? [],
    author: input.author ?? "Amar Lodhi",
    authorRole: input.authorRole ?? "Founder, Vizo Tool",
    publishedAt: input.publishedAt ?? now,
    updatedAt: input.updatedAt ?? now,
    readTime: estimateReadTime(content),
    status: input.status ?? "draft",
    featured: input.featured ?? false,
    trending: input.trending ?? false,
    editorsPick: input.editorsPick ?? false,
    pinned: input.pinned ?? false,
    readCount: input.readCount ?? 0,
    seo: input.seo,
    content,
  };
  store.push(post);
  return post;
}

export function updatePost(id: string, input: BlogInput): BlogPost | undefined {
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  const existing = store[index];
  const merged: BlogPost = {
    ...existing,
    ...input,
    slug: input.slug ? ensureValidSlug(input.slug, id) : existing.slug,
    content: input.content ?? existing.content,
    updatedAt: new Date().toISOString(),
  };
  merged.readTime = estimateReadTime(merged.content);
  merged.cover = merged.cover || `/og?title=${encodeURIComponent(merged.title)}`;
  store[index] = merged;
  return merged;
}

export function deletePost(id: string): boolean {
  // Soft delete: the post stays in the store (so /blog/<slug> 404s are avoided
  // during the trash window) but is flagged + archived and hidden everywhere.
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) return false;
  store[index] = { ...store[index], deleted: true, status: "archived" };
  return true;
}

/** Bring a soft-deleted post back as a draft. */
export function restorePost(id: string): boolean {
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) return false;
  store[index] = { ...store[index], deleted: false, status: "draft" };
  return true;
}

/** Permanently remove a post (only used from the trash view). */
export function purgePost(id: string): boolean {
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}

/** Admin trash list — soft-deleted posts only. */
export function listTrashedPosts(): BlogPost[] {
  return store.filter((p) => p.deleted);
}

export function duplicatePost(id: string): BlogPost | undefined {
  const source = store.find((p) => p.id === id);
  if (!source) return undefined;
  const copy: BlogPost = {
    ...structuredClone(source),
    id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    slug: ensureValidSlug(`${source.slug}-copy`, source.id),
    title: `${source.title} (Copy)`,
    status: "draft",
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.push(copy);
  return copy;
}

export function getBlogStats(): BlogStats {
  const live = store.filter((p) => !p.deleted);
  const published = live.filter((p) => p.status === "published");
  const drafts = live.filter((p) => p.status === "draft");
  const scheduled = live.filter((p) => p.status === "scheduled");
  return {
    total: live.length,
    published: published.length,
    drafts: drafts.length,
    scheduled: scheduled.length,
    trending: published.filter((p) => p.trending).length,
    featured: published.filter((p) => p.featured).length,
    categories: getCategories().length,
    totalReads: published.reduce((sum, p) => sum + p.readCount, 0),
    tags: getTags().length,
    authors: 1,
    trashed: store.length - live.length,
  };
}
