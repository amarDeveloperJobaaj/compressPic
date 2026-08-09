/**
 * Content migration — plan builder (PURE).
 *
 * Detects every existing blog post + guide from the current data source
 * (lib/blog/data.ts — the only content store; no MDX/JSON files exist) and
 * maps it to database-ready rows WITHOUT changing anything:
 *
 *   - slugs are preserved verbatim (never regenerated)
 *   - titles, subtitles, excerpts, authors, categories, tags preserved
 *   - published/updated dates preserved (ISO)
 *   - SEO overrides preserved (snake_case for the `seo` JSONB column)
 *   - cover images preserved (same-origin /og URLs are stored as-is;
 *     no storage upload is required for the current corpus)
 *   - read counts, featured/trending/editors-pick flags preserved
 *
 * This module imports NO database code, so it can be run anywhere
 * (`npx tsx scripts/migrate-blogs.ts --dry-run`) to preview the migration.
 */
import { slugify } from "./utils";
import type { Json } from "../supabase/database.types";
import type { BlogPost } from "./types";
import { BLOG_CATEGORIES, BLOG_POSTS } from "./data";

// ---------------------------------------------------------------------------
// Plan types
// ---------------------------------------------------------------------------

export interface MigrationPost {
  // Identity — never changed by the migration
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  cover_url: string | null;
  cover_alt: string;
  content: Json;
  status: "draft" | "published";
  featured: boolean;
  trending: boolean;
  editors_pick: boolean;
  read_count: number;
  seo: Record<string, unknown>;
  published_at: string;
  updated_at: string;
  // Relations (resolved by name/slug during the run)
  authorName: string;
  authorRole: string;
  categoryName: string;
  categorySlug: string;
  tags: string[];
}

export interface MigrationSummary {
  posts: number;
  guides: number;
  published: number;
  drafts: number;
  categories: number;
  tags: number;
  authors: number;
  toolEmbeds: number;
  faqBlocks: number;
  codeBlocks: number;
  imageBlocks: number;
  totalBlocks: number;
  oldestPost: string;
  newestPost: string;
  /** Every slug that will be imported (must equal the live URL slugs). */
  slugs: string[];
  duplicateSlugs: number;
  missingCategories: string[];
}

