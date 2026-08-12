"use client";

import { useCallback, useState } from "react";

import {
  answerAndAskNextClient,
  generateFirstQuestionClient,
  type AnswerTurnInput,
  type QuestionTurnData,
} from "../services/interview/question-client";
import type { SessionApiResult } from "../services/interview/http-client";

/**
 * Question engine calls for the room (master spec §48).
 *
 * Thin wrapper around the client API so the room stays declarative: Begin →
 * askFirstQuestion; each submitted answer → answerAndAskNext (persists the
 * answer and returns the next question). `busy` mirrors the §79 PROCESSING /
 * ASKING window so the UI can disable interactions.
 */
export function useQuestionEngine() {
  const [busy, setBusy] = useState(false);

  const askFirstQuestion = useCallback(
    async (sessionId: string): Promise<SessionApiResult<QuestionTurnData>> => {
      setBusy(true);
      try {
        return await generateFirstQuestionClient(sessionId);
      } finally {
        setBusy(false);
      }
    },
    []
  );

  const answerAndAskNext = useCallback(
    async (
      sessionId: string,
      answer: AnswerTurnInput
    ): Promise<SessionApiResult<QuestionTurnData>> => {
      setBusy(true);
      try {
        return await answerAndAskNextClient(sessionId, answer);
      } finally {
        setBusy(false);
      }
    },
    []
  );

  return { busy, askFirstQuestion, answerAndAskNext };
}
