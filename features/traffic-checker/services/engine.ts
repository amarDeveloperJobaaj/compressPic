"use client";

import type { WebsiteReport } from "../types";
import { analyzeWebsite } from "./pipeline";

/**
 * Traffic provider interface.
 *
 * The UI only talks to this interface, so a future integration with an
 * external API (Similarweb, DataForSEO, Ahrefs, SEMrush, …) is a matter
 * of adding a new provider — no UI changes required.
 */
export interface TrafficProvider {
  readonly id: string;
  readonly label: string;
  /** Returns true when this provider can handle the given domain. */
  supports(domain: string): boolean;
  /** Analyze a domain and return a full report. */
  analyze(
    domain: string,
    url: string,
    onProgress?: (pct: number, label: string) => void,
    signal?: AbortSignal
  ): Promise<WebsiteReport>;
}

/** The built-in, fully client-side provider (heuristic SEO-signal model). */
export const heuristicProvider: TrafficProvider = {
  id: "heuristic",
  label: "SEO Signal Model (client-side)",
  supports: () => true,
  analyze: (domain, url, onProgress, signal) => analyzeWebsite(domain, url, onProgress, signal),
};

/** Registry of providers. Add external API providers here in the future. */
const providers: TrafficProvider[] = [heuristicProvider];

/** Resolve the active provider (currently the heuristic one). */
export function getActiveProvider(): TrafficProvider {
  return providers[0];
}

/** Public entry point used by the UI. */
export async function runAnalysis(
  domain: string,
  url: string,
  onProgress?: (pct: number, label: string) => void,
  signal?: AbortSignal
): Promise<WebsiteReport> {
  const provider = getActiveProvider();
  return provider.analyze(domain, url, onProgress, signal);
}
