import type { BackgroundRemovalProvider, ProgressCallback, RemovalResult } from "./types";
import { loadImageData } from "../utils/refine";
import { refineMaskInWorker } from "../utils/refineWorker";

/**
 * Classical fallback provider — works fully offline and with no model
 * download. Segments the background by flood-filling from the image borders:
 * pixels connected to a border whose color is close to the border's dominant
 * color are treated as background; everything else (the subject) is kept.
 *
 * Advanced accuracy features over a naive threshold:
 *  - Robust border statistics (median + median-absolute-deviation) so busy or
 *    gradient borders don't poison the estimate.
 *  - Gradient-aware filling: strong image edges (the subject outline) are
 *    only crossed by near-perfect color matches, which stops the fill from
 *    bleeding into the subject through low-contrast boundaries.
 *  - A full refinement pass (speck removal, hole fill, color-based defringe,
 *    edge smoothing) shared with the AI provider, so both engines produce the
 *    same clean, natural cut.
 */

interface BgEstimate {
  r: number;
  g: number;
  b: number;
  /** Squared color distance from the background color still treated as bg. */
  thresholdSq: number;
  /** Sobel gradient above which filling requires a near-exact color match. */
  gradientGate: number;
}

/** Weighted color distance (green weighted) — squared to avoid a sqrt. */
function distSq(
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number
): number {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return dr * dr + 2 * dg * dg + db * db;
}

/** Robust median of an array (in-place sort is fine at this scale). */
function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

/** p-th percentile (0..1) of an array. */
function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
}

/**
 * Estimate the dominant background color + adaptive threshold from the image
 * border. The threshold is driven by the actual border variance (p90 of the
 * border samples' distance to the median color) and clamped so a busy border
 * can't swallow a person standing in front of it.
 */
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
  for (let x = 0; x < width; x += step) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = step; y < height - step; y += step) {
    push(0, y);
    push(width - 1, y);
  }

  const r = median(rs);
  const g = median(gs);
  const b = median(bs);

  // p90 border distance → adaptive threshold; clamp to [26, 95].
  const dists = rs.map((_, i) => Math.sqrt(distSq(rs[i], gs[i], bs[i], r, g, b)));
  const p90 = percentile(dists, 0.9);
  const threshold = Math.max(26, Math.min(95, p90 * 1.35));

  return {
    r,
    g,
    b,
    thresholdSq: threshold * threshold,
    // Pixels with a stronger gradient than this are likely part of the
    // subject outline — they require a near-exact match to be filled.
    gradientGate: 70,
  };
}

/**
 * Sobel gradient magnitude (luminance-based). Used as a fill barrier: the
 * subject's outline is almost always a strong gradient, and letting the fill
 * cross it is what causes background bleeding into the subject.
 */
function sobelGradient(
  data: Uint8ClampedArray,
  width: number,
  height: number
): Float32Array {
  const total = width * height;
  const grad = new Float32Array(total);
  const luma = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    luma[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
  }
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      const tl = luma[i - width - 1];
      const tc = luma[i - width];
      const tr = luma[i - width + 1];
      const ml = luma[i - 1];
      const mr = luma[i + 1];
      const bl = luma[i + width - 1];
      const bc = luma[i + width];
      const br = luma[i + width + 1];
      const gx = (tr + 2 * mr + br) - (tl + 2 * ml + bl);
      const gy = (bl + 2 * bc + br) - (tl + 2 * tc + tr);
      grad[i] = Math.sqrt(gx * gx + gy * gy);
    }
  }
  return grad;
}

/**
 * Gradient-aware flood fill of the background from every border pixel.
 * Returns a binary mask (255 = subject keep, 0 = background) plus the
 * background pixel count. Iterative BFS with a flat queue.
 */
function floodFillMask(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  bg: BgEstimate
): { mask: Uint8ClampedArray; bgCount: number } {
  const total = width * height;
  const grad = sobelGradient(data, width, height);
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  // Edge pixels need a much closer color match; smooth pixels can use the
  // full adaptive threshold. Squared-space scaling of the threshold.
  const edgeThresholdSq = bg.thresholdSq * 0.35;

  const isBg = (idx: number, g: number) => {
    const i = idx * 4;
    const dr = data[i] - bg.r;
    const dg = data[i + 1] - bg.g;
    const db = data[i + 2] - bg.b;
    const tSq = g > bg.gradientGate ? edgeThresholdSq : bg.thresholdSq;
    return dr * dr + 2 * dg * dg + db * db <= tSq;
  };

  const push = (x: number, y: number) => {
    const idx = y * width + x;
    if (visited[idx]) return;
    if (!isBg(idx, grad[idx])) return;
    visited[idx] = 1;
    queue[tail++] = idx;
  };

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
    onProgress?.({ percent: 8, stage: "Analyzing background…" });
    const img = await loadImageData(blob);
    const { data, width, height } = img;
    const total = width * height;

    onProgress?.({ percent: 30, stage: "Estimating background color…" });
    const bg = estimateBackground(data, width, height);

    onProgress?.({ percent: 45, stage: "Segmenting subject…" });
    const { mask: mask1, bgCount: c1 } = floodFillMask(data, width, height, bg);

    let finalMask = mask1;
    const coverage = c1 / total;

    if (coverage > 0.97) {
      // The fill ate the whole image — the background estimate was too
      // aggressive (or the subject blends into the bg). Retry much tighter.
      onProgress?.({ percent: 55, stage: "Re-segmenting with tighter tolerance…" });
      finalMask = floodFillMask(data, width, height, {
        ...bg,
        thresholdSq: bg.thresholdSq * 0.3,
      }).mask;
    } else if (coverage < 0.04) {
      // The fill barely covered anything — the border estimate was wrong
      // (e.g. a heavily textured border). Loosen the threshold and gate.
      onProgress?.({ percent: 55, stage: "Re-segmenting with wider tolerance…" });
      finalMask = floodFillMask(data, width, height, {
        ...bg,
        thresholdSq: Math.min(1.2 * 255 * 255, bg.thresholdSq * 2.2),
        gradientGate: 140,
      }).mask;
    }

    onProgress?.({ percent: 75, stage: "Cleaning up artifacts…" });
    finalMask = await refineMaskInWorker(img, finalMask, {
      removeIslands: true,
      fillHoles: true,
      defringe: true,
      defringeStrength: 0.9,
      smooth: 1,
    });

    onProgress?.({ percent: 100, stage: "Done" });
    return {
      width,
      height,
      mask: finalMask,
      provider: this.label,
      usedFallback: true,
    };
  },
};
