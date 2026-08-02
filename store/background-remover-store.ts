import { create } from "zustand";
import { removeImageBackground, forceAiRetry } from "@/features/background-remover/services";
import type { BackgroundSettings } from "@/features/background-remover/utils/compose";
import { DEFAULT_BACKGROUND, capSize } from "@/features/background-remover/utils/compose";
import type { AdjustmentSettings } from "@/features/background-remover/utils/adjustments";
import { DEFAULT_ADJUSTMENTS } from "@/features/background-remover/utils/adjustments";
import {
  blurMask,
  stampBrush,
  upscaleMask,
} from "@/features/background-remover/utils/mask";
import { loadImageData, removeIslands, fillHoles } from "@/features/background-remover/utils/refine";
import { refineMaskInWorker } from "@/features/background-remover/utils/refineWorker";
import type { ExportSettings } from "@/features/background-remover/utils/export";
import { DEFAULT_EXPORT, renderExportBlob, downloadBlob, createZip, exportExt, baseName } from "@/features/background-remover/utils/export";

/** Working-resolution cap (px on the longest edge) — bounds memory + model time. */
export const WORK_MAX_EDGE = 2048;
/**
 * Cap for "Original" resolution exports — prevents OOM when a compressed
 * source (e.g. a 10 MB PNG) decodes to extreme dimensions like 8000×6000.
 * The cutout mask is upscaled to this size instead, keeping exports sharp
 * without blowing up memory.
 */
export const EXPORT_MAX_EDGE = 6000;
/** Max undo/redo snapshots per item (each is a full alpha array). */
export const MAX_HISTORY = 8;

export type ItemStatus = "queued" | "processing" | "done" | "error";

export interface BatchItem {
  id: string;
  file: File;
  name: string;
  size: number;
  /** Full-resolution preview (before image). */
  originalUrl: string;
  /** Downscaled working copy used for masking + compositing. */
  workUrl: string;
  workW: number;
  workH: number;
  /** Source file's full dimensions (used for original-resolution export). */
  origW: number;
  origH: number;
  /** Current alpha mask at working resolution (null until processed). */
  mask: Uint8ClampedArray | null;
  /** Pristine AI mask — restored by "Reset". */
  originalMask: Uint8ClampedArray | null;
  maskHistory: Uint8ClampedArray[];
  maskFuture: Uint8ClampedArray[];
  status: ItemStatus;
  error: string | null;
  provider: string | null;
  /** True when this mask came from the offline fallback (not the AI engine). */
  usedFallback: boolean;
}

export interface EdgeSettings {
  /** Active paint tool, or null when not painting. */
  brushMode: "restore" | "erase" | null;
  /** Brush size in px at the working resolution. */
  brushSize: number;
  /** 0 (soft) → 1 (hard). */
  brushHardness: number;
}

export const DEFAULT_EDGE: EdgeSettings = {
  brushMode: null,
  brushSize: 48,
  brushHardness: 0.6,
};

interface BackgroundRemoverState {
  items: BatchItem[];
  activeIndex: number;
  isProcessing: boolean;
  /** Progress (0–100) of the currently processing item. */
  progress: number;
  stage: string;
  error: string | null;
  /** Bumped on every brush stamp — canvas viewer redraws on this. */
  maskVersion: number;
  /** Bumped when the mask changes non-incrementally (stroke end, ops, undo). */
  fullRecompose: number;
  /** True while the color-aware refinement pass is running on a mask. */
  refining: boolean;

  background: BackgroundSettings;
  bgImage: HTMLImageElement | null;
  bgImageUrl: string | null;
  adjustments: AdjustmentSettings;
  edge: EdgeSettings;
  exportSettings: ExportSettings;

  addFiles: (files: File[]) => void;
  removeItem: (index: number) => void;
  setActiveIndex: (index: number) => void;
  processQueue: () => void;
  reprocessItem: (index: number) => void;
  /** Re-queue an item and force the AI engine to be retried (resets fallback cache). */
  retryWithAi: (index: number) => void;

