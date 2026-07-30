"use client";

import { motion } from "framer-motion";
import { Crop, Download, RotateCcw, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { useResizerStore, OUTPUT_FORMATS } from "@/store/resizer-store";
import { formatFileSize } from "@/features/compressor/utils/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ResizeResults() {
  const originalFile = useResizerStore((s) => s.originalFile);
  const originalSize = useResizerStore((s) => s.originalSize);
  const resultBlob = useResizerStore((s) => s.resultBlob);
  const resultSize = useResizerStore((s) => s.resultSize);
  const isProcessing = useResizerStore((s) => s.isProcessing);
  const cropWidth = useResizerStore((s) => s.cropWidth);
  const cropHeight = useResizerStore((s) => s.cropHeight);
  const outputFormat = useResizerStore((s) => s.outputFormat);
  const setOutputFormat = useResizerStore((s) => s.setOutputFormat);
  const outputWidth = useResizerStore((s) => s.outputWidth);
  const outputHeight = useResizerStore((s) => s.outputHeight);
  const setOutputDimensions = useResizerStore((s) => s.setOutputDimensions);
  const quality = useResizerStore((s) => s.quality);
  const setQuality = useResizerStore((s) => s.setQuality);
  const crop = useResizerStore((s) => s.crop);
  const download = useResizerStore((s) => s.download);
  const reset = useResizerStore((s) => s.reset);

  if (!originalFile) return null;

  const hasResult = !!resultBlob;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
    >
      {/* Success banner */}
      {hasResult && (
        <div className="flex items-center gap-3 bg-success-light px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-sm font-semibold text-success">Crop Complete!</p>
            <p className="text-xs text-success/80">
              Your cropped image is ready to download.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4 p-5">
        {/* Output Format */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">
            Output Format
          </label>
          <div className="flex gap-1.5">
            {OUTPUT_FORMATS.map((fmt) => (
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

        {/* Output Dimensions */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">
            Output Dimensions (px)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={10000}
              value={outputWidth}
              onChange={(e) => {
                const w = Math.max(1, Number.parseInt(e.target.value, 10) || 1);
                setOutputDimensions(w, outputHeight);
              }}
              disabled={isProcessing}
              className="block h-9 w-full rounded-lg border border-border bg-background px-3 text-center text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Width"
            />
            <span className="text-xs font-medium text-text-muted">×</span>
            <input
              type="number"
              min={1}
              max={10000}
              value={outputHeight}
              onChange={(e) => {
                const h = Math.max(1, Number.parseInt(e.target.value, 10) || 1);
                setOutputDimensions(outputWidth, h);
              }}
              disabled={isProcessing}
              className="block h-9 w-full rounded-lg border border-border bg-background px-3 text-center text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Height"
            />
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
            <span className="font-medium text-text-primary">Crop Info</span>
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-text-muted">
            <span>
              Input: {Math.round(cropWidth)} × {Math.round(cropHeight)}px
            </span>
            <span>
              Output: {outputWidth} × {outputHeight}px
            </span>
            {hasResult && (
              <>
                <span>Original: {formatFileSize(originalSize)}</span>
                <span>Cropped: {formatFileSize(resultSize)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-border px-5 py-4">
        <div className="flex flex-col gap-2">
          {/* Crop button — shows preview */}
          <Button
            onClick={crop}
            disabled={isProcessing}
            size="lg"
            className="w-full"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Cropping...
              </span>
            ) : (
              <>
                <Crop className="h-4 w-4" />
                {hasResult ? "Crop Again" : "Crop Image"}
              </>
            )}
          </Button>

          <div className="flex gap-2">
            {/* Download button */}
            <Button
              onClick={download}
              disabled={!hasResult || isProcessing}
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>

            {/* Reset button */}
            <Button
              onClick={reset}
              disabled={isProcessing}
              variant="ghost"
              size="lg"
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4" />
              New
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
