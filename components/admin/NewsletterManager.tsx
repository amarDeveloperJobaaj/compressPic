"use client";

import { Download, Loader2, Mail, Search, Trash2, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { deleteSubscriberAction } from "@/lib/blog/actions";
import { Capsule } from "@/components/ui/capsule";
import type { NewsletterSubscriber } from "@/lib/blog/types";

export function NewsletterManager({ initial }: { initial: NewsletterSubscriber[] }) {
  const rows = initial;
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const filtered = useMemo(
    () =>
      rows.filter(
        (s) =>
          s.email.toLowerCase().includes(query.toLowerCase()) ||
          s.source.toLowerCase().includes(query.toLowerCase())
      ),
    [rows, query]
  );

  const activeCount = rows.filter((s) => s.subscribed).length;

  const remove = (id: string) => {
    setBusyId(id);
    if (!confirm("Remove this subscriber?")) return;
    void deleteSubscriberAction(id)
      .then((res) => {
        if (!res.ok) setError(res.error);
      })
      .finally(() => window.location.reload());
  };

  const exportCsv = () => {
    const header = "email,source,subscribed,created_at";
    const lines = filtered.map((s) =>
      [s.email, s.source, s.subscribed ? "yes" : "no", s.createdAt]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-error/40 bg-error-light/60 px-4 py-3 text-sm font-medium text-error">
          {error}
          <button type="button" onClick={() => setError("")} aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Users className="h-4 w-4" />
          {activeCount} active subscriber{activeCount === 1 ? "" : "s"}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search subscribers…"
              aria-label="Search subscribers"
              className="h-10 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-64"
            />
          </div>
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border px-4 text-sm font-semibold text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Mail className="mx-auto h-8 w-8 text-text-muted" />
            <p className="mt-2 font-semibold text-text-primary">No subscribers yet</p>
            <p className="mt-1 text-sm text-text-muted">Subscribers appear here when people join from the blog newsletter card.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((sub) => (
              <li key={sub.id} className="flex flex-wrap items-center gap-3 px-4 py-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <Mail className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text-primary">{sub.email}</p>
                  <p className="truncate text-xs text-text-muted">
                    via {sub.source} · {new Date(sub.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <Capsule variant={sub.subscribed ? "success" : "warning"} sm glow={false}>
                  {sub.subscribed ? "Active" : "Unsubscribed"}
                </Capsule>
                <button
                  type="button"
                  disabled={busyId === sub.id}
                  onClick={() => remove(sub.id)}
                  aria-label={`Delete ${sub.email}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-error/50 hover:text-error disabled:opacity-50"
                >
                  {busyId === sub.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
