/**
 * Watermark rendering utilities.
 *
 * Everything is expressed relative to `unit = min(width, height)`, so the
 * same settings render proportionally on a small preview canvas and a
 * full-resolution export canvas.
 */

export type WatermarkType = "text" | "image";

export type PositionPreset =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "custom";

export type WatermarkFormat = "image/png" | "image/jpeg" | "image/webp";

export interface TextSettings {
  text: string;
  fontFamily: string;
  /** Fraction of the image's min dimension (0.01–0.15) */
  fontSize: number;
  fontWeight: number;
  italic: boolean;
  color: string;
  /** "" = transparent (no pill background) */
  bgColor: string;
  /** Fraction of the font size (0–0.5) */
  letterSpacing: number;
  textShadow: boolean;
  textShadowColor: string;
  /** Fraction of the image's min dimension */
  textShadowBlur: number;
  outline: boolean;
  outlineColor: string;
  /** Fraction of the font size */
  outlineWidth: number;
  /** Fraction of the font size */
  padding: number;
}

export interface ImageSettings {
  /** Fraction of the image's min dimension (0.05–0.5) */
  logoScale: number;
  /** When off, a white backing box is drawn behind the logo */
  keepTransparency: boolean;
}

export interface WatermarkSettings {
  type: WatermarkType;
  text: TextSettings;
  image: ImageSettings;
  positionPreset: PositionPreset;
  /** Normalized center (0–1) used when positionPreset === "custom" */
  customX: number;
  customY: number;
  /** Fraction of the image's min dimension (0–0.2) */
  margin: number;
  /** Global size multiplier (0.5–2) */
  scale: number;
  /** Degrees, -180..180 */
  rotation: number;
  /** 0.05–1 */
  opacity: number;
  outputFormat: WatermarkFormat;
  quality: number;
  fileName: string;
}

export const WATERMARK_OUTPUT_FORMATS = [
  { label: "PNG", value: "image/png" as const },
  { label: "JPEG", value: "image/jpeg" as const },
  { label: "WEBP", value: "image/webp" as const },
];

export const FONT_WEIGHTS = [400, 500, 600, 700, 800, 900];

export const FONT_FAMILIES = [
  { label: "Sans Serif", value: "Arial, Helvetica, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Monospace", value: "'Courier New', Courier, monospace" },
  { label: "Impact", value: "Impact, 'Arial Black', sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Trebuchet", value: "'Trebuchet MS', 'Segoe UI', sans-serif" },
  { label: "Times", value: "'Times New Roman', Times, serif" },
  { label: "Cursive", value: "'Comic Sans MS', 'Chalkboard SE', cursive" },
  { label: "System UI", value: "system-ui, -apple-system, sans-serif" },
];

export const POSITION_PRESETS: { id: PositionPreset; label: string }[] = [
  { id: "top-left", label: "Top Left" },
  { id: "top-center", label: "Top Center" },
  { id: "top-right", label: "Top Right" },
  { id: "center", label: "Center" },
  { id: "bottom-left", label: "Bottom Left" },
  { id: "bottom-center", label: "Bottom Center" },
  { id: "bottom-right", label: "Bottom Right" },
];

export const DEFAULT_WATERMARK_SETTINGS: WatermarkSettings = {
  type: "text",
  text: {
    text: "© Your Brand",
    fontFamily: FONT_FAMILIES[0].value,
    fontSize: 0.06,
    fontWeight: 600,
    italic: false,
    color: "#FFFFFF",
    bgColor: "rgba(0, 0, 0, 0.55)",
    letterSpacing: 0.02,
    textShadow: true,
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowBlur: 0.01,
    outline: false,
    outlineColor: "#000000",
    outlineWidth: 0.06,
    padding: 0.28,
  },
  image: {
    logoScale: 0.15,
    keepTransparency: true,
  },
  positionPreset: "bottom-right",
  customX: 0.75,
  customY: 0.75,
  margin: 0.04,
  scale: 1,
  rotation: 0,
  opacity: 0.7,
  outputFormat: "image/png",
  quality: 0.92,
  fileName: "",
};

