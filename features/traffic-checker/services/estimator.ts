"use client";

import type { TrafficEstimate, WebsiteScores } from "../types";

/* ------------------------------------------------------------------ */
/* Estimation model                                                    */
/*                                                                     */
/* Traffic is estimated from a weighted model of observable SEO        */
/* signals. We never claim exactness — the output is a score-based     */
/* estimate with a confidence level. The scale is documented below.    */
/* ------------------------------------------------------------------ */

/** Documented visitor-scale curve: health score → approximate monthly visitors (log-ish). */
const VISITOR_CURVE: [number, number][] = [
  [0, 50],
  [10, 150],
  [20, 400],
  [30, 900],
  [40, 1_800],
  [50, 3_500],
  [60, 7_000],
  [70, 14_000],
  [80, 28_000],
  [90, 60_000],
  [100, 140_000],
];

function interpolateCurve(score: number): number {
  const clamped = Math.max(0, Math.min(100, score));
  for (let i = 1; i < VISITOR_CURVE.length; i++) {
    const [x0, y0] = VISITOR_CURVE[i - 1];
    const [x1, y1] = VISITOR_CURVE[i];
    if (clamped <= x1) {
      const t = (clamped - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }
  return VISITOR_CURVE[VISITOR_CURVE.length - 1][1];
}

/** Multiplier for how many signals were actually available (0–1). */
function availabilityFactor(knownChecks: number, totalChecks: number): number {
  if (totalChecks === 0) return 0.4;
  return 0.6 + 0.4 * (knownChecks / totalChecks);
}

/**
 * Domain-age authority factor: older domains tend to have stronger
 * authority. Neutral (1) when the age is unknown — never claimed as exact.
 */
function domainAgeFactor(years: number | null): number {
  if (years == null) return 1;
  if (years < 1) return 0.85;
  if (years < 3) return 1;
  if (years < 7) return 1.1;
  return 1.2;
}

/** Small deterministic pseudo-random helper for trend shaping. */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Estimate traffic from the website's health score and signal coverage.
 * The model is fully deterministic for a given input — no hardcoded
 * per-domain values; only the documented scale above.
 */
export function estimateTraffic({
  scores,
  knownChecks,
  totalChecks,
  domainSeed,
  domainAgeYears,
}: {
  scores: WebsiteScores;
  knownChecks: number;
  totalChecks: number;
  domainSeed: number;
  domainAgeYears: number | null;
}): TrafficEstimate {
  // Weighted blend: health dominates, but a weak technical/SEO profile pulls it down.
  const weighted =
    scores.health * 0.6 +
    scores.seo * 0.15 +
    scores.technical * 0.1 +
    scores.performance * 0.1 +
    scores.content * 0.05;

  const baseMonthly = interpolateCurve(weighted);
  const availability = availabilityFactor(knownChecks, totalChecks);
  const monthlyVisitors = Math.round(baseMonthly * availability * domainAgeFactor(domainAgeYears));
  const yearlyVisitors = monthlyVisitors * 12;

  // Confidence: how much of the model is grounded in real signals.
  const confidence = Math.round(
    Math.min(96, 40 + availability * 56 + (scores.health >= 60 ? 4 : 0))
  );

  // Trend: derived from health + performance trajectory.
  const trendScore = scores.health * 0.7 + scores.performance * 0.3;
  const trend: TrafficEstimate["trend"] =
    trendScore >= 75 ? "High" : trendScore >= 50 ? "Medium" : "Low";

  // 12-month series (current month first), deterministic per domain.
  const rand = seededRandom(domainSeed * 7919 + Math.round(weighted));
  const growthRate = trend === "High" ? 0.045 : trend === "Medium" ? 0.015 : -0.008;
  const trendSeries: number[] = [];
  for (let i = 0; i < 12; i++) {
    const noise = 0.92 + rand() * 0.16;
    const growth = Math.pow(1 + growthRate, i);
    trendSeries.push(Math.max(10, Math.round(monthlyVisitors * growth * noise)));
  }

  return { monthlyVisitors, yearlyVisitors, confidence, trend, trendSeries };
}
