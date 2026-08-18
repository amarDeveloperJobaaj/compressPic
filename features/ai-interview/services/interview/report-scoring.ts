import type { ReportScores } from "../../schemas/report";
import type { StoredEvaluation } from "./evaluation-store";

/**
 * Weighted scoring model (master spec §58, Phase 9).
 *
 * Turns persisted per-answer §54 evaluations (+ §55–57 metrics) into the
 * report's five category scores, 0–100. Pure and deterministic — the AI
 * never invents these numbers; it only writes the qualitative sections.
 *
 * Category derivation per answer (from the six §54 dimensions):
 *   technical      = avg(technicalAccuracy, depth)
 *   problemSolving = avg(depth, structure)
 *   communication  = avg(clarity, structure) − filler penalty (practice metric)
 *   project        = avg(completeness, relevance)
 *   behavioral     = avg(relevance, clarity)
 *
 * Category scores are the mean across answered questions; `overall` is the
 * category mean WEIGHTED by the interview type (§58 — a technical interview
 * weights technical higher than an HR one).
 */

export const INTERVIEW_TYPE_WEIGHTS: Record<string, Record<keyof ReportScores, number>> = {
  technical: {
    overall: 0,
    technical: 0.35,
    communication: 0.15,
    problemSolving: 0.25,
    project: 0.15,
    behavioral: 0.1,
  },
  "system-design": {
    overall: 0,
    technical: 0.3,
    communication: 0.15,
    problemSolving: 0.3,
    project: 0.15,
    behavioral: 0.1,
  },
  // Phase 13 — coding interviews weight algorithm/correctness + problem solving.
  coding: {
    overall: 0,
    technical: 0.4,
    communication: 0.05,
    problemSolving: 0.4,
    project: 0.1,
    behavioral: 0.05,
  },
  behavioral: {
    overall: 0,
    technical: 0.1,
    communication: 0.25,
    problemSolving: 0.15,
    project: 0.15,
    behavioral: 0.35,
  },
  hr: {
    overall: 0,
    technical: 0.1,
    communication: 0.3,
    problemSolving: 0.1,
    project: 0.1,
    behavioral: 0.4,
  },
  mixed: {
    overall: 0,
    technical: 0.25,
    communication: 0.2,
    problemSolving: 0.2,
    project: 0.2,
    behavioral: 0.15,
  },
};

/** Weights for any interview type not listed — a balanced mix. */
const DEFAULT_WEIGHTS = INTERVIEW_TYPE_WEIGHTS.mixed;

export type ReportCategory = Exclude<keyof ReportScores, "overall">;

export function getCategoryWeights(interviewType: string): Record<ReportCategory, number> {
  const weights = INTERVIEW_TYPE_WEIGHTS[interviewType] ?? DEFAULT_WEIGHTS;
  return {
    technical: weights.technical,
    communication: weights.communication,
    problemSolving: weights.problemSolving,
    project: weights.project,
    behavioral: weights.behavioral,
  };
}

/** Filler penalty (practice metric, §55): heavy fillers lower communication. */
function fillerPenalty(evaluation: StoredEvaluation): number {
  const fillerCount = evaluation.metrics.fillerCount ?? 0;
  if (fillerCount <= 3) return 0;
  return Math.min(10, fillerCount);
}

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(value)));

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** Per-answer category scores (0–100) from the six §54 dimensions + metrics. */
export function categoryScoresForAnswer(evaluation: StoredEvaluation): Record<ReportCategory, number> {
  const s = evaluation.scores;
  return {
    technical: avg([s.technicalAccuracy, s.depth]) * 10,
    problemSolving: avg([s.depth, s.structure]) * 10,
    communication: Math.max(0, avg([s.clarity, s.structure]) * 10 - fillerPenalty(evaluation)),
    project: avg([s.completeness, s.relevance]) * 10,
    behavioral: avg([s.relevance, s.clarity]) * 10,
  };
}

/**
 * Aggregate the report scores (0–100) for a completed session.
 * Empty evaluations → all zeros (a report needs answered questions).
 */
export function computeReportScores(
  evaluations: StoredEvaluation[],
  interviewType: string
): ReportScores {
  const perAnswer = evaluations.map(categoryScoresForAnswer);
  if (perAnswer.length === 0) {
    return {
      overall: 0,
      technical: 0,
      communication: 0,
      problemSolving: 0,
      project: 0,
      behavioral: 0,
    };
  }

  const weights = getCategoryWeights(interviewType);
  const categories: Record<ReportCategory, number> = {
    technical: clamp(avg(perAnswer.map((a) => a.technical))),
    communication: clamp(avg(perAnswer.map((a) => a.communication))),
    problemSolving: clamp(avg(perAnswer.map((a) => a.problemSolving))),
    project: clamp(avg(perAnswer.map((a) => a.project))),
    behavioral: clamp(avg(perAnswer.map((a) => a.behavioral))),
  };

  const overall = Object.keys(weights).reduce(
    (sum, key) => sum + categories[key as ReportCategory] * weights[key as ReportCategory],
    0
  );

  return { ...categories, overall: clamp(overall) };
}
