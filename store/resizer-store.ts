import { create } from "zustand";
import { isHeicFile, normalizeImageType, decodeHeicToJpeg } from "@/lib/heic";
import { loadImage } from "@/features/resizer/utils/resize";

export type AspectRatio = {
  label: string;
  category: string;
  width: number;
  height: number;
};

export const PRESET_RATIOS: AspectRatio[] = [
  // Passport / ID
  { label: "Passport (2×2)", category: "Passport & ID", width: 2, height: 2 },
  { label: "US Passport", category: "Passport & ID", width: 2, height: 2 },
  { label: "ID Card (1.5×1.25)", category: "Passport & ID", width: 1.5, height: 1.25 },
  { label: "Visa Photo", category: "Passport & ID", width: 2, height: 2 },

  // Document
  { label: "A4", category: "Document", width: 1, height: 1.414 },
  { label: "Letter", category: "Document", width: 8.5, height: 11 },
  { label: "Legal", category: "Document", width: 8.5, height: 14 },

  // Social Media
  { label: "Instagram Square", category: "Social Media", width: 1, height: 1 },
  { label: "Instagram Portrait", category: "Social Media", width: 4, height: 5 },
  { label: "Instagram Landscape", category: "Social Media", width: 1.91, height: 1 },
  { label: "Twitter Header", category: "Social Media", width: 3, height: 1 },
  { label: "Facebook Cover", category: "Social Media", width: 16, height: 9 },
  { label: "YouTube Thumbnail", category: "Social Media", width: 16, height: 9 },
  { label: "LinkedIn Banner", category: "Social Media", width: 4, height: 1 },
  { label: "Pinterest Pin", category: "Social Media", width: 2, height: 3 },

  // Common Ratios
  { label: "16:9 Widescreen", category: "Common Ratios", width: 16, height: 9 },
  { label: "4:3 Standard", category: "Common Ratios", width: 4, height: 3 },
  { label: "3:2 Classic", category: "Common Ratios", width: 3, height: 2 },
  { label: "1:1 Square", category: "Common Ratios", width: 1, height: 1 },
  { label: "9:16 Story", category: "Common Ratios", width: 9, height: 16 },
  { label: "21:9 Cinematic", category: "Common Ratios", width: 21, height: 9 },
];

export const OUTPUT_FORMATS = [
  { label: "PNG", value: "image/png" as const },
  { label: "JPEG", value: "image/jpeg" as const },
  { label: "WEBP", value: "image/webp" as const },
];

interface ResizerState {
  // Input
  originalFile: File | null;
  originalPreviewUrl: string | null;
  originalSize: number;
  originalType: string;

  // Image natural dimensions (for crop calculations)
  naturalWidth: number;
  naturalHeight: number;

  // Display dimensions (the size the image is rendered on screen)
  displayWidth: number;
  displayHeight: number;

  // Crop state (in natural image coordinates)
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;

  // Selected aspect ratio
  selectedRatio: AspectRatio | null;
  isCustomRatio: boolean;
  customRatioWidth: number;
  customRatioHeight: number;

  // Output settings
  outputFormat: "image/jpeg" | "image/png" | "image/webp";
  outputWidth: number;
  outputHeight: number;
  quality: number;

  // Processing
  isProcessing: boolean;
  error: string | null;

  // Result
  resultBlob: Blob | null;
  resultPreviewUrl: string | null;
  resultSize: number;

  // Actions
  setFile: (file: File) => void;
  setDisplayDimensions: (w: number, h: number) => void;
  setCrop: (x: number, y: number, width: number, height: number) => void;
  selectRatio: (ratio: AspectRatio | null) => void;
  setCustomRatio: (width: number, height: number) => void;
  setOutputFormat: (format: "image/jpeg" | "image/png" | "image/webp") => void;
  setOutputDimensions: (w: number, h: number) => void;
  setQuality: (q: number) => void;
  /** Crop the image and show the preview (no download) */
  crop: () => Promise<void>;
  /** Download the previously cropped result */
  download: () => void;
  reset: () => void;
}

