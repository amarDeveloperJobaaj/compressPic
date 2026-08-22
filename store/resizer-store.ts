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

interface FileQueueEntry {
  file: File;
  previewUrl: string;
  size: number;
  type: string;
}

interface ResizerState {
  // Multi-file queue
  files: FileQueueEntry[];
  activeIndex: number;

  // Input
  originalFile: File | null;
  originalPreviewUrl: string | null;
  originalSize: number;
  originalType: string;

  // Image natural dimensions
  naturalWidth: number;
  naturalHeight: number;

  // Display dimensions
  displayWidth: number;
  displayHeight: number;

  // Crop state
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
  addFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  setActiveIndex: (index: number) => void;
  setDisplayDimensions: (w: number, h: number) => void;
  setCrop: (x: number, y: number, width: number, height: number) => void;
  selectRatio: (ratio: AspectRatio | null) => void;
  setCustomRatio: (width: number, height: number) => void;
  setOutputFormat: (format: "image/jpeg" | "image/png" | "image/webp") => void;
  setOutputDimensions: (w: number, h: number) => void;
  setQuality: (q: number) => void;
  crop: () => Promise<void>;
  download: () => void;
  reset: () => void;
}

async function prepareFile(file: File): Promise<FileQueueEntry> {
  const heic = isHeicFile(file);
  let source: Blob = file;

  if (heic) {
    try {
      source = await decodeHeicToJpeg(file);
    } catch {
      // Use original
    }
  }

  const previewUrl = URL.createObjectURL(source);
  return { file, previewUrl, size: file.size, type: normalizeImageType(file) };
}

function syncActive(state: ResizerState): Partial<ResizerState> {
  const entry = state.files[state.activeIndex];
  if (!entry) {
    return {
      originalFile: null,
      originalPreviewUrl: null,
      originalSize: 0,
      originalType: "",
    };
  }
  return {
    originalFile: entry.file,
    originalPreviewUrl: entry.previewUrl,
    originalSize: entry.size,
    originalType: entry.type,
  };
}

