import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin/session";
import { getBlogRepository } from "@/lib/blog/repository";
import { blogInputSchema } from "@/lib/blog/validation";

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const status = (searchParams.get("status") ?? "all") as
    | "all"
    | "published"
    | "draft"
    | "scheduled";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));

  try {
    const { items, meta } = await getBlogRepository().listAdminPosts({
      query,
      status,
      page,
      pageSize: 25,
    });
    return NextResponse.json({ ok: true, posts: items, meta });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Failed to load posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const parsed = blogInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid blog data" },
      { status: 400 }
    );
  }

  try {
    const post = await getBlogRepository().createPost(parsed.data);
    return NextResponse.json({ ok: true, post }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Failed to create post" },
      { status: 500 }
    );
  }
}
