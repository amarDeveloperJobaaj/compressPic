"use client";

import { useCallback, useState } from "react";
import {
  Bookmark,
  Check,
  Clock3,
  Copy,
  Eraser,
  History,
  Printer,
  Save,
  Share2,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { DEFAULT_DISCLAIMER, type CalculatorConfig, type FieldDef, type RowSetDef } from "../types";
import { clamp, formatByKind } from "../utils/format";
import { copyResult, printResult, shareResult } from "../utils/export";
import { addRecent, getFavorites, getRecent, toggleFavorite } from "../utils/history";
import type { RecentEntry } from "../utils/history";
import { FinanceChart } from "./charts";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Small inputs                                                        */
/* ------------------------------------------------------------------ */

function NumberField({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: number;
  onChange: (v: number) => void;
}) {
  // While focused, let the user type freely; on blur / when unfocused we show
  // the clamped value from the parent. This avoids the value fighting the input.
  const [raw, setRaw] = useState(String(value));
  const [focused, setFocused] = useState(false);

  const commit = (next: number) => onChange(clamp(Number.isFinite(next) ? next : field.min, field.min, field.max));

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={`f-${field.key}`} className="text-sm font-medium text-text-secondary">
          {field.label}
        </label>
        {field.hint && (
          <span className="hidden text-[11px] text-text-muted sm:inline" title={field.hint}>
            {field.hint}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {field.prefix && <span className="shrink-0 text-sm text-text-muted">{field.prefix}</span>}
        <input
          id={`f-${field.key}`}
          type="number"
          inputMode="decimal"
          min={field.min}
          max={field.max}
          step={field.step}
          value={focused ? raw : String(value)}
          onFocus={() => {
            setRaw(String(value));
            setFocused(true);
          }}
          onBlur={() => {
            setRaw(String(value));
            setFocused(false);
          }}
          onChange={(e) => {
            setRaw(e.target.value);
            commit(Number(e.target.value));
          }}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-text-primary outline-none transition-colors focus:border-primary"
          aria-label={field.label}
        />
        {field.suffix && <span className="shrink-0 text-sm text-text-muted">{field.suffix}</span>}
      </div>
      <input
        type="range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        onChange={(e) => commit(Number(e.target.value))}
        className="mt-2 w-full accent-primary"
        aria-label={`${field.label} slider`}
      />
    </div>
  );
}

/** Highest row index present in a flat value snapshot (qty0, price1, ...). */
function maxRowIndex(values: Record<string, number>, fields: RowSetDef["fields"]): number {
  let max = 0;
  for (const f of fields) {
    for (const key of Object.keys(values)) {
      if (!key.startsWith(f.key)) continue;
      const idx = Number(key.slice(f.key.length));
      if (Number.isFinite(idx) && idx > max) max = idx;
    }
  }
  return max;
}

function RowSetInput({
  def,
  values,
  onChange,
}: {
  def: RowSetDef;
  values: Record<string, number>;
  onChange: (key: string, value: number) => void;
}) {
  // Seed rows from any saved values (e.g. after loading a recent calculation),
  // otherwise start with one empty row. The keyed remount on reset/load ensures
  // this runs with the latest snapshot.
  const [rows, setRows] = useState(() =>
    Array.from({ length: maxRowIndex(values, def.fields) + 1 }, (_, i) => ({ id: i }))
  );
  const [idRef, setIdRef] = useState(() => maxRowIndex(values, def.fields) + 1);

  const addRow = () => {
    setRows((r) => [...r, { id: idRef }]);
    setIdRef((i) => i + 1);
  };

  const removeRow = (id: number) => {
    const next = rows.filter((x) => x.id !== id);
    if (next.length === 0) {
      // Keep at least one row — with a fresh id so future adds never collide.
      setIdRef((i) => i + 1);
      setRows([{ id: idRef }]);
    } else {
      setRows(next);
    }
    // Clear values belonging to this row
    def.fields.forEach((f) => onChange(`${f.key}${id}`, 0));
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-text-secondary">{def.label}</label>
        <button
          type="button"
          onClick={addRow}
          disabled={rows.length >= def.maxRows}
          className="flex items-center gap-1 rounded-lg bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-50"
        >
          + {def.addLabel}
        </button>
      </div>
      <div className="space-y-2">
        {rows.map((row, ri) => (
          <div key={row.id} className="flex items-center gap-2">
            <span className="w-6 shrink-0 text-center text-xs text-text-muted">{ri + 1}</span>
            {def.fields.map((f) => (
              <div key={f.key} className="flex flex-1 items-center gap-1.5">
                {f.prefix && <span className="text-xs text-text-muted">{f.prefix}</span>}
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  placeholder={f.label}
                  value={values[`${f.key}${row.id}`] || ""}
                  onChange={(e) => onChange(`${f.key}${row.id}`, Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm outline-none transition-colors focus:border-primary"
                  aria-label={`${f.label} row ${ri + 1}`}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              className="shrink-0 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-error-light hover:text-error"
              aria-label={`Remove row ${ri + 1}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <p className="mt-1.5 text-[11px] text-text-muted">
        Leave unused rows empty. Max {def.maxRows} entries.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Result cards                                                        */
/* ------------------------------------------------------------------ */

function AnimatedResult({
  label,
  formatted,
  primary,
}: {
  label: string;
  formatted: string;
  primary?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5",
        primary
          ? "border-transparent bg-gradient-to-br from-primary via-primary to-sky-600 text-white shadow-lg shadow-primary/30"
          : "border-border bg-surface shadow-sm hover:border-primary/40 hover:shadow-md"
      )}
    >
      {primary && <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-xl" />}
      <p className={cn("text-xs font-medium", primary ? "text-white/80" : "text-text-muted")}>{label}</p>
      <p className={cn("mt-1 text-2xl font-bold tracking-tight", primary ? "text-white" : "text-text-primary")}>
        {formatted}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

interface FinanceCalculatorProps {
  config: CalculatorConfig;
}

export function FinanceCalculator({ config }: FinanceCalculatorProps) {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const field of config.fields) {
      if (field.type === "rows") continue;
      init[field.key] = field.defaultValue;
    }
    return init;
  });

  // Stock-average rows are stored flat: qty0, price0, qty1, price1...
  const [rowValues, setRowValues] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);
  const [favorite, setFavorite] = useState(() => getFavorites().includes(config.slug));
  const [recent, setRecent] = useState<RecentEntry[]>(() =>
    getRecent()
      .filter((e) => e.slug === config.slug)
      .slice(0, 5)
  );
  const [resetCounter, setResetCounter] = useState(0);

  const allValues = { ...values, ...rowValues };

  const result = config.compute(allValues);

  const setField = useCallback((key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setRowField = useCallback((key: string, value: number) => {
    setRowValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = () => {
    const init: Record<string, number> = {};
    for (const field of config.fields) {
      if (field.type === "rows") continue;
      init[field.key] = field.defaultValue;
    }
    setValues(init);
    setRowValues({});
    setResetCounter((c) => c + 1);
  };

  const loadExample = () => {
    if (!config.example) return;
    setValues({ ...config.example });
    setRowValues({});
  };

  const saveToHistory = () => {
    addRecent({
      slug: config.slug,
      summary: config.summarize(allValues, result),
      timestamp: Date.now(),
      values: allValues,
    });
    setRecent(
      getRecent()
        .filter((e) => e.slug === config.slug)
        .slice(0, 5)
    );
  };

  const loadRecent = (entry: RecentEntry) => {
    if (!entry.values) return;
    const nextValues: Record<string, number> = {};
    const nextRows: Record<string, number> = {};
    for (const [k, v] of Object.entries(entry.values)) {
      if (config.fields.some((f) => f.type !== "rows" && f.key === k)) nextValues[k] = v;
      else nextRows[k] = v;
    }
    setValues(nextValues);
    setRowValues(nextRows);
    // Remount RowSetInput so it renders the restored rows (derived from nextRows).
    setResetCounter((c) => c + 1);
  };

  const handleCopy = async () => {
    await copyResult(config, allValues, result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handleShare = async () => {
    await shareResult(config, allValues, result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Inputs */}
      <div className="lg:col-span-2">
        <div className="sticky top-24 rounded-3xl border border-border bg-surface/90 p-6 shadow-xl shadow-black/5 backdrop-blur">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
              <Sparkles className="h-4 w-4 text-primary" />
              Inputs
            </h2>
            <div className="flex items-center gap-1.5">
              {config.example && (
                <button
                  type="button"
                  onClick={loadExample}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary-light"
                  title="Load an example"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  Example
                </button>
              )}
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
                title="Reset all inputs"
              >
                <Eraser className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {config.fields.map((field) =>
              field.type === "rows" ? (
                <RowSetInput
                  key={`${field.key}-${resetCounter}`}
                  def={field}
                  values={rowValues}
                  onChange={setRowField}
                />
              ) : (
                <NumberField
                  key={field.key}
                  field={field}
                  value={values[field.key] ?? field.defaultValue}
                  onChange={(v) => setField(field.key, v)}
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6 lg:col-span-3">
        {/* Action bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl bg-primary-light px-3.5 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-white"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy Result"}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-text-secondary transition-all hover:border-primary/40 hover:text-primary"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
          <button
            type="button"
            onClick={() => printResult(config, allValues, result)}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-text-secondary transition-all hover:border-primary/40 hover:text-primary"
          >
            <Printer className="h-3.5 w-3.5" />
            PDF / Print
          </button>
          <button
            type="button"
            onClick={saveToHistory}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-text-secondary transition-all hover:border-primary/40 hover:text-primary"
            title="Save this calculation"
          >
            <Save className="h-3.5 w-3.5" />
            Save
          </button>
          <button
            type="button"
            onClick={() => setFavorite(toggleFavorite(config.slug).includes(config.slug))}
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all",
              favorite
                ? "border-amber-400/50 bg-amber-400/10 text-amber-600 dark:text-amber-300"
                : "border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-primary"
            )}
          >
            <Bookmark className={cn("h-3.5 w-3.5", favorite && "fill-current")} />
            {favorite ? "Favorited" : "Favorite"}
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {config.results.map((card) => (
            <AnimatedResult
              key={card.key}
              label={card.label}
              formatted={formatByKind(result.values[card.key] ?? 0, card.format)}
              primary={card.primary}
            />
          ))}
        </div>

        {/* Charts */}
        {result.charts.map((chart) => (
          <FinanceChart key={chart.title} chart={chart} />
        ))}

        {/* Tables */}
        {result.tables.map((table) => (
          <div key={table.title} className="overflow-hidden rounded-2xl border border-border bg-surface">
            <h3 className="border-b border-border px-5 py-3 text-sm font-semibold text-text-primary">
              {table.title}
            </h3>
            {/* min-w makes wide tables (amortization, year-wise) scroll
                horizontally inside this wrapper on mobile instead of
                squeezing every column into a phone-width strip. */}
            <div className="max-h-80 overflow-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="sticky top-0 bg-background/95 backdrop-blur">
                  <tr>
                    {table.columns.map((col) => (
                      <th key={col.key} className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, ri) => (
                    <tr key={ri} className="border-t border-border/60 transition-colors hover:bg-primary-light/30">
                      {row.values.map((v, ci) => (
                        <td key={ci} className="px-4 py-2 text-text-secondary">
                          {typeof v === "number" ? formatByKind(v, table.columns[ci].format) : v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Explanation */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="text-sm font-semibold text-text-primary">How this is calculated</h3>
          <code className="mt-2 block rounded-lg bg-background px-3 py-2 text-xs text-primary">
            {result.explanation.formula}
          </code>
          <ul className="mt-3 space-y-1.5">
            {result.explanation.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-light text-[10px] font-bold text-primary">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer */}
        <p className="rounded-xl border border-border/60 bg-background/50 px-4 py-3 text-xs leading-relaxed text-text-muted">
          {DEFAULT_DISCLAIMER}
        </p>

        {/* Recent calculations */}
        {recent.length > 0 && (
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
              <History className="h-4 w-4 text-primary" />
              Recent Calculations
            </h3>
            <ul className="space-y-2">
              {recent.map((entry, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs text-text-secondary" title={entry.summary}>
                      {entry.summary}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-text-muted">
                      <Clock3 className="h-3 w-3" />
                      {new Date(entry.timestamp).toLocaleString(undefined, {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => loadRecent(entry)}
                    className="shrink-0 rounded-lg bg-primary-light px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    Load
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
