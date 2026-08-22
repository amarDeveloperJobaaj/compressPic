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

interface FileQueueEntry {
  file: File;
  previewUrl: string;
  size: number;
}

interface FlipState {
  // Multi-file queue
  files: FileQueueEntry[];
  activeIndex: number;

  // Input
  originalFile: File | null;
  originalPreviewUrl: string | null;
  originalSize: number;
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
  addFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  setActiveIndex: (index: number) => void;
  toggleFlipH: () => void;
  toggleFlipV: () => void;
  rotate: (direction: "left" | "right") => void;
  resetTransform: () => void;
  setOutputFormat: (format: FlipFormat) => void;
  setQuality: (q: number) => void;
  apply: () => Promise<void>;
  download: () => void;
  reset: () => void;
}

async function prepareFile(file: File): Promise<FileQueueEntry> {
  let source: Blob = file;
  if (isHeicFile(file)) {
    try {
      source = await decodeHeicToJpeg(file);
    } catch {
      // Use original
    }
  }
  const previewUrl = URL.createObjectURL(source);
  return { file, previewUrl, size: file.size };
}

function syncActive(state: FlipState): Partial<FlipState> {
  const entry = state.files[state.activeIndex];
  if (!entry) {
    return { originalFile: null, originalPreviewUrl: null, originalSize: 0 };
  }
  return {
    originalFile: entry.file,
    originalPreviewUrl: entry.previewUrl,
    originalSize: entry.size,
  };
}

export const useFlipStore = create<FlipState>((set, get) => ({
  files: [],
  activeIndex: 0,
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
    const state = get();
    state.files.forEach((e) => URL.revokeObjectURL(e.previewUrl));
    set({ files: [], activeIndex: 0, resultBlob: null, resultPreviewUrl: null, resultSize: 0, transform: DEFAULT_TRANSFORM });
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
        transform: DEFAULT_TRANSFORM,
        resultBlob: null,
        resultPreviewUrl: null,
        resultSize: 0,
        ...syncActive({ ...state, files, activeIndex: isFirst ? 0 : state.activeIndex }),
      };
    });

    // Load dimensions
    const state = get();
    if (state.originalPreviewUrl) {
      loadImage(state.originalPreviewUrl)
        .then((img) => {
          if (get().originalPreviewUrl !== state.originalPreviewUrl) return;
          const nw = img.naturalWidth;
          const nh = img.naturalHeight;
          const { width, height } = getOutputSize(nw, nh, 0);
          set({ naturalWidth: nw, naturalHeight: nh, resultWidth: width, resultHeight: height });
          void get().apply();
        })
        .catch(() => set({ error: "Failed to read the image." }));
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
    const activeIndex = Math.max(0, Math.min(index, state.files.length - 1));
    set({
      activeIndex,
      transform: DEFAULT_TRANSFORM,
      resultBlob: null,
      resultPreviewUrl: null,
      resultSize: 0,
      ...syncActive({ ...state, activeIndex }),
    });

    // Load dimensions
    const newState = get();
    if (newState.originalPreviewUrl) {
      loadImage(newState.originalPreviewUrl)
        .then((img) => {
          if (get().originalPreviewUrl !== newState.originalPreviewUrl) return;
          const nw = img.naturalWidth;
          const nh = img.naturalHeight;
          const { width, height } = getOutputSize(nw, nh, 0);
          set({ naturalWidth: nw, naturalHeight: nh, resultWidth: width, resultHeight: height });
          void get().apply();
        })
        .catch(() => set({ error: "Failed to read the image." }));
    }
  },

  toggleFlipH: () => {
    set((s) => ({ transform: { ...s.transform, flipH: !s.transform.flipH } }));
    void get().apply();
  },

  toggleFlipV: () => {
    set((s) => ({ transform: { ...s.transform, flipV: !s.transform.flipV } }));
    void get().apply();
  },

  rotate: (direction) => {
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

  setOutputFormat: (format) => {
    set({ outputFormat: format });
    void get().apply();
  },

  setQuality: (q) => {
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

      const { width, height } = getOutputSize(state.naturalWidth, state.naturalHeight, state.transform.rotation);

      set({
        resultBlob: result.blob,
        resultPreviewUrl: result.dataUrl,
        resultSize: result.size,
        resultWidth: width,
        resultHeight: height,
        isProcessing: false,
      });

      const latest = get();
      const changed =
        latest.transform !== state.transform || latest.outputFormat !== state.outputFormat || latest.quality !== state.quality;
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

    const url = URL.createObjectURL(state.resultBlob);
    const link = document.createElement("a");
    link.href = url;
    const ext = state.resultBlob.type.includes("jpeg") ? "jpg" : state.resultBlob.type.includes("png") ? "png" : "webp";
    const originalName = state.originalFile.name.replace(/\.[^.]+$/, "") || "image";
    link.download = `flipped-${originalName}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  reset: () => {
    const state = get();
    state.files.forEach((e) => URL.revokeObjectURL(e.previewUrl));

    set({
      files: [],
      activeIndex: 0,
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
