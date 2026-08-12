import { z } from "zod";

import { DifficultySchema } from "./interview-session";

/**
 * Question engine schemas (master spec §44–45, §53).
 *
 * GeneratedQuestion is the STRICT JSON contract every AI provider must honor
 * (§74 — validate → retry once → graceful fallback). `action` is the §53
 * control signal; Phase 5 stores it with the question so Phase 7's adaptive
 * controller can act on it later.
 */

export const QuestionActionSchema = z.enum([
  "NEW_TOPIC",
  "FOLLOW_UP",
  "CLARIFICATION",
  "END_INTERVIEW",
]);

export const QuestionTypeSchema = z.enum([
  "technical",
  "project",
  "behavioral",
  "hr",
  "problem_solving",
]);

export const GeneratedQuestionSchema = z.object({
  /** §53 action — how the engine should continue after this question. */
  action: QuestionActionSchema.default("NEW_TOPIC"),
  /** One clear, focused question (§95). */
  question: z.string().min(5, "Question is too short.").max(500),
  /** Category stored in interview_questions.question_type (§44). */
  type: QuestionTypeSchema.default("technical"),
  /** Short topic label (e.g. "react", "project: E-commerce") — drives dedupe. */
  topic: z.string().min(1).max(80).nullable().default(null),
  difficulty: DifficultySchema.default("intermediate"),
  /** Brief note on why this question — transparent, never shown as "gotcha". */
  reason: z.string().max(400).default(""),
});

export type GeneratedQuestion = z.infer<typeof GeneratedQuestionSchema>;

/** Body for persisting one candidate answer (§45 — text fallback for now). */
export const StoreAnswerInputSchema = z.object({
  questionId: z.string().uuid("Invalid question id."),
  transcript: z.string().min(1, "Answer is empty.").max(8000, "Answer is too long."),
  durationSeconds: z.number().int().min(0).max(7200).optional(),
});

export type StoreAnswerInput = z.infer<typeof StoreAnswerInputSchema>;
