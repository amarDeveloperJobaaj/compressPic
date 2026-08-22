"use client";

import { useState, useCallback, useRef } from "react";
import { X, Plus, ImageIcon, Check } from "lucide-react";
import { isHeicFile } from "@/lib/heic";

interface ImageQueueItem {
  file: File;
  previewUrl: string;
}

interface ImageQueueProps {
  items: { file: File; previewUrl: string }[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onRemove: (index: number) => void;
  onAdd: (files: File[]) => void;
  accept?: string[];
  maxFiles?: number;
}

export function ImageQueue({
  items,
  activeIndex,
  onSelect,
  onRemove,
  onAdd,
  accept = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/avif"],
  maxFiles = 50,
}: ImageQueueProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return;
      const files = Array.from(e.target.files).filter(
        (f) => accept.includes(f.type) || isHeicFile(f)
      );
      if (files.length > 0) onAdd(files.slice(0, maxFiles));
      e.target.value = "";
    },
    [accept, maxFiles, onAdd]
  );

  if (items.length <= 1) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {items.map((item, i) => (
          <div
            key={i}
            className={`group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
              i === activeIndex
                ? "border-primary shadow-lg shadow-primary/10"
                : "border-border hover:border-primary/30"
            }`}
            onClick={() => onSelect(i)}
          >
            <div className="relative h-16 w-16 sm:h-20 sm:w-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.previewUrl}
                alt={item.file.name}
                className="h-full w-full object-cover"
              />
              {/* Active indicator */}
              {i === activeIndex && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}
              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(i);
                }}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Remove ${item.file.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            {/* File name */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-0.5">
              <p className="truncate text-[9px] text-white/80">
                {item.file.name}
              </p>
            </div>
          </div>
        ))}

        {/* Add more button */}
        {items.length < maxFiles && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.avif,.heic,.heif"
              multiple
              onChange={handleAdd}
              className="hidden"
              aria-hidden="true"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-border text-text-muted transition-all hover:border-primary/50 hover:text-primary sm:h-20 sm:w-20"
              aria-label="Add more images"
            >
              <Plus className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Count label */}
      <p className="mt-2 font-[family-name:var(--font-mono)] text-xs text-text-muted">
        {items.length} image{items.length !== 1 ? "s" : ""} &middot; {activeIndex + 1}/{items.length} selected
      </p>
    </div>
  );
}
