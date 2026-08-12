import { NextResponse } from "next/server";
import { z } from "zod";

import { StoreAnswerInputSchema } from "@/features/ai-interview/schemas/question";
import {
  answerAndAskNext,
  QuestionEngineError,
} from "@/features/ai-interview/services/interview/question-engine";
import { requireInterviewUser } from "../../session/helpers";

/**
 * POST /api/interview/question/follow-up (master spec §48, §53).
 *
 * Body: { sessionId, answer: { questionId, transcript, durationSeconds? } }.
 * Persists the answer (idempotent) then generates + persists the next
 * question — follow-up or new topic per the provider's §53 action. Returns
 * both, so the room can render the transcript line and the next question.
 */

const BodySchema = z.object({
  sessionId: z.string().uuid("Invalid session id."),
  answer: StoreAnswerInputSchema,
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
    const result = await answerAndAskNext(user.userId, parsed.data.sessionId, parsed.data.answer);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    if (e instanceof QuestionEngineError) {
      const status =
        e.kind === "forbidden" ? 403 : e.kind === "not_found" ? 404 : e.kind === "validation" ? 400 : 409;
      return NextResponse.json({ ok: false, error: e.message }, { status });
    }
    const message = e instanceof Error ? e.message : "Failed to generate the next question.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
