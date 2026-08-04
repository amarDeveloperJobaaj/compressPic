import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminCredentials } from "@/lib/admin/config";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/admin/session";

export async function POST(request: Request) {
  let body: { username?: string; password?: string; remember?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const username = (body.username ?? "").trim();
  const password = body.password ?? "";
  const remember = body.remember === true;

  if (!username || !password) {
    return NextResponse.json(
      { ok: false, error: "Username and password are required" },
      { status: 400 }
    );
  }

  if (!validateAdminCredentials(username, password)) {
    return NextResponse.json(
      { ok: false, error: "Invalid username or password" },
      { status: 401 }
    );
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(remember), sessionCookieOptions(remember));

  return NextResponse.json({ ok: true });
}
