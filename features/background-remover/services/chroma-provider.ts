import type { BackgroundRemovalProvider, ProgressCallback, RemovalResult } from "./types";

/**
 * Classical fallback provider — works fully offline and with no model
 * download. Estimates the background color from the image border and builds
 * a soft alpha mask from color distance. Great for product shots on solid
 * white/colored backgrounds; used automatically when the AI model cannot
 * be downloaded (e.g. offline or CDN blocked).
 */

interface BgEstimate {
  r: number;
  g: number;
  b: number;
  /** max allowed distance before a pixel is treated as fully foreground */
  threshold: number;
}

/** Average color of the pixels along the image border (the background). */
function estimateBackground(
  data: Uint8ClampedArray,
  width: number,
  height: number
): BgEstimate {
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  const sample = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  };

  const step = Math.max(1, Math.floor(Math.min(width, height) / 48));
  // Top / bottom edges
  for (let x = 0; x < width; x += step) {
    sample(x, 0);
    sample(x, height - 1);
  }
  // Left / right edges
  for (let y = 0; y < height; y += step) {
    sample(0, y);
    sample(width - 1, y);
  }

  const avgR = r / count;
  const avgG = g / count;
  const avgB = b / count;

  // Measure how spread out the border colors are to pick a sensible threshold
  let spread = 0;
  let n = 0;
  for (let i = 0; i < data.length; i += 4) {
    const dr = data[i] - avgR;
    const dg = data[i + 1] - avgG;
    const db = data[i + 2] - avgB;
    spread += Math.sqrt(dr * dr + dg * dg + db * db);
    n++;
  }
  const avgDist = n > 0 ? spread / n : 60;

  return {
    r: avgR,
    g: avgG,
    b: avgB,
    // Foreground usually differs from the bg color by a lot; use the border
    // variance scaled up so noise on the bg doesn't create holes.
    threshold: Math.max(48, avgDist * 3.2),
  };
}

export const chromaProvider: BackgroundRemovalProvider = {
  id: "chroma-fallback",
  label: "Classic (Solid Background)",

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

      onProgress?.({ percent: 35, stage: "Estimating background color…" });
      const bg = estimateBackground(imageData.data, width, height);

      onProgress?.({ percent: 55, stage: "Building alpha mask…" });
      const mask = new Uint8ClampedArray(width * height);
      const { data } = imageData;
      // Soft transition band so edges don't look like hard silhouettes
      const soft = Math.max(14, bg.threshold * 0.28);
      for (let i = 0; i < mask.length; i++) {
        const dr = data[i * 4] - bg.r;
        const dg = data[i * 4 + 1] - bg.g;
        const db = data[i * 4 + 2] - bg.b;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        if (dist >= bg.threshold) {
          mask[i] = 255;
        } else if (dist <= bg.threshold - soft) {
          mask[i] = 0;
        } else {
          // Smooth ramp between background and subject
          const t = (dist - (bg.threshold - soft)) / soft;
          mask[i] = Math.round(t * 255);
        }
      }

      onProgress?.({ percent: 100, stage: "Done" });
      return { width, height, mask, provider: this.label };
    } finally {
      URL.revokeObjectURL(url);
    }
  },
};
