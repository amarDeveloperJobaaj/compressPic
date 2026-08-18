import type { AnswerEvaluation } from "../../schemas/evaluation";
import { countFillers, countWords } from "../../utils/transcript";
import type { EvaluationContext } from "./types";

/**
 * Heuristic answer evaluator (Phase 7).
 *
 * Local, deterministic, dependency-free fallback for `evaluateAnswer` when no
 * AI provider is configured (§74). Scores the six §54 dimensions from
 * observable text signals — length, structure markers, filler words, topic
 * overlap — and is deliberately conservative: it never claims to verify
 * technical correctness it cannot check. Practice metrics only (§55).
 */

const STRUCTURE_MARKERS = [
  "first",
  "second",
  "third",
  "finally",
  "then",
  "next",
  "because",
  "however",
  "therefore",
  "for example",
  "in addition",
  "on the other hand",
  "as a result",
  "step",
  "approach",
  "process",
  "strategy",
];

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "of", "to", "in", "on", "for", "with",
  "at", "by", "from", "is", "are", "was", "were", "be", "been", "it", "this",
  "that", "i", "you", "we", "they", "he", "she", "what", "how", "when", "why",
  "your", "my", "me", "do", "does", "did", "can", "could", "would", "will",
  "should", "have", "has", "had", "not", "no", "yes", "about", "as", "if",
  "so", "just", "really", "very", "get", "got", "going", "go", "like", "one",
  "two", "thing", "things", "there", "here", "them", "their", "its", "our",
]);

/** Keyword overlap between the question and the answer (stopwords removed). */
function questionOverlap(question: string, answer: string): number {
  const words = (s: string) =>
    new Set(
      s.toLowerCase().split(/[^a-z0-9+#.-]+/).filter((w) => w.length > 2 && !STOPWORDS.has(w))
    );
  const q = words(question);
  const a = words(answer);
  if (q.size === 0) return 0;
  let hits = 0;
  for (const w of q) if (a.has(w)) hits++;
  return hits / q.size;
}

/** Count of structural/connective phrases that organize an answer. */
function structureSignals(text: string): number {
  const lower = text.toLowerCase();
  return STRUCTURE_MARKERS.filter((m) => lower.includes(m)).length;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(10, Math.round(value * 10) / 10));
}

/**
 * Deterministic §54 evaluation of one answer. Scores are honest about their
 * limits: technical accuracy is a conservative baseline nudged by evidence
 * (length + depth signals), never a claim of correctness.
 */
export function heuristicEvaluateAnswer(context: EvaluationContext): AnswerEvaluation {
  const answer = context.answer.trim();
  const words = countWords(answer);
  const fillers = countFillers(answer);
  const fillerCount = fillers.reduce((sum, f) => sum + f.count, 0);
  const fillerRatio = words > 0 ? fillerCount / words : 1;
  const signals = structureSignals(answer);
  const overlap = questionOverlap(context.question, answer);

  // Completeness: length bands — a real answer needs substance.
  const completeness = clampScore(words >= 80 ? 8.5 : words >= 40 ? 7 : words >= 20 ? 5.5 : words >= 10 ? 4 : 2);

  // Structure: how organized the answer reads (markers + length).
  const structure = clampScore(4 + Math.min(3, signals) + (words >= 60 ? 1.5 : words >= 30 ? 0.5 : 0));

  // Clarity: filler ratio is the dominant signal (§55 — practice metrics only).
  const clarity = clampScore(
    fillerRatio <= 0.01 ? 8.5 : fillerRatio <= 0.03 ? 7.5 : fillerRatio <= 0.06 ? 6 : 4.5
  );

  // Relevance: direct answer to the question asked.
  const relevance = clampScore(4 + overlap * 5 + (words >= 15 ? 1 : 0));

  // Depth: appropriate for the experience level — substance over fluff.
  const depth = clampScore(3 + Math.min(3, signals) + (words >= 100 ? 3 : words >= 50 ? 2 : words >= 25 ? 1 : 0));

  // Technical accuracy: conservative baseline; length + signals are the only
  // verifiable evidence without an LLM. Never exceeds 8.5.
  const accuracy = clampScore(5 + (words >= 40 ? 1 : 0.5) + (signals >= 2 ? 1 : 0.5) + (overlap > 0.4 ? 1 : 0));

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const missingPoints: string[] = [];

  if (words >= 50) strengths.push("Substantive answer with enough detail to demonstrate understanding.");
  else if (words < 15) weaknesses.push("Answer is very brief — expand with a concrete example or reasoning.");
  if (signals >= 2) strengths.push("Well-structured — uses logical connectors to organize the response.");
  else weaknesses.push("Answer would benefit from clearer structure (e.g. first…, then…, finally…).");
  if (fillerCount === 0) strengths.push("Clear delivery with no filler words.");
  else if (fillerCount > 3)
    weaknesses.push(`Used ${fillerCount} filler word${fillerCount === 1 ? "" : "s"} — try pausing instead (practice metric, §55).`);
  if (overlap < 0.15) weaknesses.push("Answer drifts from the question asked — address the topic directly.");
  if (words < 25) missingPoints.push("Consider elaborating on the key concepts the question targets.");

  return {
    technicalAccuracy: accuracy,
    relevance: relevance,
    completeness: completeness,
    clarity: clarity,
    structure: structure,
    depth: depth,
    strengths,
    weaknesses,
    missingPoints,
    improvement:
      weaknesses.length > 0
        ? "Elaborate with a concrete example, use a clear structure (first… then… finally…), and keep filler words low."
        : "Solid answer — keep the same depth and structure in the next one.",
  };
}
