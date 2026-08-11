import { NextResponse } from "next/server";

import { startInterviewSession } from "@/features/ai-interview/services/interview/session";
import { requireInterviewUser } from "../../helpers";

/**
 * POST /api/interview/session/:id/start (master spec §43, §79).
 *
 * idle/preparing/ready → active; sets started_at once. Invalid transitions
 * are rejected with 409. Ownership: 403 for another user's session.
 */

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireInterviewUser();
  if (!user.ok) return user.response;

  const { id } = await params;

  try {
    const result = await startInterviewSession(user.userId, id);
    if (!result.ok) {
      const status =
        result.error === "invalid_state" ? 409 : result.error === "forbidden" ? 403 : 404;
      return NextResponse.json({ ok: false, error: result.message }, { status });
    }
    return NextResponse.json({ ok: true, session: result.session });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to start the session.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
