import "server-only";

import { CandidateProfileSchema } from "../../schemas/resume";
import {
  RESUME_ANALYSIS_SYSTEM_PROMPT,
  buildResumeAnalysisUserPrompt,
} from "../../prompts/resume/resume-analysis-v1";
import type { AiBootstrapConfig } from "./config";
import { chatCompletionsUrl } from "./config";
import type { AIProvider, ResumeAnalysisContext } from "./types";
import { heuristicAnalyzeResume } from "./heuristic";

/**
 * OpenAI-compatible chat-completions provider (works for OpenAI, DeepSeek,
 * Gemini's compat endpoint, OpenRouter, etc.). Plain server-side fetch — no
 * SDK dependency, matching the repo's provider-adapter convention (§34).
 *
 * Validation (§74): parse JSON → Zod-validate → on invalid output retry once
 * → graceful fallback to the heuristic analyzer.
 */

const TIMEOUT_MS = 45_000;

interface ChatCompletionMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatCompletionResponse {
  choices?: { message?: { content?: string } }[];
}

async function fetchJson(url: string, init: RequestInit, timeoutMs = TIMEOUT_MS): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    if (!res.ok) {
      throw new Error(`Provider returned ${res.status}: ${(await res.text()).slice(0, 300)}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function extractProfileJson(content: string): unknown {
  // Strip markdown fences if the model wrapped the JSON anyway.
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : content;
  return JSON.parse(candidate);
}

export class OpenAICompatibleProvider implements AIProvider {
  readonly id: string;

  constructor(private config: AiBootstrapConfig) {
    this.id = config.provider ?? "custom";
  }

  async analyzeResume(context: ResumeAnalysisContext) {
    const userPrompt = buildResumeAnalysisUserPrompt(context.resumeText);

    const messages: ChatCompletionMessage[] = [
      { role: "system", content: RESUME_ANALYSIS_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ];

    const body = {
      model: this.config.model,
      messages,
      temperature: 0.2,
      response_format: { type: "json_object" },
    };

    const callProvider = () =>
      fetchJson(chatCompletionsUrl(this.config), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(body),
      });

    // Attempt 1 + one retry on ANY failure (network, auth, invalid output)
    // (§74: validate → retry once → graceful fallback). Provider errors must
    // never hard-fail the request — fall back to the heuristic profile.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const raw = await callProvider();
        const content = (raw as ChatCompletionResponse)?.choices?.[0]?.message?.content;
        if (!content) {
          if (attempt === 1) break;
          continue;
        }

        const parsed = extractProfileJson(content);
        const profile = CandidateProfileSchema.parse(parsed);
        return {
          profile,
          source: "ai" as const,
          warning: undefined,
        };
      } catch {
        // Provider call failed OR output was invalid — retry once, then fall back.
        if (attempt === 1) break;
      }
    }

    // Graceful fallback: local heuristic profile (§74).
    return heuristicAnalyzeResume(context.resumeText);
  }

  // Later-phase methods — not implemented yet.
  async generateQuestion() {
    throw new Error("generateQuestion is not implemented until Phase 5.");
  }
  async generateFollowUp() {
    throw new Error("generateFollowUp is not implemented until Phase 5.");
  }
  async evaluateAnswer() {
    throw new Error("evaluateAnswer is not implemented until Phase 8.");
  }
  async generateReport() {
    throw new Error("generateReport is not implemented until Phase 9.");
  }
}
