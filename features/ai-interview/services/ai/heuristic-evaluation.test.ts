import { test } from "node:test";
import assert from "node:assert/strict";

import { heuristicEvaluateAnswer } from "./heuristic-evaluation";
import type { EvaluationContext } from "./types";

/**
 * Heuristic evaluation tests — the deterministic fallback for evaluateAnswer
 * (§74) that scores the §54 dimensions from observable text signals. Pins the
 * conservative behavior so the no-AI-key path stays stable and testable.
 */

function context(answer: string, question = "How does React decide when to re-render a component?"): EvaluationContext {
  return {
    question,
    questionType: "technical",
    topic: "react",
    difficulty: "intermediate",
    answer,
    experienceLevel: "1-3 years",
    candidateProfile: null,
    targetRole: "Software Engineer",
    domain: "MERN",
  };
}

test("returns all six §54 dimensions within 0–10", () => {
  const e = heuristicEvaluateAnswer(context("I use React for the UI. First I model state, then components re-render when props or state change."));
  for (const key of ["technicalAccuracy", "relevance", "completeness", "clarity", "structure", "depth"] as const) {
    assert.ok(e[key] >= 0 && e[key] <= 10, `${key} within range`);
  }
});

test("is deterministic — same answer scores identically", () => {
  const a = heuristicEvaluateAnswer(context("React re-renders when state or props change."));
  const b = heuristicEvaluateAnswer(context("React re-renders when state or props change."));
  assert.deepEqual(a, b);
});

test("long, structured answers score higher than one-liners", () => {
  const long = heuristicEvaluateAnswer(
    context(
      "React re-renders when state changes via setState or when props change. First, the component function runs again. Then React diffs the virtual DOM and only updates the changed parts. For example, keying lists helps React reuse elements."
    )
  );
  const short = heuristicEvaluateAnswer(context("It re-renders."));
  assert.ok(long.completeness > short.completeness);
  assert.ok(long.depth > short.depth);
  assert.ok(long.structure > short.structure);
});

test("topic overlap boosts relevance", () => {
  const onTopic = heuristicEvaluateAnswer(
    context("I would design the API with authentication first, then model the resources, then add rate limiting.")
  );
  const offTopic = heuristicEvaluateAnswer(
    context("I like hiking and I cook pasta on weekends, the weather is nice today.")
  );
  assert.ok(onTopic.relevance > offTopic.relevance);
});

test("filler words lower clarity but never crash", () => {
  const fillery = heuristicEvaluateAnswer(context("Um, like, basically I think that, you know, it re-renders, um, when state changes."));
  const clean = heuristicEvaluateAnswer(context("Components re-render when their state or props change."));
  assert.ok(clean.clarity > fillery.clarity);
  assert.ok(Number.isFinite(fillery.technicalAccuracy));
});

test("very brief answers get a completeness weakness", () => {
  const e = heuristicEvaluateAnswer(context("Yes."));
  assert.ok(e.weaknesses.some((w) => /brief/i.test(w)));
});

test("technical accuracy is conservative — never claims correctness it can't verify", () => {
  const e = heuristicEvaluateAnswer(context("React re-renders when state or props change. First the diff, then the patch."));
  assert.ok(e.technicalAccuracy <= 8.5, "accuracy caps below 9 — honesty over hype");
});

test("empty answer still returns a valid evaluation", () => {
  const e = heuristicEvaluateAnswer(context("   "));
  assert.equal(e.completeness, 2);
  assert.ok(e.weaknesses.length > 0);
});
