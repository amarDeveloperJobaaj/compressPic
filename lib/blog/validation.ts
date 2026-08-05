/**
 * Zod validation schemas for the blog backend.
 *
 * These mirror lib/blog/types.ts exactly — the schemas are the single source
 * of truth for what the server actions accept from the client (and what the
 * admin editor must produce). Parsing happens server-side in the actions;
 * nothing from the client is ever written to the database unvalidated.
 */
import { z } from "zod";

const blockToneSchema = z.enum(["info", "success", "warning", "error", "tip"]);
export const tableKindSchema = z.enum(["comparison", "features", "pricing"]);

/**
 * Post/comment ids: the Supabase repository uses UUIDs, the memory repository
 * uses "post-<timestamp>-<rand>" ids. Accept any non-empty id so the actions
 * work in both storage modes.
 */
const entityId = z.string().min(1).max(64);

/** Full ISO datetime ("2026-08-01T10:00:00Z") or a bare date ("2026-08-01"). */
const isoDate = z
  .string()
  .datetime({ offset: true })
  .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use an ISO date (YYYY-MM-DD)."));

// ---------------------------------------------------------------------------
// Block model (BlogBlock union — must stay in sync with lib/blog/types.ts)
// ---------------------------------------------------------------------------

export const blogBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("heading"), level: z.union([z.literal(2), z.literal(3), z.literal(4)]), text: z.string().min(1).max(300) }),
  z.object({ type: z.literal("paragraph"), text: z.string().min(1).max(20000) }),
  z.object({ type: z.literal("quote"), text: z.string().min(1).max(5000), cite: z.string().max(200).optional() }),
  z.object({ type: z.literal("code"), code: z.string().min(1).max(100000), language: z.string().max(40).optional() }),
  z.object({ type: z.literal("terminal"), lines: z.string().min(1).max(100000) }),
  z.object({ type: z.literal("alert"), tone: blockToneSchema, title: z.string().max(200), text: z.string().min(1).max(10000) }),
  z.object({ type: z.literal("callout"), title: z.string().max(300), text: z.string().min(1).max(10000) }),
  z.object({ type: z.literal("checklist"), items: z.array(z.string().min(1).max(2000)).min(1).max(100) }),
  z.object({ type: z.literal("list"), ordered: z.boolean(), items: z.array(z.string().min(1).max(5000)).min(1).max(200) }),
  z.object({
    type: z.literal("table"),
    kind: tableKindSchema,
    columns: z.array(z.string().min(1).max(200)).min(1).max(12),
    rows: z.array(z.array(z.string().max(5000)).max(12)).min(0).max(200),
  }),
  z.object({ type: z.literal("prosCons"), pros: z.array(z.string().min(1).max(2000)).min(1).max(50), cons: z.array(z.string().min(1).max(2000)).min(1).max(50) }),
  z.object({ type: z.literal("image"), src: z.string().min(1).max(2000), alt: z.string().max(500), caption: z.string().max(500).optional() }),
  z.object({ type: z.literal("gallery"), images: z.array(z.object({ src: z.string().min(1).max(2000), alt: z.string().max(500) })).min(1).max(50) }),
  z.object({
    type: z.literal("beforeAfter"),
    before: z.string().min(1).max(2000),
    after: z.string().min(1).max(2000),
    labelBefore: z.string().max(100).optional(),
    labelAfter: z.string().max(100).optional(),
  }),
  z.object({ type: z.literal("timeline"), items: z.array(z.object({ title: z.string().min(1).max(300), text: z.string().max(5000) })).min(1).max(100) }),
  z.object({ type: z.literal("steps"), items: z.array(z.object({ title: z.string().min(1).max(300), text: z.string().max(5000) })).min(1).max(20) }),
  z.object({ type: z.literal("accordion"), items: z.array(z.object({ title: z.string().min(1).max(300), text: z.string().max(10000) })).min(1).max(50) }),
  z.object({ type: z.literal("faq"), items: z.array(z.object({ question: z.string().min(1).max(500), answer: z.string().min(1).max(10000) })).min(1).max(50) }),
  z.object({ type: z.literal("stats"), items: z.array(z.object({ value: z.string().min(1).max(100), label: z.string().min(1).max(200) })).min(1).max(12) }),
  z.object({ type: z.literal("chartPlaceholder"), title: z.string().max(300), note: z.string().max(1000) }),
  z.object({ type: z.literal("video"), url: z.string().url(), caption: z.string().max(500).optional() }),
  z.object({ type: z.literal("toolEmbed"), toolSlug: z.string().min(1).max(100) }),
  z.object({ type: z.literal("downloadCta"), title: z.string().max(300), text: z.string().max(2000), href: z.string().max(2000), buttonLabel: z.string().max(100) }),
  z.object({ type: z.literal("toolCta"), toolSlug: z.string().min(1).max(100), title: z.string().max(300), text: z.string().max(2000) }),
  z.object({ type: z.literal("relatedToolCard"), toolSlug: z.string().min(1).max(100) }),
  z.object({ type: z.literal("authorCard") }),
  z.object({ type: z.literal("newsletterCard") }),
  z.object({ type: z.literal("divider") }),
  z.object({ type: z.literal("customHtml"), html: z.string().min(1).max(200000) }),
  // Phase-2 block types (must stay in sync with lib/blog/types.ts)
  z.object({ type: z.literal("tabs"), tabs: z.array(z.object({ title: z.string().min(1).max(200), text: z.string().min(1).max(20000) })).min(1).max(12) }),
  z.object({ type: z.literal("button"), label: z.string().min(1).max(100), href: z.string().min(1).max(2000), variant: z.enum(["primary", "secondary", "outline"]).optional() }),
  z.object({ type: z.literal("tweetEmbed"), url: z.string().url() }),
  z.object({ type: z.literal("githubEmbed"), url: z.string().url() }),
  z.object({ type: z.literal("mermaid"), code: z.string().min(1).max(50000) }),
  z.object({ type: z.literal("math"), formula: z.string().min(1).max(5000) }),
]);

