/**
 * Passport Photo Maker — core logic.
 *
 * All rendering happens on an offscreen canvas in the browser:
 *  - the photo is drawn "cover-fit" into the target frame (so it always fills
 *    the passport ratio) with a user-controlled zoom + pan,
 *  - the canvas is filled with the chosen background color first (so PNGs with
 *    transparency pick up the color automatically),
 *  - optionally, near-white pixels are recolored to the background color — the
 *    classic trick for turning a white selfie background into passport blue.
 */

export type PassportFormat = "image/jpeg" | "image/png";

export interface PassportPreset {
  id: string;
  label: string;
  detail: string;
  widthMm: number;
  heightMm: number;
  dpi: number;
  group: "Popular" | "Asia Pacific" | "Europe & Middle East" | "Africa";
}

/** Fully-resolved output size (a preset or a custom size). */
export interface PassportSize {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
  dpi: number;
}

export interface CropState {
  /** 1 = cover-fit, up to MAX_ZOOM. */
  zoom: number;
  /** Normalized horizontal offset, -1..1 (fraction of the visible window). */
  panX: number;
  /** Normalized vertical offset, -1..1. */
  panY: number;
}

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 6;
export const DEFAULT_CROP: CropState = { zoom: 1, panX: 0, panY: 0 };

export const PASSPORT_PRESETS: PassportPreset[] = [
  // Popular
  {
    id: "us",
    label: "United States",
    detail: "2 × 2 in · 51 × 51 mm",
    widthMm: 51,
    heightMm: 51,
    dpi: 300,
    group: "Popular",
  },
  {
    id: "india",
    label: "India",
    detail: "35 × 45 mm",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    group: "Popular",
  },
  {
    id: "uk",
    label: "United Kingdom",
    detail: "35 × 45 mm",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    group: "Popular",
  },
  {
    id: "canada",
    label: "Canada",
    detail: "50 × 70 mm",
    widthMm: 50,
    heightMm: 70,
    dpi: 300,
    group: "Popular",
  },
  {
    id: "australia",
    label: "Australia",
    detail: "35 × 45 mm",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    group: "Popular",
  },
  {
    id: "general-2x2",
    label: "2 × 2 in (General)",
    detail: "51 × 51 mm",
    widthMm: 51,
    heightMm: 51,
    dpi: 300,
    group: "Popular",
  },
  {
    id: "general-1x1",
    label: "1 × 1 in (ID Card)",
    detail: "25 × 25 mm",
    widthMm: 25,
    heightMm: 25,
    dpi: 300,
    group: "Popular",
  },
  // Asia Pacific
  {
    id: "china",
    label: "China",
    detail: "33 × 48 mm",
    widthMm: 33,
    heightMm: 48,
    dpi: 300,
    group: "Asia Pacific",
  },
  {
    id: "japan",
    label: "Japan",
    detail: "45 × 45 mm",
    widthMm: 45,
    heightMm: 45,
    dpi: 300,
    group: "Asia Pacific",
  },
  {
    id: "korea",
    label: "South Korea",
    detail: "35 × 45 mm",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    group: "Asia Pacific",
  },
  {
    id: "singapore",
    label: "Singapore",
    detail: "35 × 45 mm",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    group: "Asia Pacific",
  },
  {
    id: "malaysia",
    label: "Malaysia",
    detail: "35 × 50 mm",
    widthMm: 35,
    heightMm: 50,
    dpi: 300,
    group: "Asia Pacific",
  },
  {
    id: "indonesia",
    label: "Indonesia",
    detail: "40 × 60 mm",
    widthMm: 40,
    heightMm: 60,
    dpi: 300,
    group: "Asia Pacific",
  },
  {
    id: "hong-kong",
    label: "Hong Kong",
    detail: "40 × 50 mm",
    widthMm: 40,
    heightMm: 50,
    dpi: 300,
    group: "Asia Pacific",
  },
  {
    id: "philippines",
    label: "Philippines",
    detail: "35 × 45 mm",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    group: "Asia Pacific",
  },
  {
    id: "thailand",
    label: "Thailand",
    detail: "35 × 45 mm",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    group: "Asia Pacific",
  },
  {
    id: "vietnam",
    label: "Vietnam",
    detail: "40 × 60 mm",
    widthMm: 40,
    heightMm: 60,
    dpi: 300,
    group: "Asia Pacific",
  },
  {
    id: "sri-lanka",
    label: "Sri Lanka",
    detail: "35 × 45 mm",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    group: "Asia Pacific",
  },
  {
    id: "nepal",
    label: "Nepal",
    detail: "35 × 45 mm",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    group: "Asia Pacific",
  },
  {
    id: "bangladesh",
    label: "Bangladesh",
    detail: "35 × 45 mm",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    group: "Asia Pacific",
  },
  // Europe & Middle East
  {
    id: "schengen",
    label: "Schengen / Europe",
    detail: "35 × 45 mm",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    group: "Europe & Middle East",
  },
  {
    id: "uae",
    label: "United Arab Emirates",
    detail: "43 × 55 mm",
    widthMm: 43,
    heightMm: 55,
    dpi: 300,
    group: "Europe & Middle East",
  },
  {
    id: "qatar",
    label: "Qatar",
    detail: "35 × 45 mm",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    group: "Europe & Middle East",
  },
  {
    id: "israel",
    label: "Israel",
    detail: "50 × 50 mm",
    widthMm: 50,
    heightMm: 50,
    dpi: 300,
    group: "Europe & Middle East",
  },
  // Africa
  {
    id: "nigeria",
    label: "Nigeria",
    detail: "35 × 45 mm",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    group: "Africa",
  },
  {
    id: "south-africa",
    label: "South Africa",
    detail: "35 × 45 mm",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    group: "Africa",
  },
  {
    id: "kenya",
    label: "Kenya",
    detail: "35 × 45 mm",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    group: "Africa",
  },
];

