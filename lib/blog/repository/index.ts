import "server-only";

import type { BlogRepository } from "./types";
import { memoryBlogRepository } from "./memory";
import { supabaseBlogRepository } from "./supabase";

/**
 * Blog repository factory — the single seam between the current dummy store
 * and Supabase.
 *
 *   BLOG_STORAGE=memory    -> in-memory store (lib/blog/service.ts)
 *   BLOG_STORAGE=supabase  -> Supabase repository (lib/supabase/*)
 *   (unset)                -> supabase when the Supabase env vars are present,
 *                             otherwise memory (so the app always boots)
 *
 * The public/admin UI continues to import lib/blog/service.ts. When you flip
 * this env var, swap the delegation inside service.ts (or re-point its
 * exports at getBlogRepository()) — no UI, route or component changes.
 */

export type { BlogRepository } from "./types";
export type { LikeResult, BookmarkResult, NewsletterResult } from "./types";

export type BlogStorage = "memory" | "supabase";

export function getBlogStorage(): BlogStorage {
  const explicit = process.env.BLOG_STORAGE;
  if (explicit === "supabase") return "supabase";
  if (explicit === "memory") return "memory";
  // Smart default: use Supabase when it is configured, else stay on memory.
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? "supabase"
    : "memory";
}

let cached: BlogRepository | null = null;

export function getBlogRepository(): BlogRepository {
  if (!cached) {
    cached = getBlogStorage() === "supabase" ? supabaseBlogRepository : memoryBlogRepository;
  }
  return cached;
}
