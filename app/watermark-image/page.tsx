"use client";

import { motion } from "framer-motion";
import { Stamp, ImageIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useWatermarkStore } from "@/store/watermark-store";
import { WatermarkControls } from "@/features/watermark/components/WatermarkControls";
import { WatermarkPreview } from "@/features/watermark/components/WatermarkPreview";
import { PageTransition } from "@/components/shared/PageTransition";
import { ImageQueue } from "@/components/shared/ImageQueue";

const MultiImageUploadZone = dynamic(
  () =>
    import("@/components/shared/MultiImageUploadZone").then((m) => ({
      default: m.MultiImageUploadZone,
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

export default function WatermarkPage() {
  const files = useWatermarkStore((s) => s.files);
  const activeIndex = useWatermarkStore((s) => s.activeIndex);
  const originalFile = useWatermarkStore((s) => s.originalFile);
  const error = useWatermarkStore((s) => s.error);
  const reset = useWatermarkStore((s) => s.reset);
  const addFiles = useWatermarkStore((s) => s.addFiles);
  const removeFile = useWatermarkStore((s) => s.removeFile);
  const setActiveIndex = useWatermarkStore((s) => s.setActiveIndex);

  const hasFiles = files.length > 0;

  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light">
            <Stamp className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Add a Watermark to Your Images
          </h1>
          <p className="mt-3 text-lg text-text-secondary">
            Protect your photos with a custom text or logo watermark. Drag to position it,
            then download. Everything stays in your browser.
          </p>
        </div>

        {/* Upload Zone */}
        {!hasFiles && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto mt-10 max-w-xl"
          >
            <MultiImageUploadZone
              onFiles={addFiles}
              label="Drop your images here"
              ariaLabel="Upload images to watermark"
              fileInputAccept=".jpg,.jpeg,.png,.webp"
            />
          </motion.div>
        )}

        {/* Watermark UI */}
        {hasFiles && (
          <div className="mx-auto mt-10 max-w-5xl">
            {/* Image Queue */}
            <ImageQueue
              items={files.map((f) => ({ file: f.file, previewUrl: f.previewUrl }))}
              activeIndex={activeIndex}
              onSelect={setActiveIndex}
              onRemove={removeFile}
              onAdd={addFiles}
              accept={["image/jpeg", "image/png", "image/webp"]}
            />

            {/* Compact file info */}
            <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-3 shadow-sm">
              <div className="flex items-center gap-3 truncate">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light">
                  <ImageIcon className="h-4 w-4 text-primary" />
                </div>
                <div className="truncate">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {originalFile?.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {originalFile ? `${(originalFile.size / 1024).toFixed(1)} KB` : ""}
                    {files.length > 1 && ` · ${files.length} images`}
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

            {/* Two-column layout */}
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <WatermarkControls />
              </div>
              <div className="lg:col-span-7">
                <WatermarkPreview />
              </div>
            </div>

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

        {!hasFiles && (
          <div className="mx-auto mt-8 max-w-xl text-center">
            <p className="text-sm text-text-muted">
              No uploads. No servers. 100% private browser-based watermarking.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
