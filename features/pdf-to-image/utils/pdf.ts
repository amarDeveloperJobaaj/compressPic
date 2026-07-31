/**
 * PDF → Image rendering.
 *
 * Uses pdfjs-dist (Mozilla) to rasterize PDF pages onto canvases, 100% in the
 * browser. The worker is bundled as a static asset (no runtime CDN dependency).
 * fflate is used for the "download all as ZIP" export.
 */

export type PdfExportFormat = "image/png" | "image/jpeg";

export interface PdfRenderSettings {
  /** Viewport scale — 1× = 72 DPI, 2× = 144 DPI, 3× = 216 DPI. */
  scale: number;
  format: PdfExportFormat;
  quality: number;
  fileName: string;
}

export const DEFAULT_PDF_RENDER_SETTINGS: PdfRenderSettings = {
  scale: 2,
  format: "image/png",
  quality: 0.92,
  fileName: "",
};

export const PDF_SCALE_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "1×" },
  { value: 1.5, label: "1.5×" },
  { value: 2, label: "2×" },
  { value: 3, label: "3×" },
  { value: 4, label: "4×" },
];

let pdfjsPromise: Promise<typeof import("pdfjs-dist")> | null = null;

/**
 * Lazily load pdf.js (client-only) and point it at the bundled worker asset.
 * The worker file is emitted by the bundler via the new URL() asset pattern.
 */
function getPdfJs(): Promise<typeof import("pdfjs-dist")> {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist")
      .then((mod) => {
        mod.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();
        return mod;
      })
      .catch((err) => {
        // Don't cache a rejected promise forever — allow retrying a transient failure
        pdfjsPromise = null;
        throw err;
      });
  }
  return pdfjsPromise;
}

export interface RenderedPdfPage {
  index: number;
  label: string;
  /** Full-resolution canvas at the chosen scale. */
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  /** Downscaled object URL for display. */
  thumbUrl: string;
}

/** Rasterize every page of a PDF onto canvases at the given scale. */
export async function renderPdfPages(
  file: File,
  scale: number,
  onProgress: (done: number, total: number) => void
): Promise<RenderedPdfPage[]> {
  const pdfjs = await getPdfJs();
  const data = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data });
  const pdf = await loadingTask.promise;

  const pages: RenderedPdfPage[] = [];
  try {
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.floor(viewport.width));
      canvas.height = Math.max(1, Math.floor(viewport.height));
      // pdf.js v6 prefers the `canvas` parameter (canvasContext is legacy-only)
      await page.render({ canvas, viewport }).promise;
      page.cleanup();

      pages.push({
        index: i - 1,
        label: `Page ${i}`,
        canvas,
        width: canvas.width,
        height: canvas.height,
        thumbUrl: createThumbUrl(canvas),
      });
      onProgress(i, pdf.numPages);
    }
  } finally {
    // destroy() lives on the loading task in pdf.js v6 (removed from the proxy)
    await loadingTask.destroy();
  }
  return pages;
}

/** Small object URL preview of a canvas (display only). */
function createThumbUrl(canvas: HTMLCanvasElement): string {
  const maxSide = 480;
  const scale = Math.min(1, maxSide / Math.max(canvas.width, canvas.height));
  const thumb = document.createElement("canvas");
  thumb.width = Math.max(1, Math.round(canvas.width * scale));
  thumb.height = Math.max(1, Math.round(canvas.height * scale));
  const ctx = thumb.getContext("2d");
  if (!ctx) return "";
  ctx.drawImage(canvas, 0, 0, thumb.width, thumb.height);
  try {
    return thumb.toDataURL("image/jpeg", 0.85);
  } catch {
    return "";
  }
}

/** Canvas → Blob at the given format and quality. */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: PdfExportFormat,
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

/** File extension for an export format. */
export function pdfExportExt(format: PdfExportFormat): string {
  return format === "image/jpeg" ? "jpg" : "png";
}

/** Build a ZIP archive of every page as an image. */
export async function pagesToZip(
  pages: RenderedPdfPage[],
  format: PdfExportFormat,
  quality: number,
  baseName: string
): Promise<Blob> {
  const { zip } = await import("fflate");

  const entries: Record<string, Uint8Array> = {};
  for (const page of pages) {
    const blob = await canvasToBlob(page.canvas, format, quality);
    const buf = new Uint8Array(await blob.arrayBuffer());
    entries[`${baseName}-${String(page.index + 1).padStart(2, "0")}.${pdfExportExt(format)}`] = buf;
  }

  return new Promise((resolve, reject) => {
    zip(entries, { level: 0 }, (err, zipped) => {
      if (err) reject(err);
      else resolve(new Blob([zipped], { type: "application/zip" }));
    });
  });
}
