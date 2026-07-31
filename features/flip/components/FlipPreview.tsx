"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon, FileImage, Download, ImageOff, FlipHorizontal2 } from "lucide-react";
import { useFlipStore } from "@/store/flip-store";
import { formatFileSize } from "@/features/compressor/utils/format";

export function FlipPreview() {
  // Stores the URL that failed to load (instead of a boolean reset in an effect)
  const [errorUrl, setErrorUrl] = useState<string | null>(null);
  const originalFile = useFlipStore((s) => s.originalFile);
  const originalPreviewUrl = useFlipStore((s) => s.originalPreviewUrl);
  const originalSize = useFlipStore((s) => s.originalSize);
  const naturalWidth = useFlipStore((s) => s.naturalWidth);
  const naturalHeight = useFlipStore((s) => s.naturalHeight);
  const resultPreviewUrl = useFlipStore((s) => s.resultPreviewUrl);
  const resultSize = useFlipStore((s) => s.resultSize);
  const resultWidth = useFlipStore((s) => s.resultWidth);
  const resultHeight = useFlipStore((s) => s.resultHeight);
  const isProcessing = useFlipStore((s) => s.isProcessing);

  if (!originalFile || !originalPreviewUrl) return null;

  const hasResult = !!resultPreviewUrl;
  // Only show the error for the specific URL that failed; a new URL renders fresh
  const hasError = errorUrl !== null && errorUrl === resultPreviewUrl;
  const checkerboard =
    "bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)_0_0/16px_16px] dark:bg-[repeating-conic-gradient(#334155_0%_25%,transparent_0%_50%)_0_0/16px_16px]";

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
              className={`max-h-full max-w-full rounded-lg object-contain ${checkerboard}`}
            />
          </div>
          <div className="border-t border-border px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <FileImage className="h-3.5 w-3.5" />
              <span>
                {naturalWidth}×{naturalHeight}
              </span>
              <span className="text-text-muted">&middot;</span>
              <span>{formatFileSize(originalSize)}</span>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="relative bg-surface">
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-lg bg-primary/90 px-2.5 py-1 text-xs font-medium text-white shadow-xs backdrop-blur-sm">
            <FlipHorizontal2 className="h-3 w-3" />
            Flipped
          </div>

          {hasResult ? (
            <>
              <div className="flex aspect-square items-center justify-center p-4 sm:aspect-[4/3]">
                {hasError ? (
                  <div className="flex flex-col items-center gap-2 text-text-muted">
                    <ImageOff className="h-8 w-8" />
                    <p className="text-xs">Preview failed to load</p>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={resultPreviewUrl}
                    src={resultPreviewUrl}
                    alt="Flipped result"
                    className={`max-h-full max-w-full rounded-lg object-contain ${checkerboard}`}
                    onError={() => setErrorUrl(resultPreviewUrl)}
                  />
                )}
              </div>
              <div className="border-t border-border px-4 py-2.5">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <Download className="h-3.5 w-3.5" />
                  <span>
                    {resultWidth}×{resultHeight}px
                  </span>
                  <span className="text-text-muted">&middot;</span>
                  <span>{formatFileSize(resultSize)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex aspect-square flex-col items-center justify-center gap-2 p-4 text-text-muted sm:aspect-[4/3]">
              <ImageIcon className="h-8 w-8" />
              <p className="text-xs">
                {isProcessing ? "Processing..." : "Flip or rotate to see the result"}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
