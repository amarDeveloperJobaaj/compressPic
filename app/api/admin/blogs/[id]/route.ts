import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin/session";
import { getBlogRepository } from "@/lib/blog/repository";
import { revalidateBlogPages } from "@/lib/blog/revalidation";
import { blogInputSchema } from "@/lib/blog/validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const post = await getBlogRepository().getPostById(id);
    if (!post) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, post });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Failed to load post" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const repo = getBlogRepository();

  try {
    // Duplicate is a convenience action handled by the repository.
    if (body.duplicate === true) {
      const copy = await repo.duplicatePost(id);
      if (!copy) {
        return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
      }
      revalidateBlogPages();
      return NextResponse.json({ ok: true, post: copy });
    }

    const parsed = blogInputSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid blog data" },
        { status: 400 }
      );
    }

    const post = await repo.updatePost(id, parsed.data);
    if (!post) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    revalidateBlogPages(post);
    return NextResponse.json({ ok: true, post });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const deleted = await getBlogRepository().deletePost(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    revalidateBlogPages();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Failed to delete post" },
      { status: 500 }
    );
  }
}
