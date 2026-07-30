"use client";

import { motion } from "framer-motion";
import { Download, RotateCcw, CheckCircle2, BarChart3 } from "lucide-react";
import { useCompressorStore } from "@/store/compressor-store";
import { formatFileSize, formatCompressionRatio } from "@/features/compressor/utils/format";
import { Button } from "@/components/ui/button";

export function Results() {
  const originalFile = useCompressorStore((s) => s.originalFile);
  const originalSize = useCompressorStore((s) => s.originalSize);
  const compressedBlob = useCompressorStore((s) => s.compressedBlob);
  const compressedSize = useCompressorStore((s) => s.compressedSize);
  const compressionRatio = useCompressorStore((s) => s.compressionRatio);
  const isCompressing = useCompressorStore((s) => s.isCompressing);
  const download = useCompressorStore((s) => s.download);
  const reset = useCompressorStore((s) => s.reset);

  if (!compressedBlob || !originalFile) return null;

  const savings = formatCompressionRatio(originalSize, compressedSize);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
    >
      {/* Success banner */}
      <div className="flex items-center gap-3 bg-success-light px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-5 w-5 text-success" />
        </div>
        <div>
          <p className="text-sm font-semibold text-success">Compression Complete!</p>
          <p className="text-xs text-success/80">
            Your image has been compressed successfully.
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-px bg-border">
        <StatBox label="Original Size" value={formatFileSize(originalSize)} />
        <StatBox label="Compressed Size" value={formatFileSize(compressedSize)} />
        <StatBox
          label="Space Saved"
          value={savings}
          valueClassName="text-success"
        />
        <StatBox
          label="Reduction"
          value={`-${compressionRatio}%`}
          valueClassName="text-success"
        />
      </div>

      {/* Visual comparison bar */}
      <div className="border-t border-border px-5 py-4">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Size comparison</span>
        </div>
        <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-border">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: `${Math.max(5, 100 - compressionRatio)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="rounded-full bg-primary"
          />
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${Math.max(5, compressionRatio)}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="rounded-full bg-success"
          />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-text-muted">
          <span>Original</span>
          <span>Compressed ({compressionRatio}% smaller)</span>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-border px-5 py-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={download}
            disabled={isCompressing}
            size="lg"
            className="flex-1"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            onClick={reset}
            disabled={isCompressing}
            variant="secondary"
            size="lg"
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4" />
            Compress Another
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function StatBox({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="bg-surface px-5 py-4">
      <p className="text-xs text-text-muted">{label}</p>
      <p className={`mt-1 text-lg font-semibold text-text-primary ${valueClassName ?? ""}`}>
        {value}
      </p>
    </div>
  );
}
