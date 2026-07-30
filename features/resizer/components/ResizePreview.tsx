"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ImageIcon, FileImage, Download, ImageOff } from "lucide-react";
import { useResizerStore } from "@/store/resizer-store";
import { formatFileSize } from "@/features/compressor/utils/format";

export function ResizePreview() {
  const [imgError, setImgError] = useState(false);
  const originalFile = useResizerStore((s) => s.originalFile);
  const originalPreviewUrl = useResizerStore((s) => s.originalPreviewUrl);
  const originalSize = useResizerStore((s) => s.originalSize);
  const originalType = useResizerStore((s) => s.originalType);
  const resultPreviewUrl = useResizerStore((s) => s.resultPreviewUrl);
  const resultSize = useResizerStore((s) => s.resultSize);
  const naturalWidth = useResizerStore((s) => s.naturalWidth);
  const naturalHeight = useResizerStore((s) => s.naturalHeight);
  const cropWidth = useResizerStore((s) => s.cropWidth);
  const cropHeight = useResizerStore((s) => s.cropHeight);
  const outputFormat = useResizerStore((s) => s.outputFormat);
  const isProcessing = useResizerStore((s) => s.isProcessing);

  if (!originalFile || !originalPreviewUrl) return null;

  const hasResult = !!resultPreviewUrl;

  // Reset error state when result URL changes
  useEffect(() => {
    if (resultPreviewUrl) setImgError(false);
  }, [resultPreviewUrl]);

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

      <div className="grid gap-px bg-border sm:grid-cols-2">
        {/* Original */}
        <div className="relative bg-surface">
          <div className="absolute left-3 top-3 z-10 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-medium text-text-primary shadow-xs backdrop-blur-sm dark:bg-gray-800/90">
            Original
          </div>
          <div className="flex aspect-square items-center justify-center p-4 sm:aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={originalPreviewUrl}
              alt="Original image"
              className="max-h-full max-w-full rounded-lg object-contain"
            />
          </div>
          <div className="border-t border-border px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <FileImage className="h-3.5 w-3.5" />
              <span>{naturalWidth}×{naturalHeight}</span>
              <span className="text-text-muted">&middot;</span>
              <span>{formatFileSize(originalSize)}</span>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="relative bg-surface">
          <div className="absolute left-3 top-3 z-10 rounded-lg bg-primary/90 px-2.5 py-1 text-xs font-medium text-white shadow-xs backdrop-blur-sm">
            Cropped
          </div>

          {hasResult ? (
            <>
              <div className="flex aspect-square items-center justify-center p-4 sm:aspect-[4/3]">
                {imgError ? (
                  <div className="flex flex-col items-center gap-2 text-text-muted">
                    <ImageOff className="h-8 w-8" />
                    <p className="text-xs">Preview failed to load</p>
                  </div>
                ) : (
                  <img
                    key={resultPreviewUrl}
                    src={resultPreviewUrl}
                    alt="Cropped result"
                    className="max-h-full max-w-full rounded-lg object-contain bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)_0_0/16px_16px] dark:bg-[repeating-conic-gradient(#334155_0%_25%,transparent_0%_50%)_0_0/16px_16px]"
                    onError={() => setImgError(true)}
                  />
                )}
              </div>
              <div className="border-t border-border px-4 py-2.5">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <Download className="h-3.5 w-3.5" />
                  <span>{Math.round(cropWidth)}×{Math.round(cropHeight)}px</span>
                  <span className="text-text-muted">&middot;</span>
                  <span>{formatFileSize(resultSize)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex aspect-square flex-col items-center justify-center gap-2 p-4 text-text-muted sm:aspect-[4/3]">
              <ImageIcon className="h-8 w-8" />
              <p className="text-xs">
                {isProcessing ? "Processing..." : "Crop and download to see result"}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
