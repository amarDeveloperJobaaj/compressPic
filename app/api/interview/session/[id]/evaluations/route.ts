import { NextResponse } from "next/server";

import { listEvaluationsForSession } from "@/features/ai-interview/services/interview/evaluation-store";
import { toHttpStatus } from "@/features/ai-interview/services/interview/http-status";
import { requireInterviewUser } from "../../helpers";

/**
 * GET /api/interview/session/:id/evaluations (Phase 8 — §48, §54).
 *
 * Ownership-gated list of every persisted per-question evaluation for a
 * session, in question order — the input Phase 9's report aggregation
 * consumes. Each entry carries the §54 scores, overall + verdict, qualitative
 * notes and the §55–57 communication metrics.
 *   404 = no such session · 403 = exists but owned by someone else.
 */

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireInterviewUser();
  if (!user.ok) return user.response;

  const { id } = await params;

  try {
    const evaluations = await listEvaluationsForSession(user.userId, id);
    return NextResponse.json({ ok: true, count: evaluations.length, evaluations });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load evaluations.";
    return NextResponse.json({ ok: false, error: message }, { status: toHttpStatus(e) });
  }
}
