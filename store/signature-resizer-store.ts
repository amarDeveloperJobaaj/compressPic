import { create } from "zustand";
import {
  DEFAULT_SIGNATURE_SETTINGS,
  fitToTargetKb,
  renderSignatureToCanvas,
  signatureExt,
  type SignatureSettings,
} from "@/features/signature-resizer/utils/signature";
import { isHeicFile } from "@/lib/heic";
import { loadFileAsImage, loadImage, revokeUrl, triggerDownload } from "@/lib/image";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_SIZE = 50 * 1024 * 1024;

interface SignatureState {
  originalFile: File | null;
  previewUrl: string | null;
  originalSize: number;
  naturalWidth: number;
  naturalHeight: number;
  isProcessing: boolean;
  error: string | null;

  settings: SignatureSettings;
  resultSize: number;

  setFile: (file: File) => void;
  updateSettings: (patch: Partial<SignatureSettings>) => void;
  download: () => Promise<void>;
  reset: () => void;
}

export const useSignatureResizerStore = create<SignatureState>((set, get) => ({
  originalFile: null,
  previewUrl: null,
  originalSize: 0,
  naturalWidth: 0,
  naturalHeight: 0,
  isProcessing: false,
  error: null,

  settings: { ...DEFAULT_SIGNATURE_SETTINGS },
  resultSize: 0,

  setFile: (file) => {
    if (!ACCEPTED_TYPES.includes(file.type) && !isHeicFile(file)) {
      set({ error: "Please choose a PNG, JPG, WEBP, or HEIC image." });
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

  updateSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),

  download: async () => {
    const state = get();
    if (!state.previewUrl || state.naturalWidth === 0) return;
    if (state.isProcessing) return;

    set({ isProcessing: true, error: null });
    try {
      const img = await loadImage(state.previewUrl);
      const canvas = renderSignatureToCanvas(
        img,
        state.settings.size.width,
        state.settings.size.height,
        state.settings.format
      );
      const blob = await fitToTargetKb(
        canvas,
        state.settings.format,
        state.settings.targetKb,
        state.settings.quality
      );
      const baseName =
        state.settings.fileName.trim() ||
        state.originalFile?.name.replace(/\.[^.]+$/, "") ||
        "signature";
      triggerDownload(blob, `${baseName}-${state.settings.size.width}x${state.settings.size.height}.${signatureExt(state.settings.format)}`);
      set({ isProcessing: false, resultSize: blob.size });
    } catch (err) {
      set({
        isProcessing: false,
        error: err instanceof Error ? err.message : "An error occurred while resizing the signature.",
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
      settings: { ...DEFAULT_SIGNATURE_SETTINGS },
      resultSize: 0,
    });
  },
}));
