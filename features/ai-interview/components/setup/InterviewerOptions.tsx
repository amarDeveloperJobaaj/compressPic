"use client";

import { Crown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  INTERVIEWER_PERSONALITIES,
} from "@/features/ai-interview/data/interviewer-personalities";
import { usePremiumFeatures } from "@/features/ai-interview/hooks/usePremiumFeatures";
import { useInterviewStore } from "@/features/ai-interview/store/interview-store";

/**
 * Interviewer & mode options (master spec §13 — Phase 13: advanced features).
 *
 * Interviewer personalities + multi-round interviews are premium features
 * behind feature flags (config/flags.ts). When a flag is off the picker still
 * renders so the UI is discoverable, but shows a Pro badge and is disabled —
 * no payments are wired (explicitly out of scope, §101).
 */
export function InterviewerOptions() {
  const personalityId = useInterviewStore((s) => s.personalityId);
  const multiRound = useInterviewStore((s) => s.multiRound);
  const setPersonalityId = useInterviewStore((s) => s.setPersonalityId);
  const setMultiRound = useInterviewStore((s) => s.setMultiRound);

  const premium = usePremiumFeatures();
  const personalitiesEnabled = premium.personalities;
  const multiRoundEnabled = premium.multi_round;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="flex items-center gap-2 text-base font-semibold text-text-primary">
          Interviewer personality
          {!personalitiesEnabled && <ProBadge />}
        </h3>
        <p className="mt-1 text-sm text-text-secondary">
          Choose how the AI interviewer speaks. Tone only — every personality
          asks the same high-quality questions.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {INTERVIEWER_PERSONALITIES.map((persona) => {
            const selected = personalityId === persona.id;
            return (
              <button
                key={persona.id}
                type="button"
                aria-pressed={selected}
                disabled={!personalitiesEnabled}
                onClick={() => setPersonalityId(persona.id)}
                className={cn(
                  "relative rounded-2xl border p-4 text-left transition-all duration-200",
                  selected
                    ? "border-primary bg-primary-light/60 shadow-lg shadow-primary/10"
                    : "border-border bg-surface hover:border-primary/40 hover:bg-primary-light/30",
                  !personalitiesEnabled && "cursor-not-allowed opacity-60 hover:border-border hover:bg-surface"
                )}
              >
                <p className="text-sm font-semibold text-text-primary">{persona.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                  {persona.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="flex items-center gap-2 text-base font-semibold text-text-primary">
          Multi-round interview
          {!multiRoundEnabled && <ProBadge />}
        </h3>
        <p className="mt-1 text-sm text-text-secondary">
          Simulate a real hiring loop: after the interview ends, restart with a
          fresh round of questions building on your previous performance.
        </p>
        <button
          type="button"
          role="switch"
          aria-checked={multiRound}
          disabled={!multiRoundEnabled}
          onClick={() => setMultiRound(!multiRound)}
          className={cn(
            "mt-4 flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-all duration-200",
            multiRound
              ? "border-primary bg-primary-light/60"
              : "border-border bg-surface hover:border-primary/40",
            !multiRoundEnabled && "cursor-not-allowed opacity-60 hover:border-border"
          )}
        >
          <span>
            <span className="block text-sm font-semibold text-text-primary">
              Enable multi-round
            </span>
            <span className="mt-0.5 block text-xs text-text-secondary">
              Your report links to a second-round session with the same setup.
            </span>
          </span>
          <span
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200",
              multiRound ? "bg-primary" : "bg-border"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200",
                multiRound ? "translate-x-6" : "translate-x-1"
              )}
            />
          </span>
        </button>
      </div>
    </div>
  );
}

function ProBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
      <Crown className="h-3 w-3" />
      Pro
    </span>
  );
}
