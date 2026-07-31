"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UploadCloud, FileStack } from "lucide-react";
import { useImageToPdfStore } from "@/store/image-to-pdf-store";
import { cn } from "@/lib/utils";

/** Multi-file upload zone: drag & drop, browse, or paste — everything stays in the browser. */
export function UploadZone() {
  const addFiles = useImageToPdfStore((s) => s.addFiles);
  const error = useImageToPdfStore((s) => s.error);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      addFiles(files);
    },
    [addFiles]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files: File[] = [];
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length > 0) addFiles(files);
    },
    [addFiles]
  );

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload images"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "group cursor-pointer rounded-2xl border-2 border-dashed bg-surface p-12 text-center shadow-sm transition-all",
        isDragging
          ? "border-primary bg-primary-light/40 scale-[1.01]"
          : "border-border hover:border-primary/60 hover:bg-primary-light/20"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light transition-colors group-hover:bg-primary">
        <UploadCloud className="h-8 w-8 text-primary transition-colors group-hover:text-white" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-text-primary">
        Drop your images here
      </h3>
      <p className="mt-2 text-sm text-text-secondary">
        or <span className="font-medium text-primary">browse</span> from your device,
        or <span className="font-medium text-primary">paste</span> from the clipboard
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="rounded-full bg-background px-3 py-1 text-text-secondary">JPG</span>
        <span className="rounded-full bg-background px-3 py-1 text-text-secondary">PNG</span>
        <span className="rounded-full bg-background px-3 py-1 text-text-secondary">WEBP</span>
        <span className="rounded-full bg-background px-3 py-1 text-text-secondary">HEIC</span>
        <span className="rounded-full bg-background px-3 py-1 text-text-muted">up to 50 MB each</span>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-text-muted">
        <FileStack className="h-3.5 w-3.5" />
        Select multiple images — each becomes one PDF page, in the order shown
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-error-light px-4 py-2 text-sm text-error">{error}</p>
      )}
    </div>
  );
}
