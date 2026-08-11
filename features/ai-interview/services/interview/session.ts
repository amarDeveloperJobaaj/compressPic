import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";
import { CUSTOM_COMPANY_ID } from "@/features/ai-interview/data/companies";
import { COMPANIES } from "@/features/ai-interview/data/companies";
import { DOMAINS } from "@/features/ai-interview/data/domains";
import { EXPERIENCE_LEVELS } from "@/features/ai-interview/data/experience-levels";
import { INTERVIEW_TYPES } from "@/features/ai-interview/data/interview-types";
import { ROLES } from "@/features/ai-interview/data/roles";
import {
  canEndSession,
  canTransitionStatus,
  CreateInterviewSessionSchema,
  SessionStateSchema,
} from "@/features/ai-interview/schemas/interview-session";
import type { Difficulty, SessionStatus } from "@/features/ai-interview/types";
import type {
  CreateInterviewSessionInput,
  InterviewSession,
  SessionAnswer,
  SessionQuestion,
  SessionRecovery,
} from "@/features/ai-interview/types";

type SessionRow = Database["public"]["Tables"]["interview_sessions"]["Row"];
type QuestionRow = Database["public"]["Tables"]["interview_questions"]["Row"];
type AnswerRow = Database["public"]["Tables"]["interview_answers"]["Row"];
type QuestionWithAnswers = QuestionRow & { interview_answers: AnswerRow[] | null };

/** Validation failure → 400. */
export class SessionValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SessionValidationError";
  }
}

/** Result shapes — explicit, so routes map them to exact 404/403/409 statuses. */
export type SessionAccessErrorKind = "not_found" | "forbidden";
export type SessionLookupResult =
  | { ok: true; session: InterviewSession }
  | { ok: false; error: SessionAccessErrorKind; message: string };
export type SessionActionResult =
  | { ok: true; session: InterviewSession }
  | { ok: false; error: SessionAccessErrorKind | "invalid_state"; message: string };

export interface StoreQuestionInput {
  question: string;
  questionType: string;
  topic: string | null;
  difficulty: Difficulty;
  parentQuestionId?: string | null;
}

export interface StoreAnswerInput {
  transcript: string;
  audioUrl?: string | null;
  videoUrl?: string | null;
  durationSeconds?: number | null;
}

/** Resolve setup ids → display labels (config snapshot for recovery/report). */
function resolveSetupLabels(input: CreateInterviewSessionInput) {
  const role = ROLES.find((r) => r.id === input.roleId);
  const domain = DOMAINS.find((d) => d.id === input.domainId);
  const company = COMPANIES.find((c) => c.id === input.companyId);
  const experience = EXPERIENCE_LEVELS.find((e) => e.id === input.experienceLevelId);
  const interviewType = INTERVIEW_TYPES.find((t) => t.id === input.interviewTypeId);

  const targetCompany =
    input.companyId === CUSTOM_COMPANY_ID
      ? input.customCompany?.trim() || "Custom"
      : (company?.name ?? input.companyId);

  return {
    targetRole: role?.name ?? input.roleId,
    domain: domain?.name ?? input.domainId,
    targetCompany,
    experienceLevel: experience?.label ?? input.experienceLevelId,
    interviewType: interviewType?.name ?? input.interviewTypeId,
  };
}

/** §40 state, defaulted — never lets a bad jsonb row break recovery. */
function parseSessionState(raw: unknown) {
  const parsed = SessionStateSchema.safeParse(raw ?? {});
  return parsed.success ? parsed.data : SessionStateSchema.parse({});
}

