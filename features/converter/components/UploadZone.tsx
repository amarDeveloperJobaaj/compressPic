"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload } from "lucide-react";
import { isHeicFile } from "@/lib/heic";
import { useConverterStore } from "@/store/converter-store";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/heic",
  "image/heif",
];

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setFile = useConverterStore((s) => s.setFile);

  const validateAndSetFile = useCallback(
    (file: File) => {
      // isHeicFile also catches HEIC files with an empty MIME type (a common
      // quirk on Windows/Android) via the .heic/.heif extension.
      if (!ACCEPTED_TYPES.includes(file.type) && !isHeicFile(file)) {
        alert(
          `Unsupported file type: "${file.type || "unknown"}". Please upload a JPG, PNG, WEBP, AVIF, or HEIC image.`
        );
        return;
      }
      setFile(file);
    },
    [setFile]
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
      const file = e.dataTransfer.files?.[0];
      if (file) validateAndSetFile(file);
    },
    [validateAndSetFile]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSetFile(file);
      e.target.value = "";
    },
    [validateAndSetFile]
  );

  // Paste from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            validateAndSetFile(file);
            break;
          }
        }
      }
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [validateAndSetFile]);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.avif,.heic,.heif"
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
        aria-label="Upload an image to convert"
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
          {isDragging ? "Drop your image here" : "Drop an image here"}
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          or click to browse &middot; JPG, PNG, WEBP, AVIF, HEIC
        </p>
        <p className="mt-6 text-xs text-text-muted">
          You can also paste an image from clipboard
        </p>
      </button>
    </>
  );
}
