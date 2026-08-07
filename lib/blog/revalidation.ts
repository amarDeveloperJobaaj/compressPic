/**
 * Shared blog revalidation helpers.
 *
 * Every blog mutation (server action or admin API route) should call these so
 * the public surfaces — blog listing, article, category, tag and the XML
 * sitemap — never serve stale data.
 *
 * Server-only: revalidatePath cannot be called from client components, so this
 * module must never be imported by client code.
 */
import { revalidatePath } from "next/cache";

import type { BlogPost } from "./types";
import { slugify } from "./utils";

/** Keep the XML sitemap fresh — it lists published posts, categories, tags and authors. */
export function revalidateSitemap() {
  revalidatePath("/sitemap.xml");
}

/** Revalidate every surface a post can appear on (listing, category, tag, article, sitemap). */
export function revalidateBlogPages(post?: Pick<BlogPost, "slug" | "category" | "tags">) {
  revalidatePath("/blogs");
  revalidatePath("/blog");
  revalidateSitemap();
  if (post) {
    revalidatePath(`/blog/${post.slug}`, "page");
    if (post.category) revalidatePath(`/blog/category/${slugify(post.category)}`, "page");
    for (const tag of post.tags) revalidatePath(`/blog/tag/${slugify(tag)}`, "page");
  }
}
