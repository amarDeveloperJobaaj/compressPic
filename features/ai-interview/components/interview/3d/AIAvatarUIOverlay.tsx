"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import type { AvatarState } from "./types";

/**
 * Floating product-UI cards around the AI avatar (§ floating UI cards).
 *
 * These are REAL product-style cards (Vizotool design tokens, blur, 1px
 * border) with different depth levels, not random decorations. Values shown
 * are demo/preview content for the landing — clearly labeled as such.
 */

interface OverlayCardProps {
  className?: string;
  delay?: number;
  depth?: number;
  children: React.ReactNode;
}

function OverlayCard({ className, delay = 0, depth = 0, children }: OverlayCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={cn("absolute z-20", className)}
    >
      {/* Depth lives on a plain wrapper — framer-motion would overwrite a
          translateZ on its own transform, so it can't go on the motion div. */}
      <div
        style={{ transform: `translateZ(${depth}px)`, transformStyle: "preserve-3d" }}
      >
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{
            duration: 4.5 + depth * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
          className="rounded-xl border border-border/80 bg-surface/80 px-3.5 py-2.5 shadow-lg shadow-primary/10 backdrop-blur-md"
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}

/** Status chip — reflects the current avatar state (§ states). */
function StatusChip({ state }: { state: AvatarState }) {
  const label: Record<AvatarState, string> = {
    idle: "Idle",
    listening: "Listening…",
    thinking: "Thinking…",
    speaking: "Speaking",
    analyzing: "Analyzing answer",
    success: "Analysis complete",
  };
  const dot: Record<AvatarState, string> = {
    idle: "bg-text-muted",
    listening: "bg-cyan-400",
    thinking: "bg-indigo-400",
    speaking: "bg-sky-400",
    analyzing: "bg-violet-400",
    success: "bg-success",
  };

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        {(state === "listening" || state === "analyzing") && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-70" />
        )}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", dot[state])} />
      </span>
      <span className="text-[11px] font-semibold text-text-primary">{label[state]}</span>
    </div>
  );
}

export function AIAvatarUIOverlay({
  state,
  showScores = false,
}: {
  state: AvatarState;
  /** Reveal the score cards (success state / after interaction). */
  showScores?: boolean;
}) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const small = useMediaQuery("(max-width: 767px)");

  // On small screens only the status chip + one card stay visible (§29).
  if (small) {
    return (
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="absolute -left-2 top-2 rounded-xl border border-border/80 bg-surface/85 px-3 py-2 shadow-lg shadow-primary/10 backdrop-blur-md">
          <StatusChip state={state} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20"
      style={reduced ? undefined : { perspective: 900, transformStyle: "preserve-3d" }}
    >
      {/* Top-left: listening status */}
      <OverlayCard className="-left-1 top-[8%] sm:-left-4" delay={0.2} depth={30}>
        <StatusChip state={state} />
      </OverlayCard>

      {/* Top-right: technical score */}
      <OverlayCard className="-right-1 top-[20%] sm:-right-3" delay={0.5} depth={20}>
        <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
          Technical Score
        </p>
        <p className="mt-0.5 text-lg font-bold text-text-primary">
          92
          <span className="text-xs font-semibold text-text-muted">%</span>
        </p>
      </OverlayCard>

      {/* Bottom-left: confidence */}
      <OverlayCard className="-left-1 bottom-[18%] sm:-left-6" delay={0.8} depth={40}>
        <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
          Confidence
        </p>
        <p className="mt-0.5 text-lg font-bold text-text-primary">
          87
          <span className="text-xs font-semibold text-text-muted">%</span>
        </p>
      </OverlayCard>

      {/* Bottom-right: analyzing / preview */}
      <OverlayCard className="-right-1 bottom-[8%] sm:-right-5" delay={1.1} depth={10}>
        <p className="text-[10px] font-medium text-text-muted">
          {showScores ? "Demo preview" : "Live interview"}
        </p>
        <div className="mt-1.5 flex items-end gap-[3px]">
          {[5, 9, 6, 11, 8, 12, 7, 10, 6].map((h, i) => (
            <span
              key={i}
              className={cn("w-[3px] rounded-full bg-cyan-400/80", reduced ? "" : "animate-wave")}
              style={{ height: h, animationDelay: `${i * 0.09}s` }}
            />
          ))}
        </div>
      </OverlayCard>
    </div>
  );
}
