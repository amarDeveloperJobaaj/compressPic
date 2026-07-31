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

interface ConverterState {
  // Input
  originalFile: File | null;
  originalPreviewUrl: string | null;
  originalSize: number;
  originalType: string;

  // Natural dimensions of the uploaded image
  naturalWidth: number;
  naturalHeight: number;

  // Output settings
  outputFormat: ConvertFormat;
  quality: number;

  // Capability flags (computed on the client)
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
  setOutputFormat: (format: ConvertFormat) => void;
  setQuality: (q: number) => void;
  /** Re-render the converted result and show the preview */
  convert: () => Promise<void>;
  /** Download the currently rendered result */
  download: () => void;
  reset: () => void;
}

export const useConverterStore = create<ConverterState>((set, get) => ({
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
    const prevUrl = get().originalPreviewUrl;
    if (prevUrl) URL.revokeObjectURL(prevUrl);

    const heic = isHeicFile(file);

    // Some platforms (Windows/Android) report an empty MIME type for HEIC
    // files — normalize so labels show "HEIC" and the banner logic is correct.
    const type = normalizeImageType(file);

    // Start with the uploaded file's own format so the initial auto-convert is
    // a genuine no-op and the success banner only appears after the user
    // actually switches formats. HEIC isn't an output option — default to PNG.
    let initialFormat: ConvertFormat = CONVERT_OUTPUT_FORMATS.some(
      (f) => f.value === type
    )
      ? (type as ConvertFormat)
      : "image/png";

    // If the file is AVIF but the browser can't re-encode AVIF, fall back to
    // PNG so the initial auto-convert doesn't error out.
    if (initialFormat === "image/avif" && !canEncodeAvif()) {
      initialFormat = "image/png";
    }

    set({
      originalFile: file,
      originalPreviewUrl: null,
      originalSize: file.size,
      originalType: type,
      outputFormat: initialFormat,
      avifSupported: canEncodeAvif(),
      resultBlob: null,
      resultPreviewUrl: null,
      resultSize: 0,
      error: null,
      isProcessing: heic, // HEIC needs decoding before it can render
    });

    const finish = async () => {
      // HEIC can't be rendered by <img> in most browsers — decode to JPEG first
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
          set({ naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
          // Auto-convert the initial result once the image is ready
          void get().convert();
        })
        .catch(() => {
          if (get().originalPreviewUrl !== previewUrl) return;
          set({ error: "Failed to read the image. Please try another file." });
        });
    };

    void finish();
  },

  setOutputFormat: (format: ConvertFormat) => {
    set({ outputFormat: format });
    void get().convert();
  },

  setQuality: (q: number) => {
    set({ quality: q });
    void get().convert();
  },

  convert: async () => {
    const state = get();
    if (!state.originalPreviewUrl || state.isProcessing) return;
    if (state.naturalWidth === 0 || state.naturalHeight === 0) return;

    set({ isProcessing: true, error: null });

    try {
      const result = await convertImage(
        state.originalPreviewUrl,
        state.outputFormat,
        state.quality
      );

      set({
        resultBlob: result.blob,
        resultPreviewUrl: result.dataUrl,
        resultSize: result.size,
        isProcessing: false,
      });

      // Rapid clicks can be dropped by the isProcessing guard above. If the
      // format or quality changed while we were rendering, re-render so the
      // final state always matches the preview.
      const latest = get();
      const changed =
        latest.outputFormat !== state.outputFormat || latest.quality !== state.quality;
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

    const blob = state.resultBlob;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const ext = blob.type.includes("avif")
      ? "avif"
      : blob.type.includes("jpeg")
        ? "jpg"
        : blob.type.includes("png")
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
    if (state.originalPreviewUrl) URL.revokeObjectURL(state.originalPreviewUrl);

    set({
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
