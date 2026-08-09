import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin/session";
import { getBlogRepository } from "@/lib/blog/repository";
import { revalidateBlogPages } from "@/lib/blog/revalidation";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const posts = await getBlogRepository().listTrashedPosts();
    return NextResponse.json({ ok: true, posts });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Failed to load trash" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: unknown; action?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const { id, action } = body;
  if (typeof id !== "string" || (action !== "restore" && action !== "purge")) {
    return NextResponse.json({ ok: false, error: "Invalid id or action" }, { status: 400 });
  }

  const repo = getBlogRepository();
  try {
    const ok = action === "restore" ? await repo.restorePost(id) : await repo.purgePost(id);
    if (!ok) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    // Restoring re-exposes a soft-deleted post (and its sitemap entry) — refresh public surfaces.
    revalidateBlogPages();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Action failed" },
      { status: 500 }
    );
  }
}
