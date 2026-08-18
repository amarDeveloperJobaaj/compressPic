import { test } from "node:test";
import assert from "node:assert/strict";

import { InterviewReportSchema } from "../../schemas/report";
import type { ReportGenerationContext } from "./types";
import { heuristicGenerateReport } from "./heuristic-report";

/**
 * Heuristic report tests (Phase 9) — the deterministic fallback must always
 * produce a schema-valid §58–63 report with honest aggregates.
 */

function makeContext(overrides: Partial<ReportGenerationContext> = {}): ReportGenerationContext {
  return {
    targetRole: "Frontend Engineer",
    domain: "frontend",
    targetCompany: "Acme",
    experienceLevel: "mid",
    interviewType: "technical",
    difficulty: "intermediate",
    candidateProfile: null,
    scores: {
      overall: 72,
      technical: 78,
      communication: 65,
      problemSolving: 74,
      project: 70,
      behavioral: 68,
    },
    questions: [
      {
        questionId: "11111111-1111-4111-8111-111111111111",
        question: "How would you optimize a slow-loading website?",
        questionType: "technical",
        topic: "performance",
        difficulty: "intermediate",
        answer: "Profile first, then compress images and cache aggressively.",
        score: 8.2,
        strengths: ["Good structure"],
        weaknesses: ["Could mention caching more"],
        missingPoints: ["Rate limiting"],
        improvement: "Add concrete metrics",
        metrics: {
          wordCount: 40,
          durationSeconds: 25,
          fillerCount: 0,
          fillerRatio: 0,
          mostFrequentFillers: [],
          wordsPerMinute: 96,
          paceAssessment: "Slow",
        },
      },
      {
        questionId: "22222222-2222-4222-8222-222222222222",
        question: "Explain closures.",
        questionType: "technical",
        topic: "javascript",
        difficulty: "intermediate",
        answer: "Um, like, basically, um, so a closure captures its scope, um, you know, basically.",
        score: 5.1,
        strengths: [],
        weaknesses: ["Used 6 filler words"],
        missingPoints: ["Practical example"],
        improvement: "Give an example",
        metrics: {
          wordCount: 12,
          durationSeconds: 8,
          fillerCount: 6,
          fillerRatio: 0.5,
          mostFrequentFillers: [{ word: "um", count: 3 }, { word: "basically", count: 2 }, { word: "like", count: 1 }],
          wordsPerMinute: 90,
          paceAssessment: "Slow",
        },
      },
    ],
    questionsAsked: 3,
    durationMinutes: 10,
    ...overrides,
  };
}

test("heuristic report is schema-valid and echoes deterministic scores", () => {
  const report = heuristicGenerateReport(makeContext());
  const parsed = InterviewReportSchema.parse(report);
  assert.equal(parsed.scores.overall, 72);
  assert.deepEqual(parsed.questionAnalysis.length, 2);
});

test("improvement plan targets the weakest category first", () => {
  const report = heuristicGenerateReport(
    makeContext({ scores: { overall: 60, technical: 80, communication: 40, problemSolving: 70, project: 70, behavioral: 70 } })
  );
  assert.ok(report.improvementPlan.length >= 1);
  assert.match(report.improvementPlan[0].area, /Communication/i);
});

test("filler-heavy answers surface in the improvement plan + communication section", () => {
  const report = heuristicGenerateReport(makeContext());
  assert.ok(report.communication.totalFillers >= 3);
  assert.ok(report.improvementPlan.some((item) => /Filler/i.test(item.area)));
  assert.ok(report.communication.mostFrequentFillers.includes("um"));
});

test("recommended topics come from the lowest-scoring topics", () => {
  const report = heuristicGenerateReport(makeContext());
  // javascript averaged 5.1 → below the 6 threshold → recommended.
  assert.ok(report.recommendedTopics.some((topic) => topic.startsWith("javascript")));
});

test("empty question list still produces a valid report", () => {
  const report = heuristicGenerateReport(makeContext({ questions: [], scores: { overall: 0, technical: 0, communication: 0, problemSolving: 0, project: 0, behavioral: 0 } }));
  const parsed = InterviewReportSchema.parse(report);
  assert.equal(parsed.questionAnalysis.length, 0);
  assert.equal(parsed.scores.overall, 0);
});
