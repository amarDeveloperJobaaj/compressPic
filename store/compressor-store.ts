import { create } from "zustand";
import { isHeicFile, normalizeImageType, decodeHeicToJpeg } from "@/lib/heic";
import { compressImage, getDownloadUrl, revokeDownloadUrl } from "@/features/compressor/utils/compress";

export type TargetSize = "50" | "100" | "200" | "custom";

interface FileEntry {
  file: File;
  workingFile: File | null;
  previewUrl: string | null;
  size: number;
  type: string;
  // Compression result
  compressedBlob: Blob | null;
  compressedPreviewUrl: string | null;
  compressedSize: number;
  compressionRatio: number;
}

interface CompressorState {
  // Multi-file queue
  files: FileEntry[];
  activeIndex: number;

  // Target (shared across all files)
  targetSize: TargetSize;
  customTargetSize: number;
  targetSizeKB: number;

  // Processing (global)
  isCompressing: boolean;
  progress: number;
  error: string | null;

  // Backward-compat getters (active file)
  originalFile: File | null;
  workingFile: File | null;
  originalPreviewUrl: string | null;
  originalSize: number;
  originalType: string;
  compressedBlob: Blob | null;
  compressedPreviewUrl: string | null;
  compressedSize: number;
  compressionRatio: number;

  // Actions
  setFile: (file: File) => void;
  addFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  setActiveIndex: (index: number) => void;
  setTargetSize: (size: TargetSize) => void;
  setCustomTargetSize: (kb: number) => void;
  compress: () => Promise<void>;
  compressAll: () => Promise<void>;
  reset: () => void;
  download: () => void;
  downloadAll: () => void;
}

function getTargetSizeKB(targetSize: TargetSize, customTargetSize: number): number {
  if (targetSize === "custom") return customTargetSize;
  return Number.parseInt(targetSize, 10);
}

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  return map[mimeType] ?? "jpg";
}

async function processFileEntry(file: File): Promise<FileEntry> {
  const heic = isHeicFile(file);
  let source: Blob = file;
  let workingFile: File = file;

  if (heic) {
    try {
      source = await decodeHeicToJpeg(file);
      workingFile = new File([source], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
        type: "image/jpeg",
      });
    } catch {
      // HEIC decode failed — use original
    }
  }

  const previewUrl = URL.createObjectURL(source);

  return {
    file,
    workingFile,
    previewUrl,
    size: file.size,
    type: normalizeImageType(file),
    compressedBlob: null,
    compressedPreviewUrl: null,
    compressedSize: 0,
    compressionRatio: 0,
  };
}

function syncActive(state: CompressorState): Partial<CompressorState> {
  const entry = state.files[state.activeIndex];
  if (!entry) {
    return {
      originalFile: null,
      workingFile: null,
      originalPreviewUrl: null,
      originalSize: 0,
      originalType: "",
      compressedBlob: null,
      compressedPreviewUrl: null,
      compressedSize: 0,
      compressionRatio: 0,
    };
  }
  return {
    originalFile: entry.file,
    workingFile: entry.workingFile,
    originalPreviewUrl: entry.previewUrl,
    originalSize: entry.size,
    originalType: entry.type,
    compressedBlob: entry.compressedBlob,
    compressedPreviewUrl: entry.compressedPreviewUrl,
    compressedSize: entry.compressedSize,
    compressionRatio: entry.compressionRatio,
  };
}

