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

interface WatermarkState {
  // Input image
  originalFile: File | null;
  originalPreviewUrl: string | null;
  originalSize: number;
  naturalWidth: number;
  naturalHeight: number;

  // Logo (image watermark)
  logoFile: File | null;
  logoPreviewUrl: string | null;

  // Active settings + undo/redo history
  settings: WatermarkSettings;
  past: HistoryEntry[];
  future: HistoryEntry[];

  // Processing
  isProcessing: boolean;
  error: string | null;

  // Last exported result (for size display)
  resultSize: number;
  resultFormat: WatermarkFormat | null;

  // Actions
  setFile: (file: File) => void;
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

/**
 * Coalesce rapid changes (slider drags, typing) into a single undo step:
 * the first snapshot taken during a burst is the one that gets pushed,
 * any further changes within the window just extend the same burst.
 */
function createHistoryKeeper() {
  let pending: HistoryEntry | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const snapshot = (state: WatermarkState): HistoryEntry => ({
    settings: state.settings,
    logoFile: state.logoFile,
    logoPreviewUrl: state.logoPreviewUrl,
  });

  /**
   * Record the current state as the start of an undo burst. Rapid successive
   * changes (slider drags, typing) share one snapshot, and the burst commits
   * to the history stack after a quiet period — so a whole drag = one undo.
   */
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

  /** Force-commit any pending burst immediately. */
  const flush = (commit: (entry: HistoryEntry) => void) => {
    if (timer) clearTimeout(timer);
    timer = null;
    if (pending) {
      const entry = pending;
      pending = null;
      commit(entry);
    }
  };

  /** Drop any pending burst without committing (used when loading a new image). */
  const discard = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    pending = null;
  };

  return { begin, flush, discard };
}

/** Commit an entry into the past stack (shared by all commit callers). */
function commitEntry(
  set: (fn: (s: WatermarkState) => Partial<WatermarkState>) => void,
  entry: HistoryEntry
) {
  set((s) => ({ past: [...s.past.slice(-49), entry], future: [] }));
}

export const useWatermarkStore = create<WatermarkState>((set, get) => {
  const history = createHistoryKeeper();
  const commit = (entry: HistoryEntry) => commitEntry(set, entry);

  return {
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
      const prevUrl = get().originalPreviewUrl;
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      const prevLogo = get().logoPreviewUrl;
      if (prevLogo) URL.revokeObjectURL(prevLogo);

      const previewUrl = URL.createObjectURL(file);
      set({
        originalFile: file,
        originalPreviewUrl: previewUrl,
        originalSize: file.size,
        logoFile: null,
        logoPreviewUrl: null,
        settings: { ...DEFAULT_WATERMARK_SETTINGS },
        past: [],
        future: [],
        isProcessing: true,
        error: null,
        resultSize: 0,
        resultFormat: null,
      });

      loadImage(previewUrl)
        .then((img) => {
          if (get().originalPreviewUrl !== previewUrl) return;
          set({
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            isProcessing: false,
          });
        })
        .catch(() => {
          if (get().originalPreviewUrl !== previewUrl) return;
          set({ isProcessing: false, error: "Failed to read the image. Please try another file." });
        });
    },

    setLogoFile: (file: File | null) => {
      // NOTE: we intentionally do NOT revoke the previous logo URL here. History
      // entries store the logoPreviewUrl string, and undo/redo restore it — so
      // revoking on replace would leave history pointing at a dead blob URL.
      // Old logo URLs are only revoked in setFile()/reset(), which wipe history.

      // Logo upload/removal is undoable (snapshots carry logoFile + logoPreviewUrl)
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
      set({
        settings: { ...get().settings, text: { ...get().settings.text, ...patch } },
      });
    },

    updateImage: (patch) => {
      history.begin(get(), commit);
      set({
        settings: { ...get().settings, image: { ...get().settings.image, ...patch } },
      });
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
      // Begin a history burst on the first drag move so a whole drag = one undo
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

    setOutputFormat: (format) => {
      set({ settings: { ...get().settings, outputFormat: format } });
    },

    setQuality: (q) => {
      set({ settings: { ...get().settings, quality: q } });
    },

    setFileName: (name) => {
      set({ settings: { ...get().settings, fileName: name } });
    },

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
      const current: HistoryEntry = {
        settings: state.settings,
        logoFile: state.logoFile,
        logoPreviewUrl: state.logoPreviewUrl,
      };
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
      const current: HistoryEntry = {
        settings: state.settings,
        logoFile: state.logoFile,
        logoPreviewUrl: state.logoPreviewUrl,
      };
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

        const blob = await renderWatermarkedBlob(
          img,
          logo,
          state.settings,
          state.naturalWidth,
          state.naturalHeight
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const ext = watermarkExt(state.settings.outputFormat);
        const baseName =
          state.settings.fileName.trim() ||
          state.originalFile?.name.replace(/\.[^.]+$/, "") ||
          "watermarked";
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
      if (state.originalPreviewUrl) URL.revokeObjectURL(state.originalPreviewUrl);
      if (state.logoPreviewUrl) URL.revokeObjectURL(state.logoPreviewUrl);

      set({
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
