import { NextResponse } from "next/server";
import { z } from "zod";

import {
  evaluateStoredAnswer,
  QuestionEngineError,
} from "@/features/ai-interview/services/interview/question-engine";
import { requireInterviewUser } from "../../session/helpers";

/**
 * POST /api/interview/answer/evaluate (master spec §48, §54).
 *
 * Body: { sessionId, questionId }. Evaluates the STORED answer for that
 * question on the six §54 dimensions and returns the derived overall score +
 * verdict. Ownership 403 / unknown answer 404 / wrong state 409 — the engine
 * re-verifies everything server-side (§50).
 *
 * The turn loop (POST /question/follow-up) evaluates internally through the
 * same code path; this route exists for on-demand evaluation (Phase 8
 * persistence + verification) and shares the exact same provider logic.
 */

const BodySchema = z.object({
  sessionId: z.string().uuid("Invalid session id."),
  questionId: z.string().uuid("Invalid question id."),
});

export async function POST(request: Request) {
  const user = await requireInterviewUser();
  if (!user.ok) return user.response;

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
    const result = await evaluateStoredAnswer(
      user.userId,
      parsed.data.sessionId,
      parsed.data.questionId
    );
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    if (e instanceof QuestionEngineError) {
      const status =
        e.kind === "forbidden" ? 403 : e.kind === "not_found" ? 404 : e.kind === "validation" ? 400 : 409;
      return NextResponse.json({ ok: false, error: e.message }, { status });
    }
    const message = e instanceof Error ? e.message : "Failed to evaluate the answer.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
