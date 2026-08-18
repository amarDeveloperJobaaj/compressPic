import { NextResponse } from "next/server";

import { getHistoryDashboard } from "@/features/ai-interview/services/interview/history";
import { requireInterviewUser } from "../session/helpers";

/**
 * GET /api/interview/sessions (Phase 10 — §64).
 *
 * The user's personal interview dashboard: session list (with report scores),
 * totals (count, avg/best score, minutes), per-category skill progress and
 * the overall score trend across completed sessions.
 */

export async function GET() {
  const user = await requireInterviewUser();
  if (!user.ok) return user.response;

  try {
    const dashboard = await getHistoryDashboard(user.userId);
    return NextResponse.json({ ok: true, ...dashboard });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load history.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
