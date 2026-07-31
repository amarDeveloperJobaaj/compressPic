"use client";

import { Check, LayoutGrid } from "lucide-react";
import { useSocialResizerStore } from "@/store/social-resizer-store";
import {
  SOCIAL_PLATFORMS,
  SOCIAL_PRESETS,
} from "@/features/social-resizer/utils/social";
import { cn } from "@/lib/utils";

/** Platform-grouped preset picker with exact pixel dimensions. */
export function PresetSelector() {
  const preset = useSocialResizerStore((s) => s.settings.preset);
  const setPreset = useSocialResizerStore((s) => s.setPreset);

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <LayoutGrid className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-text-primary">Platform Presets</h2>
      </div>

      <div className="max-h-96 space-y-4 overflow-y-auto pr-1">
        {SOCIAL_PLATFORMS.map((platform) => (
          <div key={platform}>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              {platform}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {SOCIAL_PRESETS.filter((p) => p.platform === platform).map((item) => {
                const isActive = preset.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreset(item)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex items-start justify-between gap-1 rounded-lg border px-2.5 py-2 text-left transition-all",
                      isActive
                        ? "border-primary bg-primary-light"
                        : "border-border bg-background hover:border-primary/50"
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-medium text-text-primary">
                        {item.label}
                      </span>
                      <span className="block text-[11px] text-text-muted">
                        {item.width} × {item.height}
                      </span>
                    </span>
                    {isActive && <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
