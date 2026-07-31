/**
 * Signature Resizer — core logic.
 *
 * Signatures are usually transparent PNGs that need to fit specific pixel
 * boxes (e.g. 500×200) and file-size limits (e.g. 20 KB for e-sign platforms).
 * Everything runs on an offscreen canvas in the browser:
 *  - the signature is contain-fitted and centered inside the target box,
 *  - PNG keeps transparency, JPG fills white,
 *  - a target-KB mode iterates quality (JPG) or downscales (PNG) until the
 *    exported file fits the limit.
 */

export type SignatureFormat = "image/png" | "image/jpeg";

export interface SignatureSize {
  id: string;
  label: string;
  width: number;
  height: number;
}

export const SIGNATURE_SIZES: SignatureSize[] = [
  { id: "s300x100", label: "300 × 100 px", width: 300, height: 100 },
  { id: "s400x150", label: "400 × 150 px", width: 400, height: 150 },
  { id: "s500x200", label: "500 × 200 px", width: 500, height: 200 },
  { id: "s800x250", label: "800 × 250 px", width: 800, height: 250 },
  { id: "s1000x300", label: "1000 × 300 px", width: 1000, height: 300 },
];

/** Common signature file-size limits (KB). "No limit" = 0. */
export const KB_TARGETS = [0, 20, 50, 100, 200];

export interface SignatureSettings {
  size: SignatureSize;
  targetKb: number;
  format: SignatureFormat;
  quality: number;
  fileName: string;
}

export const DEFAULT_SIGNATURE_SETTINGS: SignatureSettings = {
  size: SIGNATURE_SIZES[2],
  targetKb: 0,
  format: "image/png",
  quality: 0.92,
  fileName: "",
};

/** Contain-fit + center an image inside a target canvas. */
export function renderSignatureToCanvas(
  img: HTMLImageElement,
  width: number,
  height: number,
  format: SignatureFormat
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is not available");

  ctx.clearRect(0, 0, width, height);
  if (format === "image/jpeg") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
  }

  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = Math.min(width / iw, height / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh);
  return canvas;
}

/** Canvas → Blob at the given format/quality. */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: SignatureFormat,
  quality = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate image blob"));
      },
      format,
      format === "image/jpeg" ? quality : undefined
    );
  });
}

function scaledCanvas(source: HTMLCanvasElement, scale: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(source.width * scale));
  canvas.height = Math.max(1, Math.round(source.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return source;
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/**
 * Shrink the export until it fits a target KB limit.
 * JPG: lower quality first, then downscale. PNG: downscale only.
 * Returns the last (smallest) blob even if the limit can't be reached.
 */
export async function fitToTargetKb(
  canvas: HTMLCanvasElement,
  format: SignatureFormat,
  targetKb: number,
  startQuality: number
): Promise<Blob> {
  const targetBytes = targetKb * 1024;
  if (targetKb <= 0) return canvasToBlob(canvas, format, startQuality);

  if (format === "image/jpeg") {
    let quality = Math.min(1, startQuality);
    while (quality > 0.08) {
      const blob = await canvasToBlob(canvas, "image/jpeg", quality);
      if (blob.size <= targetBytes) return blob;
      quality -= 0.05;
    }
    // Still too large — shrink dimensions
    for (const scale of [0.8, 0.64, 0.5, 0.38, 0.3]) {
      const blob = await canvasToBlob(scaledCanvas(canvas, scale), "image/jpeg", 0.55);
      if (blob.size <= targetBytes) return blob;
    }
    return canvasToBlob(scaledCanvas(canvas, 0.3), "image/jpeg", 0.5);
  }

  // PNG — reduce dimensions until it fits
  let last = await canvasToBlob(canvas, "image/png");
  for (const scale of [0.8, 0.64, 0.5, 0.38, 0.3]) {
    const next = scaledCanvas(canvas, scale);
    const blob = await canvasToBlob(next, "image/png");
    if (blob.size <= targetBytes) return blob;
    last = blob;
  }
  return last;
}

/** File extension for an output format. */
export function signatureExt(format: SignatureFormat): string {
  return format === "image/jpeg" ? "jpg" : "png";
}
