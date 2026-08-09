/** Normalized search + filter inputs for blog list queries (shared by both repositories). */

import { getPagination } from "./pagination";

export type BlogSort =
  | "newest"
  | "oldest"
  | "trending"
  | "featured"
  | "most-read"
  | "editors-pick";

export interface PostFilters {
  query?: string;
  category?: string;
  tag?: string;
  author?: string;
  sort?: BlogSort;
  page?: number;
  pageSize?: number;
}

export interface NormalizedFilters {
  query: string;
  category: string | null;
  tag: string | null;
  author: string | null;
  sort: BlogSort;
  page: number;
  pageSize: number;
  from: number;
  to: number;
  offset: number;
}

export const VALID_SORTS: BlogSort[] = [
  "newest",
  "oldest",
  "trending",
  "featured",
  "most-read",
  "editors-pick",
];

/** Clamp + validate free-form filter input into a stable shape. */
export function normalizePostFilters(input?: PostFilters): NormalizedFilters {
  const { page, pageSize, from, to, offset } = getPagination(input);
  const sort: BlogSort = input?.sort && VALID_SORTS.includes(input.sort) ? input.sort : "newest";
  return {
    query: (input?.query ?? "").trim().slice(0, 120),
    category: input?.category?.trim() ? input.category.trim() : null,
    tag: input?.tag?.trim() ? input.tag.trim() : null,
    author: input?.author?.trim() ? input.author.trim() : null,
    sort,
    page,
    pageSize,
    from,
    to,
    offset,
  };
}

/** Build a PostgREST `or()` clause for ILIKE search across the searchable columns. */
export function buildSearchOrClause(query: string): string | null {
  const q = query.trim();
  if (!q) return null;
  const escaped = q.replace(/'/g, "''");
  const pattern = `%${escaped}%`;
  return [
    `title.ilike.${pattern}`,
    `subtitle.ilike.${pattern}`,
    `excerpt.ilike.${pattern}`,
    `slug.ilike.${pattern}`,
  ].join(",");
}

/**
 * Apply the sort to an in-memory item list (used by the memory repository;
 * the Supabase repository maps the same sort to an `order()` clause).
 */
export function sortItems<T extends { publishedAt: string; readCount: number }>(
  items: T[],
  sort: BlogSort
): T[] {
  const list = [...items];
  switch (sort) {
    case "oldest":
      return list.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
    case "trending":
      return list.sort(
        (a, b) =>
          Number((b as T & { trending?: boolean }).trending ?? 0) -
            Number((a as T & { trending?: boolean }).trending ?? 0) ||
          b.readCount - a.readCount
      );
    case "featured":
      return list.sort(
        (a, b) =>
          Number((b as T & { featured?: boolean }).featured ?? 0) -
          Number((a as T & { featured?: boolean }).featured ?? 0)
      );
    case "editors-pick":
      return list.sort(
        (a, b) =>
          Number((b as T & { editorsPick?: boolean }).editorsPick ?? 0) -
          Number((a as T & { editorsPick?: boolean }).editorsPick ?? 0)
      );
    case "most-read":
      return list.sort((a, b) => b.readCount - a.readCount);
    case "newest":
    default:
      return list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }
}
