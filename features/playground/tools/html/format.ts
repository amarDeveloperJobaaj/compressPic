"use client";

import { html as htmlBeautify, css as cssBeautify, js as jsBeautify } from "js-beautify";

/** Beautify the active panel's code with js-beautify. */
export function beautifyCode(language: "html" | "css" | "javascript", code: string): string {
  if (!code.trim()) return code;
  try {
    if (language === "html") return htmlBeautify(code, { indent_size: 2, wrap_line_length: 120 });
    if (language === "css") return cssBeautify(code, { indent_size: 2 });
    return jsBeautify(code, { indent_size: 2, wrap_line_length: 120 });
  } catch {
    return code;
  }
}

/**
 * Conservative minifiers. These strip comments and collapse whitespace only —
 * they never rename identifiers, so output always stays valid.
 */

export function minifyHtml(code: string): string {
  return code
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function minifyCss(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

/** Minify JS by removing comments (string-aware) and collapsing whitespace. */
export function minifyJs(code: string): string {
  let out = "";
  let i = 0;
  let inString: string | null = null;
  while (i < code.length) {
    const ch = code[i];
    const next = code[i + 1];
    if (inString) {
      out += ch;
      if (ch === "\\") {
        out += next ?? "";
        i += 2;
        continue;
      }
      if (ch === inString) inString = null;
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      out += ch;
      i += 1;
      continue;
    }
    if (ch === "/" && next === "/") {
      while (i < code.length && code[i] !== "\n") i += 1;
      continue;
    }
    if (ch === "/" && next === "*") {
      i += 2;
      while (i < code.length && !(code[i] === "*" && code[i + 1] === "/")) i += 1;
      i += 2;
      continue;
    }
    if (/\s/.test(ch)) {
      // Collapse runs of whitespace to a single space.
      out += " ";
      while (i < code.length && /\s/.test(code[i])) i += 1;
      continue;
    }
    out += ch;
    i += 1;
  }
  return out.trim();
}

/** Minify depending on the panel language. */
export function minifyCode(language: "html" | "css" | "javascript", code: string): string {
  if (!code.trim()) return code;
  try {
    if (language === "html") return minifyHtml(code);
    if (language === "css") return minifyCss(code);
    return minifyJs(code);
  } catch {
    return code;
  }
}
