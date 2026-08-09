import { NextResponse } from "next/server";

import { MAX_RESUME_SIZE } from "@/lib/supabase/storage";

/**
 * POST /api/interview/resume/upload
 *
 * Multipart upload of a resume PDF (Phase 2, master spec §18/§42).
 * - File-type + size validation (PDF only, ≤10 MB)
 * - Stored in the private `resumes` bucket (service-role client, server-only)
 * - Returns the storage path; the browser never gets a public URL
 *
 * Storage-unavailable handling mirrors the admin media library: a friendly
 * error is returned so the UI can fall back to client-side extraction.
 */

function isPdfFile(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided." }, { status: 400 });
  }
  if (!isPdfFile(file)) {
    return NextResponse.json(
      { ok: false, error: "Only PDF resumes are supported right now." },
      { status: 400 }
    );
  }
  if (file.size > MAX_RESUME_SIZE) {
    return NextResponse.json(
      { ok: false, error: "Resume exceeds the 10 MB limit." },
      { status: 400 }
    );
  }

  try {
    const { uploadResume } = await import("@/lib/supabase/storage");
    const result = await uploadResume(file, "resumes");
    return NextResponse.json(
      { ok: true, path: result.path, size: result.size, fileName: file.name },
      { status: 201 }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed.";
    // Only a missing/env-misconfigured Supabase client is a graceful fallback
    // condition. Real storage failures (bucket errors, network) stay 500 so
    // the UI surfaces them instead of silently degrading.
    const storageMisconfigured =
      /requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/i.test(message);
    return NextResponse.json(
      {
        ok: false,
        error: storageMisconfigured
          ? "Resume storage is not configured — you can still proceed without storing the file."
          : message,
        fallbackToClient: storageMisconfigured,
      },
      { status: storageMisconfigured ? 200 : 500 }
    );
  }
}
