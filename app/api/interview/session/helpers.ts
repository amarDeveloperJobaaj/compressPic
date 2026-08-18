import { NextResponse } from "next/server";

import {
  getCurrentUser,
  isInterviewBackendConfigured,
} from "@/features/ai-interview/services/interview/auth";
import {
  interviewRateLimiter,
  rateLimitKey,
} from "@/features/ai-interview/services/interview/rate-limiter";

/**
 * Shared guard for the session routes. Returns:
 *   - 503 when Supabase env vars are missing (friendly setup message)
 *   - 401 when no Supabase Auth session exists
 *   - the server-derived userId otherwise (§50 — never trust the client)
 */
export async function requireInterviewUser(): Promise<
  | { ok: true; userId: string; email: string | null }
  | { ok: false; response: NextResponse }
> {
  if (!isInterviewBackendConfigured()) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          ok: false,
          error:
            "Interview sessions need Supabase configured — add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY to .env.local.",
        },
        { status: 503 }
      ),
    };
  }

  const auth = await getCurrentUser();
  if (!auth.ok) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: "Sign in to start an interview." },
        { status: 401 }
      ),
    };
  }

  return { ok: true, userId: auth.userId, email: auth.email };
}

/**
 * Phase 11 — per-user sliding-window rate limit for the interview turn-loop
 * routes (answer/follow-up/generate/evaluate/report). Returns a 429 response
 * when the user exceeds the budget, otherwise null.
 */
export function enforceInterviewRateLimit(userId: string): NextResponse | null {
  if (!interviewRateLimiter.allow(rateLimitKey(userId))) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many requests — please wait a moment and try again.",
      },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }
  return null;
}
