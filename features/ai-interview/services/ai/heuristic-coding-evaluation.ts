import type { AnswerEvaluation } from "../../schemas/evaluation";
import { countWords } from "../../utils/transcript";
import type { EvaluationContext } from "./types";

/**
 * Heuristic coding solution evaluator (Phase 13).
 *
 * Local, deterministic fallback for evaluating submitted CODE (§74). Scores the
 * six §54 dimensions from observable text signals in the code — function/class
 * presence, return statements, edge-case handling, complexity mentions,
 * comments, length — and is deliberately conservative: it never claims the
 * code is correct, only that the signals are present. Practice metrics only.
 */

/** Keywords that suggest edge cases are handled. */
const EDGE_CASE_MARKERS = [
  "empty",
  "null",
  "undefined",
  "single element",
  "length === 0",
  "length == 0",
  "length < 1",
  "if (!",
  "if (!array",
  "if (!arr",
  "base case",
  "base-case",
  "return 0",
];

/** Complexity annotations in comments/explanation. */
const COMPLEXITY_MARKERS = [
  "O(1)",
  "O(n)",
  "O(log",
  "O(n log n)",
  "O(n^2)",
  "O(n²)",
  "time complexity",
  "space complexity",
  "complexity",
];

const STRUCTURE_MARKERS = [
  "function ",
  "const ",
  "let ",
  "return ",
  "class ",
  "def ",
  "=>",
  "public ",
  "private ",
  "void ",
  "int ",
  "static ",
];

const COMMENT_MARKERS = ["//", "/*", "*", "#", "--"];

function countMatches(text: string, markers: string[]): number {
  return markers.filter((m) => text.includes(m)).length;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(10, Math.round(value * 10) / 10));
}

/**
 * Deterministic §54 evaluation of a code solution. Honest about limits: it
 * measures structure, edge-case awareness, complexity reasoning and length —
 * it cannot verify correctness without an LLM, so technicalAccuracy is a
 * conservative baseline nudged by those signals.
 */
export function heuristicEvaluateCodingAnswer(context: EvaluationContext): AnswerEvaluation {
  const code = context.answer.trim();
  const words = countWords(code);
  const edgeCases = countMatches(code.toLowerCase(), EDGE_CASE_MARKERS);
  const complexity = countMatches(code, COMPLEXITY_MARKERS);
  const structure = countMatches(code, STRUCTURE_MARKERS);
  const comments = countMatches(code, COMMENT_MARKERS);
  const lines = code.split("\n").length;

  // Completeness: substance — real code needs length + structure.
  const completeness = clampScore(
    words >= 120 ? 8.5 : words >= 60 ? 7 : words >= 30 ? 5.5 : words >= 12 ? 4 : 2
  );

  // Structure: how organized the code reads (functions/returns/declarations).
  const structureScore = clampScore(4 + Math.min(3, structure) + (lines >= 15 ? 1.5 : lines >= 8 ? 0.5 : 0));

  // Clarity: comments + readable length signal intent.
  const clarity = clampScore(5 + Math.min(2, comments) + (lines >= 10 ? 1 : 0) + (structure >= 2 ? 1 : 0));

  // Relevance: has a return + function/class → it addresses the problem shape.
  const hasReturn = /return\s+[^;]/.test(code);
  const relevance = clampScore(4 + (hasReturn ? 3 : 0) + (structure >= 1 ? 2 : 0));

  // Depth: complexity reasoning + edge cases are the sophistication signals.
  const depth = clampScore(3 + Math.min(3, complexity) + Math.min(2, edgeCases) + (words >= 120 ? 2 : words >= 60 ? 1 : 0));

  // Technical accuracy: conservative baseline — length/structure/edge cases are
  // the only verifiable evidence without an LLM. Never exceeds 8.5.
  const accuracy = clampScore(
    4.5 + (words >= 60 ? 1 : 0.5) + (structure >= 2 ? 1 : 0.5) + (edgeCases >= 1 ? 1 : 0) + (hasReturn ? 0.5 : 0)
  );

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const missingPoints: string[] = [];

  if (hasReturn) strengths.push("The solution returns a value, matching the problem's expected output shape.");
  else weaknesses.push("No return statement found — the solution does not produce an output.");
  if (structure >= 3) strengths.push("Well-organized code — functions, declarations, and control flow are used clearly.");
  else if (structure < 2) weaknesses.push("Code is minimal — structure it with functions and clear control flow.");
  if (edgeCases >= 1) strengths.push("Edge cases are considered (empty input, nulls, base cases).");
  else missingPoints.push("No explicit edge-case handling — consider empty input, single elements, and nulls.");
  if (complexity >= 1) strengths.push("Complexity is acknowledged — good to reason about time/space.");
  else missingPoints.push("No complexity analysis — note the time and space complexity of your approach.");
  if (words < 30) missingPoints.push("The solution is very short — expand it into a complete, runnable answer.");
  if (comments >= 2) strengths.push("Comments explain intent — makes the code easier to review.");

  return {
    technicalAccuracy: accuracy,
    relevance,
    completeness,
    clarity,
    structure: structureScore,
    depth,
    strengths,
    weaknesses,
    missingPoints,
    improvement:
      weaknesses.length > 0
        ? "Complete the solution with a clear function, a return statement, edge-case handling, and a brief complexity note."
        : "Solid solution — keep the structure and add complexity reasoning where missing.",
  };
}
