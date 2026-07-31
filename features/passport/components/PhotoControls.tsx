"use client";

import { Download, FileImage, Layers } from "lucide-react";
import { usePassportStore } from "@/store/passport-store";
import {
  BACKGROUND_COLORS,
  SHEET_PRESETS,
  sizePixels,
} from "@/features/passport/utils/passport";
import { cn } from "@/lib/utils";

/** Background color, output format, sheet size, and download actions. */
export function PhotoControls() {
  const size = usePassportStore((s) => s.size);
  const background = usePassportStore((s) => s.background);
  const setBackground = usePassportStore((s) => s.setBackground);
  const replaceWhite = usePassportStore((s) => s.replaceWhite);
  const setReplaceWhite = usePassportStore((s) => s.setReplaceWhite);
  const tolerance = usePassportStore((s) => s.tolerance);
  const setTolerance = usePassportStore((s) => s.setTolerance);
  const format = usePassportStore((s) => s.format);
  const setFormat = usePassportStore((s) => s.setFormat);
  const quality = usePassportStore((s) => s.quality);
  const setQuality = usePassportStore((s) => s.setQuality);
  const sheetId = usePassportStore((s) => s.sheetId);
  const setSheetId = usePassportStore((s) => s.setSheetId);
  const fileName = usePassportStore((s) => s.fileName);
  const setFileName = usePassportStore((s) => s.setFileName);
  const isProcessing = usePassportStore((s) => s.isProcessing);
  const resultSize = usePassportStore((s) => s.resultSize);
  const downloadSingle = usePassportStore((s) => s.downloadSingle);
  const downloadSheet = usePassportStore((s) => s.downloadSheet);

  const { width, height } = sizePixels(size);

  return (
    <div className="space-y-5">
      {/* Background */}
      <section>
        <div className="mb-2 flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">Background</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {BACKGROUND_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              title={color.label}
              aria-label={`Background ${color.label}`}
              aria-pressed={background === color.value}
              onClick={() => setBackground(color.value)}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
                background === color.value
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border"
              )}
              style={{ backgroundColor: color.value }}
            />
          ))}
          <label
            className="relative h-8 w-8 cursor-pointer overflow-hidden rounded-full border-2 border-border transition-transform hover:scale-110"
            title="Custom color"
            aria-label="Custom background color"
          >
            <span className="absolute inset-0 bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)]" />
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
        </div>

        <label className="mt-3 flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            checked={replaceWhite}
            onChange={(e) => setReplaceWhite(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-primary"
          />
          <span>
            <span className="block text-xs font-medium text-text-secondary">
              Recolor near-white background
            </span>
            <span className="block text-[11px] text-text-muted">
              Turns a white selfie background into the chosen color (best for clean studio shots)
            </span>
          </span>
        </label>

        {replaceWhite && (
          <div className="mt-2 pl-6">
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="passport-tolerance" className="text-xs text-text-secondary">
                Tolerance
              </label>
              <span className="text-xs font-medium text-text-primary">{tolerance}</span>
            </div>
            <input
              id="passport-tolerance"
              type="range"
              min={0}
              max={30}
              step={1}
              value={tolerance}
              onChange={(e) => setTolerance(Number.parseInt(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
            />
          </div>
        )}
      </section>

      {/* Output */}
      <section>
        <div className="mb-2 flex items-center gap-2">
          <FileImage className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">Output</h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { value: "image/jpeg", label: "JPG" },
              { value: "image/png", label: "PNG" },
            ] as const
          ).map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFormat(f.value)}
              aria-pressed={format === f.value}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                format === f.value
                  ? "border-primary bg-primary-light text-primary"
                  : "border-border bg-background text-text-secondary hover:border-primary/50"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="passport-quality" className="text-xs text-text-secondary">
              Quality
            </label>
            <span className="text-xs font-medium text-text-primary">
              {format === "image/jpeg" ? `${Math.round(quality * 100)}%` : "Lossless"}
            </span>
          </div>
          <input
            id="passport-quality"
            type="range"
            min={0.5}
            max={1}
            step={0.01}
            value={quality}
            disabled={format === "image/png"}
            onChange={(e) => setQuality(Number.parseFloat(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary disabled:cursor-not-allowed disabled:opacity-40"
          />
        </div>

        <div className="mt-3">
          <label htmlFor="passport-filename" className="mb-1 block text-xs text-text-secondary">
            File name
          </label>
          <input
            id="passport-filename"
            type="text"
            value={fileName}
            placeholder={`passport-${Math.round(size.widthMm)}x${Math.round(size.heightMm)}mm`}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </div>
      </section>

      {/* Print sheet */}
      <section>
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-text-primary">Print sheet</h3>
          <p className="text-[11px] text-text-muted">
            Multiple copies of your {width} × {height} px photo on one page
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {SHEET_PRESETS.map((sheet) => (
            <button
              key={sheet.id}
              type="button"
              onClick={() => setSheetId(sheet.id)}
              aria-pressed={sheetId === sheet.id}
              className={cn(
                "rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                sheetId === sheet.id
                  ? "border-primary bg-primary-light text-primary"
                  : "border-border bg-background text-text-secondary hover:border-primary/50"
              )}
            >
              {sheet.label}
            </button>
          ))}
        </div>
      </section>

      {/* Downloads */}
      <section className="space-y-2">
        <button
          type="button"
          onClick={downloadSingle}
          disabled={isProcessing}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {isProcessing ? "Generating…" : "Download Photo"}
        </button>
        <button
          type="button"
          onClick={downloadSheet}
          disabled={isProcessing}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-primary-light hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          Download Print Sheet
        </button>
        {resultSize > 0 && (
          <p className="text-center text-[11px] text-text-muted">
            Last download: {(resultSize / 1024).toFixed(1)} KB
          </p>
        )}
      </section>
    </div>
  );
}
