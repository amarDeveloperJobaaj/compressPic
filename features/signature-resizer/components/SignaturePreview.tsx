"use client";

import { useEffect, useRef } from "react";
import { useSignatureResizerStore } from "@/store/signature-resizer-store";
import { renderSignatureToCanvas } from "@/features/signature-resizer/utils/signature";
import { loadImage } from "@/lib/image";

/** Live preview of the resized signature at its exact output pixel size. */
export function SignaturePreview() {
  const previewUrl = useSignatureResizerStore((s) => s.previewUrl);
  const settings = useSignatureResizerStore((s) => s.settings);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !previewUrl) return;
    let cancelled = false;

    loadImage(previewUrl)
      .then((img) => {
        if (cancelled || !canvasRef.current) return;
        const rendered = renderSignatureToCanvas(
          img,
          settings.size.width,
          settings.size.height,
          settings.format
        );
        canvas.width = rendered.width;
        canvas.height = rendered.height;
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
  }, [previewUrl, settings.size, settings.format]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold text-text-primary">Preview</h2>
        <p className="text-[11px] text-text-muted">
          {settings.size.width} × {settings.size.height} px ·{" "}
          {settings.format === "image/png" ? "transparent background" : "white background"}
        </p>
      </div>

      <div className="flex items-center justify-center p-5">
        <div className="max-h-[420px] overflow-hidden rounded-xl border border-border bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#f8fafc_0%_50%)] bg-[length:16px_16px] dark:bg-[repeating-conic-gradient(#334155_0%_25%,#1e293b_0%_50%)]">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Resized signature preview"
            className="max-h-[420px] w-auto"
            style={{ maxWidth: "100%" }}
          />
        </div>
      </div>

      <p className="border-t border-border px-5 py-3 text-center text-xs text-text-muted">
        The checkerboard shows transparency — PNG keeps it, JPG fills it with white.
      </p>
    </div>
  );
}
