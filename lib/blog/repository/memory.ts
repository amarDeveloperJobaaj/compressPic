import "server-only";

import * as service from "../service";
import type { BlogInput } from "../service";
import { normalizePostFilters, sortItems } from "../search";
import { paginate } from "../pagination";
import type { BlogRepository, BookmarkResult, LikeResult, NewsletterResult } from "./types";
import type {
  AdminComment,
  BlogAuthor,
  BlogCategory,
  BlogComment,
  BlogPost,
  BlogSummary,
  NewsletterSubscriber,
} from "../types";
import type {
  AuthorInputValidated,
  CategoryInputValidated,
  TagInputValidated,
} from "../validation";

/**
 * In-memory BlogRepository — the current dummy phase.
 *
 * Delegates every blog-data operation to the existing service.ts store, so the
 * interface contract is exercised today and the migration to Supabase is a
 * config flip, not a rewrite. Engagement (views/likes/bookmarks/comments/
 * newsletter) lives in throwaway module maps — reset on restart, like the
 * post store itself.
 */

// --- Engagement (throwaway, in-memory) --------------------------------------

const views = new Map<string, number>();
const likes = new Map<string, Set<string>>();
const bookmarks = new Map<string, Set<string>>();
const comments: BlogComment[] = [];
const adminComments: AdminComment[] = [];
const newsletterSubs = new Map<string, NewsletterSubscriber>();
const memorySettings = new Map<string, { value: unknown; description?: string }>();

// --- Admin CMS stores (throwaway) --------------------------------------------

const adminCategories = new Map<string, { data: BlogCategory; count: number }>();
const deletedCategorySlugs = new Set<string>();
const tagStore = new Map<string, { id: string; slug: string; name: string }>();
const authors = new Map<string, BlogAuthor>();

function likeKey(blogId: string, visitorId: string): string {
  return `${blogId}:${visitorId}`;
}

