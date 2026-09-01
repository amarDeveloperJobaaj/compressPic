"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Search, X } from "lucide-react";
import { DesignCard } from "./DesignCard";
import type { Design, DesignCategory, DesignTheme, DesignAnimationLevel } from "@/lib/vizodesign/types";

interface DesignGridProps {
  designs: Design[];
  categories: DesignCategory[];
}

type SortOption = "newest" | "popular" | "most_copied" | "featured" | "az";

const THEME_OPTIONS: { value: DesignTheme; label: string }[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "both", label: "Both" },
];

const ANIMATION_OPTIONS: { value: DesignAnimationLevel; label: string }[] = [
  { value: "minimal", label: "Minimal" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "most_copied", label: "Most Copied" },
  { value: "featured", label: "Featured" },
  { value: "az", label: "A → Z" },
];

function getInitialFilters() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    category: params.get("category") || undefined,
    theme: params.get("theme") as DesignTheme | undefined,
    animation: params.get("animation") as DesignAnimationLevel | undefined,
    sort: params.get("sort") as SortOption | undefined,
    search: params.get("search") || undefined,
  };
}

export function DesignGrid({ designs, categories }: DesignGridProps) {
  const initialFilters = useMemo(() => getInitialFilters(), []);
  const [search, setSearch] = useState(initialFilters.search ?? "");
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category ?? "");
  const [selectedTheme, setSelectedTheme] = useState<DesignTheme | "">(initialFilters.theme ?? "");
  const [selectedAnimation, setSelectedAnimation] = useState<DesignAnimationLevel | "">(initialFilters.animation ?? "");
  const [sortBy, setSortBy] = useState<SortOption>(initialFilters.sort ?? "newest");

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedTheme) params.set("theme", selectedTheme);
    if (selectedAnimation) params.set("animation", selectedAnimation);
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (search) params.set("search", search);
    const qs = params.toString();
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState({}, "", url);
  }, [selectedCategory, selectedTheme, selectedAnimation, sortBy, search]);

  const filtered = useMemo(() => {
    let result = [...designs];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.short_description.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      result = result.filter((d) => {
        const cat = categories.find((c) => c.id === d.category_id);
        return cat?.slug === selectedCategory;
      });
    }

    if (selectedTheme) {
      result = result.filter((d) => d.theme === selectedTheme);
    }

    if (selectedAnimation) {
      result = result.filter((d) => d.animation_level === selectedAnimation);
    }

    switch (sortBy) {
      case "popular":
        result.sort((a, b) => b.view_count - a.view_count);
        break;
      case "most_copied":
        result.sort((a, b) => b.copy_count - a.copy_count);
        break;
      case "featured":
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.sort_order - b.sort_order);
        break;
      case "az":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        result.sort((a, b) => a.sort_order - b.sort_order);
        break;
    }

    return result;
  }, [designs, categories, search, selectedCategory, selectedTheme, selectedAnimation, sortBy]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedCategory("");
    setSelectedTheme("");
    setSelectedAnimation("");
    setSortBy("newest");
  }, []);

  const hasActiveFilters = search || selectedCategory || selectedTheme || selectedAnimation || sortBy !== "newest";

  return (
    <div>
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search designs..."
            value={search}
            onChange={handleSearchChange}
            className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-text-secondary transition-colors focus:border-primary focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value as DesignTheme | "")}
            className="h-9 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-text-secondary transition-colors focus:border-primary focus:outline-none"
          >
            <option value="">All Themes</option>
            {THEME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={selectedAnimation}
            onChange={(e) => setSelectedAnimation(e.target.value as DesignAnimationLevel | "")}
            className="h-9 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-text-secondary transition-colors focus:border-primary focus:outline-none"
          >
            <option value="">All Animation</option>
            {ANIMATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-9 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-text-secondary transition-colors focus:border-primary focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="h-9 rounded-lg border border-border px-3 text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center">
          <p className="text-sm text-text-muted">No designs match your filters.</p>
          <button
            onClick={clearFilters}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="mt-6 text-center text-sm text-text-muted">
          Showing {filtered.length} design{filtered.length === 1 ? "" : "s"}
        </p>
      )}
    </div>
  );
}