export const useResizerStore = create<ResizerState>((set, get) => ({
  files: [],
  activeIndex: 0,
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
    const state = get();
    state.files.forEach((e) => {
      if (e.previewUrl) URL.revokeObjectURL(e.previewUrl);
    });
    const prevResult = state.resultPreviewUrl;
    if (prevResult && prevResult.startsWith("blob:")) URL.revokeObjectURL(prevResult);

    set({
      files: [],
      activeIndex: 0,
      resultBlob: null,
      resultPreviewUrl: null,
      resultSize: 0,
    });

    void get().addFiles([file]);
  },

  addFiles: async (newFiles: File[]) => {
    const entries = await Promise.all(newFiles.map(prepareFile));
    set((state) => {
      const files = [...state.files, ...entries];
      const isFirst = state.files.length === 0;
      return {
        files,
        activeIndex: isFirst ? 0 : state.activeIndex,
        ...syncActive({ ...state, files, activeIndex: isFirst ? 0 : state.activeIndex }),
      };
    });

    // Load dimensions for the active file
    const state = get();
    if (state.originalPreviewUrl) {
      try {
        const img = await loadImage(state.originalPreviewUrl);
        if (get().originalPreviewUrl !== state.originalPreviewUrl) return;
        const nw = img.naturalWidth;
        const nh = img.naturalHeight;
        set({
          naturalWidth: nw,
          naturalHeight: nh,
          cropX: 0,
          cropY: 0,
          cropWidth: nw,
          cropHeight: nh,
          outputWidth: nw,
          outputHeight: nh,
          selectedRatio: null,
        });
      } catch {
        set({ error: "Failed to read the image." });
      }
    }
  },

  removeFile: (index: number) => {
    set((state) => {
      const entry = state.files[index];
      if (entry) URL.revokeObjectURL(entry.previewUrl);

      const files = state.files.filter((_, i) => i !== index);
      const activeIndex = Math.min(state.activeIndex, Math.max(0, files.length - 1));

      return {
        files,
        activeIndex,
        resultBlob: null,
        resultPreviewUrl: null,
        resultSize: 0,
        ...syncActive({ ...state, files, activeIndex }),
      };
    });
  },

  setActiveIndex: (index: number) => {
    const state = get();
    const prevResult = state.resultPreviewUrl;
    if (prevResult && prevResult.startsWith("blob:")) URL.revokeObjectURL(prevResult);

    const activeIndex = Math.max(0, Math.min(index, state.files.length - 1));
    set({
      activeIndex,
      resultBlob: null,
      resultPreviewUrl: null,
      resultSize: 0,
      ...syncActive({ ...state, activeIndex }),
    });

    // Load dimensions for the new file
    const newState = get();
    if (newState.originalPreviewUrl) {
      loadImage(newState.originalPreviewUrl)
        .then((img) => {
          if (get().originalPreviewUrl !== newState.originalPreviewUrl) return;
          const nw = img.naturalWidth;
          const nh = img.naturalHeight;
          set({
            naturalWidth: nw,
            naturalHeight: nh,
            cropX: 0,
            cropY: 0,
            cropWidth: nw,
            cropHeight: nh,
            outputWidth: nw,
            outputHeight: nh,
            selectedRatio: null,
          });
        })
        .catch(() => set({ error: "Failed to read the image." }));
    }
  },

  setDisplayDimensions: (w: number, h: number) => set({ displayWidth: w, displayHeight: h }),

  setCrop: (x: number, y: number, width: number, height: number) =>
    set({ cropX: x, cropY: y, cropWidth: width, cropHeight: height }),

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

    const imageAspect = state.naturalWidth / state.naturalHeight;
    const ratioAspect = ratio.width / ratio.height;

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
    set({ isCustomRatio: true, selectedRatio: null, customRatioWidth: width, customRatioHeight: height });

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

    set({
      cropX: (state.naturalWidth - cropW) / 2,
      cropY: (state.naturalHeight - cropH) / 2,
      cropWidth: cropW,
      cropHeight: cropH,
      outputWidth: Math.round(cropW),
      outputHeight: Math.round(cropH),
    });
  },

  setOutputFormat: (format) => set({ outputFormat: format }),
  setOutputDimensions: (w, h) => set({ outputWidth: w, outputHeight: h }),
  setQuality: (q) => set({ quality: q }),

  crop: async () => {
    const state = get();
    if (!state.originalPreviewUrl) {
      set({ error: "No image to crop." });
      return;
    }
    if (state.naturalWidth === 0 || state.naturalHeight === 0) {
      set({ error: "Image is still loading. Please wait a moment." });
      return;
    }

    const cropW = Math.round(state.cropWidth);
    const cropH = Math.round(state.cropHeight);
    if (cropW < 1 || cropH < 1) {
      set({ error: "Crop area is too small." });
      return;
    }

    const outW = Math.max(1, Math.min(state.outputWidth, 10000));
    const outH = Math.max(1, Math.min(state.outputHeight, 10000));

    set({ isProcessing: true, error: null });

    try {
      const img = await loadImage(state.originalPreviewUrl);
      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas 2D context");

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

      const resultPreviewUrl = canvas.toDataURL(state.outputFormat, state.quality);

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

      const prevUrl = state.resultPreviewUrl;
      if (prevUrl && prevUrl.startsWith("blob:")) URL.revokeObjectURL(prevUrl);

      set({ resultBlob: blob, resultPreviewUrl, resultSize: blob.size, isProcessing: false });
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

    const url = URL.createObjectURL(state.resultBlob);
    const link = document.createElement("a");
    link.href = url;
    const ext = state.resultBlob.type.includes("jpeg") ? "jpg" : state.resultBlob.type.includes("png") ? "png" : "webp";
    const originalName = state.originalFile.name.replace(/\.[^.]+$/, "") ?? "image";
    link.download = `cropped-${originalName}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  reset: () => {
    const state = get();
    state.files.forEach((e) => URL.revokeObjectURL(e.previewUrl));
    if (state.resultPreviewUrl && state.resultPreviewUrl.startsWith("blob:")) URL.revokeObjectURL(state.resultPreviewUrl);

    set({
      files: [],
      activeIndex: 0,
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
