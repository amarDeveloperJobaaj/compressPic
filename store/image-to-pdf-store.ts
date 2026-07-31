import { create } from "zustand";
import {
  DEFAULT_PDF_SETTINGS,
  generatePdf,
  type PdfSettings,
} from "@/features/image-to-pdf/utils/pdf";
import { isHeicFile } from "@/lib/heic";
import { loadFileAsImage, loadImage, revokeUrl, triggerDownload } from "@/lib/image";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_SIZE = 50 * 1024 * 1024;
const MAX_ITEMS = 50;

export interface PdfItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  /** True while a HEIC file is being decoded — its previewUrl is not drawable yet. */
  decoding: boolean;
}

interface ImageToPdfState {
  items: PdfItem[];
  settings: PdfSettings;
  isProcessing: boolean;
  error: string | null;
  resultSize: number;

  addFiles: (files: FileList | File[]) => void;
  removeItem: (id: string) => void;
  moveItem: (id: string, direction: -1 | 1) => void;
  clearAll: () => void;
  updateSettings: (patch: Partial<PdfSettings>) => void;
  generate: () => Promise<void>;
  reset: () => void;
}

let idCounter = 0;
const nextId = () => `pdf-item-${++idCounter}`;

export const useImageToPdfStore = create<ImageToPdfState>((set, get) => ({
  items: [],
  settings: { ...DEFAULT_PDF_SETTINGS },
  isProcessing: false,
  error: null,
  resultSize: 0,

  addFiles: (files) => {
    const incoming = Array.from(files);
    if (incoming.length === 0) return;
    if (incoming.length + get().items.length > MAX_ITEMS) {
      set({ error: `You can add up to ${MAX_ITEMS} images per PDF.` });
      return;
    }

    // Validate all files first
    const valid = incoming.filter((file) => {
      const okType = ACCEPTED_TYPES.includes(file.type) || isHeicFile(file);
      return okType && file.size <= MAX_SIZE;
    });
    const skipped = incoming.length - valid.length;
    if (valid.length === 0) {
      set({ error: "Please choose JPG, PNG, WEBP, or HEIC images up to 50 MB each." });
      return;
    }

    set({ error: skipped > 0 ? `${skipped} file(s) skipped — unsupported or over 50 MB.` : null });

    // Add every valid file immediately (object URL of the raw file), then
    // decode HEIC files asynchronously and swap in the decoded URL when ready.
    const newItems: PdfItem[] = valid.map((file) => ({
      id: nextId(),
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      decoding: isHeicFile(file),
    }));
    set({ items: [...get().items, ...newItems] });

    for (const file of valid) {
      if (!isHeicFile(file)) continue;
      const item = newItems.find((n) => n.file === file);
      if (!item) continue;
      loadFileAsImage(file)
        .then(({ url: decodedUrl }) => {
          const state = get();
          const current = state.items.find((i) => i.id === item.id);
          if (current) {
            revokeUrl(current.previewUrl);
            set({
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, previewUrl: decodedUrl, decoding: false }
                  : i
              ),
            });
          } else {
            revokeUrl(decodedUrl);
          }
        })
        .catch(() => {
          // Couldn't decode — drop the item so it can't break PDF generation
          const state = get();
          const current = state.items.find((i) => i.id === item.id);
          if (current) revokeUrl(current.previewUrl);
          set({
            items: state.items.filter((i) => i.id !== item.id),
            error: `Couldn't read ${file.name}. It was removed.`,
          });
        });
    }
  },

  removeItem: (id) => {
    const state = get();
    const item = state.items.find((i) => i.id === id);
    if (item) revokeUrl(item.previewUrl);
    set({ items: state.items.filter((i) => i.id !== id) });
  },

  moveItem: (id, direction) => {
    const items = [...get().items];
    const index = items.findIndex((i) => i.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= items.length) return;
    const [item] = items.splice(index, 1);
    items.splice(target, 0, item);
    set({ items });
  },

  clearAll: () => {
    const state = get();
    state.items.forEach((item) => revokeUrl(item.previewUrl));
    set({ items: [], resultSize: 0 });
  },

  updateSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),

  generate: async () => {
    const state = get();
    if (state.items.length === 0 || state.isProcessing) return;
    if (state.items.some((item) => item.decoding)) {
      set({ error: "Please wait — some images are still loading." });
      return;
    }

    set({ isProcessing: true, error: null });
    try {
      const inputs: { name: string; img: HTMLImageElement }[] = [];
      for (const item of state.items) {
        const img = await loadImage(item.previewUrl);
        inputs.push({ name: item.name, img });
      }
      const blob = await generatePdf(inputs, state.settings);
      const baseName = state.settings.fileName.trim() || "images";
      triggerDownload(blob, `${baseName}.pdf`);
      set({ isProcessing: false, resultSize: blob.size });
    } catch (err) {
      set({
        isProcessing: false,
        error: err instanceof Error ? err.message : "Failed to generate the PDF.",
      });
    }
  },

  reset: () => {
    const state = get();
    state.items.forEach((item) => revokeUrl(item.previewUrl));
    set({
      items: [],
      settings: { ...DEFAULT_PDF_SETTINGS },
      isProcessing: false,
      error: null,
      resultSize: 0,
    });
  },
}));
