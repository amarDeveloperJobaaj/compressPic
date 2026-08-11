import { z } from "zod";

/**
 * Resume analysis schemas (master spec §18–19).
 *
 * The AI converts extracted resume text into a structured CandidateProfile.
 * Every field is lenient by default so LLM output that misses a section still
 * validates — the profile degrades gracefully instead of failing the request.
 */

export const CandidateProjectSchema = z.object({
  name: z.string().default(""),
  technologies: z.array(z.string()).default([]),
});

export const CandidateExperienceSchema = z.object({
  role: z.string().default(""),
  company: z.string().default(""),
  duration: z.string().default(""),
  highlights: z.array(z.string()).default([]),
});

export const CandidateEducationSchema = z.object({
  degree: z.string().default(""),
  institution: z.string().default(""),
  year: z.string().default(""),
});

/** Structured candidate profile — shape from master spec §19. */
export const CandidateProfileSchema = z.object({
  candidate_name: z.string().default("Candidate"),
  experience_level: z.string().default("Mid-level"),
  skills: z.array(z.string()).default([]),
  projects: z.array(CandidateProjectSchema).default([]),
  experience: z.array(CandidateExperienceSchema).default([]),
  education: z.array(CandidateEducationSchema).default([]),
  certifications: z.array(z.string()).default([]),
  likely_strengths: z.array(z.string()).default([]),
  potential_weaknesses: z.array(z.string()).default([]),
});

export type CandidateProfile = z.infer<typeof CandidateProfileSchema>;
export type CandidateProject = z.infer<typeof CandidateProjectSchema>;
export type CandidateExperience = z.infer<typeof CandidateExperienceSchema>;
export type CandidateEducation = z.infer<typeof CandidateEducationSchema>;

/** Input for POST /api/interview/resume/analyze. */
export const ResumeAnalyzeInputSchema = z.object({
  /** Storage path of an uploaded resume (from /resume/upload). */
  filePath: z.string().min(1).optional(),
  /** Raw resume text (fallback when no file is stored server-side). */
  resumeText: z.string().max(200_000).optional(),
  /** Optional setup context that tunes the analysis. */
  roleId: z.string().optional(),
  domainId: z.string().optional(),
  experienceLevelId: z.string().optional(),
}).refine((data) => data.filePath || data.resumeText, {
  message: "Provide either filePath or resumeText.",
});

export type ResumeAnalyzeInput = z.infer<typeof ResumeAnalyzeInputSchema>;

/** What produced the profile — lets the UI show a hint. */
export type ResumeAnalysisSource = "ai" | "heuristic";

export interface ResumeAnalysisResult {
  profile: CandidateProfile;
  /** Which analyzer produced the profile — "ai" or local "heuristic". */
  source: ResumeAnalysisSource;
  /** Optional warning (e.g. provider fallback). */
  warning?: string;
}
