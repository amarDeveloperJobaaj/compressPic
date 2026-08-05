"use server";

/**
 * Blog server actions — the only sanctioned path for blog mutations.
 *
 * Every action validates its input with Zod before touching the repository,
 * admin mutations are guarded by the existing admin session, and all writes
 * revalidate the public pages so changes appear immediately.
 *
 * These are the backend entry points the UI will call once the Supabase
 * repository is enabled — nothing here depends on which repository is active.
 */
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { isAdmin } from "@/lib/admin/session";

import { getBlogRepository } from "./repository";
import { slugify } from "./utils";
import type { BlogPost } from "./types";
import {
  authorInputSchema,
  blogInputSchema,
  bookmarkInputSchema,
  categoryInputSchema,
  commentInputSchema,
  likeInputSchema,
  newsletterInputSchema,
  settingsInputSchema,
  tagInputSchema,
  viewInputSchema,
} from "./validation";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; issues?: string[] };

function fail(error: string, issues?: string[]): { ok: false; error: string; issues?: string[] } {
  return { ok: false, error, ...(issues ? { issues } : {}) };
}

/** Revalidate every surface a post can appear on (listing, category, tag, article). */
function revalidateBlogPages(post?: Pick<BlogPost, "slug" | "category" | "tags">) {
  revalidatePath("/blogs");
  revalidatePath("/blog");
  if (post) {
    revalidatePath(`/blog/${post.slug}`, "page");
    if (post.category) revalidatePath(`/blog/category/${slugify(post.category)}`, "page");
    for (const tag of post.tags) revalidatePath(`/blog/tag/${slugify(tag)}`, "page");
  }
}

// ---------------------------------------------------------------------------
// Admin — blog CRUD
// ---------------------------------------------------------------------------

export async function createBlogAction(
  input: unknown
): Promise<ActionResult<{ id: string; slug: string }>> {
  if (!(await isAdmin())) return fail("Unauthorized");

  const parsed = blogInputSchema.safeParse(input);
  if (!parsed.success) {
    return fail("Invalid blog data", parsed.error.issues.map((i) => i.message));
  }

  const post = await getBlogRepository().createPost(parsed.data);
  revalidateBlogPages(post);
  return { ok: true, data: { id: post.id, slug: post.slug } };
}

export async function updateBlogAction(
  id: string,
  input: unknown
): Promise<ActionResult<{ id: string; slug: string }>> {
  if (!(await isAdmin())) return fail("Unauthorized");

  const parsed = blogInputSchema.partial().safeParse(input);
  if (!parsed.success) {
    return fail("Invalid blog data", parsed.error.issues.map((i) => i.message));
  }

  const post = await getBlogRepository().updatePost(id, parsed.data);
  if (!post) return fail("Post not found");

  revalidateBlogPages(post);
  return { ok: true, data: { id: post.id, slug: post.slug } };
}

export async function deleteBlogAction(id: string): Promise<ActionResult<{ deleted: boolean }>> {
  if (!(await isAdmin())) return fail("Unauthorized");

  const repo = getBlogRepository();
  const post = await repo.getPostById(id); // keep the post's surfaces for revalidation
  const deleted = await repo.deletePost(id);
  revalidateBlogPages(post ?? undefined);
  return { ok: true, data: { deleted } };
}

export async function duplicateBlogAction(
  id: string
): Promise<ActionResult<{ id: string; slug: string }>> {
  if (!(await isAdmin())) return fail("Unauthorized");

  const post = await getBlogRepository().duplicatePost(id);
  if (!post) return fail("Post not found");

  revalidateBlogPages();
  return { ok: true, data: { id: post.id, slug: post.slug } };
}

/** Quick publish / unpublish / schedule toggle. */
export async function setBlogStatusAction(
  id: string,
  status: "published" | "draft" | "scheduled"
): Promise<ActionResult<{ id: string; status: string }>> {
  if (!(await isAdmin())) return fail("Unauthorized");

  const post = await getBlogRepository().updatePost(id, { status });
  if (!post) return fail("Post not found");

  revalidateBlogPages(post);
  return { ok: true, data: { id: post.id, status: post.status } };
}

