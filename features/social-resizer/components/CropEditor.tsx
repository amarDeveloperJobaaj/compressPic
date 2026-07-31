"use client";

import { useCallback, useEffect, useRef } from "react";
import { RotateCcw, Move } from "lucide-react";
import { useSocialResizerStore } from "@/store/social-resizer-store";
import {
  MAX_ZOOM,
  MIN_ZOOM,
  cropGeom,
  renderSocialToCanvas,
} from "@/features/social-resizer/utils/social";
import { loadImage } from "@/lib/image";

/**
 * Live crop preview for social presets. Renders at the exact output pixel
 * size and displays it scaled via CSS. Drag to position, scroll to zoom.
 */
export function CropEditor() {
  const previewUrl = useSocialResizerStore((s) => s.previewUrl);
  const naturalWidth = useSocialResizerStore((s) => s.naturalWidth);
  const naturalHeight = useSocialResizerStore((s) => s.naturalHeight);
  const preset = useSocialResizerStore((s) => s.settings.preset);
  const crop = useSocialResizerStore((s) => s.crop);
  const setCrop = useSocialResizerStore((s) => s.setCrop);

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
        canvas.width = preset.width;
        canvas.height = preset.height;
        const rendered = renderSocialToCanvas(img, preset.width, preset.height, crop);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(rendered, 0, 0);
      })
      .catch(() => {
        /* preview is best-effort */
      });

    return () => {
      cancelled = true;
    };
  }, [previewUrl, preset, crop]);

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

      // Convert screen-space drag to output pixels (canvas may be CSS-scaled)
      const rect = canvas.getBoundingClientRect();
      const pxPerScreenX = rect.width > 0 ? canvas.width / rect.width : 1;
      const pxPerScreenY = rect.height > 0 ? canvas.height / rect.height : 1;
      const dx = (e.clientX - drag.x) * pxPerScreenX;
      const dy = (e.clientY - drag.y) * pxPerScreenY;

      // 1:1 cursor tracking: dPan = -dx / maxDx
      const g = cropGeom(naturalWidth, naturalHeight, canvas.width, canvas.height, crop);
      setCrop({
        panX: g.maxDx > 0 ? drag.panX - dx / g.maxDx : 0,
        panY: g.maxDy > 0 ? drag.panY - dy / g.maxDy : 0,
      });
    },
    [crop, naturalWidth, naturalHeight, setCrop]
  );

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Preview</h2>
          <p className="text-[11px] text-text-muted">
            {preset.platform} · {preset.label} · {preset.width} × {preset.height} px
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
            aria-label="Social image preview — drag to position, scroll to zoom"
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
            <label htmlFor="social-zoom" className="text-xs font-medium text-text-secondary">
              Zoom
            </label>
            <span className="text-xs font-medium text-text-primary">
              {Math.round(crop.zoom * 100)}%
            </span>
          </div>
          <input
            id="social-zoom"
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
          Drag to position the image · scroll or use the slider to zoom
        </p>
      </div>
    </div>
  );
}
