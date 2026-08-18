/**
 * Transcript analysis utilities (master spec §55–57).
 *
 * Pure, testable helpers for communication *metrics* — filler words and
 * speaking pace. These are practice indicators only, never psychological
 * claims (§55): "you had 5 long pauses", never "you are anxious".
 */

/** Filler words tracked (§56). "so" is only counted as a discourse marker. */
export const FILLER_WORDS = [
  "um",
  "umm",
  "uh",
  "like",
  "basically",
  "actually",
  "you know",
  "so",
] as const;

export type FillerWord = (typeof FILLER_WORDS)[number];

export interface FillerCount {
  word: string;
  count: number;
}

export type PaceAssessment = "Slow" | "Moderate" | "Fast";

export interface TranscriptMetrics {
  /** Total words in the transcript (whitespace-split). */
  wordCount: number;
  /** How long the answer/speaking segment lasted, when known. */
  durationSeconds: number | null;
  /** Total filler-word occurrences. */
  fillerCount: number;
  /** Filler words sorted by frequency (desc) — for the report (§56). */
  mostFrequentFillers: FillerCount[];
  /** Speaking pace in words per minute, when a duration is known. */
  wordsPerMinute: number | null;
  /** Pace band — 142 wpm is "Moderate" (§57). */
  paceAssessment: PaceAssessment | null;
}

/**
 * True for filler words that read as full discourse markers — "you know" is a
 * phrase; "so" is only a filler when it opens a clause ("So, tell me…"), not
 * when it joins one ("…so I could learn").
 */
function isPhraseFiller(word: string): boolean {
  return word === "you know";
}

function isClauseStartFiller(word: string): boolean {
  return word === "so";
}

/** Occurrences of a single-word filler as a standalone token (case-insensitive). */
function countSingleWord(text: string, word: string): number {
  const matches = text.match(new RegExp(`\\b${escapeRegExp(word)}\\b`, "g"));
  return matches?.length ?? 0;
}

/** Occurrences of a multi-word filler phrase (case-insensitive). */
function countPhrase(text: string, phrase: string): number {
  const matches = text.match(new RegExp(escapeRegExp(phrase), "g"));
  return matches?.length ?? 0;
}

/**
 * Occurrences of "so" used as a discourse marker — i.e. at the start of a
 * clause (sentence start or after punctuation), where it introduces rather
 * than joins. Coarse by design; these are practice metrics (§55).
 */
function countClauseStartSo(text: string): number {
  const matches = text.match(/(^|[.!?;:]\s+)so\b/gi);
  return matches?.length ?? 0;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function countFillers(text: string): FillerCount[] {
  const normalized = text.toLowerCase();
  return FILLER_WORDS.map((word) => {
    const count = isPhraseFiller(word)
      ? countPhrase(normalized, word)
      : isClauseStartFiller(word)
        ? countClauseStartSo(normalized)
        : countSingleWord(normalized, word);
    return { word, count };
  }).filter((entry) => entry.count > 0);
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/** Words per minute — null when there is no known duration. */
export function wordsPerMinute(wordCount: number, durationSeconds: number | null): number | null {
  if (durationSeconds == null || durationSeconds <= 0) return null;
  return Math.round((wordCount / durationSeconds) * 60);
}

/** Pace bands (§57): ~142 wpm reads as Moderate. */
export function assessPace(wpm: number | null): PaceAssessment | null {
  if (wpm == null) return null;
  if (wpm < 100) return "Slow";
  if (wpm <= 160) return "Moderate";
  return "Fast";
}

/**
 * Full communication metrics for one spoken answer (§55–57). Used by the
 * Phase 6 voice loop for immediate feedback and by Phase 8's evaluation
 * pipeline to store "practice metrics" alongside dimension scores.
 */
export function analyzeTranscript(
  text: string,
  durationSeconds: number | null = null
): TranscriptMetrics {
  const wordCount = countWords(text);
  const fillers = countFillers(text);
  const mostFrequent = [...fillers].sort((a, b) => b.count - a.count).slice(0, 3);
  const wpm = wordsPerMinute(wordCount, durationSeconds);
  return {
    wordCount,
    durationSeconds,
    fillerCount: fillers.reduce((sum, f) => sum + f.count, 0),
    mostFrequentFillers: mostFrequent,
    wordsPerMinute: wpm,
    paceAssessment: assessPace(wpm),
  };
}
