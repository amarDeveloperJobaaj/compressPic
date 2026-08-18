import { analyzeTranscript } from "../../utils/transcript";

/**
 * Communication metrics pipeline (master spec §55–57, Phase 8).
 *
 * Turns a spoken-answer transcript (+ known duration) into the practice
 * metrics that are stored alongside each §54 evaluation: word count, filler
 * count + ratio, most frequent fillers, words-per-minute and a pace band.
 *
 * Pure and deterministic — no IO, no AI. Feeds:
 *   - the evaluation store (metrics jsonb column, migration 008),
 *   - Phase 9 report's communication section,
 *   - the heuristic evaluator's clarity signal (via filler ratio).
 */

export type PaceBand = "Slow" | "Moderate" | "Fast";

export interface CommunicationMetrics {
  /** Total words in the transcript (whitespace-split). */
  wordCount: number;
  /** How long the spoken answer lasted, when known. */
  durationSeconds: number | null;
  /** Total filler-word occurrences (§56 list). */
  fillerCount: number;
  /** Fillers per word (0–1) — the signal the clarity score penalizes. */
  fillerRatio: number;
  /** Fillers sorted by frequency (desc) — for the report (§56). */
  mostFrequentFillers: { word: string; count: number }[];
  /** Speaking pace in words per minute, when a duration is known. */
  wordsPerMinute: number | null;
  /** Pace band — ~142 wpm reads as Moderate (§57). */
  paceAssessment: PaceBand | null;
}

/** Full communication metrics for one spoken answer (§55–57). */
export function buildCommunicationMetrics(
  transcript: string,
  durationSeconds: number | null = null
): CommunicationMetrics {
  const analyzed = analyzeTranscript(transcript ?? "", durationSeconds);
  const wordCount = analyzed.wordCount;
  return {
    wordCount,
    durationSeconds: analyzed.durationSeconds,
    fillerCount: analyzed.fillerCount,
    fillerRatio: wordCount > 0 ? Math.round((analyzed.fillerCount / wordCount) * 1000) / 1000 : 0,
    mostFrequentFillers: analyzed.mostFrequentFillers,
    wordsPerMinute: analyzed.wordsPerMinute,
    paceAssessment: analyzed.paceAssessment,
  };
}
