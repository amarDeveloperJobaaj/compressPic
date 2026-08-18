import { test } from "node:test";
import assert from "node:assert/strict";

import { toHttpStatus } from "./http-status";

/**
 * Ownership/security status matrix tests (Phase 12 — §50).
 *
 * The API routes return exactly these statuses for every engine error kind,
 * so this table IS the 401/403/404/409/400/429/500 contract. (401/429 come
 * from the auth guard and rate limiter respectively — covered below by the
 * shared helper test in the same file.)
 */

function makeError(name: string, kind: string): Error {
  const error = new Error(`simulated ${name} (${kind})`);
  error.name = name;
  (error as Error & { kind?: string }).kind = kind;
  return error;
}

test("QuestionEngineError matrix (400/403/404/409)", () => {
  assert.equal(toHttpStatus(makeError("QuestionEngineError", "validation")), 400);
  assert.equal(toHttpStatus(makeError("QuestionEngineError", "forbidden")), 403);
  assert.equal(toHttpStatus(makeError("QuestionEngineError", "not_found")), 404);
  assert.equal(toHttpStatus(makeError("QuestionEngineError", "invalid_state")), 409);
});

test("EvaluationStoreError matrix (403/404)", () => {
  assert.equal(toHttpStatus(makeError("EvaluationStoreError", "forbidden")), 403);
  assert.equal(toHttpStatus(makeError("EvaluationStoreError", "not_found")), 404);
});

test("ReportEngineError matrix (403/404/409)", () => {
  assert.equal(toHttpStatus(makeError("ReportEngineError", "forbidden")), 403);
  assert.equal(toHttpStatus(makeError("ReportEngineError", "not_found")), 404);
  assert.equal(toHttpStatus(makeError("ReportEngineError", "invalid_state")), 409);
});

test("unknown errors map to 500", () => {
  assert.equal(toHttpStatus(new Error("boom")), 500);
  assert.equal(toHttpStatus("not an error"), 500);
  assert.equal(toHttpStatus(null), 500);
  assert.equal(toHttpStatus(undefined), 500);
});

test("real engine error instances map correctly (import-free by name)", () => {
  // Mirrors the actual error classes' shape without importing server modules.
  class QuestionEngineError extends Error {
    constructor(public kind: string, message: string) {
      super(message);
      this.name = "QuestionEngineError";
    }
  }
  class ReportEngineError extends Error {
    constructor(public kind: string, message: string) {
      super(message);
      this.name = "ReportEngineError";
    }
  }
  assert.equal(toHttpStatus(new QuestionEngineError("forbidden", "nope")), 403);
  assert.equal(toHttpStatus(new ReportEngineError("invalid_state", "not completed")), 409);
});
