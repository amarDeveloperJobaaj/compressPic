import { test } from "node:test";
import assert from "node:assert/strict";

import { GeneratedQuestionSchema, StoreAnswerInputSchema } from "./question";

/**
 * Question engine schema tests (master spec §53, §74).
 *
 * GeneratedQuestion is the strict JSON contract every AI provider must honor
 * — the tests pin its required fields, defaults and rejections so a provider
 * (or prompt) change can never silently break the engine.
 */

test("GeneratedQuestionSchema accepts a fully-specified question", () => {
  const result = GeneratedQuestionSchema.safeParse({
    action: "FOLLOW_UP",
    question: "Why did you choose JWT over session auth?",
    type: "technical",
    topic: "authentication",
    difficulty: "intermediate",
    reason: "Mentioned JWT without trade-offs.",
  });
  assert.equal(result.success, true);
  assert.deepEqual(result.data, {
    action: "FOLLOW_UP",
    question: "Why did you choose JWT over session auth?",
    type: "technical",
    topic: "authentication",
    difficulty: "intermediate",
    reason: "Mentioned JWT without trade-offs.",
  });
});

test("GeneratedQuestionSchema applies defaults for missing fields", () => {
  const result = GeneratedQuestionSchema.safeParse({ question: "Tell me about a project you own." });
  assert.equal(result.success, true);
  assert.deepEqual(result.data, {
    action: "NEW_TOPIC",
    question: "Tell me about a project you own.",
    type: "technical",
    topic: null,
    difficulty: "intermediate",
    reason: "",
  });
});

test("GeneratedQuestionSchema accepts every §53 action", () => {
  for (const action of ["NEW_TOPIC", "FOLLOW_UP", "CLARIFICATION", "END_INTERVIEW"]) {
    const result = GeneratedQuestionSchema.safeParse({ question: "How does caching help here?", action });
    assert.equal(result.success, true, `action ${action} should pass`);
    assert.equal(result.data?.action, action);
  }
});

test("GeneratedQuestionSchema rejects an action outside §53", () => {
  const result = GeneratedQuestionSchema.safeParse({
    action: "SKIP_TO_NEXT",
    question: "How does caching help here?",
  });
  assert.equal(result.success, false);
});

test("GeneratedQuestionSchema rejects a question that is too short", () => {
  const result = GeneratedQuestionSchema.safeParse({ question: "Hi?" });
  assert.equal(result.success, false);
});

test("GeneratedQuestionSchema rejects an invalid type and difficulty", () => {
  assert.equal(
    GeneratedQuestionSchema.safeParse({ question: "A valid question?", type: "trivia" }).success,
    false
  );
  assert.equal(
    GeneratedQuestionSchema.safeParse({ question: "A valid question?", difficulty: "genius" }).success,
    false
  );
});

test("StoreAnswerInputSchema accepts a valid answer", () => {
  const result = StoreAnswerInputSchema.safeParse({
    questionId: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
    transcript: "I chose JWT because it is stateless.",
    durationSeconds: 42,
  });
  assert.equal(result.success, true);
});

test("StoreAnswerInputSchema rejects bad ids, empty and oversized transcripts", () => {
  const base = {
    questionId: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
    transcript: "An answer.",
  };
  assert.equal(StoreAnswerInputSchema.safeParse({ ...base, questionId: "not-a-uuid" }).success, false);
  assert.equal(StoreAnswerInputSchema.safeParse({ ...base, transcript: "" }).success, false);
  assert.equal(StoreAnswerInputSchema.safeParse({ ...base, transcript: "x".repeat(8001) }).success, false);
  assert.equal(StoreAnswerInputSchema.safeParse({ ...base, durationSeconds: -1 }).success, false);
});
