"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Sparkles, ShieldCheck, Layers } from "lucide-react";
import { useBackgroundRemoverStore } from "@/store/background-remover-store";
import { useToast } from "@/features/playground/components/Toast";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFiles = useBackgroundRemoverStore((s) => s.addFiles);
  const { toast } = useToast();

  const validateAndAdd = useCallback(
    (files: File[]) => {
      const accepted = files.filter((file) => {
        if (!ACCEPTED_TYPES.includes(file.type)) return false;
        if (file.size > MAX_SIZE) return false;
        return true;
      });
      if (accepted.length === 0) {
        toast("Please add JPG, PNG, or WEBP images up to 50 MB.", "error");
        return;
      }
      addFiles(accepted);
      if (accepted.length === 1) {
        toast("Image added — removing background…");
      } else {
        toast(`${accepted.length} images added to the batch queue.`);
      }
    },
    [addFiles, toast]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files ?? []);
      if (files.length > 0) validateAndAdd(files);
    },
    [validateAndAdd]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length > 0) validateAndAdd(files);
      e.target.value = "";
    },
    [validateAndAdd]
  );

  // Paste from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length > 0) validateAndAdd(files);
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [validateAndAdd]);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        multiple
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all duration-300 sm:p-14 ${
          isDragging
            ? "border-primary bg-primary-light shadow-lg shadow-primary/10"
            : "border-border bg-surface hover:border-primary/50 hover:bg-primary-light/50"
        }`}
        aria-label="Upload images to remove the background"
      >
        {isDragging && (
          <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-3xl animate-pulse" />
        )}
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
            isDragging
              ? "bg-primary text-white scale-110"
              : "bg-primary-light text-primary group-hover:bg-primary group-hover:text-white"
          }`}
        >
          <Upload className="h-8 w-8" />
        </div>
        <p className="mt-4 text-lg font-semibold text-text-primary">
          {isDragging ? "Drop your images here" : "Drop images here"}
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          or click to browse &middot; JPG, PNG, WEBP &middot; up to 50 MB each
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-text-muted">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 font-medium text-primary">
            <Sparkles className="h-3 w-3" /> AI Detection
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1 font-medium text-success">
            <ShieldCheck className="h-3 w-3" /> 100% Private
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 font-medium">
            <Layers className="h-3 w-3" /> Batch Mode
          </span>
        </div>
      </button>
    </>
  );
}
