"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Square, PaintBucket, Blend, Waves, Image as ImageIcon, Upload, Trash2 } from "lucide-react";
import { useBackgroundRemoverStore } from "@/store/background-remover-store";
import type { BackgroundType } from "@/features/background-remover/utils/compose";
import { Slider } from "./Slider";
import { cn } from "@/lib/utils";

const BG_OPTIONS: { id: BackgroundType; label: string; icon: typeof Square }[] = [
  { id: "transparent", label: "Transparent", icon: Square },
  { id: "color", label: "Solid", icon: PaintBucket },
  { id: "gradient", label: "Gradient", icon: Blend },
  { id: "blur", label: "Blur", icon: Waves },
  { id: "image", label: "Image", icon: ImageIcon },
];

const QUICK_COLORS = ["#ffffff", "#000000", "#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ec4899"];

export function BackgroundPanel() {
  const background = useBackgroundRemoverStore((s) => s.background);
  const bgImageUrl = useBackgroundRemoverStore((s) => s.bgImageUrl);
  const setBackground = useBackgroundRemoverStore((s) => s.setBackground);
  const setBgImageFile = useBackgroundRemoverStore((s) => s.setBgImageFile);
  const fileRef = useRef<HTMLInputElement>(null);

  const pickColor = (color: string) => setBackground({ color });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      {/* Type picker — 3-up on phones so longer labels (Transparent) fit,
          5-up from sm up. */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {BG_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setBackground({ type: opt.id })}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border px-1 py-2.5 text-[10px] font-medium transition-all",
              background.type === opt.id
                ? "border-primary bg-primary text-white shadow-sm"
                : "border-border bg-background text-text-secondary hover:border-primary/50 hover:text-primary"
            )}
            aria-label={`Background: ${opt.label}`}
          >
            <opt.icon className="h-4 w-4" />
            {opt.label}
          </button>
        ))}
      </div>

      {background.type === "color" && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {QUICK_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => pickColor(c)}
                className={cn(
                  "h-8 w-8 rounded-lg border-2 transition-all hover:scale-110",
                  background.color.toLowerCase() === c.toLowerCase()
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border"
                )}
                style={{ backgroundColor: c }}
                aria-label={`Set background to ${c}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
            <input
              type="color"
              value={background.color}
              onChange={(e) => pickColor(e.target.value)}
              className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
              aria-label="Custom background color"
            />
            <span className="text-[10px] text-text-muted">{background.color}</span>
          </div>
        </div>
      )}

      {background.type === "gradient" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">From</label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
              <input
                type="color"
                value={background.color}
                onChange={(e) => setBackground({ color: e.target.value })}
                className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                aria-label="Gradient start color"
              />
              <span className="text-[10px] text-text-muted">{background.color}</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">To</label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
              <input
                type="color"
                value={background.color2}
                onChange={(e) => setBackground({ color2: e.target.value })}
                className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                aria-label="Gradient end color"
              />
              <span className="text-[10px] text-text-muted">{background.color2}</span>
            </div>
          </div>
          <div className="col-span-2">
            <Slider
              label="Angle"
              value={background.gradientAngle}
              min={0}
              max={360}
              step={1}
              onChange={(v) => setBackground({ gradientAngle: v })}
              format={(v) => `${v}°`}
            />
          </div>
        </div>
      )}

      {background.type === "blur" && (
        <Slider
          label="Blur Amount"
          value={background.blurAmount}
          min={1}
          max={15}
          step={1}
          onChange={(v) => setBackground({ blurAmount: v })}
          format={(v) => `${v}%`}
        />
      )}

      {background.type === "image" && (
        <div className="space-y-3">
          <input
            ref={fileRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
            aria-hidden="true"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setBgImageFile(file);
              e.target.value = "";
            }}
          />
          {bgImageUrl ? (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bgImageUrl}
                alt="Background preview"
                className="h-12 w-12 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-text-primary">Background image</p>
                <p className="text-[10px] text-text-muted">Replace the background with any photo</p>
              </div>
              <button
                type="button"
                onClick={() => setBgImageFile(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-error-light hover:text-error"
                aria-label="Remove background image"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background px-3 py-4 text-xs font-medium text-text-secondary transition-all hover:border-primary/50 hover:text-primary"
            >
              <Upload className="h-4 w-4" />
              Upload Background Image
            </button>
          )}
          <p className="text-[10px] leading-relaxed text-text-muted">
            Your subject is placed on top of the image. Upload a JPG, PNG, or WEBP.
          </p>
        </div>
      )}
    </motion.div>
  );
}
