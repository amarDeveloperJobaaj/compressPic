/**
 * Pure turn math for the question engine (no DB, no providers) — kept in its
 * own module so the retry-safety contract is unit-testable offline.
 */

/**
 * Answered-question count after the current turn, computed from the PRE-insert
 * snapshot: `alreadyAnswered` = questions that already had answers before this
 * turn, `targetQuestionHadAnswer` = whether the question being answered
 * already had one (a retry of a failed attempt).
 *
 * Counting this way means a retried submit never inflates the counter even
 * when a previous `updateSessionState` failed and left `current_state` stale.
 */
export function computeAnsweredCount(
  alreadyAnswered: number,
  targetQuestionHadAnswer: boolean
): number {
  return alreadyAnswered + (targetQuestionHadAnswer ? 0 : 1);
}
