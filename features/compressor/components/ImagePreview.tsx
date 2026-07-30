"use client";

import { motion } from "framer-motion";
import { ImageIcon, FileImage } from "lucide-react";
import { useCompressorStore } from "@/store/compressor-store";
import { formatFileSize, getFileTypeLabel } from "@/features/compressor/utils/format";

export function ImagePreview() {
  const originalFile = useCompressorStore((s) => s.originalFile);
  const originalPreviewUrl = useCompressorStore((s) => s.originalPreviewUrl);
  const originalSize = useCompressorStore((s) => s.originalSize);
  const originalType = useCompressorStore((s) => s.originalType);
  const compressedPreviewUrl = useCompressorStore((s) => s.compressedPreviewUrl);
  const compressedSize = useCompressorStore((s) => s.compressedSize);
  const compressionRatio = useCompressorStore((s) => s.compressionRatio);

  if (!originalFile || !originalPreviewUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
    >
      {/* Preview header */}
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-text-primary">Preview</h3>
      </div>

      {/* Image display */}
      <div className="grid gap-px bg-border sm:grid-cols-2">
        {/* Original */}
        <div className="relative bg-surface">
          <div className="absolute left-3 top-3 z-10 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-medium text-text-primary shadow-xs backdrop-blur-sm">
            Original
          </div>
          <div className="flex aspect-square items-center justify-center p-4 sm:aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={originalPreviewUrl}
              alt="Original image preview"
              className="max-h-full max-w-full rounded-lg object-contain"
            />
          </div>
          <div className="border-t border-border px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <FileImage className="h-3.5 w-3.5" />
              <span>{getFileTypeLabel(originalType)}</span>
              <span className="text-text-muted">&middot;</span>
              <span>{formatFileSize(originalSize)}</span>
            </div>
          </div>
        </div>

        {/* Compressed */}
        <div className="relative bg-surface">
          <div className="absolute left-3 top-3 z-10 rounded-lg bg-success/90 px-2.5 py-1 text-xs font-medium text-white shadow-xs backdrop-blur-sm">
            Compressed
          </div>

          {compressedPreviewUrl ? (
            <>
              <div className="flex aspect-square items-center justify-center p-4 sm:aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={compressedPreviewUrl}
                  alt="Compressed image preview"
                  className="max-h-full max-w-full rounded-lg object-contain"
                />
              </div>
              <div className="border-t border-border px-4 py-2.5">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <FileImage className="h-3.5 w-3.5" />
                  <span>{getFileTypeLabel(originalType)}</span>
                  <span className="text-text-muted">&middot;</span>
                  <span>{formatFileSize(compressedSize)}</span>
                  <span className="ml-auto font-medium text-success">
                    -{compressionRatio}%
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex aspect-square flex-col items-center justify-center gap-2 p-4 text-text-muted sm:aspect-[4/3]">
              <ImageIcon className="h-8 w-8" />
              <p className="text-xs">Waiting for compression...</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
