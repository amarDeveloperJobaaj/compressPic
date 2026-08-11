"use client";

/**
 * Client-side PDF → text extraction.
 *
 * Used by the ResumeUploader fallback path: when resume storage is not
 * configured, the PDF text is extracted in the browser (same pdf.js pattern
 * as features/pdf-to-image) and sent straight to /resume/analyze. No new
 * dependency — reuses pdfjs-dist.
 */

import { groupTextItemsToLines } from "./text-lines";

const MAX_PAGES = 60;

let pdfjsPromise: Promise<typeof import("pdfjs-dist")> | null = null;

function getPdfJs(): Promise<typeof import("pdfjs-dist")> {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist")
      .then((mod) => {
        mod.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();
        return mod;
      })
      .catch((err) => {
        pdfjsPromise = null;
        throw err;
      });
  }
  return pdfjsPromise;
}

/** Extract plain text from a PDF File, grouping items into readable lines. */
export async function extractPdfTextClient(file: File): Promise<string> {
  const pdfjs = await getPdfJs();
  const data = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data });
  const pdf = await loadingTask.promise;

  const pages: string[] = [];
  const pageCount = Math.min(pdf.numPages, MAX_PAGES);
  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const items = content.items.filter(
      (it): it is Extract<(typeof content.items)[number], { str: string }> => "str" in it
    );
    pages.push(groupTextItemsToLines(items).join("\n"));
    page.cleanup();
  }

  await loadingTask.destroy().catch(() => undefined);
  return pages.join("\n\n");
}
