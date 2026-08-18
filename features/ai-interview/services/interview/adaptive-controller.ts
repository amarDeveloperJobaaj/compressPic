import type { EvaluatedAnswer } from "../../schemas/evaluation";
import type { Difficulty } from "../../types";

/**
 * Adaptive controller (master spec §23–25, §40, §53).
 *
 * Pure, deterministic, unit-testable interview intelligence. Given one
 * evaluated answer + the session's live state, it decides what to do next:
 *
 *   excellent → NEW_TOPIC (advanced topic)   §24
 *   strong    → FOLLOW_UP (harder)           §24
 *   good      → NEW_TOPIC                    §24
 *   weak      → CLARIFICATION (simplify)     §24, §25
 *   wrong     → CLARIFICATION (concept check)§24
 *
 * Difficulty adapts with the answer (§25): strong answers bump the level,
 * weak/wrong answers drop it. The interview ends when the time budget is
 * exhausted or the question budget is reached (END_INTERVIEW rules).
 *
 * The controller decides DIRECTION; the provider only writes the question
 * text honoring that decision — the AI measures, it never steers (§53).
 */

export type AdaptiveAction = "FOLLOW_UP" | "CLARIFICATION" | "NEW_TOPIC" | "END_INTERVIEW";

export interface AdaptiveDecision {
  action: AdaptiveAction;
  /** Authoritative difficulty for the NEXT question (adjusted by §25). */
  difficulty: Difficulty;
  reason: string;
}

export interface AdaptiveControllerInput {
  evaluation: EvaluatedAnswer;
  /** Current session difficulty (before this answer's adaptation). */
  difficulty: Difficulty;
  questionsAsked: number;
  /** Remaining seconds, or null when the clock never started. */
  remainingTimeSeconds: number | null;
  questionBudget: number;
  /** Consecutive FOLLOW_UP/CLARIFICATION questions so far (same topic chain). */
  followUpDepth: number;
}

export const DIFFICULTY_ORDER: readonly Difficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
];

/** Verdict thresholds — derived from `overall` (0–10), deterministic. */
export function deriveVerdict(overall: number): EvaluatedAnswer["verdict"] {
  if (overall >= 8.5) return "excellent";
  if (overall >= 7) return "strong";
  if (overall >= 5.5) return "good";
  if (overall >= 4) return "weak";
  return "wrong";
}

/** Mean of the six §54 dimensions → overall 0–10. */
export function computeOverall(evaluation: Pick<EvaluatedAnswer, "technicalAccuracy" | "relevance" | "completeness" | "clarity" | "structure" | "depth">): number {
  const sum =
    evaluation.technicalAccuracy +
    evaluation.relevance +
    evaluation.completeness +
    evaluation.clarity +
    evaluation.structure +
    evaluation.depth;
  return Math.round((sum / 6) * 10) / 10;
}

export function bumpDifficulty(difficulty: Difficulty): Difficulty {
  const i = DIFFICULTY_ORDER.indexOf(difficulty);
  if (i === -1 || i >= DIFFICULTY_ORDER.length - 1) return difficulty;
  return DIFFICULTY_ORDER[i + 1];
}

export function dropDifficulty(difficulty: Difficulty): Difficulty {
  const i = DIFFICULTY_ORDER.indexOf(difficulty);
  if (i <= 0) return difficulty;
  return DIFFICULTY_ORDER[i - 1];
}

/**
 * Question budget from the configured duration — ~2 minutes per Q&A turn
 * (a 20-minute interview runs roughly 10 questions).
 */
export function computeQuestionBudget(durationMinutes: number): number {
  return Math.max(5, Math.round(durationMinutes / 2));
}

/** Budget checks — END_INTERVIEW rules (time + question budgets). */
export function shouldEndInterview(input: Pick<AdaptiveControllerInput, "remainingTimeSeconds" | "questionsAsked" | "questionBudget">): boolean {
  if (input.remainingTimeSeconds != null && input.remainingTimeSeconds <= 0) return true;
  return input.questionsAsked >= input.questionBudget;
}

/** Follow-up chain cap — never drill the same topic forever. */
export const MAX_FOLLOW_UP_DEPTH = 2;

