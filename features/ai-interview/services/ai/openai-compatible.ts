import "server-only";

import { AnswerEvaluationSchema } from "../../schemas/evaluation";
import type { AnswerEvaluation } from "../../schemas/evaluation";
import { CandidateProfileSchema } from "../../schemas/resume";
import { GeneratedQuestionSchema } from "../../schemas/question";
import type { GeneratedQuestion } from "../../schemas/question";
import {
  RESUME_ANALYSIS_SYSTEM_PROMPT,
  buildResumeAnalysisUserPrompt,
} from "../../prompts/resume/resume-analysis-v1";
import {
  QUESTION_SYSTEM_PROMPT,
  buildQuestionUserPrompt,
} from "../../prompts/question/question-v1";
import {
  FOLLOWUP_SYSTEM_PROMPT,
  buildFollowUpUserPrompt,
} from "../../prompts/followup/followup-v1";
import {
  EVALUATION_SYSTEM_PROMPT,
  buildEvaluationUserPrompt,
} from "../../prompts/evaluation/evaluation-v1";
import {
  REPORT_SYSTEM_PROMPT,
  buildReportUserPrompt,
} from "../../prompts/report/report-v1";
import { InterviewReportSchema } from "../../schemas/report";
import type { AiBootstrapConfig } from "./config";
import { chatCompletionsUrl } from "./config";
import type {
  AIProvider,
  EvaluationContext,
  QuestionContext,
  ReportGenerationContext,
  ResumeAnalysisContext,
} from "./types";
import { heuristicAnalyzeResume } from "./heuristic";
import { heuristicEvaluateAnswer } from "./heuristic-evaluation";
import { heuristicGenerateReport } from "./heuristic-report";
import { heuristicGenerateFollowUp, heuristicGenerateQuestion } from "./heuristic-questions";
import type { z } from "zod";

/**
 * OpenAI-compatible chat-completions provider (works for OpenAI, DeepSeek,
 * Gemini's compat endpoint, OpenRouter, etc.). Plain server-side fetch — no
 * SDK dependency, matching the repo's provider-adapter convention (§34).
 *
 * Validation (§74): parse JSON → Zod-validate → on invalid output retry once
 * → graceful fallback to the heuristic analyzer/generator.
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

function extractJsonObject(content: string): unknown {
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

  /**
   * One validated chat-completions round: send messages → parse JSON →
   * Zod-validate → retry once on ANY failure → graceful fallback. Provider
   * errors must never hard-fail a user-facing flow (§74).
   *
   * Returns `fromFallback` so callers that add metadata (e.g. the resume
   * analyzer's source/warning) can reflect which path produced the value.
   */
  private async chatJson<T>(
    messages: ChatCompletionMessage[],
    schema: z.ZodType<T>,
    fallback: () => T,
    temperature = 0.4
  ): Promise<{ value: T; fromFallback: boolean }> {
    const body = {
      model: this.config.model,
      messages,
      temperature,
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

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const raw = await callProvider();
        const content = (raw as ChatCompletionResponse)?.choices?.[0]?.message?.content;
        if (!content) {
          if (attempt === 1) break;
          continue;
        }
        const parsed = extractJsonObject(content);
        return { value: schema.parse(parsed), fromFallback: false };
      } catch {
        // Provider call failed OR output was invalid — retry once, then fall back.
        if (attempt === 1) break;
      }
    }

    return { value: fallback(), fromFallback: true };
  }

  async analyzeResume(context: ResumeAnalysisContext) {
    const messages: ChatCompletionMessage[] = [
      { role: "system", content: RESUME_ANALYSIS_SYSTEM_PROMPT },
      { role: "user", content: buildResumeAnalysisUserPrompt(context.resumeText) },
    ];
    const heuristic = () => heuristicAnalyzeResume(context.resumeText);
    const { value, fromFallback } = await this.chatJson(
      messages,
      CandidateProfileSchema,
      () => heuristic().profile,
      0.2
    );
    if (fromFallback) return heuristic();
    return { profile: value, source: "ai" as const, warning: undefined };
  }

  async generateQuestion(context: QuestionContext): Promise<GeneratedQuestion> {
    const messages: ChatCompletionMessage[] = [
      { role: "system", content: QUESTION_SYSTEM_PROMPT },
      { role: "user", content: buildQuestionUserPrompt(context) },
    ];
    const { value } = await this.chatJson(messages, GeneratedQuestionSchema, () =>
      heuristicGenerateQuestion(context)
    );
    return value;
  }

  async generateFollowUp(context: QuestionContext): Promise<GeneratedQuestion> {
    const messages: ChatCompletionMessage[] = [
      { role: "system", content: FOLLOWUP_SYSTEM_PROMPT },
      { role: "user", content: buildFollowUpUserPrompt(context) },
    ];
    const { value } = await this.chatJson(messages, GeneratedQuestionSchema, () =>
      heuristicGenerateFollowUp(context)
    );
    return value;
  }

  async evaluateAnswer(context: EvaluationContext): Promise<AnswerEvaluation> {
    const messages: ChatCompletionMessage[] = [
      { role: "system", content: EVALUATION_SYSTEM_PROMPT },
      { role: "user", content: buildEvaluationUserPrompt(context) },
    ];
    const { value } = await this.chatJson(messages, AnswerEvaluationSchema, () =>
      heuristicEvaluateAnswer(context),
      0.2
    );
    return value;
  }

  async generateReport(context: ReportGenerationContext) {
    const messages: ChatCompletionMessage[] = [
      { role: "system", content: REPORT_SYSTEM_PROMPT },
      { role: "user", content: buildReportUserPrompt(context) },
    ];
    const { value } = await this.chatJson(
      messages,
      InterviewReportSchema,
      () => heuristicGenerateReport(context),
      0.3
    );
    return value;
  }
}
