"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Flame, Search, Sparkles, X } from "lucide-react";
import type { Tool } from "@/lib/tools";
import { getToolIcon } from "@/lib/tool-icons";
import { Capsule, type CapsuleVariant } from "@/components/ui/capsule";
import { cn } from "@/lib/utils";

type SortMode = "recommended" | "az" | "popular" | "newest";

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "az", label: "A–Z" },
];

/** Map a tool badge to a capsule variant (mirrors the homepage treatment). */
function badgeVariant(tool: Tool): CapsuleVariant {
  switch (tool.badge) {
    case "AI":
      return "purple";
    case "Free":
      return "success";
    case "1-click":
      return "teal";
    case "New":
      return "sky";
    case "Popular":
      return "amber";
    default:
      return tool.badgeTone === "success" ? "success" : "primary";
  }
}

/** Tools whose badge indicates popularity. */
const POPULAR_BADGES = new Set(["Popular", "AI", "-85%"]);

export function CategoryExplorer({
  tools,
  accent,
}: {
  tools: Tool[];
  accent: string;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("recommended");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = tools.filter((t) => {
      if (!q) return true;
      return [t.name, t.tagline, t.description, t.slug]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

    switch (sort) {
      case "az":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      case "popular":
        return [...list].sort(
          (a, b) =>
            Number(POPULAR_BADGES.has(b.badge)) - Number(POPULAR_BADGES.has(a.badge))
        );
      case "newest":
        return [...list].sort(
          (a, b) => Number(b.badge === "New") - Number(a.badge === "New")
        );
      default:
        return [...list].sort(
          (a, b) =>
            Number(POPULAR_BADGES.has(b.badge)) - Number(POPULAR_BADGES.has(a.badge)) ||
            Number(b.badge === "New") - Number(a.badge === "New")
        );
    }
  }, [tools, query, sort]);

  const popular = tools.filter((t) => POPULAR_BADGES.has(t.badge));
  const newest = tools.filter((t) => t.badge === "New");

  return (
    <div className="space-y-6">
      {/* Sticky search + sort bar */}
      <div className="sticky top-[4.5rem] z-30 -mx-1 rounded-2xl border border-border/80 bg-background/85 px-3 py-2.5 shadow-lg shadow-black/5 backdrop-blur-xl sm:px-4">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${tools.length} tools…`}
              aria-label="Search tools"
              className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-9 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-primary-light hover:text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            role="group"
            aria-label="Sort tools"
            className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-surface p-1"
          >
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSort(option.value)}
                aria-pressed={sort === option.value}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  sort === option.value
                    ? "bg-gradient-to-r from-primary to-sky-500 text-white shadow-md shadow-primary/25"
                    : "text-text-secondary hover:bg-primary-light/70 hover:text-primary"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <p className="mt-2 px-1 text-xs text-text-muted">
          {filtered.length} tool{filtered.length === 1 ? "" : "s"}
          {query ? ` matching “${query}”` : ""}
        </p>
      </div>

      {/* Quick highlight chips */}
      {(popular.length > 0 || newest.length > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          {popular.length > 0 && (
            <Capsule variant="amber" icon={Flame} sm>
              {popular.length} popular
            </Capsule>
          )}
          {newest.length > 0 && (
            <Capsule variant="sky" icon={Sparkles} sm>
              {newest.length} new
            </Capsule>
          )}
          <Capsule variant={accent as CapsuleVariant} sm dot>
            100% free · No sign-up
          </Capsule>
        </div>
      )}

      {/* Tool grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
            <Search className="h-6 w-6" />
          </span>
          <p className="mt-4 font-semibold text-text-primary">No tools found</p>
          <p className="mt-1 max-w-sm text-sm text-text-secondary">
            Try a different keyword — for example &ldquo;JSON&rdquo;, &ldquo;PDF&rdquo; or
            &ldquo;calculator&rdquo;.
          </p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((tool) => {
              const Icon = getToolIcon(tool.slug);
              const isPopular = POPULAR_BADGES.has(tool.badge);
              const isNew = tool.badge === "New";
              return (
                <motion.div
                  key={tool.slug}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
                >
                  {/* Hover glow */}
                  <span className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3",
                        tool.badgeTone === "success" && !isPopular && !isNew
                          ? "from-emerald-500 to-teal-500"
                          : "from-primary to-sky-500"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      {isPopular && (
                        <Capsule variant="amber" icon={Flame} sm>
                          Popular
                        </Capsule>
                      )}
                      {isNew && !isPopular && (
                        <Capsule variant="sky" icon={Sparkles} sm>
                          New
                        </Capsule>
                      )}
                    </div>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-text-primary">
                    {tool.name}
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-text-secondary">
                    {tool.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/70 pt-3.5">
                    <Capsule variant={badgeVariant(tool)} sm interactive={false}>
                      {tool.badge}
                    </Capsule>
                    <Link
                      href={tool.href}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-primary/25 transition-all duration-200 hover:bg-primary-dark hover:shadow-primary/40 active:scale-[0.97]"
                    >
                      Open Tool
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
