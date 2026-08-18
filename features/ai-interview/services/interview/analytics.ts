/**
 * Lightweight interview analytics (master spec §12 — observability).
 *
 * Structured, single-line event logs for the interview engine's key moments.
 * Emitted in development always; in production only when INTERVIEW_ANALYTICS=1
 * so hosting log drains (Vercel/Node) can ingest them without a third-party
 * SDK. No PII is ever logged — only ids, counts and statuses.
 *
 *   INTERVIEW_ANALYTICS=1  npm run build && npm start   → events in prod logs
 */

export type InterviewEventName =
  | "session_created"
  | "session_started"
  | "session_ended"
  | "session_deleted"
  | "resume_deleted"
  | "first_question_generated"
  | "answer_stored"
  | "evaluation_persisted"
  | "report_generated";

interface InterviewEventData {
  [key: string]: string | number | boolean | null;
}

function enabled(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return process.env.INTERVIEW_ANALYTICS === "1";
}

/** Emit one structured event line (safe for log drains). */
export function logInterviewEvent(name: InterviewEventName, data: InterviewEventData): void {
  if (!enabled()) return;
  console.log(`[interview] ${name} ${JSON.stringify({ event: name, ...data, t: new Date().toISOString() })}`);
}