export const PASSPORT_GROUPS: PassportPreset["group"][] = [
  "Popular",
  "Asia Pacific",
  "Europe & Middle East",
  "Africa",
];

/** Background colors commonly accepted for passport / ID photos. */
export const BACKGROUND_COLORS: { label: string; value: string }[] = [
  { label: "White", value: "#FFFFFF" },
  { label: "Light Gray", value: "#EDEDED" },
  { label: "Light Blue", value: "#D6E8F7" },
  { label: "Blue", value: "#438EDB" },
  { label: "Navy", value: "#24438F" },
  { label: "Red", value: "#C8102E" },
  { label: "Green", value: "#0F7B4D" },
];

export interface SheetPreset {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
}

/** Print-ready sheet sizes for multiple photos per page. */
export const SHEET_PRESETS: SheetPreset[] = [
  { id: "4x6", label: "4 × 6 in", widthMm: 152.4, heightMm: 101.6 },
  { id: "5x7", label: "5 × 7 in", widthMm: 177.8, heightMm: 127 },
  { id: "a4", label: "A4", widthMm: 297, heightMm: 210 },
];

export function mmToPx(mm: number, dpi: number): number {
  return Math.max(1, Math.round((mm / 25.4) * dpi));
}

/** Output pixel dimensions for a size at its DPI. */
export function sizePixels(size: PassportSize): { width: number; height: number } {
  return { width: mmToPx(size.widthMm, size.dpi), height: mmToPx(size.heightMm, size.dpi) };
}

export interface DrawGeom {
  dw: number;
  dh: number;
  x: number;
  y: number;
}

/**
 * Compute the draw rectangle for cover-fit + zoom + pan.
 * The image always covers the output rect; pan offsets are clamped so the
 * image edges never become visible inside the frame.
 */
export function computeDrawGeom(
  imgWidth: number,
  imgHeight: number,
  outWidth: number,
  outHeight: number,
  crop: CropState
): DrawGeom {
  const cover = Math.max(outWidth / imgWidth, outHeight / imgHeight);
  const drawScale = cover * crop.zoom;
  const dw = imgWidth * drawScale;
  const dh = imgHeight * drawScale;
  const maxDx = Math.max(0, (dw - outWidth) / 2);
  const maxDy = Math.max(0, (dh - outHeight) / 2);
  const x = (outWidth - dw) / 2 - crop.panX * maxDx;
  const y = (outHeight - dh) / 2 - crop.panY * maxDy;
  return { dw, dh, x, y };
}

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = Number.parseInt(full, 16);
  if (Number.isNaN(num)) return [255, 255, 255];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export interface BackgroundOptions {
  background: string;
  /** Recolor near-white pixels toward the background color. */
  replaceWhite: boolean;
  /** 0–30 — higher replaces more off-white pixels. */
  tolerance: number;
}

