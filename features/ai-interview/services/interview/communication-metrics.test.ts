import { test } from "node:test";
import assert from "node:assert/strict";

import { buildCommunicationMetrics } from "./communication-metrics";

/**
 * Communication metrics pipeline tests (master spec §55–57, Phase 8) — the
 * pure builder that feeds the evaluation store's metrics payload.
 */

test("buildCommunicationMetrics computes filler ratio from filler count", () => {
  const metrics = buildCommunicationMetrics("um like basically hello world test");
  assert.equal(metrics.wordCount, 6);
  assert.equal(metrics.fillerCount, 3);
  assert.equal(metrics.fillerRatio, 0.5);
  assert.equal(metrics.mostFrequentFillers.length, 3);
});

test("buildCommunicationMetrics reports zero ratio for clean speech", () => {
  const metrics = buildCommunicationMetrics("I designed the API and deployed it");
  assert.equal(metrics.fillerCount, 0);
  assert.equal(metrics.fillerRatio, 0);
  assert.equal(metrics.paceAssessment, null);
  assert.equal(metrics.wordsPerMinute, null);
});

test("buildCommunicationMetrics derives pace from duration (wpm + band)", () => {
  // 150 words in 60s → 150 wpm → Moderate.
  const words = Array.from({ length: 150 }, () => "word").join(" ");
  const metrics = buildCommunicationMetrics(words, 60);
  assert.equal(metrics.wordsPerMinute, 150);
  assert.equal(metrics.paceAssessment, "Moderate");
  assert.equal(metrics.durationSeconds, 60);
});

test("buildCommunicationMetrics treats null duration as unknown pace", () => {
  const metrics = buildCommunicationMetrics("A short answer.", null);
  assert.equal(metrics.wordCount, 3);
  assert.equal(metrics.wordsPerMinute, null);
  assert.equal(metrics.paceAssessment, null);
});

test("buildCommunicationMetrics handles empty transcripts", () => {
  const metrics = buildCommunicationMetrics("", 30);
  assert.equal(metrics.wordCount, 0);
  assert.equal(metrics.fillerCount, 0);
  assert.equal(metrics.fillerRatio, 0);
  assert.equal(metrics.wordsPerMinute, 0);
  assert.equal(metrics.paceAssessment, "Slow");
});
