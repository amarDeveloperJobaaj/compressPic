"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, Plus } from "lucide-react";
import { isHeicFile } from "@/lib/heic";

const DEFAULT_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/avif",
];

interface MultiImageUploadZoneProps {
  onFiles: (files: File[]) => void;
  accept?: string[];
  fileInputAccept?: string;
  label?: string;
  ariaLabel?: string;
  compact?: boolean;
  maxFiles?: number;
}

export function MultiImageUploadZone({
  onFiles,
  accept = DEFAULT_ACCEPTED_TYPES,
  fileInputAccept = ".jpg,.jpeg,.png,.webp,.avif,.heic,.heif",
  label = "Drop images here",
  ariaLabel = "Upload images",
  compact = false,
  maxFiles = 50,
}: MultiImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback(
    (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      const valid: File[] = [];

      for (const file of files) {
        if (!accept.includes(file.type) && !isHeicFile(file)) {
          alert(
            `Skipping "${file.name}" — unsupported type. Please upload JPG, PNG, WEBP, AVIF, or HEIC images.`
          );
          continue;
        }
        valid.push(file);
      }

      if (valid.length > 0) {
        const remaining = maxFiles - valid.length;
        onFiles(valid.slice(0, maxFiles));
      }
    },
    [accept, maxFiles, onFiles]
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
      if (e.dataTransfer.files?.length) {
        validateFiles(e.dataTransfer.files);
      }
    },
    [validateFiles]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        validateFiles(e.target.files);
      }
      e.target.value = "";
    },
    [validateFiles]
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
      if (files.length > 0) validateFiles(files);
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [validateFiles]);

  if (compact) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept={fileInputAccept}
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
          className={`flex items-center gap-2 rounded-lg border border-dashed px-4 py-2 text-sm transition-all ${
            isDragging
              ? "border-primary bg-primary-light text-primary"
              : "border-border text-text-secondary hover:border-primary/50 hover:text-primary"
          }`}
          aria-label={ariaLabel}
        >
          <Plus className="h-4 w-4" />
          Add More
        </button>
      </>
    );
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={fileInputAccept}
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
        className={`group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all duration-300 sm:p-16 ${
          isDragging
            ? "border-primary bg-primary-light shadow-lg shadow-primary/10"
            : "border-border bg-surface hover:border-primary/50 hover:bg-primary-light/50"
        }`}
        aria-label={ariaLabel}
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
          {isDragging ? label : label}
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          or click to browse &middot; JPG, PNG, WEBP, AVIF, HEIC
        </p>
        <p className="mt-1 text-xs text-text-muted">
          Select multiple images at once
        </p>
        <p className="mt-4 text-xs text-text-muted">
          You can also paste images from clipboard
        </p>
      </button>
    </>
  );
}
