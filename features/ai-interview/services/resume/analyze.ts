import "server-only";

import type { ResumeAnalysisResult } from "../../schemas/resume";
import { getAIProvider } from "../ai";
import { extractPdfText } from "./extract-text";
import { looksLikeResume, normalizeResumeText } from "./normalize";
import { downloadResume } from "@/lib/supabase/storage";

/**
 * Resume analysis pipeline (master spec §18):
 *   File (stored) → download → text extraction → normalization
 *   → AIProvider.analyzeResume → Zod-validated CandidateProfile (§19).
 *
 * The resume text is treated strictly as data (§73) inside the provider.
 */

export interface AnalyzeResumeOptions {
  /** Stored resume path (from /api/interview/resume/upload). */
  filePath?: string;
  /** Pre-extracted resume text (fallback when no file is stored). */
  resumeText?: string;
  /** Optional setup context. */
  roleId?: string;
  domainId?: string;
  experienceLevelId?: string;
}

export async function analyzeResume(options: AnalyzeResumeOptions): Promise<ResumeAnalysisResult> {
  let text: string;

  if (options.filePath) {
    const buffer = await downloadResume(options.filePath);
    text = await extractPdfText(buffer);
  } else if (options.resumeText) {
    text = options.resumeText;
  } else {
    throw new Error("Provide either a filePath or resumeText.");
  }

  const normalized = normalizeResumeText(text);

  if (!looksLikeResume(normalized)) {
    throw new Error(
      "We couldn't find enough resume content in that file. Try another PDF."
    );
  }

  const provider = getAIProvider();
  const result = await provider.analyzeResume({
    resumeText: normalized,
    roleId: options.roleId,
    domainId: options.domainId,
    experienceLevelId: options.experienceLevelId,
  });

  return result;
}
