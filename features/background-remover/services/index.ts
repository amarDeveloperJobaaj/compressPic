import type { BackgroundRemovalProvider, ProgressCallback, RemovalResult } from "./types";
import { imglyProvider } from "./imgly-provider";
import { chromaProvider } from "./chroma-provider";

/**
 * Service entry point. Picks the best available provider:
 *  - AI (imgly) when the module can be loaded;
 *  - Classic chroma fallback otherwise (offline / CDN blocked).
 *
 * The provider is cached per session. Real inference failures are handled
 * per-image in `removeImageBackground`, which falls back to chroma and
 * remembers that choice so we don't retry the broken AI provider forever.
 */

let activeProvider: BackgroundRemovalProvider | null = null;

export async function getActiveProvider(): Promise<BackgroundRemovalProvider> {
  if (activeProvider) return activeProvider;

  try {
    // Importing the module is cheap (code-split) and its failure is the only
    // reliable signal that the AI engine is unavailable. NOTE: we must NOT
    // "probe" with a dummy inference — that downloads the ~80 MB model just
    // to decide, and a broken blob would falsely reject the AI provider.
    await import("@imgly/background-removal");
    activeProvider = imglyProvider;
  } catch {
    activeProvider = chromaProvider;
  }
  return activeProvider;
}

export async function removeImageBackground(
  blob: Blob,
  onProgress?: ProgressCallback
): Promise<RemovalResult> {
  const provider = await getActiveProvider();
  try {
    return await provider.removeBackground(blob, onProgress);
  } catch (err) {
    // If the AI provider fails mid-run (e.g. model download flaked), fall
    // back to the classical engine, remember it, and surface the reason.
    if (provider.id !== "chroma-fallback") {
      try {
        const result = await chromaProvider.removeBackground(blob, onProgress);
        activeProvider = chromaProvider;
        return result;
      } catch {
        throw err;
      }
    }
    throw err;
  }
}
