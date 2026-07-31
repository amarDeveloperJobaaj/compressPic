import { create } from "zustand";
import { isHeicFile, decodeHeicToJpeg } from "@/lib/heic";
import {
  applyFlipTransform,
  DEFAULT_TRANSFORM,
  getOutputSize,
  loadImage,
  type FlipFormat,
  type FlipTransform,
} from "@/features/flip/utils/flip";

export const FLIP_OUTPUT_FORMATS = [
  { label: "PNG", value: "image/png" as const },
  { label: "JPEG", value: "image/jpeg" as const },
  { label: "WEBP", value: "image/webp" as const },
];

interface FlipState {
  // Input
  originalFile: File | null;
  originalPreviewUrl: string | null;
  originalSize: number;

  // Natural dimensions of the uploaded image
  naturalWidth: number;
  naturalHeight: number;

  // Active transform
  transform: FlipTransform;

  // Output settings
  outputFormat: FlipFormat;
  quality: number;

  // Processing
  isProcessing: boolean;
  error: string | null;

  // Result
  resultBlob: Blob | null;
  resultPreviewUrl: string | null;
  resultSize: number;
  resultWidth: number;
  resultHeight: number;

  // Actions
  setFile: (file: File) => void;
  toggleFlipH: () => void;
  toggleFlipV: () => void;
  rotate: (direction: "left" | "right") => void;
  resetTransform: () => void;
  setOutputFormat: (format: FlipFormat) => void;
  setQuality: (q: number) => void;
  /** Re-render the flipped result and show the preview */
  apply: () => Promise<void>;
  /** Download the currently rendered result */
  download: () => void;
  reset: () => void;
}

export const useFlipStore = create<FlipState>((set, get) => ({
  originalFile: null,
  originalPreviewUrl: null,
  originalSize: 0,
  naturalWidth: 0,
  naturalHeight: 0,
  transform: DEFAULT_TRANSFORM,
  outputFormat: "image/png",
  quality: 0.92,
  isProcessing: false,
  error: null,
  resultBlob: null,
  resultPreviewUrl: null,
  resultSize: 0,
  resultWidth: 0,
  resultHeight: 0,

  setFile: (file: File) => {
    const prevUrl = get().originalPreviewUrl;
    if (prevUrl) URL.revokeObjectURL(prevUrl);

    const heic = isHeicFile(file);

    set({
      originalFile: file,
      originalPreviewUrl: null,
      originalSize: file.size,
      transform: DEFAULT_TRANSFORM,
      resultBlob: null,
      resultPreviewUrl: null,
      resultSize: 0,
      error: null,
      isProcessing: heic, // HEIC needs decoding before it can render
    });

    const finish = async () => {
      // HEIC can't be rendered by <img> in most browsers — decode to JPEG first.
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

      // Load image to capture natural dimensions.
      // Guard against a stale load landing after the user switched to another file.
      loadImage(previewUrl)
        .then((img) => {
          if (get().originalPreviewUrl !== previewUrl) return;
          const nw = img.naturalWidth;
          const nh = img.naturalHeight;
          const { width, height } = getOutputSize(nw, nh, 0);
          set({ naturalWidth: nw, naturalHeight: nh, resultWidth: width, resultHeight: height });
          // Auto-render the initial result once the image is ready
          void get().apply();
        })
        .catch(() => {
          if (get().originalPreviewUrl !== previewUrl) return;
          set({ error: "Failed to read the image. Please try another file." });
        });
    };

    void finish();
  },

  toggleFlipH: () => {
    set((s) => ({ transform: { ...s.transform, flipH: !s.transform.flipH } }));
    void get().apply();
  },

  toggleFlipV: () => {
    set((s) => ({ transform: { ...s.transform, flipV: !s.transform.flipV } }));
    void get().apply();
  },

  rotate: (direction: "left" | "right") => {
    set((s) => {
      const delta = direction === "left" ? 270 : 90;
      const rotation = ((s.transform.rotation + delta) % 360) as 0 | 90 | 180 | 270;
      return { transform: { ...s.transform, rotation } };
    });
    void get().apply();
  },

  resetTransform: () => {
    set({ transform: DEFAULT_TRANSFORM });
    void get().apply();
  },

  setOutputFormat: (format: FlipFormat) => {
    set({ outputFormat: format });
    void get().apply();
  },

  setQuality: (q: number) => {
    set({ quality: q });
    void get().apply();
  },

  apply: async () => {
    const state = get();
    if (!state.originalPreviewUrl || state.isProcessing) return;
    if (state.naturalWidth === 0 || state.naturalHeight === 0) return;

    set({ isProcessing: true, error: null });

    try {
      const result = await applyFlipTransform(
        state.originalPreviewUrl,
        state.transform,
        state.outputFormat,
        state.quality
      );

      const { width, height } = getOutputSize(
        state.naturalWidth,
        state.naturalHeight,
        state.transform.rotation
      );

      set({
        resultBlob: result.blob,
        resultPreviewUrl: result.dataUrl,
        resultSize: result.size,
        resultWidth: width,
        resultHeight: height,
        isProcessing: false,
      });

      // Rapid clicks can be dropped by the isProcessing guard above. If the
      // transform or settings changed while we were rendering, re-render so
      // the final state always matches the preview.
      const latest = get();
      const changed =
        latest.transform !== state.transform ||
        latest.outputFormat !== state.outputFormat ||
        latest.quality !== state.quality;
      if (changed && !latest.isProcessing) {
        void latest.apply();
      }
    } catch (err) {
      set({
        isProcessing: false,
        error: err instanceof Error ? err.message : "An error occurred while flipping the image.",
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
    const originalName = state.originalFile.name.replace(/\.[^.]+$/, "") || "image";
    link.download = `flipped-${originalName}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  reset: () => {
    const state = get();
    if (state.originalPreviewUrl) URL.revokeObjectURL(state.originalPreviewUrl);

    set({
      originalFile: null,
      originalPreviewUrl: null,
      originalSize: 0,
      naturalWidth: 0,
      naturalHeight: 0,
      transform: DEFAULT_TRANSFORM,
      outputFormat: "image/png",
      quality: 0.92,
      isProcessing: false,
      error: null,
      resultBlob: null,
      resultPreviewUrl: null,
      resultSize: 0,
      resultWidth: 0,
      resultHeight: 0,
    });
  },
}));
