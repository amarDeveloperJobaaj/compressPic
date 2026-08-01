/**
 * Background removal service layer.
 *
 * The UI never talks to a specific AI vendor — it goes through this
 * interface, so the inference provider can be swapped (imgly AI →
 * transformers.js → a future cloud API) without touching any component.
 */

export interface RemovalProgress {
  /** 0–100 overall progress */
  percent: number;
  /** Human-readable stage, e.g. "Downloading AI model…" */
  stage: string;
}

export type ProgressCallback = (progress: RemovalProgress) => void;

export interface RemovalResult {
  /** Mask width (matches the working canvas) */
  width: number;
  /** Mask height (matches the working canvas) */
  height: number;
  /** Per-pixel alpha 0–255; 255 = keep (subject), 0 = background */
  mask: Uint8ClampedArray;
  /** Human-readable label of the provider that produced the mask */
  provider: string;
  /** True when the mask came from the offline fallback (not the AI engine). */
  usedFallback?: boolean;
}

export interface BackgroundRemovalProvider {
  readonly id: string;
  readonly label: string;
  /**
   * Produce an alpha mask for the given image blob. The blob should already
   * be sized to the working resolution to bound memory.
   */
  removeBackground(blob: Blob, onProgress?: ProgressCallback): Promise<RemovalResult>;
}
