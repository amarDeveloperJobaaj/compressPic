import { create } from "zustand";
import {
  DEFAULT_CROP,
  DEFAULT_SOCIAL_SETTINGS,
  canvasToBlob,
  renderSocialToCanvas,
  socialExt,
  type CropState,
  type SocialSettings,
} from "@/features/social-resizer/utils/social";
import { isHeicFile } from "@/lib/heic";
import { loadFileAsImage, loadImage, revokeUrl, triggerDownload } from "@/lib/image";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_SIZE = 50 * 1024 * 1024;

interface SocialState {
  originalFile: File | null;
  previewUrl: string | null;
  originalSize: number;
  naturalWidth: number;
  naturalHeight: number;
  isProcessing: boolean;
  error: string | null;

  settings: SocialSettings;
  crop: CropState;
  resultSize: number;

  setFile: (file: File) => void;
  setPreset: (preset: SocialSettings["preset"]) => void;
  setFormat: (format: SocialSettings["format"]) => void;
  setQuality: (quality: number) => void;
  setFileName: (name: string) => void;
  setCrop: (patch: Partial<CropState>) => void;
  download: () => Promise<void>;
  reset: () => void;
}

export const useSocialResizerStore = create<SocialState>((set, get) => ({
  originalFile: null,
  previewUrl: null,
  originalSize: 0,
  naturalWidth: 0,
  naturalHeight: 0,
  isProcessing: false,
  error: null,

  settings: { ...DEFAULT_SOCIAL_SETTINGS },
  crop: { ...DEFAULT_CROP },
  resultSize: 0,

  setFile: (file) => {
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

  setPreset: (preset) => set({ settings: { ...get().settings, preset }, crop: { ...DEFAULT_CROP } }),
  setFormat: (format) => set({ settings: { ...get().settings, format } }),
  setQuality: (quality) => set({ settings: { ...get().settings, quality } }),
  setFileName: (fileName) => set({ settings: { ...get().settings, fileName } }),
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

  download: async () => {
    const state = get();
    if (!state.previewUrl || state.naturalWidth === 0) return;
    if (state.isProcessing) return;

    set({ isProcessing: true, error: null });
    try {
      const img = await loadImage(state.previewUrl);
      const preset = state.settings.preset;
      const canvas = renderSocialToCanvas(img, preset.width, preset.height, state.crop);
      const blob = await canvasToBlob(canvas, state.settings.format, state.settings.quality);
      const baseName =
        state.settings.fileName.trim() ||
        state.originalFile?.name.replace(/\.[^.]+$/, "") ||
        "social-image";
      triggerDownload(
        blob,
        `${baseName}-${preset.label.toLowerCase().replace(/\s+/g, "-")}-${preset.width}x${preset.height}.${socialExt(state.settings.format)}`
      );
      set({ isProcessing: false, resultSize: blob.size });
    } catch (err) {
      set({
        isProcessing: false,
        error: err instanceof Error ? err.message : "An error occurred while resizing the image.",
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
      settings: { ...DEFAULT_SOCIAL_SETTINGS },
      crop: { ...DEFAULT_CROP },
      resultSize: 0,
    });
  },
}));
