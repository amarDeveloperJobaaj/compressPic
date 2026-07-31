import { create } from "zustand";
import { isHeicFile, normalizeImageType, decodeHeicToJpeg } from "@/lib/heic";
import { compressImage, getDownloadUrl, revokeDownloadUrl } from "@/features/compressor/utils/compress";

export type TargetSize = "50" | "100" | "200" | "custom";

interface CompressorState {
  // Input
  originalFile: File | null;
  /** File actually used for compression (decoded JPEG for HEIC inputs) */
  workingFile: File | null;
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
  workingFile: null,
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

    const heic = isHeicFile(file);

    set({
      originalFile: file,
      workingFile: null,
      originalPreviewUrl: null,
      originalSize: file.size,
      originalType: normalizeImageType(file),
      // Reset compression results when new file is uploaded
      compressedBlob: null,
      compressedPreviewUrl: null,
      compressedSize: 0,
      compressionRatio: 0,
      progress: 0,
      error: null,
      isCompressing: heic, // HEIC needs decoding before it can render
    });

    const finish = async () => {
      // HEIC can't be rendered by <img> or compressed by browser-image-compression
      // in most browsers — decode to JPEG first.
      let source: Blob = file;
      if (heic) {
        try {
          source = await decodeHeicToJpeg(file);
        } catch {
          if (get().originalFile !== file) return;
          set({
            isCompressing: false,
            error:
              "Couldn't decode this HEIC file. Try converting it to JPG or PNG on your device first.",
          });
          return;
        }
      }

      if (get().originalFile !== file) return;

      const previewUrl = URL.createObjectURL(source);
      const workingFile = heic
        ? new File([source], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
            type: "image/jpeg",
          })
        : file;

      set({
        originalPreviewUrl: previewUrl,
        workingFile,
        isCompressing: false,
      });
    };

    void finish();
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
    const { originalFile, workingFile, targetSizeKB } = get();
    const file = workingFile ?? originalFile;

    if (!file) {
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
        file,
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
      // For HEIC inputs the working file is the decoded JPEG (typically larger
      // than the compact HEIC the user uploaded), so base the savings stat on
      // what was actually uploaded.
      const baseSize = originalFile ? originalFile.size : file.size;
      const compressionRatio = baseSize > 0
        ? Math.round(((baseSize - compressedSize) / baseSize) * 100)
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
