"use client";

import { Download, Ruler, Scale } from "lucide-react";
import { useSignatureResizerStore } from "@/store/signature-resizer-store";
import {
  KB_TARGETS,
  SIGNATURE_SIZES,
} from "@/features/signature-resizer/utils/signature";
import { cn } from "@/lib/utils";

/** Size presets, target KB, format, and download controls. */
export function SignatureControls() {
  const settings = useSignatureResizerStore((s) => s.settings);
  const updateSettings = useSignatureResizerStore((s) => s.updateSettings);
  const isProcessing = useSignatureResizerStore((s) => s.isProcessing);
  const resultSize = useSignatureResizerStore((s) => s.resultSize);
  const download = useSignatureResizerStore((s) => s.download);

  return (
    <div className="space-y-5">
      {/* Size presets */}
      <section>
        <div className="mb-2 flex items-center gap-2">
          <Ruler className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">Signature size</h3>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {SIGNATURE_SIZES.map((size) => (
            <button
              key={size.id}
              type="button"
              onClick={() => updateSettings({ size })}
              aria-pressed={settings.size.id === size.id}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors",
                settings.size.id === size.id
                  ? "border-primary bg-primary-light text-primary"
                  : "border-border bg-background text-text-secondary hover:border-primary/50"
              )}
            >
              {size.label}
            </button>
          ))}
        </div>
      </section>

      {/* Target KB */}
      <section>
        <div className="mb-2 flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">File size limit</h3>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {KB_TARGETS.map((kb) => (
            <button
              key={kb}
              type="button"
              onClick={() => updateSettings({ targetKb: kb })}
              aria-pressed={settings.targetKb === kb}
              className={cn(
                "rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                settings.targetKb === kb
                  ? "border-primary bg-primary-light text-primary"
                  : "border-border bg-background text-text-secondary hover:border-primary/50"
              )}
            >
              {kb === 0 ? "None" : `${kb} KB`}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-[11px] text-text-muted">
          Many e-signature platforms limit signature files to 20 or 50 KB.
        </p>
      </section>

      {/* Format */}
      <section>
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-text-primary">Format</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { value: "image/png", label: "PNG (transparent)" },
              { value: "image/jpeg", label: "JPG (white bg)" },
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

        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="signature-quality" className="text-xs text-text-secondary">
              Quality
            </label>
            <span className="text-xs font-medium text-text-primary">
              {settings.format === "image/jpeg" ? `${Math.round(settings.quality * 100)}%` : "Lossless"}
            </span>
          </div>
          <input
            id="signature-quality"
            type="range"
            min={0.5}
            max={1}
            step={0.01}
            value={settings.quality}
            disabled={settings.format === "image/png"}
            onChange={(e) => updateSettings({ quality: Number.parseFloat(e.target.value) })}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary disabled:cursor-not-allowed disabled:opacity-40"
          />
        </div>

        <div className="mt-3">
          <label htmlFor="signature-filename" className="mb-1 block text-xs text-text-secondary">
            File name
          </label>
          <input
            id="signature-filename"
            type="text"
            value={settings.fileName}
            placeholder="signature"
            onChange={(e) => updateSettings({ fileName: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </div>
      </section>

      {/* Download */}
      <button
        type="button"
        onClick={download}
        disabled={isProcessing}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Download className="h-4 w-4" />
        {isProcessing ? "Resizing…" : "Download Signature"}
      </button>

      {resultSize > 0 && (
        <p className="text-center text-[11px] text-text-muted">
          Last download: {(resultSize / 1024).toFixed(1)} KB
          {settings.targetKb > 0 && resultSize > settings.targetKb * 1024
            ? " (limit not fully reachable for this signature)"
            : ""}
        </p>
      )}
    </div>
  );
}
