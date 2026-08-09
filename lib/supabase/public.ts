import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

/**
 * Cookie-free public Supabase client (anon key, no request cookies).
 *
 * Unlike lib/supabase/server.ts this client never calls `cookies()`, so it is
 * safe to use during static generation — generateStaticParams, SSG routes,
 * ISR revalidation and the sitemap. Row Level Security still applies: the
 * anon role only ever sees published posts, approved comments and public
 * settings, exactly like the cookie-based client.
 *
 * Use this for public reads on statically-generated blog routes. Admin reads
 * and all writes keep using lib/supabase/admin.ts (service role).
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase public client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createSupabaseClient<Database>(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
