import { NextResponse } from "next/server";
import { z } from "zod";

import {
  generateSessionReport,
  ReportEngineError,
} from "@/features/ai-interview/services/interview/report-engine";
import { enforceInterviewRateLimit, requireInterviewUser } from "../../session/helpers";

/**
 * POST /api/interview/report/generate (master spec §58–63, Phase 9).
 *
 * Body: { sessionId }. Generates the final report in ONE call — the engine
 * loads the completed session + persisted evaluations, computes the
 * deterministic category scores, asks the provider for the qualitative
 * report (Zod-strict, heuristic fallback §74) and persists it idempotently
 * (upsert on session_id). Re-calling refreshes the stored report.
 *   401 unauth · 403 not owner · 404 no session · 409 not completed.
 */

const BodySchema = z.object({
  sessionId: z.string().uuid("Invalid session id."),
});

export async function POST(request: Request) {
  const user = await requireInterviewUser();
  if (!user.ok) return user.response;
  const limited = enforceInterviewRateLimit(user.userId);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  try {
    const result = await generateSessionReport(user.userId, parsed.data.sessionId);
    return NextResponse.json({ ok: true, report: result.report, createdAt: result.createdAt });
  } catch (e) {
    if (e instanceof ReportEngineError) {
      const status =
        e.kind === "forbidden" ? 403 : e.kind === "not_found" ? 404 : 409;
      return NextResponse.json({ ok: false, error: e.message }, { status });
    }
    const message = e instanceof Error ? e.message : "Failed to generate the report.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
