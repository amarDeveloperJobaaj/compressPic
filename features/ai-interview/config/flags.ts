/**
 * Feature flags (master spec §13 — Phase 13: premium hooks, flags only).
 *
 * Advanced features are behind feature flags — NO payments are wired (that
 * is explicitly out of scope). Server-side flags read INTERVIEW_PREMIUM_FEATURES
 * (comma-separated; "*" enables everything). The client mirror reads the
 * NEXT_PUBLIC_ variant so the UI can show Pro badges without exposing secrets.
 *
 *   INTERVIEW_PREMIUM_FEATURES=personalities,multi_round
 *   NEXT_PUBLIC_INTERVIEW_PREMIUM_FEATURES=personalities,multi_round
 */

export type PremiumFeature =
  | "personalities"
  | "multi_round"
  | "advanced_reports"
  | "coding_interviews";

const SERVER_ENV_KEY = "INTERVIEW_PREMIUM_FEATURES";
const CLIENT_ENV_KEY = "NEXT_PUBLIC_INTERVIEW_PREMIUM_FEATURES";

function parse(raw: string | undefined): Set<string> {
  const list = (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return new Set(list);
}

function isEnabled(raw: string | undefined, feature: PremiumFeature): boolean {
  const set = parse(raw);
  return set.has("*") || set.has(feature);
}

/** Server-side flag check (use in API routes / server components). */
export function isPremiumFeatureEnabled(feature: PremiumFeature): boolean {
  return isEnabled(process.env[SERVER_ENV_KEY], feature);
}

/** Client-side flag check (use in client components via usePremiumFeatures). */
export function isPremiumFeatureEnabledClient(feature: PremiumFeature): boolean {
  return isEnabled(
    typeof process !== "undefined" ? process.env[CLIENT_ENV_KEY] : undefined,
    feature
  );
}
