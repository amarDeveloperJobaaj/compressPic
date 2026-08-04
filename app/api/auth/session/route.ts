import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin/session";

export async function GET() {
  const authenticated = await isAdmin();
  return NextResponse.json({ authenticated });
}
