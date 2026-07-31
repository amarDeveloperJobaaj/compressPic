"use client";

import { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  Type,
  Image as ImageIcon,
  Upload,
  Trash2,
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  CheckCircle2,
  FileImage,
} from "lucide-react";
import { useWatermarkStore } from "@/store/watermark-store";
import {
  FONT_FAMILIES,
  FONT_WEIGHTS,
  POSITION_PRESETS,
  WATERMARK_OUTPUT_FORMATS,
} from "@/features/watermark/utils/watermark";
import { formatFileSize } from "@/features/compressor/utils/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Small reusable control primitives                                   */
/* ------------------------------------------------------------------ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{children}</p>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-medium text-text-secondary">{label}</label>
        <span className="text-xs font-medium text-text-primary">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
      />
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs font-medium transition-all",
        checked
          ? "border-primary bg-primary-light text-primary"
          : "border-border bg-background text-text-secondary hover:border-primary/50"
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "relative h-4.5 w-8 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-border"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow transition-all",
            checked ? "left-4" : "left-0.5"
          )}
        />
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Main controls                                                       */
/* ------------------------------------------------------------------ */

export function WatermarkControls() {
  const originalFile = useWatermarkStore((s) => s.originalFile);
  const originalSize = useWatermarkStore((s) => s.originalSize);
  const settings = useWatermarkStore((s) => s.settings);
  const logoFile = useWatermarkStore((s) => s.logoFile);
  const logoPreviewUrl = useWatermarkStore((s) => s.logoPreviewUrl);
  const past = useWatermarkStore((s) => s.past);
  const future = useWatermarkStore((s) => s.future);
  const isProcessing = useWatermarkStore((s) => s.isProcessing);
  const resultSize = useWatermarkStore((s) => s.resultSize);

  const setLogoFile = useWatermarkStore((s) => s.setLogoFile);
  const updateSettings = useWatermarkStore((s) => s.updateSettings);
  const updateText = useWatermarkStore((s) => s.updateText);
  const updateImage = useWatermarkStore((s) => s.updateImage);
  const setType = useWatermarkStore((s) => s.setType);
  const setPositionPreset = useWatermarkStore((s) => s.setPositionPreset);
  const setOutputFormat = useWatermarkStore((s) => s.setOutputFormat);
  const setQuality = useWatermarkStore((s) => s.setQuality);
  const setFileName = useWatermarkStore((s) => s.setFileName);
  const resetSettings = useWatermarkStore((s) => s.resetSettings);
  const undo = useWatermarkStore((s) => s.undo);
  const redo = useWatermarkStore((s) => s.redo);
  const download = useWatermarkStore((s) => s.download);
  const reset = useWatermarkStore((s) => s.reset);

  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (!["image/png", "image/jpeg", "image/webp", "image/svg+xml"].includes(file.type)) {
          alert("Please upload a PNG, JPG, WEBP, or SVG logo.");
          return;
        }
        setLogoFile(file);
      }
      e.target.value = "";
    },
    [setLogoFile]
  );

  if (!originalFile) return null;

  const t = settings.text;
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;
  const isText = settings.type === "text";
  const hasResult = resultSize > 0;
  const lossy = settings.outputFormat !== "image/png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
    >
      {/* Success banner */}
      {hasResult && (
        <div className="flex items-center gap-3 bg-success-light px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-sm font-semibold text-success">Watermark Applied!</p>
            <p className="text-xs text-success/80">
              Your watermarked image is ready — {formatFileSize(resultSize)}.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-5 p-5">
        {/* Watermark type */}
        <div className="space-y-2">
          <SectionLabel>Watermark Type</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType("text")}
              disabled={isProcessing}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition-all",
                isText
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-background text-text-secondary hover:border-primary/50 hover:text-primary",
                isProcessing && "cursor-not-allowed opacity-50"
              )}
            >
              <Type className="h-5 w-5" />
              Text
            </button>
            <button
              type="button"
              onClick={() => setType("image")}
              disabled={isProcessing || !logoFile}
              title={!logoFile ? "Upload a logo first" : undefined}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition-all",
                !isText
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-background text-text-secondary hover:border-primary/50 hover:text-primary",
                (isProcessing || !logoFile) && "cursor-not-allowed opacity-50"
              )}
            >
              <ImageIcon className="h-5 w-5" />
              Logo
            </button>
          </div>
        </div>

        {/* Text watermark settings */}
        {isText && (
          <div className="space-y-4">
            <div className="space-y-2">
              <SectionLabel>Text</SectionLabel>
              <input
                type="text"
                value={t.text}
                onChange={(e) => updateText({ text: e.target.value })}
                maxLength={120}
                placeholder="© Your Brand"
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Font Family
                </label>
                <select
                  value={t.fontFamily}
                  onChange={(e) => updateText({ fontFamily: e.target.value })}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {FONT_FAMILIES.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Font Weight
                </label>
                <select
                  value={t.fontWeight}
                  onChange={(e) => updateText({ fontWeight: Number(e.target.value) })}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {FONT_WEIGHTS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Slider
              label="Font Size"
              value={Math.round(t.fontSize * 1000)}
              min={10}
              max={150}
              step={1}
              onChange={(v) => updateText({ fontSize: v / 1000 })}
              format={(v) => `${(v / 1000).toFixed(2)}×`}
            />

            <div className="grid grid-cols-3 gap-2">
              <ToggleRow label="Italic" checked={t.italic} onChange={(v) => updateText({ italic: v })} />
              <ToggleRow label="Shadow" checked={t.textShadow} onChange={(v) => updateText({ textShadow: v })} />
              <ToggleRow label="Outline" checked={t.outline} onChange={(v) => updateText({ outline: v })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Text Color</label>
                <div className="flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-3">
                  <input
                    type="color"
                    value={t.color}
                    onChange={(e) => updateText({ color: e.target.value })}
                    className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                    aria-label="Text color"
                  />
                  <span className="text-[10px] text-text-muted">{t.color}</span>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Background
                </label>
                <div className="flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-3">
                  <input
                    type="color"
                    value={t.bgColor.startsWith("#") ? t.bgColor : "#000000"}
                    onChange={(e) => updateText({ bgColor: e.target.value })}
                    className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                    aria-label="Background color"
                  />
                  <button
                    type="button"
                    onClick={() => updateText({ bgColor: t.bgColor ? "" : "#000000" })}
                    className={cn(
                      "ml-auto rounded-lg px-2 py-1 text-[10px] font-medium transition-colors",
                      t.bgColor
                        ? "bg-primary-light text-primary"
                        : "bg-background text-text-muted hover:text-primary"
                    )}
                  >
                    {t.bgColor ? "On" : "Off"}
                  </button>
                </div>
              </div>
            </div>

            {t.textShadow && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                    Shadow Color
                  </label>
                  <div className="flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-3">
                    <input
                      type="color"
                      value={t.textShadowColor}
                      onChange={(e) => updateText({ textShadowColor: e.target.value })}
                      className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                      aria-label="Shadow color"
                    />
                    <span className="text-[10px] text-text-muted">{t.textShadowColor}</span>
                  </div>
                </div>
                <Slider
                  label="Shadow Blur"
                  value={Math.round(t.textShadowBlur * 1000)}
                  min={0}
                  max={40}
                  step={1}
                  onChange={(v) => updateText({ textShadowBlur: v / 1000 })}
                  format={(v) => (v / 1000).toFixed(2)}
                />
              </div>
            )}

            {t.outline && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                    Outline Color
                  </label>
                  <div className="flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-3">
                    <input
                      type="color"
                      value={t.outlineColor}
                      onChange={(e) => updateText({ outlineColor: e.target.value })}
                      className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                      aria-label="Outline color"
                    />
                    <span className="text-[10px] text-text-muted">{t.outlineColor}</span>
                  </div>
                </div>
                <Slider
                  label="Outline Width"
                  value={Math.round(t.outlineWidth * 100)}
                  min={0}
                  max={30}
                  step={1}
                  onChange={(v) => updateText({ outlineWidth: v / 100 })}
                  format={(v) => `${(v / 100).toFixed(2)}`}
                />
              </div>
            )}

            <Slider
              label="Letter Spacing"
              value={Math.round(t.letterSpacing * 100)}
              min={0}
              max={50}
              step={1}
              onChange={(v) => updateText({ letterSpacing: v / 100 })}
              format={(v) => `${v}%`}
            />
            <Slider
              label="Padding"
              value={Math.round(t.padding * 100)}
              min={0}
              max={100}
              step={1}
              onChange={(v) => updateText({ padding: v / 100 })}
              format={(v) => `${v}%`}
            />
          </div>
        )}

        {/* Image watermark settings */}
        {!isText && (
          <div className="space-y-4">
            <div className="space-y-2">
              <SectionLabel>Logo</SectionLabel>
              <input
                ref={logoInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.svg"
                onChange={handleLogoChange}
                className="hidden"
                aria-hidden="true"
              />
              {logoPreviewUrl ? (
                <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoPreviewUrl}
                    alt="Logo preview"
                    className="h-12 w-12 rounded-lg bg-white object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-text-primary">{logoFile?.name}</p>
                    <p className="text-[10px] text-text-muted">{formatFileSize(logoFile?.size ?? 0)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLogoFile(null)}
                    disabled={isProcessing}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-error-light hover:text-error disabled:opacity-50"
                    aria-label="Remove logo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isProcessing}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background px-3 py-4 text-xs font-medium text-text-secondary transition-all hover:border-primary/50 hover:text-primary disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  Upload Logo
                </button>
              )}
            </div>

            <Slider
              label="Logo Size"
              value={Math.round(settings.image.logoScale * 100)}
              min={5}
              max={50}
              step={1}
              onChange={(v) => updateImage({ logoScale: v / 100 })}
              format={(v) => `${v}%`}
            />

            <ToggleRow
              label="Keep Transparency"
              checked={settings.image.keepTransparency}
              onChange={(v) => updateImage({ keepTransparency: v })}
            />
            <p className="text-[10px] leading-relaxed text-text-muted">
              Keep transparency preserves PNG logo alpha. Turn it off to add a white backing box.
            </p>
          </div>
        )}

        {/* Position */}
        <div className="space-y-3">
          <SectionLabel>Position</SectionLabel>
          <div className="grid grid-cols-4 gap-2">
            {POSITION_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setPositionPreset(preset.id)}
                disabled={isProcessing}
                className={cn(
                  "flex items-center justify-center rounded-lg border px-2 py-2 transition-all",
                  settings.positionPreset === preset.id
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-border bg-background text-text-muted hover:border-primary/50 hover:text-primary",
                  isProcessing && "cursor-not-allowed opacity-50"
                )}
                aria-label={`Position: ${preset.label}`}
                title={preset.label}
              >
                <span
                  className={cn(
                    "block h-3 w-3 rounded-sm",
                    settings.positionPreset === preset.id ? "bg-white" : "bg-current"
                  )}
                />
              </button>
            ))}
          </div>
          <p className="text-[10px] text-text-muted">
            Tip: drag the watermark directly on the preview for a custom position.
          </p>
        </div>

        {/* Advanced */}
        <div className="space-y-4">
          <SectionLabel>Advanced</SectionLabel>
          <Slider
            label="Margin"
            value={Math.round(settings.margin * 100)}
            min={0}
            max={20}
            step={1}
            onChange={(v) => updateSettings({ margin: v / 100 })}
            format={(v) => `${v}%`}
          />
          <Slider
            label="Scale"
            value={Math.round(settings.scale * 100)}
            min={50}
            max={200}
            step={5}
            onChange={(v) => updateSettings({ scale: v / 100 })}
            format={(v) => `${v}%`}
          />
          <Slider
            label="Rotation"
            value={settings.rotation}
            min={-180}
            max={180}
            step={1}
            onChange={(v) => updateSettings({ rotation: v })}
            format={(v) => `${v}°`}
          />
          <Slider
            label="Opacity"
            value={Math.round(settings.opacity * 100)}
            min={5}
            max={100}
            step={1}
            onChange={(v) => updateSettings({ opacity: v / 100 })}
            format={(v) => `${v}%`}
          />

          <div className="grid grid-cols-3 gap-2">
            <Button onClick={undo} disabled={!canUndo || isProcessing} variant="secondary" size="sm">
              <Undo2 className="h-3.5 w-3.5" />
              Undo
            </Button>
            <Button onClick={redo} disabled={!canRedo || isProcessing} variant="secondary" size="sm">
              <Redo2 className="h-3.5 w-3.5" />
              Redo
            </Button>
            <Button onClick={resetSettings} disabled={isProcessing} variant="ghost" size="sm">
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="rounded-xl bg-background p-3">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <FileImage className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium text-text-primary">Image Info</span>
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-text-muted">
            <span>Original: {formatFileSize(originalSize)}</span>
            {hasResult && <span>Exported: {formatFileSize(resultSize)}</span>}
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="space-y-4 border-t border-border px-5 py-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">Output Format</label>
          <div className="flex gap-1.5">
            {WATERMARK_OUTPUT_FORMATS.map((fmt) => (
              <button
                key={fmt.value}
                type="button"
                disabled={isProcessing}
                onClick={() => setOutputFormat(fmt.value)}
                className={cn(
                  "flex-1 rounded-lg border px-3 py-1.5 text-center text-xs font-medium transition-all",
                  settings.outputFormat === fmt.value
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-border bg-background text-text-secondary hover:border-primary/50 hover:text-primary",
                  isProcessing && "cursor-not-allowed opacity-50"
                )}
              >
                {fmt.label}
              </button>
            ))}
          </div>
        </div>

        {lossy && (
          <Slider
            label="Quality"
            value={Math.round(settings.quality * 100)}
            min={10}
            max={100}
            step={1}
            onChange={(v) => setQuality(v / 100)}
            format={(v) => `${v}%`}
          />
        )}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">File Name</label>
          <input
            type="text"
            value={settings.fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="my-watermarked-image"
            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={download}
            disabled={isProcessing || !originalFile}
            size="lg"
            className="w-full"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Exporting...
              </span>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download
              </>
            )}
          </Button>
          <Button onClick={reset} disabled={isProcessing} variant="ghost" size="lg" className="w-full">
            New Image
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
