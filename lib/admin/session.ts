import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { ADMIN_CONFIG } from "./config";

/**
 * Session strategy: a stateless HMAC-signed cookie.
 *
 * The cookie payload is `username.expiresAt` signed with HMAC-SHA256 using
 * ADMIN_SESSION_SECRET. No server-side session table is needed, which means
 * sessions survive restarts and work across instances — the same property the
 * future Supabase auth session will have.
 *
 * Swap path to Supabase: replace `createAdminSession` / `verifyAdminSession`
 * with `supabase.auth.signInWithPassword()` + `getUser()`; the callers in the
 * login route and the (protected) layout stay unchanged.
 */

export const SESSION_COOKIE = "vizotool_admin_session";

function sign(payload: string): string {
  return createHmac("sha256", ADMIN_CONFIG.sessionSecret).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function createSessionToken(remember: boolean): string {
  const expiresAt = Date.now() + (remember ? 30 : ADMIN_CONFIG.sessionDays) * 24 * 60 * 60 * 1000;
  const payload = `${ADMIN_CONFIG.username}.${expiresAt}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

/** Verify a raw token. Returns true when signed correctly and unexpired. */
export function verifySessionToken(token: string): boolean {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;
  const payload = Buffer.from(encoded, "base64url").toString("utf8");
  if (!safeEqual(signature, sign(payload))) return false;
  const username = payload.split(".")[0];
  const expiresAt = Number(payload.split(".")[1]);
  if (!username || !expiresAt || expiresAt < Date.now()) return false;
  return username === ADMIN_CONFIG.username;
}

/** Read + verify the session cookie. Returns true when authenticated. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

/** Cookie options shared by the login/logout route handlers. */
export function sessionCookieOptions(remember: boolean, path = "/") {
  return {
    path,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: (remember ? 30 : ADMIN_CONFIG.sessionDays) * 24 * 60 * 60,
  };
}
