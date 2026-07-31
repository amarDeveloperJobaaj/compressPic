import { create } from "zustand";
import {
  DEFAULT_PDF_RENDER_SETTINGS,
  canvasToBlob,
  pagesToZip,
  pdfExportExt,
  renderPdfPages,
  type PdfRenderSettings,
  type RenderedPdfPage,
} from "@/features/pdf-to-image/utils/pdf";
import { revokeUrl, triggerDownload } from "@/lib/image";

const MAX_SIZE = 50 * 1024 * 1024;

interface PdfToImageState {
  file: File | null;
  isRendering: boolean;
  rerenderQueued: boolean;
  progress: { done: number; total: number } | null;
  pages: RenderedPdfPage[];
  settings: PdfRenderSettings;
  isExporting: boolean;
  error: string | null;
  resultSize: number;

  setFile: (file: File) => void;
  updateSettings: (patch: Partial<PdfRenderSettings>) => void;
  render: () => Promise<void>;
  downloadPage: (index: number) => void;
  downloadAll: () => Promise<void>;
  reset: () => void;
}

export const usePdfToImageStore = create<PdfToImageState>((set, get) => ({
  file: null,
  isRendering: false,
  rerenderQueued: false,
  progress: null,
  pages: [],
  settings: { ...DEFAULT_PDF_RENDER_SETTINGS },
  isExporting: false,
  error: null,
  resultSize: 0,

  setFile: (file) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      set({ error: "Please choose a PDF file." });
      return;
    }
    if (file.size > MAX_SIZE) {
      set({ error: "That PDF is over 50 MB. Please choose a smaller file." });
      return;
    }

    // Clear the previous render
    get().pages.forEach((page) => revokeUrl(page.thumbUrl));
    set({
      file,
      pages: [],
      progress: null,
      error: null,
      resultSize: 0,
      isRendering: false,
      rerenderQueued: false,
    });
    get().render();
  },

  updateSettings: (patch) => {
    const shouldReRender = "scale" in patch;
    set({ settings: { ...get().settings, ...patch } });
    // Changing scale changes the rendered resolution — re-rasterize
    if (shouldReRender && get().file && get().pages.length > 0) {
      get().render();
    }
  },

  render: async () => {
    const state = get();
    if (!state.file) return;
    if (state.isRendering) {
      set({ rerenderQueued: true });
      return;
    }

    set({ isRendering: true, error: null, progress: { done: 0, total: 0 } });
    try {
      const pages = await renderPdfPages(
        state.file,
        state.settings.scale,
        (done, total) => set({ progress: { done, total } })
      );
      // Swap in the new generation, releasing old thumbnails
      state.pages.forEach((page) => revokeUrl(page.thumbUrl));
      set({ pages, progress: null, isRendering: false, resultSize: 0 });

      if (get().rerenderQueued) {
        set({ rerenderQueued: false });
        get().render();
      }
    } catch (err) {
      set({
        isRendering: false,
        progress: null,
        error:
          err instanceof Error
            ? `Couldn't read this PDF: ${err.message}`
            : "Couldn't read this PDF. It may be password-protected or corrupted.",
      });
    }
  },

  downloadPage: (index) => {
    const state = get();
    const page = state.pages[index];
    if (!page || state.isExporting) return;

    set({ isExporting: true, error: null });
    const baseName = state.settings.fileName.trim() || "pdf-page";
    canvasToBlob(page.canvas, state.settings.format, state.settings.quality)
      .then((blob) => {
        triggerDownload(
          blob,
          `${baseName}-${String(index + 1).padStart(2, "0")}.${pdfExportExt(state.settings.format)}`
        );
        set({ isExporting: false, resultSize: blob.size });
      })
      .catch((err: unknown) => {
        set({
          isExporting: false,
          error: err instanceof Error ? err.message : "Failed to export this page.",
        });
      });
  },

  downloadAll: async () => {
    const state = get();
    if (state.pages.length === 0 || state.isExporting) return;

    set({ isExporting: true, error: null });
    try {
      const baseName = state.settings.fileName.trim() || "pdf";
      const zip = await pagesToZip(
        state.pages,
        state.settings.format,
        state.settings.quality,
        baseName
      );
      triggerDownload(zip, `${baseName}-images.zip`);
      set({ isExporting: false, resultSize: zip.size });
    } catch (err) {
      set({
        isExporting: false,
        error: err instanceof Error ? err.message : "Failed to create the ZIP archive.",
      });
    }
  },

  reset: () => {
    get().pages.forEach((page) => revokeUrl(page.thumbUrl));
    set({
      file: null,
      isRendering: false,
      rerenderQueued: false,
      progress: null,
      pages: [],
      settings: { ...DEFAULT_PDF_RENDER_SETTINGS },
      isExporting: false,
      error: null,
      resultSize: 0,
    });
  },
}));
