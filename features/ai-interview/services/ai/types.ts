import type { CandidateProfile, ResumeAnalysisResult } from "../../schemas/resume";

/**
 * AI provider abstraction (master spec §34).
 *
 * ONE interface; providers swappable without rewriting the engine. The active
 * provider/model/credentials come from env bootstrap config for now; the
 * Admin Panel AI Configuration Service (§118) takes over at runtime later.
 *
 * Phase 2 implements `analyzeResume` only. The other methods are declared so
 * the interface is stable for Phases 5–9 — callers should throw a clear
 * "not implemented" error if invoked before their phase.
 */

export interface ResumeAnalysisContext {
  /** Extracted + normalized resume text (treated strictly as DATA, §73). */
  resumeText: string;
  /** Optional setup context that tunes the analysis. */
  roleId?: string;
  domainId?: string;
  experienceLevelId?: string;
}

export interface AIProvider {
  readonly id: string;
  /** Structured candidate profile from resume text (§19). */
  analyzeResume(context: ResumeAnalysisContext): Promise<ResumeAnalysisResult>;

  // Declared for interface stability (implemented in later phases):
  generateQuestion(..._args: unknown[]): Promise<unknown>;
  generateFollowUp(..._args: unknown[]): Promise<unknown>;
  evaluateAnswer(..._args: unknown[]): Promise<unknown>;
  generateReport(..._args: unknown[]): Promise<unknown>;
}

export type { CandidateProfile };
