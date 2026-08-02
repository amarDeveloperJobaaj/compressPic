/**
 * Advanced mask refinement pipeline — "AI-quality" edge finishing that runs
 * after ANY segmentation provider (the imgly neural network or the offline
 * fallback). This is what turns a rough binary cut into a clean, natural one:
 *
 *  1. removeIslands — connected-component analysis kills stray background
 *     specks floating on the subject and isolated subject flecks in the bg.
 *  2. fillHoles    — enclosed holes inside the subject (e.g. between hair
 *     strands, across glasses) are closed, because a closed hole is almost
 *     never intended as background.
 *  3. defringe     — color-aware alpha matting: at the boundary, pixels whose
 *     color matches the local background (halo / fringe) are pulled toward
 *     transparent, pixels matching the subject stay — this removes the
 *     gray/colored outline cheaply without a matting model.
 *  4. smoothEdge   — soft sigmoid remap of the edge band kills jaggies while
 *     keeping a natural anti-aliased transition (hair friendly).
 *
 * A "mask" is a flat Uint8ClampedArray of alpha values (0–255), 255 = subject.
 */

import { blurMask } from "./mask";

export interface RefinedImageData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

/** Perceptual-ish color distance (green channel weighted slightly more). */
function colorDist(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + 2 * dg * dg + db * db);
}

/**
 * Load an image's RGBA pixels from a URL or Blob. Used by the color-aware
 * stages (defringe) — safe to call from any provider.
 */
export async function loadImageData(src: string | Blob): Promise<RefinedImageData> {
  const url = typeof src === "string" ? src : URL.createObjectURL(src);
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
    return { data: ctx.getImageData(0, 0, width, height).data, width, height };
  } finally {
    if (typeof src !== "string") URL.revokeObjectURL(url);
  }
}

interface ComponentResult {
  label: Int32Array;
  sizes: number[];
  count: number;
}

/** BFS connected components (4-neighbour) for all pixels where `isSet`. */
function labelComponents(
  mask: Uint8ClampedArray,
  width: number,
  height: number,
  isSet: (v: number) => boolean
): ComponentResult {
  const total = width * height;
  const label = new Int32Array(total);
  label.fill(-1);
  const sizes: number[] = [];
  const queue = new Int32Array(total);
  let count = 0;

  for (let i = 0; i < total; i++) {
    if (label[i] !== -1 || !isSet(mask[i])) continue;
    const id = count++;
    sizes.push(0);
    let head = 0;
    let tail = 0;
    label[i] = id;
    queue[tail++] = i;
    while (head < tail) {
      const idx = queue[head++];
      sizes[id]++;
      const x = idx % width;
      const y = (idx / width) | 0;
      const tryPush = (n: number) => {
        if (label[n] === -1 && isSet(mask[n])) {
          label[n] = id;
          queue[tail++] = n;
        }
      };
      if (x > 0) tryPush(idx - 1);
      if (x < width - 1) tryPush(idx + 1);
      if (y > 0) tryPush(idx - width);
      if (y < height - 1) tryPush(idx + width);
    }
  }
  return { label, sizes, count };
}

/** Drop isolated components smaller than `minFraction` of the image. */
export function removeIslands(
  mask: Uint8ClampedArray,
  width: number,
  height: number,
  minFraction = 0.0002
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(mask);
  const total = width * height;
  const minSize = Math.max(8, Math.floor(total * minFraction));
  const { label, sizes } = labelComponents(mask, width, height, (v) => v >= 128);
  for (let i = 0; i < total; i++) {
    if (label[i] >= 0 && sizes[label[i]] < minSize) out[i] = 0;
  }
  return out;
}

/** Close enclosed holes inside the subject (holes never touch the image border). */
export function fillHoles(
  mask: Uint8ClampedArray,
  width: number,
  height: number,
  maxFraction = 0.05
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(mask);
  const total = width * height;
  const { label, sizes } = labelComponents(mask, width, height, (v) => v < 128);
  const touchesBorder = new Array<boolean>(sizes.length).fill(false);

  for (let x = 0; x < width; x++) {
    const t = label[x];
    const b = label[(height - 1) * width + x];
    if (t >= 0) touchesBorder[t] = true;
    if (b >= 0) touchesBorder[b] = true;
  }
  for (let y = 0; y < height; y++) {
    const l = label[y * width];
    const r = label[y * width + width - 1];
    if (l >= 0) touchesBorder[l] = true;
    if (r >= 0) touchesBorder[r] = true;
  }

  const maxHole = Math.max(64, Math.floor(total * maxFraction));
  for (let i = 0; i < total; i++) {
    if (label[i] >= 0 && !touchesBorder[label[i]] && sizes[label[i]] <= maxHole) {
      out[i] = 255;
    }
  }
  return out;
}

/**
 * Soften a hard-edged mask: blur the edge band, then remap with a smoothstep
 * curve so the core stays opaque and the rim gains a natural anti-aliased
 * falloff (kills jaggies without eating hair-like detail).
 */
