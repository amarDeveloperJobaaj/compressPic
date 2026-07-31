"use client";

import { motion } from "framer-motion";
import { Download, FolderDown, Loader2 } from "lucide-react";
import { useBackgroundRemoverStore } from "@/store/background-remover-store";
import type { ExportFormat } from "@/features/background-remover/utils/export";
import { exportLabel, exportExt } from "@/features/background-remover/utils/export";
import { Slider } from "./Slider";
import { cn } from "@/lib/utils";

const FORMATS: ExportFormat[] = ["png-transparent", "png-colored", "jpeg", "webp"];

export function ExportPanel() {
  const exportSettings = useBackgroundRemoverStore((s) => s.exportSettings);
  const setExport = useBackgroundRemoverStore((s) => s.setExport);
  const items = useBackgroundRemoverStore((s) => s.items);
  const isProcessing = useBackgroundRemoverStore((s) => s.isProcessing);
  const downloadActive = useBackgroundRemoverStore((s) => s.downloadActive);
  const downloadAll = useBackgroundRemoverStore((s) => s.downloadAll);

  const doneCount = items.filter((it) => it.status === "done" && it.mask).length;
  const lossy = exportSettings.format !== "png-transparent" && exportSettings.format !== "png-colored";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
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
        <button
          type="button"
          disabled={doneCount === 0 || isProcessing}
          onClick={() => void downloadActive()}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
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

        {items.length > 1 && (
          <button
            type="button"
            disabled={doneCount === 0 || isProcessing}
            onClick={() => void downloadAll()}
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
          " Transparent PNG is ideal for logos, product photos, and design work."}
      </p>
    </motion.div>
  );
}
