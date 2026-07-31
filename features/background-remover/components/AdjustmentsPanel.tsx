"use client";

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useBackgroundRemoverStore } from "@/store/background-remover-store";
import { DEFAULT_ADJUSTMENTS } from "@/features/background-remover/utils/adjustments";
import { Slider } from "./Slider";

const ADJUSTMENTS: {
  key: keyof typeof DEFAULT_ADJUSTMENTS;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}[] = [
  { key: "brightness", label: "Brightness", min: -100, max: 100, step: 1, format: (v) => `${v > 0 ? "+" : ""}${v}` },
  { key: "contrast", label: "Contrast", min: -100, max: 100, step: 1, format: (v) => `${v > 0 ? "+" : ""}${v}` },
  { key: "saturation", label: "Saturation", min: -100, max: 100, step: 1, format: (v) => `${v > 0 ? "+" : ""}${v}` },
  { key: "exposure", label: "Exposure", min: -100, max: 100, step: 1, format: (v) => `${v > 0 ? "+" : ""}${v}` },
  { key: "temperature", label: "Temperature", min: -100, max: 100, step: 1, format: (v) => `${v > 0 ? "Warm" : "Cool"} ${Math.abs(v)}` },
  { key: "tint", label: "Tint", min: -100, max: 100, step: 1, format: (v) => `${v > 0 ? "Magenta" : "Green"} ${Math.abs(v)}` },
  { key: "gamma", label: "Gamma", min: 0.2, max: 2.5, step: 0.05, format: (v) => v.toFixed(2) },
  { key: "sharpness", label: "Sharpness", min: 0, max: 100, step: 1, format: (v) => `${v}%` },
  { key: "opacity", label: "Opacity", min: 0, max: 100, step: 1, format: (v) => `${v}%` },
];

export function AdjustmentsPanel() {
  const adjustments = useBackgroundRemoverStore((s) => s.adjustments);
  const setAdjustments = useBackgroundRemoverStore((s) => s.setAdjustments);

  const isDefault = ADJUSTMENTS.every((a) => adjustments[a.key] === DEFAULT_ADJUSTMENTS[a.key]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Subject Adjustments
        </p>
        <button
          type="button"
          onClick={() => setAdjustments({ ...DEFAULT_ADJUSTMENTS })}
          disabled={isDefault}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-text-secondary transition-colors hover:bg-primary-light hover:text-primary disabled:opacity-40"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {ADJUSTMENTS.map((adj) => (
        <Slider
          key={adj.key}
          label={adj.label}
          value={adjustments[adj.key]}
          min={adj.min}
          max={adj.max}
          step={adj.step}
          onChange={(v) => setAdjustments({ [adj.key]: v })}
          format={adj.format}
        />
      ))}

      <p className="text-[10px] leading-relaxed text-text-muted">
        Adjustments apply to the subject only — the background stays untouched.
      </p>
    </motion.div>
  );
}
