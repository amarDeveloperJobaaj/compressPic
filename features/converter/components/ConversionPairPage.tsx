"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Download,
  FileImage,
  ImageIcon,
  Repeat,
  RotateCcw,
  Upload,
  X,
} from "lucide-react";
import { convertImage, extractSvgSize } from "@/features/converter/utils/convert";
import { decodeHeicToJpeg, isHeicFile } from "@/lib/heic";
import { formatFileSize } from "@/features/compressor/utils/format";
import type { ConversionPair } from "@/features/converter/utils/pairs";

const checkerboard =
  "bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)_0_0/16px_16px] dark:bg-[repeating-conic-gradient(#334155_0%_25%,transparent_0%_50%)_0_0/16px_16px]";

/** Max canvas dimension for SVGs without intrinsic size (prevent huge canvases). */
const MAX_SVG_SIZE = 4096;

interface ConversionPairPageProps {
  pair: ConversionPair;
}

export function ConversionPairPage({ pair }: ConversionPairPageProps) {
  const { from, to } = pair;

  const [file, setFile] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.92);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultPreviewUrl, setResultPreviewUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [resultErrorUrl, setResultErrorUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Guards against a stale async convert landing after the user switched files
  const currentTokenRef = useRef(0);

  const isLossy = to.type === "image/jpeg" || to.type === "image/webp";
  const isHeicFrom = from.type === "image/heic" || from.type === "image/heif";
  // HEIC → JPG: the decoded JPEG *is* the target, so skip re-encoding
  const heicToJpeg = isHeicFrom && to.type === "image/jpeg";

  const reset = useCallback(() => {
    currentTokenRef.current++;
    if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
    if (resultPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(resultPreviewUrl);
    setFile(null);
    setOriginalPreviewUrl(null);
    setOriginalSize(0);
    setIsProcessing(false);
    setError(null);
    setResultBlob(null);
    setResultPreviewUrl(null);
    setResultSize(0);
    setResultErrorUrl(null);
  }, [originalPreviewUrl, resultPreviewUrl]);

  const validateFile = useCallback(
    (f: File) => {
      // Exact MIME match; HEIC empty-MIME fallback (Windows/Android quirk) only
      // applies when the pair's source format is HEIC; or extension match
      const typeMatches = f.type === from.type || (isHeicFrom && isHeicFile(f));
      const extMatches = from.extensions.some((ext) =>
        f.name.toLowerCase().endsWith(`.${ext}`)
      );
      return typeMatches || extMatches;
    },
    [from.type, from.extensions, isHeicFrom]
  );

  const convertFile = useCallback(
    async (f: File, decodedForHeic: Blob | null, qualityOverride?: number) => {
      const token = ++currentTokenRef.current;
      const targetQuality = qualityOverride ?? quality;
      setIsProcessing(true);
      setError(null);
      setResultBlob(null);
      if (resultPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(resultPreviewUrl);
      setResultPreviewUrl(null);
      setResultSize(0);

      try {
        // 1) Source blob: use the decoded JPEG for HEIC inputs
        let source: Blob = f;
        if (decodedForHeic) source = decodedForHeic;

        // 2) HEIC → JPG: decoded blob is already a JPEG — use it directly.
        //    (source.type check guards against ever serving non-JPEG bytes.)
        if (heicToJpeg && source.type === "image/jpeg") {
          const url = URL.createObjectURL(source);
          setResultBlob(source);
          setResultPreviewUrl(url);
          setResultSize(source.size);
          return;
        }

        // 3) SVG: read source to extract intrinsic dimensions
        let svgSize: { width: number; height: number } | null = null;
        if (source.type === "image/svg+xml") {
          const text = await source.text();
          const parsed = extractSvgSize(text);
          if (parsed) {
            svgSize = {
              width: Math.min(Math.round(parsed.width), MAX_SVG_SIZE),
              height: Math.min(Math.round(parsed.height), MAX_SVG_SIZE),
            };
          }
        }

        // 4) Canvas re-encode (auto-converts immediately on upload)
        const url = URL.createObjectURL(source);
        const result = await convertImage(
          url,
          to.type as "image/jpeg" | "image/png" | "image/webp" | "image/avif",
          to.type === "image/png" ? 1 : targetQuality,
          svgSize
        );
        URL.revokeObjectURL(url);

        if (token !== currentTokenRef.current) return; // stale result
        setResultBlob(result.blob);
        setResultPreviewUrl(result.dataUrl);
        setResultSize(result.size);
      } catch (err) {
        if (token !== currentTokenRef.current) return;
        setError(
          err instanceof Error
            ? err.message
            : `Couldn't convert this ${from.label} file. Please try another one.`
        );
      } finally {
        if (token === currentTokenRef.current) setIsProcessing(false);
      }
    },
    [from.label, heicToJpeg, quality, resultPreviewUrl, to.type]
  );

  const handleFile = useCallback(
    async (f: File) => {
      if (!validateFile(f)) {
        setError(
          `Unsupported file type: "${f.type || "unknown"}". Please upload a ${from.label} image.`
        );
        return;
      }

      // Decode HEIC up front so the preview and conversion both use the JPEG
      let decodedForHeic: Blob | null = null;
      if (isHeicFile(f)) {
        try {
          decodedForHeic = await decodeHeicToJpeg(f);
        } catch {
          setError(
            "Couldn't decode this HEIC file. Try converting it to JPG or PNG on your device first."
          );
          return;
        }
      }

      if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
      const previewUrl = URL.createObjectURL(decodedForHeic ?? f);

      setFile(f);
      setOriginalPreviewUrl(previewUrl);
      setOriginalSize(f.size);
      setResultErrorUrl(null);

      void convertFile(f, decodedForHeic);
    },
    [convertFile, from.label, originalPreviewUrl, validateFile]
  );


  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const f = e.dataTransfer.files?.[0];
      if (f) void handleFile(f);
    },
    [handleFile]
  );

  // Paste from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const f = item.getAsFile();
          if (f) {
            void handleFile(f);
            break;
          }
        }
      }
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handleFile]);

  const download = useCallback(() => {
    if (!resultBlob || !file) return;
    const url = URL.createObjectURL(resultBlob);
    const link = document.createElement("a");
    link.href = url;
    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
    link.download = `${baseName}-converted.${to.ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [file, resultBlob, to.ext]);

  const hasResult = !!resultPreviewUrl;

  return (
    <div className="container-page py-10 sm:py-16">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light">
          <Repeat className="h-6 w-6 text-primary" />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          {pair.title.replace(" Converter — Free & Private", "")}
        </h1>
        <p className="mt-3 text-lg text-text-secondary">{pair.description}</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-text-secondary">
          <span>{from.label}</span>
          <ArrowRight className="h-4 w-4 text-primary" />
          <span>{to.label}</span>
        </div>
      </div>

      {/* Upload zone */}
      {!file && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-10 max-w-xl"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={from.extensions.map((e) => `.${e}`).join(",")}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
              e.target.value = "";
            }}
            className="hidden"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all duration-300 sm:p-16 ${
              isDragging
                ? "border-primary bg-primary-light shadow-lg shadow-primary/10"
                : "border-border bg-surface hover:border-primary/50 hover:bg-primary-light/50"
            }`}
            aria-label={`Upload a ${from.label} image to convert to ${to.label}`}
          >
            {isDragging && (
              <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-3xl animate-pulse" />
            )}
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
                isDragging
                  ? "bg-primary text-white scale-110"
                  : "bg-primary-light text-primary group-hover:bg-primary group-hover:text-white"
              }`}
            >
              <Upload className="h-8 w-8" />
            </div>
            <p className="mt-4 text-lg font-semibold text-text-primary">
              {isDragging ? "Drop your image here" : `Drop your ${from.label} here`}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              or click to browse &middot; {from.extensions.map((e) => e.toUpperCase()).join(", ")}
            </p>
            <p className="mt-6 text-xs text-text-muted">
              You can also paste an image from clipboard
            </p>
          </button>
          {error && <ErrorMessage message={error} />}
        </motion.div>
      )}

      {/* Editor */}
      {file && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-10 max-w-5xl"
        >
          {/* File info + actions */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-5 py-3 shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light">
                <FileImage className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">{file.name}</p>
                <p className="text-xs text-text-muted">{formatFileSize(originalSize)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasResult && !isProcessing && (
                <button
                  onClick={download}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark active:scale-[0.98]"
                >
                  <Download className="h-4 w-4" />
                  Download {to.label}
                </button>
              )}
              <button
                onClick={reset}
                className="inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
              >
                <RotateCcw className="h-4 w-4" />
                New file
              </button>
            </div>
          </div>

          {/* Quality slider (lossy targets only, not for the HEIC→JPG fast path) */}
          {isLossy && !heicToJpeg && (
            <div className="mb-6 rounded-xl border border-border bg-surface p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <label htmlFor="quality" className="text-sm font-medium text-text-primary">
                  Quality
                </label>
                <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {Math.round(quality * 100)}%
                </span>
              </div>
              <input
                id="quality"
                type="range"
                min={0.1}
                max={1}
                step={0.01}
                value={quality}
                onChange={(e) => {
                  const q = Number(e.target.value);
                  setQuality(q);
                  // Re-convert with the new quality (lossy targets only; the
                  // HEIC→JPG fast path ignores quality).
                  if (file && isLossy && !heicToJpeg && !isProcessing) {
                    void convertFile(file, null, q);
                  }
                }}
                className="mt-3 w-full accent-primary"
              />
              <p className="mt-2 text-xs text-text-muted">
                Higher quality = bigger file. {to.label} doesn&apos;t support transparency, so
                transparent areas become white.
              </p>
            </div>
          )}

          {/* Preview */}
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border px-5 py-3">
              <h3 className="text-sm font-semibold text-text-primary">Preview</h3>
            </div>
            <div className="grid gap-px bg-border sm:grid-cols-2">
              {/* Original */}
              <div className="relative bg-surface">
                <div className="absolute left-3 top-3 z-10 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-medium text-text-primary shadow-xs backdrop-blur-sm dark:bg-gray-800/90">
                  Original · {from.label}
                </div>
                <div className="flex aspect-square items-center justify-center p-4 sm:aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={originalPreviewUrl ?? ""}
                    alt={`Original ${from.label} image`}
                    className={`max-h-full max-w-full rounded-lg object-contain ${checkerboard}`}
                  />
                </div>
                <div className="border-t border-border px-4 py-2.5">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <FileImage className="h-3.5 w-3.5" />
                    <span>{formatFileSize(originalSize)}</span>
                  </div>
                </div>
              </div>

              {/* Result */}
              <div className="relative bg-surface">
                <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-lg bg-primary/90 px-2.5 py-1 text-xs font-medium text-white shadow-xs backdrop-blur-sm">
                  <Repeat className="h-3 w-3" />
                  {to.label}
                </div>
                {hasResult ? (
                  <>
                    <div className="flex aspect-square items-center justify-center p-4 sm:aspect-[4/3]">
                      {resultErrorUrl === resultPreviewUrl ? (
                        <div className="flex flex-col items-center gap-2 text-text-muted">
                          <ImageIcon className="h-8 w-8" />
                          <p className="text-xs">Preview failed to load</p>
                        </div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={resultPreviewUrl ?? undefined}
                          src={resultPreviewUrl ?? ""}
                          alt={`Converted ${to.label} image`}
                          className={`max-h-full max-w-full rounded-lg object-contain ${checkerboard}`}
                          onError={() => setResultErrorUrl(resultPreviewUrl)}
                        />
                      )}
                    </div>
                    <div className="border-t border-border px-4 py-2.5">
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <Check className="h-3.5 w-3.5 text-success" />
                        <span>{formatFileSize(resultSize)}</span>
                        <span className="text-text-muted">&middot;</span>
                        <span>
                          {resultSize > 0 && originalSize > 0
                            ? `${Math.round(((originalSize - resultSize) / originalSize) * 100)}% smaller`
                            : "Done"}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex aspect-square flex-col items-center justify-center gap-2 p-4 text-text-muted sm:aspect-[4/3]">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-xs">{isProcessing ? "Converting..." : "Ready"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && <ErrorMessage message={error} />}
        </motion.div>
      )}
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 flex items-start gap-3 rounded-2xl border border-error/30 bg-error-light p-5"
    >
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-error/10">
        <X className="h-3 w-3 text-error" />
      </div>
      <p className="text-sm leading-relaxed text-error">{message}</p>
    </motion.div>
  );
}


