import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic guard for the admin area (Next.js 16 Proxy, formerly middleware).
 *
 * This only checks cookie PRESENCE — it must stay edge-safe and lightweight.
 * The real verification (HMAC signature + expiry) happens in
 * app/admin/(protected)/layout.tsx, which runs on the Node runtime. API routes
 * under /api/admin perform their own full isAdmin() check, so they are not
 * matched here.
 */
const LOGIN_PATH = "/admin/login";
const SESSION_COOKIE = "vizotool_admin_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const hasSession = request.cookies.has(SESSION_COOKIE);

  // Authenticated users should not see the login page again.
  if (pathname === LOGIN_PATH) {
    if (hasSession) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Unauthenticated users get sent to login (preserving their destination).
  if (!hasSession) {
    const url = new URL(LOGIN_PATH, request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
