"use client";

import { motion } from "framer-motion";
import {
  FlipHorizontal2,
  FlipVertical2,
  RotateCcw,
  RotateCw,
  Download,
  Undo2,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import { useFlipStore, FLIP_OUTPUT_FORMATS } from "@/store/flip-store";
import { formatFileSize } from "@/features/compressor/utils/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FlipControls() {
  const originalFile = useFlipStore((s) => s.originalFile);
  const originalSize = useFlipStore((s) => s.originalSize);
  const transform = useFlipStore((s) => s.transform);
  const outputFormat = useFlipStore((s) => s.outputFormat);
  const setOutputFormat = useFlipStore((s) => s.setOutputFormat);
  const quality = useFlipStore((s) => s.quality);
  const setQuality = useFlipStore((s) => s.setQuality);
  const toggleFlipH = useFlipStore((s) => s.toggleFlipH);
  const toggleFlipV = useFlipStore((s) => s.toggleFlipV);
  const rotate = useFlipStore((s) => s.rotate);
  const resetTransform = useFlipStore((s) => s.resetTransform);
  const resultBlob = useFlipStore((s) => s.resultBlob);
  const resultSize = useFlipStore((s) => s.resultSize);
  const resultWidth = useFlipStore((s) => s.resultWidth);
  const resultHeight = useFlipStore((s) => s.resultHeight);
  const isProcessing = useFlipStore((s) => s.isProcessing);
  const download = useFlipStore((s) => s.download);
  const reset = useFlipStore((s) => s.reset);

  if (!originalFile) return null;

  const hasResult = !!resultBlob;
  const hasTransform =
    transform.flipH || transform.flipV || transform.rotation !== 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
    >
      {/* Success banner — only after the user has actually flipped/rotated */}
      {hasResult && hasTransform && (
        <div className="flex items-center gap-3 bg-success-light px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-sm font-semibold text-success">Flip Complete!</p>
            <p className="text-xs text-success/80">Your flipped image is ready to download.</p>
          </div>
        </div>
      )}

      <div className="space-y-5 p-5">
        {/* Flip actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={toggleFlipH}
            disabled={isProcessing}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition-all",
              transform.flipH
                ? "border-primary bg-primary text-white shadow-sm"
                : "border-border bg-background text-text-secondary hover:border-primary/50 hover:text-primary",
              isProcessing && "cursor-not-allowed opacity-50"
            )}
          >
            <FlipHorizontal2 className="h-5 w-5" />
            Flip Horizontal
          </button>
          <button
            type="button"
            onClick={toggleFlipV}
            disabled={isProcessing}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition-all",
              transform.flipV
                ? "border-primary bg-primary text-white shadow-sm"
                : "border-border bg-background text-text-secondary hover:border-primary/50 hover:text-primary",
              isProcessing && "cursor-not-allowed opacity-50"
            )}
          >
            <FlipVertical2 className="h-5 w-5" />
            Flip Vertical
          </button>
        </div>

        {/* Rotate actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => rotate("left")}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-medium text-text-secondary transition-all hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            Rotate Left
          </button>
          <button
            type="button"
            onClick={() => rotate("right")}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-medium text-text-secondary transition-all hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCw className="h-4 w-4" />
            Rotate Right
          </button>
        </div>

        {/* Reset transform */}
        {hasTransform && (
          <button
            type="button"
            onClick={resetTransform}
            disabled={isProcessing}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-error/20 bg-error-light px-3 py-2 text-xs font-medium text-error transition-colors hover:bg-error hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Undo2 className="h-3.5 w-3.5" />
            Reset Transform
          </button>
        )}

        {/* Output Format */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">
            Output Format
          </label>
          <div className="flex gap-1.5">
            {FLIP_OUTPUT_FORMATS.map((fmt) => (
              <button
                key={fmt.value}
                type="button"
                disabled={isProcessing}
                onClick={() => setOutputFormat(fmt.value)}
                className={cn(
                  "flex-1 rounded-lg border px-3 py-1.5 text-center text-xs font-medium transition-all",
                  outputFormat === fmt.value
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-border bg-background text-text-secondary hover:border-primary/50 hover:text-primary",
                  isProcessing && "cursor-not-allowed opacity-50"
                )}
              >
                {fmt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quality slider (for JPEG/WEBP) */}
        {(outputFormat === "image/jpeg" || outputFormat === "image/webp") && (
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
            <span>
              Output: {resultWidth} × {resultHeight}px
            </span>
            {hasResult && (
              <>
                <span>Original: {formatFileSize(originalSize)}</span>
                <span>Flipped: {formatFileSize(resultSize)}</span>
              </>
            )}
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
                Processing...
              </span>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download
              </>
            )}
          </Button>

          <Button onClick={reset} disabled={isProcessing} variant="ghost" size="lg" className="w-full">
            New Image
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
