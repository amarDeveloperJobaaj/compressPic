/**
 * Image → PDF generation.
 *
 * jsPDF is imported lazily so it never ships in the initial bundle and only
 * loads when the user actually generates a PDF. Images are re-encoded to JPEG
 * at the chosen quality (capped resolution) so the PDF stays sharp but small.
 * Everything runs in the browser — nothing is uploaded.
 */

export type PdfPageSizeId = "a4" | "letter" | "legal" | "a5";
export type PdfOrientation = "portrait" | "landscape";
export type PdfMarginId = "none" | "small" | "medium" | "large";

export interface PdfPageSize {
  id: PdfPageSizeId;
  label: string;
  widthMm: number;
  heightMm: number;
}

export const PDF_PAGE_SIZES: PdfPageSize[] = [
  { id: "a4", label: "A4", widthMm: 210, heightMm: 297 },
  { id: "letter", label: "Letter", widthMm: 215.9, heightMm: 279.4 },
  { id: "legal", label: "Legal", widthMm: 215.9, heightMm: 355.6 },
  { id: "a5", label: "A5", widthMm: 148, heightMm: 210 },
];

export const PDF_ORIENTATIONS: { id: PdfOrientation; label: string }[] = [
  { id: "portrait", label: "Portrait" },
  { id: "landscape", label: "Landscape" },
];

export const PDF_MARGINS: { id: PdfMarginId; label: string; mm: number }[] = [
  { id: "none", label: "None", mm: 0 },
  { id: "small", label: "Small", mm: 10 },
  { id: "medium", label: "Medium", mm: 20 },
  { id: "large", label: "Large", mm: 30 },
];

export interface PdfSettings {
  pageSize: PdfPageSizeId;
  orientation: PdfOrientation;
  margin: PdfMarginId;
  quality: number;
  fileName: string;
}

export const DEFAULT_PDF_SETTINGS: PdfSettings = {
  pageSize: "a4",
  orientation: "portrait",
  margin: "small",
  quality: 0.9,
  fileName: "",
};

export function effectivePageMm(
  size: PdfPageSize,
  orientation: PdfOrientation
): { width: number; height: number } {
  return orientation === "landscape"
    ? { width: size.heightMm, height: size.widthMm }
    : { width: size.widthMm, height: size.heightMm };
}

/** Re-encode an image as a JPEG data URL at the given quality (resolution capped). */
export function imageToJpegDataUrl(
  img: HTMLImageElement,
  quality: number,
  maxSide = 3000
): string {
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is not available");
  // JPEG has no alpha — fill white so transparent PNGs keep a clean look
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}

export interface PdfImageInput {
  name: string;
  img: HTMLImageElement;
}

/**
 * Build a PDF Blob from the given images — one page per image, each fitted
 * (contain) and centered inside the content box.
 */
export async function generatePdf(
  items: PdfImageInput[],
  settings: PdfSettings
): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const page = PDF_PAGE_SIZES.find((p) => p.id === settings.pageSize) ?? PDF_PAGE_SIZES[0];
  const { width, height } = effectivePageMm(page, settings.orientation);
  const marginMm = PDF_MARGINS.find((m) => m.id === settings.margin)?.mm ?? 10;
  const contentW = width - marginMm * 2;
  const contentH = height - marginMm * 2;

  const doc = new jsPDF({ unit: "mm", format: [width, height] });

  for (let i = 0; i < items.length; i++) {
    if (i > 0) doc.addPage([width, height], "portrait");
    const item = items[i];
    const dataUrl = imageToJpegDataUrl(item.img, settings.quality);
    const imgW = item.img.naturalWidth;
    const imgH = item.img.naturalHeight;
    const scale = Math.min(contentW / imgW, contentH / imgH);
    const dw = imgW * scale;
    const dh = imgH * scale;
    const x = marginMm + (contentW - dw) / 2;
    const y = marginMm + (contentH - dh) / 2;
    doc.addImage(dataUrl, "JPEG", x, y, dw, dh);
  }

  return doc.output("blob");
}
