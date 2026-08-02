/**
 * Mask refinement Web Worker.
 *
 * The refinement pipeline (island removal, hole fill, color-aware defringe,
 * edge smoothing) is the heaviest pure-JS pass of the background remover —
 * at working resolution (2048px) it can take tens of milliseconds on low-end
 * devices. Running it in a dedicated worker keeps the UI thread responsive
 * (no frozen progress bar / scroll) while the AI or fallback provider runs.
 *
 * Protocol: receive { id, data, width, height, mask, options } and reply with
 * { id, mask } (the refined mask as a transferable buffer). Buffers are
 * transferred (not copied) to avoid duplicating multi-MB arrays.
 */

import { refineMask, type RefineOptions } from "../utils/refine";

interface RefineRequest {
  id: number;
  data: Uint8ClampedArray;
  width: number;
  height: number;
  mask: Uint8ClampedArray;
  options: RefineOptions;
}

self.onmessage = (event: MessageEvent<RefineRequest>) => {
  const { id, data, width, height, mask, options } = event.data;
  try {
    const refined = refineMask({ data, width, height }, mask, options);
    // Transfer the refined buffer back — zero-copy on the main thread.
    (self as unknown as Worker).postMessage({ id, mask: refined.buffer }, [refined.buffer]);
  } catch (err) {
    (self as unknown as Worker).postMessage({
      id,
      error: err instanceof Error ? err.message : "Refinement failed",
    });
  }
};
