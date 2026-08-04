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
  | { type: "customHtml"; html: string };

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
  publishedAt: string; // ISO date
  updatedAt: string; // ISO date
  readTime: string; // e.g. "6 min read"
  status: "published" | "draft";
  featured: boolean;
  trending: boolean;
  editorsPick: boolean;
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
}

export interface BlogCategory {
  slug: string;
  name: string;
  description: string;
}

/** Blog-friendly subset of the tools registry (server-safe, no lucide imports). */
export interface BlogToolRef {
  slug: string;
  name: string;
  href: string;
  description: string;
  tagline: string;
}
