/**
 * Shared text-item → line grouping for pdf.js extraction.
 *
 * Both the server extractor (services/resume/extract-text.ts) and the
 * client-side fallback (utils/pdf-client.ts) convert pdf.js text items into
 * readable lines by grouping items whose y-position is close together.
 * This pure helper has no environment dependencies, so it's importable from
 * both the "server-only" and "use client" modules.
 */

export interface TextItemLike {
  str: string;
  transform?: number[] | null;
}

/** Group pdf.js text items into lines based on their baseline y-position. */
export function groupTextItemsToLines(items: TextItemLike[]): string[] {
  const lines: string[] = [];
  let lastY: number | null = null;
  let line = "";

  for (const item of items) {
    const y = item.transform?.[5] ?? 0;
    if (lastY !== null && Math.abs(y - lastY) > 2) {
      lines.push(line);
      line = "";
    }
    // Most pdf.js items carry trailing spaces; when they don't, join with a
    // space so words don't jam together ("HelloWorld").
    if (line && !/\s$/.test(line) && !/^\s/.test(item.str)) line += " ";
    line += item.str;
    lastY = y;
  }
  if (line.trim()) lines.push(line);

  return lines;
}
