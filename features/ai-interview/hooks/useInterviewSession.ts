"use client";

import { useCallback, useState } from "react";

import type { CreateInterviewSessionInput } from "../schemas/interview-session";
import type { InterviewSession } from "../types";
import {
  createSessionClient,
  endSessionClient,
  startSessionClient,
  type SessionApiResult,
} from "../services/interview/session-client";

/**
 * Session lifecycle calls for the room (master spec §48, §76).
 *
 * Thin wrapper around the client API so the room components stay declarative.
 * Each call returns a discriminated result the caller maps to UI states.
 */
export function useInterviewSession() {
  const [creating, setCreating] = useState(false);
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);

  const createSession = useCallback(
    async (input: CreateInterviewSessionInput): Promise<SessionApiResult<{ session: InterviewSession }>> => {
      setCreating(true);
      try {
        return await createSessionClient(input);
      } finally {
        setCreating(false);
      }
    },
    []
  );

  const startSession = useCallback(
    async (sessionId: string): Promise<SessionApiResult<{ session: InterviewSession }>> => {
      setStarting(true);
      try {
        return await startSessionClient(sessionId);
      } finally {
        setStarting(false);
      }
    },
    []
  );

  const endSession = useCallback(
    async (sessionId: string): Promise<SessionApiResult<{ session: InterviewSession }>> => {
      setEnding(true);
      try {
        return await endSessionClient(sessionId);
      } finally {
        setEnding(false);
      }
    },
    []
  );

  return { creating, starting, ending, createSession, startSession, endSession };
}
