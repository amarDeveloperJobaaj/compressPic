import type { EvaluationContext } from "../ai/types";
import type { Difficulty } from "../../types";
import type { EvaluatedAnswer } from "../../schemas/evaluation";
import type { PaceBand } from "./communication-metrics";

/**
 * Evaluation dataset (Phase 8 — §54, §55–57, §93).
 *
 * Curated question/answer pairs spanning the realistic spectrum an interview
 * produces: strong structured answers, brief/weak ones, filler-heavy speech,
 * off-topic drift, mid-depth answers, and code-style answers. Each case pins
 * the deterministic heuristic evaluator's expected outcome (verdict allowlist
 * + overall band) and, where a duration is supplied, the expected pace band.
 *
 * This file is PURE (types only) so it can be imported both by the runnable
 * script (scripts/run-eval-dataset.ts) and by unit tests — no server code.
 */

export interface EvalDatasetCase {
  id: string;
  /** Short human label shown in the run table. */
  label: string;
  /** Question asked by the interviewer. */
  question: string;
  questionType: string;
  topic: string | null;
  difficulty: Difficulty;
  experienceLevel: string | null;
  targetRole: string;
  domain: string | null;
  /** The candidate's answer (transcript). */
  answer: string;
  /** Speaking duration — drives WPM + pace assertions. */
  durationSeconds: number | null;
  /** Allowed verdicts (the heuristic must land in this set). */
  expectedVerdicts: EvaluatedAnswer["verdict"][];
  /** Inclusive overall band (0–10). */
  overallRange: { min: number; max: number };
  /** Expected pace band when a duration is provided. */
  expectedPace: PaceBand | null;
}

export const EVAL_DATASET: EvalDatasetCase[] = [
  {
    id: "strong-structured",
    label: "Strong + structured",
    question: "How would you optimize a slow-loading website?",
    questionType: "behavioral",
    topic: "performance",
    difficulty: "intermediate",
    experienceLevel: "mid",
    targetRole: "Frontend Engineer",
    domain: "frontend",
    answer:
      "To optimize a slow-loading website, I would first profile it with the browser's performance tools to find where the time actually goes. Then I would measure the Core Web Vitals, especially the largest contentful paint, because that reflects what users experience. After profiling, I would compress the images, convert them to modern formats, defer the non-critical JavaScript, and add caching headers. Finally, I would re-test on a throttled connection to confirm the improvement, because that validates the whole optimization end to end.",
    durationSeconds: 45,
    expectedVerdicts: ["strong", "excellent"],
    overallRange: { min: 7, max: 10 },
    expectedPace: "Moderate",
  },
  {
    id: "brief-weak",
    label: "Brief / weak",
    question: "Explain how closures work in JavaScript.",
    questionType: "technical",
    topic: "javascript",
    difficulty: "intermediate",
    experienceLevel: "mid",
    targetRole: "Frontend Engineer",
    domain: "frontend",
    answer: "I don't really know.",
    durationSeconds: 8,
    expectedVerdicts: ["weak", "wrong"],
    overallRange: { min: 0, max: 5.4 },
    expectedPace: null,
  },
  {
    id: "filler-heavy",
    label: "Filler-heavy speech",
    question: "Tell me about a challenging project you worked on.",
    questionType: "behavioral",
    topic: "project",
    difficulty: "beginner",
    experienceLevel: "junior",
    targetRole: "Software Engineer",
    domain: null,
    answer:
      "Um, like, so we had a project where, um, the main challenge was, like, a really tight deadline, and, um, we had to coordinate, like, across three teams, and, um, basically we cut the scope, um, and shipped on time.",
    durationSeconds: 20,
    expectedVerdicts: ["good", "weak"],
    overallRange: { min: 4.5, max: 6.5 },
    expectedPace: "Moderate",
  },
  {
    id: "off-topic-drift",
    label: "Off-topic drift",
    question: "What is the difference between HTTP and HTTPS?",
    questionType: "technical",
    topic: "networking",
    difficulty: "beginner",
    experienceLevel: "junior",
    targetRole: "Software Engineer",
    domain: "backend",
    answer:
      "The weather today is sunny and warm, and I like to go for a walk in the park because it is relaxing and good for my health.",
    durationSeconds: 15,
    expectedVerdicts: ["good", "weak", "wrong"],
    overallRange: { min: 3, max: 6.5 },
    expectedPace: "Moderate",
  },
  {
    id: "mid-depth",
    label: "Mid-depth, on-topic",
    question: "Why is React performance important in large applications?",
    questionType: "technical",
    topic: "react",
    difficulty: "intermediate",
    experienceLevel: "mid",
    targetRole: "Frontend Engineer",
    domain: "frontend",
    answer:
      "React performance matters in large applications because every re-render can cascade across many components. If a parent re-renders unnecessarily, the whole tree pays the cost. So I keep renders cheap by memoizing components, stabilizing callbacks, and splitting state so only the parts that changed re-render.",
    durationSeconds: 23,
    expectedVerdicts: ["good", "strong"],
    overallRange: { min: 5.5, max: 8.5 },
    expectedPace: "Moderate",
  },
  {
    id: "long-expert",
    label: "Long, expert-depth",
    question: "Describe your approach to designing a scalable REST API.",
    questionType: "technical",
    topic: "api-design",
    difficulty: "advanced",
    experienceLevel: "senior",
    targetRole: "Backend Engineer",
    domain: "backend",
    answer:
      "My approach is to design the API around the domain, not the database. First, I identify the resources and their relationships, then I define the endpoints, the request and response shapes, and the error contract. Next, I add pagination, filtering, and idempotency keys where clients retry. After that, I layer caching at the edge and the database, add rate limiting per tenant, and finally I instrument every endpoint so latency and error rates are visible. Because the contract is versioned from day one, consumers upgrade safely without breaking changes.",
    durationSeconds: 45,
    expectedVerdicts: ["strong", "excellent"],
    overallRange: { min: 7, max: 10 },
    expectedPace: "Moderate",
  },
  {
    id: "verbose-slow",
    label: "Verbose but slow pace",
    question: "How do you handle code reviews?",
    questionType: "behavioral",
    topic: "collaboration",
    difficulty: "beginner",
    experienceLevel: "junior",
    targetRole: "Software Engineer",
    domain: null,
    answer:
      "I handle code reviews by reading the diff carefully and focusing on the intent of the change. Then I leave specific comments instead of general ones, because specific feedback is easier to act on. Finally I always explain the reasoning behind a suggestion, and I follow up after the author pushes the revision.",
    durationSeconds: 120,
    expectedVerdicts: ["good", "strong"],
    overallRange: { min: 5.5, max: 8.5 },
    expectedPace: "Slow",
  },
];

/** Build the exact §54 evaluation context the engine passes to providers. */
export function toEvaluationContext(item: EvalDatasetCase): EvaluationContext {
  return {
    question: item.question,
    questionType: item.questionType,
    topic: item.topic,
    difficulty: item.difficulty,
    answer: item.answer,
    experienceLevel: item.experienceLevel,
    candidateProfile: null,
    targetRole: item.targetRole,
    domain: item.domain,
  };
}
