"use client";

import { motion } from "framer-motion";
import { IdCard, ImageIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { usePassportStore } from "@/store/passport-store";
import { SizeSelector } from "@/features/passport/components/SizeSelector";
import { CropEditor } from "@/features/passport/components/CropEditor";
import { PhotoControls } from "@/features/passport/components/PhotoControls";
import { PageTransition } from "@/components/shared/PageTransition";

const UploadZone = dynamic(
  () =>
    import("@/features/passport/components/UploadZone").then((m) => ({
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

export default function PassportPhotoMakerPage() {
  const originalFile = usePassportStore((s) => s.originalFile);
  const error = usePassportStore((s) => s.error);
  const reset = usePassportStore((s) => s.reset);

  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light">
            <IdCard className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Passport Photo Maker
          </h1>
          <p className="mt-3 text-lg text-text-secondary">
            Create a print-ready passport photo for 25+ countries in seconds.
            Pick your size, position your face, and download — entirely in your browser.
          </p>
        </div>

        {/* Upload zone (empty state) */}
        {!originalFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto mt-10 max-w-xl"
          >
            <UploadZone />
          </motion.div>
        )}

        {/* Editor */}
        {originalFile && (
          <div className="mx-auto mt-10 max-w-6xl">
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

            {/* Two-column layout: controls + preview */}
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-5">
                <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                  <SizeSelector />
                </div>
                <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                  <PhotoControls />
                </div>
              </div>
              <div className="lg:col-span-7">
                <CropEditor />
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
          </div>
        )}

        {/* Bottom CTA for empty state */}
        {!originalFile && (
          <div className="mx-auto mt-8 max-w-xl text-center">
            <p className="text-sm text-text-muted">
              No uploads. No servers. 100% private browser-based passport photos.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
