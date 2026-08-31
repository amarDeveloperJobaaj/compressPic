"use client";

import {
  ArrowUpRight,
  Eye,
  Loader2,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Capsule } from "@/components/ui/capsule";
import { SEED_DESIGNS, DESIGN_CATEGORIES } from "@/lib/vizodesign/seed";
import type { Design } from "@/lib/vizodesign/types";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "published" | "draft";

export function DesignsManager() {
  const [designs] = useState<Design[]>(SEED_DESIGNS);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const getCategoryName = (categoryId: string | null) =>
    DESIGN_CATEGORIES.find((c) => c.id === categoryId)?.name ?? "—";

  const filtered = useMemo(() => {
    return designs.filter((d) => {
      if (status !== "all" && d.status !== status) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return [d.name, d.slug, d.style_type, d.mood, d.tags.join(" "), getCategoryName(d.category_id)]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [designs, query, status]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAction = (id: string, label: string) => {
    setBusyId(id);
    // Placeholder — actual API calls will replace this.
    console.log(`${label} design:`, id);
    setTimeout(() => setBusyId(null), 500);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-surface p-1">
          {(["all", "published", "draft"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition-all",
                status === s ? "bg-primary text-white shadow-sm" : "text-text-secondary hover:text-primary"
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search designs…"
              aria-label="Search designs"
              className="h-10 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-64"
            />
          </div>
          <Link
            href="/admin/designs/add"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark"
          >
            Add Design
          </Link>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5">
          <span className="text-sm font-semibold text-text-primary">{selected.size} selected</span>
          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              disabled={busyId !== null}
              onClick={() => {
                if (!confirm(`Delete ${selected.size} design(s)?`)) return;
                setSelected(new Set());
              }}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-error/40 bg-error-light/50 px-2.5 text-xs font-medium text-error transition-colors hover:bg-error-light disabled:opacity-50"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-text-muted hover:text-text-primary"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-semibold text-text-primary">No designs found</p>
            <p className="mt-1 text-sm text-text-muted">Try a different search or add a new design.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-semibold uppercase tracking-wider text-text-muted">
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.size === filtered.length && filtered.length > 0}
                        onChange={(e) =>
                          setSelected(e.target.checked ? new Set(filtered.map((d) => d.id)) : new Set())
                        }
                        aria-label="Select all"
                        className="h-4 w-4 rounded border-border accent-primary"
                      />
                    </th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Views</th>
                    <th className="px-4 py-3 text-right">Copies</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((design) => (
                    <tr key={design.id} className="group hover:bg-primary-light/30">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(design.id)}
                          onChange={() => toggleSelect(design.id)}
                          aria-label={`Select ${design.name}`}
                          className="h-4 w-4 rounded border-border accent-primary"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <Link
                            href={`/admin/designs/edit/${design.slug}`}
                            className="font-semibold text-text-primary hover:text-primary"
                          >
                            {design.name}
                          </Link>
                          <span className="text-xs text-text-muted">/{design.slug}</span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {design.featured && (
                            <Capsule variant="amber" sm glow={false}>Featured</Capsule>
                          )}
                          {design.has_3d && (
                            <Capsule variant="primary" sm glow={false}>3D</Capsule>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{getCategoryName(design.category_id)}</td>
                      <td className="px-4 py-3">
                        <Capsule variant={design.status === "published" ? "success" : "warning"} sm glow={false}>
                          {design.status}
                        </Capsule>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-text-secondary">{design.view_count.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-text-secondary">{design.copy_count.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/designs/edit/${design.slug}`}
                            aria-label={`Edit ${design.name}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href={`/designs/${design.slug}`}
                            target="_blank"
                            aria-label={`Preview ${design.name}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            disabled={busyId === design.id}
                            onClick={() => handleAction(design.id, "toggle-publish")}
                            aria-label={design.status === "published" ? `Unpublish ${design.name}` : `Publish ${design.name}`}
                            className={cn(
                              "inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-medium transition-colors disabled:opacity-50",
                              design.status === "published"
                                ? "border-warning/40 bg-warning-light/50 text-warning hover:bg-warning-light"
                                : "border-success/40 bg-success-light/50 text-success hover:bg-success-light"
                            )}
                          >
                            {busyId === design.id ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                            {design.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            type="button"
                            disabled={busyId === design.id}
                            onClick={() => {
                              if (confirmDelete !== design.id) {
                                setConfirmDelete(design.id);
                                return;
                              }
                              setConfirmDelete(null);
                              handleAction(design.id, "delete");
                            }}
                            aria-label={confirmDelete === design.id ? `Confirm delete ${design.name}` : `Delete ${design.name}`}
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                              confirmDelete === design.id
                                ? "border-error/60 bg-error-light text-error"
                                : "border-border text-text-secondary hover:border-error/50 hover:text-error"
                            )}
                            onMouseLeave={() => setConfirmDelete(null)}
                            onBlur={() => setConfirmDelete(null)}
                          >
                            {confirmDelete === design.id ? (
                              <span className="text-[10px] font-bold">Sure?</span>
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="divide-y divide-border md:hidden">
              {filtered.map((design) => (
                <div key={design.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/designs/edit/${design.slug}`}
                        className="truncate text-sm font-semibold text-text-primary hover:text-primary"
                      >
                        {design.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-text-muted">/{design.slug}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <Capsule variant={design.status === "published" ? "success" : "warning"} sm glow={false}>
                          {design.status}
                        </Capsule>
                        {design.featured && (
                          <Capsule variant="amber" sm glow={false}>Featured</Capsule>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-text-muted">
                        {getCategoryName(design.category_id)} · {design.view_count.toLocaleString()} views · {design.copy_count.toLocaleString()} copies
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/designs/edit/${design.slug}`}
                        aria-label={`Edit ${design.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/designs/${design.slug}`}
                        target="_blank"
                        aria-label={`Preview ${design.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <p className="text-xs text-text-muted">
        <ArrowUpRight className="mr-1 inline h-3 w-3" />
        Using seed data — connect Supabase for persistent CRUD.
      </p>
    </div>
  );
}
