import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin/session";
import { getBlogStorage } from "@/lib/blog/repository";
import { BLOG_IMAGES_BUCKET } from "@/lib/supabase/storage";

/**
 * Media library API.
 *
 * Backed by Supabase Storage (bucket `blog-images`). When Supabase is not
 * configured (BLOG_STORAGE=memory), every endpoint reports that storage is
 * unavailable so the UI can show a friendly notice instead of crashing.
 */
const STORAGE_UNAVAILABLE = {
  ok: false,
  error: "Supabase storage is not configured. Add your Supabase credentials and set BLOG_STORAGE=supabase to use the media library.",
};

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (getBlogStorage() !== "supabase") {
    return NextResponse.json({ ...STORAGE_UNAVAILABLE, items: [] }, { status: 200 });
  }

  // Dynamic imports keep the server-only Supabase code out of the memory bundle.
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const { STORAGE_BUCKETS } = await import("@/lib/supabase/storage");
  const bucket = STORAGE_BUCKETS[0];

  try {
    const admin = createAdminClient();
    // Uploads live under the "uploads/" prefix (see uploadBlogImage).
    const { data, error } = await admin.storage.from(bucket).list("uploads", {
      limit: 500,
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error) throw new Error(error.message);
    const items = (data ?? [])
      .filter((f) => !(f.id ?? f.name).endsWith(".folder"))
      .map((f) => {
        const path = `uploads/${f.name}`;
        return {
          name: f.name,
          path,
          size: f.metadata?.size ?? 0,
          url: admin.storage.from(bucket).getPublicUrl(path).data.publicUrl,
          updatedAt: f.updated_at,
        };
      });
    return NextResponse.json({ ok: true, items });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Failed to list media" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (getBlogStorage() !== "supabase") {
    return NextResponse.json(STORAGE_UNAVAILABLE, { status: 200 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid upload" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
  }
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "File exceeds the 50 MB limit" }, { status: 400 });
  }

  try {
    const { uploadBlogImage } = await import("@/lib/supabase/storage");
    const result = await uploadBlogImage(file, "uploads");
    return NextResponse.json({ ok: true, ...result }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (getBlogStorage() !== "supabase") {
    return NextResponse.json(STORAGE_UNAVAILABLE, { status: 200 });
  }

  let body: { path?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  if (typeof body.path !== "string" || !body.path) {
    return NextResponse.json({ ok: false, error: "Missing path" }, { status: 400 });
  }

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const { error } = await createAdminClient().storage.from(BLOG_IMAGES_BUCKET).remove([body.path]);
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Delete failed" },
      { status: 500 }
    );
  }
}
