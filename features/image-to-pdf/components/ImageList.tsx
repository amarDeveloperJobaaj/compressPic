"use client";

import { ArrowDown, ArrowUp, Plus, Trash2, X } from "lucide-react";
import { useRef } from "react";
import { useImageToPdfStore } from "@/store/image-to-pdf-store";

/** Ordered list of images — each becomes a PDF page. Reorder, remove, or add more. */
export function ImageList() {
  const items = useImageToPdfStore((s) => s.items);
  const removeItem = useImageToPdfStore((s) => s.removeItem);
  const moveItem = useImageToPdfStore((s) => s.moveItem);
  const addFiles = useImageToPdfStore((s) => s.addFiles);
  const clearAll = useImageToPdfStore((s) => s.clearAll);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalMb = items.reduce((sum, item) => sum + item.size, 0) / (1024 * 1024);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">
            Images <span className="text-text-muted">({items.length})</span>
          </h2>
          <p className="text-[11px] text-text-muted">
            {items.length} page{items.length === 1 ? "" : "s"} ·{" "}
            {totalMb < 1 ? `${Math.round(totalMb * 1024)} KB` : `${totalMb.toFixed(1)} MB`}
          </p>
        </div>
        <button
          type="button"
          onClick={clearAll}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-error-light hover:text-error"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear all
        </button>
      </div>

      <ul className="max-h-[460px] divide-y divide-border overflow-y-auto">
        {items.map((item, index) => (
          <li key={item.id} className="flex items-center gap-3 px-5 py-3">
            {/* Page number */}
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-[11px] font-semibold text-primary">
              {index + 1}
            </span>

            {/* Thumbnail */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
              {item.decoding ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">{item.name}</p>
              <p className="text-xs text-text-muted">
                {item.decoding ? "Decoding HEIC…" : `${(item.size / 1024).toFixed(1)} KB`}
              </p>
            </div>

            {/* Reorder */}
            <div className="flex shrink-0 flex-col gap-0.5">
              <button
                type="button"
                onClick={() => moveItem(item.id, -1)}
                disabled={index === 0}
                aria-label={`Move ${item.name} up`}
                className="flex h-6 w-6 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-primary-light hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => moveItem(item.id, 1)}
                disabled={index === items.length - 1}
                aria-label={`Move ${item.name} down`}
                className="flex h-6 w-6 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-primary-light hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name}`}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-error-light hover:text-error"
            >
              <X className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      {/* Add more */}
      <div className="border-t border-border p-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-primary/60 hover:text-primary"
        >
          <Plus className="h-4 w-4" />
          Add more images
        </button>
      </div>
    </div>
  );
}
