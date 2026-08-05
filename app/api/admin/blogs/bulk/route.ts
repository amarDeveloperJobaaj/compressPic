import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin/session";
import { getBlogRepository } from "@/lib/blog/repository";

const ACTIONS = ["publish", "draft", "archive", "delete"] as const;

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { ids?: unknown; action?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const ids = Array.isArray(body.ids) ? body.ids.filter((i): i is string => typeof i === "string") : [];
  const action = body.action as (typeof ACTIONS)[number];

  if (!ids.length || !ACTIONS.includes(action)) {
    return NextResponse.json({ ok: false, error: "Invalid ids or action" }, { status: 400 });
  }

  const repo = getBlogRepository();
  let updated = 0;

  try {
    for (const id of ids) {
      if (action === "delete") {
        if (await repo.deletePost(id)) updated++;
        continue;
      }
      const status = action === "publish" ? "published" : action === "draft" ? "draft" : "archived";
      const post = await repo.updatePost(id, { status });
      if (post) updated++;
    }
    return NextResponse.json({ ok: true, updated });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Bulk action failed" },
      { status: 500 }
    );
  }
}
