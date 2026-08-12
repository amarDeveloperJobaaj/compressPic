import { test } from "node:test";
import assert from "node:assert/strict";

import { canEndSession, canTransitionStatus, SessionStateSchema } from "./interview-session";
import { SESSION_STATUSES } from "../types";

/**
 * Session state machine tests (master spec §79) — the transition table the
 * question engine and session routes share, so sub-states never drift.
 */

test("the question loop is legal: active → listening → processing → asking → active", () => {
  const loop = [
    ["active", "listening"],
    ["listening", "processing"],
    ["processing", "asking"],
    ["asking", "active"],
  ] as const;
  for (const [from, to] of loop) {
    assert.equal(canTransitionStatus(from, to), true, `${from} → ${to}`);
  }
});

test("active also allows processing and ending", () => {
  assert.equal(canTransitionStatus("active", "processing"), true);
  assert.equal(canTransitionStatus("active", "asking"), true);
  assert.equal(canTransitionStatus("active", "ending"), true);
});

test("sub-states recover to active (error/retry paths)", () => {
  assert.equal(canTransitionStatus("listening", "active"), true);
  assert.equal(canTransitionStatus("listening", "asking"), true);
  assert.equal(canTransitionStatus("processing", "active"), true);
  assert.equal(canTransitionStatus("asking", "listening"), true);
  assert.equal(canTransitionStatus("asking", "processing"), true);
});

test("ending only moves toward completion", () => {
  assert.equal(canTransitionStatus("ending", "generating_report"), true);
  assert.equal(canTransitionStatus("ending", "completed"), true);
  assert.equal(canTransitionStatus("ending", "active"), false);
  assert.equal(canTransitionStatus("generating_report", "completed"), true);
});

test("completed is terminal and idle cannot skip ahead", () => {
  for (const from of SESSION_STATUSES) {
    assert.equal(canTransitionStatus("completed", from), false, `completed → ${from}`);
    if (from !== "idle") {
      assert.equal(canTransitionStatus("idle", from), from === "preparing" || from === "ready" || from === "active");
    }
  }
  assert.equal(canTransitionStatus("idle", "completed"), false);
});

test("a session can be ended from any live state except completed", () => {
  for (const status of ["idle", "preparing", "ready", "active", "listening", "processing", "asking", "ending", "generating_report"]) {
    assert.equal(canEndSession(status), true, `${status} should be endable`);
  }
  assert.equal(canEndSession("completed"), false);
});

test("SessionStateSchema provides safe §40 defaults", () => {
  const state = SessionStateSchema.parse({});
  assert.deepEqual(state, {
    currentQuestion: 0,
    currentTopic: null,
    difficulty: "intermediate",
    questionsAsked: 0,
    questionsAnswered: 0,
    remainingTimeSeconds: null,
    performanceSummary: {},
  });
});

test("SessionStateSchema rejects unknown difficulties", () => {
  assert.equal(SessionStateSchema.safeParse({ difficulty: "genius" }).success, false);
});
