"use client";

import { Crown } from "lucide-react";

import { cn } from "@/lib/utils";
import { DURATIONS } from "@/features/ai-interview/data/durations";
import { INTERVIEW_TYPES } from "@/features/ai-interview/data/interview-types";
import { usePremiumFeatures } from "@/features/ai-interview/hooks/usePremiumFeatures";
import { useInterviewStore } from "@/features/ai-interview/store/interview-store";
import { ResumeUploader } from "../ResumeUploader";
import { InterviewerOptions } from "./InterviewerOptions";
import { SelectableChip } from "./SelectableChip";

/** Step 3 — interview type (cards) + duration (chips) + resume uploader. */
export function TypeDurationStep() {
  const interviewTypeId = useInterviewStore((s) => s.interviewTypeId);
  const durationMinutes = useInterviewStore((s) => s.durationMinutes);
  const setInterviewTypeId = useInterviewStore((s) => s.setInterviewTypeId);
  const setDurationMinutes = useInterviewStore((s) => s.setDurationMinutes);
  const premium = usePremiumFeatures();
  const codingEnabled = premium.coding_interviews;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-semibold text-text-primary">Interview type</h3>
        <p className="mt-1 text-sm text-text-secondary">
          Mixed is recommended — it covers technical, HR, behavioral, and project questions.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {INTERVIEW_TYPES.map((type) => {
            const selected = interviewTypeId === type.id;
            const locked = type.premium && !codingEnabled;
            return (
              <button
                key={type.id}
                type="button"
                aria-pressed={selected}
                disabled={locked}
                onClick={() => setInterviewTypeId(type.id)}
                className={cn(
                  "relative rounded-2xl border p-4 text-left transition-all duration-200",
                  selected
                    ? "border-primary bg-primary-light/60 shadow-lg shadow-primary/10"
                    : "border-border bg-surface hover:border-primary/40 hover:bg-primary-light/30",
                  locked && "cursor-not-allowed opacity-60 hover:border-border hover:bg-surface"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-text-primary">{type.name}</p>
                  {type.recommended && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        selected ? "bg-primary text-white" : "bg-primary-light text-primary"
                      )}
                    >
                      Recommended
                    </span>
                  )}
                  {locked && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                      <Crown className="h-3 w-3" />
                      Pro
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                  {type.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-text-primary">Duration</h3>
        <p className="mt-1 text-sm text-text-secondary">
          We recommend 20 minutes for your first mock interview.
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {DURATIONS.map((duration) => (
            <SelectableChip
              key={duration.minutes}
              selected={durationMinutes === duration.minutes}
              onSelect={() => setDurationMinutes(duration.minutes)}
              recommended={duration.recommended}
            >
              {duration.minutes} min
            </SelectableChip>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-8">
        <InterviewerOptions />
      </div>

      <div>
        <h3 className="text-base font-semibold text-text-primary">Resume (optional)</h3>
        <p className="mt-1 text-sm text-text-secondary">
          Upload a PDF so the AI interviewer can build your candidate profile and ask about
          your projects and skills. No resume? Skip it — the interview still runs.
        </p>
        <div className="mt-4">
          <ResumeUploader />
        </div>
      </div>
    </div>
  );
}
