import { test } from "node:test";
import assert from "node:assert/strict";

import { GeneratedQuestionSchema } from "../../schemas/question";
import {
  heuristicGenerateFollowUp,
  heuristicGenerateQuestion,
} from "./heuristic-questions";
import type { PreviousQuestionContext, QuestionContext } from "./types";

/**
 * Heuristic question engine tests — the deterministic fallback that conducts
 * the interview when no AI provider is configured (§74). Covers determinism,
 * personalization, topic dedupe and the NEW_TOPIC/FOLLOW_UP cadence that the
 * room's turn loop relies on.
 */

const PROFILE = {
  candidate_name: "Aman",
  experience_level: "Mid-level",
  skills: ["React", "Node.js", "MongoDB", "JavaScript"],
  projects: [{ name: "HR Management System", technologies: ["React", "Node.js"] }],
  experience: [],
  education: [],
  certifications: [],
  likely_strengths: [],
  potential_weaknesses: [],
};

function baseContext(overrides: Partial<QuestionContext> = {}): QuestionContext {
  return {
    mode: "first",
    targetRole: "Software Engineer",
    domainId: "mern",
    domain: "MERN",
    targetCompany: "Google",
    experienceLevel: "1-3 years",
    interviewType: "Mixed",
    difficulty: "intermediate",
    candidateProfile: PROFILE,
    remainingTimeSeconds: 1140,
    previousQuestions: [],
    lastAnswer: null,
    ...overrides,
  };
}

function pushTurn(
  ctx: QuestionContext,
  generated: { question: string; type: string; topic: string | null; difficulty: string; action: string },
  answer: string
): QuestionContext {
  const previous: PreviousQuestionContext[] = [
    ...ctx.previousQuestions,
    {
      id: `q${ctx.previousQuestions.length + 1}`,
      sequence: ctx.previousQuestions.length + 1,
      question: generated.question,
      type: generated.type,
      topic: generated.topic,
      difficulty: generated.difficulty,
      answer,
    },
  ];
  return { ...ctx, mode: "next", previousQuestions: previous, lastAnswer: { question: generated.question, answer } };
}

test("is deterministic — same context produces the identical question", () => {
  const a = heuristicGenerateQuestion(baseContext());
  const b = heuristicGenerateQuestion(baseContext());
  assert.deepEqual(a, b);
});

test("first question (Mixed) is an HR opener personalized with role + company", () => {
  const q = heuristicGenerateQuestion(baseContext());
  assert.equal(q.action, "NEW_TOPIC");
  assert.equal(q.type, "hr");
  assert.match(q.question, /Software Engineer role/);
  assert.match(q.question, /at Google/);
  assert.equal(GeneratedQuestionSchema.safeParse(q).success, true);
});

test("technical-only interviews skip the HR opener", () => {
  const q = heuristicGenerateQuestion(baseContext({ interviewType: "Technical" }));
  assert.notEqual(q.type, "hr");
  assert.equal(q.type, "technical");
});

test("domain banks are keyed by domain id (label-safe)", () => {
  const cases: Array<[string, string, RegExp]> = [
    ["node-js", "Node.js", /event loop/i],
    ["data-science", "Data Science", /dataset/i],
    ["ml", "ML", /bias-variance/i],
    ["devops", "DevOps", /Docker and Kubernetes/i],
  ];
  for (const [id, label, pattern] of cases) {
    const q = heuristicGenerateQuestion(
      baseContext({ interviewType: "Technical", domainId: id, domain: label })
    );
    assert.match(q.question, pattern, `domain ${id} should use its own bank`);
  }
});

test("unknown domain falls back to the generic technical bank", () => {
  const q = heuristicGenerateQuestion(
    baseContext({ interviewType: "Technical", domainId: "quantum", domain: "Quantum" })
  );
  assert.match(q.question, /API/);
});