export const blogContentSchema = z.array(blogBlockSchema).max(500);

// ---------------------------------------------------------------------------
// Post input (create / update — BlogInput shape)
// ---------------------------------------------------------------------------

const urlOrPath = z.union([z.string().url(), z.string().startsWith("/")]);

export const blogSeoSchema = z
  .object({
    metaTitle: z.string().max(200).optional(),
    metaDescription: z.string().max(400).optional(),
    keywords: z.array(z.string().max(60)).max(30).optional(),
    ogImage: urlOrPath.optional(),
    twitterImage: urlOrPath.optional(),
  })
  .optional();

export const blogInputSchema = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case."),
  title: z.string().min(1).max(200),
  subtitle: z.string().max(400).optional(),
  excerpt: z.string().max(500).optional(),
  cover: urlOrPath.optional(),
  coverAlt: z.string().max(300).optional(),
  category: z.string().min(1).max(100).optional(),
  tags: z.array(z.string().min(1).max(60)).max(20).optional(),
  author: z.string().min(1).max(100).optional(),
  authorRole: z.string().max(120).optional(),
  publishedAt: isoDate.optional(),
  updatedAt: isoDate.optional(),
  status: z.enum(["published", "draft", "scheduled", "archived"]).optional(),
  featured: z.boolean().optional(),
  trending: z.boolean().optional(),
  editorsPick: z.boolean().optional(),
  pinned: z.boolean().optional(),
  readCount: z.number().int().nonnegative().optional(),
  seo: blogSeoSchema,
  content: blogContentSchema.optional(),
});

export type BlogInputValidated = z.infer<typeof blogInputSchema>;

// ---------------------------------------------------------------------------
// Engagement / content inputs
// ---------------------------------------------------------------------------

/** Client-generated visitor id (stored in a cookie) for likes/bookmarks/views. */
export const visitorIdSchema = z.string().min(8).max(64);

export const commentInputSchema = z.object({
  blogId: entityId,
  parentId: entityId.optional(),
  authorName: z.string().min(1).max(80),
  authorEmail: z.string().email().max(200),
  content: z.string().min(1).max(2000),
});

export const newsletterInputSchema = z.object({
  email: z.string().email().max(200),
  source: z.string().max(60).default("blog"),
});

export const likeInputSchema = z.object({
  blogId: entityId,
  visitorId: visitorIdSchema,
});

export const bookmarkInputSchema = z.object({
  blogId: entityId,
  visitorId: visitorIdSchema,
});

export const viewInputSchema = z.object({
  blogId: entityId,
  visitorId: visitorIdSchema.optional(),
});

export const settingsInputSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.unknown(),
  description: z.string().max(300).optional(),
});

export const authorInputSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().max(120),
  role: z.string().max(120).optional(),
  bio: z.string().max(1000).optional(),
  avatarUrl: urlOrPath.optional(),
  email: z.string().email().max(200).optional(),
  twitter: z.string().url().max(500).optional(),
  website: z.string().url().max(500).optional(),
  instagram: z.string().url().max(500).optional(),
  linkedin: z.string().url().max(500).optional(),
});

export const categoryInputSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().max(120),
  description: z.string().max(500).optional(),
  seo: z
    .object({
      metaTitle: z.string().max(200).optional(),
      metaDescription: z.string().max(400).optional(),
      keywords: z.array(z.string().max(60)).max(30).optional(),
    })
    .optional(),
  featuredImage: urlOrPath.optional(),
});

export const tagInputSchema = z.object({
  name: z.string().min(1).max(60),
  slug: z.string().max(120),
});

export type CategoryInputValidated = z.infer<typeof categoryInputSchema>;
export type TagInputValidated = z.infer<typeof tagInputSchema>;
export type AuthorInputValidated = z.infer<typeof authorInputSchema>;