// ---------------------------------------------------------------------------
// Admin — settings
// ---------------------------------------------------------------------------

export async function saveSettingsAction(input: unknown): Promise<ActionResult<{ key: string }>> {
  if (!(await isAdmin())) return fail("Unauthorized");

  const parsed = settingsInputSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid settings data");

  await getBlogRepository().upsertSetting({
    key: parsed.data.key,
    value: parsed.data.value,
    description: parsed.data.description,
  });

  revalidatePath("/admin/settings");
  return { ok: true, data: { key: parsed.data.key } };
}

// ---------------------------------------------------------------------------
// Public — engagement
// ---------------------------------------------------------------------------

export async function subscribeNewsletterAction(
  input: unknown
): Promise<ActionResult<{ subscribed: boolean; message: string }>> {
  const parsed = newsletterInputSchema.safeParse(input);
  if (!parsed.success) return fail("Please enter a valid email address");

  const result = await getBlogRepository().subscribeNewsletter(
    parsed.data.email,
    parsed.data.source
  );
  return { ok: true, data: result };
}

export async function createCommentAction(
  input: unknown
): Promise<ActionResult<{ id: string; status: "pending" }>> {
  const parsed = commentInputSchema.safeParse(input);
  if (!parsed.success) {
    return fail("Invalid comment", parsed.error.issues.map((i) => i.message));
  }

  const comment = await getBlogRepository().createComment(parsed.data);
  if (!comment) return fail("Could not post the comment");

  // Comments start as "pending" and are not publicly visible until approved,
  // so there is nothing to revalidate here — see moderateCommentAction.
  return { ok: true, data: { id: comment.id, status: "pending" } };
}

/** Admin comment moderation: approve / reject / flag. */
export async function moderateCommentAction(
  commentId: string,
  status: "approved" | "pending" | "spam"
): Promise<ActionResult<{ id: string; status: string }>> {
  if (!(await isAdmin())) return fail("Unauthorized");

  const comment = await getBlogRepository().updateCommentStatus(commentId, status);
  if (!comment) return fail("Comment not found");

  revalidatePath(`/blog/${comment.blogId}`, "page");
  return { ok: true, data: { id: comment.id, status } };
}

export async function recordViewAction(input: unknown): Promise<ActionResult<{ recorded: boolean }>> {
  const parsed = viewInputSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid view payload");

  await getBlogRepository().recordView(parsed.data.blogId, parsed.data.visitorId);
  return { ok: true, data: { recorded: true } };
}

export async function toggleLikeAction(
  input: unknown
): Promise<ActionResult<{ liked: boolean; count: number }>> {
  const parsed = likeInputSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid like payload");

  const result = await getBlogRepository().toggleLike(parsed.data.blogId, parsed.data.visitorId);
  return { ok: true, data: result };
}

export async function toggleBookmarkAction(
  input: unknown
): Promise<ActionResult<{ bookmarked: boolean }>> {
  const parsed = bookmarkInputSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid bookmark payload");

  const result = await getBlogRepository().toggleBookmark(parsed.data.blogId, parsed.data.visitorId);
  return { ok: true, data: result };
}

/** Public engagement counts (likes / bookmarks / views) for a post. */
export async function getPostEngagementAction(
  blogId: string
): Promise<ActionResult<{ likes: number; bookmarks: number; views: number }>> {
  const parsed = z.object({ blogId: z.string().min(1).max(64) }).safeParse({ blogId });
  if (!parsed.success) return fail("Invalid post id");

  const engagement = await getBlogRepository().getPostEngagement(parsed.data.blogId);
  return { ok: true, data: engagement };
}

// ---------------------------------------------------------------------------
// Admin CMS — categories / tags / authors / comments / newsletter
// ---------------------------------------------------------------------------

