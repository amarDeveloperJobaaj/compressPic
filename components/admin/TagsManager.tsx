"use client";

import {
  Check,
  GitMerge,
  Hash,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import {
  deleteTagAction,
  mergeTagsAction,
  saveTagAction,
} from "@/lib/blog/actions";
import { Capsule } from "@/components/ui/capsule";
import { cn } from "@/lib/utils";

export interface AdminTag {
  id: string;
  slug: string;
  name: string;
  count: number;
}

const inputClass =
  "h-10 w-full rounded-xl border border-border bg-background/60 px-3.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export function TagsManager({ initial }: { initial: AdminTag[] }) {
  const tags = initial;
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminTag | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [mergeMode, setMergeMode] = useState(false);

  const filtered = useMemo(
    () => tags.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()) || t.slug.includes(query.toLowerCase())),
    [tags, query]
  );

  const submit = () => {
    setError("");
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    startTransition(async () => {
      const res = await saveTagAction(
        { name: name.trim(), slug: slug.trim() || undefined },
        editing?.slug
      );
      if (!res.ok) {
        setError(res.error);
        return;
      }
      window.location.reload();
    });
  };

  const remove = (tag: AdminTag) => {
    if (!confirm(`Delete tag “${tag.name}”? Posts keep their tag labels.`)) return;
    startTransition(async () => {
      const res = await deleteTagAction(tag.slug);
      if (!res.ok) setError(res.error);
      window.location.reload();
    });
  };

  const merge = (source: AdminTag, target: AdminTag) => {
    if (source.slug === target.slug) return;
    if (!confirm(`Merge “${source.name}” into “${target.name}”?`)) return;
    startTransition(async () => {
      const res = await mergeTagsAction(source.slug, target.slug);
      if (!res.ok) setError(res.error);
      window.location.reload();
    });
  };

  return (
    <div className="space-y-4">
      {notice && (
        <div className="flex items-center justify-between rounded-xl border border-success/40 bg-success-light/60 px-4 py-3 text-sm font-medium text-success">
          {notice}
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-error/40 bg-error-light/60 px-4 py-3 text-sm font-medium text-error">
          {error}
          <button type="button" onClick={() => setError("")} aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tags…"
            aria-label="Search tags"
            className="h-10 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-64"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMergeMode((m) => !m)}
            className={cn(
              "inline-flex h-10 items-center gap-1.5 rounded-xl border px-4 text-sm font-semibold transition-colors",
              mergeMode
                ? "border-violet-400/50 bg-violet-500/10 text-violet-600"
                : "border-border text-text-secondary hover:border-primary/40 hover:text-primary"
            )}
          >
            <GitMerge className="h-4 w-4" /> Merge
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setName("");
              setSlug("");
              setShowForm(true);
            }}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" /> Add tag
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-surface p-5"
        >
          <h2 className="mb-4 text-sm font-bold text-text-primary">
            {editing ? `Edit “${editing.name}”` : "New tag"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-primary">Name *</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="webp" className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-primary">Slug</span>
              <input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="webp" className={inputClass} />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark disabled:opacity-50"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {editing ? "Save changes" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border px-4 text-sm font-semibold text-text-secondary hover:border-primary/40 hover:text-primary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {mergeMode && (
        <div className="rounded-2xl border border-violet-400/30 bg-violet-500/5 p-5">
          <p className="text-sm font-semibold text-text-primary">
            Merge mode — click a source tag, then the target tag it should merge into.
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Every post using the source tag is re-pointed to the target; the source tag is then removed.
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Hash className="mx-auto h-8 w-8 text-text-muted" />
            <p className="mt-2 font-semibold text-text-primary">No tags found</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((tag) => (
              <li key={tag.slug} className="flex flex-wrap items-center gap-3 px-4 py-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <Hash className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text-primary">{tag.name}</p>
                  <p className="truncate text-xs text-text-muted">#{tag.slug}</p>
                </div>
                <Capsule variant="sky" sm glow={false}>
                  {tag.count} post{tag.count === 1 ? "" : "s"}
                </Capsule>

                {mergeMode ? (
                  <div className="flex items-center gap-1.5">
                    {filtered
                      .filter((t) => t.slug !== tag.slug)
                      .slice(0, 4)
                      .map((target) => (
                        <button
                          key={target.slug}
                          type="button"
                          onClick={() => merge(tag, target)}
                          className="rounded-lg border border-violet-400/40 bg-violet-500/10 px-2.5 py-1.5 text-xs font-semibold text-violet-600 transition-colors hover:bg-violet-500/20"
                        >
                          {target.name}
                        </button>
                      ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(tag);
                        setName(tag.name);
                        setSlug(tag.slug);
                        setShowForm(true);
                      }}
                      aria-label={`Edit ${tag.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(tag)}
                      aria-label={`Delete ${tag.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-error/50 hover:text-error"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
