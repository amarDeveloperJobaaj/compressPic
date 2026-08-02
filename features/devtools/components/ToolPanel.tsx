"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ToolPanelProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Card panel wrapper used to structure every developer tool's UI. */
export function ToolPanel({
  title,
  description,
  actions,
  children,
  className,
}: ToolPanelProps) {
  return (
    <section
      className={cn(
        // min-w-0 lets panels shrink inside grid/flex parents on mobile — long
        // code/output lines then scroll within the panel instead of overflowing
        // the viewport (grid items default to min-width:auto).
        "min-w-0 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6",
        className
      )}
    >
      {(title || actions) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-base font-semibold text-text-primary">{title}</h2>}
            {description && (
              <p className="mt-1 text-sm text-text-secondary">{description}</p>
            )}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