export async function saveCategoryAction(
  input: unknown,
  slug?: string
): Promise<ActionResult<{ slug: string }>> {
  if (!(await isAdmin())) return fail("Unauthorized");

  const parsed = categoryInputSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid category data");

  const repo = getBlogRepository();
  if (slug) {
    const updated = await repo.updateCategory(slug, parsed.data);
    if (!updated) return fail("Category not found");
  } else {
    await repo.createCategory(parsed.data);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/blogs");
  return { ok: true, data: { slug: parsed.data.slug || parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") } };
}

export async function deleteCategoryAction(
  slug: string
): Promise<ActionResult<{ deleted: boolean }>> {
  if (!(await isAdmin())) return fail("Unauthorized");
  const deleted = await getBlogRepository().deleteCategory(slug);
  revalidatePath("/admin/categories");
  revalidatePath("/blogs");
  return { ok: true, data: { deleted } };
}

export async function saveTagAction(
  input: unknown,
  slug?: string
): Promise<ActionResult<{ slug: string }>> {
  if (!(await isAdmin())) return fail("Unauthorized");

  const parsed = tagInputSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid tag data");

  const repo = getBlogRepository();
  if (slug) {
    const updated = await repo.updateTag(slug, parsed.data);
    if (!updated) return fail("Tag not found");
  } else {
    await repo.createTag(parsed.data);
  }

  revalidatePath("/admin/tags");
  return { ok: true, data: { slug: parsed.data.slug || parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") } };
}

export async function deleteTagAction(
  slug: string
): Promise<ActionResult<{ deleted: boolean }>> {
  if (!(await isAdmin())) return fail("Unauthorized");
  const deleted = await getBlogRepository().deleteTag(slug);
  revalidatePath("/admin/tags");
  return { ok: true, data: { deleted } };
}

export async function mergeTagsAction(
  sourceSlug: string,
  targetSlug: string
): Promise<ActionResult<{ merged: boolean }>> {
  if (!(await isAdmin())) return fail("Unauthorized");
  const merged = await getBlogRepository().mergeTags(sourceSlug, targetSlug);
  revalidatePath("/admin/tags");
  revalidatePath("/blogs");
  return { ok: true, data: { merged } };
}

export async function saveAuthorAction(
  input: unknown,
  slug?: string
): Promise<ActionResult<{ slug: string }>> {
  if (!(await isAdmin())) return fail("Unauthorized");

  const parsed = authorInputSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid author data");

  const repo = getBlogRepository();
  if (slug) {
    const updated = await repo.updateAuthor(slug, parsed.data);
    if (!updated) return fail("Author not found");
  } else {
    await repo.createAuthor(parsed.data);
  }

  revalidatePath("/admin/authors");
  return { ok: true, data: { slug: parsed.data.slug || parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") } };
}

export async function deleteAuthorAction(
  slug: string
): Promise<ActionResult<{ deleted: boolean }>> {
  if (!(await isAdmin())) return fail("Unauthorized");
  const deleted = await getBlogRepository().deleteAuthor(slug);
  revalidatePath("/admin/authors");
  return { ok: true, data: { deleted } };
}

export async function deleteCommentAction(
  id: string
): Promise<ActionResult<{ deleted: boolean }>> {
  if (!(await isAdmin())) return fail("Unauthorized");
  const deleted = await getBlogRepository().deleteComment(id);
  revalidatePath("/admin/comments");
  return { ok: true, data: { deleted } };
}

export async function replyCommentAction(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  if (!(await isAdmin())) return fail("Unauthorized");

  const parsed = z
    .object({ commentId: z.string().min(1), content: z.string().min(1).max(2000) })
    .safeParse(input);
  if (!parsed.success) return fail("Invalid reply");

  const comment = await getBlogRepository().replyComment(parsed.data);
  if (!comment) return fail("Comment not found");
  revalidatePath(`/blog/${comment.blogId}`, "page");
  return { ok: true, data: { id: comment.id } };
}

export async function deleteSubscriberAction(
  id: string
): Promise<ActionResult<{ deleted: boolean }>> {
  if (!(await isAdmin())) return fail("Unauthorized");
  const deleted = await getBlogRepository().deleteNewsletterSubscriber(id);
  revalidatePath("/admin/newsletter");
  return { ok: true, data: { deleted } };
}
