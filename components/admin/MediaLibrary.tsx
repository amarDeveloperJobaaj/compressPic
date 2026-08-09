"use client";

import {
  Clipboard,
  CloudUpload,
  Copy,
  Image as ImageIcon,
  Loader2,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Capsule } from "@/components/ui/capsule";
import { cn } from "@/lib/utils";

interface MediaItem {
  name: string;
  path: string;
  size: number;
  url: string;
  updatedAt: string;
}

export function MediaLibrary({ storageMode }: { storageMode: "memory" | "supabase" }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    if (storageMode !== "supabase") {
      setLoading(false);
      return;
    }
    setError("");
    try {
      const res = await fetch("/api/admin/media", { cache: "no-store" });
      const data = (await res.json()) as { ok?: boolean; items?: MediaItem[]; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed to load");
      setItems(data.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load media");
    } finally {
      setLoading(false);
    }
  }, [storageMode]);

  useEffect(() => {
    // Deferred so setState never runs synchronously inside the effect.
    const id = setTimeout(() => void load(), 0);
    return () => clearTimeout(id);
  }, [load]);

  const upload = useCallback(
    async (files: FileList | File[]) => {
      if (storageMode !== "supabase") return;
      setUploading(true);
      setError("");
      try {
        for (const file of Array.from(files)) {
          if (!file.type.startsWith("image/")) continue;
          const form = new FormData();
          form.append("file", file);
          const res = await fetch("/api/admin/media", { method: "POST", body: form });
          const data = (await res.json()) as { ok?: boolean; error?: string };
          if (!res.ok || !data.ok) throw new Error(data.error ?? "Upload failed");
        }
        await load();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [load, storageMode]
  );

  const remove = async (item: MediaItem) => {
    if (!confirm(`Delete “${item.name}”?`)) return;
    setError("");
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: item.path }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Delete failed");
      setItems((prev) => prev.filter((i) => i.path !== item.path));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const copyUrl = async (item: MediaItem) => {
    try {
      await navigator.clipboard.writeText(item.url);
    } catch {
      /* ignore */
    }
    setCopied(item.name);
    setTimeout(() => setCopied(null), 1600);
  };

  const filtered = useMemo(
    () => items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  );

  if (storageMode !== "supabase") {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface/60 p-10 text-center">
        <CloudUpload className="mx-auto h-10 w-10 text-text-muted" />
        <h2 className="mt-3 font-bold text-text-primary">Media library is ready for Supabase</h2>
        <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-text-muted">
          Add your Supabase credentials to <code className="font-mono text-xs">.env.local</code>, set{" "}
          <code className="font-mono text-xs">BLOG_STORAGE=supabase</code>, and run{" "}
          <code className="font-mono text-xs">supabase/storage.sql</code>. Uploads, previews and copy-URL will all light up automatically.
        </p>
      </div>
    );
  }

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

      {/* Upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void upload(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all",
          dragOver
            ? "border-primary bg-primary/10"
            : "border-border bg-surface/60 hover:border-primary/50 hover:bg-primary/5"
        )}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
          {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <CloudUpload className="h-6 w-6" />}
        </span>
        <p className="mt-3 text-sm font-semibold text-text-primary">
          {uploading ? "Uploading…" : "Drop images here or click to browse"}
        </p>
        <p className="mt-1 text-xs text-text-muted">PNG, JPG, WEBP, GIF, AVIF · up to 50 MB · stored in Supabase Storage</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void upload(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-muted">
          {items.length} file{items.length === 1 ? "" : "s"}
        </p>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search media…"
            aria-label="Search media"
            className="h-10 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-64"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading media…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <ImageIcon className="mx-auto h-8 w-8 text-text-muted" />
          <p className="mt-2 font-semibold text-text-primary">No images yet</p>
          <p className="mt-1 text-sm text-text-muted">Upload your first image above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <div
              key={item.name}
              className="group overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-video bg-background/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/50 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => copyUrl(item)}
                    aria-label="Copy URL"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-text-primary transition-colors hover:bg-white"
                  >
                    {copied === item.name ? <Clipboard className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    aria-label="Delete"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/90 text-white transition-colors hover:bg-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="px-3 py-2.5">
                <p className="truncate text-xs font-semibold text-text-primary" title={item.name}>
                  {item.name}
                </p>
                <p className="mt-0.5 text-[11px] text-text-muted">
                  {(item.size / 1024).toFixed(0)} KB
                  {copied === item.name && <Capsule variant="success" sm glow={false} className="ml-1">copied</Capsule>}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