export const useResizerStore = create<ResizerState>((set, get) => ({
  // Initial state
  originalFile: null,
  originalPreviewUrl: null,
  originalSize: 0,
  originalType: "",
  naturalWidth: 0,
  naturalHeight: 0,
  displayWidth: 0,
  displayHeight: 0,
  cropX: 0,
  cropY: 0,
  cropWidth: 0,
  cropHeight: 0,
  selectedRatio: null,
  isCustomRatio: false,
  customRatioWidth: 1,
  customRatioHeight: 1,
  outputFormat: "image/png",
  outputWidth: 800,
  outputHeight: 800,
  quality: 0.92,
  isProcessing: false,
  error: null,
  resultBlob: null,
  resultPreviewUrl: null,
  resultSize: 0,

  setFile: (file: File) => {
    const prevUrl = get().originalPreviewUrl;
    if (prevUrl) URL.revokeObjectURL(prevUrl);

    const prevResultUrl = get().resultPreviewUrl;
    if (prevResultUrl) URL.revokeObjectURL(prevResultUrl);

    const heic = isHeicFile(file);

    set({
      originalFile: file,
      originalPreviewUrl: null,
      originalSize: file.size,
      originalType: normalizeImageType(file),
      resultBlob: null,
      resultPreviewUrl: null,
      resultSize: 0,
      error: null,
      isProcessing: heic, // HEIC needs decoding before it can render
      selectedRatio: null,
    });

    const finish = async () => {
      // HEIC can't be rendered by <img> in most browsers — decode to JPEG first
      let source: Blob = file;
      if (heic) {
        try {
          source = await decodeHeicToJpeg(file);
        } catch {
          if (get().originalFile !== file) return;
          set({
            isProcessing: false,
            error:
              "Couldn't decode this HEIC file. Try converting it to JPG or PNG on your device first.",
          });
          return;
        }
      }

      if (get().originalFile !== file) return;

      const previewUrl = URL.createObjectURL(source);
      set({ originalPreviewUrl: previewUrl, isProcessing: false });

      // Load the image to get natural dimensions
      const img = new Image();
      img.onload = () => {
        if (get().originalPreviewUrl !== previewUrl) return;
        const nw = img.naturalWidth;
        const nh = img.naturalHeight;

        set({
          naturalWidth: nw,
          naturalHeight: nh,
          // Default crop to full image
          cropX: 0,
          cropY: 0,
          cropWidth: nw,
          cropHeight: nh,
          outputWidth: nw,
          outputHeight: nh,
        });
      };
      img.src = previewUrl;
    };

    void finish();
  },

  setDisplayDimensions: (w: number, h: number) => {
    set({ displayWidth: w, displayHeight: h });
  },

  setCrop: (x: number, y: number, width: number, height: number) => {
    set({ cropX: x, cropY: y, cropWidth: width, cropHeight: height });
  },

  selectRatio: (ratio: AspectRatio | null) => {
    const state = get();
    if (!ratio) {
      set({
        selectedRatio: null,
        isCustomRatio: false,
        cropX: 0,
        cropY: 0,
        cropWidth: state.naturalWidth,
        cropHeight: state.naturalHeight,
      });
      return;
    }

    // Calculate the crop region that best fits this ratio within the image
    const imageAspect = state.naturalWidth / state.naturalHeight;
    const ratioAspect = ratio.width / ratio.height;

    let cropW: number, cropH: number;
    if (ratioAspect > imageAspect) {
      // Ratio is wider than image — fit by width
      cropW = state.naturalWidth;
      cropH = cropW / ratioAspect;
    } else {
      // Ratio is taller than image — fit by height
      cropH = state.naturalHeight;
      cropW = cropH * ratioAspect;
    }

    const cropX = (state.naturalWidth - cropW) / 2;
    const cropY = (state.naturalHeight - cropH) / 2;

    set({
      selectedRatio: ratio,
      isCustomRatio: false,
      cropX,
      cropY,
      cropWidth: cropW,
      cropHeight: cropH,
      outputWidth: Math.round(cropW),
      outputHeight: Math.round(cropH),
    });
  },

  setCustomRatio: (width: number, height: number) => {
    const state = get();
    set({
      isCustomRatio: true,
      selectedRatio: null,
      customRatioWidth: width,
      customRatioHeight: height,
    });

    // Recalculate crop area based on custom ratio
    const ratioAspect = width / height;
    const imageAspect = state.naturalWidth / state.naturalHeight;

    let cropW: number, cropH: number;
    if (ratioAspect > imageAspect) {
      cropW = state.naturalWidth;
      cropH = cropW / ratioAspect;
    } else {
      cropH = state.naturalHeight;
      cropW = cropH * ratioAspect;
    }

    const cropX = (state.naturalWidth - cropW) / 2;
    const cropY = (state.naturalHeight - cropH) / 2;

    set({
      cropX,
      cropY,
      cropWidth: cropW,
      cropHeight: cropH,
      outputWidth: Math.round(cropW),
      outputHeight: Math.round(cropH),
    });
  },

  setOutputFormat: (format: "image/jpeg" | "image/png" | "image/webp") => {
    set({ outputFormat: format });
  },

  setOutputDimensions: (w: number, h: number) => {
    set({ outputWidth: w, outputHeight: h });
  },

  setQuality: (q: number) => {
    set({ quality: q });
  },

  crop: async () => {
    const state = get();

    if (!state.originalPreviewUrl) {
      set({ error: "No image to crop." });
      return;
    }

    if (state.naturalWidth === 0 || state.naturalHeight === 0) {
      set({ error: "Image is still loading. Please wait a moment and try again." });
      return;
    }

    const cropW = Math.round(state.cropWidth);
    const cropH = Math.round(state.cropHeight);
    if (cropW < 1 || cropH < 1) {
      set({ error: "Crop area is too small. Please adjust the crop selection." });
      return;
    }

    const outW = Math.max(1, Math.min(state.outputWidth, 10000));
    const outH = Math.max(1, Math.min(state.outputHeight, 10000));

    set({ isProcessing: true, error: null });

    try {
      // Load the original image
      const img = await loadImage(state.originalPreviewUrl);

      // Create a canvas and draw the cropped region
      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas 2D context");

      // Fill with white background for JPEG (which doesn't support transparency)
      if (state.outputFormat === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, outW, outH);
      }

      ctx.drawImage(
        img,
        Math.round(state.cropX),
        Math.round(state.cropY),
        cropW,
        cropH,
        0,
        0,
        outW,
        outH
      );

      // Generate data URL for preview (more reliable than blob URL)
      const resultPreviewUrl = canvas.toDataURL(state.outputFormat, state.quality);

      // Generate blob for download
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error("Failed to generate image blob"));
          },
          state.outputFormat,
          state.quality
        );
      });

      // Revoke old preview URL if it was a blob URL
      const prevUrl = state.resultPreviewUrl;
      if (prevUrl && prevUrl.startsWith("blob:")) {
        URL.revokeObjectURL(prevUrl);
      }

      set({
        resultBlob: blob,
        resultPreviewUrl,
        resultSize: blob.size,
        isProcessing: false,
      });
    } catch (err) {
      set({
        isProcessing: false,
        error: err instanceof Error ? err.message : "An error occurred while cropping.",
      });
    }
  },

  download: () => {
    const state = get();
    if (!state.resultBlob || !state.originalFile) return;

    const blob = state.resultBlob;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const ext = blob.type.includes("jpeg") ? "jpg" : blob.type.includes("png") ? "png" : "webp";
    const originalName = state.originalFile.name.replace(/\.[^.]+$/, "") ?? "image";
    link.download = `cropped-${originalName}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  reset: () => {
    const state = get();
    if (state.originalPreviewUrl) URL.revokeObjectURL(state.originalPreviewUrl);
    if (state.resultPreviewUrl) URL.revokeObjectURL(state.resultPreviewUrl);

    set({
      originalFile: null,
      originalPreviewUrl: null,
      originalSize: 0,
      originalType: "",
      naturalWidth: 0,
      naturalHeight: 0,
      displayWidth: 0,
      displayHeight: 0,
      cropX: 0,
      cropY: 0,
      cropWidth: 0,
      cropHeight: 0,
      selectedRatio: null,
      isCustomRatio: false,
      customRatioWidth: 1,
      customRatioHeight: 1,
      outputFormat: "image/png",
      outputWidth: 800,
      outputHeight: 800,
      quality: 0.92,
      isProcessing: false,
      error: null,
      resultBlob: null,
      resultPreviewUrl: null,
      resultSize: 0,
    });
  },
}));
