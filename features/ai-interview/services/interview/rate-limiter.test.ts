import { test } from "node:test";
import assert from "node:assert/strict";

import { interviewRateLimiter, SlidingWindowRateLimiter } from "./rate-limiter";

test("allows calls up to the window budget", () => {
  const limiter = new SlidingWindowRateLimiter(3, 60_000);
  const now = 1_000_000;
  assert.equal(limiter.allow("u1", now), true);
  assert.equal(limiter.allow("u1", now + 1000), true);
  assert.equal(limiter.allow("u1", now + 2000), true);
  assert.equal(limiter.allow("u1", now + 3000), false);
  assert.equal(limiter.count("u1", now + 3000), 3);
});

test("window slides — old hits expire and free the budget", () => {
  const limiter = new SlidingWindowRateLimiter(2, 10_000);
  const now = 1_000_000;
  assert.equal(limiter.allow("u1", now), true);
  assert.equal(limiter.allow("u1", now + 1000), true);
  assert.equal(limiter.allow("u1", now + 2000), false);
  // 11s later the first hit is outside the window; the second hit sits on
  // the cutoff boundary (excluded, strict >) so only the new hit counts.
  assert.equal(limiter.allow("u1", now + 11_000), true);
  assert.equal(limiter.count("u1", now + 11_000), 1);
  // Another second later the window holds the two newest hits again.
  assert.equal(limiter.allow("u1", now + 12_000), true);
  assert.equal(limiter.count("u1", now + 12_000), 2);
});

test("keys are isolated from each other", () => {
  const limiter = new SlidingWindowRateLimiter(1, 60_000);
  assert.equal(limiter.allow("alice", 1000), true);
  assert.equal(limiter.allow("bob", 1000), true);
  assert.equal(limiter.allow("alice", 1001), false);
  assert.equal(limiter.allow("bob", 1001), false);
});

test("clear forgets a key's history", () => {
  const limiter = new SlidingWindowRateLimiter(1, 60_000);
  assert.equal(limiter.allow("u1", 1000), true);
  assert.equal(limiter.allow("u1", 1001), false);
  limiter.clear("u1");
  assert.equal(limiter.allow("u1", 1002), true);
});

test("shared interview limiter is configured for 60 calls/min", () => {
  // Not time-based flaky: just verify the shared instance allows a burst
  // under the cap and rejects at the cap+1 in a fresh minute.
  const key = "test-shared-key";
  interviewRateLimiter.clear(key);
  for (let i = 0; i < 60; i++) {
    assert.equal(interviewRateLimiter.allow(key), true, `call ${i + 1} should pass`);
  }
  assert.equal(interviewRateLimiter.allow(key), false);
  interviewRateLimiter.clear(key);
});
