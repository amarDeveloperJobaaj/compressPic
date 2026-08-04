"use client";

import {
  ArrowRight,
  Eye,
  Loader2,
  Save,
  Send,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Capsule } from "@/components/ui/capsule";
import type { BlogBlock, BlogPost } from "@/lib/blog/types";
import { slugify } from "@/lib/blog/utils";
import { BlockEditor } from "./BlockEditor";
import { cn } from "@/lib/utils";

/** Passed from the server page (service is server-only). */
const FALLBACK_CATEGORIES = [
  "Image Editing",
  "Developer Tools",
  "SEO & Marketing",
  "Finance & Calculators",
  "YouTube Creators",
  "Guides & How-Tos",
];

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-xl border border-border bg-background/50 px-3.5 py-2.5"
    >
      <span className="text-sm font-medium text-text-primary">{label}</span>
      <span
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-border"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
            checked ? "left-[18px]" : "left-0.5"
          )}
        />
      </span>
    </button>
  );
}

export function BlogEditor({
  initial,
  categories = FALLBACK_CATEGORIES,
}: {
  initial?: BlogPost;
  categories?: string[];
}) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [cover, setCover] = useState(initial?.cover ?? "");
  const [coverAlt, setCoverAlt] = useState(initial?.coverAlt ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Image Editing");
  const [tags, setTags] = useState(initial?.tags.join(", ") ?? "");
  const [author, setAuthor] = useState(initial?.author ?? "Amar Lodhi");
  const [authorRole, setAuthorRole] = useState(initial?.authorRole ?? "Founder, Vizo Tool");
  const [publishedDate, setPublishedDate] = useState(
    initial ? initial.publishedAt.slice(0, 10) : new Date().toISOString().slice(0, 10)
  );

  const [status] = useState<"published" | "draft">(initial?.status ?? "draft");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [trending, setTrending] = useState(initial?.trending ?? false);
  const [editorsPick, setEditorsPick] = useState(initial?.editorsPick ?? false);

  const [metaTitle, setMetaTitle] = useState(initial?.seo?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.seo?.metaDescription ?? "");
  const [keywords, setKeywords] = useState(initial?.seo?.keywords?.join(", ") ?? "");
  const [ogImage, setOgImage] = useState(initial?.seo?.ogImage ?? "");
  const [twitterImage, setTwitterImage] = useState(initial?.seo?.twitterImage ?? "");

  const [blocks, setBlocks] = useState<BlogBlock[]>(initial?.content ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const generateSlug = () => {
    if (title.trim()) setSlug(slugify(title));
  };

  const save = async (targetStatus: "published" | "draft") => {
    setError("");
    setNotice("");
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    const finalSlug = slug || slugify(title) || "untitled-post";
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: finalSlug,
        subtitle,
        excerpt,
        cover: cover.trim() || undefined,
        coverAlt,
        category,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        author: author.trim() || "Amar Lodhi",
        authorRole,
        publishedAt: publishedDate ? new Date(`${publishedDate}T00:00:00`).toISOString() : undefined,
        status: targetStatus,
        featured,
        trending,
        editorsPick,
        seo: {
          metaTitle: metaTitle.trim() || undefined,
          metaDescription: metaDescription.trim() || undefined,
          keywords: keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
          ogImage: ogImage.trim() || undefined,
          twitterImage: twitterImage.trim() || undefined,
        },
        content: blocks,
      };

      const res = await fetch(
        isEdit && initial ? `/api/admin/blogs/${initial.id}` : "/api/admin/blogs",
        {
          method: isEdit && initial ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Failed to save");
        return;
      }
      setNotice(targetStatus === "published" ? "Published! 🎉" : "Draft saved.");
      setSlug(finalSlug);
      setTimeout(() => router.push("/admin/blogs"), 600);
    } catch {
      setError("Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!initial) return;
    if (!confirm("Delete this post permanently?")) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/blogs/${initial.id}`, { method: "DELETE" });
      router.push("/admin/blogs");
    } catch {
      setError("Failed to delete.");
      setSaving(false);
    }
  };

  const inputClass =
    "h-10 w-full rounded-xl border border-border bg-background/60 px-3.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-xl font-bold text-text-primary">
            {isEdit ? "Edit blog" : "Create blog"}
            <Capsule variant={status === "published" ? "success" : "warning"} sm>
              {status}
            </Capsule>
          </h1>
          <p className="mt-0.5 text-sm text-text-muted">
            {isEdit ? `Editing /blog/${initial?.slug}` : "Compose with rich blocks and live tool embeds."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {status === "published" && initial && (
            <Link
              href={`/blog/${initial.slug}`}
              target="_blank"
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Eye className="h-4 w-4" /> Preview
            </Link>
          )}
          <button
            type="button"
            onClick={() => void save("draft")}
            disabled={saving}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-text-secondary transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save draft
          </button>
          <button
            type="button"
            onClick={() => void save("published")}
            disabled={saving}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-error/40 bg-error-light/60 px-4 py-3 text-sm font-medium text-error" role="alert">
          {error}
        </div>
      )}
      {notice && (
        <div className="rounded-xl border border-success/40 bg-success-light/60 px-4 py-3 text-sm font-medium text-success" role="status">
          {notice}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left column */}
        <div className="min-w-0 space-y-6">
          {/* Main fields */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-text-primary">
              <Sparkles className="h-4 w-4 text-primary" /> Content
            </h2>
            <div className="space-y-3.5">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-text-primary">Title *</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="How to compress images without losing quality"
                  className={inputClass}
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-text-primary">Slug</span>
                  <div className="flex gap-2">
                    <input
                      value={slug}
                      onChange={(e) => setSlug(slugify(e.target.value) || e.target.value)}
                      placeholder="auto-generated"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={generateSlug}
                      title="Generate from title"
                      aria-label="Generate slug from title"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      <Wand2 className="h-4 w-4" />
                    </button>
                  </div>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-text-primary">Category</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClass}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-text-primary">Subtitle</span>
                <input
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="One-line summary shown under the title"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-text-primary">Excerpt</span>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  placeholder="Used in cards, search and meta descriptions"
                  className="w-full resize-y rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-text-primary">Cover URL</span>
                  <input
                    value={cover}
                    onChange={(e) => setCover(e.target.value)}
                    placeholder="/og?title=… or https://…"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-text-primary">Cover alt</span>
                  <input
                    value={coverAlt}
                    onChange={(e) => setCoverAlt(e.target.value)}
                    placeholder="Describe the cover image"
                    className={inputClass}
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-text-primary">Author</span>
                  <input value={author} onChange={(e) => setAuthor(e.target.value)} className={inputClass} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-text-primary">Author role</span>
                  <input value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} className={inputClass} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-text-primary">Tags (comma)</span>
                  <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="compression, webp"
                    className={inputClass}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Blocks */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-bold text-text-primary">
                <ArrowRight className="h-4 w-4 text-primary" /> Content blocks
              </h2>
              <span className="text-xs text-text-muted">{blocks.length} blocks</span>
            </div>
            <BlockEditor blocks={blocks} onChange={setBlocks} />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-text-primary">Visibility</h2>
            <div className="space-y-2">
              <Toggle label="Featured" checked={featured} onChange={setFeatured} />
              <Toggle label="Trending" checked={trending} onChange={setTrending} />
              <Toggle label="Editor's pick" checked={editorsPick} onChange={setEditorsPick} />
              <label className="block pt-2">
                <span className="mb-1.5 block text-sm font-medium text-text-primary">Published date</span>
                <input
                  type="date"
                  value={publishedDate}
                  onChange={(e) => setPublishedDate(e.target.value)}
                  className={inputClass}
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-text-primary">SEO overrides</h2>
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-text-muted">Meta title</span>
                <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Defaults to the title" className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-text-muted">Meta description</span>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  placeholder="Defaults to the excerpt"
                  className="w-full resize-y rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-text-muted">Keywords (comma)</span>
                <input value={keywords} onChange={(e) => setKeywords(e.target.value)} className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-text-muted">OG image URL</span>
                <input value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="Defaults to cover" className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-text-muted">Twitter image URL</span>
                <input value={twitterImage} onChange={(e) => setTwitterImage(e.target.value)} className={inputClass} />
              </label>
            </div>
          </div>

          {isEdit && initial && (
            <button
              type="button"
              onClick={() => void remove()}
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-error/40 bg-error-light/50 px-4 py-3 text-sm font-semibold text-error transition-colors hover:bg-error-light disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" /> Delete post
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