/**
 * Recolor near-white pixels inside a canvas region toward a target color,
 * with a soft blend zone so edges stay smooth (no harsh cutouts).
 */
function applyBackgroundReplace(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  background: string,
  tolerance: number
): void {
  const imageData = ctx.getImageData(x, y, w, h);
  const data = imageData.data;
  const [br, bg, bb] = hexToRgb(background);
  const hard = 255 - tolerance;
  const soft = hard - 8;
  for (let i = 0; i < data.length; i += 4) {
    const min = Math.min(data[i], data[i + 1], data[i + 2]);
    if (min >= hard) {
      data[i] = br;
      data[i + 1] = bg;
      data[i + 2] = bb;
    } else if (min > soft) {
      const t = (min - soft) / (hard - soft);
      data[i] = Math.round(br * t + data[i] * (1 - t));
      data[i + 1] = Math.round(bg * t + data[i + 1] * (1 - t));
      data[i + 2] = Math.round(bb * t + data[i + 2] * (1 - t));
    }
  }
  ctx.putImageData(imageData, x, y);
}

/** Draw one passport photo into a rect, filling the background first. */
function drawPhoto(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  crop: CropState,
  opts: BackgroundOptions
): void {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  ctx.fillStyle = opts.background;
  ctx.fillRect(x, y, w, h);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const g = computeDrawGeom(img.naturalWidth, img.naturalHeight, w, h, crop);
  ctx.drawImage(img, x + g.x, y + g.y, g.dw, g.dh);

  if (opts.replaceWhite) {
    applyBackgroundReplace(ctx, x, y, w, h, opts.background, opts.tolerance);
  }
  ctx.restore();
}

/** Render a single passport photo at its exact output pixel size. */
export function renderPassportToCanvas(
  img: HTMLImageElement,
  width: number,
  height: number,
  crop: CropState,
  opts: BackgroundOptions
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is not available");
  drawPhoto(ctx, img, 0, 0, width, height, crop, opts);
  return canvas;
}

/** Render a print-ready sheet (4×6, 5×7, A4) with a grid of photos. */
export function renderSheetToCanvas(
  img: HTMLImageElement,
  size: PassportSize,
  crop: CropState,
  sheet: SheetPreset,
  opts: BackgroundOptions
): HTMLCanvasElement {
  const dpi = Math.max(size.dpi, 150);
  const width = mmToPx(sheet.widthMm, dpi);
  const height = mmToPx(sheet.heightMm, dpi);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is not available");

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);

  const margin = mmToPx(6, dpi);
  const gap = mmToPx(3, dpi);
  const pw = mmToPx(size.widthMm, dpi);
  const ph = mmToPx(size.heightMm, dpi);

  const cols = Math.max(1, Math.floor((width - margin * 2 + gap) / (pw + gap)));
  const rows = Math.max(1, Math.floor((height - margin * 2 + gap) / (ph + gap)));

  const gridW = cols * pw + (cols - 1) * gap;
  const gridH = rows * ph + (rows - 1) * gap;
  const startX = (width - gridW) / 2;
  const startY = (height - gridH) / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      drawPhoto(
        ctx,
        img,
        startX + c * (pw + gap),
        startY + r * (ph + gap),
        pw,
        ph,
        crop,
        opts
      );
    }
  }
  return canvas;
}

/** Canvas → Blob, resolving the output format + quality. */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: PassportFormat,
  quality: number
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

/** File extension for a passport output format. */
export function passportExt(format: PassportFormat): string {
  return format === "image/jpeg" ? "jpg" : "png";
}

/** Default file name for a passport export. */
export function passportBaseName(size: PassportSize): string {
  const w = Math.round(size.widthMm);
  const h = Math.round(size.heightMm);
  return `passport-${w}x${h}mm-${size.id}`;
}
