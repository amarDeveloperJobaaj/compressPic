/**
 * Interviewer personalities (master spec §13 — Phase 13: advanced features).
 *
 * Each persona injects a short tone directive into the question-generation
 * prompts (system-level), so the interviewer's voice differs per session
 * without changing the strict JSON contract. Flag-gated as a premium feature
 * (config/flags.ts) — the picker UI hides/shows a Pro badge accordingly.
 */

export interface InterviewerPersonality {
  id: string;
  name: string;
  tagline: string;
  /** Short directive appended to the question/follow-up system prompts. */
  promptDirective: string;
}

export const INTERVIEWER_PERSONALITIES: InterviewerPersonality[] = [
  {
    id: "professional",
    name: "Professional",
    tagline: "Balanced, neutral and precise — the default interviewer.",
    promptDirective:
      "Tone: professional and neutral — clear, direct questions with no extra warmth or pressure.",
  },
  {
    id: "friendly",
    name: "Friendly",
    tagline: "Warm and encouraging — reduces nerves for early-career candidates.",
    promptDirective:
      "Tone: warm and encouraging — keep the candidate at ease with approachable, conversational phrasing.",
  },
  {
    id: "technical",
    name: "Technical",
    tagline: "Deep-dive specialist — favors follow-ups and hard problems.",
    promptDirective:
      "Tone: deeply technical — prefer probing follow-ups, edge cases and concrete implementation details.",
  },
  {
    id: "strict",
    name: "Strict",
    tagline: "Rigorous and demanding — simulates a tough hiring bar.",
    promptDirective:
      "Tone: rigorous and demanding — hold a high bar, challenge vague answers, and keep questions tight.",
  },
];

export const DEFAULT_PERSONALITY_ID = "professional";

export function getPersonality(id: string | null | undefined): InterviewerPersonality {
  return (
    INTERVIEWER_PERSONALITIES.find((p) => p.id === id) ??
    INTERVIEWER_PERSONALITIES[0]
  );
}
