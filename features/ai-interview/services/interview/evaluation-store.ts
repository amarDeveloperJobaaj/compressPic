import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Database, Json } from "@/lib/supabase/database.types";

import type { EvaluatedAnswer } from "../../schemas/evaluation";
import type { CommunicationMetrics } from "./communication-metrics";
import { getSessionForUser } from "./session";

/**
 * Evaluation store (master spec §46, §54 — Phase 8).
 *
 * Persists each §54 answer evaluation together with the communication
 * metrics pipeline output (§55–57), keyed idempotently on `answer_id`
 * (unique index from migration 008) so a retried turn or a re-evaluation
 * refreshes the row instead of duplicating it.
 *
 * §46 defines the score columns; §54 defines the AI-measured dimensions.
 * The two are mapped as follows (documented, deterministic — Phase 9
 * aggregates on these columns):
 *
 *   technicalAccuracy  → technical_score
 *   relevance          → relevance_score
 *   clarity            → clarity_score
 *   completeness       → answer_quality_score   (key concepts covered)
 *   structure          → communication_score    (logical organization)
 *   depth              → problem_solving_score  (depth for experience level)
 *
 * Ownership is always re-verified server-side (§50 — never trust the client).
 */

type EvaluationRow = Database["public"]["Tables"]["interview_evaluations"]["Row"];
type AnswerRow = Database["public"]["Tables"]["interview_answers"]["Row"];
type QuestionRow = Database["public"]["Tables"]["interview_questions"]["Row"];

type EvaluationStoreErrorKind = "not_found" | "forbidden";

export class EvaluationStoreError extends Error {
  constructor(
    public kind: EvaluationStoreErrorKind,
    message: string
  ) {
    super(message);
    this.name = "EvaluationStoreError";
  }
}

/** Public shape of a persisted evaluation (question context included). */
export interface StoredEvaluation {
  id: string;
  answerId: string;
  questionId: string;
  question: string;
  questionType: string;
  topic: string | null;
  difficulty: string;
  answer: string;
  sequence: number;
  overall: number;
  verdict: EvaluatedAnswer["verdict"];
  scores: {
    technicalAccuracy: number;
    relevance: number;
    clarity: number;
    completeness: number;
    structure: number;
    depth: number;
  };
  strengths: string[];
  weaknesses: string[];
  missingPoints: string[];
  improvement: string | null;
  metrics: CommunicationMetrics;
  createdAt: string;
}

/** Map a §46 row back to the §54 public shape. */
function mapEvaluationRow(
  row: EvaluationRow,
  question: {
    id: string;
    question: string;
    question_type: string;
    topic: string | null;
    difficulty: string;
    sequence: number;
  },
  answer: { transcript: string | null; duration_seconds: number | null } | null = null
): StoredEvaluation {
  const metrics = (row.metrics ?? {}) as Partial<CommunicationMetrics>;
  return {
    id: row.id,
    answerId: row.answer_id,
    questionId: question.id,
    question: question.question,
    questionType: question.question_type,
    topic: question.topic,
    difficulty: question.difficulty,
    answer: answer?.transcript ?? "",
    sequence: question.sequence,
    overall: Number(row.overall_score ?? 0),
    verdict: (row.verdict as EvaluatedAnswer["verdict"]) ?? "good",
    scores: {
      technicalAccuracy: Number(row.technical_score ?? 0),
      relevance: Number(row.relevance_score ?? 0),
      clarity: Number(row.clarity_score ?? 0),
      completeness: Number(row.answer_quality_score ?? 0),
      structure: Number(row.communication_score ?? 0),
      depth: Number(row.problem_solving_score ?? 0),
    },
    strengths: Array.isArray(row.strengths) ? (row.strengths as string[]) : [],
    weaknesses: Array.isArray(row.weaknesses) ? (row.weaknesses as string[]) : [],
    missingPoints: Array.isArray(row.missing_points) ? (row.missing_points as string[]) : [],
    improvement: row.improvement,
    metrics: {
      wordCount: metrics.wordCount ?? 0,
      durationSeconds: metrics.durationSeconds ?? null,
      fillerCount: metrics.fillerCount ?? 0,
      fillerRatio: metrics.fillerRatio ?? 0,
      mostFrequentFillers: metrics.mostFrequentFillers ?? [],
      wordsPerMinute: metrics.wordsPerMinute ?? null,
      paceAssessment: metrics.paceAssessment ?? null,
    },
    createdAt: row.created_at,
  };
}

