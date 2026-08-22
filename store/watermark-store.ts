import { create } from "zustand";
import {
  DEFAULT_WATERMARK_SETTINGS,
  loadImage,
  renderWatermarkedBlob,
  watermarkExt,
  type WatermarkFormat,
  type WatermarkSettings,
} from "@/features/watermark/utils/watermark";

interface HistoryEntry {
  settings: WatermarkSettings;
  logoFile: File | null;
  logoPreviewUrl: string | null;
}

interface FileQueueEntry {
  file: File;
  previewUrl: string;
  size: number;
  naturalWidth: number;
  naturalHeight: number;
}

interface WatermarkState {
  // Multi-file queue
  files: FileQueueEntry[];
  activeIndex: number;

  // Input image (active file)
  originalFile: File | null;
  originalPreviewUrl: string | null;
  originalSize: number;
  naturalWidth: number;
  naturalHeight: number;

  // Logo
  logoFile: File | null;
  logoPreviewUrl: string | null;

  // Settings + undo/redo
  settings: WatermarkSettings;
  past: HistoryEntry[];
  future: HistoryEntry[];

  // Processing
  isProcessing: boolean;
  error: string | null;

  // Last exported result
  resultSize: number;
  resultFormat: WatermarkFormat | null;

  // Actions
  setFile: (file: File) => void;
  addFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  setActiveIndex: (index: number) => void;
  setLogoFile: (file: File | null) => void;
  updateSettings: (patch: Partial<WatermarkSettings>) => void;
  updateText: (patch: Partial<WatermarkSettings["text"]>) => void;
  updateImage: (patch: Partial<WatermarkSettings["image"]>) => void;
  setType: (type: "text" | "image") => void;
  setPositionPreset: (preset: WatermarkSettings["positionPreset"]) => void;
  setCustomPosition: (x: number, y: number) => void;
  setOutputFormat: (format: WatermarkFormat) => void;
  setQuality: (q: number) => void;
  setFileName: (name: string) => void;
  resetSettings: () => void;
  undo: () => void;
  redo: () => void;
  download: () => Promise<void>;
  reset: () => void;
}

function createHistoryKeeper() {
  let pending: HistoryEntry | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const snapshot = (state: WatermarkState): HistoryEntry => ({
    settings: state.settings,
    logoFile: state.logoFile,
    logoPreviewUrl: state.logoPreviewUrl,
  });

  const begin = (state: WatermarkState, commit: (entry: HistoryEntry) => void) => {
    if (!pending) pending = snapshot(state);
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (pending) {
        const entry = pending;
        pending = null;
        commit(entry);
      }
    }, 500);
  };

  const flush = (commit: (entry: HistoryEntry) => void) => {
    if (timer) clearTimeout(timer);
    timer = null;
    if (pending) {
      const entry = pending;
      pending = null;
      commit(entry);
    }
  };

  const discard = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    pending = null;
  };

  return { begin, flush, discard };
}

function commitEntry(
  set: (fn: (s: WatermarkState) => Partial<WatermarkState>) => void,
  entry: HistoryEntry
) {
  set((s) => ({ past: [...s.past.slice(-49), entry], future: [] }));
}

async function prepareFile(file: File): Promise<FileQueueEntry> {
  const previewUrl = URL.createObjectURL(file);
  let naturalWidth = 0;
  let naturalHeight = 0;

  try {
    const img = await loadImage(previewUrl);
    naturalWidth = img.naturalWidth;
    naturalHeight = img.naturalHeight;
  } catch {
    // Dimensions stay 0
  }

  return { file, previewUrl, size: file.size, naturalWidth, naturalHeight };
}

function syncActive(state: WatermarkState): Partial<WatermarkState> {
  const entry = state.files[state.activeIndex];
  if (!entry) {
    return {
      originalFile: null,
      originalPreviewUrl: null,
      originalSize: 0,
      naturalWidth: 0,
      naturalHeight: 0,
    };
  }
  return {
    originalFile: entry.file,
    originalPreviewUrl: entry.previewUrl,
    originalSize: entry.size,
    naturalWidth: entry.naturalWidth,
    naturalHeight: entry.naturalHeight,
  };
}

