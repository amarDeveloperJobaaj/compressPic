"use client";

import { motion } from "framer-motion";
import { ImageDown, Download } from "lucide-react";
import dynamic from "next/dynamic";
import { useCompressorStore } from "@/store/compressor-store";
import { TargetSizeSelector } from "@/features/compressor/components/TargetSizeSelector";
import { CompressionProgress } from "@/features/compressor/components/CompressionProgress";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/shared/PageTransition";
import { ImageQueue } from "@/components/shared/ImageQueue";

// Lazy-load heavy components
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

const ImagePreview = dynamic(
  () =>
    import("@/features/compressor/components/ImagePreview").then((m) => ({
      default: m.ImagePreview,
    })),
  { ssr: false }
);

const Results = dynamic(
  () =>
    import("@/features/compressor/components/Results").then((m) => ({
      default: m.Results,
    })),
  { ssr: false }
);

export default function CompressPage() {
  const files = useCompressorStore((s) => s.files);
  const activeIndex = useCompressorStore((s) => s.activeIndex);
  const originalFile = useCompressorStore((s) => s.originalFile);
  const isCompressing = useCompressorStore((s) => s.isCompressing);
  const compressedBlob = useCompressorStore((s) => s.compressedBlob);
  const targetSizeKB = useCompressorStore((s) => s.targetSizeKB);
  const compress = useCompressorStore((s) => s.compress);
  const compressAll = useCompressorStore((s) => s.compressAll);
  const reset = useCompressorStore((s) => s.reset);
  const addFiles = useCompressorStore((s) => s.addFiles);
  const removeFile = useCompressorStore((s) => s.removeFile);
  const setActiveIndex = useCompressorStore((s) => s.setActiveIndex);
  const downloadAll = useCompressorStore((s) => s.downloadAll);

  const hasFiles = files.length > 0;
  const hasUncompressed = files.some((f) => !f.compressedBlob);
  const allCompressed = files.length > 0 && files.every((f) => f.compressedBlob);

  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light">
            <ImageDown className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Compress Your Images
          </h1>
          <p className="mt-3 text-lg text-text-secondary">
            Upload one or more images and choose your target size. Everything stays in your browser.
          </p>
        </div>

        {/* Upload Zone (shown when no files) */}
        {!hasFiles && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto mt-10 max-w-xl"
          >
            <MultiImageUploadZone
              onFiles={addFiles}
              label="Drop your images here"
              ariaLabel="Upload images to compress"
            />
          </motion.div>
        )}

        {/* Compressor UI (shown when files are selected) */}
        {hasFiles && (
          <div className="mx-auto mt-10 max-w-3xl">
            {/* Image Queue */}
            <ImageQueue
              items={files.map((f) => ({ file: f.file, previewUrl: f.previewUrl! }))}
              activeIndex={activeIndex}
              onSelect={setActiveIndex}
              onRemove={removeFile}
              onAdd={addFiles}
            />

            {/* Compact file info + actions */}
            <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-3 shadow-sm">
              <div className="flex items-center gap-3 truncate">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light">
                  <ImageDown className="h-4 w-4 text-primary" />
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
              <div className="flex items-center gap-2">
                {allCompressed && files.length > 1 && (
                  <Button onClick={downloadAll} variant="ghost" size="sm">
                    <Download className="mr-1 h-3.5 w-3.5" />
                    All
                  </Button>
                )}
                <Button onClick={reset} variant="ghost" size="sm" disabled={isCompressing}>
                  Change
                </Button>
              </div>
            </div>

            {/* Two-column layout: Preview + Controls */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Preview - takes 2/3 */}
              <div className="lg:col-span-2">
                <ImagePreview />
              </div>

              {/* Controls - takes 1/3 */}
              <div className="space-y-4">
                <TargetSizeSelector />

                {/* Compress Button */}
                <Button
                  onClick={compress}
                  disabled={!originalFile || isCompressing || !!compressedBlob}
                  size="xl"
                  className="w-full"
                >
                  {isCompressing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Compressing...
                    </span>
                  ) : compressedBlob ? (
                    "Already Compressed"
                  ) : (
                    `Compress to ${targetSizeKB} KB`
                  )}
                </Button>

                {/* Compress All button */}
                {files.length > 1 && hasUncompressed && (
                  <Button
                    onClick={compressAll}
                    disabled={isCompressing}
                    variant="outline"
                    size="xl"
                    className="w-full"
                  >
                    Compress All ({files.filter((f) => !f.compressedBlob).length} remaining)
                  </Button>
                )}
              </div>
            </div>

            {/* Progress & Error */}
            <div className="mt-6 space-y-4">
              <CompressionProgress />
            </div>

            {/* Results */}
            <div className="mt-6">
              <Results />
            </div>
          </div>
        )}

        {/* Bottom CTA for empty state */}
        {!hasFiles && (
          <div className="mx-auto mt-8 max-w-xl text-center">
            <p className="text-sm text-text-muted">
              No uploads. No servers. 100% private browser compression.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
