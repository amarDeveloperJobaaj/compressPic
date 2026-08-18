import { test } from "node:test";
import assert from "node:assert/strict";

import type { EvaluatedAnswer } from "../../schemas/evaluation";
import {
  bumpDifficulty,
  computeOverall,
  computeQuestionBudget,
  decideNextTurn,
  deriveVerdict,
  dropDifficulty,
  emptyPerformanceSummary,
  mergePerformance,
  parsePerformanceSummary,
  shouldEndInterview,
  MAX_FOLLOW_UP_DEPTH,
} from "./adaptive-controller";

/**
 * Adaptive controller tests (master spec §23–25, §40, §53) — the pure brain
 * that turns one evaluated answer into the next interview move. Pins the
 * verdict thresholds, the §24 action mapping, §25 difficulty adaptation, the
 * END_INTERVIEW budgets, and the §40 performance-summary merge.
 */

function evaluation(
  verdict: EvaluatedAnswer["verdict"],
  overall: number
): EvaluatedAnswer {
  return {
    technicalAccuracy: overall,
    relevance: overall,
    completeness: overall,
    clarity: overall,
    structure: overall,
    depth: overall,
    strengths: [],
    weaknesses: [],
    missingPoints: [],
    improvement: "",
    overall,
    verdict,
  };
}

const BASE = {
  evaluation: evaluation("good", 6.5),
  difficulty: "intermediate" as const,
  questionsAsked: 4,
  remainingTimeSeconds: 600,
  questionBudget: 10,
  followUpDepth: 0,
};

test("deriveVerdict thresholds are deterministic", () => {
  assert.equal(deriveVerdict(9), "excellent");
  assert.equal(deriveVerdict(8.5), "excellent");
  assert.equal(deriveVerdict(7), "strong");
  assert.equal(deriveVerdict(6), "good");
  assert.equal(deriveVerdict(5.5), "good");
  assert.equal(deriveVerdict(4.5), "weak");
  assert.equal(deriveVerdict(3.9), "wrong");
});

test("computeOverall is the mean of the six §54 dimensions", () => {
  const overall = computeOverall({
    technicalAccuracy: 8,
    relevance: 6,
    completeness: 10,
    clarity: 4,
    structure: 2,
    depth: 8,
  });
  assert.equal(overall, 6.3); // 38/6 = 6.33… → 6.3
});

test("excellent → NEW_TOPIC with a harder difficulty (§24 advanced topic)", () => {
  const decision = decideNextTurn({ ...BASE, evaluation: evaluation("excellent", 9) });
  assert.equal(decision.action, "NEW_TOPIC");
  assert.equal(decision.difficulty, "advanced");
});

test("strong → harder FOLLOW_UP (§24)", () => {
  const decision = decideNextTurn({ ...BASE, evaluation: evaluation("strong", 7.5) });
  assert.equal(decision.action, "FOLLOW_UP");
  assert.equal(decision.difficulty, "advanced");
});

test("good → NEW_TOPIC at the same difficulty", () => {
  const decision = decideNextTurn({ ...BASE, evaluation: evaluation("good", 6) });
  assert.equal(decision.action, "NEW_TOPIC");
  assert.equal(decision.difficulty, "intermediate");
});

test("weak → CLARIFICATION at a simpler difficulty (§24–25)", () => {
  const decision = decideNextTurn({ ...BASE, evaluation: evaluation("weak", 4.5) });
  assert.equal(decision.action, "CLARIFICATION");
  assert.equal(decision.difficulty, "beginner");
});

test("wrong → CLARIFICATION (concept check) at a simpler difficulty", () => {
  const decision = decideNextTurn({ ...BASE, evaluation: evaluation("wrong", 3) });
  assert.equal(decision.action, "CLARIFICATION");
  assert.equal(decision.difficulty, "beginner");
});

