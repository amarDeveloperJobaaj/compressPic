export type ConvertFormat = "image/jpeg" | "image/png" | "image/webp" | "image/avif";

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
 * Detect whether the current browser can encode AVIF via the canvas API.
 * Browsers without support silently fall back to PNG, so we check the actual
 * output prefix instead of trusting the requested type.
 */
export function canEncodeAvif(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 2;
    return canvas.toDataURL("image/avif").startsWith("data:image/avif");
  } catch {
    return false;
  }
}

export interface ConvertResult {
  blob: Blob;
  dataUrl: string;
  size: number;
}

/**
 * Best-effort extraction of an SVG's intrinsic dimensions from its source.
 * SVGs often have no width/height attributes (only a viewBox, or neither), in
 * which case browsers report naturalWidth/naturalHeight as 0. Returns the
 * viewBox-derived size, or null when nothing usable is found.
 */
export function extractSvgSize(svgText: string): { width: number; height: number } | null {
  // width/height attributes (optional px units), in either attribute order
  const dimMatch = svgText.match(
    /<svg[^>]*\b(?:width=["']([\d.]+)(?:px)?["']|height=["']([\d.]+)(?:px)?["'])[^>]*\b(?:width=["']([\d.]+)(?:px)?["']|height=["']([\d.]+)(?:px)?["'])/i
  );
  if (dimMatch) {
    const width = Number.parseFloat(dimMatch[1] || dimMatch[3]);
    const height = Number.parseFloat(dimMatch[2] || dimMatch[4]);
    if (width > 0 && height > 0) return { width, height };
  }

  // fall back to viewBox="minX minY width height"
  const vbMatch = svgText.match(/viewBox=["']\s*([\d.+-]+)[\s,]+([\d.+-]+)[\s,]+([\d.+-]+)[\s,]+([\d.+-]+)["']/i);
  if (vbMatch) {
    const width = Number.parseFloat(vbMatch[3]);
    const height = Number.parseFloat(vbMatch[4]);
    if (width > 0 && height > 0) return { width, height };
  }

  return null;
}

/**
 * Re-encode an image into the requested format using the canvas API.
 * Returns both a data URL (for reliable preview) and a blob (for download).
 * Pass `size` for images without intrinsic dimensions (e.g. SVGs) or to
 * scale the output explicitly.
 */
export async function convertImage(
  src: string,
  format: ConvertFormat,
  quality: number,
  size?: { width: number; height: number } | null
): Promise<ConvertResult> {
  const img = await loadImage(src);

  const canvas = document.createElement("canvas");
  const width =
    size && size.width > 0 ? Math.round(size.width) : img.naturalWidth || 1;
  const height =
    size && size.height > 0 ? Math.round(size.height) : img.naturalHeight || 1;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas 2D context");

  // JPEG has no alpha channel — fill with white so transparency becomes white
  if (format === "image/jpeg") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0, width, height);

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

  // Browsers without AVIF encode silently produce a PNG blob — surface that
  // instead of returning a file with the wrong format.
  if (format === "image/avif" && blob.type !== "image/avif") {
    throw new Error("Your browser doesn't support AVIF encoding. Try WEBP or PNG instead.");
  }

  return { blob, dataUrl, size: blob.size };
}
