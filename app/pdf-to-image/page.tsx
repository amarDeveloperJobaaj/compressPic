"use client";

import { motion } from "framer-motion";
import { FileImage } from "lucide-react";
import dynamic from "next/dynamic";
import { usePdfToImageStore } from "@/store/pdf-to-image-store";
import { PageGrid } from "@/features/pdf-to-image/components/PageGrid";
import { PageTransition } from "@/components/shared/PageTransition";

const UploadZone = dynamic(
  () =>
    import("@/features/pdf-to-image/components/UploadZone").then((m) => ({
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

export default function PdfToImagePage() {
  const file = usePdfToImageStore((s) => s.file);
  const error = usePdfToImageStore((s) => s.error);
  const reset = usePdfToImageStore((s) => s.reset);

  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light">
            <FileImage className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Convert PDF to Images
          </h1>
          <p className="mt-3 text-lg text-text-secondary">
            Turn every page of your PDF into a high-resolution JPG or PNG image.
            Preview pages, download individually, or grab them all as a ZIP —
            all in your browser.
          </p>
        </div>

        {/* Upload zone (empty state) */}
        {!file && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto mt-10 max-w-xl"
          >
            <UploadZone />
          </motion.div>
        )}

        {/* Editor */}
        {file && (
          <div className="mx-auto mt-10 max-w-5xl">
            <PageGrid />

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
        {!file && (
          <div className="mx-auto mt-8 max-w-xl text-center">
            <p className="text-sm text-text-muted">
              No uploads. No servers. 100% private browser-based PDF conversion.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
