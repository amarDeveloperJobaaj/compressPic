import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Server-side auth for the interview APIs (master spec §49–50).
 *
 * Identity is ALWAYS derived from the Supabase Auth session cookie via the
 * RLS-enforcing server client — never from a client-sent user id.
 */

/** Env present for user auth (URL + anon key). */
export function isSupabaseAuthConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Env present for the session service (adds the service-role key). */
export function isInterviewBackendConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export type AuthResult =
  | { ok: true; userId: string; email: string | null }
  | { ok: false; reason: "not_configured" | "unauthenticated" };

/** Current authenticated user id (or why we couldn't get one). */
export async function getCurrentUser(): Promise<AuthResult> {
  if (!isSupabaseAuthConfigured()) return { ok: false, reason: "not_configured" };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { ok: false, reason: "unauthenticated" };
  return { ok: true, userId: data.user.id, email: data.user.email ?? null };
}
