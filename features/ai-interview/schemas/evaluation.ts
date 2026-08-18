import { z } from "zod";

/**
 * Answer evaluation schemas (master spec §46, §54).
 *
 * Every AI provider must honor this STRICT JSON contract for
 * `evaluateAnswer` (§74 — validate → retry once → graceful fallback). The six
 * dimensions are scored 0–10; qualitative notes feed the Phase 8 evaluation
 * store and the Phase 9 report. The adaptive controller (Phase 7) derives the
 * verdict + next action from the scores deterministically — the AI never
 * decides the interview's direction, it only measures the answer.
 */

export const AnswerEvaluationSchema = z.object({
  /** §54 — is the technical content correct? */
  technicalAccuracy: z.number().min(0).max(10),
  /** §54 — does it directly answer the question asked? */
  relevance: z.number().min(0).max(10),
  /** §54 — are the key concepts covered? */
  completeness: z.number().min(0).max(10),
  /** §54 — is it understandable? */
  clarity: z.number().min(0).max(10),
  /** §54 — is it logically organized? */
  structure: z.number().min(0).max(10),
  /** §54 — appropriate depth for the experience level? */
  depth: z.number().min(0).max(10),
  /** What the candidate did well (quote when possible). */
  strengths: z.array(z.string().max(300)).max(6).default([]),
  /** Where the answer fell short. */
  weaknesses: z.array(z.string().max(300)).max(6).default([]),
  /** Key concepts the answer missed. */
  missingPoints: z.array(z.string().max(300)).max(6).default([]),
  /** One constructive, actionable improvement. */
  improvement: z.string().max(600).default(""),
});

export type AnswerEvaluation = z.infer<typeof AnswerEvaluationSchema>;

/** A fully validated evaluation (scores derived verdict included). */
export const EvaluatedAnswerSchema = AnswerEvaluationSchema.extend({
  /** Deterministic 0–10 mean of the six §54 dimensions. */
  overall: z.number().min(0).max(10),
  /** Derived from `overall` — drives the adaptive controller (§24). */
  verdict: z.enum(["excellent", "strong", "good", "weak", "wrong"]),
});

export type EvaluatedAnswer = z.infer<typeof EvaluatedAnswerSchema>;
