import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

/**
 * Service-role Supabase client — FULL database access, bypasses RLS.
 *
 * This is the privileged backend client used by:
 *  - the blog repository writes (admin CRUD, engagement)
 *  - the blog storage helpers (upload/delete images)
 *  - the content migration executor (scripts/migrate-blogs.ts)
 *  - any future admin/analytics queries
 *
 * SECURITY: it must NEVER be imported into a client component or exposed to
 * the browser. The service-role key is server-only (see .env.example).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
