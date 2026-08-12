import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";

import { getAIProvider } from "../ai";
import type { QuestionContext } from "../ai/types";
import {
  GeneratedQuestionSchema,
  StoreAnswerInputSchema,
} from "../../schemas/question";
import type { StoreAnswerInput } from "../../schemas/question";
import type { SessionAnswer, SessionQuestion } from "../../types";
import {
  getSessionForUser,
  mapQuestionRow,
  storeAnswer,
  storeQuestion,
  updateSessionState,
} from "./session";

/**
 * Question engine (master spec §23–27, §48, §52–53, §79).
 *
 * The AI conducts a basic interview: generate a first question, then after
 * each stored answer generate the next one (follow-up or new topic — the
 * provider decides via the §53 structured action). Every question/answer is
 * persisted with ownership verified, sequences serialized (migration 006),
 * and the §40 session state kept in sync.
 *
 * Provider failures never hard-fail: the adapter falls back to the local
 * heuristic generator (§74), so the interview always continues.
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
  question: SessionQuestion;
  answer: SessionAnswer | null;
}

type SessionRow = Database["public"]["Tables"]["interview_sessions"]["Row"];
type QuestionRow = Database["public"]["Tables"]["interview_questions"]["Row"];
type QuestionWithAnswers = QuestionRow & { interview_answers: Database["public"]["Tables"]["interview_answers"]["Row"][] | null };

interface LoadedContext {
  status: string;
  questions: QuestionWithAnswers[];
  context: QuestionContext;
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

  const previous = questions.map((q) => ({
    id: q.id,
    sequence: q.sequence,
    question: q.question,
    type: q.question_type,
    topic: q.topic,
    difficulty: q.difficulty as QuestionContext["previousQuestions"][number]["difficulty"],
    answer: q.interview_answers?.[0]?.transcript ?? null,
  }));

  const last = previous[previous.length - 1] ?? null;
  const lastAnswer =
    last?.answer != null
      ? { question: last.question, answer: last.answer }
      : null;

  const config = (row.config ?? {}) as Record<string, unknown>;

  const context: QuestionContext = {
    mode,
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
    return { question: mapQuestionRow(questions[0]), answer: null };
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

  return { question, answer: null };
}

/**
 * Persist the candidate's answer + generate the next question
 * (POST /api/interview/question/follow-up). One round-trip per turn.
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

  const { status, questions, context } = await loadContext(userId, sessionId, "next");
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

  // Count from the pre-insert snapshot so retries (answer already stored by a
  // failed attempt) never inflate the counter — `latest` is the answered row.
  const alreadyAnswered = questions.filter((q) => q.interview_answers?.length).length;
  const answeredCount = alreadyAnswered + (latest.interview_answers?.length ? 0 : 1);
  await updateSessionState(userId, sessionId, { questionsAnswered: answeredCount });

  // The provider sees the fresh answer as lastAnswer.
  const provider = getAIProvider();
  const generated = GeneratedQuestionSchema.parse(
    await provider.generateFollowUp({
      ...context,
      lastAnswer: { question: latest.question, answer: parsed.data.transcript },
    })
  );

  const question = await storeQuestion(userId, sessionId, {
    question: generated.question,
    questionType: generated.type,
    topic: generated.topic,
    difficulty: generated.difficulty,
    // Follow-ups/clarifications link to the question they build on (§44).
    parentQuestionId:
      generated.action === "FOLLOW_UP" || generated.action === "CLARIFICATION"
        ? latest.id
        : null,
  });

  await updateSessionState(userId, sessionId, {
    currentTopic: generated.topic,
    difficulty: generated.difficulty,
    questionsAsked: questions.length + 1,
    currentQuestion: question.sequence,
  });

  return { question, answer };
}
