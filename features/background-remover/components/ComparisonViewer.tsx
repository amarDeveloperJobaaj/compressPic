"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  MoveHorizontal,
  Columns2,
  SquareSplitHorizontal,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Brush,
  Eraser,
  MousePointer2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useBackgroundRemoverStore } from "@/store/background-remover-store";
import { composeImage, loadImage } from "@/features/background-remover/utils/compose";
import { cn } from "@/lib/utils";

type ViewMode = "slider" | "side" | "split";

const MAX_PREVIEW_HEIGHT = 540;

// Module-level ref for stable pan tracking across renders
const isPanningRef = { current: false };

export function ComparisonViewer() {
  const items = useBackgroundRemoverStore((s) => s.items);
  const activeIndex = useBackgroundRemoverStore((s) => s.activeIndex);
  const background = useBackgroundRemoverStore((s) => s.background);
  const bgImage = useBackgroundRemoverStore((s) => s.bgImage);
  const adjustments = useBackgroundRemoverStore((s) => s.adjustments);
  const edge = useBackgroundRemoverStore((s) => s.edge);
  const isProcessing = useBackgroundRemoverStore((s) => s.isProcessing);
  const progress = useBackgroundRemoverStore((s) => s.progress);
  const stage = useBackgroundRemoverStore((s) => s.stage);
  const maskVersion = useBackgroundRemoverStore((s) => s.maskVersion);
  const fullRecompose = useBackgroundRemoverStore((s) => s.fullRecompose);

  const beginStroke = useBackgroundRemoverStore((s) => s.beginStroke);
  const paintMask = useBackgroundRemoverStore((s) => s.paintMask);
  const endStroke = useBackgroundRemoverStore((s) => s.endStroke);

  const item = activeIndex >= 0 ? items[activeIndex] : undefined;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseImgRef = useRef<HTMLImageElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [viewMode, setViewMode] = useState<ViewMode>("slider");
  // Mirror of splitRef — state so the render callback re-fires on handle drags
  const [splitRatio, setSplitRatio] = useState(0.5);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [loadedTick, setLoadedTick] = useState(0);
  // Brush cursor position relative to the preview container (follows pointer)
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  const panRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const splitRef = useRef(0.5);
  const draggingSplitRef = useRef(false);
  const brushingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  // Image placement (fit + zoom + pan) computed during render; reused to map
  // pointer events back to image coordinates for brush/pan/split dragging.
  const layoutRef = useRef({ imgX: 0, imgY: 0, imgW: 0, imgH: 0 });
  // Stable mirror of canBrush for use inside stable callbacks (synced in an
  // effect so we never write refs during render)
  const canBrushRef = useRef(false);

  const canBrush = item?.mask != null && edge.brushMode != null;

  // Sync the ref mirror after render/commit — pointer events always fire
  // after effects, so this is never stale when a handler runs.
  useEffect(() => {
    canBrushRef.current = canBrush;
  }, [canBrush]);

  // Load the base image for the active item
  useEffect(() => {
    if (!item?.workUrl) {
      baseImgRef.current = null;
      return;
    }
    let cancelled = false;
    loadImage(item.workUrl)
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
  }, [item?.workUrl]);

  // Load the replacement background image
  useEffect(() => {
    bgImageRef.current = bgImage;
  }, [bgImage]);

  // Size the canvas to the container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateSize = () => {
      if (!item) return;
      const rect = container.getBoundingClientRect();
      const maxW = Math.max(200, rect.width);
      const ratio = item.workW / item.workH;
      let width = maxW;
      let height = width / ratio;
      if (height > MAX_PREVIEW_HEIGHT) {
        height = MAX_PREVIEW_HEIGHT;
        width = height * ratio;
      }
      setCanvasSize({ width: Math.max(1, Math.round(width)), height: Math.max(1, Math.round(height)) });
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [item?.workW, item?.workH, item?.workUrl, item?.mask != null]);

  // Re-render the preview canvas
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const base = baseImgRef.current;
    if (!canvas || !base || canvasSize.width === 0) return;
    if (!item || !item.mask) {
      // Nothing processed yet — draw the original
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, 0, 0, canvas.width, canvas.height);
      return;
    }

    // Full-resolution result canvas (cache across renders)
    if (!resultCanvasRef.current) resultCanvasRef.current = document.createElement("canvas");
    const result = resultCanvasRef.current;
    if (result.width !== item.workW || result.height !== item.workH) {
      result.width = item.workW;
      result.height = item.workH;
    }
    composeImage(
      base,
      item.mask,
      background,
      adjustments,
      item.workW,
      item.workH,
      bgImageRef.current,
      result
    );

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = zoomRef.current;
    const panX = panRef.current.x;
    const panY = panRef.current.y;

    // Fit the work image into the canvas
    const fit = Math.min(canvas.width / item.workW, canvas.height / item.workH);
    const imgW = item.workW * fit * scale;
    const imgH = item.workH * fit * scale;
    const imgX = (canvas.width - imgW) / 2 + panX;
    const imgY = (canvas.height - imgH) / 2 + panY;

    const drawFull = (source: CanvasImageSource) => {
      ctx.drawImage(source, imgX, imgY, imgW, imgH);
    };

    if (viewMode === "side") {
      // Side by side: fit each complete image into its own half so the
      // original (left) and result (right) are both fully visible. Clipping
      // the same full-canvas fit into each half only showed the outer edges.
      const halfW = canvas.width / 2;
      const fitHalf = Math.min(halfW / item.workW, canvas.height / item.workH);
      const imgW2 = item.workW * fitHalf * scale;
      const imgH2 = item.workH * fitHalf * scale;
      const imgX2 = (halfW - imgW2) / 2 + panX;
      const imgY2 = (canvas.height - imgH2) / 2 + panY;

      // Pointer mapping targets the result (right half)
      layoutRef.current = { imgX: halfW + imgX2, imgY: imgY2, imgW: imgW2, imgH: imgH2 };

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, halfW, canvas.height);
      ctx.clip();
      ctx.drawImage(base, imgX2, imgY2, imgW2, imgH2);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.rect(halfW, 0, halfW, canvas.height);
      ctx.clip();
      ctx.drawImage(result, halfW + imgX2, imgY2, imgW2, imgH2);
      ctx.restore();

      // Divider
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillRect(halfW - 1, 0, 2, canvas.height);
    } else {
      // Remember placement for pointer mapping (slider & split use the full fit)
      layoutRef.current = { imgX, imgY, imgW, imgH };
    }

    if (viewMode === "split") {
      // Top half = original, bottom half = result
      const splitY = splitRatio * canvas.height;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, canvas.width, splitY);
      ctx.clip();
      drawFull(base);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, splitY, canvas.width, canvas.height - splitY);
      ctx.clip();
      drawFull(result);
      ctx.restore();

      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillRect(0, splitY - 1, canvas.width, 2);
    } else {
      // Slider: left of handle = original, right = result
      const splitX = splitRatio * canvas.width;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, canvas.height);
      ctx.clip();
      drawFull(base);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.rect(splitX, 0, canvas.width - splitX, canvas.height);
      ctx.clip();
      drawFull(result);
      ctx.restore();

      // Handle
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fillRect(splitX - 1.5, 0, 3, canvas.height);
      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.arc(splitX, canvas.height / 2, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(splitX, canvas.height / 2, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Labels
    ctx.font = "600 11px Inter, system-ui, sans-serif";
    const label = (text: string, x: number, y: number, bg: string) => {
      const w = ctx.measureText(text).width + 14;
      ctx.fillStyle = bg;
      ctx.fillRect(x, y - 12, w, 22);
      ctx.fillStyle = "#fff";
      ctx.fillText(text, x + 7, y + 5);
    };
    if (viewMode === "side") {
      label("Before", 10, 30, "rgba(0,0,0,0.65)");
      label("After", canvas.width / 2 + 10, 30, "rgba(37,99,235,0.85)");
    } else {
      label("Before", 10, 30, "rgba(0,0,0,0.65)");
      label("After", Math.max(10, canvas.width - 74), 30, "rgba(37,99,235,0.85)");
    }
    // zoom/pan/splitRatio drive the view transform and MUST be in the deps so
    // the canvas redraws when the user zooms, pans, or drags the handle.
  }, [canvasSize, item, background, adjustments, viewMode, loadedTick, maskVersion, fullRecompose, zoom, pan, splitRatio]);

  useEffect(() => {
    const id = requestAnimationFrame(render);
    return () => cancelAnimationFrame(id);
  }, [render]);

  // Sync pan/zoom refs
  useEffect(() => {
    panRef.current = pan;
    zoomRef.current = zoom;
  }, [pan, zoom]);

  // Zoom around the center
  const applyZoom = useCallback((factor: number) => {
    setZoom((z) => {
      const next = Math.max(1, Math.min(6, z * factor));
      return next;
    });
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void el.requestFullscreen();
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  /** Map pointer event → normalized image coords (0..1) using the current layout. */
  const pointerToImage = useCallback((e: { clientX: number; clientY: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const { imgX, imgY, imgW, imgH } = layoutRef.current;
    const nx = (e.clientX - rect.left - imgX) / imgW;
    const ny = (e.clientY - rect.top - imgY) / imgH;
    if (nx < 0 || nx > 1 || ny < 0 || ny > 1) return null;
    return { x: nx, y: ny };
  }, []);

  /** Update the brush cursor position relative to the preview container. */
  const updateCursorPos = useCallback((clientX: number, clientY: number) => {
    // Only track the ring while a brush tool is armed (avoids re-renders)
    if (!canBrushRef.current) return;
    const container = containerRef.current;
    if (!container) return;
    const contRect = container.getBoundingClientRect();
    setCursorPos({ x: clientX - contRect.left, y: clientY - contRect.top });
  }, []);

  // Pointer handling: handle drag (slider/split), brush, and pan
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      lastPointRef.current = { x: e.clientX, y: e.clientY };
      updateCursorPos(e.clientX, e.clientY);

      // Handle drag (slider = vertical line, split = horizontal line)
      const rect = canvas.getBoundingClientRect();
      if (viewMode === "slider") {
        const x = (e.clientX - rect.left) / rect.width;
        if (Math.abs(x - splitRef.current) < 0.04) {
          draggingSplitRef.current = true;
          splitRef.current = Math.max(0, Math.min(1, x));
          setSplitRatio(splitRef.current);
          return;
        }
      } else if (viewMode === "split") {
        const y = (e.clientY - rect.top) / rect.height;
        if (Math.abs(y - splitRef.current) < 0.04) {
          draggingSplitRef.current = true;
          splitRef.current = Math.max(0, Math.min(1, y));
          setSplitRatio(splitRef.current);
          return;
        }
      }

      if (canBrush) {
        const point = pointerToImage(e);
        if (point) {
          brushingRef.current = true;
          beginStroke();
          paintMask(point.x, point.y);
          return;
        }
      }

      if (zoom > 1) {
        isPanningRef.current = true;
        setIsPanning(true);
      }
    },
    [viewMode, canBrush, zoom, beginStroke, paintMask, pointerToImage, updateCursorPos]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      updateCursorPos(e.clientX, e.clientY);

      if (draggingSplitRef.current) {
        if (viewMode === "slider") {
          const x = (e.clientX - rect.left) / rect.width;
          splitRef.current = Math.max(0, Math.min(1, x));
        } else {
          const y = (e.clientY - rect.top) / rect.height;
          splitRef.current = Math.max(0, Math.min(1, y));
        }
        setSplitRatio(splitRef.current);
        return;
      }

      if (brushingRef.current) {
        const point = pointerToImage(e);
        if (point) paintMask(point.x, point.y);
        return;
      }

      if (isPanningRef.current) {
        const dx = e.clientX - lastPointRef.current.x;
        const dy = e.clientY - lastPointRef.current.y;
        lastPointRef.current = { x: e.clientX, y: e.clientY };
        setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
      }
    },
    [viewMode, paintMask, pointerToImage, updateCursorPos]
  );

  const handlePointerUp = useCallback(() => {
    // Only end a stroke when one was actually in progress (pan / handle drags
    // shouldn't bump the recompose counter).
    const wasBrushing = brushingRef.current;
    draggingSplitRef.current = false;
    brushingRef.current = false;
    isPanningRef.current = false;
    setIsPanning(false);
    if (wasBrushing) endStroke();
  }, [endStroke]);

  // Wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      applyZoom(e.deltaY < 0 ? 1.1 : 0.9);
    },
    [applyZoom]
  );

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setViewMode("slider")}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors",
              viewMode === "slider" ? "bg-primary text-white" : "text-text-secondary hover:bg-primary-light hover:text-primary"
            )}
            aria-label="Slider comparison"
          >
            <MoveHorizontal className="h-3.5 w-3.5" />
            Slider
          </button>
          <button
            type="button"
            onClick={() => setViewMode("side")}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors",
              viewMode === "side" ? "bg-primary text-white" : "text-text-secondary hover:bg-primary-light hover:text-primary"
            )}
            aria-label="Side by side"
          >
            <Columns2 className="h-3.5 w-3.5" />
            Side by Side
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors",
              viewMode === "split" ? "bg-primary text-white" : "text-text-secondary hover:bg-primary-light hover:text-primary"
            )}
            aria-label="Split view"
          >
            <SquareSplitHorizontal className="h-3.5 w-3.5" />
            Split
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {canBrush && (
            <span
              className={cn(
                "mr-1 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium",
                edge.brushMode === "restore"
                  ? "bg-success-light text-success"
                  : edge.brushMode === "erase"
                    ? "bg-error-light text-error"
                    : "bg-background text-text-muted"
              )}
            >
              {edge.brushMode === "restore" ? (
                <>
                  <Brush className="h-3 w-3" /> Restoring
                </>
              ) : edge.brushMode === "erase" ? (
                <>
                  <Eraser className="h-3 w-3" /> Erasing
                </>
              ) : (
                <MousePointer2 className="h-3 w-3" />
              )}
            </span>
          )}
          <button
            type="button"
            onClick={() => applyZoom(1.25)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => applyZoom(0.8)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-[11px] text-text-muted">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={resetView}
            className="flex h-8 items-center rounded-lg px-2.5 text-xs font-medium text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)_0_0/16px_16px] dark:bg-[repeating-conic-gradient(#334155_0%_25%,transparent_0%_50%)_0_0/16px_16px] p-4"
      >
        {canvasSize.width > 0 && loadedTick > 0 ? (
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
              touchAction: "none",
              cursor: canBrush
                ? "none"
                : isPanning
                  ? "grabbing"
                  : zoom > 1
                    ? "grab"
                    : "crosshair",
            }}
            className="max-w-full rounded-lg shadow-lg"
            aria-label="Background removal preview — drag to compare or paint"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 p-16 text-text-muted">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-xs">Loading image…</p>
          </div>
        )}

        {/* Brush cursor — follows the pointer while a brush tool is active */}
        {canBrush && edge.brushMode && cursorPos && (
          <div
            className="pointer-events-none absolute z-10 rounded-full border-2 bg-white/10"
            style={{
              width: `${Math.max(10, edge.brushSize * (canvasSize.width / 800))}px`,
              height: `${Math.max(10, edge.brushSize * (canvasSize.width / 800))}px`,
              borderColor: edge.brushMode === "erase" ? "#ef4444" : "#22c55e",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.6)",
              left: `${cursorPos.x - Math.max(10, edge.brushSize * (canvasSize.width / 800)) / 2}px`,
              top: `${cursorPos.y - Math.max(10, edge.brushSize * (canvasSize.width / 800)) / 2}px`,
            }}
            aria-hidden="true"
          />
        )}

        {/* Processing overlay */}
        {(item.status === "processing" || (isProcessing && item.status === "queued")) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-background/70 backdrop-blur-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25">
              <Sparkles className="h-7 w-7 animate-pulse" />
            </div>
            <p className="text-sm font-medium text-text-primary">{stage || "Removing background…"}</p>
            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-primary transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-text-muted">{progress}%</p>
          </div>
        )}

        {item.status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/80 p-6 text-center">
            <p className="max-w-xs text-sm text-error">{item.error || "Background removal failed."}</p>
          </div>
        )}
      </div>

      {/* Info bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2.5">
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span>
            {item.workW}×{item.workH}px
          </span>
          <span className="text-text-muted">&middot;</span>
          <span>{item.name}</span>
        </div>
        {item.provider && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-2.5 py-0.5 text-[10px] font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            {item.provider}
          </span>
        )}
      </div>
    </motion.div>
  );
}


