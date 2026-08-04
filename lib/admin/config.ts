import "server-only";

/**
 * Admin authentication configuration.
 *
 * Credentials live in environment variables (see .env.example). This is the
 * ONLY file that touches them — components never do. The config object is the
 * seam where Supabase Auth will later replace static credentials without any
 * UI, route or component changes.
 */
export const ADMIN_CONFIG = {
  username: process.env.ADMIN_USERNAME ?? "vizoadmin",
  // Dev fallback matches .env.example so the panel works out-of-the-box.
  // In production ALWAYS set ADMIN_PASSWORD via a real environment variable.
  password: process.env.ADMIN_PASSWORD ?? "Vizotool@2026#Admin",
  /** HMAC signing secret for session cookies. Set a strong value in prod. */
  sessionSecret: process.env.ADMIN_SESSION_SECRET ?? "vizotool-dev-session-secret-change-me",
  sessionDays: Number(process.env.ADMIN_SESSION_DAYS ?? 7),
} as const;

export function validateAdminCredentials(username: string, password: string): boolean {
  // Constant-time-ish comparison to avoid trivial timing leaks.
  const a = `${ADMIN_CONFIG.username}:${ADMIN_CONFIG.password}`;
  const b = `${username}:${password}`;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
