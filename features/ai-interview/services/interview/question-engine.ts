import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";

import { getAIProvider } from "../ai";
import type { EvaluationContext, QuestionContext } from "../ai/types";
import type { EvaluatedAnswer } from "../../schemas/evaluation";
import {
  GeneratedQuestionSchema,
  StoreAnswerInputSchema,
} from "../../schemas/question";
import type { StoreAnswerInput } from "../../schemas/question";
import { SessionStateSchema } from "../../schemas/interview-session";
import type { SessionState } from "../../schemas/interview-session";
import type { SessionAnswer, SessionQuestion } from "../../types";
import {
  computeOverall,
  computeQuestionBudget,
  decideNextTurn,
  deriveVerdict,
  mergePerformance,
  parsePerformanceSummary,
} from "./adaptive-controller";
import type { CommunicationMetrics } from "./communication-metrics";
import { buildCommunicationMetrics } from "./communication-metrics";
import { trimPreviousQuestions } from "./context-budget";
import { logInterviewEvent } from "./analytics";
import { persistAnswerEvaluation } from "./evaluation-store";
import { computeAnsweredCount } from "./turn-math";
import {
  endInterviewSession,
  getSessionForUser,
  mapQuestionRow,
  storeAnswer,
  storeQuestion,
  updateSessionState,
} from "./session";

/**
 * Question engine (master spec §23–27, §48, §52–53, §79).
 *
 * The engine conducts the interview: generate a first question, then after
 * each stored answer EVALUATE it on the §54 dimensions, let the ADAPTIVE
 * CONTROLLER decide the next move (follow-up / clarification / new topic /
 * end — Phase 7), and generate the next question honoring that decision.
 * Every question/answer is persisted with ownership verified, sequences
 * serialized (migration 006), and the §40 session state (topic, difficulty,
 * progress, performance summary) kept in sync.
 *
 * Provider failures never hard-fail: the adapter falls back to the local
 * heuristic generator/evaluator (§74), so the interview always continues.
 */

type QuestionEngineErrorKind = "not_found" | "forbidden" | "invalid_state" | "validation";

export class QuestionEngineError extends Error {
  constructor(
    public kind: QuestionEngineErrorKind,
    message: string
  ) {
    super(message);
    this.name = "QuestionEngineError";
  }
}

export interface QuestionTurnResult {
  /** Next question — null when the interview ended (END_INTERVIEW). */
  question: SessionQuestion | null;
  answer: SessionAnswer | null;
  /** True when the interview ended (budget reached) — no next question. */
  ended: boolean;
  /** §54 evaluation of the just-submitted answer. */
  evaluation: EvaluatedAnswer | null;
  /** §55–57 communication metrics for the just-submitted answer. */
  metrics: CommunicationMetrics | null;
}

type SessionRow = Database["public"]["Tables"]["interview_sessions"]["Row"];
type QuestionRow = Database["public"]["Tables"]["interview_questions"]["Row"];
type QuestionWithAnswers = QuestionRow & { interview_answers: Database["public"]["Tables"]["interview_answers"]["Row"][] | null };

interface LoadedContext {
  status: string;
  questions: QuestionWithAnswers[];
  context: QuestionContext;
  /** Parsed §40 live state (difficulty, performance summary, progress). */
  state: SessionState;
  /** Duration minutes — drives the question budget (§40 END rules). */
  durationMinutes: number;
}

/** Remaining time from started_at — honest pacing context for the prompt. */
function remainingFrom(startedAt: string | null, durationMinutes: number): number | null {
  if (!startedAt) return null;
  const elapsed = (Date.now() - new Date(startedAt).getTime()) / 1000;
  return Math.max(0, Math.round(durationMinutes * 60 - elapsed));
}

