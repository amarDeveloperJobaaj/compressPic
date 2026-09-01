"use client";

import { Monitor, Tablet, Smartphone, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewToolbarProps {
  onModeChange: (mode: "desktop" | "tablet" | "mobile") => void;
  onFullscreen: () => void;
  currentMode: string;
}

const modes = [
  { value: "desktop" as const, icon: Monitor, label: "Desktop" },
  { value: "tablet" as const, icon: Tablet, label: "Tablet" },
  { value: "mobile" as const, icon: Smartphone, label: "Mobile" },
];

export function PreviewToolbar({ onModeChange, onFullscreen, currentMode }: PreviewToolbarProps) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-border bg-surface p-1">
      {modes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => onModeChange(value)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            currentMode === value
              ? "bg-primary text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary hover:bg-background"
          )}
          aria-label={`Switch to ${label} view`}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
      <div className="mx-1 h-4 w-px bg-border" />
      <button
        onClick={onFullscreen}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-background"
        aria-label="Toggle fullscreen"
      >
        <Maximize2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Fullscreen</span>
      </button>
    </div>
  );
}
