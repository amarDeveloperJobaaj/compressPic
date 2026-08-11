"use client";

import { Bot } from "lucide-react";

import { cn } from "@/lib/utils";
import type { RoomStatus } from "@/features/ai-interview/store/interview-room-store";
import { interviewerVisualFor, VISUAL_ACCENT, VISUAL_LABELS } from "./interviewer-state";

/**
 * Question panel (§12) — the interviewer's current line is ALWAYS shown as
 * text (§29), never audio-only. A short waiting copy covers the pre-first-
 * question states so the panel never sits blank.
 */
export function QuestionPanel({
  status,
  question,
}: {
  status: RoomStatus;
  question: string | null;
}) {
  const visual = interviewerVisualFor(status);
  const accent = VISUAL_ACCENT[visual];

  const fallbackCopy: Partial<Record<RoomStatus, string>> = {
    idle: "Your AI interviewer is getting ready.",
    preparing: "Preparing the interview room…",
    ready: "Start the interview when you're ready — I'll take it from there.",
    completed: "That's a wrap. Head over to the controls to finish up.",
  };

  const display = question ?? fallbackCopy[status] ?? "Listening for your answer…";

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 text-white shadow-md shadow-primary/30">
          <Bot className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-text-muted">
              AI Interviewer
            </p>
            <span className={cn("h-1.5 w-1.5 rounded-full", accent.dot)} />
            <span className={cn("text-[11px] font-medium", accent.text)}>
              {VISUAL_LABELS[visual]}
            </span>
          </div>
          <p
            className="text-base font-medium leading-relaxed text-text-primary"
            aria-live="polite"
          >
            {display}
          </p>
        </div>
      </div>
    </div>
  );
}
