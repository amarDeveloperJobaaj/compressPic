import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "./database.types";

/**
 * Server-component / server-action Supabase client.
 *
 * Uses the anon key plus the request cookie jar, so RLS is enforced for the
 * current user (or anonymous visitor). Because it stores the session cookie
 * in the request context, every call site must be inside a request —
 * i.e. do NOT reuse a single instance across requests; always call
 * `await createClient()` per operation.
 */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase server client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — safe to ignore. (Next.js surfaces
          // this as "Cookies can only be modified in a Server Action or Route
          // Handler".) The read-only operations still work correctly.
        }
      },
    },
  });
}
