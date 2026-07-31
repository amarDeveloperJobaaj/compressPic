"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Move, Sparkles } from "lucide-react";
import { useWatermarkStore } from "@/store/watermark-store";
import { fitSize, loadImage, renderWatermarkedImage } from "@/features/watermark/utils/watermark";
import { formatFileSize } from "@/features/compressor/utils/format";

const MAX_PREVIEW_HEIGHT = 520;

export function WatermarkPreview() {
  const originalPreviewUrl = useWatermarkStore((s) => s.originalPreviewUrl);
  const logoPreviewUrl = useWatermarkStore((s) => s.logoPreviewUrl);
  const settings = useWatermarkStore((s) => s.settings);
  const naturalWidth = useWatermarkStore((s) => s.naturalWidth);
  const naturalHeight = useWatermarkStore((s) => s.naturalHeight);
  const originalSize = useWatermarkStore((s) => s.originalSize);
  const originalFile = useWatermarkStore((s) => s.originalFile);
  const isProcessing = useWatermarkStore((s) => s.isProcessing);
  const setCustomPosition = useWatermarkStore((s) => s.setCustomPosition);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseImgRef = useRef<HTMLImageElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  // Bumped whenever an image finishes (re)loading — refs alone don't trigger a redraw
  const [loadedTick, setLoadedTick] = useState(0);
  const draggingRef = useRef(false);

  // Load the base image once per upload
  useEffect(() => {
    if (!originalPreviewUrl) {
      baseImgRef.current = null;
      return;
    }
    let cancelled = false;
    loadImage(originalPreviewUrl)
      .then((img) => {
        if (!cancelled) {
          baseImgRef.current = img;
          setLoadedTick((t) => t + 1);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [originalPreviewUrl]);

  // Load the logo image whenever it changes
  useEffect(() => {
    if (!logoPreviewUrl) {
      logoImgRef.current = null;
      return;
    }
    let cancelled = false;
    loadImage(logoPreviewUrl)
      .then((img) => {
        if (!cancelled) {
          logoImgRef.current = img;
          setLoadedTick((t) => t + 1);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [logoPreviewUrl]);

  // Size the canvas to the container (responsive)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      if (naturalWidth === 0 || naturalHeight === 0) return;
      const rect = container.getBoundingClientRect();
      const maxW = Math.max(160, rect.width);
      const size = fitSize(naturalWidth, naturalHeight, maxW, MAX_PREVIEW_HEIGHT);
      setCanvasSize(size);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [naturalWidth, naturalHeight]);

  // Redraw whenever settings / images / size change
  useEffect(() => {
    const canvas = canvasRef.current;
    const baseImg = baseImgRef.current;
    if (!canvas || !baseImg || canvasSize.width === 0) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    renderWatermarkedImage(ctx, baseImg, logoImgRef.current, settings, canvasSize.width, canvasSize.height);
  }, [settings, canvasSize, logoPreviewUrl, originalPreviewUrl, loadedTick]);

  // Drag-to-position: pointer events on the canvas map to normalized coords
  const updatePosition = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setCustomPosition(x, y);
    },
    [setCustomPosition]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      e.preventDefault();
      draggingRef.current = true;
      setIsDragging(true);
      canvas.setPointerCapture(e.pointerId);
      updatePosition(e);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!draggingRef.current) return;
      updatePosition(e);
    },
    [updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
    setIsDragging(false);
  }, []);

  if (!originalFile || !originalPreviewUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
    >
      {/* Preview header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">Live Preview</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Move className="h-3 w-3" />
          <span>Drag the watermark to position it</span>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="flex items-center justify-center bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)_0_0/16px_16px] dark:bg-[repeating-conic-gradient(#334155_0%_25%,transparent_0%_50%)_0_0/16px_16px] p-4"
      >
        {canvasSize.width > 0 ? (
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
              touchAction: "none",
              cursor: isDragging ? "grabbing" : "grab",
            }}
            className="max-w-full rounded-lg shadow-lg"
            aria-label="Watermark preview — drag to reposition"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 p-16 text-text-muted">
            <Move className="h-8 w-8 animate-pulse" />
            <p className="text-xs">{isProcessing ? "Loading image..." : "Preparing preview..."}</p>
          </div>
        )}
      </div>

      {/* Info bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-5 py-2.5">
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span>
            {naturalWidth}×{naturalHeight}px
          </span>
          <span className="text-text-muted">&middot;</span>
          <span>{formatFileSize(originalSize)}</span>
          {settings.positionPreset === "custom" && (
            <span className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-medium text-primary">
              Custom position
            </span>
          )}
        </div>
        <p className="text-[10px] text-text-muted">
          {settings.type === "text" ? "Text watermark" : "Logo watermark"} &middot;{" "}
          {Math.round(settings.opacity * 100)}% opacity
        </p>
      </div>
    </motion.div>
  );
}
