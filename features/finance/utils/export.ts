"use client";

import { formatByKind } from "./format";
import type { CalculatorConfig, CalculatorResult, ResultCardDef } from "../types";

function buildSummary(
  config: CalculatorConfig,
  values: Record<string, number>,
  result: CalculatorResult
): string {
  const cards: ResultCardDef[] = config.results;
  const lines = cards.map((c) => `${c.label}: ${formatByKind(result.values[c.key] ?? 0, c.format)}`);
  return `${config.name}\n${config.summarize(values, result)}\n${lines.join("\n")}`;
}

export async function copyResult(
  config: CalculatorConfig,
  values: Record<string, number>,
  result: CalculatorResult
): Promise<void> {
  const text = buildSummary(config, values, result);
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for older browsers
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

export async function shareResult(
  config: CalculatorConfig,
  values: Record<string, number>,
  result: CalculatorResult
): Promise<"shared" | "copied"> {
  const text = buildSummary(config, values, result);
  const url = typeof window !== "undefined" ? window.location.href : "";
  if (navigator.share) {
    try {
      await navigator.share({ title: config.name, text, url });
      return "shared";
    } catch {
      /* user cancelled — fall through to copy */
    }
  }
  await copyResult(config, values, result);
  return "copied";
}

/** Generate a printable PDF via the browser print dialog (CLS-free, no extra deps). */
export function printResult(
  config: CalculatorConfig,
  values: Record<string, number>,
  result: CalculatorResult
) {
  const win = window.open("", "_blank", "width=820,height=900");
  if (!win) return;
  const body = `
    <h1 style="font: 700 20px system-ui, sans-serif; margin: 0 0 4px;">${config.name}</h1>
    <p style="font: 12px system-ui, sans-serif; color: #6b7280; margin: 0 0 16px;">CompressPix Finance · generated ${new Date().toLocaleString()}</p>
    <table style="width:100%; border-collapse: collapse; font: 13px system-ui, sans-serif;">
      ${config.results
        .map(
          (c) => `<tr>
            <td style="padding:6px 8px; border:1px solid #e5e7eb; color:#374151;">${c.label}</td>
            <td style="padding:6px 8px; border:1px solid #e5e7eb; font-weight:600;">${formatByKind(result.values[c.key] ?? 0, c.format)}</td>
          </tr>`
        )
        .join("")}
    </table>
    <p style="font: 11px system-ui, sans-serif; color: #9ca3af; margin-top: 16px;">${config.summarize(values, result)}</p>
    <p style="font: 11px system-ui, sans-serif; color: #9ca3af;">Estimates only — not financial advice.</p>
  `;
  win.document.write(`<html><head><title>${config.name}</title></head><body>${body}</body></html>`);
  win.document.close();
  win.focus();
  win.print();
}
