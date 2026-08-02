"use client";

import { motion } from "framer-motion";
import { Download, FolderDown, Loader2, Copy, Check, MonitorUp } from "lucide-react";
import { useState } from "react";
import { useBackgroundRemoverStore } from "@/store/background-remover-store";
import { useToast } from "@/features/playground/components/Toast";
import type { ExportFormat, ExportResolution } from "@/features/background-remover/utils/export";
import { exportLabel, exportExt } from "@/features/background-remover/utils/export";
import { Slider } from "./Slider";
import { cn } from "@/lib/utils";

const FORMATS: ExportFormat[] = ["png-transparent", "png-colored", "jpeg", "webp"];

const RESOLUTIONS: { id: ExportResolution; label: string; desc: string }[] = [
  { id: "optimized", label: "Optimized", desc: "≤ 2048px, fast" },
  { id: "original", label: "Original", desc: "Up to 6000px" },
];

export function ExportPanel() {
  const exportSettings = useBackgroundRemoverStore((s) => s.exportSettings);
  const setExport = useBackgroundRemoverStore((s) => s.setExport);
  const items = useBackgroundRemoverStore((s) => s.items);
  const isProcessing = useBackgroundRemoverStore((s) => s.isProcessing);
  const downloadActive = useBackgroundRemoverStore((s) => s.downloadActive);
  const downloadAll = useBackgroundRemoverStore((s) => s.downloadAll);
  const copyActive = useBackgroundRemoverStore((s) => s.copyActive);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const doneCount = items.filter((it) => it.status === "done" && it.mask).length;
  const lossy = exportSettings.format !== "png-transparent" && exportSettings.format !== "png-colored";

  const handleDownload = async () => {
    const ok = await downloadActive();
    if (ok) toast("Image downloaded.");
  };

  const handleDownloadAll = async () => {
    const ok = await downloadAll();
    if (ok) toast("ZIP archive downloaded.");
  };

  const handleCopy = async () => {
    const ok = await copyActive();
    if (ok) {
      setCopied(true);
      toast("Transparent PNG copied to clipboard.");
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Output Resolution
        </p>
        <div className="grid grid-cols-2 gap-2">
          {RESOLUTIONS.map((res) => (
            <button
              key={res.id}
              type="button"
              onClick={() => setExport({ resolution: res.id })}
              className={cn(
                "flex flex-col items-start gap-0.5 rounded-xl border px-3 py-2.5 text-left transition-all",
                exportSettings.resolution === res.id
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-background text-text-secondary hover:border-primary/50 hover:text-primary"
              )}
            >
              <span className="flex items-center gap-1.5 text-xs font-medium">
                <MonitorUp className="h-3.5 w-3.5" />
                {res.label}
              </span>
              <span
                className={cn(
                  "text-[10px]",
                  exportSettings.resolution === res.id ? "text-white/70" : "text-text-muted"
                )}
              >
                {res.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Output Format
        </p>
        <div className="grid grid-cols-2 gap-2">
          {FORMATS.map((format) => (
            <button
              key={format}
              type="button"
              onClick={() => setExport({ format })}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-xs font-medium transition-all",
                exportSettings.format === format
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-background text-text-secondary hover:border-primary/50 hover:text-primary"
              )}
            >
              {exportLabel(format)}
            </button>
          ))}
        </div>
      </div>

      {lossy && (
        <Slider
          label="Quality"
          value={Math.round(exportSettings.quality * 100)}
          min={10}
          max={100}
          step={1}
          onChange={(v) => setExport({ quality: v / 100 })}
          format={(v) => `${v}%`}
        />
      )}

      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">File Name</label>
        <input
          type="text"
          value={exportSettings.fileName}
          onChange={(e) => setExport({ fileName: e.target.value })}
          placeholder="my-bg-removed-image"
          className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={doneCount === 0 || isProcessing}
            onClick={() => void handleCopy()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface text-sm font-semibold text-text-secondary shadow-xs transition-all hover:border-primary/50 hover:text-primary active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-success" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy PNG
              </>
            )}
          </button>
          <button
            type="button"
            disabled={doneCount === 0 || isProcessing}
            onClick={() => void handleDownload()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Rendering…
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download (.{exportExt(exportSettings.format)})
              </>
            )}
          </button>
        </div>

        {items.length > 1 && (
          <button
            type="button"
            disabled={doneCount === 0 || isProcessing}
            onClick={() => void handleDownloadAll()}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface text-sm font-semibold text-text-secondary shadow-xs transition-all hover:border-text-muted hover:text-text-primary active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            <FolderDown className="h-4 w-4" />
            Download All ({doneCount}) as ZIP
          </button>
        )}
      </div>

      <p className="text-[10px] leading-relaxed text-text-muted">
        PNG keeps transparency; JPG and WEBP are saved over your chosen background.
        {exportSettings.format === "png-transparent" &&
          " Transparent PNG is ideal for logos, product photos, and design work."}{" "}
        {exportSettings.resolution === "original" &&
          " Original exports upscale the cutout to your source file's resolution (capped at 6000px)."}
      </p>
    </motion.div>
  );
}
