"use client";

import { getFinanceConfig } from "../configs";
import { FinanceCalculator } from "./FinanceCalculator";

/**
 * Client-side resolver for the config-driven finance calculator.
 *
 * The calculator config contains functions (compute/summarize) which cannot be
 * serialized from a Server Component, so this wrapper looks the config up on
 * the client. The route only passes the slug.
 */
export function FinanceCalculatorPage({ slug }: { slug: string }) {
  const config = getFinanceConfig(slug);
  if (!config) return null;
  return <FinanceCalculator config={config} />;
}