export function decideNextTurn(input: AdaptiveControllerInput): AdaptiveDecision {
  const { evaluation, difficulty, followUpDepth } = input;

  // END_INTERVIEW rules (time / question budget) take precedence.
  if (shouldEndInterview(input)) {
    return {
      action: "END_INTERVIEW",
      difficulty,
      reason: `Interview budget reached (${input.questionsAsked} questions, ${input.remainingTimeSeconds ?? "?"}s left).`,
    };
  }

  // Topic drilled enough — force a new topic so the interview stays broad.
  if (followUpDepth >= MAX_FOLLOW_UP_DEPTH && evaluation.verdict !== "weak" && evaluation.verdict !== "wrong") {
    return {
      action: "NEW_TOPIC",
      difficulty: bumpDifficulty(difficulty),
      reason: "Topic covered in depth — moving to a new topic.",
    };
  }

  switch (evaluation.verdict) {
    case "excellent":
      return {
        action: "NEW_TOPIC",
        difficulty: bumpDifficulty(difficulty),
        reason: "Excellent answer — advancing to a harder topic.",
      };
    case "strong":
      return {
        action: "FOLLOW_UP",
        difficulty: bumpDifficulty(difficulty),
        reason: "Strong answer — going one level deeper on the same topic.",
      };
    case "good":
      return {
        action: "NEW_TOPIC",
        difficulty,
        reason: "Solid answer — topic covered, moving on.",
      };
    case "weak":
      return {
        action: "CLARIFICATION",
        difficulty: dropDifficulty(difficulty),
        reason: "Weak answer — clarifying and simplifying the approach.",
      };
    case "wrong":
      return {
        action: "CLARIFICATION",
        difficulty: dropDifficulty(difficulty),
        reason: "Incorrect answer — checking the core concept.",
      };
  }
}

// ---------------------------------------------------------------------------
// Session-state store (§40 — performance summary)
// ---------------------------------------------------------------------------

export interface TopicPerformance {
  attempts: number;
  /** Running average overall score (0–10). */
  average: number;
}

export interface PerformanceSummary {
  /** Average overall across all evaluated answers (0–10). */
  overallAverage: number;
  answersEvaluated: number;
  /** Per-topic running averages — drives weak-/strong-area detection. */
  topics: Record<string, TopicPerformance>;
  verdictCounts: Record<EvaluatedAnswer["verdict"], number>;
}

export function emptyPerformanceSummary(): PerformanceSummary {
  return {
    overallAverage: 0,
    answersEvaluated: 0,
    topics: {},
    verdictCounts: { excellent: 0, strong: 0, good: 0, weak: 0, wrong: 0 },
  };
}

/** Merge one evaluation into the running performance summary (§40). */
export function mergePerformance(
  previous: PerformanceSummary,
  evaluation: EvaluatedAnswer,
  topic: string | null
): PerformanceSummary {
  const answersEvaluated = previous.answersEvaluated + 1;
  const overallAverage =
    Math.round(((previous.overallAverage * previous.answersEvaluated + evaluation.overall) / answersEvaluated) * 100) / 100;

  const topics = { ...previous.topics };
  if (topic) {
    const prev = topics[topic] ?? { attempts: 0, average: 0 };
    topics[topic] = {
      attempts: prev.attempts + 1,
      average: Math.round(((prev.average * prev.attempts + evaluation.overall) / (prev.attempts + 1)) * 100) / 100,
    };
  }

  return {
    overallAverage,
    answersEvaluated,
    topics,
    verdictCounts: {
      ...previous.verdictCounts,
      [evaluation.verdict]: previous.verdictCounts[evaluation.verdict] + 1,
    },
  };
}

/** Read a saved performance summary defensively (old/foreign jsonb). */
export function parsePerformanceSummary(raw: unknown): PerformanceSummary {
  if (!raw || typeof raw !== "object") return emptyPerformanceSummary();
  const r = raw as Partial<PerformanceSummary>;
  return {
    overallAverage: typeof r.overallAverage === "number" ? r.overallAverage : 0,
    answersEvaluated: typeof r.answersEvaluated === "number" ? r.answersEvaluated : 0,
    topics: r.topics && typeof r.topics === "object" ? (r.topics as Record<string, TopicPerformance>) : {},
    verdictCounts: {
      excellent: r.verdictCounts?.excellent ?? 0,
      strong: r.verdictCounts?.strong ?? 0,
      good: r.verdictCounts?.good ?? 0,
      weak: r.verdictCounts?.weak ?? 0,
      wrong: r.verdictCounts?.wrong ?? 0,
    },
  };
}
