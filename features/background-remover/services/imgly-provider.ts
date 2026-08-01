import type { BackgroundRemovalProvider, ProgressCallback, RemovalResult } from "./types";

/**
 * AI provider powered by @imgly/background-removal (ONNX model running
 * fully in-browser via WASM/WebGPU). The model assets are fetched from the
 * IMG.LY CDN on first use and cached — the image itself never leaves the
 * device. For self-hosting, set PUBLIC_PATH to your own /public path.
 */

/** Where the ONNX model + WASM files are served from. "" = IMG.LY CDN. */
const PUBLIC_PATH = "";

/** Model size: "isnet" (full), "isnet_fp16" (default), "isnet_quint8" (small/fast). */
const MODEL = "isnet_fp16";
/**
 * isnet_fp16 needs WebGPU/WebGL2 fp16 support, which is missing on a lot of
 * devices. When it fails we retry with the full-precision isnet model, which
 * runs on a much wider range of hardware, before falling back to chroma.
 */
const FALLBACK_MODEL = "isnet";

let modulePromise: Promise<typeof import("@imgly/background-removal")> | null = null;

function loadModule(): Promise<typeof import("@imgly/background-removal")> {
  if (!modulePromise) {
    modulePromise = import("@imgly/background-removal");
  }
  return modulePromise;
}

/** Extract the alpha channel of an RGBA ImageData as a flat mask array. */
export function alphaFromImageData(imageData: ImageData): Uint8ClampedArray {
  const { data } = imageData;
  const mask = new Uint8ClampedArray(imageData.width * imageData.height);
  for (let i = 0; i < mask.length; i++) {
    mask[i] = data[i * 4 + 3];
  }
  return mask;
}

/** Load the mask blob returned by the provider into a flat alpha array. */
async function blobToMask(blob: Blob): Promise<{ width: number; height: number; mask: Uint8ClampedArray }> {
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Failed to read the AI result"));
      image.src = url;
    });
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D is not supported");
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, width, height);
    return { width, height, mask: alphaFromImageData(imageData) };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export const imglyProvider: BackgroundRemovalProvider = {
  id: "imgly-ai",
  label: "AI Neural Network",

  async removeBackground(blob: Blob, onProgress?: ProgressCallback): Promise<RemovalResult> {
    const mod = await loadModule();
    const { removeBackground } = mod;

    onProgress?.({ percent: 4, stage: "Loading AI model…" });

    const progressCb = (key: string, current: number, total: number) => {
      // Progress spans the model download + inference; map to 5–90%
      const pct = total > 0 ? Math.round((current / total) * 85) + 5 : 30;
      const stage = key.includes(".onnx")
        ? `Downloading AI model… (${Math.round((current / (1024 * 1024)) * 10) / 10} MB)`
        : "Removing background…";
      onProgress?.({ percent: Math.min(90, pct), stage });
    };

    let resultBlob: Blob;
    try {
      resultBlob = await removeBackground(blob, {
        publicPath: PUBLIC_PATH,
        model: MODEL,
        progress: progressCb,
      });
    } catch (err) {
      // fp16 isn't supported on every GPU/browser — retry with the
      // full-precision model before giving up. Skip the retry when the error
      // is clearly a download/network failure (the fallback model would hit
      // the same wall, and we'd rather reach the offline chroma fallback fast).
      const message = err instanceof Error ? err.message : String(err);
      const looksLikeNetwork =
        /network|fetch|download|load failed|timeout|404|ECONN|internet|ENOTFOUND|ENOTCONN/i.test(message);
      if (looksLikeNetwork) throw err;

      onProgress?.({ percent: 6, stage: "Switching to compatible model…" });
      resultBlob = await removeBackground(blob, {
        publicPath: PUBLIC_PATH,
        model: FALLBACK_MODEL,
        progress: progressCb,
      });
    }

    onProgress?.({ percent: 92, stage: "Refining edges…" });
    const result = await blobToMask(resultBlob);

    onProgress?.({ percent: 100, stage: "Done" });
    return { ...result, provider: this.label, usedFallback: false };
  },
};
