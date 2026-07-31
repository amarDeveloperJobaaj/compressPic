"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wand2, ImageIcon, Layers, PaintBucket, SlidersHorizontal, Brush, Download } from "lucide-react";
import dynamic from "next/dynamic";
import { useBackgroundRemoverStore } from "@/store/background-remover-store";
import { ComparisonViewer } from "@/features/background-remover/components/ComparisonViewer";
import { BatchQueue } from "@/features/background-remover/components/BatchQueue";
import { BackgroundPanel } from "@/features/background-remover/components/BackgroundPanel";
import { AdjustmentsPanel } from "@/features/background-remover/components/AdjustmentsPanel";
import { EdgePanel } from "@/features/background-remover/components/EdgePanel";
import { ExportPanel } from "@/features/background-remover/components/ExportPanel";
import { PageTransition } from "@/components/shared/PageTransition";
import { cn } from "@/lib/utils";

const UploadZone = dynamic(
  () =>
    import("@/features/background-remover/components/UploadZone").then((m) => ({
      default: m.UploadZone,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface p-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    ),
  }
);

type PanelId = "background" | "adjust" | "edge" | "export";

const PANELS: { id: PanelId; label: string; icon: typeof Layers }[] = [
  { id: "background", label: "Background", icon: PaintBucket },
  { id: "adjust", label: "Adjust", icon: SlidersHorizontal },
  { id: "edge", label: "Refine", icon: Brush },
  { id: "export", label: "Export", icon: Download },
];

export default function RemoveBackgroundPage() {
  const items = useBackgroundRemoverStore((s) => s.items);
  const error = useBackgroundRemoverStore((s) => s.error);
  const reset = useBackgroundRemoverStore((s) => s.reset);
  const [panel, setPanel] = useState<PanelId>("background");

  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light">
            <Wand2 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Remove Background from Image
          </h1>
          <p className="mt-3 text-lg text-text-secondary">
            AI detects your subject and cuts it out automatically — in your browser.
            Replace the background, refine edges, and export transparent PNGs.
          </p>
        </div>

        {/* Upload zone (empty state) */}
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto mt-10 max-w-xl"
          >
            <UploadZone />
          </motion.div>
        )}

        {/* Editor */}
        {items.length > 0 && (
          <div className="mx-auto mt-10 max-w-6xl">
            {/* Batch strip */}
            <BatchQueue />

            <div className="mt-4 grid gap-4 lg:grid-cols-12">
              {/* Controls */}
              <div className="lg:col-span-4">
                <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                  {/* Panel tabs */}
                  <div className="grid grid-cols-4 border-b border-border">
                    {PANELS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPanel(p.id)}
                        className={cn(
                          "flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors",
                          panel === p.id
                            ? "bg-primary-light text-primary"
                            : "text-text-muted hover:bg-background hover:text-text-secondary"
                        )}
                        aria-label={p.label}
                      >
                        <p.icon className="h-4 w-4" />
                        {p.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-5">
                    {panel === "background" && <BackgroundPanel />}
                    {panel === "adjust" && <AdjustmentsPanel />}
                    {panel === "edge" && <EdgePanel />}
                    {panel === "export" && <ExportPanel />}
                  </div>
                </div>

                {/* New image */}
                <button
                  type="button"
                  onClick={reset}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
                >
                  <ImageIcon className="h-4 w-4" />
                  New Images
                </button>
              </div>

              {/* Preview */}
              <div className="lg:col-span-8">
                <ComparisonViewer />
              </div>
            </div>

            {/* Privacy note */}
            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-center">
              <Layers className="h-4 w-4 text-primary" />
              <p className="text-xs text-text-muted">
                Everything runs locally — your photos are never uploaded. The AI model may
                download once (~80 MB) and is then cached by your browser.
              </p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-2xl border border-error/30 bg-error-light p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-error/10">
                    <span className="text-xs font-bold text-error">!</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-error">Error</p>
                    <p className="mt-1 text-xs leading-relaxed text-error/80">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
