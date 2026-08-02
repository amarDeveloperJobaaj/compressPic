import type { BackgroundRemovalProvider, ProgressCallback, RemovalResult } from "./types";
import { loadImageData } from "../utils/refine";
import { refineMaskInWorker } from "../utils/refineWorker";

/**
 * AI provider powered by @imgly/background-removal (ONNX model running
 * fully in-browser via WASM/WebGPU). The model assets are fetched from the
 * IMG.LY CDN on first use and cached — the image itself never leaves the
 * device. For self-hosting, set PUBLIC_PATH to your own /public path.
 *
 * Reliability ladder: fp16 + GPU is fastest but needs WebGL2/WebGPU fp16,
 * which is missing on a lot of devices (and flaky on some drivers). Instead
 * of giving up, we walk down a ladder of model-size × device combos until one
 * runs. Every attempt that runs the wasm/onnx runtime shares the resource
 * cache, so later attempts are fast once the download landed. Only a hard
 * network failure (CDN blocked / offline) skips the ladder and lets the
 * caller fall back to the offline engine.
 *
 * Every result also passes through the shared refinement pipeline (speck
 * removal, hole fill, color-aware defringe, edge smoothing) so the neural
 * cutout comes out with clean, natural edges — no halos, no flecks.
 */

/** Where the ONNX model + WASM files are served from. "" = IMG.LY CDN. */
const PUBLIC_PATH = "";

interface Attempt {
  model: "isnet" | "isnet_fp16" | "isnet_quint8";
  device: "cpu" | "gpu";
  stage: string;
}

/** Tried in order — best quality first, most compatible last. */
const ATTEMPTS: Attempt[] = [
  { model: "isnet_fp16", device: "gpu", stage: "Running AI (high accuracy)…" },
  { model: "isnet", device: "gpu", stage: "Retrying with compatible model…" },
  { model: "isnet_fp16", device: "cpu", stage: "Retrying on CPU (fp16)…" },
  { model: "isnet", device: "cpu", stage: "Retrying on CPU (full precision)…" },
  { model: "isnet_quint8", device: "cpu", stage: "Retrying with light model…" },
];

let modulePromise: Promise<typeof import("@imgly/background-removal")> | null = null;

function loadModule(): Promise<typeof import("@imgly/background-removal")> {
  if (!modulePromise) {
    modulePromise = import("@imgly/background-removal");
  }
  return modulePromise;
}

/** Load the mask blob returned by the provider into a flat alpha array. */
async function blobToMask(blob: Blob): Promise<{ width: number; height: number; mask: Uint8ClampedArray }> {
  const img = await loadImageData(blob);
  const { data, width, height } = img;
  const mask = new Uint8ClampedArray(width * height);
  for (let i = 0; i < mask.length; i++) {
    mask[i] = data[i * 4 + 3];
  }
  return { width, height, mask };
}

export const imglyProvider: BackgroundRemovalProvider = {
  id: "imgly-ai",
  label: "AI Neural Network",

  async removeBackground(blob: Blob, onProgress?: ProgressCallback): Promise<RemovalResult> {
    const mod = await loadModule();
    const { removeBackground } = mod;

    onProgress?.({ percent: 4, stage: "Loading AI model…" });

    // Original pixels — needed for the color-aware defringe pass.
    const imgData = await loadImageData(blob);

    let lastErr: unknown = null;

    for (let attempt = 0; attempt < ATTEMPTS.length; attempt++) {
      const { model, device, stage } = ATTEMPTS[attempt];
      try {
        onProgress?.({
          percent: 6 + attempt * 3,
          stage,
        });

        const progressCb = (key: string, current: number, total: number) => {
          // Progress spans the model download + inference; map to a per-attempt
          // range that ends just before the next attempt would start.
          const base = 6 + attempt * 3;
          const span = 82 - attempt * 2;
          const pct = total > 0 ? Math.round((current / total) * span) + base : base + 40;
          const stageText = key.includes(".onnx")
            ? `Downloading AI model… (${Math.round((current / (1024 * 1024)) * 10) / 10} MB)`
            : stage;
          onProgress?.({ percent: Math.min(90, pct), stage: stageText });
        };

        const resultBlob = await removeBackground(blob, {
          publicPath: PUBLIC_PATH,
          model,
          device,
          progress: progressCb,
        });

        onProgress?.({ percent: 91, stage: "Refining edges…" });
        const { width, height, mask: rawMask } = await blobToMask(resultBlob);

        // Shared advanced refinement: kill specks, close holes, remove the
        // halo with color-aware defringe, smooth the rim. Runs in a Web Worker
        // so the UI thread never blocks on the multi-MB passes.
        const mask = await refineMaskInWorker(imgData, rawMask, {
          removeIslands: true,
          fillHoles: true,
          defringe: true,
          defringeStrength: 0.85,
          smooth: 1,
        });

        onProgress?.({ percent: 100, stage: "Done" });
        return { width, height, mask, provider: this.label, usedFallback: false };
      } catch (err) {
        // A hard network/download failure means every model on the same CDN
        // would hit the same wall — bail to the offline fallback fast.
        const message = err instanceof Error ? err.message : String(err);
        const looksLikeNetwork =
          /network|fetch|download|load failed|timeout|404|ECONN|internet|ENOTFOUND|ENOTCONN|networkerror|cross origin|failed to fetch/i.test(message);
        if (looksLikeNetwork) throw err;
        lastErr = err;
        // else: GPU/fp16 incompatibility or transient runtime error — try the
        // next rung of the ladder.
      }
    }

    throw lastErr instanceof Error ? lastErr : new Error("AI background removal failed");
  },
};
