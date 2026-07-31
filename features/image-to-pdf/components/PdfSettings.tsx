"use client";

import { FileText, Download } from "lucide-react";
import { useImageToPdfStore } from "@/store/image-to-pdf-store";
import {
  PDF_MARGINS,
  PDF_ORIENTATIONS,
  PDF_PAGE_SIZES,
} from "@/features/image-to-pdf/utils/pdf";
import { cn } from "@/lib/utils";

/** Page setup + generate controls for the Image to PDF tool. */
export function PdfSettings() {
  const items = useImageToPdfStore((s) => s.items);
  const settings = useImageToPdfStore((s) => s.settings);
  const updateSettings = useImageToPdfStore((s) => s.updateSettings);
  const isProcessing = useImageToPdfStore((s) => s.isProcessing);
  const resultSize = useImageToPdfStore((s) => s.resultSize);
  const generate = useImageToPdfStore((s) => s.generate);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        <FileText className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-text-primary">PDF Settings</h2>
      </div>

      <div className="space-y-5 p-5">
        {/* Page size */}
        <div>
          <p className="mb-2 text-xs font-medium text-text-secondary">Page size</p>
          <div className="grid grid-cols-4 gap-2">
            {PDF_PAGE_SIZES.map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => updateSettings({ pageSize: size.id })}
                aria-pressed={settings.pageSize === size.id}
                className={cn(
                  "rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                  settings.pageSize === size.id
                    ? "border-primary bg-primary-light text-primary"
                    : "border-border bg-background text-text-secondary hover:border-primary/50"
                )}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orientation */}
        <div>
          <p className="mb-2 text-xs font-medium text-text-secondary">Orientation</p>
          <div className="grid grid-cols-2 gap-2">
            {PDF_ORIENTATIONS.map((orientation) => (
              <button
                key={orientation.id}
                type="button"
                onClick={() => updateSettings({ orientation: orientation.id })}
                aria-pressed={settings.orientation === orientation.id}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                  settings.orientation === orientation.id
                    ? "border-primary bg-primary-light text-primary"
                    : "border-border bg-background text-text-secondary hover:border-primary/50"
                )}
              >
                {orientation.label}
              </button>
            ))}
          </div>
        </div>

        {/* Margins */}
        <div>
          <p className="mb-2 text-xs font-medium text-text-secondary">Margins</p>
          <div className="grid grid-cols-4 gap-2">
            {PDF_MARGINS.map((margin) => (
              <button
                key={margin.id}
                type="button"
                onClick={() => updateSettings({ margin: margin.id })}
                aria-pressed={settings.margin === margin.id}
                className={cn(
                  "rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                  settings.margin === margin.id
                    ? "border-primary bg-primary-light text-primary"
                    : "border-border bg-background text-text-secondary hover:border-primary/50"
                )}
              >
                {margin.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quality */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="pdf-quality" className="text-xs font-medium text-text-secondary">
              Image quality
            </label>
            <span className="text-xs font-medium text-text-primary">
              {Math.round(settings.quality * 100)}%
            </span>
          </div>
          <input
            id="pdf-quality"
            type="range"
            min={0.5}
            max={1}
            step={0.01}
            value={settings.quality}
            onChange={(e) => updateSettings({ quality: Number.parseFloat(e.target.value) })}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
          />
          <p className="mt-1 text-[11px] text-text-muted">
            Lower quality = smaller PDF file size.
          </p>
        </div>

        {/* File name */}
        <div>
          <label htmlFor="pdf-filename" className="mb-1 block text-xs font-medium text-text-secondary">
            File name
          </label>
          <input
            id="pdf-filename"
            type="text"
            value={settings.fileName}
            placeholder="images"
            onChange={(e) => updateSettings({ fileName: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </div>

        {/* Generate */}
        <button
          type="button"
          onClick={generate}
          disabled={isProcessing || items.length === 0 || items.some((item) => item.decoding)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {isProcessing
            ? "Generating PDF…"
            : items.some((item) => item.decoding)
              ? "Decoding images…"
              : items.length === 0
                ? "Add images first"
                : `Download PDF (${items.length} page${items.length === 1 ? "" : "s"})`}
        </button>

        {resultSize > 0 && (
          <p className="text-center text-[11px] text-text-muted">
            Last PDF: {(resultSize / 1024).toFixed(1)} KB
          </p>
        )}
      </div>
    </div>
  );
}