export const useWatermarkStore = create<WatermarkState>((set, get) => {
  const history = createHistoryKeeper();
  const commit = (entry: HistoryEntry) => commitEntry(set, entry);

  return {
    files: [],
    activeIndex: 0,
    originalFile: null,
    originalPreviewUrl: null,
    originalSize: 0,
    naturalWidth: 0,
    naturalHeight: 0,
    logoFile: null,
    logoPreviewUrl: null,
    settings: DEFAULT_WATERMARK_SETTINGS,
    past: [],
    future: [],
    isProcessing: false,
    error: null,
    resultSize: 0,
    resultFormat: null,

    setFile: (file: File) => {
      history.discard();
      const state = get();
      state.files.forEach((e) => URL.revokeObjectURL(e.previewUrl));
      if (state.logoPreviewUrl) URL.revokeObjectURL(state.logoPreviewUrl);

      set({
        files: [],
        activeIndex: 0,
        logoFile: null,
        logoPreviewUrl: null,
        settings: { ...DEFAULT_WATERMARK_SETTINGS },
        past: [],
        future: [],
        isProcessing: false,
        error: null,
        resultSize: 0,
        resultFormat: null,
      });

      void get().addFiles([file]);
    },

    addFiles: async (newFiles: File[]) => {
      history.discard();
      const entries = await Promise.all(newFiles.map(prepareFile));
      set((state) => {
        const files = [...state.files, ...entries];
        const isFirst = state.files.length === 0;
        return {
          files,
          activeIndex: isFirst ? 0 : state.activeIndex,
          ...syncActive({ ...state, files, activeIndex: isFirst ? 0 : state.activeIndex }),
        };
      });
    },

    removeFile: (index: number) => {
      history.discard();
      set((state) => {
        const entry = state.files[index];
        if (entry) URL.revokeObjectURL(entry.previewUrl);
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
      history.discard();
      const state = get();
      const activeIndex = Math.max(0, Math.min(index, state.files.length - 1));
      set({
        activeIndex,
        settings: { ...DEFAULT_WATERMARK_SETTINGS },
        past: [],
        future: [],
        error: null,
        resultSize: 0,
        resultFormat: null,
        ...syncActive({ ...state, activeIndex }),
      });
    },

    setLogoFile: (file: File | null) => {
      history.begin(get(), commit);

      if (!file) {
        set({ logoFile: null, logoPreviewUrl: null, settings: { ...get().settings, type: "text" } });
        return;
      }

      const logoUrl = URL.createObjectURL(file);
      set({ logoFile: file, logoPreviewUrl: logoUrl, settings: { ...get().settings, type: "image" } });
    },

    updateSettings: (patch) => {
      history.begin(get(), commit);
      set({ settings: { ...get().settings, ...patch } });
    },

    updateText: (patch) => {
      history.begin(get(), commit);
      set({ settings: { ...get().settings, text: { ...get().settings.text, ...patch } } });
    },

    updateImage: (patch) => {
      history.begin(get(), commit);
      set({ settings: { ...get().settings, image: { ...get().settings.image, ...patch } } });
    },

    setType: (type) => {
      if (type === "image" && !get().logoFile) {
        set({ error: "Upload a logo first to use an image watermark." });
        return;
      }
      history.begin(get(), commit);
      set({ settings: { ...get().settings, type }, error: null });
    },

    setPositionPreset: (preset) => {
      history.begin(get(), commit);
      set({ settings: { ...get().settings, positionPreset: preset } });
    },

    setCustomPosition: (x, y) => {
      history.begin(get(), commit);
      set({
        settings: {
          ...get().settings,
          positionPreset: "custom",
          customX: Math.max(0, Math.min(1, x)),
          customY: Math.max(0, Math.min(1, y)),
        },
      });
    },

    setOutputFormat: (format) => set({ settings: { ...get().settings, outputFormat: format } }),
    setQuality: (q) => set({ settings: { ...get().settings, quality: q } }),
    setFileName: (name) => set({ settings: { ...get().settings, fileName: name } }),

    resetSettings: () => {
      history.begin(get(), commit);
      set({
        settings: {
          ...DEFAULT_WATERMARK_SETTINGS,
          outputFormat: get().settings.outputFormat,
          quality: get().settings.quality,
          fileName: get().settings.fileName,
        },
      });
      history.flush(commit);
    },

    undo: () => {
      history.flush(commit);
      const state = get();
      const last = state.past[state.past.length - 1];
      if (!last) return;
      const current: HistoryEntry = { settings: state.settings, logoFile: state.logoFile, logoPreviewUrl: state.logoPreviewUrl };
      set({
        settings: last.settings,
        logoFile: last.logoFile,
        logoPreviewUrl: last.logoPreviewUrl,
        past: state.past.slice(0, -1),
        future: [current, ...state.future].slice(0, 50),
        error: null,
      });
    },

    redo: () => {
      history.flush(commit);
      const state = get();
      const next = state.future[0];
      if (!next) return;
      const current: HistoryEntry = { settings: state.settings, logoFile: state.logoFile, logoPreviewUrl: state.logoPreviewUrl };
      set({
        settings: next.settings,
        logoFile: next.logoFile,
        logoPreviewUrl: next.logoPreviewUrl,
        past: [...state.past, current].slice(-50),
        future: state.future.slice(1),
        error: null,
      });
    },

    download: async () => {
      const state = get();
      if (!state.originalPreviewUrl || state.isProcessing) return;
      if (state.naturalWidth === 0 || state.naturalHeight === 0) return;

      set({ isProcessing: true, error: null });

      try {
        const img = await loadImage(state.originalPreviewUrl);
        const logo = state.logoPreviewUrl ? await loadImage(state.logoPreviewUrl) : null;

        const blob = await renderWatermarkedBlob(img, logo, state.settings, state.naturalWidth, state.naturalHeight);

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const ext = watermarkExt(state.settings.outputFormat);
        const baseName = state.settings.fileName.trim() || state.originalFile?.name.replace(/\.[^.]+$/, "") || "watermarked";
        link.download = `${baseName}-watermarked.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        set({ isProcessing: false, resultSize: blob.size, resultFormat: state.settings.outputFormat });
      } catch (err) {
        set({
          isProcessing: false,
          error: err instanceof Error ? err.message : "An error occurred while applying the watermark.",
        });
      }
    },

    reset: () => {
      history.discard();
      const state = get();
      state.files.forEach((e) => URL.revokeObjectURL(e.previewUrl));
      if (state.logoPreviewUrl) URL.revokeObjectURL(state.logoPreviewUrl);

      set({
        files: [],
        activeIndex: 0,
        originalFile: null,
        originalPreviewUrl: null,
        originalSize: 0,
        naturalWidth: 0,
        naturalHeight: 0,
        logoFile: null,
        logoPreviewUrl: null,
        settings: { ...DEFAULT_WATERMARK_SETTINGS },
        past: [],
        future: [],
        isProcessing: false,
        error: null,
        resultSize: 0,
        resultFormat: null,
      });
    },
  };
});
