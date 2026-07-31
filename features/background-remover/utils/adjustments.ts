/**
 * Image adjustment pipeline applied to the cutout (subject) pixels.
 * All adjustments run in a single pass over the RGBA data for speed.
 */

export interface AdjustmentSettings {
  /** -100..100 → multiplier (100 = 2× brightness) */
  brightness: number;
  /** -100..100 → 0..2 contrast factor */
  contrast: number;
  /** -100..100 → 0..2 saturation factor */
  saturation: number;
  /** 0..100 → unsharp amount */
  sharpness: number;
  /** -100..100 → exposure in stops */
  exposure: number;
  /** -100..100 → warm/cool */
  temperature: number;
  /** -100..100 → green/magenta */
  tint: number;
  /** 0.2..2.5 gamma */
  gamma: number;
  /** 0..100 percent */
  opacity: number;
}

export const DEFAULT_ADJUSTMENTS: AdjustmentSettings = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  sharpness: 0,
  exposure: 0,
  temperature: 0,
  tint: 0,
  gamma: 1,
  opacity: 100,
};

export function isDefaultAdjustments(adj: AdjustmentSettings): boolean {
  return (
    adj.brightness === 0 &&
    adj.contrast === 0 &&
    adj.saturation === 0 &&
    adj.sharpness === 0 &&
    adj.exposure === 0 &&
    adj.temperature === 0 &&
    adj.tint === 0 &&
    adj.gamma === 1 &&
    adj.opacity === 100
  );
}

function clamp(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

/**
 * Apply the full adjustment set to an RGBA ImageData in place.
 * Operates on a copy-safe basis: caller passes the working data.
 */
export function applyAdjustments(
  imageData: ImageData,
  adj: AdjustmentSettings
): ImageData {
  const { data, width, height } = imageData;

  const brightMul = 1 + adj.brightness / 100;
  const exposureMul = Math.pow(2, adj.exposure / 100);
  const contrastFactor = 1 + adj.contrast / 100;
  const saturationFactor = 1 + adj.saturation / 100;
  const tempShift = adj.temperature * 0.6;
  const tintShift = adj.tint * 0.6;
  const gammaInv = 1 / Math.max(0.2, adj.gamma);
  const alphaMul = adj.opacity / 100;
  const sharp = adj.sharpness / 100;

  // Unsharp mask — lightweight 3×3 blur on a copy, blended by sharpness.
  let src = data;
  let unsharp: Float32Array | null = null;
  if (sharp > 0) {
    unsharp = new Float32Array(data.length);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          let count = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const nx = x + kx;
              const ny = y + ky;
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                sum += data[(ny * width + nx) * 4 + c];
                count++;
              }
            }
          }
          const blur = sum / count;
          unsharp[i + c] = data[i + c] + (data[i + c] - blur) * sharp;
        }
      }
    }
    src = new Uint8ClampedArray(data.length);
    for (let i = 0; i < data.length; i++) src[i] = data[i];
  }

  for (let i = 0; i < data.length; i += 4) {
    let r = unsharp ? unsharp[i] : src[i];
    let g = unsharp ? unsharp[i + 1] : src[i + 1];
    let b = unsharp ? unsharp[i + 2] : src[i + 2];

    // Temperature / tint (additive)
    r += tempShift;
    b -= tempShift;
    g += tintShift;

    // Brightness × exposure (multiplicative)
    r *= brightMul * exposureMul;
    g *= brightMul * exposureMul;
    b *= brightMul * exposureMul;

    // Contrast
    r = (r - 128) * contrastFactor + 128;
    g = (g - 128) * contrastFactor + 128;
    b = (b - 128) * contrastFactor + 128;

    // Saturation
    if (saturationFactor !== 1) {
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      r = luma + (r - luma) * saturationFactor;
      g = luma + (g - luma) * saturationFactor;
      b = luma + (b - luma) * saturationFactor;
    }

    // Gamma
    r = 255 * Math.pow(Math.max(0, r) / 255, gammaInv);
    g = 255 * Math.pow(Math.max(0, g) / 255, gammaInv);
    b = 255 * Math.pow(Math.max(0, b) / 255, gammaInv);

    data[i] = clamp(r);
    data[i + 1] = clamp(g);
    data[i + 2] = clamp(b);
    data[i + 3] = clamp(data[i + 3] * alphaMul);
  }

  return imageData;
}
