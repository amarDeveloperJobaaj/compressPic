"use client";

import { Download } from "lucide-react";
import { useSocialResizerStore } from "@/store/social-resizer-store";
import { SOCIAL_OUTPUT_FORMATS } from "@/features/social-resizer/utils/social";
import { cn } from "@/lib/utils";

/** Output format, quality, filename, and download controls. */
export function ExportControls() {
  const settings = useSocialResizerStore((s) => s.settings);
  const setFormat = useSocialResizerStore((s) => s.setFormat);
  const setQuality = useSocialResizerStore((s) => s.setQuality);
  const setFileName = useSocialResizerStore((s) => s.setFileName);
  const isProcessing = useSocialResizerStore((s) => s.isProcessing);
  const resultSize = useSocialResizerStore((s) => s.resultSize);
  const download = useSocialResizerStore((s) => s.download);

  const preset = settings.preset;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold text-text-primary">Export</h2>
        <p className="text-[11px] text-text-muted">
          {preset.platform} · {preset.label} · {preset.width} × {preset.height} px
        </p>
      </div>

      <div className="space-y-5 p-5">
        {/* Format */}
        <div>
          <p className="mb-2 text-xs font-medium text-text-secondary">Format</p>
          <div className="grid grid-cols-3 gap-2">
            {SOCIAL_OUTPUT_FORMATS.map((format) => (
              <button
                key={format.value}
                type="button"
                onClick={() => setFormat(format.value)}
                aria-pressed={settings.format === format.value}
                className={cn(
                  "rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
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

        {/* Quality */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="social-quality" className="text-xs font-medium text-text-secondary">
              Quality
            </label>
            <span className="text-xs font-medium text-text-primary">
              {settings.format === "image/jpeg" || settings.format === "image/webp"
                ? `${Math.round(settings.quality * 100)}%`
                : "Lossless"}
            </span>
          </div>
          <input
            id="social-quality"
            type="range"
            min={0.5}
            max={1}
            step={0.01}
            value={settings.quality}
            disabled={settings.format === "image/png"}
            onChange={(e) => setQuality(Number.parseFloat(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary disabled:cursor-not-allowed disabled:opacity-40"
          />
        </div>

        {/* Filename */}
        <div>
          <label htmlFor="social-filename" className="mb-1 block text-xs font-medium text-text-secondary">
            File name
          </label>
          <input
            id="social-filename"
            type="text"
            value={settings.fileName}
            placeholder="my-image"
            onChange={(e) => setFileName(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </div>

        {/* Download */}
        <button
          type="button"
          onClick={download}
          disabled={isProcessing}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {isProcessing ? "Resizing…" : `Download ${preset.width} × ${preset.height}`}
        </button>

        {resultSize > 0 && (
          <p className="text-center text-[11px] text-text-muted">
            Last download: {(resultSize / 1024).toFixed(1)} KB
          </p>
        )}
      </div>
    </div>
  );
}
