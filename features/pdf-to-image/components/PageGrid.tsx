"use client";

import { Download, FolderArchive, Loader2 } from "lucide-react";
import { usePdfToImageStore } from "@/store/pdf-to-image-store";
import {
  PDF_SCALE_OPTIONS,
  pdfExportExt,
} from "@/features/pdf-to-image/utils/pdf";
import { cn } from "@/lib/utils";

/** Rendered page thumbnails + export settings + download actions. */
export function PageGrid() {
  const file = usePdfToImageStore((s) => s.file);
  const pages = usePdfToImageStore((s) => s.pages);
  const progress = usePdfToImageStore((s) => s.progress);
  const settings = usePdfToImageStore((s) => s.settings);
  const updateSettings = usePdfToImageStore((s) => s.updateSettings);
  const isExporting = usePdfToImageStore((s) => s.isExporting);
  const resultSize = usePdfToImageStore((s) => s.resultSize);
  const downloadPage = usePdfToImageStore((s) => s.downloadPage);
  const downloadAll = usePdfToImageStore((s) => s.downloadAll);

  const isRendering = progress !== null;
  const percent = progress ? Math.round((progress.done / Math.max(1, progress.total)) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* File bar */}
      {file && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-3 shadow-sm">
          <div className="min-w-0 truncate">
            <p className="truncate text-sm font-medium text-text-primary">{file.name}</p>
            <p className="text-xs text-text-muted">
              {pages.length > 0
                ? `${pages.length} page${pages.length === 1 ? "" : "s"} rendered`
                : (file.size / 1024 / 1024).toFixed(1) + " MB"}
            </p>
          </div>
          <input
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            id="pdf-change-file"
            onChange={(e) => {
              if (e.target.files?.[0]) usePdfToImageStore.getState().setFile(e.target.files[0]);
              e.target.value = "";
            }}
          />
          <label
            htmlFor="pdf-change-file"
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
          >
            Change
          </label>
        </div>
      )}

      {/* Export settings */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="grid gap-5 p-5 md:grid-cols-3">
          {/* Format */}
          <div>
            <p className="mb-2 text-xs font-medium text-text-secondary">Format</p>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { value: "image/png", label: "PNG" },
                  { value: "image/jpeg", label: "JPG" },
                ] as const
              ).map((format) => (
                <button
                  key={format.value}
                  type="button"
                  onClick={() => updateSettings({ format: format.value })}
                  aria-pressed={settings.format === format.value}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                    settings.format === format.value
                      ? "border-primary bg-primary-light text-primary"
                      : "border-border bg-background text-text-secondary hover:border-primary/50"
                  )}
                >
                  {format.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scale */}
          <div>
            <p className="mb-2 text-xs font-medium text-text-secondary">Resolution</p>
            <div className="grid grid-cols-5 gap-1.5">
              {PDF_SCALE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateSettings({ scale: option.value })}
                  aria-pressed={settings.scale === option.value}
                  title={option.label}
                  className={cn(
                    "rounded-lg border px-1 py-2 text-xs font-medium transition-colors",
                    settings.scale === option.value
                      ? "border-primary bg-primary-light text-primary"
                      : "border-border bg-background text-text-secondary hover:border-primary/50"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-text-muted">
              {Math.round(settings.scale * 72)} DPI · changes re-render the pages
            </p>
          </div>

          {/* Quality */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="pdf-image-quality" className="text-xs font-medium text-text-secondary">
                Quality
              </label>
              <span className="text-xs font-medium text-text-primary">
                {settings.format === "image/jpeg"
                  ? `${Math.round(settings.quality * 100)}%`
                  : "Lossless"}
              </span>
            </div>
            <input
              id="pdf-image-quality"
              type="range"
              min={0.5}
              max={1}
              step={0.01}
              value={settings.quality}
              disabled={settings.format === "image/png"}
              onChange={(e) => updateSettings({ quality: Number.parseFloat(e.target.value) })}
              className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary disabled:cursor-not-allowed disabled:opacity-40"
            />
            <div className="mt-2">
              <label htmlFor="pdf-image-name" className="mb-1 block text-[11px] text-text-muted">
                File name
              </label>
              <input
                id="pdf-image-name"
                type="text"
                value={settings.fileName}
                placeholder="pdf"
                onChange={(e) => updateSettings({ fileName: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Export actions */}
        <div className="flex flex-col gap-2 border-t border-border p-5 sm:flex-row">
          <button
            type="button"
            onClick={downloadAll}
            disabled={pages.length === 0 || isExporting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FolderArchive className="h-4 w-4" />
            )}
            {isExporting
              ? "Exporting…"
              : `Download All as ZIP (${pages.length})`}
          </button>
          {resultSize > 0 && (
            <p className="flex items-center text-[11px] text-text-muted">
              Last export: {(resultSize / 1024).toFixed(1)} KB
            </p>
          )}
        </div>
      </div>

      {/* Render progress */}
      {isRendering && (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-medium text-text-primary">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Rendering page {progress.done} of {progress.total}…
            </p>
            <span className="text-sm font-semibold text-primary">{percent}%</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all duration-200"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Page grid */}
      {pages.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {pages.map((page) => (
            <div
              key={page.index}
              className="group overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="relative flex aspect-[1/1.414] items-center justify-center overflow-hidden bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#f8fafc_0%_50%)] bg-[length:12px_12px] dark:bg-[repeating-conic-gradient(#334155_0%_25%,#1e293b_0%_50%)]">
                {page.thumbUrl ? (
                  <img
                    src={page.thumbUrl}
                    alt={page.label}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-text-muted">Preview unavailable</span>
                )}
              </div>
              <div className="flex items-center justify-between px-3 py-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-text-primary">{page.label}</p>
                  <p className="text-[10px] text-text-muted">
                    {page.width} × {page.height} px
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => downloadPage(page.index)}
                  disabled={isExporting}
                  aria-label={`Download ${page.label} as ${pdfExportExt(settings.format).toUpperCase()}`}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-primary-light hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