  beginStroke: () => void;
  paintMask: (normalizedX: number, normalizedY: number) => void;
  endStroke: () => void;
  applyEdgeOp: (op: "smooth" | "feather" | "hair" | "cleanup") => void;
  /** Full advanced refinement (specks → holes → defringe → smooth). */
  refineActiveMask: () => Promise<void>;
  undoMask: () => void;
  redoMask: () => void;
  resetMask: () => void;

  setBackground: (patch: Partial<BackgroundSettings>) => void;
  setBgImageFile: (file: File | null) => void;
  setAdjustments: (patch: Partial<AdjustmentSettings>) => void;
  setEdge: (patch: Partial<EdgeSettings>) => void;
  setExport: (patch: Partial<ExportSettings>) => void;

  /** Copy the active composed image (PNG) to the system clipboard. */
  copyActive: () => Promise<boolean>;
  downloadActive: () => Promise<boolean>;
  downloadAll: () => Promise<boolean>;
  reset: () => void;
}

let idCounter = 0;
const nextId = () => `bg-${++idCounter}`;

/**
 * Resolve the source image, output dimensions and mask for an export.
 *
 * "Optimized" exports reuse the working copy (≤ WORK_MAX_EDGE). "Original"
 * exports load the full-resolution source and upscale the mask back up —
 * capped at EXPORT_MAX_EDGE so an extreme source (e.g. an 8000×6000 PNG)
 * can't OOM the tab. When the capped size matches the working size the mask
 * is passed through unchanged.
 */
function resolveExportSource(
  item: BatchItem,
  useOriginal: boolean
): { src: string; width: number; height: number; mask: Uint8ClampedArray } {
  // Self-guard: all current callers verify item.mask first, but the helper
  // should fail loudly (not crash inside upscaleMask) if that ever changes.
  if (!item.mask) throw new Error("No mask available to export");
  if (!useOriginal || item.origW <= 0) {
    return {
      src: item.workUrl,
      width: item.workW,
      height: item.workH,
      mask: item.mask!,
    };
  }
  const { width, height } = capSize(item.origW, item.origH, EXPORT_MAX_EDGE);
  return {
    src: item.originalUrl,
    width,
    height,
    mask:
      width !== item.workW || height !== item.workH
        ? upscaleMask(item.mask!, item.workW, item.workH, width, height)
        : item.mask!,
  };
}

/** Load an HTMLImageElement from a blob URL with a friendly error. */
function loadExportImage(src: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load the image"));
    image.src = src;
  });
}

