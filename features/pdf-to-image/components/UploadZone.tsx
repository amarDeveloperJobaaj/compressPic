"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText } from "lucide-react";
import { usePdfToImageStore } from "@/store/pdf-to-image-store";
import { cn } from "@/lib/utils";

/** PDF upload zone: drag & drop or browse — everything stays in the browser. */
export function UploadZone() {
  const setFile = usePdfToImageStore((s) => s.setFile);
  const error = usePdfToImageStore((s) => s.error);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setFile(files[0]);
    },
    [setFile]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload a PDF"
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
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light transition-colors group-hover:bg-primary">
        <UploadCloud className="h-8 w-8 text-primary transition-colors group-hover:text-white" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-text-primary">Drop your PDF here</h3>
      <p className="mt-2 text-sm text-text-secondary">
        or <span className="font-medium text-primary">browse</span> from your device
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="rounded-full bg-background px-3 py-1 text-text-secondary">PDF</span>
        <span className="rounded-full bg-background px-3 py-1 text-text-muted">up to 50 MB</span>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-text-muted">
        <FileText className="h-3.5 w-3.5" />
        Every page is converted to a high-resolution JPG or PNG image
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-error-light px-4 py-2 text-sm text-error">{error}</p>
      )}
    </div>
  );
}
