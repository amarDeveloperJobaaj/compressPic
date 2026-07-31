import { decodeHeicToJpeg, isHeicFile } from "./heic";

/**
 * Shared browser-side image loading helpers.
 *
 * Used by tool features that need to draw an uploaded file onto a canvas.
 * HEIC/HEIF (iPhone) files are decoded to JPEG automatically via lib/heic.
 */

/** Load an <img> element from a URL or object URL. */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

export interface LoadedImage {
  img: HTMLImageElement;
  /** Object URL of the (possibly decoded) file — caller revokes when done. */
  url: string;
  blob: Blob;
}

/**
 * Turn a File into a loaded <img> element plus an object URL.
 * HEIC/HEIF files are decoded to JPEG first. On failure the URL is revoked.
 */
export async function loadFileAsImage(file: File): Promise<LoadedImage> {
  let blob: Blob = file;
  if (isHeicFile(file)) {
    blob = await decodeHeicToJpeg(file);
  }
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    return { img, url, blob };
  } catch (err) {
    URL.revokeObjectURL(url);
    throw err;
  }
}

/** Revoke an object URL if set. */
export function revokeUrl(url: string | null): void {
  if (url) URL.revokeObjectURL(url);
}

/** Trigger a browser download of a Blob with the given file name. */
export function triggerDownload(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export interface CoverGeom {
  dw: number;
  dh: number;
  x: number;
  y: number;
  /** Max horizontal pan offset in output pixels (0 when the image just covers). */
  maxDx: number;
  maxDy: number;
}

/**
 * Cover-fit geometry with zoom + normalized pan for crop-style tools.
 * The image always covers the output rect; pan is clamped so image edges
 * never become visible inside the frame.
 */
export function computeCoverGeom(
  imgWidth: number,
  imgHeight: number,
  outWidth: number,
  outHeight: number,
  zoom: number,
  panX: number,
  panY: number
): CoverGeom {
  const cover = Math.max(outWidth / imgWidth, outHeight / imgHeight);
  const drawScale = cover * zoom;
  const dw = imgWidth * drawScale;
  const dh = imgHeight * drawScale;
  const maxDx = Math.max(0, (dw - outWidth) / 2);
  const maxDy = Math.max(0, (dh - outHeight) / 2);
  const x = (outWidth - dw) / 2 - panX * maxDx;
  const y = (outHeight - dh) / 2 - panY * maxDy;
  return { dw, dh, x, y, maxDx, maxDy };
}
