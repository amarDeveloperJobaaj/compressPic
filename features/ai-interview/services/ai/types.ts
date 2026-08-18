import type { AnswerEvaluation } from "../../schemas/evaluation";
import type { GeneratedQuestion } from "../../schemas/question";
import type { CandidateProfile, ResumeAnalysisResult } from "../../schemas/resume";
import type { Difficulty } from "../../types";

/**
 * AI provider abstraction (master spec §34).
 *
 * ONE interface; providers swappable without rewriting the engine. The active
 * provider/model/credentials come from env bootstrap config for now; the
 * Admin Panel AI Configuration Service (§118) takes over at runtime later.
 *
 * Phase 2 implements `analyzeResume`; Phase 5 adds `generateQuestion` and
 * `generateFollowUp`. The remaining methods are declared for interface
 * stability (implemented in Phases 8–9) — callers should throw a clear
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

/** One previously asked question (with its answer when present) — §52 context. */
export interface PreviousQuestionContext {
  id: string;
  sequence: number;
  question: string;
  /** Category stored in interview_questions.question_type (§44). */
  type: string;
  topic: string | null;
  difficulty: Difficulty;
  answer: string | null;
}

/**
 * Full context for question generation (§52): setup labels, candidate
 * profile, conversation history and remaining time. Built server-side from
 * the session row — the candidate's resume/answers are DATA (§73), never
 * instructions.
 */
export interface QuestionContext {
  /** "first" = the opening question; "next" = continuing after an answer. */
  mode: "first" | "next";
  targetRole: string;
  /** Setup id (e.g. "node-js") — the label is display-only; banks key on this. */
  domainId: string | null;
  domain: string | null;
  targetCompany: string | null;
  experienceLevel: string | null;
  interviewType: string;
  difficulty: Difficulty;
  candidateProfile: CandidateProfile | null;
  remainingTimeSeconds: number | null;
  previousQuestions: PreviousQuestionContext[];
  /** The just-answered question + transcript (null before the first answer). */
  lastAnswer: { question: string; answer: string } | null;
  /**
   * The adaptive controller's decision (Phase 7) — the provider must write a
   * question that HONORS this action + difficulty (§53: the AI measures, the
   * controller steers). Omitted/null before the first question.
   */
  adaptiveIntent?: {
    action: "FOLLOW_UP" | "CLARIFICATION" | "NEW_TOPIC";
    difficulty: Difficulty;
    reason: string;
  } | null;
}

/** One answered question — the input to §54 evaluation. */
export interface EvaluationContext {
  question: string;
  questionType: string;
  topic: string | null;
  difficulty: Difficulty;
  answer: string;
  experienceLevel: string | null;
  candidateProfile: CandidateProfile | null;
  targetRole: string;
  domain: string | null;
}

export interface AIProvider {
  readonly id: string;
  /** Structured candidate profile from resume text (§19). */
  analyzeResume(context: ResumeAnalysisContext): Promise<ResumeAnalysisResult>;
  /** Opening question for a fresh session (§48 question/generate). */
  generateQuestion(context: QuestionContext): Promise<GeneratedQuestion>;
  /** Next question after an answer — follow-up or new topic (§48 question/follow-up). */
  generateFollowUp(context: QuestionContext): Promise<GeneratedQuestion>;
  /** Per-answer evaluation on the §54 dimensions (Phase 7). */
  evaluateAnswer(context: EvaluationContext): Promise<AnswerEvaluation>;

  // Declared for interface stability (implemented in a later phase):
  generateReport(..._args: unknown[]): Promise<unknown>;
}

export type { CandidateProfile };
