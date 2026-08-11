/**
 * Resume text normalization (master spec §18 step 4).
 *
 * Raw PDF extraction is noisy: weird spacing, broken words, stray bullets.
 * Normalize before handing text to the AI so prompts get clean input and
 * token usage stays predictable.
 */

/** Cap on normalized resume text sent to the AI (chars). */
export const MAX_RESUME_TEXT_LENGTH = 24_000;

/**
 * Normalize extracted resume text:
 * - collapse runs of blank lines
 * - trim trailing whitespace per line
 * - strip control characters (keep tabs/newlines)
 * - cap total length
 */
export function normalizeResumeText(raw: string): string {
  const cleaned = raw
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (cleaned.length <= MAX_RESUME_TEXT_LENGTH) return cleaned;

  // Keep the head of the resume (name, summary, skills usually live there)
  // and a tail slice so the trailing sections aren't fully lost.
  const head = cleaned.slice(0, Math.floor(MAX_RESUME_TEXT_LENGTH * 0.8));
  const tail = cleaned.slice(-Math.floor(MAX_RESUME_TEXT_LENGTH * 0.2));
  return `${head}\n\n…[truncated]…\n\n${tail}`;
}

/** True when the text looks like an actual resume (has some content). */
export function looksLikeResume(text: string): boolean {
  const t = text.trim();
  if (t.length < 80) return false;
  // A resume usually contains a name-ish first line + section keywords.
  const sectionHits = ["experience", "skills", "education", "project", "work", "summary"].filter(
    (k) => new RegExp(`\\b${k}`, "i").test(t)
  );
  return sectionHits.length >= 1;
}
