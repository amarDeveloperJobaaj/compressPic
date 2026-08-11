import "server-only";

import { groupTextItemsToLines } from "../../utils/text-lines";

/**
 * Server-side PDF → text extraction (master spec §18 step 3).
 *
 * Uses pdfjs-dist's legacy build, which runs on the Node main thread — no
 * worker config needed for text extraction (canvas rendering is not used
 * here). PDFs are the only supported resume format in the MVP.
 */

// pdfjs-dist is ESM-only; the legacy build is the Node-compatible entry.
// Dynamic import keeps the heavy module out of client bundles.
let pdfjsPromise: Promise<typeof import("pdfjs-dist/legacy/build/pdf.mjs")> | null = null;

function getPdfJs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist/legacy/build/pdf.mjs").catch((err) => {
      pdfjsPromise = null; // allow retry after a transient failure
      throw err;
    });
  }
  return pdfjsPromise;
}

/** Guard against pathological documents (page count / char bombs). */
const MAX_PAGES = 60;
const MAX_CHARS_PER_PAGE = 20_000;

/**
 * Extract plain text from a PDF buffer. Returns the concatenated page text.
 * Throws on invalid/encrypted PDFs so callers can offer a retry/fallback
 * (§75 "Resume parse failure").
 */
export async function extractPdfText(buffer: Buffer | ArrayBuffer | Uint8Array): Promise<string> {
  const pdfjs = await getPdfJs();
  const data = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer as ArrayBuffer);

  const loadingTask = pdfjs.getDocument({
    data,
    useSystemFonts: true,
  });

  let pdf: Awaited<typeof loadingTask.promise> | null = null;
  try {
    pdf = await loadingTask.promise;

    const pages: string[] = [];
    const pageCount = Math.min(pdf.numPages, MAX_PAGES);
    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      // Group text items by their y position so lines stay readable.
      const items = content.items.filter(
        (it): it is Extract<(typeof content.items)[number], { str: string }> => "str" in it
      );
      const lines = groupTextItemsToLines(items);

      const pageText = lines.join("\n").slice(0, MAX_CHARS_PER_PAGE);
      pages.push(pageText);
      page.cleanup();
    }

    return pages.join("\n\n");
  } catch (err) {
    throw new Error(
      `Could not read the PDF: ${err instanceof Error ? err.message : "unknown error"}`
    );
  } finally {
    // destroy() lives on the loading task in pdf.js v6+.
    await loadingTask.destroy().catch(() => undefined);
  }
}
