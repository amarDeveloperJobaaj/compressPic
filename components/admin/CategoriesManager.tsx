"use client";

import { Check, FolderOpen, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState, useTransition } from "react";
import { Capsule } from "@/components/ui/capsule";
import {
  deleteCategoryAction,
  saveCategoryAction,
} from "@/lib/blog/actions";
import type { BlogCategory } from "@/lib/blog/types";

type Row = BlogCategory & { count: number };

const inputClass =
  "h-10 w-full rounded-xl border border-border bg-background/60 px-3.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export function CategoriesManager({ initial }: { initial: Row[] }) {
  const rows = initial;
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Row | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  // Form state (shared between create + edit)
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const openCreate = () => {
    setEditing(null);
    setName("");
    setSlug("");
    setDescription("");
    setShowForm(true);
  };

  const openEdit = (row: Row) => {
    setEditing(row);
    setName(row.name);
    setSlug(row.slug);
    setDescription(row.description);
    setShowForm(true);
  };

  const submit = () => {
    setError("");
    setNotice("");
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    startTransition(async () => {
      const res = await saveCategoryAction(
        { name: name.trim(), slug: slug.trim() || undefined, description: description.trim() || undefined },
        editing?.slug
      );
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setNotice(editing ? "Category updated." : "Category created.");
      setShowForm(false);
      setEditing(null);
      // Full page refresh keeps the server list in sync with the repository.
      window.location.reload();
    });
  };

  const remove = (row: Row) => {
    setError("");
    if (!confirm(`Delete the category “${row.name}”? Posts keep their category label.`)) return;
    startTransition(async () => {
      const res = await deleteCategoryAction(row.slug);
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">{rows.length} categories</p>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> Add category
        </button>
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
            {editing ? `Edit “${editing.name}”` : "New category"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-primary">Name *</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Image Editing" className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-primary">Slug</span>
              <input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="image-editing" className={inputClass} />
            </label>
          </div>
          <label className="mt-3 block">
            <span className="mb-1.5 block text-sm font-medium text-text-primary">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Short summary shown on category pages"
              className="w-full resize-y rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>
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

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <FolderOpen className="mx-auto h-8 w-8 text-text-muted" />
          <p className="mt-2 font-semibold text-text-primary">No categories yet</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((row) => (
            <div
              key={row.slug}
              className="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <FolderOpen className="h-5 w-5" />
                </span>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => openEdit(row)}
                    aria-label={`Edit ${row.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(row)}
                    aria-label={`Delete ${row.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-error/50 hover:text-error"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="mt-3 font-semibold text-text-primary">{row.name}</h3>
              <p className="mt-0.5 text-xs text-text-muted">/{row.slug}</p>
              {row.description && (
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-text-secondary">{row.description}</p>
              )}
              <div className="mt-3">
                <Capsule variant="primary" sm glow={false}>
                  {row.count} post{row.count === 1 ? "" : "s"}
                </Capsule>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