export interface MigrationPlan {
  source: string;
  generatedAt: string;
  authors: { name: string; slug: string; role: string }[];
  categories: { name: string; slug: string; description: string }[];
  tags: { name: string; slug: string }[];
  posts: MigrationPost[];
  summary: MigrationSummary;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** BlogPost.seo (camelCase, optional) -> snake_case JSONB row. */
function seoToDb(post: BlogPost): Record<string, unknown> {
  const seo = post.seo;
  if (!seo) return {};
  return {
    ...(seo.metaTitle ? { meta_title: seo.metaTitle } : {}),
    ...(seo.metaDescription ? { meta_description: seo.metaDescription } : {}),
    ...(seo.keywords?.length ? { keywords: seo.keywords } : {}),
    ...(seo.ogImage ? { og_image: seo.ogImage } : {}),
    ...(seo.twitterImage ? { twitter_image: seo.twitterImage } : {}),
  };
}

/** Resolve a category NAME ("Image Editing") to its canonical slug. */
function resolveCategorySlug(name: string): string {
  const match = BLOG_CATEGORIES.find(
    (c) => c.name.toLowerCase() === name.trim().toLowerCase()
  );
  return match?.slug ?? (slugify(name) || "general");
}

/** Count blocks by type across a post. */
function blockCounts(post: BlogPost) {
  let toolEmbeds = 0;
  let faqBlocks = 0;
  let codeBlocks = 0;
  let imageBlocks = 0;
  for (const block of post.content) {
    switch (block.type) {
      case "toolEmbed":
      case "toolCta":
      case "relatedToolCard":
        toolEmbeds += 1;
        break;
      case "faq":
        faqBlocks += 1;
        break;
      case "code":
      case "terminal":
        codeBlocks += 1;
        break;
      case "image":
      case "gallery":
      case "beforeAfter":
        imageBlocks += 1;
        break;
      default:
        break;
    }
  }
  return { toolEmbeds, faqBlocks, codeBlocks, imageBlocks };
}

// ---------------------------------------------------------------------------
// Plan builder
// ---------------------------------------------------------------------------

export function buildMigrationPlan(): MigrationPlan {
  // --- Detect content -------------------------------------------------------
  const posts = [...BLOG_POSTS].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));

  // Authors (deduped by slugified name — seeds default to "Amar Lodhi").
  const authorMap = new Map<string, { name: string; slug: string; role: string }>();
  for (const post of posts) {
    const slug = slugify(post.author) || "author";
    if (!authorMap.has(slug)) {
      authorMap.set(slug, { name: post.author, slug, role: post.authorRole ?? "Author" });
    }
  }

  // Categories (canonical taxonomy, descriptions preserved).
  const categories = BLOG_CATEGORIES.map((c) => ({
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
  }));

  // Tags (deduped across all posts, by slug).
  const tagMap = new Map<string, { name: string; slug: string }>();
  for (const post of posts) {
    for (const tag of post.tags) {
      const slug = slugify(tag);
      if (!slug) continue;
      if (!tagMap.has(slug)) tagMap.set(slug, { name: tag, slug });
    }
  }

  // --- Map posts (nothing renamed, nothing dropped) -------------------------
  const mapped: MigrationPost[] = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    subtitle: post.subtitle,
    excerpt: post.excerpt,
    cover_url: post.cover || null,
    cover_alt: post.coverAlt,
    content: post.content as unknown as Json,
    status: post.status === "draft" ? "draft" : "published",
    featured: post.featured,
    trending: post.trending,
    editors_pick: post.editorsPick,
    read_count: post.readCount,
    seo: seoToDb(post),
    published_at: post.publishedAt,
    updated_at: post.updatedAt,
    authorName: post.author,
    authorRole: post.authorRole ?? "Founder, Vizo Tool",
    categoryName: post.category,
    categorySlug: resolveCategorySlug(post.category),
    tags: post.tags,
  }));

  // --- Summary --------------------------------------------------------------
  const slugSet = new Set<string>();
  const missingCategories = new Set<string>();
  let toolEmbeds = 0;
  let faqBlocks = 0;
  let codeBlocks = 0;
  let imageBlocks = 0;
  let totalBlocks = 0;

  for (const post of posts) {
    slugSet.add(post.slug);
    if (!BLOG_CATEGORIES.some((c) => c.slug === resolveCategorySlug(post.category))) {
      missingCategories.add(post.category);
    }
    const counts = blockCounts(post);
    toolEmbeds += counts.toolEmbeds;
    faqBlocks += counts.faqBlocks;
    codeBlocks += counts.codeBlocks;
    imageBlocks += counts.imageBlocks;
    totalBlocks += post.content.length;
  }

  const summary: MigrationSummary = {
    posts: posts.length,
    guides: posts.filter((p) => resolveCategorySlug(p.category) === "guides").length,
    published: posts.filter((p) => p.status !== "draft").length,
    drafts: posts.filter((p) => p.status === "draft").length,
    categories: categories.length,
    tags: tagMap.size,
    authors: authorMap.size,
    toolEmbeds,
    faqBlocks,
    codeBlocks,
    imageBlocks,
    totalBlocks,
    oldestPost: posts[0]?.slug ?? "",
    newestPost: posts[posts.length - 1]?.slug ?? "",
    slugs: [...slugSet].sort(),
    duplicateSlugs: posts.length - slugSet.size,
    missingCategories: [...missingCategories],
  };

  return {
    source: "lib/blog/data.ts (BLOG_POSTS + BLOG_CATEGORIES)",
    generatedAt: new Date().toISOString(),
    authors: [...authorMap.values()].sort((a, b) => a.slug.localeCompare(b.slug)),
    categories,
    tags: [...tagMap.values()].sort((a, b) => a.slug.localeCompare(b.slug)),
    posts: mapped,
    summary,
  };
}

