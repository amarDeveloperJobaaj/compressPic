/**
 * Async mask refinement that offloads the heavy pipeline to a Web Worker
 * (features/background-remover/worker/refine.worker.ts) so the UI thread
 * stays responsive during the final AI-quality pass.
 *
 * Graceful degradation: if the Worker API is unavailable (rare SSR edge
 * cases, overly strict CSP), we transparently fall back to the synchronous
 * main-thread pipeline from ./refine — identical output, just a few ms of
 * blocking. Callers should always `await` this function.
 */

import { refineMask, type RefinedImageData, type RefineOptions } from "./refine";

interface RefineResponse {
  id: number;
  mask?: ArrayBuffer;
  error?: string;
}

interface PendingEntry {
  /** Original request kept so a failed worker pass can be re-run inline. */
  img: RefinedImageData;
  mask: Uint8ClampedArray;
  options: RefineOptions;
  resolve: (mask: Uint8ClampedArray) => void;
  reject: (err: Error) => void;
}

let workerPromise: Promise<Worker> | null = null;
let requestId = 0;
const pending = new Map<number, PendingEntry>();

function getWorker(): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = new Promise<Worker>((resolve, reject) => {
      try {
        const worker = new Worker(new URL("../worker/refine.worker.ts", import.meta.url), {
          type: "module",
        });
        worker.onmessage = (event: MessageEvent<RefineResponse>) => {
          const { id, mask, error } = event.data;
          const entry = pending.get(id);
          if (!entry) return;
          pending.delete(id);
          if (error || !mask) {
            // The worker hit a runtime error (or returned nothing) — re-run
            // the same request inline. Same output, a few ms of blocking.
            resolveInline(entry);
          } else {
            entry.resolve(new Uint8ClampedArray(mask));
          }
        };
        worker.onerror = () => {
          // Unrecoverable script error: kill the worker, re-run every pending
          // request inline, and let the next call spin up a fresh worker.
          worker.terminate();
          const entries = Array.from(pending.values());
          pending.clear();
          workerPromise = null;
          for (const entry of entries) resolveInline(entry);
        };
        resolve(worker);
      } catch (err) {
        reject(err instanceof Error ? err : new Error("Web Worker unavailable"));
      }
    });
    // If the worker fails to construct, allow retrying next call.
    workerPromise.catch(() => {
      workerPromise = null;
    });
  }
  return workerPromise;
}

/**
 * Refine a mask via the worker, falling back to the synchronous pipeline on
 * ANY failure (worker unavailable, script error, or runtime error inside the
 * worker). `img` data is copied (never transferred) so callers keep their
 * pixels and the inline fallback can always re-run.
 */
export async function refineMaskInWorker(
  img: RefinedImageData,
  mask: Uint8ClampedArray,
  options: RefineOptions
): Promise<Uint8ClampedArray> {
  try {
    const worker = await getWorker();
    const id = ++requestId;
    const dataCopy = new Uint8ClampedArray(img.data);
    const maskCopy = new Uint8ClampedArray(mask);

    // Every failure path resolves with the inline fallback (or rejects only
    // if the fallback itself throws), so callers never hang waiting on the
    // worker. Callers all wrap the await in try/catch already.
    const result = new Promise<Uint8ClampedArray>((resolve, reject) => {
      pending.set(id, { img, mask, options, resolve, reject });
    });

    try {
      worker.postMessage(
        { id, data: dataCopy, width: img.width, height: img.height, mask: maskCopy, options },
        [dataCopy.buffer, maskCopy.buffer]
      );
    } catch (err) {
      // postMessage threw (unusual transferable) — drop the orphaned entry
      // before falling back inline so the pending map can't leak.
      pending.delete(id);
      throw err;
    }

    return await result;
  } catch {
    // Worker unavailable (or postMessage threw) — run the pipeline inline.
    // Same output, main thread.
    return refineMask(img, mask, options);
  }
}

/**
 * Re-run a failed worker request on the main thread. Never lets an exception
 * escape the worker event handler uncaught — if the fallback itself fails we
 * reject so the caller's try/catch can surface a clear error instead of the
 * promise hanging forever.
 */
function resolveInline(entry: PendingEntry): void {
  try {
    entry.resolve(refineMask(entry.img, entry.mask, entry.options));
  } catch (err) {
    entry.reject(err instanceof Error ? err : new Error("Refinement failed"));
  }
}
