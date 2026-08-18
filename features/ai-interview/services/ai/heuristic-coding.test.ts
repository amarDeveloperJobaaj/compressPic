import { test } from "node:test";
import assert from "node:assert/strict";

import {
  heuristicGenerateCodingFollowUp,
  heuristicGenerateCodingQuestion,
} from "./heuristic-coding-questions";
import { heuristicEvaluateCodingAnswer } from "./heuristic-coding-evaluation";
import type { QuestionContext } from "./types";

function baseContext(overrides: Partial<QuestionContext> = {}): QuestionContext {
  return {
    mode: "first",
    personalityId: null,
    targetRole: "Software Engineer",
    domainId: "mern",
    domain: "MERN Stack",
    targetCompany: null,
    experienceLevel: "3-5 years",
    interviewType: "coding",
    difficulty: "intermediate",
    candidateProfile: null,
    remainingTimeSeconds: 1200,
    previousQuestions: [],
    lastAnswer: null,
    adaptiveIntent: null,
    ...overrides,
  };
}

test("heuristic coding question emits a valid problem JSON", () => {
  const q = heuristicGenerateCodingQuestion(baseContext());
  assert.equal(q.type, "coding");
  assert.equal(q.action, "NEW_TOPIC");
  const parsed = JSON.parse(q.question);
  assert.ok(parsed.statement.length > 10, "statement present");
  assert.ok(Array.isArray(parsed.examples) && parsed.examples.length >= 1);
  assert.ok(Array.isArray(parsed.constraints) && parsed.constraints.length >= 1);
});

test("heuristic coding question rotates to an unused problem", () => {
  const first = heuristicGenerateCodingQuestion(baseContext());
  const second = heuristicGenerateCodingQuestion(
    baseContext({
      mode: "next",
      previousQuestions: [
        {
          id: "q1",
          sequence: 1,
          question: first.question,
          type: "coding",
          topic: first.topic,
          difficulty: "intermediate",
          answer: null,
        },
      ],
    })
  );
  assert.notEqual(second.question, first.question, "no repeat");
});

test("heuristic coding follow-up honors the controller decision", () => {
  const followUp = heuristicGenerateCodingFollowUp(
    baseContext({
      mode: "next",
      adaptiveIntent: { action: "FOLLOW_UP", difficulty: "advanced", reason: "deeper" },
    })
  );
  assert.equal(followUp.action, "FOLLOW_UP");
  assert.equal(followUp.difficulty, "advanced");

  const clarification = heuristicGenerateCodingFollowUp(
    baseContext({
      mode: "next",
      adaptiveIntent: { action: "CLARIFICATION", difficulty: "beginner", reason: "weak answer" },
    })
  );
  assert.equal(clarification.action, "CLARIFICATION");
  assert.equal(clarification.difficulty, "beginner");
});

test("heuristic coding evaluator scores a complete solution", () => {
  const context = {
    question: "Write a function that returns the two indices summing to target.",
    questionType: "coding",
    topic: "two-sum",
    difficulty: "intermediate" as const,
    answer: `
function twoSum(nums, target) {
  // map value -> index for O(1) lookups
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement), i];
    seen.set(nums[i], i);
  }
  // no solution — edge case
  return [];
}
// time complexity O(n), space O(n)`,
    experienceLevel: "3-5 years",
    candidateProfile: null,
    targetRole: "Software Engineer",
    domain: "MERN Stack",
  };

  const e = heuristicEvaluateCodingAnswer(context);
  assert.ok(e.technicalAccuracy >= 6, "good code scores well");
  assert.ok(e.depth >= 6, "complexity reasoning raises depth");
  assert.ok(e.strengths.length >= 1, "strengths recorded");
});

test("heuristic coding evaluator flags an empty/minimal solution", () => {
  const context = {
    question: "Return true if the string is a palindrome.",
    questionType: "coding",
    topic: "palindrome",
    difficulty: "beginner" as const,
    answer: "",
    experienceLevel: "fresher",
    candidateProfile: null,
    targetRole: "Software Engineer",
    domain: null,
  };

  const e = heuristicEvaluateCodingAnswer(context);
  assert.ok(e.technicalAccuracy < 6, "empty solution scores low");
  assert.ok(e.weaknesses.length >= 1, "weaknesses recorded");
  assert.ok(e.missingPoints.length >= 1, "missing points recorded");
});
