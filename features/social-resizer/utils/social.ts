/**
 * Social Media Image Resizer — platform presets + crop rendering.
 *
 * Each preset is an exact pixel dimension for a specific platform slot.
 * The image is cover-fitted into the target ratio with user zoom/pan, then
 * exported at the exact preset resolution.
 */

import { computeCoverGeom, type CoverGeom } from "@/lib/image";

export type SocialFormat = "image/png" | "image/jpeg" | "image/webp";

export interface SocialPreset {
  id: string;
  platform: string;
  label: string;
  width: number;
  height: number;
}

export const SOCIAL_PRESETS: SocialPreset[] = [
  // Instagram
  { id: "ig-post", platform: "Instagram", label: "Square Post", width: 1080, height: 1080 },
  { id: "ig-portrait", platform: "Instagram", label: "Portrait Post", width: 1080, height: 1350 },
  { id: "ig-landscape", platform: "Instagram", label: "Landscape Post", width: 1080, height: 566 },
  { id: "ig-story", platform: "Instagram", label: "Story / Reel", width: 1080, height: 1920 },
  { id: "ig-profile", platform: "Instagram", label: "Profile Photo", width: 320, height: 320 },
  // YouTube
  { id: "yt-thumb", platform: "YouTube", label: "Video Thumbnail", width: 1280, height: 720 },
  { id: "yt-channel", platform: "YouTube", label: "Channel Art", width: 2560, height: 1440 },
  { id: "yt-profile", platform: "YouTube", label: "Profile Photo", width: 800, height: 800 },
  // Facebook
  { id: "fb-cover", platform: "Facebook", label: "Cover Photo", width: 851, height: 315 },
  { id: "fb-profile", platform: "Facebook", label: "Profile Photo", width: 170, height: 170 },
  { id: "fb-post", platform: "Facebook", label: "Share Post", width: 1200, height: 630 },
  { id: "fb-event", platform: "Facebook", label: "Event Cover", width: 1920, height: 1080 },
  { id: "fb-story", platform: "Facebook", label: "Story", width: 1080, height: 1920 },
  // X / Twitter
  { id: "x-header", platform: "X / Twitter", label: "Header Photo", width: 1500, height: 500 },
  { id: "x-post", platform: "X / Twitter", label: "In-Stream Post", width: 1600, height: 900 },
  { id: "x-profile", platform: "X / Twitter", label: "Profile Photo", width: 400, height: 400 },
  // LinkedIn
  { id: "li-banner", platform: "LinkedIn", label: "Company Banner", width: 1584, height: 396 },
  { id: "li-profile", platform: "LinkedIn", label: "Profile Photo", width: 400, height: 400 },
  { id: "li-post", platform: "LinkedIn", label: "Share Post", width: 1200, height: 627 },
  // Pinterest
  { id: "pin-pin", platform: "Pinterest", label: "Standard Pin", width: 1000, height: 1500 },
  // TikTok
  { id: "tt-video", platform: "TikTok", label: "Video / Cover", width: 1080, height: 1920 },
];

export const SOCIAL_PLATFORMS: string[] = [
  "Instagram",
  "YouTube",
  "Facebook",
  "X / Twitter",
  "LinkedIn",
  "Pinterest",
  "TikTok",
];

export interface CropState {
  zoom: number;
  panX: number;
  panY: number;
}

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 6;
export const DEFAULT_CROP: CropState = { zoom: 1, panX: 0, panY: 0 };

export interface SocialSettings {
  preset: SocialPreset;
  format: SocialFormat;
  quality: number;
  fileName: string;
}

export const DEFAULT_SOCIAL_SETTINGS: SocialSettings = {
  preset: SOCIAL_PRESETS[0],
  format: "image/jpeg",
  quality: 0.92,
  fileName: "",
};

export const SOCIAL_OUTPUT_FORMATS: { value: SocialFormat; label: string }[] = [
  { value: "image/jpeg", label: "JPG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WEBP" },
];

/** Cover-fit + zoom + pan geometry for the given output box. */
export function cropGeom(
  imgWidth: number,
  imgHeight: number,
  outWidth: number,
  outHeight: number,
  crop: CropState
): CoverGeom {
  return computeCoverGeom(imgWidth, imgHeight, outWidth, outHeight, crop.zoom, crop.panX, crop.panY);
}

/** Render the cropped image at the exact preset resolution. */
export function renderSocialToCanvas(
  img: HTMLImageElement,
  width: number,
  height: number,
  crop: CropState
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is not available");
  const g = cropGeom(img.naturalWidth, img.naturalHeight, width, height, crop);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, g.x, g.y, g.dw, g.dh);
  return canvas;
}

/** Canvas → Blob at the given format/quality. */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: SocialFormat,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate image blob"));
      },
      format,
      format === "image/jpeg" || format === "image/webp" ? quality : undefined
    );
  });
}

/** File extension for an output format. */
export function socialExt(format: SocialFormat): string {
  if (format === "image/jpeg") return "jpg";
  if (format === "image/webp") return "webp";
  return "png";
}
