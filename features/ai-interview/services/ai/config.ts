import "server-only";

/**
 * Bootstrap AI configuration (master spec §105 — server-only env vars).
 *
 * These are SECURE bootstrap values only: never NEXT_PUBLIC_*. Runtime
 * control (which provider/model/credentials are active) moves to the Admin
 * Panel AI Configuration Service in a later phase (§118).
 */

export interface AiBootstrapConfig {
  provider: "openai" | "deepseek" | "gemini" | "anthropic" | "custom" | null;
  apiKey: string;
  model: string;
  /** Custom base URL for OpenAI-compatible chat completions. */
  baseUrl: string | null;
  /** True when no provider is configured — the heuristic analyzer is used. */
  configured: boolean;
}

function normalizeProvider(raw: string | undefined): AiBootstrapConfig["provider"] {
  const v = raw?.trim().toLowerCase();
  if (v === "openai" || v === "deepseek" || v === "gemini" || v === "anthropic" || v === "custom") {
    return v;
  }
  return null;
}

const DEFAULT_MODELS: Record<NonNullable<AiBootstrapConfig["provider"]>, string> = {
  openai: "gpt-4o-mini",
  deepseek: "deepseek-chat",
  gemini: "gemini-2.0-flash",
  anthropic: "claude-3-5-haiku-latest",
  custom: "default",
};

export function getAiBootstrapConfig(): AiBootstrapConfig {
  const provider = normalizeProvider(process.env.AI_PROVIDER);
  const apiKey = process.env.AI_API_KEY ?? "";
  const baseUrl = process.env.AI_BASE_URL?.trim() || null;

  return {
    provider,
    apiKey,
    model: process.env.AI_MODEL?.trim() || (provider ? DEFAULT_MODELS[provider] : "default"),
    baseUrl,
    configured: Boolean(provider && apiKey),
  };
}

/** Base chat-completions URL per provider (OpenAI-compatible shape). */
export function chatCompletionsUrl(config: AiBootstrapConfig): string {
  if (config.baseUrl) {
    return config.baseUrl.replace(/\/$/, "") + "/chat/completions";
  }
  switch (config.provider) {
    case "deepseek":
      return "https://api.deepseek.com/chat/completions";
    case "gemini":
      // Gemini's OpenAI-compatible endpoint.
      return "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
    case "anthropic":
      return "https://api.anthropic.com/v1/chat/completions";
    case "openai":
    default:
      return "https://api.openai.com/v1/chat/completions";
  }
}
