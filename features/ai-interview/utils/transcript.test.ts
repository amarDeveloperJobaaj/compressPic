import { test } from "node:test";
import assert from "node:assert/strict";

import {
  assessPace,
  countFillers,
  countWords,
  wordsPerMinute,
  analyzeTranscript,
} from "./transcript";

/**
 * Transcript metric tests (master spec §55–57) — filler detection and speaking
 * pace, kept as pure practice metrics (no psychological claims).
 */

test("countFillers finds single-word fillers case-insensitively", () => {
  const result = countFillers("Um, I basically use React. Umm, um, actually I like it.");
  assert.deepEqual(result, [
    { word: "um", count: 2 }, // "Um" + "um" — the "umm" is counted separately
    { word: "umm", count: 1 },
    { word: "like", count: 1 },
    { word: "basically", count: 1 },
    { word: "actually", count: 1 },
  ]);
});

test("countFillers treats 'you know' as a phrase", () => {
  const result = countFillers("you know, you know — I you know mean it");
  const youKnow = result.find((f) => f.word === "you know");
  assert.equal(youKnow?.count, 3);
});

test("countFillers counts 'so' only as a clause-start discourse marker", () => {
  // "So" opens a clause twice; the middle "so" joins a clause and is not a filler.
  const result = countFillers("So I built it, so we shipped it. So then…");
  const so = result.find((f) => f.word === "so");
  assert.equal(so?.count, 2);
});

test("countFillers returns nothing for clean speech", () => {
  assert.deepEqual(countFillers("I designed the API and deployed it to production."), []);
});

test("countWords splits on whitespace and trims", () => {
  assert.equal(countWords("  one two   three "), 3);
  assert.equal(countWords(""), 0);
  assert.equal(countWords("   "), 0);
});

test("wordsPerMinute computes wpm and returns null without duration", () => {
  assert.equal(wordsPerMinute(150, 60), 150);
  assert.equal(wordsPerMinute(300, 120), 150);
  assert.equal(wordsPerMinute(50, 0), null);
  assert.equal(wordsPerMinute(50, null), null);
});

test("assessPace bands match §57 (142 wpm → Moderate)", () => {
  assert.equal(assessPace(142), "Moderate");
  assert.equal(assessPace(99), "Slow");
  assert.equal(assessPace(100), "Moderate");
  assert.equal(assessPace(160), "Moderate");
  assert.equal(assessPace(161), "Fast");
  assert.equal(assessPace(null), null);
});

test("analyzeTranscript produces a full metrics object", () => {
  const text = "Basically, um, I designed the REST API. Actually, you know, we used JWT.";
  const metrics = analyzeTranscript(text, 60);
  assert.equal(metrics.wordCount, 13);
  assert.equal(metrics.durationSeconds, 60);
  assert.equal(metrics.fillerCount, 4);
  assert.equal(metrics.wordsPerMinute, 13);
  assert.equal(metrics.paceAssessment, "Slow");
  // Most frequent first, capped at three.
  assert.equal(metrics.mostFrequentFillers.length, 3);
  assert.ok(metrics.mostFrequentFillers[0].count >= metrics.mostFrequentFillers[1].count);
});

test("analyzeTranscript reports null pace when duration is unknown", () => {
  const metrics = analyzeTranscript("A short answer.");
  assert.equal(metrics.wordsPerMinute, null);
  assert.equal(metrics.paceAssessment, null);
});
