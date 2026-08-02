import { zip } from "fflate";
import type { BackgroundSettings } from "./compose";
import { composeImage } from "./compose";
import type { AdjustmentSettings } from "./adjustments";

export type ExportFormat = "png-transparent" | "png-colored" | "jpeg" | "webp";

/**
 * Export resolution: "optimized" reuses the working copy (≤2048px, fast);
 * "original" upscales the mask back to the source file's full resolution.
 */
export type ExportResolution = "optimized" | "original";

export interface ExportSettings {
  format: ExportFormat;
  /** 0.1–1 for lossy formats */
  quality: number;
  fileName: string;
  resolution: ExportResolution;
}

export const DEFAULT_EXPORT: ExportSettings = {
  format: "png-transparent",
  quality: 0.92,
  fileName: "",
  resolution: "optimized",
};

export function exportLabel(format: ExportFormat): string {
  switch (format) {
    case "png-transparent":
      return "PNG (Transparent)";
    case "png-colored":
      return "PNG (Colored BG)";
    case "jpeg":
      return "JPG";
    case "webp":
      return "WEBP";
  }
}

export function exportExt(format: ExportFormat): string {
  switch (format) {
    case "jpeg":
      return "jpg";
    case "webp":
      return "webp";
    default:
      return "png";
  }
}

/**
 * Render the final image for a given export format and produce a Blob.
 * - png-transparent: cutout on a transparent canvas (no background)
 * - everything else: composed on the current background
 */
export async function renderExportBlob(
  img: HTMLImageElement,
  mask: Uint8ClampedArray,
  background: BackgroundSettings,
  adjustments: AdjustmentSettings,
  bgImage: HTMLImageElement | null,
  width: number,
  height: number,
  exportSettings: ExportSettings
): Promise<Blob> {
  // JPEG has no alpha channel — transparent backgrounds must be coerced to
  // white or the canvas encoder fills them black.
  const effectiveBg: BackgroundSettings =
    exportSettings.format === "png-transparent"
      ? { ...background, type: "transparent" }
      : exportSettings.format === "jpeg" && background.type === "transparent"
        ? { ...background, type: "color", color: "#ffffff" }
        : background;

  const canvas = composeImage(
    img,
    mask,
    effectiveBg,
    adjustments,
    width,
    height,
    bgImage
  );

  const mime =
    exportSettings.format === "jpeg"
      ? "image/jpeg"
      : exportSettings.format === "webp"
        ? "image/webp"
        : "image/png";

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate the image blob"));
      },
      mime,
      exportSettings.quality
    );
  });
}

/** Trigger a browser download for a Blob. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Build a ZIP archive from a map of file names → Blobs. */
export async function createZip(
  files: { name: string; blob: Blob }[]
): Promise<Blob> {
  const entries: Record<string, Uint8Array> = {};
  for (const file of files) {
    const buffer = await file.blob.arrayBuffer();
    entries[file.name] = new Uint8Array(buffer);
  }
  // fflate's async callback API keeps the main thread free while packaging
  // large batches (level 0 = store-only, so it's fast and CPU-light).
  return new Promise<Blob>((resolve, reject) => {
    zip(entries, { level: 0 }, (err, zipped) => {
      if (err) reject(err);
      else resolve(new Blob([zipped], { type: "application/zip" }));
    });
  });
}

/** Strip the extension from a file name for clean output names. */
export function baseName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "");
}
