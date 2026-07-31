/**
 * Mask manipulation utilities. A "mask" is a flat Uint8ClampedArray of alpha
 * values (0–255) with `width * height` entries, 255 = subject (keep).
 */

/** Separable box blur (3 taps) on a flat alpha mask — used for smoothing/feather. */
export function blurMask(
  mask: Uint8ClampedArray,
  width: number,
  height: number,
  radius: number
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(mask.length);
  const tmp = new Uint8ClampedArray(mask.length);
  const r = Math.max(1, Math.round(radius));

  // Horizontal pass
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;
      for (let k = -r; k <= r; k++) {
        const nx = x + k;
        if (nx >= 0 && nx < width) {
          sum += mask[row + nx];
          count++;
        }
      }
      tmp[row + x] = sum / count;
    }
  }

  // Vertical pass
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;
      for (let k = -r; k <= r; k++) {
        const ny = y + k;
        if (ny >= 0 && ny < height) {
          sum += tmp[ny * width + x];
          count++;
        }
      }
      out[row + x] = sum / count;
    }
  }

  return out;
}

/** Hard threshold — cleans up semi-transparent fringe (edge cleanup). */
export function thresholdMask(
  mask: Uint8ClampedArray,
  threshold: number
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(mask.length);
  for (let i = 0; i < mask.length; i++) {
    out[i] = mask[i] >= threshold ? 255 : 0;
  }
  return out;
}

/**
 * In-place brush stamp: restore (adds alpha) or erase (removes alpha) with a
 * radial falloff controlled by hardness (0 = soft, 1 = hard edge).
 */
export function stampBrush(
  mask: Uint8ClampedArray,
  width: number,
  height: number,
  cx: number,
  cy: number,
  radius: number,
  hardness: number,
  mode: "restore" | "erase"
): void {
  const r = Math.max(1, radius);
  const r2 = r * r;
  const x0 = Math.max(0, Math.floor(cx - r));
  const x1 = Math.min(width - 1, Math.ceil(cx + r));
  const y0 = Math.max(0, Math.floor(cy - r));
  const y1 = Math.min(height - 1, Math.ceil(cy + r));

  for (let y = y0; y <= y1; y++) {
    const dy = y - cy;
    for (let x = x0; x <= x1; x++) {
      const dx = x - cx;
      const d2 = dx * dx + dy * dy;
      if (d2 > r2) continue;
      // Normalized distance 0 (center) → 1 (edge)
      const d = Math.sqrt(d2) / r;
      // Hardness maps to the curve exponent: hard = sharp cutoff, soft = smooth ramp
      const falloff = Math.pow(1 - d, 1 + (1 - hardness) * 3);
      const idx = y * width + x;
      if (mode === "restore") {
        mask[idx] = Math.max(mask[idx], Math.round(falloff * 255));
      } else {
        mask[idx] = Math.min(mask[idx], 255 - Math.round(falloff * 255));
      }
    }
  }
}

/** Fill the whole mask with a value (used for reset/clear). */
export function fillMask(
  mask: Uint8ClampedArray,
  value: number
): Uint8ClampedArray {
  mask.fill(value);
  return mask;
}
