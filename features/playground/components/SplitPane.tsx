"use client";

import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SplitPaneProps {
  /** Percentage (0–100) of the container width taken by the left pane. */
  left: number;
  onResize: (percent: number) => void;
  /** Exactly two children: [leftPane, rightPane]. */
  children: React.ReactNode;
  className?: string;
  /** Minimum percentage for the left pane. */
  min?: number;
  /** Maximum percentage for the left pane. */
  max?: number;
  ariaLabel?: string;
}

/**
 * Drag-to-resize split pane with a keyboard-accessible handle.
 * Used for the editor/preview split in the HTML/CSS/JS playground.
 *
 * Below `md` the panes stack vertically (full-width editor over full-width
 * preview) so the split stays usable on phones; the drag handle is hidden and
 * touch-action stays native there so scrolling the page still works.
 */
export function SplitPane({
  left,
  onResize,
  children,
  className,
  min = 25,
  max = 80,
  ariaLabel = "Resize panels",
}: SplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [leftPane, rightPane] = React.Children.toArray(children);

  // Track the md breakpoint (Tailwind md = 768px). SSR-safe: starts desktop,
  // corrects on mount/hydration.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const setFromClientX = useCallback(
    (clientX: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      const pct = ((clientX - rect.left) / rect.width) * 100;
      onResize(Math.min(max, Math.max(min, pct)));
    },
    [min, max, onResize]
  );

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => setFromClientX(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [dragging, setFromClientX]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex w-full overflow-hidden",
        isMobile ? "flex-col" : "flex-row",
        className
      )}
    >
      <div
        className="min-w-0"
        style={isMobile ? { width: "100%" } : { width: `${left}%`, flexShrink: 0 }}
      >
        {leftPane}
      </div>

      {/* Drag handle — hidden on mobile where panes stack */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={ariaLabel}
        aria-valuenow={Math.round(left)}
        aria-valuemin={min}
        aria-valuemax={max}
        tabIndex={0}
        onPointerDown={(e) => {
          if (isMobile) return;
          e.preventDefault();
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          setDragging(true);
        }}
        onKeyDown={(e) => {
          if (isMobile) return;
          if (e.key === "ArrowLeft") onResize(Math.max(min, left - 2));
          if (e.key === "ArrowRight") onResize(Math.min(max, left + 2));
        }}
        className={cn(
          "group relative z-10 w-1.5 shrink-0 cursor-col-resize bg-border/40 transition-colors hover:bg-primary focus-visible:bg-primary focus-visible:outline-none",
          dragging && "bg-primary",
          isMobile && "hidden"
        )}
        style={isMobile ? undefined : { touchAction: "none" }}
      >
        <span className="absolute inset-y-0 left-1/2 w-4 -translate-x-1/2" />
      </div>

      <div className="min-w-0 flex-1" style={{ minWidth: 0 }}>
        {rightPane}
      </div>
    </div>
  );
}