test("project deep-dive references the resume project", () => {
  // Queue order is intentional: hr opener → domain bank (5, repeatable) →
  // project deep-dive → skills → behavioral. Walk turns until the project
  // question surfaces (these tests pin that ordering).
  let ctx = baseContext();
  let q0 = heuristicGenerateQuestion(ctx);
  let found = false;
  // The repeatable domain bank (5 questions) precedes the project deep-dive.
  for (let turn = 0; turn < 24 && !found; turn++) {
    if (q0.type === "project" && q0.question.includes("HR Management System")) found = true;
    ctx = pushTurn(ctx, q0, "I built it with React and Node.js.");
    q0 = heuristicGenerateFollowUp(ctx);
  }
  assert.equal(found, true, "a project question naming the resume project should appear");
});

test("skill questions reference candidate skills", () => {
  let ctx = baseContext();
  let q0 = heuristicGenerateQuestion(ctx);
  let sawSkill = false;
  // Domain bank + project deep-dive come first; skills follow.
  for (let turn = 0; turn < 24 && !sawSkill; turn++) {
    if (q0.type === "technical" && /\bReact\b/.test(q0.question)) sawSkill = true;
    ctx = pushTurn(ctx, q0, "I have used it in production.");
    q0 = heuristicGenerateFollowUp(ctx);
  }
  assert.equal(sawSkill, true, "a skill question naming a candidate skill should appear");
});

test("turn cadence alternates NEW_TOPIC and FOLLOW_UP", () => {
  let ctx = baseContext();
  let q0 = heuristicGenerateQuestion(ctx);
  const actions = [q0.action];
  for (let turn = 0; turn < 9; turn++) {
    ctx = pushTurn(ctx, q0, `Answer ${turn + 1}: I focused on the requirements and tested thoroughly.`);
    q0 = heuristicGenerateFollowUp(ctx);
    actions.push(q0.action);
  }
  // 10 turns: NEW_TOPIC, FOLLOW_UP, NEW_TOPIC, …
  assert.deepEqual(
    actions,
    ["NEW_TOPIC", "FOLLOW_UP", "NEW_TOPIC", "FOLLOW_UP", "NEW_TOPIC", "FOLLOW_UP", "NEW_TOPIC", "FOLLOW_UP", "NEW_TOPIC", "FOLLOW_UP"]
  );
});

test("ten-turn loop never repeats a question and every output is schema-valid", () => {
  let ctx = baseContext();
  let q0 = heuristicGenerateQuestion(ctx);
  const seen = new Set<string>([q0.question.toLowerCase()]);
  assert.equal(GeneratedQuestionSchema.safeParse(q0).success, true);

  for (let turn = 0; turn < 9; turn++) {
    ctx = pushTurn(ctx, q0, `Answer ${turn + 1}: I handled it by planning first and iterating.`);
    q0 = heuristicGenerateFollowUp(ctx);
    const valid = GeneratedQuestionSchema.safeParse(q0);
    assert.equal(valid.success, true, `turn ${turn + 2} should validate`);
    assert.equal(seen.has(q0.question.toLowerCase()), false, `turn ${turn + 2} repeats a question`);
    seen.add(q0.question.toLowerCase());
  }
});

test("works without a resume (candidateProfile null) and stays valid", () => {
  let ctx = baseContext({ candidateProfile: null });
  const q0 = heuristicGenerateQuestion(ctx);
  assert.equal(GeneratedQuestionSchema.safeParse(q0).success, true);
  ctx = pushTurn(ctx, q0, "I built a few personal projects.");
  const q1 = heuristicGenerateFollowUp(ctx);
  assert.equal(GeneratedQuestionSchema.safeParse(q1).success, true);
  assert.notEqual(q1.question, q0.question);
});

test("follow-ups reference the candidate's own words", () => {
  const ctx = baseContext();
  const q0 = heuristicGenerateQuestion(ctx);
  const next = pushTurn(ctx, q0, "I built an HR system with React and Node.js.");
  const followUp = heuristicGenerateFollowUp(next);
  assert.equal(followUp.action, "FOLLOW_UP");
  assert.match(followUp.question, /HR system/);
});
