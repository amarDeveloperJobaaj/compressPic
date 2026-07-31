"use client";

import { useState } from "react";
import { Check, Ruler } from "lucide-react";
import { usePassportStore } from "@/store/passport-store";
import {
  PASSPORT_GROUPS,
  PASSPORT_PRESETS,
  sizePixels,
} from "@/features/passport/utils/passport";
import { cn } from "@/lib/utils";

/** Country + size preset picker with a custom mm/dpi option. */
export function SizeSelector() {
  const size = usePassportStore((s) => s.size);
  const setSize = usePassportStore((s) => s.setSize);

  const [custom, setCustom] = useState({ widthMm: 35, heightMm: 45, dpi: 300 });

  const applyCustom = () => {
    const w = Math.max(10, Math.min(120, Number(custom.widthMm) || 35));
    const h = Math.max(10, Math.min(120, Number(custom.heightMm) || 45));
    const dpi = Math.max(72, Math.min(1200, Number(custom.dpi) || 300));
    setCustom({ widthMm: w, heightMm: h, dpi });
    setSize({ id: "custom", label: "Custom", widthMm: w, heightMm: h, dpi });
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Ruler className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-text-primary">Photo Size</h2>
      </div>

      <div className="max-h-80 space-y-4 overflow-y-auto pr-1">
        {PASSPORT_GROUPS.map((group) => (
          <div key={group}>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              {group}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {PASSPORT_PRESETS.filter((p) => p.group === group).map((preset) => {
                const isActive = size.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      setSize({
                        id: preset.id,
                        label: preset.label,
                        widthMm: preset.widthMm,
                        heightMm: preset.heightMm,
                        dpi: preset.dpi,
                      })
                    }
                    className={cn(
                      "group flex items-start justify-between gap-1 rounded-lg border px-2.5 py-2 text-left transition-all",
                      isActive
                        ? "border-primary bg-primary-light"
                        : "border-border bg-background hover:border-primary/50"
                    )}
                    aria-pressed={isActive}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-medium text-text-primary">
                        {preset.label}
                      </span>
                      <span className="block text-[11px] text-text-muted">{preset.detail}</span>
                    </span>
                    {isActive && <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Custom size */}
      <div className="mt-3 rounded-xl border border-border bg-background p-3">
        <p className="mb-2 text-xs font-medium text-text-secondary">Custom size</p>
        <div className="grid grid-cols-3 gap-2">
          <label className="block">
            <span className="mb-1 block text-[10px] text-text-muted">Width (mm)</span>
            <input
              type="number"
              min={10}
              max={120}
              value={custom.widthMm}
              onChange={(e) => setCustom({ ...custom, widthMm: Number(e.target.value) })}
              className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-text-primary focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] text-text-muted">Height (mm)</span>
            <input
              type="number"
              min={10}
              max={120}
              value={custom.heightMm}
              onChange={(e) => setCustom({ ...custom, heightMm: Number(e.target.value) })}
              className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-text-primary focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] text-text-muted">DPI</span>
            <input
              type="number"
              min={72}
              max={1200}
              step={50}
              value={custom.dpi}
              onChange={(e) => setCustom({ ...custom, dpi: Number(e.target.value) })}
              className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-text-primary focus:border-primary focus:outline-none"
            />
          </label>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[11px] text-text-muted">
            Output:{" "}
            {size.id === "custom"
              ? `${sizePixels(size).width} × ${sizePixels(size).height} px`
              : "Set by preset"}
          </p>
          <button
            type="button"
            onClick={applyCustom}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