/** §54 -> §46 column mapping (see header comment). */
function scoreFields(evaluation: EvaluatedAnswer) {
  return {
    technical_score: evaluation.technicalAccuracy,
    relevance_score: evaluation.relevance,
    clarity_score: evaluation.clarity,
    answer_quality_score: evaluation.completeness,
    communication_score: evaluation.structure,
    problem_solving_score: evaluation.depth,
    overall_score: evaluation.overall,
    verdict: evaluation.verdict,
    strengths: evaluation.strengths as unknown as Json,
    weaknesses: evaluation.weaknesses as unknown as Json,
    missing_points: evaluation.missingPoints as unknown as Json,
    improvement: evaluation.improvement || null,
  };
}

/**
 * Resolve the answer's owning session and re-verify the caller owns it.
 * Returns the session id, or throws on unknown answer / foreign session.
 */
async function assertAnswerOwnership(
  userId: string,
  answerId: string
): Promise<{ question: QuestionRow; answer: AnswerRow }> {
  const admin = createAdminClient();
  const { data: answer } = await admin
    .from("interview_answers")
    .select("*")
    .eq("id", answerId)
    .maybeSingle();
  if (!answer) throw new EvaluationStoreError("not_found", "Answer not found.");

  const { data: question } = await admin
    .from("interview_questions")
    .select("id, session_id, question, sequence")
    .eq("id", answer.question_id)
    .maybeSingle();
  if (!question) throw new EvaluationStoreError("not_found", "Question not found.");

  const access = await getSessionForUser(userId, question.session_id);
  if ("error" in access) {
    throw new EvaluationStoreError(
      access.error === "forbidden" ? "forbidden" : "not_found",
      access.message
    );
  }

  return { answer, question: question as QuestionRow };
}

/**
 * Persist one §54 evaluation + communication metrics for a stored answer.
 * Idempotent — upserts on `answer_id` (migration 008 unique index).
 */
export async function persistAnswerEvaluation(
  userId: string,
  answerId: string,
  evaluation: EvaluatedAnswer,
  metrics: CommunicationMetrics
): Promise<StoredEvaluation> {
  const { question } = await assertAnswerOwnership(userId, answerId);

  const admin = createAdminClient();
  const fields = {
    ...scoreFields(evaluation),
    metrics: metrics as unknown as Json,
  };

  const { data, error } = await admin
    .from("interview_evaluations")
    .upsert({ answer_id: answerId, ...fields }, { onConflict: "answer_id" })
    .select("*")
    .single();

  if (error || !data) {
    throw error ?? new Error("Failed to persist the evaluation.");
  }
  return mapEvaluationRow(data, question);
}

/** Read the evaluation for one answer (null when not yet evaluated). */
export async function getEvaluationForAnswer(
  userId: string,
  answerId: string
): Promise<StoredEvaluation | null> {
  const { question } = await assertAnswerOwnership(userId, answerId);

  const admin = createAdminClient();
  const { data } = await admin
    .from("interview_evaluations")
    .select("*")
    .eq("answer_id", answerId)
    .maybeSingle();
  if (!data) return null;
  return mapEvaluationRow(data, question);
}

/** Per-question evaluations for a whole session, in question order (§48). */
export async function listEvaluationsForSession(
  userId: string,
  sessionId: string
): Promise<StoredEvaluation[]> {
  const access = await getSessionForUser(userId, sessionId);
  if ("error" in access) {
    throw new EvaluationStoreError(
      access.error === "forbidden" ? "forbidden" : "not_found",
      access.message
    );
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("interview_questions")
    .select(
      "id, question, question_type, topic, difficulty, sequence, interview_answers!inner(*, interview_evaluations(*))"
    )
    .eq("session_id", sessionId)
    .order("sequence", { ascending: true });

  const evaluations: StoredEvaluation[] = [];
  for (const question of data ?? []) {
    const evaluationRow = question.interview_answers?.[0]?.interview_evaluations?.[0];
    if (!evaluationRow) continue;
    evaluations.push(
      mapEvaluationRow(
        evaluationRow,
        {
          id: question.id,
          question: question.question,
          question_type: question.question_type,
          topic: question.topic,
          difficulty: question.difficulty,
          sequence: question.sequence,
        },
        question.interview_answers?.[0] ?? null
      )
    );
  }
  return evaluations;
}
