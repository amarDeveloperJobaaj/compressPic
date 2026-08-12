import type { CreateInterviewSessionInput } from "../../schemas/interview-session";
import type { InterviewSession, SessionRecovery } from "../../types";
import { apiRequest, postJson, type SessionApiResult } from "./http-client";

/**
 * Client-side session API wrappers (master spec §48).
 *
 * Kept separate from services/interview/session.ts (server-only) so browser
 * components can call the routes directly. All ownership/auth is enforced
 * server-side from the session cookie.
 */

export type { SessionApiResult };

export function createSessionClient(
  input: CreateInterviewSessionInput
): Promise<SessionApiResult<{ session: InterviewSession }>> {
  return postJson("/api/interview/session/create", input);
}

export function startSessionClient(
  sessionId: string
): Promise<SessionApiResult<{ session: InterviewSession }>> {
  return postJson(`/api/interview/session/${sessionId}/start`, {});
}

export function endSessionClient(
  sessionId: string
): Promise<SessionApiResult<{ session: InterviewSession }>> {
  return postJson(`/api/interview/session/${sessionId}/end`, {});
}

/** Recovery payload (§76) — session + questions with answers. */
export function getSessionClient(sessionId: string): Promise<SessionApiResult<SessionRecovery>> {
  return apiRequest(`/api/interview/session/${sessionId}`, { method: "GET" });
}
