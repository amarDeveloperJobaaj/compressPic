"use client";

import { motion } from "framer-motion";
import {
  Download,
  CheckCircle2,
  Image as ImageIcon,
  Repeat,
  RotateCcw,
} from "lucide-react";
import { useConverterStore, CONVERT_OUTPUT_FORMATS } from "@/store/converter-store";
import { formatFileSize, getFileTypeLabel } from "@/features/compressor/utils/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ConverterControls() {
  const originalFile = useConverterStore((s) => s.originalFile);
  const originalSize = useConverterStore((s) => s.originalSize);
  const originalType = useConverterStore((s) => s.originalType);
  const outputFormat = useConverterStore((s) => s.outputFormat);
  const setOutputFormat = useConverterStore((s) => s.setOutputFormat);
  const quality = useConverterStore((s) => s.quality);
  const setQuality = useConverterStore((s) => s.setQuality);
  const naturalWidth = useConverterStore((s) => s.naturalWidth);
  const naturalHeight = useConverterStore((s) => s.naturalHeight);
  const resultBlob = useConverterStore((s) => s.resultBlob);
  const resultSize = useConverterStore((s) => s.resultSize);
  const isProcessing = useConverterStore((s) => s.isProcessing);
  const avifSupported = useConverterStore((s) => s.avifSupported);
  const download = useConverterStore((s) => s.download);
  const reset = useConverterStore((s) => s.reset);

  if (!originalFile) return null;

  const hasResult = !!resultBlob;
  const outputIsLossy =
    outputFormat === "image/jpeg" || outputFormat === "image/webp" || outputFormat === "image/avif";
  const formatChanged = originalType !== outputFormat;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
    >
      {/* Success banner — only after a real format change has been applied */}
      {hasResult && formatChanged && (
        <div className="flex items-center gap-3 bg-success-light px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-sm font-semibold text-success">Converted!</p>
            <p className="text-xs text-success/80">Your image is ready to download.</p>
          </div>
        </div>
      )}

      <div className="space-y-5 p-5">
        {/* Current format */}
        <div className="flex items-center justify-between rounded-xl bg-background p-3">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Repeat className="h-3.5 w-3.5 text-primary" />
            <span>
              {getFileTypeLabel(originalType)} → {getFileTypeLabel(outputFormat)}
            </span>
          </div>
          <span className="text-xs text-text-muted">
            {naturalWidth}×{naturalHeight}px
          </span>
        </div>

        {/* Output Format */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">
            Convert To
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {CONVERT_OUTPUT_FORMATS.map((fmt) => {
              const disabled =
                isProcessing || (fmt.value === "image/avif" && !avifSupported);
              return (
                <button
                  key={fmt.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => setOutputFormat(fmt.value)}
                  title={
                    fmt.value === "image/avif" && !avifSupported
                      ? "AVIF encoding isn't supported in this browser"
                      : undefined
                  }
                  className={cn(
                    "rounded-lg border px-2 py-2 text-center text-xs font-medium transition-all",
                    outputFormat === fmt.value
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-border bg-background text-text-secondary hover:border-primary/50 hover:text-primary",
                    disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  {fmt.label}
                </button>
              );
            })}
          </div>
          {!avifSupported && (
            <p className="mt-1.5 text-[10px] text-text-muted">
              AVIF output isn&apos;t available in this browser — try Chrome or Edge.
            </p>
          )}
        </div>

        {/* Quality slider (for JPEG/WEBP) */}
        {outputIsLossy && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">
              Quality: {Math.round(quality * 100)}%
            </label>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.01}
              value={quality}
              onChange={(e) => setQuality(Number.parseFloat(e.target.value))}
              disabled={isProcessing}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary disabled:opacity-50"
            />
            <div className="mt-0.5 flex justify-between text-[10px] text-text-muted">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="rounded-xl bg-background p-3">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <ImageIcon className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium text-text-primary">Image Info</span>
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-text-muted">
            <span>Original: {formatFileSize(originalSize)}</span>
            {hasResult && <span>Converted: {formatFileSize(resultSize)}</span>}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-border px-5 py-4">
        <div className="flex flex-col gap-2">
          <Button
            onClick={download}
            disabled={!hasResult || isProcessing}
            size="lg"
            className="w-full"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Converting...
              </span>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download
              </>
            )}
          </Button>

          <Button onClick={reset} disabled={isProcessing} variant="ghost" size="lg" className="w-full">
            <RotateCcw className="h-4 w-4" />
            New Image
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
