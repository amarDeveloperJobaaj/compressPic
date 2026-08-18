import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";

import type { Difficulty } from "../../types";
import { logInterviewEvent } from "./analytics";
import { getSessionForUser } from "./session";

/**
 * History & progress service (master spec §64, Phase 10).
 *
 * Personal interview dashboard data: the user's sessions with their report
 * scores, aggregate totals, per-category skill progress and an overall score
 * trend — plus delete (cascade) and restart (new session from the stored
 * config) operations. Ownership is always re-verified server-side (§50).
 */

type SessionRow = Database["public"]["Tables"]["interview_sessions"]["Row"];
type ReportRow = Database["public"]["Tables"]["interview_reports"]["Row"];

/** One row in the history list (session + its report score when present). */
/** Setup ids needed to prefill the wizard on restart. */
export interface HistorySetupConfig {
  roleId: string | null;
  domainId: string | null;
  companyId: string | null;
  customCompany: string | null;
  experienceLevelId: string | null;
  interviewTypeId: string | null;
  durationMinutes: number | null;
  difficulty: Difficulty;
}

export interface HistorySession {
  id: string;
  targetRole: string;
  targetCompany: string | null;
  domain: string | null;
  experienceLevel: string | null;
  interviewType: string;
  difficulty: Difficulty;
  durationMinutes: number;
  status: string;
  createdAt: string;
  endedAt: string | null;
  questionsAnswered: number;
  overallScore: number | null;
  /** True when the final report has been generated. */
  hasReport: boolean;
  /** Setup snapshot — lets the client prefill the wizard for a restart. */
  setup: HistorySetupConfig;
}

export interface SkillProgress {
  /** Average category scores across all reports with scores. */
  technical: number | null;
  communication: number | null;
  problemSolving: number | null;
  project: number | null;
  behavioral: number | null;
}

export interface ScorePoint {
  /** Session creation date (yyyy-mm-dd) — for the trend. */
  date: string;
  overall: number;
  sessionId: string;
}

export interface HistoryDashboard {
  sessions: HistorySession[];
  totals: {
    count: number;
    completed: number;
    avgScore: number | null;
    bestScore: number | null;
    totalMinutes: number;
  };
  skillProgress: SkillProgress;
  /** Overall score per completed session, oldest → newest. */
  trend: ScorePoint[];
}