async function loadContext(
  userId: string,
  sessionId: string,
  mode: QuestionContext["mode"]
): Promise<LoadedContext> {
  const access = await getSessionForUser(userId, sessionId);
  if ("error" in access) {
    throw new QuestionEngineError(access.error, access.message);
  }
  const row = access.row as SessionRow;

  const admin = createAdminClient();

  // Candidate profile from the linked resume row (null when skipped).
  let candidateProfile: QuestionContext["candidateProfile"] = null;
  if (row.resume_id) {
    const { data: resume } = await admin
      .from("resumes")
      .select("candidate_profile")
      .eq("id", row.resume_id)
      .maybeSingle();
    if (resume?.candidate_profile) {
      candidateProfile = resume.candidate_profile as QuestionContext["candidateProfile"];
    }
  }

  // Ordered history — questions with their (single) answer when present.
  const { data: questionRows } = await admin
    .from("interview_questions")
    .select("*, interview_answers(*)")
    .eq("session_id", sessionId)
    .order("sequence", { ascending: true });
  const questions = (questionRows ?? []) as QuestionWithAnswers[];

  // Phase 11 — cost cap: the provider only sees the most recent turns; the
  // DB still stores the full history (trimming is prompt-only, §11).
  const previous = trimPreviousQuestions(questions.map((q) => ({
    id: q.id,
    sequence: q.sequence,
    question: q.question,
    type: q.question_type,
    topic: q.topic,
    difficulty: q.difficulty as QuestionContext["previousQuestions"][number]["difficulty"],
    answer: q.interview_answers?.[0]?.transcript ?? null,
  })));

  const last = previous[previous.length - 1] ?? null;
  const lastAnswer =
    last?.answer != null
      ? { question: last.question, answer: last.answer }
      : null;

  const config = (row.config ?? {}) as Record<string, unknown>;

  const state = SessionStateSchema.parse(row.current_state ?? {});

  const context: QuestionContext = {
    mode,
    // Phase 13 — interviewer persona tone directive (premium, flag-gated).
    personalityId: (config.personalityId as string | null | undefined) ?? null,
    targetRole: row.target_role,
    domainId: (config.domainId as string | undefined) ?? null,
    domain: row.domain,
    targetCompany: row.target_company,
    experienceLevel: row.experience_level,
    interviewType: row.interview_type,
    difficulty: (row.difficulty as QuestionContext["difficulty"]) ?? "intermediate",
    candidateProfile,
    remainingTimeSeconds: remainingFrom(row.started_at, row.duration_minutes),
    previousQuestions: previous,
    lastAnswer,
  };

  return {
    status: row.status,
    questions,
    context,
    state,
    durationMinutes: row.duration_minutes,
  };
}

/** The session must be live for a question turn (§79). */
function requireLive(status: string): void {
  const live = ["ready", "active", "listening", "asking"];
  if (!live.includes(status)) {
    throw new QuestionEngineError(
      "invalid_state",
      `Cannot ask a question in status "${status}".`
    );
  }
}

/**
 * First question of the interview (POST /api/interview/question/generate).
 */
export async function askFirstQuestion(
  userId: string,
  sessionId: string
): Promise<QuestionTurnResult> {
  const { status, questions, context } = await loadContext(userId, sessionId, "first");
  requireLive(status);

  // Idempotent retry: if the first question is already stored (e.g. the
  // response was lost after the server committed), return it instead of
  // generating a duplicate.
  if (questions.length > 0) {
    return { question: mapQuestionRow(questions[0]), answer: null, ended: false, evaluation: null, metrics: null };
  }

  const provider = getAIProvider();
  const generated = GeneratedQuestionSchema.parse(await provider.generateQuestion(context));

  const question = await storeQuestion(userId, sessionId, {
    question: generated.question,
    questionType: generated.type,
    topic: generated.topic,
    difficulty: generated.difficulty,
    parentQuestionId: null,
  });

  await updateSessionState(userId, sessionId, {
    currentTopic: generated.topic,
    difficulty: generated.difficulty,
    questionsAsked: 1,
    currentQuestion: question.sequence,
  });

  return { question, answer: null, ended: false, evaluation: null, metrics: null };
}

/** Build the §54 evaluation context for one just-answered question. */
function buildEvaluationContext(
  context: QuestionContext,
  latest: QuestionWithAnswers,
  answerText: string
): EvaluationContext {
  return {
    question: latest.question,
    questionType: latest.question_type,
    topic: latest.topic,
    difficulty: (latest.difficulty as QuestionContext["difficulty"]) ?? "intermediate",
    answer: answerText,
    experienceLevel: context.experienceLevel,
    candidateProfile: context.candidateProfile,
    targetRole: context.targetRole,
    domain: context.domain,
  };
}

/**
 * Evaluate one stored answer on the §54 dimensions (POST /answer/evaluate).
 * Reuses the exact same provider path as the turn loop, so the standalone
 * route and the adaptive flow can never disagree.
 */
export async function evaluateStoredAnswer(
  userId: string,
  sessionId: string,
  questionId: string
): Promise<{ evaluation: EvaluatedAnswer; metrics: CommunicationMetrics }> {
  const { questions, context } = await loadContext(userId, sessionId, "next");
  const question = questions.find((q) => q.id === questionId);
  const answer = question?.interview_answers?.[0];
  if (!question || !answer?.transcript) {
    throw new QuestionEngineError(
      "not_found",
      "Answer not found for this question."
    );
  }

  const provider = getAIProvider();
  const raw = await provider.evaluateAnswer(
    buildEvaluationContext(context, question, answer.transcript)
  );
  const overall = computeOverall(raw);
  const verdict = deriveVerdict(overall);
  const evaluation: EvaluatedAnswer = { ...raw, overall, verdict };

  // Phase 8 — persist the evaluation + communication metrics (§55–57).
  const metrics = buildCommunicationMetrics(
    answer.transcript,
    answer.duration_seconds ?? null
  );
  await persistAnswerEvaluation(userId, answer.id, evaluation, metrics);

  return { evaluation, metrics };
}

