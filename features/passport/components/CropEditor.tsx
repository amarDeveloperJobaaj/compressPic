"use client";

import { useCallback, useEffect, useRef } from "react";
import { RotateCcw, Move } from "lucide-react";
import { usePassportStore } from "@/store/passport-store";
import {
  MAX_ZOOM,
  MIN_ZOOM,
  computeDrawGeom,
  renderPassportToCanvas,
  sizePixels,
} from "@/features/passport/utils/passport";
import { loadImage } from "@/lib/image";

/**
 * Live passport preview. Renders the photo at its exact output pixel size and
 * displays it scaled via CSS, so "what you see is what you get" for the print.
 * Drag to position the face (the photo follows the cursor), scroll to zoom.
 */
export function CropEditor() {
  const previewUrl = usePassportStore((s) => s.previewUrl);
  const naturalWidth = usePassportStore((s) => s.naturalWidth);
  const naturalHeight = usePassportStore((s) => s.naturalHeight);
  const size = usePassportStore((s) => s.size);
  const background = usePassportStore((s) => s.background);
  const replaceWhite = usePassportStore((s) => s.replaceWhite);
  const tolerance = usePassportStore((s) => s.tolerance);
  const crop = usePassportStore((s) => s.crop);
  const setCrop = usePassportStore((s) => s.setCrop);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const zoomRef = useRef(crop.zoom);

  useEffect(() => {
    zoomRef.current = crop.zoom;
  }, [crop.zoom]);

  // Redraw whenever anything that affects the render changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !previewUrl) return;
    let cancelled = false;

    loadImage(previewUrl)
      .then((img) => {
        if (cancelled || !canvasRef.current) return;
        const { width, height } = sizePixels(size);
        canvas.width = width;
        canvas.height = height;
        const rendered = renderPassportToCanvas(img, width, height, crop, {
          background,
          replaceWhite,
          tolerance,
        });
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(rendered, 0, 0);
      })
      .catch(() => {
        /* preview is best-effort */
      });

    return () => {
      cancelled = true;
    };
  }, [previewUrl, size, background, replaceWhite, tolerance, crop]);

  // Wheel zoom via a native non-passive listener — React's synthetic wheel is
  // passive at the root, so preventDefault() there would be ignored.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      setCrop({ zoom: zoomRef.current * factor });
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [setCrop]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = { x: e.clientX, y: e.clientY, panX: crop.panX, panY: crop.panY };
    },
    [crop.panX, crop.panY]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const drag = dragRef.current;
      if (!drag) return;
      const canvas = canvasRef.current;
      if (!canvas || naturalWidth === 0 || naturalHeight === 0) return;

      // Convert screen-space drag to output pixels (the canvas may be CSS-scaled)
      const rect = canvas.getBoundingClientRect();
      const pxPerScreenX = rect.width > 0 ? canvas.width / rect.width : 1;
      const pxPerScreenY = rect.height > 0 ? canvas.height / rect.height : 1;
      const dx = (e.clientX - drag.x) * pxPerScreenX;
      const dy = (e.clientY - drag.y) * pxPerScreenY;

      // Pan is normalized to the current visible-window geometry, so the photo
      // tracks the cursor 1:1: dPan = -dx / maxDx (maxDx = (dw - outW) / 2).
      const g = computeDrawGeom(naturalWidth, naturalHeight, canvas.width, canvas.height, crop);
      const maxDx = (g.dw - canvas.width) / 2;
      const maxDy = (g.dh - canvas.height) / 2;

      setCrop({
        panX: maxDx > 0 ? drag.panX - dx / maxDx : 0,
        panY: maxDy > 0 ? drag.panY - dy / maxDy : 0,
      });
    },
    [crop, naturalWidth, naturalHeight, setCrop]
  );

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const { width, height } = sizePixels(size);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Preview</h2>
          <p className="text-[11px] text-text-muted">
            {size.label} · {width} × {height} px @ {size.dpi} DPI
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCrop({ zoom: 1, panX: 0, panY: 0 })}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset view
        </button>
      </div>

      <div className="flex flex-col items-center gap-4 p-5">
        <div
          className="flex w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#f8fafc_0%_50%)] bg-[length:16px_16px] dark:bg-[repeating-conic-gradient(#334155_0%_25%,#1e293b_0%_50%)]"
          style={{ maxHeight: 420 }}
        >
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Passport photo preview — drag to position, scroll to zoom"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="max-h-[420px] w-auto cursor-grab touch-none select-none active:cursor-grabbing"
            style={{ maxWidth: "100%" }}
          />
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="passport-zoom" className="text-xs font-medium text-text-secondary">
              Zoom
            </label>
            <span className="text-xs font-medium text-text-primary">
              {Math.round(crop.zoom * 100)}%
            </span>
          </div>
          <input
            id="passport-zoom"
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.05}
            value={crop.zoom}
            onChange={(e) => setCrop({ zoom: Number.parseFloat(e.target.value) })}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
            aria-label="Zoom"
          />
        </div>

        <p className="flex items-center gap-1.5 text-xs text-text-muted">
          <Move className="h-3.5 w-3.5" />
          Drag to position the face · scroll or use the slider to zoom
        </p>
      </div>
    </div>
  );
}
