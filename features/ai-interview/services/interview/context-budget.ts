/**
 * Context budget (master spec §11 — Phase 11: cost caps).
 *
 * Every provider call costs tokens, and the interview context grows with
 * each turn. These pure helpers cap what is SENT to the provider while
 * keeping the internal store complete (the DB always holds the full
 * history; only the prompt is trimmed):
 *
 *   - question generation: keep the most recent N answered questions
 *     (older turns rarely change the next question, and trimming bounds
 *     the prompt) — plus always the just-answered last answer.
 *   - the final report: cap the per-question entries the provider sees.
 */

/** Max answered questions sent to the provider for question generation. */
export const MAX_PREVIOUS_QUESTIONS = 12;

/** Max per-question entries sent to the report provider (§63 cap is 60). */
export const MAX_REPORT_QUESTIONS = 30;

/** Keep the most recent `max` items (oldest dropped). */
export function trimContext<T>(items: readonly T[], max: number): T[] {
  if (max <= 0) return [];
  return items.slice(-max);
}

/** Trim answered questions for question-generation context (§52). */
export function trimPreviousQuestions<T>(items: readonly T[]): T[] {
  return trimContext(items, MAX_PREVIOUS_QUESTIONS);
}

/** Trim per-question entries for the final report context (§58–63). */
export function trimReportQuestions<T>(items: readonly T[]): T[] {
  return trimContext(items, MAX_REPORT_QUESTIONS);
}
