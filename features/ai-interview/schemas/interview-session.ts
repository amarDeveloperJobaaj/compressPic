import { z } from "zod";

import { SESSION_STATUSES } from "../types";
import type { SessionStatus } from "../types";
import { CandidateProfileSchema } from "./resume";

/**
 * Session schemas (master spec §40, §43, §48).
 *
 * The create input mirrors the setup wizard fields (§9–11); the server
 * resolves ids → labels and snapshots everything into `config` so the session
 * survives refreshes and powers the Phase 9 report.
 */

export const DifficultySchema = z.enum(["beginner", "intermediate", "advanced", "expert"]);

export const SessionStatusSchema = z.enum(SESSION_STATUSES);

export const CreateInterviewSessionSchema = z.object({
  roleId: z.string().min(1, "Select a target role."),
  domainId: z.string().min(1, "Select a domain."),
  companyId: z.string().min(1, "Select a target company."),
  customCompany: z.string().trim().max(120).optional(),
  experienceLevelId: z.string().min(1, "Select your experience level."),
  interviewTypeId: z.string().min(1, "Select an interview type."),
  durationMinutes: z.number().int().min(10, "Duration must be at least 10 minutes.").max(180),
  difficulty: DifficultySchema.default("intermediate"),
  /** Stored resume path (from /resume/upload) — optional. */
  resumePath: z.string().min(1).optional(),
  resumeFileName: z.string().max(255).optional(),
  /** Analyzed candidate profile (§19) — snapshotted with the session. */
  candidateProfile: CandidateProfileSchema.optional(),
  /** Explicit recording consent — required before any capture (§31). */
  recordingConsent: z.boolean().optional(),
});

export type CreateInterviewSessionInput = z.infer<typeof CreateInterviewSessionSchema>;

/** Live engine state (§40) — persisted into interview_sessions.current_state. */
export const SessionStateSchema = z.object({
  currentQuestion: z.number().int().default(0),
  currentTopic: z.string().nullable().default(null),
  difficulty: DifficultySchema.default("intermediate"),
  questionsAsked: z.number().int().default(0),
  questionsAnswered: z.number().int().default(0),
  remainingTimeSeconds: z.number().int().nullable().default(null),
  performanceSummary: z.record(z.string(), z.unknown()).default({}),
});

export type SessionState = z.infer<typeof SessionStateSchema>;

/**
 * Allowed §79 transitions. Anything not listed is rejected with 409 — the
 * engine (Phase 7) and the API share this table so states never drift.
 */
export const SESSION_TRANSITIONS: Record<SessionStatus, readonly SessionStatus[]> = {
  idle: ["preparing", "ready", "active"],
  preparing: ["ready", "active"],
  ready: ["active"],
  active: ["listening", "processing", "asking", "ending"],
  listening: ["processing", "active", "asking"],
  processing: ["active", "asking", "ending"],
  asking: ["active", "listening", "processing", "speaking"],
  // Phase 6: the question is read aloud (TTS) before listening starts (STT).
  speaking: ["listening", "active", "processing", "asking", "ending"],
  ending: ["generating_report", "completed"],
  generating_report: ["completed"],
  completed: [],
};

export function canTransitionStatus(from: SessionStatus, to: SessionStatus): boolean {
  return SESSION_TRANSITIONS[from]?.includes(to) ?? false;
}

/** A session may be ended by the user from any state except completed. */
export function canEndSession(status: SessionStatus): boolean {
  return status !== "completed";
}