/** Downscale a File to the working resolution, returning a blob URL + size. */
async function prepareWorkImage(
  file: File
): Promise<{ workUrl: string; workW: number; workH: number; origW: number; origH: number }> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Failed to read the image"));
      image.src = url;
    });
    const { width, height } = capSize(img.naturalWidth, img.naturalHeight, WORK_MAX_EDGE);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D is not supported");
    ctx.drawImage(img, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("Failed to prepare the image");
    return {
      workUrl: URL.createObjectURL(blob),
      workW: width,
      workH: height,
      origW: img.naturalWidth,
      origH: img.naturalHeight,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export const useBackgroundRemoverStore = create<BackgroundRemoverState>((set, get) => {
  /** Process items sequentially from the queue head. */
  const processQueue = async () => {
    const state = get();
    if (state.isProcessing) return;

    // Only auto-process "queued" items — errors are retried explicitly via
    // reprocessItem (which re-queues first), avoiding an infinite retry loop.
    const index = state.items.findIndex((item) => item.status === "queued");
    if (index === -1) return;

    const item = state.items[index];
    set({
      isProcessing: true,
      progress: 0,
      stage: "Starting…",
      error: null,
    });
    // Mark processing in the items array
    set((s) => ({
      items: s.items.map((it, i) =>
        i === index ? { ...it, status: "processing", error: null } : it
      ),
      activeIndex: index,
    }));

    try {
      const workBlob = await fetch(item.workUrl).then((r) => r.blob());
      const result = await removeImageBackground(workBlob, (p) => {
        set({ progress: p.percent, stage: p.stage });
      });
      const mask = result.mask;

      set((s) => ({
        items: s.items.map((it, i) =>
          i === index
            ? {
                ...it,
                mask: new Uint8ClampedArray(mask),
                originalMask: new Uint8ClampedArray(mask),
                maskHistory: [],
                maskFuture: [],
                status: "done",
                provider: result.provider,
                usedFallback: result.usedFallback ?? false,
              }
            : it
        ),
        isProcessing: false,
        progress: 100,
        stage: "Done",
        fullRecompose: get().fullRecompose + 1,
      }));
    } catch (err) {
      set((s) => ({
        items: s.items.map((it, i) =>
          i === index
            ? {
                ...it,
                status: "error",
                error: err instanceof Error ? err.message : "Background removal failed",
              }
            : it
        ),
        isProcessing: false,
        error: err instanceof Error ? err.message : "Background removal failed",
      }));
    }

    // Process the next queued item, if any (never error items — see above)
    const next = get().items.some((it) => it.status === "queued");
    if (next) processQueue();
  };

  return {
    items: [],
    activeIndex: -1,
    isProcessing: false,
    progress: 0,
    stage: "",
    error: null,
    maskVersion: 0,
    fullRecompose: 0,
    refining: false,

    background: { ...DEFAULT_BACKGROUND },
    bgImage: null,
    bgImageUrl: null,
    adjustments: { ...DEFAULT_ADJUSTMENTS },
    edge: { ...DEFAULT_EDGE },
    exportSettings: { ...DEFAULT_EXPORT },

    addFiles: (files) => {
      const valid = files.filter((file) => {
        if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) return false;
        if (file.size > 50 * 1024 * 1024) return false;
        return true;
      });
      if (valid.length === 0) {
        set({ error: "Please add JPG, PNG, or WEBP images up to 50 MB." });
        return;
      }

      const added: BatchItem[] = [];

      valid.forEach((file) => {
        const originalUrl = URL.createObjectURL(file);
        added.push({
          id: nextId(),
          file,
          name: file.name,
          size: file.size,
          originalUrl,
          workUrl: "",
          workW: 0,
          workH: 0,
          origW: 0,
          origH: 0,
          mask: null,
          originalMask: null,
          maskHistory: [],
          maskFuture: [],
          status: "queued",
          error: null,
          provider: null,
          usedFallback: false,
        });
      });

      // Prepare all working copies first, then commit items + start the queue
      (async () => {
        const prepared = await Promise.all(
          added.map(async (item) => {
            try {
              const p = await prepareWorkImage(item.file);
              return { id: item.id, ...p, ok: true as const };
            } catch (err) {
              return {
                id: item.id,
                ok: false as const,
                error: err instanceof Error ? err.message : "Failed to prepare image",
              };
            }
          })
        );

        set((s) => ({
          items: [
            ...s.items,
            ...added.map((item) => {
              const p = prepared.find((x) => x.id === item.id);
              if (p && p.ok) {
                return {
                  ...item,
                  workUrl: p.workUrl,
                  workW: p.workW,
                  workH: p.workH,
                  origW: p.origW,
                  origH: p.origH,
                };
              }
              return {
                ...item,
                status: "error" as const,
                error: p && !p.ok ? p.error : "Failed to prepare image",
              };
            }),
          ],
          activeIndex: s.activeIndex === -1 ? 0 : s.activeIndex,
        }));
        processQueue();
      })();
    },

    removeItem: (index) => {
      const state = get();
      const item = state.items[index];
      if (!item) return;
      if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
      if (item.workUrl) URL.revokeObjectURL(item.workUrl);
      const items = state.items.filter((_, i) => i !== index);
      set({
        items,
        activeIndex: Math.min(Math.max(state.activeIndex, 0), items.length - 1),
      });
    },

    setActiveIndex: (index) => set({ activeIndex: index }),

    processQueue,

    reprocessItem: (index) => {
      // Re-queue a single item and process the queue
      set((s) => ({
        items: s.items.map((it, i) =>
          i === index
            ? { ...it, status: "queued", mask: null, originalMask: null, maskHistory: [], maskFuture: [], error: null, usedFallback: false }
            : it
        ),
      }));
      processQueue();
    },

    retryWithAi: (index) => {
      // Reset the fallback cache so the next pass really tries the AI engine
      // again (a transient model-download failure shouldn't stick forever).
      forceAiRetry();
      get().reprocessItem(index);
    },

    beginStroke: () => {
      const state = get();
      const item = state.items[state.activeIndex];
      if (!item || !item.mask) return;
      const snapshot = new Uint8ClampedArray(item.mask);
      set((s) => ({
        items: s.items.map((it, i) =>
          i === state.activeIndex
            ? {
                ...it,
                maskHistory: [...it.maskHistory.slice(-(MAX_HISTORY - 1)), snapshot],
                maskFuture: [],
              }
            : it
        ),
      }));
    },

    paintMask: (normalizedX, normalizedY) => {
      const state = get();
      const item = state.items[state.activeIndex];
      if (!item || !item.mask || state.isProcessing) return;
      const mode = state.edge.brushMode;
      if (!mode) return;

      const x = Math.round(normalizedX * item.workW);
      const y = Math.round(normalizedY * item.workH);
      const radius = Math.max(1, state.edge.brushSize * (item.workW / 800));

      // In-place stamp + bump the version so the canvas viewer redraws
      stampBrush(item.mask, item.workW, item.workH, x, y, radius, state.edge.brushHardness, mode);
      set((s) => ({ maskVersion: s.maskVersion + 1 }));
    },

    endStroke: () => {
      // History snapshot was taken at beginStroke; signal the viewer to do a
      // full recompose (with adjustments) once the stroke is over.
      set((s) => ({ fullRecompose: s.fullRecompose + 1 }));
    },

    applyEdgeOp: (op) => {
      const state = get();
      const item = state.items[state.activeIndex];
      if (!item || !item.mask || state.isProcessing) return;
      const snapshot = new Uint8ClampedArray(item.mask);
      let next: Uint8ClampedArray;

      switch (op) {
        case "smooth":
          next = blurMask(item.mask, item.workW, item.workH, 1);
          break;
        case "feather":
          next = blurMask(item.mask, item.workW, item.workH, 3);
          break;
        case "hair":
          // Light blur + slight boost of semi-transparent pixels
          next = blurMask(item.mask, item.workW, item.workH, 1);
          for (let i = 0; i < next.length; i++) {
            if (next[i] > 0 && next[i] < 255) {
              next[i] = Math.min(255, next[i] + 40);
            }
          }
          break;
        case "cleanup": {
          // Structural cleanup: drop stray specks and close enclosed holes
          // (no color data needed — safe to run synchronously).
          next = removeIslands(item.mask, item.workW, item.workH, 0.0002);
          next = fillHoles(next, item.workW, item.workH, 0.05);
          break;
        }
      }

      set((s) => ({
        items: s.items.map((it, i) =>
          i === state.activeIndex
            ? {
                ...it,
                mask: next,
                maskHistory: [...it.maskHistory.slice(-(MAX_HISTORY - 1)), snapshot],
                maskFuture: [],
              }
            : it
        ),
        fullRecompose: s.fullRecompose + 1,
      }));
    },

    refineActiveMask: async () => {
      const state = get();
      const item = state.items[state.activeIndex];
      if (!item || !item.mask || state.isProcessing || state.refining) return;
      const snapshot = new Uint8ClampedArray(item.mask);
      set({ refining: true, error: null });
      try {
        const img = await loadImageData(item.workUrl);
        // Run the heavy pipeline in a Web Worker so the preview stays smooth.
        const refined = await refineMaskInWorker(img, item.mask, {
          removeIslands: true,
          fillHoles: true,
          defringe: true,
          defringeStrength: 0.9,
          smooth: 1,
        });
        set((s) => ({
          items: s.items.map((it, i) =>
            i === state.activeIndex
              ? {
                  ...it,
                  mask: refined,
                  maskHistory: [...it.maskHistory.slice(-(MAX_HISTORY - 1)), snapshot],
                  maskFuture: [],
                }
              : it
          ),
          fullRecompose: s.fullRecompose + 1,
        }));
      } catch (err) {
        set({ error: err instanceof Error ? err.message : "Refinement failed" });
      } finally {
        set({ refining: false });
      }
    },

    undoMask: () => {
      const state = get();
      const item = state.items[state.activeIndex];
      if (!item || item.maskHistory.length === 0 || state.isProcessing) return;
      const prev = item.maskHistory[item.maskHistory.length - 1];
      set((s) => ({
        items: s.items.map((it, i) =>
          i === state.activeIndex
            ? {
                ...it,
                mask: new Uint8ClampedArray(prev),
                maskHistory: it.maskHistory.slice(0, -1),
                maskFuture: [...it.maskFuture, new Uint8ClampedArray(it.mask ?? prev)],
              }
            : it
        ),
        fullRecompose: s.fullRecompose + 1,
      }));
    },

    redoMask: () => {
      const state = get();
      const item = state.items[state.activeIndex];
      if (!item || item.maskFuture.length === 0 || state.isProcessing) return;
      const next = item.maskFuture[item.maskFuture.length - 1];
      set((s) => ({
        items: s.items.map((it, i) =>
          i === state.activeIndex
            ? {
                ...it,
                mask: new Uint8ClampedArray(next),
                maskHistory: [...it.maskHistory, new Uint8ClampedArray(it.mask ?? next)],
                maskFuture: it.maskFuture.slice(0, -1),
              }
            : it
        ),
        fullRecompose: s.fullRecompose + 1,
      }));
    },

    resetMask: () => {
      const state = get();
      const item = state.items[state.activeIndex];
      if (!item || !item.originalMask || state.isProcessing) return;
      const snapshot = item.mask ? new Uint8ClampedArray(item.mask) : null;
      set((s) => ({
        items: s.items.map((it, i) =>
          i === state.activeIndex
            ? {
                ...it,
                mask: new Uint8ClampedArray(it.originalMask!),
                maskHistory: snapshot
                  ? [...it.maskHistory.slice(-(MAX_HISTORY - 1)), snapshot]
                  : it.maskHistory,
                maskFuture: [],
              }
            : it
        ),
        fullRecompose: s.fullRecompose + 1,
      }));
    },

    setBackground: (patch) =>
      set((s) => ({ background: { ...s.background, ...patch } })),

    setBgImageFile: (file) => {
      const state = get();
      if (state.bgImageUrl) URL.revokeObjectURL(state.bgImageUrl);
      if (!file) {
        set({ bgImage: null, bgImageUrl: null });
        return;
      }
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => set({ bgImage: img, bgImageUrl: url });
      img.onerror = () => {
        URL.revokeObjectURL(url);
        set({ error: "Failed to load the background image." });
      };
      img.src = url;
    },

    setAdjustments: (patch) =>
      set((s) => ({ adjustments: { ...s.adjustments, ...patch } })),

    setEdge: (patch) => set((s) => ({ edge: { ...s.edge, ...patch } })),

    setExport: (patch) =>
      set((s) => ({ exportSettings: { ...s.exportSettings, ...patch } })),

    copyActive: async () => {
      const state = get();
      const item = state.items[state.activeIndex];
      if (!item || !item.mask || state.isProcessing) return false;
      if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
        set({ error: "Clipboard image copy isn't supported in this browser — use Download instead." });
        return false;
      }
      set({ isProcessing: true, stage: "Rendering…", error: null });
      try {
        const useOriginal = state.exportSettings.resolution === "original";
        const { src, width, height, mask } = resolveExportSource(item, useOriginal);
        const img = await loadExportImage(src);
        const bgImage = state.background.type === "image" ? state.bgImage : null;
        const blob = await renderExportBlob(
          img,
          mask,
          state.background,
          state.adjustments,
          bgImage,
          width,
          height,
          { ...state.exportSettings, format: "png-transparent" }
        );
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        return true;
      } catch (err) {
        set({ error: err instanceof Error ? err.message : "Copy failed" });
        return false;
      } finally {
        set({ isProcessing: false });
      }
    },

    downloadActive: async () => {
      const state = get();
      const item = state.items[state.activeIndex];
      if (!item || !item.mask || state.isProcessing) return false;
      set({ isProcessing: true, stage: "Rendering…", error: null });
      try {
        const useOriginal = state.exportSettings.resolution === "original";
        const { src, width, height, mask } = resolveExportSource(item, useOriginal);
        const img = await loadExportImage(src);
        const bgImage = state.background.type === "image" ? state.bgImage : null;
        const blob = await renderExportBlob(
          img,
          mask,
          state.background,
          state.adjustments,
          bgImage,
          width,
          height,
          state.exportSettings
        );
        const name =
          state.exportSettings.fileName.trim() ||
          baseName(item.file.name) + "-bg-removed";
        downloadBlob(blob, `${name}.${exportExt(state.exportSettings.format)}`);
        return true;
      } catch (err) {
        set({ error: err instanceof Error ? err.message : "Export failed" });
        return false;
      } finally {
        set({ isProcessing: false });
      }
    },

    downloadAll: async () => {
      const state = get();
      const done = state.items.filter((it) => it.status === "done" && it.mask);
      if (done.length === 0 || state.isProcessing) return false;
      set({ isProcessing: true, stage: "Packaging ZIP…", error: null });
      try {
        const bgImage = state.background.type === "image" ? state.bgImage : null;
        const ext = exportExt(state.exportSettings.format);
        const files: { name: string; blob: Blob }[] = [];
        for (const item of done) {
          const useOriginal = state.exportSettings.resolution === "original";
          const { src, width, height, mask } = resolveExportSource(item, useOriginal);
          const img = await loadExportImage(src);
          const blob = await renderExportBlob(
            img,
            mask,
            state.background,
            state.adjustments,
            bgImage,
            width,
            height,
            state.exportSettings
          );
          files.push({ name: `${baseName(item.file.name)}-bg-removed.${ext}`, blob });
        }
        const zipBlob = await createZip(files);
        downloadBlob(zipBlob, "background-removed-images.zip");
        return true;
      } catch (err) {
        set({ error: err instanceof Error ? err.message : "ZIP export failed" });
        return false;
      } finally {
        set({ isProcessing: false });
      }
    },

    reset: () => {
      const state = get();
      state.items.forEach((item) => {
        if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
        if (item.workUrl) URL.revokeObjectURL(item.workUrl);
      });
      if (state.bgImageUrl) URL.revokeObjectURL(state.bgImageUrl);
      set({
        items: [],
        activeIndex: -1,
        isProcessing: false,
        progress: 0,
        stage: "",
        error: null,
        refining: false,
        background: { ...DEFAULT_BACKGROUND },
        bgImage: null,
        bgImageUrl: null,
        adjustments: { ...DEFAULT_ADJUSTMENTS },
        edge: { ...DEFAULT_EDGE },
        exportSettings: { ...DEFAULT_EXPORT },
      });
    },
  };
});
