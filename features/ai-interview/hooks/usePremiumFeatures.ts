"use client";

import { useSyncExternalStore } from "react";

import {
  isPremiumFeatureEnabledClient,
  type PremiumFeature,
} from "@/features/ai-interview/config/flags";

/**
 * Premium feature flags for the client UI (master spec §13 — Phase 13:
 * premium hooks, flags only, no payments wired).
 *
 * Reads the NEXT_PUBLIC_INTERVIEW_PREMIUM_FEATURES env var at build time via
 * useSyncExternalStore (getSnapshot reads the cached value once), so the
 * pickers can show Pro badges next to locked features without exposing any
 * server secrets.
 */
const FEATURES: PremiumFeature[] = ["personalities", "multi_round", "advanced_reports"];

function subscribe(): () => void {
  return () => {};
}

function getSnapshot(): Record<PremiumFeature, boolean> {
  const flags = {} as Record<PremiumFeature, boolean>;
  for (const feature of FEATURES) {
    flags[feature] = isPremiumFeatureEnabledClient(feature);
  }
  return flags;
}

export function usePremiumFeatures(): Record<PremiumFeature, boolean> {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
