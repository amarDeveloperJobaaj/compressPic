import { test } from "node:test";
import assert from "node:assert/strict";

import {
  MAX_PREVIOUS_QUESTIONS,
  MAX_REPORT_QUESTIONS,
  trimContext,
  trimPreviousQuestions,
  trimReportQuestions,
} from "./context-budget";

test("trimPreviousQuestions keeps the most recent questions", () => {
  const items = Array.from({ length: 30 }, (_, i) => `q${i + 1}`);
  const trimmed = trimPreviousQuestions(items);
  assert.equal(trimmed.length, MAX_PREVIOUS_QUESTIONS);
  assert.equal(trimmed[0], "q19");
  assert.equal(trimmed[trimmed.length - 1], "q30");
});

test("trimPreviousQuestions passes through short histories untouched", () => {
  const items = ["q1", "q2", "q3"];
  assert.deepEqual(trimPreviousQuestions(items), items);
});

test("trimReportQuestions caps per-question context for the report", () => {
  const items = Array.from({ length: 50 }, (_, i) => `entry${i + 1}`);
  const trimmed = trimReportQuestions(items);
  assert.equal(trimmed.length, MAX_REPORT_QUESTIONS);
  assert.equal(trimmed[trimmed.length - 1], "entry50");
});

test("trimContext handles zero and negative max", () => {
  assert.deepEqual(trimContext(["a", "b"], 0), []);
  assert.deepEqual(trimContext(["a", "b"], -1), []);
});

test("trimContext keeps order and the newest tail", () => {
  const trimmed = trimContext([1, 2, 3, 4, 5], 3);
  assert.deepEqual(trimmed, [3, 4, 5]);
});
