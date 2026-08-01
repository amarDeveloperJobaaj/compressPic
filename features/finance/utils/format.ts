/** Formatting helpers for the finance calculators (INR-default). */

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrFormatterPrecise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export function formatINR(value: number, precise = false): string {
  if (!Number.isFinite(value)) return "—";
  return (precise ? inrFormatterPrecise : inrFormatter).format(value);
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return numberFormatter.format(Math.round(value));
}

export function formatPercent(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "—";
  return `${value.toFixed(digits)}%`;
}

export function formatByKind(value: number, kind: "inr" | "number" | "percent"): string {
  if (kind === "inr") return formatINR(value);
  if (kind === "percent") return formatPercent(value);
  return formatNumber(value);
}

/** Parse a user-typed numeric string to a number (accepts commas). */
export function parseNumber(raw: string): number {
  const cleaned = raw.replace(/,/g, "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
