import { NextResponse } from "next/server";

import {
  getSessionReport,
  ReportEngineError,
} from "@/features/ai-interview/services/interview/report-engine";
import { requireInterviewUser } from "../../helpers";

/**
 * GET /api/interview/session/:id/report (Phase 9 — §58).
 *
 * Ownership-gated fetch of the persisted final report.
 *   404 = no such session · 403 = owned by someone else ·
 *   404 + error "not generated" = session exists but the report hasn't been
 *   generated yet (call POST /api/interview/report/generate first).
 */

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireInterviewUser();
  if (!user.ok) return user.response;

  const { id } = await params;

  try {
    const result = await getSessionReport(user.userId, id);
    if (!result) {
      return NextResponse.json(
        { ok: false, error: "Report not generated yet for this session." },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    if (e instanceof ReportEngineError) {
      return NextResponse.json(
        { ok: false, error: e.message },
        { status: e.kind === "forbidden" ? 403 : 404 }
      );
    }
    const message = e instanceof Error ? e.message : "Failed to load the report.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
