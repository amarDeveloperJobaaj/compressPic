/**
 * Dummy blog data layer (requested structure).
 *
 * The seed data lives in lib/blog/data.ts — this file is a stable entry point
 * so the data layer can be swapped for Supabase later without touching the
 * UI: import from "@/data/blogs" and migrate the implementation underneath.
 */
export { BLOG_CATEGORIES, BLOG_POSTS } from "@/lib/blog/data";
export type { BlogPost, BlogCategory, BlogBlock } from "@/lib/blog/types";
