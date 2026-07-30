import { create } from "zustand";
import { compressImage, getDownloadUrl, revokeDownloadUrl } from "@/features/compressor/utils/compress";

export type TargetSize = "50" | "100" | "200" | "custom";

interface CompressorState {
  // Input
  originalFile: File | null;
  originalPreviewUrl: string | null;
  originalSize: number;
  originalType: string;

  // Target
  targetSize: TargetSize;
  customTargetSize: number;
  targetSizeKB: number;

  // Compression
  isCompressing: boolean;
  progress: number;
  error: string | null;

  // Result
  compressedBlob: Blob | null;
  compressedPreviewUrl: string | null;
  compressedSize: number;
  compressionRatio: number;

  // Actions
  setFile: (file: File) => void;
  setTargetSize: (size: TargetSize) => void;
  setCustomTargetSize: (kb: number) => void;
  compress: () => Promise<void>;
  reset: () => void;
  download: () => void;
}

function getTargetSizeKB(targetSize: TargetSize, customTargetSize: number): number {
  if (targetSize === "custom") return customTargetSize;
  return Number.parseInt(targetSize, 10);
}

export const useCompressorStore = create<CompressorState>((set, get) => ({
  // Initial state
  originalFile: null,
  originalPreviewUrl: null,
  originalSize: 0,
  originalType: "",
  targetSize: "50",
  customTargetSize: 100,
  targetSizeKB: 50,
  isCompressing: false,
  progress: 0,
  error: null,
  compressedBlob: null,
  compressedPreviewUrl: null,
  compressedSize: 0,
  compressionRatio: 0,

  setFile: (file: File) => {
    // Revoke previous preview URL to avoid memory leaks
    const prevUrl = get().originalPreviewUrl;
    if (prevUrl) revokeDownloadUrl(prevUrl);

    const previewUrl = URL.createObjectURL(file);

    set({
      originalFile: file,
      originalPreviewUrl: previewUrl,
      originalSize: file.size,
      originalType: file.type,
      // Reset compression results when new file is uploaded
      compressedBlob: null,
      compressedPreviewUrl: null,
      compressedSize: 0,
      compressionRatio: 0,
      progress: 0,
      error: null,
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
    const { originalFile, targetSizeKB } = get();

    if (!originalFile) {
      set({ error: "No image selected. Please upload an image first." });
      return;
    }

    if (targetSizeKB < 1) {
      set({ error: "Target size must be at least 1 KB." });
      return;
    }

    set({
      isCompressing: true,
      progress: 0,
      error: null,
      compressedBlob: null,
      compressedPreviewUrl: null,
      compressedSize: 0,
      compressionRatio: 0,
    });

    try {
      const compressedBlob = await compressImage({
        file: originalFile,
        targetSizeKB,
        onProgress: (progress) => {
          set({ progress });
        },
      });

      // Validate result before using it
      if (!compressedBlob || typeof compressedBlob.size !== "number") {
        throw new Error("Invalid compression result received.");
      }

      const compressedSize = compressedBlob.size;
      const compressionRatio = originalFile.size > 0
        ? Math.round(((originalFile.size - compressedSize) / originalFile.size) * 100)
        : 0;
      const safeRatio = Number.isFinite(compressionRatio) ? Math.max(-999, Math.min(100, compressionRatio)) : 0;

      // Revoke previous compressed preview
      const prevCompressedUrl = get().compressedPreviewUrl;
      if (prevCompressedUrl) revokeDownloadUrl(prevCompressedUrl);

      const compressedPreviewUrl = URL.createObjectURL(compressedBlob);

      set({
        compressedBlob,
        compressedPreviewUrl,
        compressedSize,
        compressionRatio: safeRatio,
        isCompressing: false,
        progress: 100,
      });
    } catch (err) {
      set({
        isCompressing: false,
        error: err instanceof Error ? err.message : "An unexpected error occurred during compression. Please try again.",
        progress: 0,
      });
    }
  },

  reset: () => {
    const { originalPreviewUrl, compressedPreviewUrl } = get();
    if (originalPreviewUrl) revokeDownloadUrl(originalPreviewUrl);
    if (compressedPreviewUrl) revokeDownloadUrl(compressedPreviewUrl);

    set({
      originalFile: null,
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

    // Small delay before revoking to ensure download starts
    setTimeout(() => revokeDownloadUrl(url), 1000);
  },
}));

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  return map[mimeType] ?? "jpg";
}
