import type { CreateInterviewSessionInput } from "../../schemas/interview-session";
import type { InterviewSession, SessionRecovery } from "../../types";

/**
 * Client-side session API wrappers (master spec §48).
 *
 * Kept separate from services/interview/session.ts (server-only) so browser
 * components can call the routes directly. All ownership/auth is enforced
 * server-side from the session cookie.
 */

export interface ApiFailure {
  ok: false;
  error: string;
  status: number;
}

export type SessionApiResult<T> = { ok: true; data: T } | ApiFailure;

async function apiRequest<T>(url: string, init?: RequestInit): Promise<SessionApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    return { ok: false, error: "Network error — check your connection.", status: 0 };
  }
  const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!res.ok || !data?.ok) {
    return {
      ok: false,
      error: data?.error ?? "Something went wrong.",
      status: res.status,
    };
  }
  return { ok: true, data: data as T };
}

function postJson<T>(url: string, body: unknown): Promise<SessionApiResult<T>> {
  return apiRequest<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

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
