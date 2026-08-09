/**
 * Blog content model — the single source of truth for every post.
 *
 * Kept dependency-free (pure types + plain data) so it can be imported by
 * server components (SSG/SSR), client components (explorer, editor) and the
 * future Supabase data layer without pulling any runtime code.
 */

export type BlockTone = "info" | "success" | "warning" | "error" | "tip";

export type TableKind = "comparison" | "features" | "pricing";

/** Every rich block the blog engine knows how to render. */
export type BlogBlock =
  | { type: "heading"; level: 2 | 3 | 4; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "code"; code: string; language?: string }
  | { type: "terminal"; lines: string }
  | { type: "alert"; tone: BlockTone; title: string; text: string }
  | { type: "callout"; title: string; text: string }
  | { type: "checklist"; items: string[] }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; kind: TableKind; columns: string[]; rows: string[][] }
  | { type: "prosCons"; pros: string[]; cons: string[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "gallery"; images: { src: string; alt: string }[] }
  | { type: "beforeAfter"; before: string; after: string; labelBefore?: string; labelAfter?: string }
  | { type: "timeline"; items: { title: string; text: string }[] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "accordion"; items: { title: string; text: string }[] }
  | { type: "faq"; items: { question: string; answer: string }[] }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "chartPlaceholder"; title: string; note: string }
  | { type: "video"; url: string; caption?: string }
  | { type: "toolEmbed"; toolSlug: string }
  | { type: "downloadCta"; title: string; text: string; href: string; buttonLabel: string }
  | { type: "toolCta"; toolSlug: string; title: string; text: string }
  | { type: "relatedToolCard"; toolSlug: string }
  | { type: "authorCard" }
  | { type: "newsletterCard" }
  | { type: "divider" }
  | { type: "customHtml"; html: string }
  // Developer-CMS additions (Phase 2): tabs, buttons, embeds, diagrams & math
  | { type: "tabs"; tabs: { title: string; text: string }[] }
  | { type: "button"; label: string; href: string; variant?: "primary" | "secondary" | "outline" }
  | { type: "tweetEmbed"; url: string }
  | { type: "githubEmbed"; url: string }
  | { type: "mermaid"; code: string }
  | { type: "math"; formula: string };

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  /** Absolute path to the cover image (same-origin OG image by default). */
  cover: string;
  coverAlt: string;
  category: string;
  tags: string[];
  author: string;
  authorRole?: string;
  /** Slugified author name — links posts to /blog/author/[slug]. */
  authorSlug?: string;
  publishedAt: string; // ISO date
  updatedAt: string; // ISO date
  readTime: string; // e.g. "6 min read"
  status: "published" | "draft" | "scheduled" | "archived";
  featured: boolean;
  trending: boolean;
  editorsPick: boolean;
  /** Pinned to the top of the admin/featured listings (Phase 2). */
  pinned?: boolean;
  /** Soft-delete flag (admin trash). Never surfaced on public pages. */
  deleted?: boolean;
  /** Simulated read count used by the "Most Read" filter. */
  readCount: number;
  /** Optional SEO overrides (defaults derive from the post). */
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
    twitterImage?: string;
  };
  content: BlogBlock[];
}

export interface BlogAuthor {
  name: string;
  role: string;
  bio: string;
  /** Admin-only fields — present when read from the database/author store. */
  id?: string;
  slug?: string;
  avatarUrl?: string;
  email?: string;
  twitter?: string;
  website?: string;
  instagram?: string;
  linkedin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogCategory {
  slug: string;
  name: string;
  description: string;
  /** Present on database-backed reads (admin management). */
  id?: string;
}

/** Blog-friendly subset of the tools registry (server-safe, no lucide imports). */
export interface BlogToolRef {
  slug: string;
  name: string;
  href: string;
  description: string;
  tagline: string;
}

/** Lightweight post shape for list pages — drops the heavy content blocks. */
export type BlogSummary = Omit<BlogPost, "content">;

/** A comment on a post (public shape — author email is never exposed). */
export interface BlogComment {
  id: string;
  blogId: string;
  parentId?: string;
  authorName: string;
  content: string;
  createdAt: string;
}

/** Aggregate dashboard statistics (admin). */
export interface BlogStats {
  total: number;
  published: number;
  drafts: number;
  scheduled: number;
  trending: number;
  featured: number;
  categories: number;
  totalReads: number;
  // Phase-2 additions (populated by the repository; absent on the memory seed)
  tags?: number;
  authors?: number;
  views?: number;
  comments?: number;
  pendingComments?: number;
  subscribers?: number;
  trashed?: number;
}

/** Admin comment row — full moderation data (email + status + blog title). */
export interface AdminComment {
  id: string;
  blogId: string;
  blogTitle: string;
  parentId?: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: "pending" | "approved" | "spam";
  createdAt: string;
}

/** Newsletter subscriber row (admin). */
export interface NewsletterSubscriber {
  id: string;
  email: string;
  source: string;
  subscribed: boolean;
  createdAt: string;
  unsubscribedAt?: string;
}
