"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

/**
 * Supabase Auth for the interview flow (master spec §49).
 *
 * signIn/signUp/signOut run through the browser client so the SSR cookie jar
 * stays in sync automatically — no extra auth API routes (which would clash
 * with the existing admin auth routes under /api/auth/*).
 *
 * When NEXT_PUBLIC_SUPABASE_* env vars are missing, `configured` is false and
 * the UI shows a friendly setup message instead of crashing.
 */
export function useAuth() {
  // Client creation is env-guarded; null ⇒ Supabase not configured. Creating
  // it here (lazy initializer) keeps `configured` derived, not stateful.
  const [client] = useState(() => {
    try {
      return createClient();
    } catch {
      return null;
    }
  });
  const clientRef = useRef(client);

  const [user, setUser] = useState<User | null>(null);
  // Loading only when a client exists (not configured ⇒ nothing to check).
  const [loading, setLoading] = useState(() => client !== null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!client) return;

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    client.auth.getSession().then(({ data: sessionData }) => {
      setUser(sessionData.session?.user ?? null);
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, [client]);

  const configured = client !== null;

  const clearError = useCallback(() => setError(null), []);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    setSubmitting(true);
    try {
      const client = clientRef.current;
      if (!client) throw new Error("Supabase is not configured.");
      const { error: authError } = await client.auth.signInWithPassword({ email, password });
      if (authError) setError(authError.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed.");
    } finally {
      setSubmitting(false);
    }
  }, []);

  const signUp = useCallback(
    async (email: string, password: string): Promise<{ needsEmailConfirmation: boolean }> => {
      setError(null);
      setSubmitting(true);
      try {
        const client = clientRef.current;
        if (!client) throw new Error("Supabase is not configured.");
        const { data, error: authError } = await client.auth.signUp({ email, password });
        if (authError) {
          setError(authError.message);
          return { needsEmailConfirmation: false };
        }
        // No session yet → the project requires email confirmation.
        return { needsEmailConfirmation: !data.session };
      } catch (e) {
        setError(e instanceof Error ? e.message : "Sign up failed.");
        return { needsEmailConfirmation: false };
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    setError(null);
    try {
      const client = clientRef.current;
      if (!client) return;
      await client.auth.signOut();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign out failed.");
    }
  }, []);

  return { user, loading, configured, error, submitting, signIn, signUp, signOut, clearError };
}
