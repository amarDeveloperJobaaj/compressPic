import { create } from "zustand";
import { isHeicFile, normalizeImageType, decodeHeicToJpeg } from "@/lib/heic";
import {
  canEncodeAvif,
  convertImage,
  loadImage,
  type ConvertFormat,
} from "@/features/converter/utils/convert";

export const CONVERT_OUTPUT_FORMATS = [
  { label: "PNG", value: "image/png" as const },
  { label: "JPEG", value: "image/jpeg" as const },
  { label: "WEBP", value: "image/webp" as const },
  { label: "AVIF", value: "image/avif" as const },
];

interface FileQueueEntry {
  file: File;
  previewUrl: string;
  size: number;
  type: string;
  naturalWidth: number;
  naturalHeight: number;
}

interface ConverterState {
  // Multi-file queue
  files: FileQueueEntry[];
  activeIndex: number;

  // Input (active file)
  originalFile: File | null;
  originalPreviewUrl: string | null;
  originalSize: number;
  originalType: string;
  naturalWidth: number;
  naturalHeight: number;

  // Output settings
  outputFormat: ConvertFormat;
  quality: number;
  avifSupported: boolean;

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
  setOutputFormat: (format: ConvertFormat) => void;
  setQuality: (q: number) => void;
  convert: () => Promise<void>;
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
  let naturalWidth = 0;
  let naturalHeight = 0;

  try {
    const img = await loadImage(previewUrl);
    naturalWidth = img.naturalWidth;
    naturalHeight = img.naturalHeight;
  } catch {
    // Dimensions stay 0
  }

  return {
    file,
    previewUrl,
    size: file.size,
    type: normalizeImageType(file),
    naturalWidth,
    naturalHeight,
  };
}

function syncActive(state: ConverterState): Partial<ConverterState> {
  const entry = state.files[state.activeIndex];
  if (!entry) {
    return {
      originalFile: null,
      originalPreviewUrl: null,
      originalSize: 0,
      originalType: "",
      naturalWidth: 0,
      naturalHeight: 0,
    };
  }
  return {
    originalFile: entry.file,
    originalPreviewUrl: entry.previewUrl,
    originalSize: entry.size,
    originalType: entry.type,
    naturalWidth: entry.naturalWidth,
    naturalHeight: entry.naturalHeight,
  };
}

function getInitialFormat(type: string): ConvertFormat {
  let initialFormat: ConvertFormat = CONVERT_OUTPUT_FORMATS.some(
    (f) => f.value === type
  )
    ? (type as ConvertFormat)
    : "image/png";

  if (initialFormat === "image/avif" && !canEncodeAvif()) {
    initialFormat = "image/png";
  }

  return initialFormat;
}

export const useConverterStore = create<ConverterState>((set, get) => ({
  files: [],
  activeIndex: 0,
  originalFile: null,
  originalPreviewUrl: null,
  originalSize: 0,
  originalType: "",
  naturalWidth: 0,
  naturalHeight: 0,
  outputFormat: "image/png",
  quality: 0.92,
  avifSupported: false,
  isProcessing: false,
  error: null,
  resultBlob: null,
  resultPreviewUrl: null,
  resultSize: 0,

  setFile: (file: File) => {
    const state = get();
    state.files.forEach((e) => URL.revokeObjectURL(e.previewUrl));
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
      const activeIndex = isFirst ? 0 : state.activeIndex;
      const firstType = entries[0]?.type ?? "";

      return {
        files,
        activeIndex,
        outputFormat: isFirst ? getInitialFormat(firstType) : state.outputFormat,
        avifSupported: canEncodeAvif(),
        resultBlob: null,
        resultPreviewUrl: null,
        resultSize: 0,
        ...syncActive({ ...state, files, activeIndex }),
      };
    });

    // Auto-convert the active file
    void get().convert();
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
    const entry = state.files[activeIndex];

    set({
      activeIndex,
      outputFormat: entry ? getInitialFormat(entry.type) : state.outputFormat,
      resultBlob: null,
      resultPreviewUrl: null,
      resultSize: 0,
      error: null,
      ...syncActive({ ...state, activeIndex }),
    });

    void get().convert();
  },

  setOutputFormat: (format) => {
    set({ outputFormat: format });
    void get().convert();
  },

  setQuality: (q) => {
    set({ quality: q });
    void get().convert();
  },

  convert: async () => {
    const state = get();
    if (!state.originalPreviewUrl || state.isProcessing) return;
    if (state.naturalWidth === 0 || state.naturalHeight === 0) return;

    set({ isProcessing: true, error: null });

    try {
      const result = await convertImage(state.originalPreviewUrl, state.outputFormat, state.quality);

      set({
        resultBlob: result.blob,
        resultPreviewUrl: result.dataUrl,
        resultSize: result.size,
        isProcessing: false,
      });

      const latest = get();
      const changed = latest.outputFormat !== state.outputFormat || latest.quality !== state.quality;
      if (changed && !latest.isProcessing) {
        void latest.convert();
      }
    } catch (err) {
      set({
        isProcessing: false,
        error: err instanceof Error ? err.message : "An error occurred while converting the image.",
      });
    }
  },

  download: () => {
    const state = get();
    if (!state.resultBlob || !state.originalFile) return;

    const url = URL.createObjectURL(state.resultBlob);
    const link = document.createElement("a");
    link.href = url;
    const ext = state.resultBlob.type.includes("avif")
      ? "avif"
      : state.resultBlob.type.includes("jpeg")
        ? "jpg"
        : state.resultBlob.type.includes("png")
          ? "png"
          : "webp";
    const originalName = state.originalFile.name.replace(/\.[^.]+$/, "") || "image";
    link.download = `${originalName}-converted.${ext}`;
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
      originalType: "",
      naturalWidth: 0,
      naturalHeight: 0,
      outputFormat: "image/png",
      quality: 0.92,
      avifSupported: false,
      isProcessing: false,
      error: null,
      resultBlob: null,
      resultPreviewUrl: null,
      resultSize: 0,
    });
  },
}));
