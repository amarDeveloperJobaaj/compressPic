import { test } from "node:test";
import assert from "node:assert/strict";

import type { StoredEvaluation } from "./evaluation-store";
import {
  categoryScoresForAnswer,
  computeReportScores,
  getCategoryWeights,
  INTERVIEW_TYPE_WEIGHTS,
} from "./report-scoring";

/**
 * Weighted scoring model tests (master spec §58, Phase 9) — deterministic
 * category aggregation from §54 evaluations + §55–57 metrics.
 */

function makeEvaluation(overrides: Partial<StoredEvaluation> = {}): StoredEvaluation {
  return {
    id: "eval-1",
    answerId: "answer-1",
    questionId: "question-1",
    question: "Question?",
    questionType: "technical",
    topic: "javascript",
    difficulty: "intermediate",
    answer: "A solid, structured answer that covers the key concepts.",
    sequence: 1,
    overall: 7.5,
    verdict: "strong",
    scores: {
      technicalAccuracy: 8,
      relevance: 8,
      clarity: 7,
      completeness: 8,
      structure: 7,
      depth: 7,
    },
    strengths: ["Good structure"],
    weaknesses: [],
    missingPoints: [],
    improvement: null,
    metrics: {
      wordCount: 20,
      durationSeconds: 10,
      fillerCount: 0,
      fillerRatio: 0,
      mostFrequentFillers: [],
      wordsPerMinute: 120,
      paceAssessment: "Moderate",
    },
    createdAt: "2026-08-18T00:00:00.000Z",
    ...overrides,
  };
}

test("categoryScoresForAnswer maps the six §54 dimensions into categories", () => {
  const scores = categoryScoresForAnswer(makeEvaluation());
  // technical = avg(8, 7) * 10 = 75
  assert.equal(scores.technical, 75);
  // problemSolving = avg(7, 7) * 10 = 70
  assert.equal(scores.problemSolving, 70);
  // project = avg(8, 8) * 10 = 80
  assert.equal(scores.project, 80);
  // behavioral = avg(8, 7) * 10 = 75
  assert.equal(scores.behavioral, 75);
  // communication = avg(7, 7) * 10 = 70 (no fillers → no penalty)
  assert.equal(scores.communication, 70);
});

test("communication score is penalized by heavy filler use (§55)", () => {
  const evaluation = makeEvaluation({
    metrics: {
      wordCount: 50,
      durationSeconds: 30,
      fillerCount: 9,
      fillerRatio: 0.18,
      mostFrequentFillers: [{ word: "um", count: 9 }],
      wordsPerMinute: 100,
      paceAssessment: "Moderate",
    },
  });
  const scores = categoryScoresForAnswer(evaluation);
  // avg(clarity=7, structure=7)*10 = 70, minus min(10, 9) = 61
  assert.equal(scores.communication, 61);
});

test("empty evaluations produce zero scores (report needs answered questions)", () => {
  const scores = computeReportScores([], "technical");
  assert.deepEqual(scores, {
    overall: 0,
    technical: 0,
    communication: 0,
    problemSolving: 0,
    project: 0,
    behavioral: 0,
  });
});

test("interview-type weights favor the matching category (§58)", () => {
  const technical = getCategoryWeights("technical");
  assert.ok(technical.technical > technical.behavioral);
  const behavioral = getCategoryWeights("behavioral");
  assert.ok(behavioral.behavioral > behavioral.technical);
  const hr = getCategoryWeights("hr");
  assert.ok(hr.behavioral > hr.technical);
  // Unknown types fall back to the balanced "mixed" weights (categories only).
  const mixed = INTERVIEW_TYPE_WEIGHTS.mixed;
  assert.deepEqual(getCategoryWeights("unknown-type"), {
    technical: mixed.technical,
    communication: mixed.communication,
    problemSolving: mixed.problemSolving,
    project: mixed.project,
    behavioral: mixed.behavioral,
  });
});

test("overall is the interview-type weighted mean of category scores", () => {
  const evaluations = [makeEvaluation()];
  const scores = computeReportScores(evaluations, "technical");
  const weights = getCategoryWeights("technical");
  const expected = Object.keys(weights).reduce(
    (sum, key) =>
      sum + scores[key as keyof typeof scores] * weights[key as keyof typeof weights],
    0
  );
  assert.equal(scores.overall, Math.round(expected));
});

test("scores aggregate as the mean across answered questions", () => {
  const strong = makeEvaluation();
  const weak = makeEvaluation({
    id: "eval-2",
    answerId: "answer-2",
    questionId: "question-2",
    sequence: 2,
    overall: 3.5,
    verdict: "weak",
    scores: {
      technicalAccuracy: 4,
      relevance: 4,
      clarity: 3,
      completeness: 4,
      structure: 3,
      depth: 3,
    },
  });
  const scores = computeReportScores([strong, weak], "mixed");
  // technical = avg(75, 35) = 55
  assert.equal(scores.technical, 55);
  // project = avg(80, 40) = 60
  assert.equal(scores.project, 60);
});
