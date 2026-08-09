"use client";

import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  FilePlus2,
  Loader2,
  Pencil,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Capsule } from "@/components/ui/capsule";
import type { BlogSummary } from "@/lib/blog/service";
import { cn } from "@/lib/utils";

type Status = "all" | "published" | "draft" | "scheduled" | "trash";

export function BlogsManager({ initialStatus = "all" }: { initialStatus?: Status }) {
  const [posts, setPosts] = useState<BlogSummary[] | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>(initialStatus);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{ total: number; totalPages: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const mountedRef = useRef(false);

  const load = async (q = query, s = status, p = page) => {
    setError("");
    try {
      if (s === "trash") {
        const res = await fetch("/api/admin/blogs/trash", { cache: "no-store" });
        const data = (await res.json()) as { ok?: boolean; posts?: BlogSummary[]; error?: string };
        if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed to load");
        const filtered = q.trim()
          ? (data.posts ?? []).filter((p) =>
              [p.title, p.slug, p.category].join(" ").toLowerCase().includes(q.toLowerCase())
            )
          : (data.posts ?? []);
        setPosts(filtered);
        setMeta({ total: filtered.length, totalPages: 1 });
        setLoading(false);
        return;
      }
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (s !== "all") params.set("status", s);
      if (p > 1) params.set("page", String(p));
      const res = await fetch(`/api/admin/blogs?${params.toString()}`);
      const data = (await res.json()) as {
        ok?: boolean;
        posts?: BlogSummary[];
        meta?: { total?: number; totalPages?: number };
        error?: string;
      };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed to load");
      setPosts(data.posts ?? []);
      setMeta({ total: data.meta?.total ?? (data.posts ?? []).length, totalPages: data.meta?.totalPages ?? 1 });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    // Deferred so setState never runs synchronously inside the effect.
    const id = setTimeout(() => void load(), 0);
    return () => {
      mountedRef.current = false;
      clearTimeout(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;
    setPage(1);
    setSelected(new Set());
    const t = setTimeout(() => void load(query, status, 1), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, status]);

  useEffect(() => {
    if (!mountedRef.current || page <= 1) return;
    void load(query, status, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const action = async (id: string, fn: () => Promise<Response>, then?: () => void) => {
    setBusyId(id);
    try {
      const res = await fn();
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Action failed");
        return;
      }
      then?.();
      await load();
    } catch {
      setError("Network error");
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(
    () =>
      (posts ?? []).filter((p) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return [p.title, p.slug, p.category, p.tags.join(" ")].join(" ").toLowerCase().includes(q);
      }),
    [posts, query]
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-surface p-1">
          {(["all", "published", "draft", "scheduled", "trash"] as Status[]).map((s) => (
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
              placeholder="Search blogs…"
              aria-label="Search blogs"
              className="h-10 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-64"
            />
          </div>
          <Link
            href="/admin/blogs/add"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark"
          >
            <FilePlus2 className="h-4 w-4" /> New
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-error/40 bg-error-light/60 px-4 py-3 text-sm font-medium text-error">
          {error}
          <button type="button" onClick={() => setError("")} aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Bulk actions */}
      {status !== "trash" && selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5">
          <span className="text-sm font-semibold text-text-primary">{selected.size} selected</span>
          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            {([
              { label: "Publish", action: "publish" },
              { label: "Draft", action: "draft" },
              { label: "Archive", action: "archive" },
              { label: "Delete", action: "delete" },
            ] as const).map((b) => (
              <button
                key={b.action}
                type="button"
                disabled={busyId !== null}
                onClick={() => {
                  if (b.action === "delete" && !confirm(`Move ${selected.size} post(s) to the trash?`)) return;
                  setBusyId("bulk");
                  fetch("/api/admin/blogs/bulk", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ids: [...selected], action: b.action }),
                  })
                    .then((r) => r.json())
                    .then((data: { ok?: boolean; error?: string }) => {
                      if (!data.ok) setError(data.error ?? "Bulk action failed");
                      setSelected(new Set());
                      void load();
                    })
                    .finally(() => setBusyId(null));
                }}
                className={cn(
                  "inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-medium transition-colors disabled:opacity-50",
                  b.action === "delete"
                    ? "border-error/40 bg-error-light/50 text-error hover:bg-error-light"
                    : "border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-primary"
                )}
              >
                {busyId === "bulk" ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                {b.label}
              </button>
            ))}
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
        {loading && !posts ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-text-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading blogs…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-semibold text-text-primary">No blogs found</p>
            <p className="mt-1 text-sm text-text-muted">Try a different search or create a new post.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((post) => (
              <li key={post.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center">
                {status !== "trash" && (
                  <input
                    type="checkbox"
                    checked={selected.has(post.id)}
                    onChange={(e) =>
                      setSelected((prev) => {
                        const next = new Set(prev);
                        if (e.target.checked) next.add(post.id);
                        else next.delete(post.id);
                        return next;
                      })
                    }
                    aria-label={`Select ${post.title}`}
                    className="h-4 w-4 shrink-0 rounded border-border accent-primary"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/blogs/edit/${post.id}`}
                      className="truncate text-sm font-semibold text-text-primary hover:text-primary"
                    >
                      {post.title}
                    </Link>
                    <Capsule
                      variant={post.status === "published" ? "success" : "warning"}
                      sm
                      glow={false}
                    >
                      {post.status}
                    </Capsule>
                    {post.featured && (
                      <Capsule variant="amber" sm glow={false}>Featured</Capsule>
                    )}
                  </div>
                  <p className="mt-1 truncate text-xs text-text-muted">
                    /blog/{post.slug} · {post.category} · {post.readTime} · updated{" "}
                    {new Date(post.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {status === "trash" ? (
                    <>
                      <button
                        type="button"
                        disabled={busyId === post.id}
                        onClick={() =>
                          action(post.id, () =>
                            fetch("/api/admin/blogs/trash", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ id: post.id, action: "restore" }),
                            })
                          )
                        }
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-success/40 bg-success-light/50 px-2.5 text-xs font-medium text-success transition-colors hover:bg-success-light disabled:opacity-50"
                      >
                        {busyId === post.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
                        Restore
                      </button>
                      <button
                        type="button"
                        disabled={busyId === post.id}
                        onClick={() => {
                          if (!confirm(`Permanently delete “${post.title}”? This cannot be undone.`)) return;
                          void action(post.id, () =>
                            fetch("/api/admin/blogs/trash", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ id: post.id, action: "purge" }),
                            })
                          );
                        }}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-error/40 bg-error-light/50 px-2.5 text-xs font-medium text-error transition-colors hover:bg-error-light disabled:opacity-50"
                      >
                        {busyId === post.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                        Delete forever
                      </button>
                    </>
                  ) : post.status === "published" ? (
                    <button
                      type="button"
                      disabled={busyId === post.id}
                      onClick={() =>
                        action(post.id, () =>
                          fetch(`/api/admin/blogs/${post.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status: "draft" }),
                          })
                        )
                      }
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-xs font-medium text-text-secondary transition-colors hover:border-warning/50 hover:text-warning disabled:opacity-50"
                    >
                      {busyId === post.id ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                      Unpublish
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={busyId === post.id}
                      onClick={() =>
                        action(post.id, () =>
                          fetch(`/api/admin/blogs/${post.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status: "published" }),
                          })
                        )
                      }
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-success/40 bg-success-light/50 px-2.5 text-xs font-medium text-success transition-colors hover:bg-success-light disabled:opacity-50"
                    >
                      {busyId === post.id ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                      Publish
                    </button>
                  )}

                  <Link
                    href={`/admin/blogs/edit/${post.id}`}
                    aria-label={`Edit ${post.title}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    aria-label={`Preview ${post.title}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                  {status !== "trash" && (
                    <button
                      type="button"
                      disabled={busyId === post.id}
                      onClick={() => {
                        if (confirmDelete !== post.id) {
                          setConfirmDelete(post.id);
                          return;
                        }
                        setConfirmDelete(null);
                        void action(post.id, () => fetch(`/api/admin/blogs/${post.id}`, { method: "DELETE" }));
                      }}
                      aria-label={confirmDelete === post.id ? `Confirm delete ${post.title}` : `Delete ${post.title}`}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                        confirmDelete === post.id
                          ? "border-error/60 bg-error-light text-error"
                          : "border-border text-text-secondary hover:border-error/50 hover:text-error"
                      )}
                      onMouseLeave={() => setConfirmDelete(null)}
                      onBlur={() => setConfirmDelete(null)}
                    >
                      {confirmDelete === post.id ? (
                        <span className="text-[10px] font-bold">Sure?</span>
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                  {status !== "trash" && (
                    <button
                      type="button"
                      disabled={busyId === post.id}
                      onClick={() =>
                        action(post.id, () =>
                          fetch(`/api/admin/blogs/${post.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ duplicate: true }),
                          })
                        )
                      }
                      aria-label={`Duplicate ${post.title}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-2.5">
          <p className="text-xs text-text-muted">
            Page {page} of {meta.totalPages} · {meta.total} posts
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              aria-label="Next page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-text-muted">
        <ArrowUpRight className="mr-1 inline h-3 w-3" />
        Delete moves a post to the trash — restore it anytime from the Trash tab.
      </p>
    </div>
  );
}
