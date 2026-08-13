import type { EvaluatedAnswer } from "../../schemas/evaluation";
import type { SessionAnswer, SessionQuestion } from "../../types";
import { postJson, type SessionApiResult } from "./http-client";

/**
 * Client-side question engine wrappers (master spec §48 — question/generate,
 * question/follow-up and answer/evaluate). The room calls one per turn;
 * answers are persisted server-side with the follow-up round-trip.
 */

export interface AnswerTurnInput {
  questionId: string;
  transcript: string;
  durationSeconds?: number;
}

export interface QuestionTurnData {
  /** Next question — null when the engine ended the interview (budget). */
  question: SessionQuestion | null;
  answer: SessionAnswer | null;
  /** True when the adaptive engine decided to end (END_INTERVIEW). */
  ended: boolean;
  /** §54 evaluation of the just-submitted answer. */
  evaluation: EvaluatedAnswer | null;
}

export function generateFirstQuestionClient(
  sessionId: string
): Promise<SessionApiResult<QuestionTurnData>> {
  return postJson("/api/interview/question/generate", { sessionId });
}

export function answerAndAskNextClient(
  sessionId: string,
  answer: AnswerTurnInput
): Promise<SessionApiResult<QuestionTurnData>> {
  return postJson("/api/interview/question/follow-up", { sessionId, answer });
}
