import { NextResponse } from "next/server";

import { deleteSession } from "@/features/ai-interview/services/interview/history";
import { getSessionRecovery } from "@/features/ai-interview/services/interview/session";
import { requireInterviewUser } from "../helpers";

/**
 * GET /api/interview/session/:id (master spec §48, §76).
 *
 * Ownership-gated recovery payload: the session row plus all questions (with
 * their answers) in order — a reconnecting room restores from this exactly.
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
    const result = await getSessionRecovery(user.userId, id);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.message },
        { status: result.error === "forbidden" ? 403 : 404 }
      );
    }
    return NextResponse.json({ ok: true, ...result.recovery });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load the session.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/interview/session/:id (Phase 10 — §64).
 *
 * Permanently removes the session (cascades to questions, answers,
 * evaluations and the report). Ownership-gated: 403 / 404.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireInterviewUser();
  if (!user.ok) return user.response;

  const { id } = await params;

  try {
    const result = await deleteSession(user.userId, id);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.forbidden ? 403 : 404 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to delete the session.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
