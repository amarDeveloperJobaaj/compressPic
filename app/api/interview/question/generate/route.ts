import { NextResponse } from "next/server";
import { z } from "zod";

import {
  askFirstQuestion,
  QuestionEngineError,
} from "@/features/ai-interview/services/interview/question-engine";
import { enforceInterviewRateLimit, requireInterviewUser } from "../../session/helpers";

/**
 * POST /api/interview/question/generate (master spec §48, §53).
 *
 * Body: { sessionId }. Generates + persists the session's FIRST question and
 * returns it. Ownership 403 / unknown session 404 / wrong state 409 — the
 * engine re-verifies everything server-side (§50).
 */

const BodySchema = z.object({ sessionId: z.string().uuid("Invalid session id.") });

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
    const result = await askFirstQuestion(user.userId, parsed.data.sessionId);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    if (e instanceof QuestionEngineError) {
      const status =
        e.kind === "forbidden" ? 403 : e.kind === "not_found" ? 404 : e.kind === "validation" ? 400 : 409;
      return NextResponse.json({ ok: false, error: e.message }, { status });
    }
    const message = e instanceof Error ? e.message : "Failed to generate a question.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
