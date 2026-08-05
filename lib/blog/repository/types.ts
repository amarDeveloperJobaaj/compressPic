/**
 * BlogRepository — the backend contract for every blog data operation.
 *
 * Two implementations exist today:
 *   - memory.ts    : wraps the current in-memory dummy store (lib/blog/service.ts)
 *   - supabase.ts  : the production implementation backed by Supabase
 *
 * The UI keeps importing lib/blog/service.ts (unchanged). When you flip
 * `BLOG_STORAGE=supabase`, the repository factory (index.ts) returns the
 * Supabase implementation and the swap point is a single import inside the
 * service layer — no UI, route or component changes.
 */
import type {
  AdminComment,
  BlogAuthor,
  BlogCategory,
  BlogComment,
  BlogPost,
  BlogStats,
  NewsletterSubscriber,
} from "../types";
import type { BlogSummary } from "../service";
import type { PageMeta } from "../pagination";
import type { PostFilters } from "../search";
import type {
  AuthorInputValidated,
  BlogInputValidated,
  CategoryInputValidated,
  TagInputValidated,
} from "../validation";

export interface LikeResult {
  liked: boolean;
  count: number;
}

export interface BookmarkResult {
  bookmarked: boolean;
}

export interface NewsletterResult {
  subscribed: boolean;
  message: string;
}

export interface PostEngagement {
  likes: number;
  bookmarks: number;
  views: number;
}

export interface BlogRepository {
  // --- Reads (public) -------------------------------------------------------
  getPostBySlug(slug: string): Promise<BlogPost | null>;
  listPublished(filters?: PostFilters): Promise<{ items: BlogSummary[]; meta: PageMeta }>;
  getCategories(): Promise<(BlogCategory & { count: number })[]>;
  getTags(): Promise<{ name: string; count: number }[]>;
  getFeaturedPosts(limit?: number): Promise<BlogSummary[]>;
  getTrendingPosts(limit?: number): Promise<BlogSummary[]>;
  getLatestPosts(limit?: number): Promise<BlogSummary[]>;
  getEditorsPicks(limit?: number): Promise<BlogSummary[]>;
  getMostRead(limit?: number): Promise<BlogSummary[]>;
  getRelatedPosts(post: BlogPost, limit?: number): Promise<BlogSummary[]>;
  getPrevNext(post: BlogPost): Promise<{ prev?: BlogSummary; next?: BlogSummary }>;

  // --- Reads (admin — includes drafts) --------------------------------------
  getPostById(id: string): Promise<BlogPost | null>;
  listDrafts(): Promise<BlogSummary[]>;
  getBlogStats(): Promise<BlogStats>;

  // --- Writes (admin) -------------------------------------------------------
  createPost(input: BlogInputValidated): Promise<BlogPost>;
  updatePost(id: string, input: Partial<BlogInputValidated>): Promise<BlogPost | null>;
  deletePost(id: string): Promise<boolean>;
  duplicatePost(id: string): Promise<BlogPost | null>;

  // --- Engagement (server actions) ------------------------------------------
  recordView(blogId: string, visitorId?: string): Promise<void>;
  toggleLike(blogId: string, visitorId: string): Promise<LikeResult>;
  toggleBookmark(blogId: string, visitorId: string): Promise<BookmarkResult>;
  /** Public engagement counts for a post (likes / bookmarks / views). */
  getPostEngagement(blogId: string): Promise<PostEngagement>;
  listComments(blogId: string): Promise<BlogComment[]>;
  createComment(input: {
    blogId: string;
    parentId?: string;
    authorName: string;
    authorEmail: string;
    content: string;
  }): Promise<BlogComment | null>;
  /** Approve / reject / flag a pending comment (admin). */
  updateCommentStatus(
    commentId: string,
    status: "approved" | "pending" | "spam"
  ): Promise<BlogComment | null>;
  subscribeNewsletter(email: string, source?: string): Promise<NewsletterResult>;

  // --- Settings -------------------------------------------------------------
  /** Fetch site settings; when `keys` is omitted returns all readable keys. */
  getSettings(keys?: string[]): Promise<Record<string, unknown>>;
  /** Upsert a key/value setting (admin only). */
  upsertSetting(input: { key: string; value: unknown; description?: string }): Promise<void>;

  // --- Admin CMS (Phase 2) -------------------------------------------------

  /** Admin blog list — includes drafts/scheduled, supports search + paging. */
  listAdminPosts(input: {
    query?: string;
    status?: "all" | "published" | "draft" | "scheduled";
    page?: number;
    pageSize?: number;
  }): Promise<{ items: BlogSummary[]; meta: PageMeta }>;

  /** Restore a soft-deleted post (back to draft). */
  restorePost(id: string): Promise<boolean>;
  /** Admin trash list. */
  listTrashedPosts(): Promise<BlogSummary[]>;
  /** Permanently delete from trash. */
  purgePost(id: string): Promise<boolean>;

  // --- Categories / Tags / Authors (keyed by unique slug) ------------------

  createCategory(input: CategoryInputValidated): Promise<BlogCategory & { count: number }>;
  updateCategory(
    slug: string,
    input: Partial<CategoryInputValidated>
  ): Promise<BlogCategory | null>;
  deleteCategory(slug: string): Promise<boolean>;

  createTag(input: TagInputValidated): Promise<{ id: string; slug: string; name: string }>;
  updateTag(
    slug: string,
    input: Partial<TagInputValidated>
  ): Promise<{ id: string; slug: string; name: string } | null>;
  deleteTag(slug: string): Promise<boolean>;
  /** Merge the source tag into the target tag (posts are re-pointed). */
  mergeTags(sourceSlug: string, targetSlug: string): Promise<boolean>;
  listTagsAdmin(): Promise<{ id: string; slug: string; name: string; count: number }[]>;

  listAuthors(): Promise<BlogAuthor[]>;
  /** Public author lookup by slug (used by /blog/author/[slug]). */
  getAuthorBySlug(slug: string): Promise<BlogAuthor | null>;
  createAuthor(input: AuthorInputValidated): Promise<BlogAuthor>;
  updateAuthor(slug: string, input: Partial<AuthorInputValidated>): Promise<BlogAuthor | null>;
  deleteAuthor(slug: string): Promise<boolean>;

  // --- Comments / Newsletter (admin) ---------------------------------------

  /** Every comment across all posts (moderation queue). */
  listAllComments(): Promise<AdminComment[]>;
  deleteComment(id: string): Promise<boolean>;
  /** Admin reply — immediately approved. */
  replyComment(input: { commentId: string; content: string }): Promise<BlogComment | null>;

  listNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  deleteNewsletterSubscriber(id: string): Promise<boolean>;
}
