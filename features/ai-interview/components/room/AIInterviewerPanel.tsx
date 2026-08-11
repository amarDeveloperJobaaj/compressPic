"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/features/ai-interview/hooks/useMediaQuery";
import type { RoomStatus } from "@/features/ai-interview/store/interview-room-store";
import { AIAvatarFallback } from "../interview/3d/AIAvatarFallback";
import {
  interviewerVisualFor,
  roomStatusLabel,
  VISUAL_ACCENT,
  VISUAL_LABELS,
} from "./interviewer-state";

/**
 * AI interviewer panel (§15) — the visual states the candidate sees:
 * the room's §79 status machine drives the ring/label (waiting, listening,
 * thinking, speaking, processing, success). Reuses the pure-CSS avatar
 * from the landing so there's no WebGL cost inside the focused room.
 */
export function AIInterviewerPanel({ status }: { status: RoomStatus }) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const visual = interviewerVisualFor(status);
  const accent = VISUAL_ACCENT[visual];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="relative">
        {/* State ring */}
        <div
          className={cn(
            "pointer-events-none absolute inset-2 rounded-2xl border-2 transition-colors duration-500",
            accent.ring
          )}
          aria-hidden="true"
        />
        {/* Soft glow behind the avatar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-10 h-40 rounded-[50%] bg-primary/10 blur-3xl"
        />

        <AIAvatarFallback />

        {/* State badge */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background/90 px-3.5 py-1.5 shadow-lg backdrop-blur">
          <span className="relative flex h-2 w-2">
            {(visual === "listening" || visual === "processing") && !reduced && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-70" />
            )}
            <span className={cn("relative inline-flex h-2 w-2 rounded-full", accent.dot)} />
          </span>
          <span className="text-xs font-semibold text-text-primary">
            {VISUAL_LABELS[visual]}
          </span>
        </div>
      </div>

      {/* Status strip — the §78 loading message */}
      <div className="border-t border-border px-4 py-2.5 text-center">
        <motion.p
          key={status}
          initial={reduced ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-text-secondary"
          aria-live="polite"
        >
          {roomStatusLabel(status)}
        </motion.p>
      </div>
    </div>
  );
}
