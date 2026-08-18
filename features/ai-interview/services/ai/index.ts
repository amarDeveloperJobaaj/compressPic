import "server-only";

import { getAiBootstrapConfig } from "./config";
import { OpenAICompatibleProvider } from "./openai-compatible";
import type { AIProvider } from "./types";
import { heuristicAnalyzeResume } from "./heuristic";
import { heuristicEvaluateAnswer } from "./heuristic-evaluation";
import { heuristicEvaluateCodingAnswer } from "./heuristic-coding-evaluation";
import {
  heuristicGenerateCodingFollowUp,
  heuristicGenerateCodingQuestion,
} from "./heuristic-coding-questions";
import { heuristicGenerateFollowUp, heuristicGenerateQuestion } from "./heuristic-questions";

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
  // Not configured — heuristic fallback provider (§74): every operation still
  // works deterministically so the flow never hard-fails without an AI key.
  const isCoding = (interviewType: string) => interviewType.toLowerCase() === "coding";

  return {
    id: "heuristic",
    analyzeResume: async ({ resumeText }) => heuristicAnalyzeResume(resumeText),
    generateQuestion: async (context) =>
      isCoding(context.interviewType)
        ? heuristicGenerateCodingQuestion(context)
        : heuristicGenerateQuestion(context),
    generateFollowUp: async (context) =>
      isCoding(context.interviewType)
        ? heuristicGenerateCodingFollowUp(context)
        : heuristicGenerateFollowUp(context),
    evaluateAnswer: async (context) =>
      context.questionType.toLowerCase() === "coding"
        ? heuristicEvaluateCodingAnswer(context)
        : heuristicEvaluateAnswer(context),
    generateReport: () => Promise.reject(new Error("No AI provider configured (Phase 9+).")),
  };
}

/** True when a real AI provider (not the local heuristic) is active. */
export function isAiConfigured(): boolean {
  return getAiBootstrapConfig().configured;
}

export type { AIProvider } from "./types";
