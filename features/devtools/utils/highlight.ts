"use client";

/** Escape HTML so user input can never inject markup. */
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** JSON syntax highlighting → HTML string (safe: input is escaped first). */
export function highlightJson(input: string): string {
  const escaped = escapeHtml(input);
  // Keys, strings, numbers, booleans/null — order matters.
  return escaped.replace(
    /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (match, str: string, colon: string | undefined, kw: string | undefined, num: string | undefined) => {
      if (str !== undefined) {
        if (colon) return `<span class="text-sky-500 dark:text-sky-400">${str}</span>${colon}`;
        return `<span class="text-emerald-600 dark:text-emerald-400">${str}</span>`;
      }
      if (kw !== undefined) return `<span class="text-fuchsia-600 dark:text-fuchsia-400">${kw}</span>`;
      if (num !== undefined) return `<span class="text-amber-600 dark:text-amber-400">${num}</span>`;
      return match;
    }
  );
}

const SQL_KEYWORDS =
  "SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|ALTER|DROP|TABLE|INDEX|VIEW|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|ON|AS|AND|OR|NOT|NULL|IS|IN|BETWEEN|LIKE|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|PRIMARY|KEY|FOREIGN|REFERENCES|CONSTRAINT|DEFAULT|CASE|WHEN|THEN|ELSE|END|EXISTS|WITH|IF|ELSE|BEGIN|COMMIT|ROLLBACK|TRANSACTION|RETURN";

/** SQL syntax highlighting → HTML string (safe: input is escaped first). */
export function highlightSql(input: string): string {
  const escaped = escapeHtml(input);
  return escaped.replace(
    new RegExp(
      `(--[^\\n]*)|(\\/\\*[\\s\\S]*?\\*\\/)|('(?:[^'\\\\]|\\\\.)*'|"(?:[^"\\\\]|\\\\.)*")|(\\b(?:${SQL_KEYWORDS})\\b)|(\\b\\d+(?:\\.\\d+)?\\b)`,
      "gi"
    ),
    (match, lineComment: string, blockComment: string, str: string, kw: string, num: string) => {
      if (lineComment) return `<span class="text-text-muted italic">${lineComment}</span>`;
      if (blockComment) return `<span class="text-text-muted italic">${blockComment}</span>`;
      if (str) return `<span class="text-emerald-600 dark:text-emerald-400">${str}</span>`;
      if (kw) return `<span class="text-fuchsia-600 dark:text-fuchsia-400">${kw}</span>`;
      if (num) return `<span class="text-amber-600 dark:text-amber-400">${num}</span>`;
      return match;
    }
  );
}