/**
 * Persist the candidate's answer, evaluate it (§54), let the adaptive
 * controller decide the next move, then generate the next question — or end
 * the interview when a budget is reached (END_INTERVIEW rules).
 *
 * (POST /api/interview/question/follow-up — one round-trip per turn.)
 */
export async function answerAndAskNext(
  userId: string,
  sessionId: string,
  input: StoreAnswerInput
): Promise<QuestionTurnResult> {
  const parsed = StoreAnswerInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new QuestionEngineError(
      "validation",
      parsed.error.issues[0]?.message ?? "Invalid answer input."
    );
  }

  const { status, questions, context, state, durationMinutes } = await loadContext(
    userId,
    sessionId,
    "next"
  );
  requireLive(status);

  // The answer must target the latest question of this session (order matters).
  const latest = questions[questions.length - 1];
  if (!latest || latest.id !== parsed.data.questionId) {
    throw new QuestionEngineError(
      "invalid_state",
      "Answer out of order — answer the current question first."
    );
  }

  const answer = await storeAnswer(userId, parsed.data.questionId, {
    transcript: parsed.data.transcript,
    durationSeconds: parsed.data.durationSeconds,
  });

  // Phase 8 — communication metrics pipeline (§55–57) for this answer.
  const metrics = buildCommunicationMetrics(
    parsed.data.transcript,
    parsed.data.durationSeconds ?? null
  );

  // Retry-safe count from the pre-insert snapshot (§40) — a resubmitted
  // answer (stored by a failed attempt) must not inflate questionsAnswered.
  const answeredCount = computeAnsweredCount(
    questions.filter((q) => q.interview_answers?.length).length,
    Boolean(latest.interview_answers?.length)
  );

  // ---- Phase 7: evaluate → adapt → decide --------------------------------
  const provider = getAIProvider();
  const raw = await provider.evaluateAnswer(
    buildEvaluationContext(context, latest, parsed.data.transcript)
  );
  const overall = computeOverall(raw);
  const verdict = deriveVerdict(overall);
  const evaluation: EvaluatedAnswer = { ...raw, overall, verdict };

  // Follow-up depth = consecutive trailing questions that are follow-ups
  // (parent_question_id set) — the controller stops drilling at the cap.
  let followUpDepth = 0;
  for (let i = questions.length - 1; i >= 0; i--) {
    if (!questions[i].parent_question_id) break;
    followUpDepth++;
  }

  const decision = decideNextTurn({
    evaluation,
    difficulty: state.difficulty,
    questionsAsked: questions.length,
    remainingTimeSeconds: context.remainingTimeSeconds,
    questionBudget: computeQuestionBudget(durationMinutes),
    followUpDepth,
  });

  // Phase 8 — persist the §54 evaluation + metrics (idempotent, per answer).
  await persistAnswerEvaluation(userId, answer.id, evaluation, metrics);
  logInterviewEvent("answer_stored", {
    sessionId,
    answerId: answer.id,
    questionsAnswered: answeredCount,
    verdict: verdict,
  });
  logInterviewEvent("evaluation_persisted", {
    sessionId,
    answerId: answer.id,
    overall: overall,
  });

  // END_INTERVIEW rules (time / question budget) — finalize the session here.
  if (decision.action === "END_INTERVIEW") {
    await updateSessionState(userId, sessionId, { questionsAnswered: answeredCount });
    await endInterviewSession(userId, sessionId);
    return { question: null, answer, ended: true, evaluation, metrics };
  }

  await updateSessionState(userId, sessionId, { questionsAnswered: answeredCount });

  // The provider writes ONE question honoring the controller's decision.
  const generated = GeneratedQuestionSchema.parse(
    await provider.generateFollowUp({
      ...context,
      lastAnswer: { question: latest.question, answer: parsed.data.transcript },
      adaptiveIntent: {
        action: decision.action,
        difficulty: decision.difficulty,
        reason: decision.reason,
      },
    })
  );

  const question = await storeQuestion(userId, sessionId, {
    question: generated.question,
    questionType: generated.type,
    topic: generated.topic,
    // The controller's difficulty is authoritative (§25) — the AI's is ignored.
    difficulty: decision.difficulty,
    // Follow-ups/clarifications link to the question they build on (§44).
    parentQuestionId:
      decision.action === "FOLLOW_UP" || decision.action === "CLARIFICATION"
        ? latest.id
        : null,
  });

  // §40 session-state store: topic, difficulty, progress + performance.
  await updateSessionState(userId, sessionId, {
    currentTopic: generated.topic ?? latest.topic,
    difficulty: decision.difficulty,
    questionsAsked: questions.length + 1,
    currentQuestion: question.sequence,
    performanceSummary: mergePerformance(
      parsePerformanceSummary(state.performanceSummary),
      evaluation,
      generated.topic ?? latest.topic
    ) as unknown as SessionState["performanceSummary"],
  });

  return { question, answer, ended: false, evaluation, metrics };
}