function avg(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

function rowToHistorySession(row: SessionRow & { interview_reports?: ReportRow[] | null }): HistorySession {
  const state = (row.current_state ?? {}) as { questionsAnswered?: number };
  const report = row.interview_reports?.[0] ?? null;
  const config = (row.config ?? {}) as Record<string, unknown>;
  return {
    id: row.id,
    targetRole: row.target_role,
    targetCompany: row.target_company,
    domain: row.domain,
    experienceLevel: row.experience_level,
    interviewType: row.interview_type,
    difficulty: (row.difficulty as Difficulty) ?? "intermediate",
    durationMinutes: row.duration_minutes,
    status: row.status,
    createdAt: row.created_at,
    endedAt: row.ended_at,
    questionsAnswered: state.questionsAnswered ?? 0,
    overallScore: report?.overall_score != null ? Math.round(Number(report.overall_score)) : null,
    hasReport: Boolean(report),
    setup: {
      roleId: (config.roleId as string | null) ?? null,
      domainId: (config.domainId as string | null) ?? null,
      companyId: (config.companyId as string | null) ?? null,
      customCompany: (config.customCompany as string | null) ?? null,
      experienceLevelId: (config.experienceLevelId as string | null) ?? null,
      interviewTypeId: (config.interviewTypeId as string | null) ?? null,
      durationMinutes: config.durationMinutes != null ? Number(config.durationMinutes) : null,
      difficulty: (config.difficulty as Difficulty) ?? "intermediate",
    },
  };
}

/** All the user's sessions (newest first) with their report scores. */
export async function listUserSessions(userId: string): Promise<HistorySession[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("interview_sessions")
    .select(
      "id, target_role, target_company, domain, experience_level, interview_type, difficulty, duration_minutes, status, created_at, ended_at, current_state, config, interview_reports(overall_score)"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((row) =>
    rowToHistorySession(row as SessionRow & { interview_reports?: ReportRow[] | null })
  );
}

/** Full dashboard payload for /history — §64. */
export async function getHistoryDashboard(userId: string): Promise<HistoryDashboard> {
  const sessions = await listUserSessions(userId);
  const scored = sessions
    .filter((s) => s.overallScore != null)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const skill: SkillProgress = {
    technical: null,
    communication: null,
    problemSolving: null,
    project: null,
    behavioral: null,
  };

  if (scored.length > 0) {
    // Per-category averages across the user's reports.
    const admin = createAdminClient();
    const { data: reports } = await admin
      .from("interview_reports")
      .select("technical_score, communication_score, problem_solving_score, project_score, behavioral_score")
      .in("session_id", scored.map((s) => s.id));
    const rows = reports ?? [];
    skill.technical = avg(rows.map((r) => Number(r.technical_score ?? 0)).filter((v) => v > 0));
    skill.communication = avg(rows.map((r) => Number(r.communication_score ?? 0)).filter((v) => v > 0));
    skill.problemSolving = avg(rows.map((r) => Number(r.problem_solving_score ?? 0)).filter((v) => v > 0));
    skill.project = avg(rows.map((r) => Number(r.project_score ?? 0)).filter((v) => v > 0));
    skill.behavioral = avg(rows.map((r) => Number(r.behavioral_score ?? 0)).filter((v) => v > 0));
  }

  return {
    sessions,
    totals: {
      count: sessions.length,
      completed: sessions.filter((s) => s.status === "completed").length,
      avgScore: avg(scored.map((s) => s.overallScore!)) ,
      bestScore: scored.length ? Math.max(...scored.map((s) => s.overallScore!)) : null,
      totalMinutes: sessions.reduce((sum, s) => sum + s.durationMinutes, 0),
    },
    skillProgress: skill,
    trend: scored.map((s) => ({
      date: s.createdAt.slice(0, 10),
      overall: s.overallScore!,
      sessionId: s.id,
    })),
  };
}

/** Permanently delete a session (cascades to questions/answers/evaluations/report). */
export async function deleteSession(
  userId: string,
  sessionId: string
): Promise<{ ok: true } | { ok: false; error: string; forbidden?: boolean }> {
  const access = await getSessionForUser(userId, sessionId);
  if ("error" in access) {
    return { ok: false, error: access.message, forbidden: access.error === "forbidden" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("interview_sessions").delete().eq("id", sessionId);
  if (error) return { ok: false, error: error.message };
  logInterviewEvent("session_deleted", { sessionId, userId });
  return { ok: true };
}

/**
 * Phase 12 privacy — wipe every interview session AND uploaded resume for a
 * user (GDPR-style delete-all). Sessions cascade to questions, answers,
 * evaluations and reports; the resumes bucket object is left for the caller
 * to purge (storage cleanup stays out of the transaction).
 */
export async function deleteAllUserData(
  userId: string
): Promise<{ ok: true; deletedSessions: number; deletedResumes: number } | { ok: false; error: string }> {
  const admin = createAdminClient();

  const { count: sessionCount, error: sessionError } = await admin
    .from("interview_sessions")
    .delete({ count: "exact" })
    .eq("user_id", userId);
  if (sessionError) return { ok: false, error: sessionError.message };

  const { count: resumeCount, error: resumeError } = await admin
    .from("resumes")
    .delete({ count: "exact" })
    .eq("user_id", userId);
  if (resumeError) return { ok: false, error: resumeError.message };

  logInterviewEvent("session_deleted", { userId, sessions: sessionCount ?? 0 });
  logInterviewEvent("resume_deleted", { userId, resumes: resumeCount ?? 0 });
  return { ok: true, deletedSessions: sessionCount ?? 0, deletedResumes: resumeCount ?? 0 };
}