export function smoothEdge(
  mask: Uint8ClampedArray,
  width: number,
  height: number,
  radius = 1
): Uint8ClampedArray {
  const blurred = blurMask(mask, width, height, radius);
  const out = new Uint8ClampedArray(mask.length);
  const lo = 55;
  const hi = 205;
  for (let i = 0; i < mask.length; i++) {
    const v = blurred[i];
    if (v <= lo) {
      out[i] = 0;
    } else if (v >= hi) {
      out[i] = 255;
    } else {
      const t = (v - lo) / (hi - lo);
      out[i] = Math.round((3 * t * t - 2 * t * t * t) * 255);
    }
  }
  return out;
}

/**
 * Color-aware alpha matting approximation (halo / fringe removal).
 *
 * For every boundary pixel (partial alpha) we compare its color against the
 * local background color (average of nearby fully-transparent pixels) and the
 * local foreground color (average of nearby opaque pixels). Pixels closer to
 * the background — the classic gray/colored halo around a cutout — are pulled
 * toward transparent; pixels closer to the subject stay opaque. `strength`
 * (0–1) blends the correction in so hair wisps aren't over-eroded.
 */
export function defringe(
  img: RefinedImageData,
  mask: Uint8ClampedArray,
  strength = 1,
  window = 3
): Uint8ClampedArray {
  const { data, width, height } = img;
  const out = new Uint8ClampedArray(mask);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const alpha = mask[i];
      if (alpha <= 0 || alpha >= 240) continue;

      let br = 0, bg = 0, bb = 0, bn = 0;
      let fr = 0, fg = 0, fb = 0, fn = 0;
      const x0 = Math.max(0, x - window);
      const x1 = Math.min(width - 1, x + window);
      const y0 = Math.max(0, y - window);
      const y1 = Math.min(height - 1, y + window);

      for (let ny = y0; ny <= y1; ny++) {
        const row = ny * width;
        for (let nx = x0; nx <= x1; nx++) {
          const ni = (row + nx) * 4;
          const na = mask[row + nx];
          if (na < 32) {
            br += data[ni];
            bg += data[ni + 1];
            bb += data[ni + 2];
            bn++;
          } else if (na > 223) {
            fr += data[ni];
            fg += data[ni + 1];
            fb += data[ni + 2];
            fn++;
          }
        }
      }

      // No background evidence nearby — this rim is interior. When there's
      // also no opaque foreground evidence (a hair wisp surrounded by soft
      // alpha), leave it untouched rather than forcing it opaque.
      if (bn === 0) {
        if (fn === 0) continue;
        out[i] = 255;
        continue;
      }

      const pr = br / bn;
      const pg = bg / bn;
      const pb = bb / bn;
      const dr = data[i * 4];
      const dg = data[i * 4 + 1];
      const db = data[i * 4 + 2];

      let p: number;
      if (fn === 0) {
        // Only background evidence (very thin hair): transparent when the
        // pixel matches the backdrop, otherwise keep it.
        const d = colorDist(dr, dg, db, pr, pg, pb);
        p = d > 150 ? 1 : 0.3;
      } else {
        const distBg = colorDist(dr, dg, db, pr, pg, pb);
        const distFg = colorDist(dr, dg, db, fr / fn, fg / fn, fb / fn);
        p = 1 / (1 + Math.exp((distBg - distFg) / 55));
      }

      out[i] = Math.round(alpha + (p * 255 - alpha) * strength);
    }
  }
  return out;
}

export interface RefineOptions {
  /** Drop isolated background specks / subject flecks. */
  removeIslands?: boolean;
  /** Minimum kept component size as a fraction of total pixels. */
  islandFraction?: number;
  /** Close enclosed holes inside the subject. */
  fillHoles?: boolean;
  /** Max hole size as a fraction of total pixels. */
  holeFraction?: number;
  /** Color-aware halo removal (needs the original image pixels). */
  defringe?: boolean;
  /** Defringe intensity 0–1. */
  defringeStrength?: number;
  /** Edge smoothing radius in px (0 = off). */
  smooth?: number;
}

/** Run the full refinement pipeline in order. */
export function refineMask(
  img: RefinedImageData,
  mask: Uint8ClampedArray,
  options: RefineOptions
): Uint8ClampedArray {
  // Note: `new Uint8ClampedArray(...)` yields an ArrayBuffer-backed array;
  // widen to the default generic so the pipeline steps' returns fit.
  let out: Uint8ClampedArray = new Uint8ClampedArray(new ArrayBuffer(mask.length));
  out.set(mask);
  if (options.removeIslands) {
    out = removeIslands(out, img.width, img.height, options.islandFraction);
  }
  if (options.fillHoles) {
    out = fillHoles(out, img.width, img.height, options.holeFraction);
  }
  if (options.defringe) {
    out = defringe(img, out, options.defringeStrength ?? 1);
  }
  if (options.smooth) {
    out = smoothEdge(out, img.width, img.height, options.smooth);
  }
  return out;
}
