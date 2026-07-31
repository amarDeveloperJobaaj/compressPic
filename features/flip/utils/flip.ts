export interface FlipTransform {
  flipH: boolean;
  flipV: boolean;
  rotation: 0 | 90 | 180 | 270;
}

export const DEFAULT_TRANSFORM: FlipTransform = {
  flipH: false,
  flipV: false,
  rotation: 0,
};

/**
 * Load an image from a URL and return an HTMLImageElement.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image from ${src}`));
    img.src = src;
  });
}

/**
 * Compute the output canvas dimensions for a given rotation.
 * 90° and 270° swap width and height.
 */
export function getOutputSize(
  naturalWidth: number,
  naturalHeight: number,
  rotation: number
): { width: number; height: number } {
  const swapped = rotation === 90 || rotation === 270;
  return swapped
    ? { width: naturalHeight, height: naturalWidth }
    : { width: naturalWidth, height: naturalHeight };
}

export type FlipFormat = "image/jpeg" | "image/png" | "image/webp";

export interface FlipResult {
  blob: Blob;
  dataUrl: string;
  size: number;
}

/**
 * Apply flip (horizontal/vertical) and rotation to an image using the canvas API.
 * Returns both a data URL (for reliable preview) and a blob (for download).
 */
export async function applyFlipTransform(
  src: string,
  transform: FlipTransform,
  format: FlipFormat,
  quality: number
): Promise<FlipResult> {
  const img = await loadImage(src);

  const { width: outW, height: outH } = getOutputSize(
    img.naturalWidth,
    img.naturalHeight,
    transform.rotation
  );

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas 2D context");

  // White background for JPEG (no alpha channel)
  if (format === "image/jpeg") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, outW, outH);
  }

  // Order matters: rotate first, then flip in the rotated frame, so the
  // flip mirrors the image exactly as it is currently displayed.
  ctx.translate(outW / 2, outH / 2);
  ctx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);
  ctx.rotate((transform.rotation * Math.PI) / 180);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

  const dataUrl = canvas.toDataURL(format, quality);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Failed to generate image blob"));
      },
      format,
      quality
    );
  });

  return { blob, dataUrl, size: blob.size };
}
