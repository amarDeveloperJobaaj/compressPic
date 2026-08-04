"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Flame, Search, SlidersHorizontal, Star, Timer, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import type { BlogCategory } from "@/lib/blog/types";
import type { BlogSummary } from "@/lib/blog/service";
import { BlogCard } from "./BlogCard";
import { cn } from "@/lib/utils";

type SortMode = "newest" | "oldest" | "trending" | "featured" | "mostRead" | "editorsPick";

const SORT_OPTIONS: { value: SortMode; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "newest", label: "Newest", Icon: Timer },
  { value: "oldest", label: "Oldest", Icon: Timer },
  { value: "trending", label: "Trending", Icon: Flame },
  { value: "featured", label: "Featured", Icon: Star },
  { value: "mostRead", label: "Most Read", Icon: TrendingUp },
  { value: "editorsPick", label: "Editor's Pick", Icon: SlidersHorizontal },
];

const PAGE_SIZE = 9;

export function BlogExplorer({
  posts,
  categories,
  tags,
}: {
  posts: BlogSummary[];
  categories: (BlogCategory & { count: number })[];
  tags: { name: string; count: number }[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>("newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = posts.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (activeTag && !p.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase())) return false;
      if (q) {
        const haystack = [p.title, p.subtitle, p.excerpt, p.category, p.tags.join(" ")]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    switch (sort) {
      case "newest":
        list = [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
        break;
      case "oldest":
        list = [...list].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
        break;
      case "trending":
        list = [...list].sort((a, b) => Number(b.trending) - Number(a.trending) || b.readCount - a.readCount);
        break;
      case "featured":
        list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured) || b.publishedAt.localeCompare(a.publishedAt));
        break;
      case "mostRead":
        list = [...list].sort((a, b) => b.readCount - a.readCount);
        break;
      case "editorsPick":
        list = [...list].sort((a, b) => Number(b.editorsPick) - Number(a.editorsPick) || b.publishedAt.localeCompare(a.publishedAt));
        break;
    }
    return list;
  }, [posts, query, category, activeTag, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetPage = () => setPage(1);

  return (
    <div>
      {/* Sticky filter toolbar */}
      <div className="sticky top-16 z-30 -mx-4 mb-6 border-y border-border/70 bg-background/85 px-4 py-3 backdrop-blur-md">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative lg:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                resetPage();
              }}
              placeholder="Search articles…"
              aria-label="Search blog posts"
              className="h-10 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Sort */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Sort posts">
            {SORT_OPTIONS.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setSort(value);
                  resetPage();
                }}
                aria-pressed={sort === value}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                  sort === value
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "border border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-primary"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Category pills */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setCategory("all");
              resetPage();
            }}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
              category === "all"
                ? "bg-gradient-to-r from-primary to-sky-500 text-white shadow-md shadow-primary/25"
                : "border border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-primary"
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => {
                setCategory(category === c.name ? "all" : c.name);
                resetPage();
              }}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                category === c.name
                  ? "bg-gradient-to-r from-primary to-sky-500 text-white shadow-md shadow-primary/25"
                  : "border border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-primary"
              )}
            >
              {c.name}
              <span className="ml-1 opacity-60">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="mb-4 text-sm text-text-muted" aria-live="polite">
        {filtered.length} article{filtered.length === 1 ? "" : "s"}
        {query.trim() && (
          <>
            {" "}matching “<span className="font-medium text-text-primary">{query.trim()}</span>”
          </>
        )}
      </p>

      {/* Grid */}
      {pageItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/60 py-20 text-center">
          <Search className="mx-auto h-10 w-10 text-text-muted" />
          <p className="mt-3 font-semibold text-text-primary">No articles found</p>
          <p className="mt-1 text-sm text-text-muted">Try a different search or clear the filters.</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${category}-${activeTag}-${sort}-${query}-${page}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {pageItems.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
          <button
            type="button"
            disabled={safePage === 1}
            onClick={() => setPage(safePage - 1)}
            className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
            .reduce<(number | "…")[]>((acc, p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "…" ? (
                <span key={`e${i}`} className="px-1 text-text-muted">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  aria-current={safePage === p ? "page" : undefined}
                  className={cn(
                    "h-10 w-10 rounded-xl text-sm font-semibold transition-all",
                    safePage === p
                      ? "bg-primary text-white shadow-md shadow-primary/25"
                      : "border border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-primary"
                  )}
                >
                  {p}
                </button>
              )
            )}
          <button
            type="button"
            disabled={safePage === totalPages}
            onClick={() => setPage(safePage + 1)}
            className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </nav>
      )}

      {/* Popular tags */}
      {tags.length > 0 && (
        <div className="mt-12 border-t border-border pt-6">
          <p className="text-sm font-semibold text-text-primary">Popular tags</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.slice(0, 14).map((tag) => (
              <button
                key={tag.name}
                type="button"
                onClick={() => {
                  setActiveTag(activeTag === tag.name ? null : tag.name);
                  resetPage();
                }}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                  activeTag === tag.name
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "border border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-primary"
                )}
              >
                #{tag.name}
                <span className="ml-1 opacity-60">{tag.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
