"use client";

import { motion } from "framer-motion";
import { Crop, ImageIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useResizerStore } from "@/store/resizer-store";
import { PageTransition } from "@/components/shared/PageTransition";
import { AspectRatioSelector } from "@/features/resizer/components/AspectRatioSelector";
import { ResizePreview } from "@/features/resizer/components/ResizePreview";
import { ResizeResults } from "@/features/resizer/components/ResizeResults";

const UploadZone = dynamic(
  () =>
    import("@/features/resizer/components/UploadZone").then((m) => ({
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

const ImageCropper = dynamic(
  () =>
    import("@/features/resizer/components/ImageCropper").then((m) => ({
      default: m.ImageCropper,
    })),
  { ssr: false }
);

export default function ResizePage() {
  const originalFile = useResizerStore((s) => s.originalFile);
  const error = useResizerStore((s) => s.error);
  const reset = useResizerStore((s) => s.reset);

  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light">
            <Crop className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Resize &amp; Crop Your Image
          </h1>
          <p className="mt-3 text-lg text-text-secondary">
            Choose from prebuilt sizes like passport, document, or social media formats.
            Everything stays in your browser.
          </p>
        </div>

        {/* Upload Zone (shown when no file) */}
        {!originalFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto mt-10 max-w-xl"
          >
            <UploadZone />
          </motion.div>
        )}

        {/* Resize/Crop UI (shown when file is selected) */}
        {originalFile && (
          <div className="mx-auto mt-10 max-w-5xl">
            {/* Compact file info + change button */}
            <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-3 shadow-sm">
              <div className="flex items-center gap-3 truncate">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light">
                  <ImageIcon className="h-4 w-4 text-primary" />
                </div>
                <div className="truncate">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {originalFile.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {(originalFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={reset}
                className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
              >
                Change
              </button>
            </div>

            {/* Three-column layout: Controls + Crop + Preview */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Sidebar Controls - takes 3/12 */}
              <div className="lg:col-span-3">
                <AspectRatioSelector />
              </div>

              {/* Crop Area - takes 6/12 */}
              <div className="lg:col-span-6">
                <ImageCropper />
              </div>

              {/* Results Panel - takes 3/12 */}
              <div className="lg:col-span-3">
                <ResizeResults />
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6">
              <ResizePreview />
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-2xl border border-error/30 bg-error-light p-5"
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

        {/* Bottom CTA for empty state */}
        {!originalFile && (
          <div className="mx-auto mt-8 max-w-xl text-center">
            <p className="text-sm text-text-muted">
              No uploads. No servers. 100% private browser-based image editing.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
