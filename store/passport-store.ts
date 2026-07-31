import { create } from "zustand";
import {
  DEFAULT_CROP,
  SHEET_PRESETS,
  canvasToBlob,
  passportBaseName,
  passportExt,
  renderPassportToCanvas,
  renderSheetToCanvas,
  sizePixels,
  type CropState,
  type PassportFormat,
  type PassportSize,
} from "@/features/passport/utils/passport";
import { isHeicFile } from "@/lib/heic";
import { loadFileAsImage, loadImage, revokeUrl, triggerDownload } from "@/lib/image";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_SIZE = 50 * 1024 * 1024;

const DEFAULT_SIZE: PassportSize = {
  id: "us",
  label: "United States",
  widthMm: 51,
  heightMm: 51,
  dpi: 300,
};

interface PassportState {
  // Input
  originalFile: File | null;
  previewUrl: string | null;
  originalSize: number;
  naturalWidth: number;
  naturalHeight: number;
  isProcessing: boolean;
  error: string | null;

  // Settings
  size: PassportSize;
  background: string;
  replaceWhite: boolean;
  tolerance: number;
  crop: CropState;
  format: PassportFormat;
  quality: number;
  sheetId: string;
  fileName: string;

  // Last export size (for the UI)
  resultSize: number;

  // Actions
  setFile: (file: File) => void;
  setSize: (size: PassportSize) => void;
  setBackground: (color: string) => void;
  setReplaceWhite: (v: boolean) => void;
  setTolerance: (n: number) => void;
  setCrop: (patch: Partial<CropState>) => void;
  setFormat: (f: PassportFormat) => void;
  setQuality: (q: number) => void;
  setSheetId: (id: string) => void;
  setFileName: (name: string) => void;
  downloadSingle: () => Promise<void>;
  downloadSheet: () => Promise<void>;
  reset: () => void;
}

export const usePassportStore = create<PassportState>((set, get) => ({
  originalFile: null,
  previewUrl: null,
  originalSize: 0,
  naturalWidth: 0,
  naturalHeight: 0,
  isProcessing: false,
  error: null,

  size: { ...DEFAULT_SIZE },
  background: "#FFFFFF",
  replaceWhite: true,
  tolerance: 2,
  crop: { ...DEFAULT_CROP },
  format: "image/jpeg",
  quality: 0.95,
  sheetId: SHEET_PRESETS[0].id,
  fileName: "",

  resultSize: 0,

  setFile: (file: File) => {
    // Note: some platforms (Windows/Android) report an empty MIME type for HEIC,
    // so accept files whose extension marks them as HEIC too.
    if (!ACCEPTED_TYPES.includes(file.type) && !isHeicFile(file)) {
      set({ error: "Please choose a JPG, PNG, WEBP, or HEIC image." });
      return;
    }
    if (file.size > MAX_SIZE) {
      set({ error: "That file is over 50 MB. Please choose a smaller image." });
      return;
    }

    revokeUrl(get().previewUrl);
    set({
      originalFile: file,
      originalSize: file.size,
      naturalWidth: 0,
      naturalHeight: 0,
      crop: { ...DEFAULT_CROP },
      error: null,
      isProcessing: true,
      resultSize: 0,
    });

    loadFileAsImage(file)
      .then(({ url, img }) => {
        set({
          previewUrl: url,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          isProcessing: false,
        });
      })
      .catch(() => {
        revokeUrl(get().previewUrl);
        set({
          previewUrl: null,
          originalFile: null,
          isProcessing: false,
          error: "Could not read that image. Please try another file.",
        });
      });
  },

  setSize: (size) => set({ size, crop: { ...DEFAULT_CROP } }),
  setBackground: (background) => set({ background }),
  setReplaceWhite: (replaceWhite) => set({ replaceWhite }),
  setTolerance: (tolerance) => set({ tolerance: Math.max(0, Math.min(30, tolerance)) }),
  setCrop: (patch) =>
    set({
      crop: {
        ...get().crop,
        ...patch,
        zoom: patch.zoom !== undefined ? Math.max(1, Math.min(6, patch.zoom)) : get().crop.zoom,
        panX: patch.panX !== undefined ? Math.max(-1, Math.min(1, patch.panX)) : get().crop.panX,
        panY: patch.panY !== undefined ? Math.max(-1, Math.min(1, patch.panY)) : get().crop.panY,
      },
    }),
  setFormat: (format) => set({ format }),
  setQuality: (quality) => set({ quality }),
  setSheetId: (sheetId) => set({ sheetId }),
  setFileName: (fileName) => set({ fileName }),

  downloadSingle: async () => {
    const state = get();
    if (!state.previewUrl || state.naturalWidth === 0) return;
    if (state.isProcessing) return;

    set({ isProcessing: true, error: null });
    try {
      const img = await loadImage(state.previewUrl);
      const { width, height } = sizePixels(state.size);
      const canvas = renderPassportToCanvas(img, width, height, state.crop, {
        background: state.background,
        replaceWhite: state.replaceWhite,
        tolerance: state.tolerance,
      });
      const blob = await canvasToBlob(canvas, state.format, state.quality);
      triggerDownload(blob, downloadName(state, state.fileName, "single"));
      set({ isProcessing: false, resultSize: blob.size });
    } catch (err) {
      set({
        isProcessing: false,
        error: err instanceof Error ? err.message : "An error occurred while generating the photo.",
      });
    }
  },

  downloadSheet: async () => {
    const state = get();
    if (!state.previewUrl || state.naturalWidth === 0) return;
    if (state.isProcessing) return;

    const sheet = SHEET_PRESETS.find((s) => s.id === state.sheetId) ?? SHEET_PRESETS[0];
    set({ isProcessing: true, error: null });
    try {
      const img = await loadImage(state.previewUrl);
      const canvas = renderSheetToCanvas(img, state.size, state.crop, sheet, {
        background: state.background,
        replaceWhite: state.replaceWhite,
        tolerance: state.tolerance,
      });
      const blob = await canvasToBlob(canvas, "image/jpeg", state.quality);
      triggerDownload(blob, downloadName(state, state.fileName, `sheet-${sheet.id}`));
      set({ isProcessing: false, resultSize: blob.size });
    } catch (err) {
      set({
        isProcessing: false,
        error: err instanceof Error ? err.message : "An error occurred while generating the sheet.",
      });
    }
  },

  reset: () => {
    revokeUrl(get().previewUrl);
    set({
      originalFile: null,
      previewUrl: null,
      originalSize: 0,
      naturalWidth: 0,
      naturalHeight: 0,
      isProcessing: false,
      error: null,
      crop: { ...DEFAULT_CROP },
      resultSize: 0,
    });
  },
}));

function downloadName(
  state: PassportState,
  fileName: string,
  kind: "single" | `sheet-${string}`
): string {
  const base = fileName.trim() || passportBaseName(state.size);
  return `${base}-${kind}.${kind === "single" ? passportExt(state.format) : "jpg"}`;
}

