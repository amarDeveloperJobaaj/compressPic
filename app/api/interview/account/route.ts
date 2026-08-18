import { NextResponse } from "next/server";

import { deleteAllUserData } from "@/features/ai-interview/services/interview/history";
import { requireInterviewUser } from "../session/helpers";

/**
 * DELETE /api/interview/account (Phase 12 — privacy/retention).
 *
 * Wipes every interview session (cascades to questions, answers, evaluations
 * and reports) AND every uploaded resume for the signed-in user. Ownership is
 * server-derived from the auth session — a user can only delete their own
 * data.
 */

export async function DELETE() {
  const user = await requireInterviewUser();
  if (!user.ok) return user.response;

  try {
    const result = await deleteAllUserData(user.userId);
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
    }
    return NextResponse.json({ ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to delete your data.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