function mapSessionRow(row: SessionRow): InterviewSession {
  return {
    id: row.id,
    userId: row.user_id,
    resumeId: row.resume_id,
    targetRole: row.target_role,
    targetCompany: row.target_company,
    domain: row.domain,
    experienceLevel: row.experience_level,
    interviewType: row.interview_type,
    durationMinutes: row.duration_minutes,
    difficulty: (row.difficulty as Difficulty) ?? "intermediate",
    status: (row.status as SessionStatus) ?? "idle",
    config: (row.config ?? {}) as Record<string, unknown>,
    currentState: parseSessionState(row.current_state),
    startedAt: row.started_at,
    endedAt: row.ended_at,
    overallScore: row.overall_score,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapQuestionRow(row: QuestionRow): SessionQuestion {
  return {
    id: row.id,
    sessionId: row.session_id,
    question: row.question,
    questionType: row.question_type,
    topic: row.topic,
    difficulty: (row.difficulty as Difficulty) ?? "intermediate",
    sequence: row.sequence,
    parentQuestionId: row.parent_question_id,
    askedAt: row.asked_at,
  };
}

function mapAnswerRow(row: AnswerRow): SessionAnswer {
  return {
    id: row.id,
    questionId: row.question_id,
    transcript: row.transcript,
    audioUrl: row.audio_url,
    videoUrl: row.video_url,
    durationSeconds: row.duration_seconds,
    createdAt: row.created_at,
  };
}

/** Fetch a session row and enforce ownership (§50). */
async function getSessionForUser(
  userId: string,
  sessionId: string
): Promise<{ row: SessionRow } | { error: SessionAccessErrorKind; message: string }> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("interview_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return { error: "not_found", message: "Session not found." };
  if (data.user_id !== userId) return { error: "forbidden", message: "You do not own this session." };
  return { row: data };
}

/**
 * POST /api/interview/session/create — creates the session row (status `idle`)
 * and snapshots the setup config + candidate profile. When a resume was
 * uploaded, a `resumes` row is created first and linked via resume_id.
 */
export async function createInterviewSession(
  userId: string,
  input: CreateInterviewSessionInput
): Promise<InterviewSession> {
  const parsed = CreateInterviewSessionSchema.safeParse(input);
  if (!parsed.success) {
    throw new SessionValidationError(parsed.error.issues[0]?.message ?? "Invalid session input.");
  }
  const data = parsed.data;

  // Cap the profile snapshot — it rides along in the request body.
  if (
    data.candidateProfile &&
    JSON.stringify(data.candidateProfile).length > 50_000
  ) {
    throw new SessionValidationError("Candidate profile is too large.");
  }
  const labels = resolveSetupLabels(data);

  const config = {
    roleId: data.roleId,
    domainId: data.domainId,
    companyId: data.companyId,
    customCompany: data.customCompany ?? null,
    experienceLevelId: data.experienceLevelId,
    interviewTypeId: data.interviewTypeId,
    durationMinutes: data.durationMinutes,
    difficulty: data.difficulty,
    // Recording consent is stored with the session (§31) — captured before
    // any audio/video is recorded, never after the fact.
    recordingConsent: data.recordingConsent ?? false,
    labels,
  };

  const admin = createAdminClient();

  // Session first, resume metadata after (linked via resume_id) — a failed
  // resume insert can never orphan rows; the session simply has no resume.
  const { data: row, error } = await admin
    .from("interview_sessions")
    .insert({
      user_id: userId,
      resume_id: null,
      target_role: labels.targetRole,
      target_company: labels.targetCompany,
      domain: labels.domain,
      experience_level: labels.experienceLevel,
      interview_type: labels.interviewType,
      duration_minutes: data.durationMinutes,
      difficulty: data.difficulty,
      status: "idle",
      config: config as Database["public"]["Tables"]["interview_sessions"]["Row"]["config"],
      current_state: SessionStateSchema.parse({ difficulty: data.difficulty }) as Database["public"]["Tables"]["interview_sessions"]["Row"]["current_state"],
    })
    .select("*")
    .single();
  if (error) throw error;

  if (data.resumePath) {
    // Optional resume metadata row (§42) — linked when the user uploaded one.
    const { data: resume, error: resumeError } = await admin
      .from("resumes")
      .insert({
        user_id: userId,
        file_name: data.resumeFileName ?? null,
        file_path: data.resumePath,
        candidate_profile: (data.candidateProfile ?? {}) as Database["public"]["Tables"]["resumes"]["Row"]["candidate_profile"],
      })
      .select("id")
      .single();
    if (resumeError) throw resumeError;

    const { data: linked, error: linkError } = await admin
      .from("interview_sessions")
      .update({ resume_id: resume.id })
      .eq("id", row.id)
      .select("*")
      .single();
    if (linkError) throw linkError;
    return mapSessionRow(linked);
  }

  return mapSessionRow(row);
}

/** GET /api/interview/session/:id — session only (owner). */
export async function getInterviewSession(
  userId: string,
  sessionId: string
): Promise<SessionLookupResult> {
  const result = await getSessionForUser(userId, sessionId);
  if ("error" in result) return { ok: false, error: result.error, message: result.message };
  return { ok: true, session: mapSessionRow(result.row) };
}

/** POST /api/interview/session/:id/start — idle/preparing/ready → active. */
export async function startInterviewSession(
  userId: string,
  sessionId: string
): Promise<SessionActionResult> {
  const result = await getSessionForUser(userId, sessionId);
  if ("error" in result) return { ok: false, error: result.error, message: result.message };

  const row = result.row;
  if (!canTransitionStatus(row.status as SessionStatus, "active")) {
    return {
      ok: false,
      error: "invalid_state",
      message: `Cannot start a session in status "${row.status}".`,
    };
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("interview_sessions")
    .update({
      status: "active",
      started_at: row.started_at ?? new Date().toISOString(),
    })
    .eq("id", sessionId)
    .select("*")
    .single();
  if (error) throw error;
  return { ok: true, session: mapSessionRow(data) };
}

/**
 * POST /api/interview/session/:id/end — any non-completed state → completed.
 *
 * Phase 3 shortcut: §79's ENDING → GENERATING_REPORT → COMPLETED walk is
 * driven by the engine + report pipeline (Phase 7/9). Until that exists the
 * user's End action finalizes directly (idempotent).
 */
export async function endInterviewSession(
  userId: string,
  sessionId: string
): Promise<SessionActionResult> {
  const result = await getSessionForUser(userId, sessionId);
  if ("error" in result) return { ok: false, error: result.error, message: result.message };

  const row = result.row;
  if (!canEndSession(row.status as SessionStatus)) {
    return { ok: true, session: mapSessionRow(row) }; // idempotent
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("interview_sessions")
    .update({ status: "completed", ended_at: new Date().toISOString() })
    .eq("id", sessionId)
    .select("*")
    .single();
  if (error) throw error;
  return { ok: true, session: mapSessionRow(data) };
}

/**
 * Persist one asked question (sequence auto-increments per session).
 *
 * Note: read-then-insert of max(sequence)+1 is not atomic — concurrent asks
 * could repeat a sequence (no unique constraint yet). Phase 5 wiring should
 * add a unique (session_id, sequence) index + retry, or serialize asks.
 */
export async function storeQuestion(
  userId: string,
  sessionId: string,
  input: StoreQuestionInput
): Promise<SessionQuestion> {
  const access = await getSessionForUser(userId, sessionId);
  if ("error" in access) throw new Error(access.message);

  const admin = createAdminClient();
  const { data: latest } = await admin
    .from("interview_questions")
    .select("sequence")
    .eq("session_id", sessionId)
    .order("sequence", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await admin
    .from("interview_questions")
    .insert({
      session_id: sessionId,
      question: input.question,
      question_type: input.questionType,
      topic: input.topic,
      difficulty: input.difficulty,
      sequence: (latest?.sequence ?? 0) + 1,
      parent_question_id: input.parentQuestionId ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return mapQuestionRow(data);
}

/** Persist one answer (transcript + optional media refs). */
export async function storeAnswer(
  userId: string,
  questionId: string,
  input: StoreAnswerInput
): Promise<SessionAnswer> {
  const admin = createAdminClient();
  const { data: question } = await admin
    .from("interview_questions")
    .select("session_id")
    .eq("id", questionId)
    .maybeSingle();
  if (!question) throw new Error("Question not found.");
  const access = await getSessionForUser(userId, question.session_id);
  if ("error" in access) throw new Error(access.message);

  const { data, error } = await admin
    .from("interview_answers")
    .insert({
      question_id: questionId,
      transcript: input.transcript,
      audio_url: input.audioUrl ?? null,
      video_url: input.videoUrl ?? null,
      duration_seconds: input.durationSeconds ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return mapAnswerRow(data);
}

/** GET /api/interview/session/:id — full recovery payload (§76): session +
 * questions (with answers) in order, so a reconnect can restore the room. */
export async function getSessionRecovery(
  userId: string,
  sessionId: string
): Promise<{ ok: true; recovery: SessionRecovery } | { ok: false; error: SessionAccessErrorKind; message: string }> {
  const result = await getSessionForUser(userId, sessionId);
  if ("error" in result) return { ok: false, error: result.error, message: result.message };

  const admin = createAdminClient();
  const { data: questions, error } = await admin
    .from("interview_questions")
    .select("*, interview_answers(*)")
    .eq("session_id", sessionId)
    .order("sequence", { ascending: true });

  if (error) throw error;

  return {
    ok: true,
    recovery: {
      session: mapSessionRow(result.row),
      questions: (questions ?? []).map((q) => {
        const row = q as QuestionWithAnswers;
        return { ...mapQuestionRow(row), answers: (row.interview_answers ?? []).map(mapAnswerRow) };
      }),
    },
  };
}
