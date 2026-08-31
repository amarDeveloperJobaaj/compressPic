import { cn } from "@/lib/utils";
import type { Design } from "@/lib/vizodesign/types";

interface DesignCharacteristicsProps {
  design: Design;
}

const THEME_LABELS: Record<string, string> = {
  dark: "Dark",
  light: "Light",
  both: "Dark & Light",
};

const ANIMATION_LABELS: Record<string, string> = {
  minimal: "Minimal",
  medium: "Medium",
  high: "High",
};

export function DesignCharacteristics({ design }: DesignCharacteristicsProps) {
  const items = [
    { label: "Style", value: design.style_type },
    { label: "Mood", value: design.mood },
    { label: "Best For", value: design.best_for.join(", ") },
    { label: "Theme", value: THEME_LABELS[design.theme] ?? design.theme },
    { label: "Animation", value: ANIMATION_LABELS[design.animation_level] ?? design.animation_level },
    { label: "3D", value: design.has_3d ? "Yes" : "No" },
    { label: "Responsive", value: design.responsive ? "Yes" : "No" },
    { label: "Accessibility", value: design.accessibility_level },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border bg-surface p-4"
        >
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            {item.label}
          </dt>
          <dd className={cn("mt-1.5 text-sm font-medium capitalize text-text-primary")}>
            {item.value}
          </dd>
        </div>
      ))}
    </div>
  );
}
