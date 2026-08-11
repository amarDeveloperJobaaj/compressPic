"use client";

import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { remainingSeconds } from "@/features/ai-interview/store/interview-room-store";

/**
 * Interview timer — counts down from the configured duration (§11). Red when
 * under a minute so the candidate feels the budget without distraction.
 */
export function InterviewTimer({
  durationMinutes,
  elapsedSeconds,
}: {
  durationMinutes: number;
  elapsedSeconds: number;
}) {
  const remaining = remainingSeconds(durationMinutes, elapsedSeconds);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const urgent = remaining <= 60;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold tabular-nums",
        urgent
          ? "border-error/40 bg-error/10 text-error"
          : "border-border bg-surface text-text-primary"
      )}
      aria-label={`Time remaining ${mm} minutes ${ss} seconds`}
      aria-live="off"
    >
      <Clock className="h-4 w-4" />
      {mm}:{ss}
    </div>
  );
}
