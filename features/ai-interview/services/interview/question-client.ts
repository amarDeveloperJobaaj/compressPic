import type { SessionAnswer, SessionQuestion } from "../../types";
import { postJson, type SessionApiResult } from "./http-client";

/**
 * Client-side question engine wrappers (master spec §48 — question/generate
 * and question/follow-up). The room calls one per turn; answers are persisted
 * server-side with the follow-up round-trip.
 */

export interface AnswerTurnInput {
  questionId: string;
  transcript: string;
  durationSeconds?: number;
}

export interface QuestionTurnData {
  question: SessionQuestion;
  answer: SessionAnswer | null;
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
