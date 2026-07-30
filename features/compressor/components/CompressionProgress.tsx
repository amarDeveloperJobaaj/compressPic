"use client";

import { motion } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useCompressorStore } from "@/store/compressor-store";
import { Progress } from "@/components/ui/progress";

export function CompressionProgress() {
  const isCompressing = useCompressorStore((s) => s.isCompressing);
  const progress = useCompressorStore((s) => s.progress);
  const error = useCompressorStore((s) => s.error);
  const compressedBlob = useCompressorStore((s) => s.compressedBlob);

  // Show completion state briefly after compression finishes
  const showProgress = isCompressing || (progress === 100 && compressedBlob);

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-error/30 bg-error-light p-5"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-error/10">
            <span className="text-xs font-bold text-error">!</span>
          </div>
          <div>
            <p className="text-sm font-medium text-error">Compression Failed</p>
            <p className="mt-1 text-xs leading-relaxed text-error/80">{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Progress state
  if (!showProgress) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {isCompressing ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-success" />
          )}
          <span className="text-sm font-medium text-text-primary">
            {isCompressing
              ? progress < 100
                ? "Compressing your image..."
                : "Finalizing..."
              : "Compression Complete!"}
          </span>
        </div>
        <span
          className={`text-sm font-semibold ${
            progress === 100 && !isCompressing ? "text-success" : "text-primary"
          }`}
        >
          {progress}%
        </span>
      </div>

      <div className="mt-3">
        <Progress
          value={progress}
          className="h-2.5"
          indicatorClassName={
            progress === 100 && !isCompressing
              ? "bg-success"
              : "bg-primary"
          }
        />
      </div>

      <p className="mt-2 text-xs text-text-muted">
        Your image stays private — everything happens in your browser.
      </p>
    </motion.div>
  );
}
