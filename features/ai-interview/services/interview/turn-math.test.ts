import { test } from "node:test";
import assert from "node:assert/strict";

import { computeAnsweredCount } from "./turn-math";

/**
 * Turn-math tests — the retry-safety contract for §40 questionsAnswered.
 * A resubmitted answer (already stored by a failed prior attempt) must never
 * inflate the counter, even when a previous state update failed.
 */

test("a fresh answer increments the count", () => {
  assert.equal(computeAnsweredCount(0, false), 1);
  assert.equal(computeAnsweredCount(2, false), 3);
});

test("a retried answer (already stored) does not inflate the count", () => {
  assert.equal(computeAnsweredCount(1, true), 1);
  assert.equal(computeAnsweredCount(5, true), 5);
});

test("mixed progression over a full session stays exact", () => {
  // q1 answered fresh → 1; retry same q1 → 1; q2 fresh → 2; retry q2 → 2.
  let count = 0;
  count = computeAnsweredCount(count, false); // 1
  count = computeAnsweredCount(count, true); // 1 (retry)
  count = computeAnsweredCount(count, false); // 2
  count = computeAnsweredCount(count, true); // 2 (retry)
  assert.equal(count, 2);
});
