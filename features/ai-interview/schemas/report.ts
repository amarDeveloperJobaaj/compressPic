import { z } from "zod";

/**
 * Final report schemas (master spec §58–63, Phase 9).
 *
 * Every AI provider must honor this STRICT JSON contract for
 * `generateReport` (§74 — validate → retry once → graceful fallback).
 * Scores are 0–100; the deterministic weighted scoring model
 * (report-scoring.ts) supplies the category scores, the AI supplies the
 * qualitative analysis (strengths, mistakes, improvement plan, topic
 * recommendations, next-interview suggestion).
 */

/** Category scores — §58: Technical / Communication / Problem Solving / Project / Behavioral. */
export const ReportScoresSchema = z.object({
  overall: z.number().min(0).max(100),
  technical: z.number().min(0).max(100),
  communication: z.number().min(0).max(100),
  problemSolving: z.number().min(0).max(100),
  project: z.number().min(0).max(100),
  behavioral: z.number().min(0).max(100),
});
export type ReportScores = z.infer<typeof ReportScoresSchema>;

/** Per-question feedback — §63: score + good/missing/improve per question. */
export const ReportQuestionAnalysisSchema = z.object({
  questionId: z.string().uuid(),
  question: z.string().max(1000),
  score: z.number().min(0).max(10),
  good: z.array(z.string().max(300)).max(6).default([]),
  missing: z.array(z.string().max(300)).max(6).default([]),
  improve: z.string().max(600).default(""),
});
export type ReportQuestionAnalysis = z.infer<typeof ReportQuestionAnalysisSchema>;

/** Prioritized improvement item — §62: why + practice + goal. */
export const ReportImprovementItemSchema = z.object({
  priority: z.number().int().min(1).max(10),
  area: z.string().max(120),
  why: z.string().max(500),
  practice: z.string().max(500),
  goal: z.string().max(300),
});
export type ReportImprovementItem = z.infer<typeof ReportImprovementItemSchema>;

/** Communication analysis — aggregated §55–57 practice metrics. */
export const ReportCommunicationSchema = z.object({
  summary: z.string().max(600).default(""),
  averageWordsPerMinute: z.number().min(0).max(500).nullable().default(null),
  averageFillerCount: z.number().min(0).max(1000).default(0),
  totalFillers: z.number().min(0).max(10000).default(0),
  mostFrequentFillers: z.array(z.string().max(60)).max(6).default([]),
});
export type ReportCommunication = z.infer<typeof ReportCommunicationSchema>;

/** The full generated report (Phase 9 deliverable). */
export const InterviewReportSchema = z.object({
  /** Overall + category scores (0–100) — §58. */
  scores: ReportScoresSchema,
  /** Short AI overview of the whole interview — §59.1. */
  summary: z.string().max(1200),
  /** Specific things the candidate did well — §59.2 / §60. */
  strengths: z.array(z.string().max(300)).max(10).default([]),
  /** Specific mistakes / weak moments — §59.3 / §61. */
  weaknesses: z.array(z.string().max(300)).max(10).default([]),
  /** Prioritized improvement plan — §59.4 / §62. */
  improvementPlan: z.array(ReportImprovementItemSchema).max(8).default([]),
  /** Per-question feedback — §59.5 / §63. */
  questionAnalysis: z.array(ReportQuestionAnalysisSchema).max(60).default([]),
  /** Communication analysis from the §55–57 metrics — §59.6. */
  communication: ReportCommunicationSchema,
  /** Topics to study next — §59.7. */
  recommendedTopics: z.array(z.string().max(160)).max(10).default([]),
  /** AI recommendation for the next interview — §59.8. */
  suggestedNextInterview: z.string().max(500).default(""),
});
export type InterviewReport = z.infer<typeof InterviewReportSchema>;
