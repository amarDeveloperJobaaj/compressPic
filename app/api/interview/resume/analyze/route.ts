import { NextResponse } from "next/server";

import { ResumeAnalyzeInputSchema } from "@/features/ai-interview/schemas/resume";

export const maxDuration = 60;

/**
 * POST /api/interview/resume/analyze
 *
 * Analyzes a resume and returns a structured CandidateProfile (§19).
 * Accepts either:
 *   { filePath }    — path of a previously uploaded resume (server extracts
 *                     the PDF text, §18 step 3)
 *   { resumeText }  — already-extracted text (fallback path)
 * Optionally carries roleId / domainId / experienceLevelId to tune analysis.
 */

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = ResumeAnalyzeInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  try {
    const { analyzeResume } = await import(
      "@/features/ai-interview/services/resume/analyze"
    );
    const result = await analyzeResume(parsed.data);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Resume analysis failed.";
    // 422 only for actual PDF extraction failures (unreadable/scanned PDFs).
    const parseFailure = /could not read the pdf|text extraction/i.test(message);
    return NextResponse.json(
      {
        ok: false,
        error: parseFailure
          ? "We couldn't read that PDF. Make sure it's a valid text-based resume (not scanned)."
          : message,
      },
      { status: parseFailure ? 422 : 500 }
    );
  }
}