/** "Image Tools" -> "image-tools" — matches how category slugs are derived. */
function slugifyName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export const memoryBlogRepository: BlogRepository = {
  // --- Reads (public) -------------------------------------------------------

  async getPostBySlug(slug) {
    // Public seam: never expose drafts (matches the Supabase RLS behavior).
    const post = service.getPostBySlug(slug);
    if (!post || post.status !== "published" || post.deleted) return null;
    return { ...post, authorSlug: post.authorSlug ?? slugifyName(post.author) };
  },

  async listPublished(filters) {
    const f = normalizePostFilters(filters);
    // searchPosts() already returns only published posts and matches content text.
    const posts: BlogPost[] = f.query ? service.searchPosts(f.query) : service.getPublishedPosts();

    const filtered = posts.filter(
      (p) =>
        (!f.category || p.category === f.category || slugifyName(p.category) === f.category) &&
        (!f.tag || p.tags.some((t) => t.toLowerCase() === f.tag!.toLowerCase())) &&
        (!f.author || slugifyName(p.author) === f.author)
    );

    const sorted = sortItems(filtered, f.sort) as BlogSummary[];
    const paged = paginate(sorted, f.page, f.pageSize);
    // Attach the author slug so cards can link to author pages.
    return {
      ...paged,
      items: paged.items.map((p) => ({ ...p, authorSlug: p.authorSlug ?? slugifyName(p.author) })),
    };
  },

  async getCategories() {
    const merged = new Map<string, BlogCategory & { count: number }>();
    for (const c of service.getCategories()) merged.set(c.slug, c);
    for (const [slug, c] of adminCategories) {
      merged.set(slug, { ...c.data, count: c.count });
    }
    return [...merged.values()].filter((c) => !deletedCategorySlugs.has(c.slug));
  },

  async getTags() {
    return service.getTags();
  },

  async getFeaturedPosts(limit = 3) {
    return service.getFeaturedPosts().slice(0, limit);
  },

  async getTrendingPosts(limit = 4) {
    return service.getTrendingPosts().slice(0, limit);
  },

  async getLatestPosts(limit = 6) {
    return service.getLatestPosts().slice(0, limit);
  },

  async getEditorsPicks(limit = 3) {
    return service.getEditorsPicks().slice(0, limit);
  },

  async getMostRead(limit = 4) {
    return service.getMostRead().slice(0, limit);
  },

  async getRelatedPosts(post, limit = 3) {
    return service.getRelatedPosts(post, limit);
  },

  async getPrevNext(post) {
    return service.getPrevNext(post);
  },

  // --- Reads (admin) --------------------------------------------------------

  async getPostById(id) {
    return service.getPostById(id) ?? null;
  },

  async listDrafts() {
    return service.getDraftPosts();
  },

  async getBlogStats() {
    const base = service.getBlogStats();
    const viewsTotal = [...views.values()].reduce((sum, v) => sum + v, 0);
    return {
      ...base,
      tags: (await this.listTagsAdmin()).length,
      authors: authors.size || base.authors,
      views: viewsTotal,
      comments: adminComments.length,
      pendingComments: adminComments.filter((c) => c.status === "pending").length,
      subscribers: newsletterSubs.size,
      trashed: service.listTrashedPosts().length,
    };
  },

  // --- Admin blog list / trash ----------------------------------------------

  async listAdminPosts({ query, status, page = 1, pageSize = 20 }) {
    let posts = service.getAllPosts();
    if (query?.trim()) {
      const q = query.toLowerCase();
      posts = posts.filter((p) =>
        [p.title, p.slug, p.category, p.tags.join(" "), p.subtitle, p.excerpt]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    if (status && status !== "all") posts = posts.filter((p) => p.status === status);
    const sorted = [...posts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    const total = sorted.length;
    const start = (page - 1) * pageSize;
    const items = sorted.slice(start, start + pageSize).map((p) => service.toSummary(p));
    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
    };
  },

  async restorePost(id) {
    return service.restorePost(id);
  },

  async listTrashedPosts() {
    return service.listTrashedPosts().map((p) => service.toSummary(p));
  },

  async purgePost(id) {
    return service.purgePost(id);
  },

  // --- Writes (admin) -------------------------------------------------------

  async createPost(input) {
    return service.createPost(input);
  },

  async updatePost(id, input) {
    // BlogInput requires slug+title; a partial update supplies them from the form.
    return service.updatePost(id, input as BlogInput) ?? null;
  },

  async deletePost(id) {
    return service.deletePost(id);
  },

  async duplicatePost(id) {
    return service.duplicatePost(id) ?? null;
  },

  // --- Categories / Tags / Authors (admin CRUD, keyed by slug) --------------

  async createCategory(input: CategoryInputValidated) {
    const slug = input.slug || slugifyName(input.name);
    const cat: BlogCategory = {
      id: `cat-${slug}`,
      slug,
      name: input.name,
      description: input.description ?? "",
    };
    deletedCategorySlugs.delete(slug);
    adminCategories.set(slug, { data: cat, count: 0 });
    return { ...cat, count: 0 };
  },

  async updateCategory(slug, input) {
    const existing =
      adminCategories.get(slug)?.data ??
      (await this.getCategories()).find((c) => c.slug === slug);
    if (!existing) return null;
    const next: BlogCategory = {
      ...existing,
      ...input,
      slug: input.slug ?? slug,
    };
    if (input.slug && input.slug !== slug) adminCategories.delete(slug);
    adminCategories.set(next.slug, { data: next, count: 0 });
    return next;
  },

  async deleteCategory(slug) {
    if (!(adminCategories.has(slug) || (await this.getCategories()).some((c) => c.slug === slug))) {
      return false;
    }
    deletedCategorySlugs.add(slug);
    adminCategories.delete(slug);
    return true;
  },

  async createTag(input: TagInputValidated) {
    const slug = input.slug || slugifyName(input.name);
    const tag = { id: `tag-${slug}`, slug, name: input.name };
    tagStore.set(slug, tag);
    return tag;
  },

  async updateTag(slug, input) {
    const existing = tagStore.get(slug);
    if (!existing) return null;
    const next = { ...existing, ...input, slug: input.slug ?? slug };
    if (input.slug && input.slug !== slug) tagStore.delete(slug);
    tagStore.set(next.slug, next);
    return next;
  },

  async deleteTag(slug) {
    return tagStore.delete(slug);
  },

  async mergeTags(sourceSlug, targetSlug) {
    if (sourceSlug === targetSlug) return false;
    const source = tagStore.get(sourceSlug);
    const target = tagStore.get(targetSlug);
    if (!target) return false;
    // Re-point every post that uses the source tag name to the target name.
    let changed = false;
    for (const p of service.getAllPosts()) {
      if (p.tags.some((t) => slugifyName(t) === sourceSlug)) {
        p.tags = p.tags.map((t) => (slugifyName(t) === sourceSlug ? target.name : t));
        changed = true;
      }
    }
    if (source) tagStore.delete(sourceSlug);
    return changed;
  },

  async listTagsAdmin() {
    const counts = new Map<string, number>();
    for (const p of service.getAllPosts()) {
      for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    const result = new Map<string, { id: string; slug: string; name: string; count: number }>();
    for (const t of service.getAllPosts()) {
      for (const name of t.tags) {
        const slug = slugifyName(name);
        if (!result.has(slug)) result.set(slug, { id: `tag-${slug}`, slug, name, count: 0 });
      }
    }
    for (const t of tagStore.values()) result.set(t.slug, { ...t, count: 0 });
    return [...result.values()]
      .map((t) => ({ ...t, count: counts.get(t.name) ?? 0 }))
      .sort((a, b) => b.count - a.count);
  },

  async listAuthors() {
    return [...authors.values()];
  },

  async getAuthorBySlug(slug) {
    // Admin-created author records win; otherwise derive from the post store
    // so every published post's author has a stable profile URL.
    const direct = authors.get(slug);
    if (direct) return direct;
    const match = service
      .getPublishedPosts()
      .find((p) => slugifyName(p.author) === slug);
    if (!match) return null;
    return {
      id: `author-${slug}`,
      slug,
      name: match.author,
      role: match.authorRole ?? "Author",
      bio: "Writes practical, ad-free guides for Vizo Tool.",
      createdAt: match.publishedAt,
    };
  },

  async createAuthor(input: AuthorInputValidated) {
    const author: BlogAuthor = {
      id: `author-${input.slug}`,
      name: input.name,
      slug: input.slug,
      role: input.role ?? "Author",
      bio: input.bio ?? "",
      avatarUrl: input.avatarUrl,
      email: input.email,
      twitter: input.twitter,
      website: input.website,
      instagram: input.instagram,
      linkedin: input.linkedin,
      createdAt: new Date().toISOString(),
    };
    authors.set(author.slug!, author);
    return author;
  },

  async updateAuthor(slug, input) {
    const existing = authors.get(slug);
    if (!existing) return null;
    const next: BlogAuthor = { ...existing, ...input, slug: input.slug ?? slug };
    if (input.slug && input.slug !== slug) authors.delete(slug);
    authors.set(next.slug!, next);
    return next;
  },

  async deleteAuthor(slug) {
    return authors.delete(slug);
  },

  // --- Engagement -----------------------------------------------------------

  async recordView(blogId, visitorId) {
    views.set(blogId, (views.get(blogId) ?? 0) + 1);
    void visitorId;
  },

  async getPostEngagement(blogId) {
    return {
      likes: likes.get(blogId)?.size ?? 0,
      bookmarks: bookmarks.get(blogId)?.size ?? 0,
      views: views.get(blogId) ?? 0,
    };
  },

  async toggleLike(blogId, visitorId): Promise<LikeResult> {
    const set = likes.get(blogId) ?? new Set<string>();
    const key = likeKey(blogId, visitorId);
    let liked: boolean;
    if (set.has(key)) {
      set.delete(key);
      liked = false;
    } else {
      set.add(key);
      liked = true;
    }
    likes.set(blogId, set);
    return { liked, count: set.size };
  },

  async toggleBookmark(blogId, visitorId): Promise<BookmarkResult> {
    const set = bookmarks.get(blogId) ?? new Set<string>();
    const key = likeKey(blogId, visitorId);
    let bookmarked: boolean;
    if (set.has(key)) {
      set.delete(key);
      bookmarked = false;
    } else {
      set.add(key);
      bookmarked = true;
    }
    bookmarks.set(blogId, set);
    return { bookmarked };
  },

  async listComments(blogId) {
    return comments
      .filter((c) => c.blogId === blogId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  async createComment(input) {
    const comment: BlogComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      blogId: input.blogId,
      parentId: input.parentId,
      authorName: input.authorName,
      content: input.content,
      createdAt: new Date().toISOString(),
    };
    const adminComment: AdminComment = {
      ...comment,
      authorEmail: input.authorEmail,
      status: "pending",
      blogTitle: service.getPostById(input.blogId)?.title ?? "Unknown",
    };
    comments.push(comment);
    adminComments.push(adminComment);
    return comment;
  },

  async updateCommentStatus(commentId, status) {
    const entry = adminComments.find((c) => c.id === commentId);
    if (!entry) return comments.find((c) => c.id === commentId) ?? null;
    entry.status = status;
    return {
      id: entry.id,
      blogId: entry.blogId,
      parentId: entry.parentId,
      authorName: entry.authorName,
      content: entry.content,
      createdAt: entry.createdAt,
    };
  },

  async listAllComments() {
    return [...adminComments].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async deleteComment(id) {
    const before = adminComments.length;
    const aIdx = adminComments.findIndex((c) => c.id === id);
    const cIdx = comments.findIndex((c) => c.id === id);
    if (aIdx !== -1) adminComments.splice(aIdx, 1);
    if (cIdx !== -1) comments.splice(cIdx, 1);
    return adminComments.length !== before || cIdx !== -1;
  },

  async replyComment({ commentId, content }) {
    const parent = adminComments.find((c) => c.id === commentId) ?? comments.find((c) => c.id === commentId);
    if (!parent) return null;
    const reply: BlogComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      blogId: parent.blogId,
      parentId: commentId,
      authorName: "Vizo Tool Team",
      content,
      createdAt: new Date().toISOString(),
    };
    const adminReply: AdminComment = {
      ...reply,
      authorEmail: "team@vizotool.com",
      status: "approved",
      blogTitle: service.getPostById(parent.blogId)?.title ?? "Unknown",
    };
    comments.push(reply);
    adminComments.push(adminReply);
    return reply;
  },

  async subscribeNewsletter(email, source = "blog"): Promise<NewsletterResult> {
    if (newsletterSubs.has(email)) {
      const existing = newsletterSubs.get(email)!;
      if (existing.subscribed) {
        return { subscribed: true, message: "You are already subscribed." };
      }
      newsletterSubs.set(email, { ...existing, subscribed: true, unsubscribedAt: undefined });
      return { subscribed: true, message: "Welcome back — you are subscribed again." };
    }
    newsletterSubs.set(email, {
      id: `nl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      email,
      source,
      subscribed: true,
      createdAt: new Date().toISOString(),
    });
    return { subscribed: true, message: "Subscribed successfully." };
  },

  async listNewsletterSubscribers() {
    return [...newsletterSubs.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async deleteNewsletterSubscriber(id) {
    const entry = [...newsletterSubs.values()].find((s) => s.id === id);
    if (!entry) return false;
    return newsletterSubs.delete(entry.email);
  },

  // --- Settings -------------------------------------------------------------

  async getSettings(keys) {
    const defaults: Record<string, unknown> = {
      "site.name": "Vizo Tool",
      "site.description": "Free online image, developer, SEO and finance tools.",
      "blog.newsletter_enabled": true,
      "blog.comments_enabled": true,
      "blog.default_og_image": "/og?title=Vizo%20Tool%20Blog",
    };
    if (!keys) return { ...defaults, ...Object.fromEntries(memorySettings) };
    return Object.fromEntries(keys.map((k) => [k, memorySettings.get(k)?.value ?? defaults[k]]));
  },

  async upsertSetting(input) {
    memorySettings.set(input.key, { value: input.value, description: input.description });
  },
};
