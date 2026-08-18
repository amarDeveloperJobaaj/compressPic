import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Database, Json } from "@/lib/supabase/database.types";

import { getAIProvider } from "../ai";
import type { ReportGenerationContext } from "../ai/types";
import { InterviewReportSchema } from "../../schemas/report";
import type { InterviewReport } from "../../schemas/report";
import { SessionStateSchema } from "../../schemas/interview-session";
import type { CandidateProfile } from "../../schemas/resume";
import type { Difficulty } from "../../types";
import { listEvaluationsForSession } from "./evaluation-store";
import { computeReportScores } from "./report-scoring";
import { trimReportQuestions } from "./context-budget";
import { logInterviewEvent } from "./analytics";
import { getSessionForUser } from "./session";

/**
 * Report engine (master spec §58–63, Phase 9).
 *
 * ONE call: load the completed session + persisted evaluations → compute the
 * deterministic category scores → ask the provider for the qualitative report
 * (strict JSON, Zod-validated, heuristic fallback §74) → persist idempotently
 * to `interview_reports` (unique session_id, migration 009) → return it.
 *
 * Ownership is always re-verified server-side (§50).
 */

type ReportEngineErrorKind = "not_found" | "forbidden" | "invalid_state";

export class ReportEngineError extends Error {
  constructor(
    public kind: ReportEngineErrorKind,
    message: string
  ) {
    super(message);
    this.name = "ReportEngineError";
  }
}

type SessionRow = Database["public"]["Tables"]["interview_sessions"]["Row"];

/** Public shape of the persisted report (flat mirrors + full payload). */
export interface SessionReport {
  id: string;
  sessionId: string;
  report: InterviewReport;
  createdAt: string;
}

function mapReportRow(
  row: Database["public"]["Tables"]["interview_reports"]["Row"]
): SessionReport {
  return {
    id: row.id,
    sessionId: row.session_id,
    report: InterviewReportSchema.parse(row.report ?? {}),
    createdAt: row.created_at,
  };
}

async function loadCompletedSession(
  userId: string,
  sessionId: string
): Promise<SessionRow> {
  const access = await getSessionForUser(userId, sessionId);
  if ("error" in access) {
    throw new ReportEngineError(
      access.error === "forbidden" ? "forbidden" : "not_found",
      access.message
    );
  }
  const row = access.row as SessionRow;
  if (row.status !== "completed") {
    throw new ReportEngineError(
      "invalid_state",
      "The interview is not completed yet — the report can only be generated after the interview ends."
    );
  }
  return row;
}

async function loadCandidateProfile(session: SessionRow): Promise<CandidateProfile | null> {
  if (!session.resume_id) return null;
  const admin = createAdminClient();
  const { data } = await admin
    .from("resumes")
    .select("candidate_profile")
    .eq("id", session.resume_id)
    .maybeSingle();
  if (!data?.candidate_profile) return null;
  return data.candidate_profile as CandidateProfile;
}

function buildReportContext(
  session: SessionRow,
  candidateProfile: CandidateProfile | null,
  evaluations: Awaited<ReturnType<typeof listEvaluationsForSession>>
): ReportGenerationContext {
  return {
    targetRole: session.target_role,
    domain: session.domain,
    targetCompany: session.target_company,
    experienceLevel: session.experience_level,
    interviewType: session.interview_type,
    difficulty: (session.difficulty as Difficulty) ?? "intermediate",
    candidateProfile,
    scores: computeReportScores(evaluations, session.interview_type),
    // Phase 11 — cost cap: bound the per-question context sent to the report
    // provider (the stored report keeps everything the schema allows).
    questions: trimReportQuestions(
      evaluations.map((e) => ({
        questionId: e.questionId,
        question: e.question,
        questionType: e.questionType,
        topic: e.topic,
        difficulty: (e.difficulty as Difficulty) ?? "intermediate",
        answer: e.answer,
        score: e.overall,
        strengths: e.strengths,
        weaknesses: e.weaknesses,
        missingPoints: e.missingPoints,
        improvement: e.improvement,
        metrics: e.metrics,
      }))
    ),
    questionsAsked: SessionStateSchema.parse(session.current_state ?? {}).questionsAsked || evaluations.length,
    durationMinutes: session.duration_minutes,
  };
}

/**
 * Generate (or refresh) the final report for a completed session. Idempotent —
 * re-running regenerates and replaces the stored report (upsert on session_id).
 */
export async function generateSessionReport(
  userId: string,
  sessionId: string
): Promise<SessionReport> {
  const session = await loadCompletedSession(userId, sessionId);
  const [candidateProfile, evaluations] = await Promise.all([
    loadCandidateProfile(session),
    listEvaluationsForSession(userId, sessionId),
  ]);

  const provider = getAIProvider();
  const report = InterviewReportSchema.parse(
    await provider.generateReport(buildReportContext(session, candidateProfile, evaluations))
  );

  const admin = createAdminClient();
  const fields = {
    session_id: sessionId,
    overall_score: report.scores.overall,
    technical_score: report.scores.technical,
    communication_score: report.scores.communication,
    problem_solving_score: report.scores.problemSolving,
    project_score: report.scores.project,
    behavioral_score: report.scores.behavioral,
    strengths: report.strengths as unknown as Json,
    weaknesses: report.weaknesses as unknown as Json,
    improvement_areas: report.improvementPlan as unknown as Json,
    recommended_topics: report.recommendedTopics as unknown as Json,
    summary: report.summary,
    report: report as unknown as Json,
  };

  const { data, error } = await admin
    .from("interview_reports")
    .upsert(fields, { onConflict: "session_id" })
    .select("*")
    .single();

  if (error || !data) {
    throw error ?? new ReportEngineError("invalid_state", "Failed to persist the report.");
  }
  logInterviewEvent("report_generated", {
    sessionId,
    overall: report.scores.overall,
    questions: report.questionAnalysis.length,
  });
  return mapReportRow(data);
}

/** Fetch the persisted report for a session (null when not generated yet). */
export async function getSessionReport(
  userId: string,
  sessionId: string
): Promise<SessionReport | null> {
  const access = await getSessionForUser(userId, sessionId);
  if ("error" in access) {
    throw new ReportEngineError(
      access.error === "forbidden" ? "forbidden" : "not_found",
      access.message
    );
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("interview_reports")
    .select("*")
    .eq("session_id", sessionId)
    .maybeSingle();
  if (!data) return null;
  return mapReportRow(data);
}
