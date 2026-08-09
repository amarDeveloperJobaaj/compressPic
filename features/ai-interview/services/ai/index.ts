import "server-only";

import { getAiBootstrapConfig } from "./config";
import { OpenAICompatibleProvider } from "./openai-compatible";
import type { AIProvider } from "./types";
import { heuristicAnalyzeResume } from "./heuristic";

/**
 * Provider factory (master spec §34, §118).
 *
 * When AI bootstrap env vars are configured → the OpenAI-compatible provider
 * (works with OpenAI / DeepSeek / Gemini / custom OpenAI-compatible APIs).
 * Otherwise → the heuristic analyzer so the flow never hard-fails (§74).
 */

let cached: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  const config = getAiBootstrapConfig();
  if (config.configured) {
    if (!cached) cached = new OpenAICompatibleProvider(config);
    return cached;
  }
  // Not configured — heuristic fallback provider.
  return {
    id: "heuristic",
    analyzeResume: async ({ resumeText }) => heuristicAnalyzeResume(resumeText),
    generateQuestion: () => Promise.reject(new Error("No AI provider configured (Phase 5+).")),
    generateFollowUp: () => Promise.reject(new Error("No AI provider configured (Phase 5+).")),
    evaluateAnswer: () => Promise.reject(new Error("No AI provider configured (Phase 8+).")),
    generateReport: () => Promise.reject(new Error("No AI provider configured (Phase 9+).")),
  };
}

/** True when a real AI provider (not the local heuristic) is active. */
export function isAiConfigured(): boolean {
  return getAiBootstrapConfig().configured;
}

export type { AIProvider } from "./types";
