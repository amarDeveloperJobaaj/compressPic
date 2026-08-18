import { NextResponse } from "next/server";

import { CreateInterviewSessionSchema } from "@/features/ai-interview/schemas/interview-session";
import {
  createInterviewSession,
  SessionValidationError,
} from "@/features/ai-interview/services/interview/session";
import { requireInterviewUser } from "../helpers";

/**
 * POST /api/interview/session/create (master spec §43, §48).
 *
 * Auth-only: derives the user from the session cookie, fills session defaults
 * from the setup wizard input, snapshots config + candidate profile, and
 * returns the new session (status `idle`).
 */

export async function POST(request: Request) {
  const user = await requireInterviewUser();
  if (!user.ok) return user.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = CreateInterviewSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid session input." },
      { status: 400 }
    );
  }

  try {
    const session = await createInterviewSession(user.userId, parsed.data);
    return NextResponse.json({ ok: true, session }, { status: 201 });
  } catch (e) {
    if (e instanceof SessionValidationError) {
      return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "Failed to create the session.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
