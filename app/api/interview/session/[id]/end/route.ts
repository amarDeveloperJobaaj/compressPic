import { NextResponse } from "next/server";

import { endInterviewSession } from "@/features/ai-interview/services/interview/session";
import { requireInterviewUser } from "../../helpers";

/**
 * POST /api/interview/session/:id/end (master spec §43).
 *
 * Any non-completed state → completed + ended_at. Idempotent: ending an
 * already-completed session returns it unchanged. overall_score is written
 * later by the report phase (Phase 9).
 */

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireInterviewUser();
  if (!user.ok) return user.response;

  const { id } = await params;

  try {
    const result = await endInterviewSession(user.userId, id);
    if (!result.ok) {
      const status = result.error === "forbidden" ? 403 : 404;
      return NextResponse.json({ ok: false, error: result.message }, { status });
    }
    return NextResponse.json({ ok: true, session: result.session });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to end the session.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
