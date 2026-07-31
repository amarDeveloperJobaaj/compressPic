import { applyAdjustments, isDefaultAdjustments, type AdjustmentSettings } from "./adjustments";

export type BackgroundType = "transparent" | "color" | "gradient" | "blur" | "image";

export interface BackgroundSettings {
  type: BackgroundType;
  /** Solid color (hex) for "color" + the first color of "gradient" */
  color: string;
  /** Second color for "gradient" */
  color2: string;
  /** 0 (top→bottom) … 360 rotation of the gradient axis */
  gradientAngle: number;
  /** Blur radius % of the shorter edge (1–15) for "blur" */
  blurAmount: number;
  /** Replacement image object URL for "image" */
  imageUrl: string | null;
}

export const DEFAULT_BACKGROUND: BackgroundSettings = {
  type: "transparent",
  color: "#ffffff",
  color2: "#6366f1",
  gradientAngle: 135,
  blurAmount: 6,
  imageUrl: null,
};

// Cache for the mask canvas so brush strokes don't reallocate per stamp.
let maskCanvasCache: HTMLCanvasElement | null = null;
let maskImageDataCache: ImageData | null = null;
let maskCacheW = 0;
let maskCacheH = 0;

/**
 * Turn a flat alpha mask into a canvas (RGB white, alpha = mask). Reuses a
 * cached canvas/ImageData when the size matches for brush-stroke speed.
 */
function maskToCanvas(
  mask: Uint8ClampedArray,
  width: number,
  height: number
): HTMLCanvasElement {
  if (!maskCanvasCache || maskCacheW !== width || maskCacheH !== height) {
    maskCanvasCache = document.createElement("canvas");
    maskCanvasCache.width = width;
    maskCanvasCache.height = height;
    maskImageDataCache = maskCanvasCache
      .getContext("2d")!
      .createImageData(width, height);
    maskCacheW = width;
    maskCacheH = height;
  }
  const data = maskImageDataCache!.data;
  for (let i = 0; i < mask.length; i++) {
    data[i * 4] = 255;
    data[i * 4 + 1] = 255;
    data[i * 4 + 2] = 255;
    data[i * 4 + 3] = mask[i];
  }
  maskCanvasCache!.getContext("2d")!.putImageData(maskImageDataCache!, 0, 0);
  return maskCanvasCache!;
}

/**
 * Compose the final image onto a canvas of the given size:
 *   1. Draw the background (transparent/color/gradient/blur/replacement image)
 *   2. Draw the cutout — original pixels masked by the alpha mask (GPU
 *      destination-in composite, fast enough for live brush previews)
 *   3. Apply image adjustments to the cutout
 *
 * Returns the canvas (caller owns it — reuses a provided canvas if given).
 */
export function composeImage(
  img: HTMLImageElement,
  mask: Uint8ClampedArray,
  background: BackgroundSettings,
  adjustments: AdjustmentSettings,
  width: number,
  height: number,
  bgImage: HTMLImageElement | null,
  canvas?: HTMLCanvasElement
): HTMLCanvasElement {
  const out = canvas ?? document.createElement("canvas");
  out.width = width;
  out.height = height;
  const ctx = out.getContext("2d");
  if (!ctx) return out;

  // 1. Background
  drawBackground(ctx, img, background, bgImage, width, height);

  // 2. Cutout (original masked by alpha)
  const cutout = document.createElement("canvas");
  cutout.width = width;
  cutout.height = height;
  const cctx = cutout.getContext("2d");
  if (cctx) {
    const maskCanvas = maskToCanvas(mask, width, height);
    cctx.drawImage(img, 0, 0, width, height);
    // Keep original RGB, set alpha from the mask (destination-in: dst kept
    // where src alpha overlaps — equivalent to multiplying alphas).
    cctx.globalCompositeOperation = "destination-in";
    cctx.drawImage(maskCanvas, 0, 0);
    cctx.globalCompositeOperation = "source-over";

    // 3. Adjustments (subject only)
    if (!isDefaultAdjustments(adjustments)) {
      const adjData = cctx.getImageData(0, 0, width, height);
      applyAdjustments(adjData, adjustments);
      cctx.putImageData(adjData, 0, 0);
    }

    ctx.drawImage(cutout, 0, 0);
  }

  return out;
}

/** Draw just the background layer (used for live previews). */
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  background: BackgroundSettings,
  bgImage: HTMLImageElement | null,
  width: number,
  height: number
): void {
  ctx.clearRect(0, 0, width, height);

  switch (background.type) {
    case "transparent":
      return;

    case "color":
      ctx.fillStyle = background.color;
      ctx.fillRect(0, 0, width, height);
      return;

    case "gradient": {
      const angle = (background.gradientAngle * Math.PI) / 180;
      const cx = width / 2;
      const cy = height / 2;
      const dx = Math.cos(angle) * width;
      const dy = Math.sin(angle) * height;
      const grad = ctx.createLinearGradient(cx - dx / 2, cy - dy / 2, cx + dx / 2, cy + dy / 2);
      grad.addColorStop(0, background.color);
      grad.addColorStop(1, background.color2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      return;
    }

    case "blur": {
      // Blurred, darkened copy of the original as the backdrop
      const radius = (background.blurAmount / 100) * Math.min(width, height);
      ctx.filter = `blur(${radius}px) brightness(0.55)`;
      ctx.drawImage(img, -radius, -radius, width + radius * 2, height + radius * 2);
      ctx.filter = "none";
      return;
    }

    case "image": {
      if (bgImage && bgImage.naturalWidth > 0) {
        // Cover-fit the replacement image
        const scale = Math.max(width / bgImage.naturalWidth, height / bgImage.naturalHeight);
        const w = bgImage.naturalWidth * scale;
        const h = bgImage.naturalHeight * scale;
        ctx.drawImage(bgImage, (width - w) / 2, (height - h) / 2, w, h);
      } else {
        ctx.fillStyle = background.color;
        ctx.fillRect(0, 0, width, height);
      }
      return;
    }
  }
}

/** Load an HTMLImageElement from a URL (object or data URL). */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

/** Fit natural dims into a max box preserving aspect ratio. */
export function fitSize(
  naturalWidth: number,
  naturalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const ratio = naturalWidth / naturalHeight;
  let width = maxWidth;
  let height = width / ratio;
  if (height > maxHeight) {
    height = maxHeight;
    width = height * ratio;
  }
  return { width: Math.max(1, Math.round(width)), height: Math.max(1, Math.round(height)) };
}

/** Cap a dimension pair to a maximum edge length, preserving aspect ratio. */
export function capSize(
  naturalWidth: number,
  naturalHeight: number,
  maxEdge: number
): { width: number; height: number } {
  const edge = Math.max(naturalWidth, naturalHeight);
  if (edge <= maxEdge) return { width: naturalWidth, height: naturalHeight };
  const scale = maxEdge / edge;
  return {
    width: Math.max(1, Math.round(naturalWidth * scale)),
    height: Math.max(1, Math.round(naturalHeight * scale)),
  };
}
