"use client";

import { cn } from "@/lib/utils";

interface CodeTextareaProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  rows?: number;
  className?: string;
  ariaLabel?: string;
}

/** Monospace code textarea used across all developer tools. */
export function CodeTextarea({
  value,
  onChange,
  placeholder,
  readOnly = false,
  rows = 12,
  className,
  ariaLabel,
}: CodeTextareaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      rows={rows}
      aria-label={ariaLabel}
      spellCheck={false}
      className={cn(
        "w-full resize-y rounded-xl border border-border bg-background p-4 font-mono text-[13px] leading-relaxed text-text-primary shadow-inner transition-colors",
        "placeholder:text-text-muted",
        "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
        readOnly && "cursor-default",
        className
      )}
    />
  );
}
