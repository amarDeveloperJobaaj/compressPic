/**
 * Sliding-window rate limiter (master spec §11 — Phase 11: rate limits).
 *
 * In-memory, per-key sliding window: allows up to `max` calls per `windowMs`.
 * Keys are user ids — each interview POST route checks the shared limiter and
 * returns 429 when the budget is exceeded. In-memory is correct for a single
 * server instance; swap for a shared store (Redis/Postgres) when scaling out.
 */

export class SlidingWindowRateLimiter {
  private hits = new Map<string, number[]>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number
  ) {}

  /** Record a call for `key`; true when it fits in the window, false when over. */
  allow(key: string, now: number = Date.now()): boolean {
    const cutoff = now - this.windowMs;
    const recent = (this.hits.get(key) ?? []).filter((ts) => ts > cutoff);

    if (recent.length >= this.max) {
      this.hits.set(key, recent);
      return false;
    }

    recent.push(now);
    this.hits.set(key, recent);
    return true;
  }

  /** Number of calls recorded inside the current window (for tests/diagnostics). */
  count(key: string, now: number = Date.now()): number {
    const cutoff = now - this.windowMs;
    const recent = (this.hits.get(key) ?? []).filter((ts) => ts > cutoff);
    this.hits.set(key, recent);
    return recent.length;
  }

  /** Forget a key (used when a session/user is deleted). */
  clear(key: string): void {
    this.hits.delete(key);
  }
}

/**
 * Shared limiter for interview turn-loop routes. 60 calls / 60 s per user is
 * comfortably above any human pace (~1 turn every few seconds) while capping
 * runaway loops or abuse (§50 + §11).
 */
export const interviewRateLimiter = new SlidingWindowRateLimiter(60, 60_000);

/** The key used for a user's interview API budget. */
export function rateLimitKey(userId: string): string {
  return `interview:${userId}`;
}
