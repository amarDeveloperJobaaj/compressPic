"use client";

import { motion } from "framer-motion";
import { ImageDown } from "lucide-react";
import dynamic from "next/dynamic";
import { useCompressorStore } from "@/store/compressor-store";
import { TargetSizeSelector } from "@/features/compressor/components/TargetSizeSelector";
import { CompressionProgress } from "@/features/compressor/components/CompressionProgress";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/shared/PageTransition";

// Lazy-load heavy components that use browser-image-compression
const UploadZone = dynamic(
  () =>
    import("@/features/compressor/components/UploadZone").then((m) => ({
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
  const originalFile = useCompressorStore((s) => s.originalFile);
  const isCompressing = useCompressorStore((s) => s.isCompressing);
  const compressedBlob = useCompressorStore((s) => s.compressedBlob);
  const targetSizeKB = useCompressorStore((s) => s.targetSizeKB);
  const compress = useCompressorStore((s) => s.compress);
  const reset = useCompressorStore((s) => s.reset);

  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light">
            <ImageDown className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Compress Your Image
          </h1>
          <p className="mt-3 text-lg text-text-secondary">
            Upload an image and choose your target size. Everything stays in your browser.
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

        {/* Compressor UI (shown when file is selected) */}
        {originalFile && (
          <div className="mx-auto mt-10 max-w-3xl">
            {/* Compact file info + change button */}
            <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-3 shadow-sm">
              <div className="flex items-center gap-3 truncate">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light">
                  <ImageDown className="h-4 w-4 text-primary" />
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
              <Button
                onClick={reset}
                variant="ghost"
                size="sm"
                disabled={isCompressing}
              >
                Change
              </Button>
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
        {!originalFile && !compressedBlob && (
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
