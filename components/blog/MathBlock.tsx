import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * Math block — renders a LaTeX formula with KaTeX on the server.
 * SSR-safe (katex.renderToString), so no client JavaScript or layout shift.
 */
export function MathBlock({
  formula,
  display = true,
}: {
  formula: string;
  display?: boolean;
}) {
  let html = "";
  try {
    html = katex.renderToString(formula, {
      displayMode: display,
      throwOnError: false,
      strict: false,
    });
  } catch {
    html = `<code>${formula.replace(/</g, "&lt;")}</code>`;
  }

  return (
    <div
      className="my-6 overflow-x-auto rounded-xl border border-border/70 bg-background/50 px-4 py-5 text-center"
      aria-label="Math formula"
      // Rendered by KaTeX from admin-authored formula text — trusted input.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
