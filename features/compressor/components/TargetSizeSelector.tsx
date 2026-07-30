"use client";

import { motion } from "framer-motion";
import { useCompressorStore, type TargetSize } from "@/store/compressor-store";
import { cn } from "@/lib/utils";

const SIZE_OPTIONS: { label: string; value: TargetSize }[] = [
  { label: "50 KB", value: "50" },
  { label: "100 KB", value: "100" },
  { label: "200 KB", value: "200" },
  { label: "Custom", value: "custom" },
];

export function TargetSizeSelector() {
  const targetSize = useCompressorStore((s) => s.targetSize);
  const customTargetSize = useCompressorStore((s) => s.customTargetSize);
  const setTargetSize = useCompressorStore((s) => s.setTargetSize);
  const setCustomTargetSize = useCompressorStore((s) => s.setCustomTargetSize);
  const isCompressing = useCompressorStore((s) => s.isCompressing);
  const originalFile = useCompressorStore((s) => s.originalFile);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
    >
      <h3 className="text-sm font-semibold text-text-primary">Target Size</h3>
      <p className="mt-1 text-xs text-text-secondary">
        Choose how small you want the final image to be.
      </p>

      {/* Preset options */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {SIZE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={!originalFile || isCompressing}
            onClick={() => setTargetSize(option.value)}
            className={cn(
              "relative rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition-all duration-200",
              targetSize === option.value
                ? "border-primary bg-primary text-white shadow-sm"
                : "border-border bg-background text-text-secondary hover:border-primary/50 hover:text-primary",
              (!originalFile || isCompressing) && "cursor-not-allowed opacity-50"
            )}
            aria-pressed={targetSize === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Custom size input */}
      {targetSize === "custom" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4"
        >
          <label htmlFor="custom-size" className="block text-xs font-medium text-text-secondary">
            Enter size in KB
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <input
              id="custom-size"
              type="number"
              min={1}
              max={102400}
              value={customTargetSize}
              onChange={(e) => {
                const value = Math.max(1, Number.parseInt(e.target.value, 10) || 1);
                setCustomTargetSize(value);
              }}
              disabled={!originalFile || isCompressing}
              className="block h-10 w-full max-w-[120px] rounded-xl border border-border bg-background px-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="100"
            />
            <span className="text-xs text-text-muted">KB</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
