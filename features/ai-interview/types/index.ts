/** Interview depth — auto-suggested from the experience level (§25). */
export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

export interface Role {
  id: string;
  name: string;
  /** SEO slug — reserved for future /ai-mock-interview/[role] pages. */
  slug: string;
  description: string;
}

export interface Domain {
  id: string;
  name: string;
  /** SEO slug — reserved for future /ai-mock-interview/[domain] pages. */
  slug: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
}

/** Custom company option id — see features/ai-interview/data/companies.ts. */
export const CUSTOM_COMPANY_ID = "custom";

export interface ExperienceLevel {
  id: string;
  label: string;
  years?: string;
}

export interface InterviewType {
  id: string;
  name: string;
  description: string;
  recommended?: boolean;
}

export interface DurationOption {
  minutes: number;
  recommended?: boolean;
}/** Fully resolved interview configuration (ids resolved to data objects). */

export interface InterviewConfig {
  role: Role | null;
  domain: Domain | null;
  company: Company | null;
  customCompany: string;
  experienceLevel: ExperienceLevel | null;
  interviewType: InterviewType | null;
  durationMinutes: number | null;
  difficulty: Difficulty;
  /** Interviewer persona id (Phase 13) — defaults to "professional". */
  personalityId?: string;
  /** Current round of a multi-round interview (Phase 13 flag). */
  round?: number;
}

/** Interview session status — state machine states from master spec §79. */
export const SESSION_STATUSES = [
  "idle",
  "preparing",
  "ready",
  "active",
  "listening",
  "processing",
  "asking",
  "speaking",
  "ending",
  "generating_report",
  "completed",
] as const;

export type SessionStatus = (typeof SESSION_STATUSES)[number];

/** Input for POST /api/interview/session/create (§9–11 setup fields). */
export interface CreateInterviewSessionInput {
  roleId: string;
  domainId: string;
  companyId: string;
  customCompany?: string;
  experienceLevelId: string;
  interviewTypeId: string;
  durationMinutes: number;
  difficulty: Difficulty;
  /** Stored resume path (from /api/interview/resume/upload) — optional. */
  resumePath?: string;
  resumeFileName?: string;
  /** Analyzed candidate profile (§19) — snapshotted with the session. */
  candidateProfile?: Record<string, unknown>;
  /** Interviewer persona id (Phase 13 premium) — defaults server-side. */
  personalityId?: string;
  /** Round number of a multi-round interview (Phase 13 premium). */
  round?: number;
}

/** One interview_sessions row as the API exposes it (camelCase). */
export interface InterviewSession {
  id: string;
  userId: string;
  resumeId: string | null;
  targetRole: string;
  targetCompany: string | null;
  domain: string | null;
  experienceLevel: string | null;
  interviewType: string;
  durationMinutes: number;
  difficulty: Difficulty;
  status: SessionStatus;
  /** Setup snapshot: ids + resolved labels (recovery/report support). */
  config: Record<string, unknown>;
  /** Live engine state (§40) — maintained from Phase 7. */
  currentState: SessionState;
  startedAt: string | null;
  endedAt: string | null;
  overallScore: number | null;
  createdAt: string;
  updatedAt: string;
}

/** Live engine state (§40). */
export interface SessionState {
  currentQuestion: number;
  currentTopic: string | null;
  difficulty: Difficulty;
  questionsAsked: number;
  questionsAnswered: number;
  remainingTimeSeconds: number | null;
  performanceSummary: Record<string, unknown>;
}

export interface SessionQuestion {
  id: string;
  sessionId: string;
  question: string;
  questionType: string;
  topic: string | null;
  difficulty: Difficulty;
  sequence: number;
  parentQuestionId: string | null;
  askedAt: string;
}

export interface SessionAnswer {
  id: string;
  questionId: string;
  transcript: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
  durationSeconds: number | null;
  createdAt: string;
}

/** Recovery payload for GET /api/interview/session/:id (§76). */
export interface SessionRecovery {
  session: InterviewSession;
  questions: Array<SessionQuestion & { answers: SessionAnswer[] }>;
}
