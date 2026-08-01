import type { BackgroundRemovalProvider, ProgressCallback, RemovalResult } from "./types";
import { imglyProvider } from "./imgly-provider";
import { chromaProvider } from "./chroma-provider";

/**
 * Service entry point. Picks the best available provider:
 *  - AI (imgly) when the module can be loaded;
 *  - Classic chroma fallback otherwise (offline / CDN blocked).
 *
 * A single AI inference failure no longer permanently locks the session onto
 * the chroma fallback — we count *consecutive* failures and only park on the
 * fallback after several, so a flaky model download on image #1 doesn't
 * silently downgrade every subsequent image. `forceAiRetry()` resets the
 * counter so the user can explicitly ask the AI engine to try again.
 */

let aiModuleAvailable: boolean | null = null; // null = not probed yet
let aiConsecutiveFailures = 0;
const MAX_AI_FAILURES = 2;

export async function getActiveProvider(): Promise<BackgroundRemovalProvider> {
  if (aiModuleAvailable === false) return chromaProvider;

  if (aiModuleAvailable === null) {
    try {
      // Importing the module is cheap (code-split) and its failure is the only
      // reliable signal that the AI engine is unavailable. NOTE: we must NOT
      // "probe" with a dummy inference — that downloads the ~80 MB model just
      // to decide, and a broken blob would falsely reject the AI provider.
      await import("@imgly/background-removal");
      aiModuleAvailable = true;
    } catch {
      aiModuleAvailable = false;
      return chromaProvider;
    }
  }
  return imglyProvider;
}

/** Reset the failure counter so the next image tries the AI engine again. */
export function forceAiRetry(): void {
  aiModuleAvailable = null;
  aiConsecutiveFailures = 0;
}

export async function removeImageBackground(
  blob: Blob,
  onProgress?: ProgressCallback
): Promise<RemovalResult> {
  const provider = await getActiveProvider();

  try {
    const result = await provider.removeBackground(blob, onProgress);
    if (provider.id === "imgly-ai") aiConsecutiveFailures = 0;
    return result;
  } catch (err) {
    // If the AI provider fails mid-run (e.g. model download flaked), fall
    // back to the classical engine for THIS image. After several consecutive
    // failures we stop retrying the broken engine, but forceAiRetry() re-arms
    // it so the user isn't stuck with the fallback forever.
    if (provider.id === "imgly-ai") {
      aiConsecutiveFailures++;
      if (aiConsecutiveFailures >= MAX_AI_FAILURES) aiModuleAvailable = false;
      try {
        // chromaProvider already marks the result with usedFallback: true
        return await chromaProvider.removeBackground(blob, onProgress);
      } catch {
        throw err;
      }
    }
    throw err;
  }
}
