/** Pure pagination helpers shared by the repository implementations. */

export interface PaginationResult {
  page: number;
  pageSize: number;
  /** First index for `supabase .range(from, to)` (inclusive). */
  from: number;
  /** Last index for `supabase .range(from, to)` (inclusive). */
  to: number;
  offset: number;
}

export interface PageMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const DEFAULT_PAGE_SIZE = 9;
const MAX_PAGE_SIZE = 100;

/**
 * Clamp + normalize pagination inputs and compute the Supabase range window.
 * `page` is 1-based; Supabase `.range()` is 0-based and inclusive.
 */
export function getPagination(input?: {
  page?: number;
  pageSize?: number;
}): PaginationResult {
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Math.round(input?.pageSize ?? DEFAULT_PAGE_SIZE))
  );
  const page = Math.max(1, Math.round(input?.page ?? 1));
  const from = (page - 1) * pageSize;
  return { page, pageSize, from, to: from + pageSize - 1, offset: from };
}

/** Compute total pages from a total count. */
export function getTotalPages(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
}

/** Envelope helper for repository list responses. */
export function toPageMeta(total: number, page: number, pageSize: number): PageMeta {
  return { page, pageSize, total, totalPages: getTotalPages(total, pageSize) };
}

/**
 * In-memory pagination (used by the memory repository and by deriving totals
 * after a Supabase fetch when `count` is not requested).
 */
export function paginate<T>(items: T[], page: number, pageSize: number): { items: T[]; meta: PageMeta } {
  const { from, to } = getPagination({ page, pageSize });
  return {
    items: items.slice(from, to + 1),
    meta: toPageMeta(items.length, page, pageSize),
  };
}
