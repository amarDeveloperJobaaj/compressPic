import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin/session";
import {
  createPost,
  getAllPosts,
  toSummary,
  type BlogInput,
} from "@/lib/blog/service";

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const status = searchParams.get("status");

  // Admin search must cover drafts too (unlike the public searchPosts).
  let posts = getAllPosts();
  if (query.trim()) {
    const q = query.toLowerCase();
    posts = posts.filter((p) =>
      [p.title, p.slug, p.category, p.tags.join(" "), p.subtitle, p.excerpt]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }
  if (status === "draft") {
    posts = posts.filter((p) => p.status === "draft");
  } else if (status === "published") {
    posts = posts.filter((p) => p.status === "published");
  }

  const summaries = posts
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map(toSummary);

  return NextResponse.json({ ok: true, posts: summaries });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: BlogInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  if (!body.title?.trim()) {
    return NextResponse.json({ ok: false, error: "Title is required" }, { status: 400 });
  }

  const post = createPost(body);
  return NextResponse.json({ ok: true, post: toSummary(post) }, { status: 201 });
}
