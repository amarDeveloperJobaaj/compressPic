"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Crop, ZoomIn, ZoomOut, Move, Loader2 } from "lucide-react";
import { useResizerStore } from "@/store/resizer-store";
import { cn } from "@/lib/utils";

export function ImageCropper() {
  const originalFile = useResizerStore((s) => s.originalFile);
  const originalPreviewUrl = useResizerStore((s) => s.originalPreviewUrl);
  const naturalWidth = useResizerStore((s) => s.naturalWidth);
  const naturalHeight = useResizerStore((s) => s.naturalHeight);
  const displayWidth = useResizerStore((s) => s.displayWidth);
  const displayHeight = useResizerStore((s) => s.displayHeight);
  const cropX = useResizerStore((s) => s.cropX);
  const cropY = useResizerStore((s) => s.cropY);
  const cropWidth = useResizerStore((s) => s.cropWidth);
  const cropHeight = useResizerStore((s) => s.cropHeight);
  const selectedRatio = useResizerStore((s) => s.selectedRatio);
  const setCrop = useResizerStore((s) => s.setCrop);
  const setDisplayDimensions = useResizerStore((s) => s.setDisplayDimensions);
  const isProcessing = useResizerStore((s) => s.isProcessing);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeEdge, setResizeEdge] = useState<string>("");
  const [zoom, setZoom] = useState(1);

  // Called when the DOM <img> finishes loading.
  // Now safe because the container uses max-width so the image can render freely.
  const onImageLoad = useCallback(() => {
    const img = imageRef.current;
    const container = containerRef.current;
    if (!img || !container) return;
    if (img.naturalWidth === 0 || img.naturalHeight === 0) return;

    // Use the container's rendered size (now the image has rendered it)
    const containerRect = container.getBoundingClientRect();
    const maxW = Math.max(containerRect.width - 8, 100);
    const maxH = Math.min(600, window.innerHeight * 0.6);
    const imgAspect = img.naturalWidth / img.naturalHeight;

    let dispW: number, dispH: number;
    if (imgAspect > maxW / maxH) {
      dispW = maxW;
      dispH = dispW / imgAspect;
    } else {
      dispH = maxH;
      dispW = dispH * imgAspect;
    }

    if (Number.isFinite(dispW) && Number.isFinite(dispH) && dispW > 0 && dispH > 0) {
      setDisplayDimensions(Math.round(dispW), Math.round(dispH));
    }
  }, [setDisplayDimensions]);

  // Recalculate on window resize (only when image has loaded)
  useEffect(() => {
    const handleResize = () => {
      const img = imageRef.current;
      if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
        onImageLoad();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onImageLoad]);

  // Check if all dimensions are known so we can show the crop overlay
  const isReady = displayWidth > 0 && displayHeight > 0 && naturalWidth > 0;

  // Scale factor: how many display pixels per natural pixel
  const scale = isReady ? displayWidth / naturalWidth : 1;

  // Display-space positions (with zoom applied)
  const dispCropX = (cropX || 0) * scale * zoom;
  const dispCropY = (cropY || 0) * scale * zoom;
  const dispCropW = (cropWidth || 0) * scale * zoom;
  const dispCropH = (cropHeight || 0) * scale * zoom;
  const dispImgW = (displayWidth || 0) * zoom;
  const dispImgH = (displayHeight || 0) * zoom;

  // Constrain crop within image bounds (natural coordinates)
  const constrainCrop = useCallback(
    (x: number, y: number, w: number, h: number) => {
      if (naturalWidth === 0 || naturalHeight === 0) return { x: 0, y: 0, w: 0, h: 0 };
      x = Math.max(0, Math.min(x, naturalWidth - w));
      y = Math.max(0, Math.min(y, naturalHeight - h));
      w = Math.min(w, naturalWidth - x);
      h = Math.min(h, naturalHeight - y);
      return { x, y, w, h };
    },
    [naturalWidth, naturalHeight]
  );

  // Mouse down on crop area — start drag or resize
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, action: "move" | "resize", edge = "") => {
      if (isProcessing || !isReady) return;
      e.preventDefault();
      e.stopPropagation();
      if (action === "move") {
        setIsDragging(true);
        setDragStart({ x: e.clientX - dispCropX, y: e.clientY - dispCropY });
      } else {
        setIsResizing(true);
        setResizeEdge(edge);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    },
    [isProcessing, isReady, dispCropX, dispCropY]
  );

  // Mouse move/up handlers for drag and resize
  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = (e.clientX - dragStart.x) / scale / zoom;
        const newY = (e.clientY - dragStart.y) / scale / zoom;
        const constrained = constrainCrop(newX, newY, cropWidth, cropHeight);
        setCrop(constrained.x, constrained.y, cropWidth, cropHeight);
      } else if (isResizing) {
        const dx = (e.clientX - dragStart.x) / scale / zoom;
        const dy = (e.clientY - dragStart.y) / scale / zoom;
        let newX = cropX, newY = cropY, newW = cropWidth, newH = cropHeight;

        if (resizeEdge.includes("e")) newW = Math.max(50, cropWidth + dx);
        if (resizeEdge.includes("w")) {
          newW = Math.max(50, cropWidth - dx);
          newX = cropX + (cropWidth - newW);
        }
        if (resizeEdge.includes("s")) newH = Math.max(50, cropHeight + dy);
        if (resizeEdge.includes("n")) {
          newH = Math.max(50, cropHeight - dy);
          newY = cropY + (cropHeight - newH);
        }

        // Maintain aspect ratio if one is selected
        if (selectedRatio) {
          const ratio = selectedRatio.width / selectedRatio.height;
          if (resizeEdge.includes("e") || resizeEdge.includes("w")) {
            newH = newW / ratio;
            if (resizeEdge.includes("n")) newY = cropY + (cropHeight - newH);
          } else {
            newW = newH * ratio;
            if (resizeEdge.includes("w")) newX = cropX + (cropWidth - newW);
          }
        }

        const constrained = constrainCrop(newX, newY, newW, newH);
        setCrop(constrained.x, constrained.y, constrained.w, constrained.h);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging, isResizing, dragStart,
    cropX, cropY, cropWidth, cropHeight,
    scale, zoom, selectedRatio,
    constrainCrop, setCrop, resizeEdge,
  ]);

  if (!originalFile || !originalPreviewUrl) return null;

  const ratioLabel = selectedRatio
    ? `${selectedRatio.width}:${selectedRatio.height}`
    : "Free";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <Crop className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">Crop Image</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Move className="h-3 w-3" />
          <span>Drag to move</span>
          <span className="mx-1">&middot;</span>
          <span className="font-medium text-primary">{ratioLabel}</span>
        </div>
      </div>

      {/* Crop area */}
      <div className="relative flex items-center justify-center bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)_0_0/16px_16px] dark:bg-[repeating-conic-gradient(#334155_0%_25%,transparent_0%_50%)_0_0/16px_16px]">
        {/* Outer wrapper — size is unconstrained before image loads, then fixed after */}
        <div
          ref={containerRef}
          className="relative overflow-hidden"
          style={
            isReady
              ? { width: dispImgW, height: dispImgH }
              : { maxWidth: "100%", minHeight: 200 }
          }
        >
          {/* The image renders freely so onLoad can get natural dimensions */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={originalPreviewUrl}
            alt="Image to crop"
            onLoad={onImageLoad}
            className="block select-none"
            draggable={false}
            style={
              isReady
                ? { width: dispImgW, height: dispImgH, objectFit: "contain" }
                : { maxWidth: "100%", maxHeight: "60vh", objectFit: "contain" }
            }
          />

          {/* Overlay + crop controls — only rendered when dimensions are known */}
          {isReady && (
            <>
              {/* Dark overlay with mask hole */}
              <svg
                className="pointer-events-none absolute inset-0"
                viewBox={`0 0 ${dispImgW} ${dispImgH}`}
                style={{ width: dispImgW, height: dispImgH, position: "absolute", top: 0, left: 0 }}
              >
                <defs>
                  <mask id="cropMask">
                    <rect width={dispImgW} height={dispImgH} fill="white" />
                    <rect x={dispCropX} y={dispCropY} width={dispCropW} height={dispCropH} fill="black" />
                  </mask>
                </defs>
                <rect width={dispImgW} height={dispImgH} fill="rgba(0,0,0,0.5)" mask="url(#cropMask)" />
              </svg>

              {/* Crop rectangle (draggable + resizable) */}
              <div
                className={cn(
                  "absolute cursor-grab rounded-lg border-2 border-white shadow-lg",
                  isDragging && "cursor-grabbing"
                )}
                style={{ left: dispCropX, top: dispCropY, width: dispCropW, height: dispCropH }}
                onMouseDown={(e) => handleMouseDown(e, "move")}
              >
                {/* Rule-of-thirds grid */}
                <svg className="pointer-events-none absolute inset-0 opacity-30" viewBox={`0 0 ${dispCropW} ${dispCropH}`}>
                  <line x1={dispCropW / 3} y1={0} x2={dispCropW / 3} y2={dispCropH} stroke="white" strokeWidth={1} />
                  <line x1={(dispCropW / 3) * 2} y1={0} x2={(dispCropW / 3) * 2} y2={dispCropH} stroke="white" strokeWidth={1} />
                  <line x1={0} y1={dispCropH / 3} x2={dispCropW} y2={dispCropH / 3} stroke="white" strokeWidth={1} />
                  <line x1={0} y1={(dispCropH / 3) * 2} x2={dispCropW} y2={(dispCropH / 3) * 2} stroke="white" strokeWidth={1} />
                </svg>

                {/* Corner + edge handles */}
                <Handle position="nw" onMouseDown={(e) => handleMouseDown(e, "resize", "nw")} />
                <Handle position="ne" onMouseDown={(e) => handleMouseDown(e, "resize", "ne")} />
                <Handle position="sw" onMouseDown={(e) => handleMouseDown(e, "resize", "sw")} />
                <Handle position="se" onMouseDown={(e) => handleMouseDown(e, "resize", "se")} />
                <Handle position="n" onMouseDown={(e) => handleMouseDown(e, "resize", "n")} />
                <Handle position="s" onMouseDown={(e) => handleMouseDown(e, "resize", "s")} />
                <Handle position="e" onMouseDown={(e) => handleMouseDown(e, "resize", "e")} />
                <Handle position="w" onMouseDown={(e) => handleMouseDown(e, "resize", "w")} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between border-t border-border px-5 py-2.5">
        <div className="flex items-center gap-3 text-xs text-text-muted">
          {isReady ? (
            <>
              <span>Crop: {Math.round(cropWidth)} × {Math.round(cropHeight)}px</span>
              <span className="hidden sm:inline">Output: {Math.round(cropWidth)} × {Math.round(cropHeight)}px</span>
            </>
          ) : (
            <span className="flex items-center gap-1.5">
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading image...
            </span>
          )}
        </div>

        {/* Zoom controls — only when ready */}
        {isReady && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[3ch] text-center text-xs font-medium text-text-secondary">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ---- Resize handle ---- */

function Handle({
  position,
  onMouseDown,
}: {
  position: string;
  onMouseDown: (e: React.MouseEvent) => void;
}) {
  const positionStyles: Record<string, string> = {
    nw: "-left-1.5 -top-1.5 cursor-nw-resize",
    ne: "-right-1.5 -top-1.5 cursor-ne-resize",
    sw: "-left-1.5 -bottom-1.5 cursor-sw-resize",
    se: "-right-1.5 -bottom-1.5 cursor-se-resize",
    n: "left-1/2 -top-1.5 -translate-x-1/2 cursor-n-resize",
    s: "left-1/2 -bottom-1.5 -translate-x-1/2 cursor-s-resize",
    e: "-right-1.5 top-1/2 -translate-y-1/2 cursor-e-resize",
    w: "-left-1.5 top-1/2 -translate-y-1/2 cursor-w-resize",
  };

  return (
    <div
      className={`absolute z-10 h-3 w-3 rounded-full border-2 border-white bg-primary shadow-md ${positionStyles[position] ?? ""}`}
      onMouseDown={onMouseDown}
    />
  );
}
