"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Copy, Download, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { stringifyCsv } from "./csv";
import { downloadText, copyToClipboard } from "@/features/devtools/utils/download";
import { Button } from "@/components/ui/button";
import { useToast } from "@/features/playground/components/Toast";

export interface GridData {
  columns: string[];
  values: (string | number | null | Uint8Array)[][];
}

const PAGE_SIZES = [25, 50, 100];

/** Format a cell value for display. */
function formatCell(value: string | number | null | Uint8Array): string {
  if (value === null || value === undefined) return "NULL";
  if (value instanceof Uint8Array) {
    return `blob(${value.length} bytes)`;
  }
  return String(value);
}

/**
 * Interactive SQL results grid: pagination, per-column sorting, text
 * filtering, resizable columns, copy cell/row, and CSV export.
 */
export function DataGrid({ data }: { data: GridData }) {
  const { toast } = useToast();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Record<number, string>>({});
  const [showFilter, setShowFilter] = useState(false);
  const [widths, setWidths] = useState<number[]>(() => data.columns.map(() => 160));

  const { columns, values } = data;

  const filtered = useMemo(() => {
    const active = Object.entries(filters).filter(([, v]) => v.trim() !== "");
    if (active.length === 0) return values;
    return values.filter((row) =>
      active.every(([idx, query]) => {
        const q = query.toLowerCase();
        return formatCell(row[Number(idx)]).toLowerCase().includes(q);
      })
    );
  }, [values, filters]);

  const sorted = useMemo(() => {
    if (sortCol === null) return filtered;
    const col = sortCol;
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a[col];
      const bv = b[col];
      if (av === bv) return 0;
      if (av === null || av === undefined) return 1 * dir;
      if (bv === null || bv === undefined) return -1 * dir;
      const an = typeof av === "number" ? av : Number(av);
      const bn = typeof bv === "number" ? bv : Number(bv);
      if (!Number.isNaN(an) && !Number.isNaN(bn)) return (an - bn) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [filtered, sortCol, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const rows = sorted.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const handleSort = (index: number) => {
    if (sortCol === index) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(index);
      setSortDir("asc");
    }
  };

  const resizeColumn = (index: number, clientX: number, startX: number, startWidth: number) => {
    const delta = clientX - startX;
    const next = Math.max(80, startWidth + delta);
    setWidths((prev) => prev.map((w, i) => (i === index ? next : w)));
  };

  const exportCsv = () => {
    const rowsOut = sorted.map((row) => row.map((cell) => (cell instanceof Uint8Array ? `blob(${cell.length})` : cell)));
    const csv = stringifyCsv(rowsOut);
    downloadText("query-results.csv", csv, "text/csv;charset=utf-8");
    toast("Results exported to CSV");
  };

  const copyRow = async (row: (string | number | null | Uint8Array)[]) => {
    const ok = await copyToClipboard(row.map((cell) => formatCell(cell)).join("\t"));
    if (ok) toast("Row copied");
  };

  const copyCell = async (value: string | number | null | Uint8Array) => {
    const ok = await copyToClipboard(formatCell(value));
    if (ok) toast("Cell copied");
  };

  if (columns.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-text-muted">
        Query returned no columns.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      {/* Grid header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2">
        <p className="text-xs font-medium text-text-secondary">
          {sorted.length.toLocaleString()} row{sorted.length === 1 ? "" : "s"}
          {sorted.length !== values.length && (
            <span className="text-text-muted"> (filtered from {values.length.toLocaleString()})</span>
          )}
        </p>
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="ghost" onClick={() => setShowFilter((v) => !v)}>
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>
          <Button size="sm" variant="ghost" onClick={exportCsv}>
            <Download className="h-3.5 w-3.5" />
            CSV
          </Button>
        </div>
      </div>

      {/* Per-column filter row — fixed-width inputs scroll horizontally on
          narrow screens instead of blowing out the page width. */}
      {showFilter && (
        <div className="flex items-center gap-1 overflow-x-auto border-b border-border bg-surface/60 px-2 py-1.5">
          {columns.map((col, i) => (
            <div key={col} className="relative" style={{ width: Math.min(widths[i] ?? 160, 200) }}>
              <input
                value={filters[i] ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, [i]: e.target.value }))}
                placeholder={`Filter ${col}`}
                aria-label={`Filter ${col}`}
                className="h-7 w-full rounded-md border border-border bg-background px-2 pr-6 text-[11px] text-text-primary outline-none transition-colors focus-visible:border-primary"
              />
              {filters[i] && (
                <button
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, [i]: "" }))}
                  aria-label={`Clear filter for ${col}`}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="overflow-auto" style={{ maxHeight: 420 }}>
        <table className="w-full border-collapse text-left text-[13px]">
          <thead className="sticky top-0 z-10 bg-surface">
            <tr>
              <th className="w-10 border-b border-r border-border px-2 py-2 text-center text-xs text-text-muted">
                #
              </th>
              {columns.map((col, i) => (
                <th
                  key={col}
                  className="group relative border-b border-r border-border px-2 py-2 last:border-r-0"
                  style={{ minWidth: widths[i] ?? 160, maxWidth: 420 }}
                >
                  <button
                    type="button"
                    onClick={() => handleSort(i)}
                    className="flex w-full items-center gap-1 text-xs font-semibold text-text-primary transition-colors hover:text-primary"
                  >
                    <span className="truncate">{col}</span>
                    {sortCol === i &&
                      (sortDir === "asc" ? (
                        <ArrowUp className="h-3 w-3 shrink-0 text-primary" />
                      ) : (
                        <ArrowDown className="h-3 w-3 shrink-0 text-primary" />
                      ))}
                  </button>
                  {/* Resize handle */}
                  <span
                    role="separator"
                    aria-orientation="vertical"
                    aria-label={`Resize column ${col}`}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      const startX = e.clientX;
                      const startWidth = widths[i] ?? 160;
                      const onMove = (ev: PointerEvent) => resizeColumn(i, ev.clientX, startX, startWidth);
                      const onUp = () => {
                        window.removeEventListener("pointermove", onMove);
                        window.removeEventListener("pointerup", onUp);
                      };
                      window.addEventListener("pointermove", onMove);
                      window.addEventListener("pointerup", onUp);
                    }}
                    className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize bg-transparent transition-colors hover:bg-primary"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-sm text-text-muted">
                  No rows match your filters.
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={safePage * pageSize + rowIndex}
                  className="group/row border-b border-border/60 transition-colors last:border-0 hover:bg-primary-light/40"
                >
                  <td className="border-r border-border/60 px-2 py-1.5 text-center text-xs text-text-muted">
                    <span className="flex items-center justify-center gap-1">
                      {safePage * pageSize + rowIndex + 1}
                      <button
                        type="button"
                        onClick={() => copyRow(row)}
                        title="Copy row"
                        aria-label={`Copy row ${safePage * pageSize + rowIndex + 1}`}
                        className="text-text-muted opacity-0 transition-opacity hover:text-primary focus-visible:opacity-100 group-hover/row:opacity-100"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </span>
                  </td>
                  {row.map((cell, i) => (
                    <td
                      key={`${rowIndex}-${i}`}
                      className="group/cell border-r border-border/60 px-2 py-1.5 last:border-r-0"
                    >
                      <button
                        type="button"
                        onClick={() => copyCell(cell)}
                        title="Click to copy cell"
                        className={cn(
                          "flex w-full items-center gap-1 rounded px-0.5 text-left font-mono text-[12px] transition-colors",
                          cell === null || cell === undefined
                            ? "italic text-text-muted"
                            : "text-text-primary hover:text-primary"
                        )}
                      >
                        <span className="truncate">{formatCell(cell)}</span>
                        <Copy className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover/cell:opacity-40" />
                      </button>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface px-3 py-2">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
            aria-label="Rows per page"
            className="h-7 rounded-md border border-border bg-background px-2 text-xs text-text-secondary outline-none focus-visible:border-primary"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
          <span>
            {sorted.length === 0
              ? "0 rows"
              : `${safePage * pageSize + 1}–${Math.min((safePage + 1) * pageSize, sorted.length)} of ${sorted.length}`}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="px-2 text-xs text-text-muted">
            {safePage + 1} / {pageCount}
          </span>
          <Button
            size="sm"
            variant="ghost"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            aria-label="Next page"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
