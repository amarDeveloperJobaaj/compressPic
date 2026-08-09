"use client";

import {
  Check,
  Globe,
  Linkedin,
  Loader2,
  Mail,
  Pencil,
  Plus,
  Trash2,
  Twitter,
  UserRound,
  X,
} from "lucide-react";
import { useState, useTransition } from "react";
import { deleteAuthorAction, saveAuthorAction } from "@/lib/blog/actions";
import type { BlogAuthor } from "@/lib/blog/types";

const inputClass =
  "h-10 w-full rounded-xl border border-border bg-background/60 px-3.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const EMPTY = {
  name: "",
  slug: "",
  role: "Author",
  bio: "",
  avatarUrl: "",
  email: "",
  twitter: "",
  website: "",
  instagram: "",
  linkedin: "",
};

export function AuthorsManager({ initial }: { initial: BlogAuthor[] }) {
  const authors = initial;
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<BlogAuthor | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const set = (key: keyof typeof EMPTY) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = () => {
    setError("");
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    startTransition(async () => {
      const res = await saveAuthorAction(
        {
          name: form.name.trim(),
          slug: form.slug.trim() || undefined,
          role: form.role.trim() || "Author",
          bio: form.bio.trim() || undefined,
          avatarUrl: form.avatarUrl.trim() || undefined,
          email: form.email.trim() || undefined,
          twitter: form.twitter.trim() || undefined,
          website: form.website.trim() || undefined,
          instagram: form.instagram.trim() || undefined,
          linkedin: form.linkedin.trim() || undefined,
        },
        editing?.slug
      );
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setNotice(editing ? "Author updated." : "Author created.");
      window.location.reload();
    });
  };

  const remove = (author: BlogAuthor) => {
    if (!author.slug) return;
    if (!confirm(`Delete the author “${author.name}”?`)) return;
    startTransition(async () => {
      const res = await deleteAuthorAction(author.slug!);
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
        <p className="text-sm text-text-muted">{authors.length} authors</p>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setForm({ ...EMPTY });
            setShowForm(true);
          }}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> Add author
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
            {editing ? `Edit “${editing.name}”` : "New author"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-primary">Name *</span>
              <input value={form.name} onChange={(e) => set("name")(e.target.value)} className={inputClass} placeholder="Amar Lodhi" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-primary">Slug</span>
              <input value={form.slug} onChange={(e) => set("slug")(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} className={inputClass} placeholder="amar-lodhi" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-primary">Role</span>
              <input value={form.role} onChange={(e) => set("role")(e.target.value)} className={inputClass} placeholder="Founder, Vizo Tool" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-primary">Email</span>
              <input type="email" value={form.email} onChange={(e) => set("email")(e.target.value)} className={inputClass} placeholder="amar@vizotool.com" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-primary">Twitter / X</span>
              <input value={form.twitter} onChange={(e) => set("twitter")(e.target.value)} className={inputClass} placeholder="https://x.com/…" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-primary">Website</span>
              <input value={form.website} onChange={(e) => set("website")(e.target.value)} className={inputClass} placeholder="https://…" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-primary">LinkedIn</span>
              <input value={form.linkedin} onChange={(e) => set("linkedin")(e.target.value)} className={inputClass} placeholder="https://linkedin.com/in/…" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-primary">Instagram</span>
              <input value={form.instagram} onChange={(e) => set("instagram")(e.target.value)} className={inputClass} placeholder="https://instagram.com/…" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-primary">Avatar URL</span>
              <input
                value={form.avatarUrl}
                onChange={(e) => set("avatarUrl")(e.target.value)}
                className={inputClass}
                placeholder="https://…/avatar.png"
              />
            </label>
          </div>
          <label className="mt-3 block">
            <span className="mb-1.5 block text-sm font-medium text-text-primary">Bio</span>
            <textarea
              value={form.bio}
              onChange={(e) => set("bio")(e.target.value)}
              rows={2}
              placeholder="A short bio shown on the author card"
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

      {authors.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <UserRound className="mx-auto h-8 w-8 text-text-muted" />
          <p className="mt-2 font-semibold text-text-primary">No authors yet</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {authors.map((author) => (
            <div
              key={author.slug ?? author.id ?? author.name}
              className="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                {author.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={author.avatarUrl}
                    alt={author.name}
                    className="h-12 w-12 rounded-full border border-border object-cover shadow-md"
                  />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 text-lg font-bold text-white shadow-md">
                    {author.name.charAt(0)}
                  </span>
                )}
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(author);
                      setForm({
                        name: author.name,
                        slug: author.slug ?? "",
                        role: author.role,
                        bio: author.bio,
                        avatarUrl: author.avatarUrl ?? "",
                        email: author.email ?? "",
                        twitter: author.twitter ?? "",
                        website: author.website ?? "",
                        instagram: author.instagram ?? "",
                        linkedin: author.linkedin ?? "",
                      });
                      setShowForm(true);
                    }}
                    aria-label={`Edit ${author.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(author)}
                    aria-label={`Delete ${author.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-error/50 hover:text-error"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="mt-3 font-semibold text-text-primary">{author.name}</h3>
              <p className="text-xs font-medium text-primary">{author.role}</p>
              {author.bio && <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-text-secondary">{author.bio}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {author.email && (
                  <a href={`mailto:${author.email}`} aria-label="Email" className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-primary/40 hover:text-primary">
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                )}
                {author.twitter && (
                  <a href={author.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-primary/40 hover:text-primary">
                    <Twitter className="h-3.5 w-3.5" />
                  </a>
                )}
                {author.website && (
                  <a href={author.website} target="_blank" rel="noopener noreferrer" aria-label="Website" className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-primary/40 hover:text-primary">
                    <Globe className="h-3.5 w-3.5" />
                  </a>
                )}
                {author.linkedin && (
                  <a href={author.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-primary/40 hover:text-primary">
                    <Linkedin className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
