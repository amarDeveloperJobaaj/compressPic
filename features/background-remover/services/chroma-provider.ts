import type { BackgroundRemovalProvider, ProgressCallback, RemovalResult } from "./types";
import { blurMask } from "../utils/mask";

/**
 * Classical fallback provider — works fully offline and with no model
 * download. Segments the background by flood-filling from the image borders:
 * pixels connected to a border whose color is close to the border's dominant
 * color are treated as background; everything else (the subject) is kept.
 *
 * This handles human photos far better than a single global threshold —
 * a person's silhouette blocks the fill from crossing into them, so the
 * subject survives even on busy or non-uniform backgrounds.
 */

interface BgEstimate {
  r: number;
  g: number;
  b: number;
  /** Max color distance from the background color still treated as background. */
  threshold: number;
}

/** Robust per-channel median (ignores a few outlier border samples). */
function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

/** Estimate the dominant background color from the image border. */
function estimateBackground(
  data: Uint8ClampedArray,
  width: number,
  height: number
): BgEstimate {
  const rs: number[] = [];
  const gs: number[] = [];
  const bs: number[] = [];

  const step = Math.max(1, Math.floor(Math.min(width, height) / 64));
  const push = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    rs.push(data[i]);
    gs.push(data[i + 1]);
    bs.push(data[i + 2]);
  };
  // Top / bottom edges
  for (let x = 0; x < width; x += step) {
    push(x, 0);
    push(x, height - 1);
  }
  // Left / right edges
  for (let y = step; y < height - step; y += step) {
    push(0, y);
    push(width - 1, y);
  }

  const r = median(rs);
  const g = median(gs);
  const b = median(bs);

  // Border variance drives the threshold — but cap it so a busy border can't
  // swallow a person standing in front of it.
  let spread = 0;
  for (let i = 0; i < rs.length; i++) {
    spread += Math.hypot(rs[i] - r, gs[i] - g, bs[i] - b);
  }
  const avgDist = spread / Math.max(1, rs.length);
  return { r, g, b, threshold: Math.min(110, Math.max(30, avgDist * 2.2)) };
}

/**
 * Flood-fill the background starting from every border pixel. Returns a
 * binary mask (255 = subject keep, 0 = background) plus the background pixel
 * count. Iterative BFS with a flat queue — safe for full working resolution.
 */
function floodFillMask(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  bg: BgEstimate
): { mask: Uint8ClampedArray; bgCount: number } {
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const thresholdSq = bg.threshold * bg.threshold;
  const isBg = (i: number) => {
    const dr = data[i] - bg.r;
    const dg = data[i + 1] - bg.g;
    const db = data[i + 2] - bg.b;
    return dr * dr + dg * dg + db * db <= thresholdSq;
  };

  const push = (x: number, y: number) => {
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx * 4;
    if (!isBg(i)) return;
    visited[idx] = 1;
    queue[tail++] = idx;
  };

  // Seed from every border pixel
  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    push(0, y);
    push(width - 1, y);
  }

  while (head < tail) {
    const idx = queue[head++];
    const x = idx % width;
    const y = (idx / width) | 0;
    if (x > 0) push(x - 1, y);
    if (x < width - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < height - 1) push(x, y + 1);
  }

  const mask = new Uint8ClampedArray(total);
  let bgCount = 0;
  for (let i = 0; i < total; i++) {
    if (visited[i]) {
      mask[i] = 0;
      bgCount++;
    } else {
      mask[i] = 255;
    }
  }
  return { mask, bgCount };
}

export const chromaProvider: BackgroundRemovalProvider = {
  id: "chroma-fallback",
  label: "Classic (Offline)",

  async removeBackground(blob: Blob, onProgress?: ProgressCallback): Promise<RemovalResult> {
    onProgress?.({ percent: 10, stage: "Analyzing background…" });

    const url = URL.createObjectURL(blob);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Failed to read the image"));
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
      const { data } = imageData;

      onProgress?.({ percent: 35, stage: "Estimating background color…" });
      const bg = estimateBackground(data, width, height);

      onProgress?.({ percent: 55, stage: "Segmenting subject…" });
      const { mask, bgCount } = floodFillMask(data, width, height, bg);

      // If the fill barely covered the image, the background was estimated too
      // aggressively and the subject may have been eaten — retry once with a
      // tighter threshold before accepting the result.
      let finalMask = mask;
      if (bgCount > width * height * 0.97) {
        const tighter = { ...bg, threshold: bg.threshold * 0.5 };
        const retry = floodFillMask(data, width, height, tighter);
        finalMask = retry.mask;
      }

      onProgress?.({ percent: 80, stage: "Smoothing edges…" });
      // Soft feather so edges aren't hard silhouettes
      finalMask = blurMask(finalMask, width, height, 2);

      onProgress?.({ percent: 100, stage: "Done" });
      return {
        width,
        height,
        mask: finalMask,
        provider: this.label,
        usedFallback: true,
      };
    } finally {
      URL.revokeObjectURL(url);
    }
  },
};
