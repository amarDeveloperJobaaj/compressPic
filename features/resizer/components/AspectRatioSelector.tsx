"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useResizerStore, PRESET_RATIOS } from "@/store/resizer-store";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "Passport & ID", label: "Passport & ID" },
  { id: "Document", label: "Document" },
  { id: "Social Media", label: "Social Media" },
  { id: "Common Ratios", label: "Common Ratios" },
];

export function AspectRatioSelector() {
  const selectedRatio = useResizerStore((s) => s.selectedRatio);
  const isCustomRatio = useResizerStore((s) => s.isCustomRatio);
  const customRatioWidth = useResizerStore((s) => s.customRatioWidth);
  const customRatioHeight = useResizerStore((s) => s.customRatioHeight);
  const selectRatio = useResizerStore((s) => s.selectRatio);
  const setCustomRatio = useResizerStore((s) => s.setCustomRatio);
  const originalFile = useResizerStore((s) => s.originalFile);
  const isProcessing = useResizerStore((s) => s.isProcessing);

  const [activeCategory, setActiveCategory] = useState("all");
  const [showCustom, setShowCustom] = useState(false);
  const [customW, setCustomW] = useState(customRatioWidth);
  const [customH, setCustomH] = useState(customRatioHeight);

  const filteredRatios =
    activeCategory === "all"
      ? PRESET_RATIOS
      : PRESET_RATIOS.filter((r) => r.category === activeCategory);

  const handleCustomApply = () => {
    if (customW > 0 && customH > 0) {
      setCustomRatio(customW, customH);
      setShowCustom(false);
    }
  };

  const disabled = !originalFile || isProcessing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
    >
      <h3 className="text-sm font-semibold text-text-primary">Aspect Ratio</h3>
      <p className="mt-1 text-xs text-text-secondary">
        Choose a preset ratio or set a custom one.
      </p>

      {/* Category tabs */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            disabled={disabled}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
              activeCategory === cat.id
                ? "bg-primary text-white shadow-sm"
                : "bg-background text-text-secondary hover:bg-primary-light hover:text-primary",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Ratio grid */}
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {filteredRatios.map((ratio) => {
          const isSelected =
            selectedRatio?.label === ratio.label &&
            selectedRatio?.category === ratio.category;
          return (
            <button
              key={`${ratio.category}-${ratio.label}`}
              type="button"
              disabled={disabled}
              onClick={() => {
                selectRatio(isSelected ? null : ratio);
                setShowCustom(false);
              }}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-left text-xs transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-background text-text-secondary hover:border-primary/50 hover:text-primary",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              <span className="block font-medium">{ratio.label}</span>
              <span className="block text-[10px] opacity-70">
                {ratio.width}:{ratio.height}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom ratio toggle */}
      <div className="mt-3 border-t border-border pt-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setShowCustom(!showCustom);
            if (!showCustom) selectRatio(null);
          }}
          className={cn(
            "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-medium transition-all",
            showCustom || isCustomRatio
              ? "border-primary bg-primary text-white shadow-sm"
              : "border-border bg-background text-text-secondary hover:border-primary/50 hover:text-primary",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <span>Custom Ratio</span>
          <span className="text-[10px] opacity-70">
            {showCustom || isCustomRatio ? "▼" : "▶"}
          </span>
        </button>

        {(showCustom || isCustomRatio) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 flex items-center gap-2"
          >
            <input
              type="number"
              min={1}
              value={customW}
              onChange={(e) =>
                setCustomW(Math.max(1, Number.parseInt(e.target.value, 10) || 1))
              }
              disabled={disabled}
              className="block h-9 w-full rounded-lg border border-border bg-background px-3 text-center text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="W"
            />
            <span className="text-xs font-medium text-text-muted">×</span>
            <input
              type="number"
              min={1}
              value={customH}
              onChange={(e) =>
                setCustomH(Math.max(1, Number.parseInt(e.target.value, 10) || 1))
              }
              disabled={disabled}
              className="block h-9 w-full rounded-lg border border-border bg-background px-3 text-center text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="H"
            />
            <button
              type="button"
              onClick={handleCustomApply}
              disabled={disabled}
              className="flex h-9 shrink-0 items-center rounded-lg bg-primary px-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-primary-dark active:scale-[0.97] disabled:opacity-50"
            >
              Apply
            </button>
          </motion.div>
        )}
      </div>

      {selectedRatio && (
        <p className="mt-3 text-[11px] text-text-muted">
          Selected: <span className="font-medium text-primary">{selectedRatio.label}</span> &middot;{" "}
          {selectedRatio.width}:{selectedRatio.height}
        </p>
      )}
    </motion.div>
  );
}
