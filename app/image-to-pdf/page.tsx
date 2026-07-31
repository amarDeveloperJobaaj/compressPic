"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import dynamic from "next/dynamic";
import { useImageToPdfStore } from "@/store/image-to-pdf-store";
import { ImageList } from "@/features/image-to-pdf/components/ImageList";
import { PdfSettings } from "@/features/image-to-pdf/components/PdfSettings";
import { PageTransition } from "@/components/shared/PageTransition";

const UploadZone = dynamic(
  () =>
    import("@/features/image-to-pdf/components/UploadZone").then((m) => ({
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

export default function ImageToPdfPage() {
  const items = useImageToPdfStore((s) => s.items);
  const error = useImageToPdfStore((s) => s.error);
  const reset = useImageToPdfStore((s) => s.reset);

  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Convert Images to PDF
          </h1>
          <p className="mt-3 text-lg text-text-secondary">
            Merge JPG, PNG, WEBP, and HEIC images into a single PDF document.
            Reorder pages, set your page size, and download — all in your browser.
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
          <div className="mx-auto mt-10 max-w-5xl">
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Image list - primary */}
              <div className="lg:col-span-7">
                <ImageList />
              </div>

              {/* PDF settings */}
              <div className="lg:col-span-5">
                <PdfSettings />
              </div>
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

            <button
              type="button"
              onClick={reset}
              className="mt-4 w-full rounded-xl border border-border bg-surface py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
            >
              Start over
            </button>
          </div>
        )}

        {/* Bottom CTA for empty state */}
        {items.length === 0 && (
          <div className="mx-auto mt-8 max-w-xl text-center">
            <p className="text-sm text-text-muted">
              No uploads. No servers. 100% private browser-based PDF creation.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
