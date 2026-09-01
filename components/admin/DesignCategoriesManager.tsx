"use client";

import { Check, FolderOpen, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Capsule } from "@/components/ui/capsule";
import { DESIGN_CATEGORIES, SEED_DESIGNS } from "@/lib/vizodesign/seed";
import type { DesignCategory } from "@/lib/vizodesign/types";


type Row = DesignCategory & { count: number };

const inputClass =
  "h-10 w-full rounded-xl border border-border bg-background/60 px-3.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

function buildRows(): Row[] {
  return DESIGN_CATEGORIES.map((cat) => ({
    ...cat,
    count: SEED_DESIGNS.filter((d) => d.category_id === cat.id).length,
  }));
}

export function DesignCategoriesManager() {
  const [rows, setRows] = useState<Row[]>(buildRows);
  const [editing, setEditing] = useState<Row | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

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
    setDescription(row.description ?? "");
    setShowForm(true);
  };

  const submit = () => {
    setError("");
    setNotice("");
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setPending(true);
    // Placeholder — seed data only. Will connect to Supabase later.
    setTimeout(() => {
      if (editing) {
        setRows((prev) =>
          prev.map((r) =>
            r.id === editing.id ? { ...r, name: name.trim(), slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, "-"), description: description.trim() || null } : r
          )
        );
        setNotice("Category updated.");
      } else {
        const newCat: Row = {
          id: `cat-${Date.now()}`,
          name: name.trim(),
          slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, "-"),
          description: description.trim() || null,
          sort_order: rows.length + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          count: 0,
        };
        setRows((prev) => [...prev, newCat]);
        setNotice("Category created.");
      }
      setShowForm(false);
      setEditing(null);
      setPending(false);
    }, 300);
  };

  const remove = (row: Row) => {
    setError("");
    if (!confirm(`Delete the category "${row.name}"? Designs keep their category label.`)) return;
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    setNotice("Category deleted.");
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
            {editing ? `Edit "${editing.name}"` : "New category"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-primary">Name *</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Modern SaaS" className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-primary">Slug</span>
              <input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="modern-saas" className={inputClass} />
            </label>
          </div>
          <label className="mt-3 block">
            <span className="mb-1.5 block text-sm font-medium text-text-primary">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Short summary for this category"
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
              key={row.id}
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
                  {row.count} design{row.count === 1 ? "" : "s"}
                </Capsule>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
