import { test } from "node:test";
import assert from "node:assert/strict";

import {
  buildQuestionSystemPrompt,
  QUESTION_SYSTEM_PROMPT,
} from "./question-v1";
import { buildFollowUpSystemPrompt } from "../followup/followup-v1";
import {
  INTERVIEWER_PERSONALITIES,
  DEFAULT_PERSONALITY_ID,
} from "../../data/interviewer-personalities";

test("question system prompt keeps the strict JSON contract", () => {
  const prompt = buildQuestionSystemPrompt(DEFAULT_PERSONALITY_ID);
  assert.ok(prompt.includes(QUESTION_SYSTEM_PROMPT), "base prompt preserved");
  assert.ok(prompt.includes("Return ONLY strict JSON"), "JSON contract intact");
});

test("personality directive is appended for a non-default persona", () => {
  const strict = INTERVIEWER_PERSONALITIES.find((p) => p.id === "strict")!;
  const prompt = buildQuestionSystemPrompt("strict");
  assert.ok(prompt.includes(strict.promptDirective), "directive appended");
  assert.ok(prompt.length > QUESTION_SYSTEM_PROMPT.length);
});

test("unknown personality falls back to the default (no directive mismatch)", () => {
  const prompt = buildQuestionSystemPrompt("does-not-exist");
  const fallback = buildQuestionSystemPrompt(null);
  assert.equal(prompt, fallback);
});

test("follow-up prompt appends the directive without losing the controller contract", () => {
  const directive = INTERVIEWER_PERSONALITIES.find((p) => p.id === "technical")!.promptDirective;
  const prompt = buildFollowUpSystemPrompt("technical");
  assert.ok(prompt.includes("adaptiveIntent"), "controller contract intact");
  assert.ok(prompt.includes(directive), "directive appended");
});