export const useCompressorStore = create<CompressorState>((set, get) => ({
  files: [],
  activeIndex: 0,
  targetSize: "50",
  customTargetSize: 100,
  targetSizeKB: 50,
  isCompressing: false,
  progress: 0,
  error: null,
  originalFile: null,
  workingFile: null,
  originalPreviewUrl: null,
  originalSize: 0,
  originalType: "",
  compressedBlob: null,
  compressedPreviewUrl: null,
  compressedSize: 0,
  compressionRatio: 0,

  setFile: (file: File) => {
    // Reset everything and add single file
    const state = get();
    state.files.forEach((e) => {
      if (e.previewUrl) revokeDownloadUrl(e.previewUrl);
      if (e.compressedPreviewUrl) revokeDownloadUrl(e.compressedPreviewUrl);
    });

    set({
      files: [],
      activeIndex: 0,
      compressedBlob: null,
      compressedPreviewUrl: null,
      compressedSize: 0,
      compressionRatio: 0,
      progress: 0,
      error: null,
    });

    void get().addFiles([file]);
  },

  addFiles: async (newFiles: File[]) => {
    const entries = await Promise.all(newFiles.map(processFileEntry));
    set((state) => {
      const files = [...state.files, ...entries];
      return {
        files,
        activeIndex: state.files.length === 0 ? 0 : state.activeIndex,
        ...syncActive({ ...state, files, activeIndex: state.files.length === 0 ? 0 : state.activeIndex }),
      };
    });
  },

  removeFile: (index: number) => {
    set((state) => {
      const entry = state.files[index];
      if (entry) {
        if (entry.previewUrl) revokeDownloadUrl(entry.previewUrl);
        if (entry.compressedPreviewUrl) revokeDownloadUrl(entry.compressedPreviewUrl);
      }

      const files = state.files.filter((_, i) => i !== index);
      const activeIndex = Math.min(state.activeIndex, Math.max(0, files.length - 1));

      return {
        files,
        activeIndex,
        ...syncActive({ ...state, files, activeIndex }),
      };
    });
  },

  setActiveIndex: (index: number) => {
    set((state) => {
      const activeIndex = Math.max(0, Math.min(index, state.files.length - 1));
      return { activeIndex, ...syncActive({ ...state, activeIndex }) };
    });
  },

  setTargetSize: (size: TargetSize) => {
    const { customTargetSize } = get();
    set({
      targetSize: size,
      targetSizeKB: getTargetSizeKB(size, customTargetSize),
    });
  },

  setCustomTargetSize: (kb: number) => {
    set({
      customTargetSize: kb,
      targetSizeKB: kb,
    });
  },

  compress: async () => {
    const { files, activeIndex, targetSizeKB } = get();
    const entry = files[activeIndex];
    if (!entry) {
      set({ error: "No image selected. Please upload an image first." });
      return;
    }
    if (targetSizeKB < 1) {
      set({ error: "Target size must be at least 1 KB." });
      return;
    }

    const file = entry.workingFile ?? entry.file;

    set({ isCompressing: true, progress: 0, error: null });

    try {
      const compressedBlob = await compressImage({
        file,
        targetSizeKB,
        onProgress: (progress) => set({ progress }),
      });

      if (!compressedBlob || typeof compressedBlob.size !== "number") {
        throw new Error("Invalid compression result received.");
      }

      const compressedSize = compressedBlob.size;
      const baseSize = entry.file.size;
      const compressionRatio = baseSize > 0
        ? Math.round(((baseSize - compressedSize) / baseSize) * 100)
        : 0;
      const safeRatio = Number.isFinite(compressionRatio) ? Math.max(-999, Math.min(100, compressionRatio)) : 0;

      const prevUrl = entry.compressedPreviewUrl;
      if (prevUrl) revokeDownloadUrl(prevUrl);
      const compressedPreviewUrl = URL.createObjectURL(compressedBlob);

      set((state) => {
        const files = [...state.files];
        files[activeIndex] = {
          ...files[activeIndex],
          compressedBlob,
          compressedPreviewUrl,
          compressedSize,
          compressionRatio: safeRatio,
        };
        return {
          files,
          isCompressing: false,
          progress: 100,
          ...syncActive({ ...state, files }),
        };
      });
    } catch (err) {
      set({
        isCompressing: false,
        error: err instanceof Error ? err.message : "An unexpected error occurred during compression.",
        progress: 0,
      });
    }
  },

  compressAll: async () => {
    const { files, targetSizeKB } = get();
    if (files.length === 0) return;
    if (targetSizeKB < 1) {
      set({ error: "Target size must be at least 1 KB." });
      return;
    }

    set({ isCompressing: true, progress: 0, error: null });

    for (let i = 0; i < files.length; i++) {
      const entry = files[i];
      if (entry.compressedBlob) continue; // skip already compressed

      const file = entry.workingFile ?? entry.file;
      try {
        const compressedBlob = await compressImage({
          file,
          targetSizeKB,
          onProgress: (p) => set({ progress: Math.round(((i + p / 100) / files.length) * 100) }),
        });

        if (!compressedBlob || typeof compressedBlob.size !== "number") continue;

        const compressedSize = compressedBlob.size;
        const baseSize = entry.file.size;
        const compressionRatio = baseSize > 0
          ? Math.round(((baseSize - compressedSize) / baseSize) * 100)
          : 0;

        const prevUrl = entry.compressedPreviewUrl;
        if (prevUrl) revokeDownloadUrl(prevUrl);
        const compressedPreviewUrl = URL.createObjectURL(compressedBlob);

        set((state) => {
          const files = [...state.files];
          files[i] = {
            ...files[i],
            compressedBlob,
            compressedPreviewUrl,
            compressedSize,
            compressionRatio: Number.isFinite(compressionRatio) ? Math.max(-999, Math.min(100, compressionRatio)) : 0,
          };
          return { files, ...syncActive({ ...state, files }) };
        });
      } catch {
        // Skip failed files
      }
    }

    set({ isCompressing: false, progress: 100 });
  },

  reset: () => {
    const { files } = get();
    files.forEach((e) => {
      if (e.previewUrl) revokeDownloadUrl(e.previewUrl);
      if (e.compressedPreviewUrl) revokeDownloadUrl(e.compressedPreviewUrl);
    });

    set({
      files: [],
      activeIndex: 0,
      originalFile: null,
      workingFile: null,
      originalPreviewUrl: null,
      originalSize: 0,
      originalType: "",
      compressedBlob: null,
      compressedPreviewUrl: null,
      compressedSize: 0,
      compressionRatio: 0,
      isCompressing: false,
      progress: 0,
      error: null,
    });
  },

  download: () => {
    const { compressedBlob, originalFile } = get();
    if (!compressedBlob || !originalFile) return;

    const url = getDownloadUrl(compressedBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compressed-${originalFile.name.replace(/\.[^.]+$/, "")}.${getExtension(originalFile.type)}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => revokeDownloadUrl(url), 1000);
  },

  downloadAll: () => {
    const { files } = get();
    files.forEach((entry) => {
      if (!entry.compressedBlob) return;
      const url = getDownloadUrl(entry.compressedBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `compressed-${entry.file.name.replace(/\.[^.]+$/, "")}.${getExtension(entry.file.type)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => revokeDownloadUrl(url), 1000);
    });
  },
}));
