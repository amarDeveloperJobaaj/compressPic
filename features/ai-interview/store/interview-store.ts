import { create } from "zustand";

import { DEFAULT_DURATION_MINUTES } from "../data/durations";
import { DEFAULT_INTERVIEW_TYPE_ID } from "../data/interview-types";
import type { CandidateProfile, ResumeAnalysisSource } from "../schemas/resume";
import type { Difficulty } from "../types";

export const SETUP_STEPS = [
  "Role & Domain",
  "Company & Experience",
  "Interview Type & Resume",
] as const;

export const TOTAL_STEPS = SETUP_STEPS.length;

export type ResumeStatus = "idle" | "ready" | "uploading" | "analyzing" | "analyzed" | "error";

/** Client-side resume cap (PDF) — mirrored server-side in lib/supabase/storage.ts. */
export const MAX_RESUME_SIZE = 10 * 1024 * 1024;

/** Map an experience level to a starting interview depth (§25). */
export function defaultDifficultyForLevel(levelId: string | null): Difficulty {
  switch (levelId) {
    case "fresher":
    case "0-1":
      return "beginner";
    case "1-3":
      return "intermediate";
    case "3-5":
      return "advanced";
    case "5-8":
    case "8-plus":
      return "expert";
    default:
      return "intermediate";
  }
}

interface InterviewSetupState {
  /** Active wizard step (0-based). */
  step: number;

  // Setup fields (ids — resolved to data objects by components)
  roleId: string | null;
  domainId: string | null;
  companyId: string | null;
  customCompany: string;
  experienceLevelId: string | null;
  interviewTypeId: string | null;
  durationMinutes: number | null;

  /** Interview depth — preselected from the experience level (§25). */
  difficulty: Difficulty;

  // Resume (Phase 2: capture → upload → analyze → candidate profile)
  resumeFile: File | null;
  resumeStatus: ResumeStatus;
  resumeError: string | null;
  /** Storage path returned by /resume/upload (null when skipped/storage off). */
  resumePath: string | null;
  /** Structured candidate profile from the analyze step (§19). */
  candidateProfile: CandidateProfile | null;
  /** Whether the profile came from the AI or the local heuristic analyzer. */
  resumeAnalysisSource: ResumeAnalysisSource | null;
  /** Set when the user explicitly chose to skip the resume. */
  resumeSkipped: boolean;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setRoleId: (roleId: string) => void;
  setDomainId: (domainId: string) => void;
  setCompanyId: (companyId: string) => void;
  setCustomCompany: (value: string) => void;
  setExperienceLevelId: (experienceLevelId: string) => void;
  setInterviewTypeId: (interviewTypeId: string) => void;
  setDurationMinutes: (minutes: number) => void;
  setResumeFile: (file: File | null) => void;
  setResumeStatus: (status: ResumeStatus) => void;
  setResumeError: (message: string | null) => void;
  setResumePath: (path: string | null) => void;
  setCandidateProfile: (profile: CandidateProfile | null, source?: ResumeAnalysisSource) => void;
  setResumeSkipped: (skipped: boolean) => void;
  clearResume: () => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewSetupState>((set) => ({
  step: 0,

  roleId: null,
  domainId: null,
  companyId: null,
  customCompany: "",
  experienceLevelId: null,
  // Spec defaults: Mixed interview type, 20-minute duration (03-tool-info.md).
  interviewTypeId: DEFAULT_INTERVIEW_TYPE_ID,
  durationMinutes: DEFAULT_DURATION_MINUTES,

  difficulty: "intermediate",

  resumeFile: null,
  resumeStatus: "idle",
  resumeError: null,
  resumePath: null,
  candidateProfile: null,
  resumeAnalysisSource: null,
  resumeSkipped: false,

  setStep: (step) => set({ step: Math.max(0, Math.min(TOTAL_STEPS - 1, step)) }),
  nextStep: () => set((s) => ({ step: Math.min(TOTAL_STEPS - 1, s.step + 1) })),
  prevStep: () => set((s) => ({ step: Math.max(0, s.step - 1) })),

  setRoleId: (roleId) => set({ roleId }),
  setDomainId: (domainId) => set({ domainId }),
  setCompanyId: (companyId) => set({ companyId }),
  setCustomCompany: (customCompany) => set({ customCompany }),
  setExperienceLevelId: (experienceLevelId) =>
    set({ experienceLevelId, difficulty: defaultDifficultyForLevel(experienceLevelId) }),
  setInterviewTypeId: (interviewTypeId) => set({ interviewTypeId }),
  setDurationMinutes: (durationMinutes) => set({ durationMinutes }),
  setResumeFile: (resumeFile) =>
    set({
      resumeFile,
      resumeStatus: resumeFile ? "ready" : "idle",
      resumeError: null,
      resumePath: null,
      candidateProfile: null,
      resumeAnalysisSource: null,
      resumeSkipped: false,
    }),
  setResumeStatus: (resumeStatus) => set({ resumeStatus }),
  setResumeError: (resumeError) => set({ resumeError }),
  setResumePath: (resumePath) => set({ resumePath }),
  setCandidateProfile: (candidateProfile, resumeAnalysisSource) =>
    set({
      candidateProfile,
      resumeAnalysisSource: resumeAnalysisSource ?? null,
    }),
  setResumeSkipped: (resumeSkipped) =>
    set(
      resumeSkipped
        ? {
            resumeSkipped: true,
            resumeFile: null,
            resumeStatus: "idle",
            resumePath: null,
            candidateProfile: null,
            resumeAnalysisSource: null,
          }
        : { resumeSkipped: false }
    ),
  clearResume: () =>
    set({
      resumeFile: null,
      resumeStatus: "idle",
      resumeError: null,
      resumePath: null,
      candidateProfile: null,
      resumeAnalysisSource: null,
      resumeSkipped: false,
    }),

  reset: () =>
    set({
      step: 0,
      roleId: null,
      domainId: null,
      companyId: null,
      customCompany: "",
      experienceLevelId: null,
      interviewTypeId: DEFAULT_INTERVIEW_TYPE_ID,
      durationMinutes: DEFAULT_DURATION_MINUTES,
      difficulty: "intermediate",
      resumeFile: null,
      resumeStatus: "idle",
      resumeError: null,
      resumePath: null,
      candidateProfile: null,
      resumeAnalysisSource: null,
      resumeSkipped: false,
    }),
}));
