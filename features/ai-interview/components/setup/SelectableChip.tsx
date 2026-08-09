"use client";

import { cn } from "@/lib/utils";

interface SelectableChipProps {
  selected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
  recommended?: boolean;
  className?: string;
}

/** Selectable option chip — used for domains, companies, levels, durations. */
export function SelectableChip({
  selected,
  onSelect,
  children,
  recommended = false,
  className,
}: SelectableChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200",
        selected
          ? "border-primary bg-primary text-white shadow-lg shadow-primary/25"
          : "border-border bg-surface text-text-secondary hover:border-primary/40 hover:bg-primary-light/50 hover:text-primary",
        className
      )}
    >
      {children}
      {recommended && (
        <span
          className={cn(
            "rounded-full px-1.5 py-px text-[10px] font-semibold",
            selected ? "bg-white/20 text-white" : "bg-primary-light text-primary"
          )}
        >
          Recommended
        </span>
      )}
    </button>
  );
}
