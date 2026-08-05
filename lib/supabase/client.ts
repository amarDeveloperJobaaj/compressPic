"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./database.types";

/**
 * Browser (client-component) Supabase client.
 *
 * Uses the publishable anon key + cookie transport so Row Level Security is
 * enforced on the client for the blog tables (published posts, approved
 * comments, newsletter subscribe, ...).
 *
 * Only call this from "use client" components. Server components and server
 * actions must use lib/supabase/server.ts (RLS, cookies) or
 * lib/supabase/admin.ts (service role, full access).
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase browser client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createBrowserClient<Database>(url, anonKey);
}