/** Load an image element from a URL. */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image from ${src}`));
    img.src = src;
  });
}

/** Fit natural dimensions into a max box, preserving aspect ratio. */
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

function fontString(settings: TextSettings, fontSizePx: number): string {
  const style = settings.italic ? "italic " : "";
  return `${style}${settings.fontWeight} ${fontSizePx}px ${settings.fontFamily}`;
}

interface TextMetrics {
  widths: number[];
  chars: string[];
  totalWidth: number;
}

/** Measure text width char-by-char so letter spacing works in every browser. */
function measureText(ctx: CanvasRenderingContext2D, text: string, spacingPx: number): TextMetrics {
  const chars = Array.from(text);
  const widths = chars.map((c) => ctx.measureText(c).width);
  const totalWidth =
    widths.reduce((a, b) => a + b, 0) + spacingPx * Math.max(0, chars.length - 1);
  return { widths, chars, totalWidth };
}

/** Draw text char-by-char honoring letter spacing. */
function drawSpacedText(
  ctx: CanvasRenderingContext2D,
  metrics: TextMetrics,
  startX: number,
  y: number,
  spacingPx: number,
  mode: "fill" | "stroke"
) {
  let x = startX;
  metrics.chars.forEach((char, i) => {
    if (mode === "fill") ctx.fillText(char, x, y);
    else ctx.strokeText(char, x, y);
    x += metrics.widths[i] + spacingPx;
  });
}

/** Rounded-rect path (manual for cross-browser support). */
function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/** Compute the center point of the watermark block for a given preset. */
function anchorPoint(
  preset: PositionPreset,
  customX: number,
  customY: number,
  marginPx: number,
  width: number,
  height: number,
  blockW: number,
  blockH: number
): { x: number; y: number } {
  let x: number;
  let y: number;
  switch (preset) {
    case "top-left":
      x = marginPx + blockW / 2;
      y = marginPx + blockH / 2;
      break;
    case "top-center":
      x = width / 2;
      y = marginPx + blockH / 2;
      break;
    case "top-right":
      x = width - marginPx - blockW / 2;
      y = marginPx + blockH / 2;
      break;
    case "center":
      x = width / 2;
      y = height / 2;
      break;
    case "bottom-left":
      x = marginPx + blockW / 2;
      y = height - marginPx - blockH / 2;
      break;
    case "bottom-center":
      x = width / 2;
      y = height - marginPx - blockH / 2;
      break;
    case "bottom-right":
      x = width - marginPx - blockW / 2;
      y = height - marginPx - blockH / 2;
      break;
    case "custom":
      x = customX * width;
      y = customY * height;
      break;
  }
  // Clamp so the block never leaves the canvas
  x = Math.max(blockW / 2, Math.min(width - blockW / 2, x));
  y = Math.max(blockH / 2, Math.min(height - blockH / 2, y));
  return { x, y };
}

/**
 * Render the base image plus the active watermark onto a canvas context.
 * `width`/`height` are the canvas output size (display size for preview,
 * natural size for export) — proportions stay identical.
 */
export function renderWatermarkedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  logo: HTMLImageElement | null,
  settings: WatermarkSettings,
  width: number,
  height: number
): void {
  // Base image (white backing for JPEG, which has no alpha)
  ctx.clearRect(0, 0, width, height);
  if (settings.outputFormat === "image/jpeg") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(img, 0, 0, width, height);

  const unit = Math.min(width, height);
  const scale = settings.scale;

  // --- Measure the watermark block -------------------------------------
  let blockW = 0;
  let blockH = 0;
  let metrics: TextMetrics | null = null;

  if (settings.type === "text") {
    const text = settings.text.text.trim();
    if (!text) return;
    const fontSizePx = settings.text.fontSize * unit * scale;
    ctx.save();
    ctx.font = fontString(settings.text, fontSizePx);
    const spacingPx = settings.text.letterSpacing * fontSizePx;
    metrics = measureText(ctx, text, spacingPx);
    const paddingPx = settings.text.padding * fontSizePx;
    blockW = metrics.totalWidth + paddingPx * 2;
    blockH = fontSizePx * 1.2 + paddingPx * 2;
    ctx.restore();
  } else if (settings.type === "image" && logo) {
    const logoH = settings.image.logoScale * unit * scale;
    const logoW = logoH * (logo.naturalWidth / Math.max(1, logo.naturalHeight));
    blockW = logoW;
    blockH = logoH;
  }

  if (blockW <= 0 || blockH <= 0) return;

  // --- Position + rotate ------------------------------------------------
  const marginPx = settings.margin * unit;
  const anchor = anchorPoint(
    settings.positionPreset,
    settings.customX,
    settings.customY,
    marginPx,
    width,
    height,
    blockW,
    blockH
  );

  ctx.save();
  ctx.globalAlpha = settings.opacity;
  ctx.translate(anchor.x, anchor.y);
  ctx.rotate((settings.rotation * Math.PI) / 180);

  if (settings.type === "text" && metrics) {
    const t = settings.text;
    const fontSizePx = t.fontSize * unit * scale;
    const x = -blockW / 2;
    const y = -blockH / 2;

    // Re-apply the measured font (the measure pass above ran inside save/restore)
    ctx.font = fontString(t, fontSizePx);
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";

    // Pill background
    if (t.bgColor) {
      ctx.fillStyle = t.bgColor;
      roundRectPath(ctx, x, y, blockW, blockH, blockH / 2);
      ctx.fill();
    }

    // Shadow
    if (t.textShadow) {
      ctx.shadowColor = t.textShadowColor;
      ctx.shadowBlur = t.textShadowBlur * unit * 2;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    const spacingPx = t.letterSpacing * fontSizePx;
    const startX = -metrics.totalWidth / 2;
    const textY = 0;

    // Outline beneath fill for a crisp edge — draw it WITHOUT the shadow so
    // outline + shadow together don't double up the glow.
    if (t.outline) {
      const savedShadowBlur = ctx.shadowBlur;
      ctx.shadowBlur = 0;
      ctx.strokeStyle = t.outlineColor;
      ctx.lineWidth = Math.max(1, t.outlineWidth * fontSizePx);
      ctx.lineJoin = "round";
      drawSpacedText(ctx, metrics, startX, textY, spacingPx, "stroke");
      ctx.shadowBlur = savedShadowBlur;
    }

    ctx.fillStyle = t.color;
    drawSpacedText(ctx, metrics, startX, textY, spacingPx, "fill");
  } else if (settings.type === "image" && logo) {
    // Optional white backing when transparency is not kept
    if (!settings.image.keepTransparency) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(-blockW / 2, -blockH / 2, blockW, blockH);
    }
    ctx.drawImage(logo, -blockW / 2, -blockH / 2, blockW, blockH);
  }

  ctx.restore();
}

/** Export a full-resolution watermarked image as a Blob. */
export async function renderWatermarkedBlob(
  img: HTMLImageElement,
  logo: HTMLImageElement | null,
  settings: WatermarkSettings,
  width: number,
  height: number
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas 2D context");
  renderWatermarkedImage(ctx, img, logo, settings, width, height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate image blob"));
      },
      settings.outputFormat,
      settings.quality
    );
  });
}

/** File extension for a watermark output format. */
export function watermarkExt(format: WatermarkFormat): string {
  if (format === "image/jpeg") return "jpg";
  if (format === "image/webp") return "webp";
  return "png";
}