test("difficulty never leaves the ladder", () => {
  assert.equal(bumpDifficulty("expert"), "expert");
  assert.equal(dropDifficulty("beginner"), "beginner");
  assert.equal(bumpDifficulty("beginner"), "intermediate");
  assert.equal(dropDifficulty("expert"), "advanced");
});

test("END_INTERVIEW when the time budget is exhausted", () => {
  const decision = decideNextTurn({ ...BASE, remainingTimeSeconds: 0 });
  assert.equal(decision.action, "END_INTERVIEW");
});

test("END_INTERVIEW when the question budget is reached", () => {
  const decision = decideNextTurn({ ...BASE, questionsAsked: 10, questionBudget: 10 });
  assert.equal(decision.action, "END_INTERVIEW");
});

test("shouldEndInterview checks time and question budgets", () => {
  assert.equal(shouldEndInterview({ remainingTimeSeconds: 0, questionsAsked: 3, questionBudget: 10 }), true);
  assert.equal(shouldEndInterview({ remainingTimeSeconds: 120, questionsAsked: 10, questionBudget: 10 }), true);
  assert.equal(shouldEndInterview({ remainingTimeSeconds: 120, questionsAsked: 3, questionBudget: 10 }), false);
  assert.equal(shouldEndInterview({ remainingTimeSeconds: null, questionsAsked: 3, questionBudget: 10 }), false);
});

test("question budget scales with duration (~2 min per question)", () => {
  assert.equal(computeQuestionBudget(10), 5);
  assert.equal(computeQuestionBudget(20), 10);
  assert.equal(computeQuestionBudget(30), 15);
});

test("follow-up depth cap forces a new topic after MAX_FOLLOW_UP_DEPTH follow-ups", () => {
  const decision = decideNextTurn({
    ...BASE,
    evaluation: evaluation("strong", 7.5),
    followUpDepth: MAX_FOLLOW_UP_DEPTH,
  });
  assert.equal(decision.action, "NEW_TOPIC");
});

test("weak/wrong still get a clarification even at the follow-up cap", () => {
  const decision = decideNextTurn({
    ...BASE,
    evaluation: evaluation("wrong", 3),
    followUpDepth: MAX_FOLLOW_UP_DEPTH,
  });
  assert.equal(decision.action, "CLARIFICATION");
});

test("performance summary merges averages and verdict counts (§40)", () => {
  const s1 = mergePerformance(
    emptyPerformanceSummary(),
    evaluation("strong", 8),
    "react"
  );
  assert.equal(s1.answersEvaluated, 1);
  assert.equal(s1.overallAverage, 8);
  assert.equal(s1.verdictCounts.strong, 1);
  assert.deepEqual(s1.topics.react, { attempts: 1, average: 8 });

  const s2 = mergePerformance(s1, evaluation("weak", 4), "react");
  assert.equal(s2.answersEvaluated, 2);
  assert.equal(s2.overallAverage, 6);
  assert.equal(s2.topics.react.average, 6);
  assert.equal(s2.verdictCounts.weak, 1);
  assert.equal(s2.verdictCounts.strong, 1);
});

test("null topic does not create a topics entry", () => {
  const s = mergePerformance(emptyPerformanceSummary(), evaluation("good", 6), null);
  assert.equal(s.answersEvaluated, 1);
  assert.deepEqual(s.topics, {});
});

test("parsePerformanceSummary tolerates malformed/old jsonb", () => {
  assert.deepEqual(parsePerformanceSummary(null), emptyPerformanceSummary());
  assert.deepEqual(parsePerformanceSummary("junk"), emptyPerformanceSummary());
  const parsed = parsePerformanceSummary({
    overallAverage: 6.5,
    answersEvaluated: 2,
    topics: { react: { attempts: 1, average: 8 } },
  });
  assert.equal(parsed.overallAverage, 6.5);
  assert.equal(parsed.verdictCounts.good, 0);
  assert.equal(parsed.topics.react.average, 8);
});
