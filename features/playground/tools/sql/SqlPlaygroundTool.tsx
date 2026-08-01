"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Braces,
  Database,
  Download,
  FileUp,
  History,
  KeyRound,
  Loader2,
  Play,
  RotateCcw,
  Save,
  Sparkles,
  Table2,
  Upload,
  Zap,
} from "lucide-react";
import { PlaygroundEditor } from "@/features/playground/components/PlaygroundEditor";
import { ToastProvider, useToast } from "@/features/playground/components/Toast";
import { DataGrid, type GridData } from "./DataGrid";
import { SAMPLE_DATABASES, DEFAULT_SQL } from "./samples";
import { parseCsv, csvToSql } from "./csv";
import {
  executeSql,
  listTables,
  exportDatabase,
  importDatabase,
  resetDatabase,
  dumpDatabase,
  getTableSchema,
  type QueryResult,
  type TableSchema,
} from "./sqlite";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { downloadText, readFileAsText } from "@/features/devtools/utils/download";

const HISTORY_KEY = "compresspix:sql-playground:history";
const SAVED_KEY = "compresspix:sql-playground:saved";
const QUERY_KEY = "compresspix:sql-playground:query";

interface HistoryEntry {
  sql: string;
  time: number;
}

interface TabEntry {
  id: number;
  title: string;
  sql: string;
  results?: QueryResult[];
  error?: string;
  durationMs?: number;
  schema?: TableSchema;
}

/** Module-level timestamp helper (keeps Date.now() out of render scope). */
function nowMs(): number {
  return Date.now();
}

/** Inner component — needs Toast context. */
function SqlPlaygroundInner() {
  const { toast } = useToast();

  const [sql, setSql] = useState(DEFAULT_SQL);
  const [running, setRunning] = useState(false);
  const [tabs, setTabs] = useState<TabEntry[]>([]);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [tables, setTables] = useState<{ name: string; type: string }[]>([]);
  const [recent, setRecent] = useState<HistoryEntry[]>([]);
  const [saved, setSaved] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingDb, setLoadingDb] = useState(false);
  const [dbSize, setDbSize] = useState<number | null>(null);

  const runIdRef = useRef(0);
  const dbFileRef = useRef<HTMLInputElement>(null);
  const csvFileRef = useRef<HTMLInputElement>(null);
  const sqlFileRef = useRef<HTMLInputElement>(null);

  /* ------------------------------ persistence ---------------------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const q = localStorage.getItem(QUERY_KEY);
        if (q) setSql(q);
        const h = localStorage.getItem(HISTORY_KEY);
        if (h) setRecent(JSON.parse(h));
        const s = localStorage.getItem(SAVED_KEY);
        if (s) setSaved(JSON.parse(s));
      } catch {
        // ignore corrupt storage
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(QUERY_KEY, sql);
      } catch {
        // ignore
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [sql]);

  /* ------------------------------ tables --------------------------------- */
  const refreshTables = useCallback(async () => {
    try {
      const t = await listTables();
      setTables(t);
      const bytes = await exportDatabase();
      setDbSize(bytes.byteLength);
    } catch {
      // engine not ready yet
    }
  }, []);

  /* ------------------------------- run ----------------------------------- */  const runSql = useCallback(
    async (statement: string, openInTab = true, activate = true) => {
      if (!statement.trim() || running) return;
      const id = ++runIdRef.current;
      setRunning(true);
      const started = performance.now();
      try {
        const results = await executeSql(statement);
        const durationMs = performance.now() - started;
        // Compute next history outside the state updater (no impure side
        // effects inside updaters); `recent` is a dependency so it's fresh.
        const nextHistory = [
          { sql: statement, time: nowMs() },
          ...recent.filter((h) => h.sql !== statement),
        ].slice(0, 20);
        setRecent(nextHistory);
        try {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
        } catch {
          // ignore
        }
        if (openInTab) {
          const entry: TabEntry = {
            id,
            title: statement.split(/\s+/).slice(0, 5).join(" ") || "Query",
            sql: statement,
            results,
            durationMs,
          };
          setTabs((prev) => [...prev, entry]);
          if (activate) setActiveTab(id);
        }
        await refreshTables();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (openInTab) {
          const entry: TabEntry = { id, title: "Error", sql: statement, error: message };
          setTabs((prev) => [...prev, entry]);
          setActiveTab(id);
        }
        toast(message, "error");
      } finally {
        setRunning(false);
      }
    },
    [running, refreshTables, toast, recent]
  );

  const handleRun = () => void runSql(sql);

  /* ----------------------------- explain --------------------------------- */
  const handleExplain = () => {
    const statement = sql.trim();
    if (!statement) return;
    void runSql(`EXPLAIN QUERY PLAN ${statement}`, true);
  };

  /* --------------------------- sample / csv ------------------------------ */
  const loadSample = async (sampleId: string) => {
    const sample = SAMPLE_DATABASES.find((s) => s.id === sampleId);
    if (!sample) return;
    setLoadingDb(true);
    try {
      await resetDatabase();
      await executeSql(sample.sql);
      setSql(DEFAULT_SQL);
      setTabs([]);
      setActiveTab(null);
      await refreshTables();
      toast(`Loaded sample database: ${sample.name}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to load sample", "error");
    } finally {
      setLoadingDb(false);
    }
  };

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      const rows = parseCsv(text);
      if (rows.length === 0) {
        toast("CSV file is empty", "error");
        return;
      }
      const baseName = file.name.replace(/\.csv$/i, "") || "imported";
      const tableName = baseName.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 40);
      const statement = csvToSql(tableName, rows);
      await executeSql(statement);
      setSql(
        `-- Imported ${rows.length - 1} rows from ${file.name} into "${tableName}"\nSELECT * FROM "${tableName}" LIMIT 50;`
      );
      await refreshTables();
      toast(`Imported CSV → table "${tableName}"`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "CSV import failed", "error");
    }
  };

  const handleSqlImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      setSql(text);
      toast("SQL file loaded into editor");
    } catch {
      toast("Could not read SQL file", "error");
    }
  };

  const handleDbImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      await importDatabase(bytes);
      setTabs([]);
      setActiveTab(null);
      await refreshTables();
      toast("Database loaded");
    } catch {
      toast("Could not load .db file", "error");
    }
  };

  const handleDbExport = async () => {
    try {
      const bytes = await exportDatabase();
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/x-sqlite3" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "playground.db";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast("Database downloaded");
    } catch {
      toast("Export failed", "error");
    }
  };

  const handleSqlExport = async () => {
    try {
      const dump = await dumpDatabase();
      downloadText("database-dump.sql", dump, "application/sql;charset=utf-8");
      toast("SQL dump downloaded");
    } catch {
      toast("Export failed", "error");
    }
  };

  const saveQuery = useCallback(() => {
    if (!sql.trim()) return;
    const next = [{ sql, time: nowMs() }, ...saved.filter((h) => h.sql !== sql)].slice(0, 20);
    setSaved(next);
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    toast("Query saved");
  }, [saved, sql, toast]);

  const handleReset = async () => {
    setLoadingDb(true);
    try {
      await resetDatabase();
      setTabs([]);
      setActiveTab(null);
      setSql(DEFAULT_SQL);
      await refreshTables();
      toast("Database reset");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not reset the database", "error");
    } finally {
      setLoadingDb(false);
    }
  };

  const previewTable = async (name: string) => {
    setSql(`SELECT * FROM "${name}" LIMIT 100;`);
    // Open the schema tab first (becomes active) and add the data preview
    // WITHOUT stealing the active tab, so the schema is always what's shown.
    // If the schema fails to load, fall back to activating the data tab.
    const ok = await loadTableSchema(name);
    void runSql(`SELECT * FROM "${name}" LIMIT 100;`, true, !ok);
  };

  // Open a dedicated schema tab (columns + CREATE statement) for a table.
  // Returns true when the schema tab was opened (and became active).
  const loadTableSchema = async (name: string): Promise<boolean> => {
    const id = ++runIdRef.current;
    try {
      const schema = await getTableSchema(name);
      setTabs((prev) => [
        ...prev,
        { id, title: `Schema · ${name}`, sql: `PRAGMA table_info("${name}")`, schema },
      ]);
      setActiveTab(id);
      return true;
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not load table schema", "error");
      return false;
    }
  };

  // Keyboard shortcuts: Ctrl/⌘+Enter to run, Ctrl/⌘+S to save.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.isComposing || e.keyCode === 229) return; // IME composition
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (e.key === "Enter") {
        e.preventDefault();
        void runSql(sql);
      } else if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveQuery();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [runSql, saveQuery, sql]);

  const activeEntry = tabs.find((t) => t.id === activeTab) ?? null;

  /* ------------------------------ render --------------------------------- */
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface p-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <Database className="h-4 w-4 text-primary" />
          <select
            value=""
            onChange={(e) => e.target.value && void loadSample(e.target.value)}
            aria-label="Load a sample database"
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-text-secondary outline-none transition-colors hover:border-primary/40 focus-visible:border-primary"
          >
            <option value="" disabled>
              Sample databases…
            </option>
            {SAMPLE_DATABASES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.description}
              </option>
            ))}
          </select>
        </div>

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <Button size="sm" variant="secondary" onClick={handleRun} disabled={running || !sql.trim()}>
          {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          Run
        </Button>
        <Button size="sm" variant="secondary" onClick={handleExplain} disabled={running || !sql.trim()}>
          <Zap className="h-3.5 w-3.5" />
          Explain
        </Button>
        <Button size="sm" variant="ghost" onClick={saveQuery}>
          <Save className="h-3.5 w-3.5" />
          Save
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setShowHistory((v) => !v)}>
          <History className="h-3.5 w-3.5" />
          History
        </Button>

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => csvFileRef.current?.click()}
            title="Import CSV as a new table"
          >
            <Upload className="h-3.5 w-3.5" />
            CSV
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => sqlFileRef.current?.click()}
            title="Import a .sql file into the editor"
          >
            <FileUp className="h-3.5 w-3.5" />
            SQL
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => dbFileRef.current?.click()}
            title="Upload an existing .db database"
          >
            <Database className="h-3.5 w-3.5" />
            .db
          </Button>
          <Button size="sm" variant="secondary" onClick={handleDbExport} title="Download the database as .db">
            <Download className="h-3.5 w-3.5" />
            .db
          </Button>
          <Button size="sm" variant="secondary" onClick={handleSqlExport} title="Download all schema + data as SQL">
            <Download className="h-3.5 w-3.5" />
            SQL
          </Button>
        </div>

        <Button size="sm" variant="ghost" onClick={() => void handleReset()} className="text-error hover:text-error">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>

        <input ref={csvFileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleCsvImport} aria-label="Import CSV" />
        <input ref={sqlFileRef} type="file" accept=".sql,application/sql,text/plain" className="hidden" onChange={handleSqlImport} aria-label="Import SQL" />
        <input ref={dbFileRef} type="file" accept=".db,.sqlite,.sqlite3" className="hidden" onChange={handleDbImport} aria-label="Upload database" />
      </div>

      {/* Status strip */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Table2 className="h-3.5 w-3.5 text-primary" />
          {tables.length} table{tables.length === 1 ? "" : "s"}
        </span>
        {dbSize !== null && (
          <span>
            Memory DB: {(dbSize / 1024).toFixed(1)} KB
          </span>
        )}
        <span>Engine: SQLite (WASM, in-browser)</span>
        {loadingDb && (
          <span className="inline-flex items-center gap-1.5 text-primary">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Loading database…
          </span>
        )}
      </div>

      {/* Editor + tables */}
      <div className="grid gap-4 lg:grid-cols-[1fr_230px]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="flex items-center justify-between border-b border-border bg-surface px-3 py-2">
              <p className="text-sm font-semibold text-text-primary">SQL Editor</p>
              <p className="hidden text-[11px] text-text-muted sm:block">
                Ctrl/⌘+Enter to run
              </p>
            </div>
            <div className="h-[260px] bg-background">
              <PlaygroundEditor
                language="sql"
                value={sql}
                onChange={setSql}
                ariaLabel="SQL query editor"
                options={{ fontSize: 13.5 }}
              />
            </div>
          </div>

          {/* Results tabs */}
          {tabs.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
              <div className="flex flex-wrap items-center gap-1 border-b border-border bg-surface px-2 pt-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "max-w-[220px] truncate rounded-t-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                      activeTab === tab.id
                        ? "border border-b-0 border-border bg-background text-primary"
                        : "text-text-muted hover:text-text-primary"
                    )}
                    title={tab.sql}
                  >
                    <span className="truncate">{tab.title}</span>
                    {tab.error && <span className="ml-1 text-error">✕</span>}
                  </button>
                ))}
              </div>
              <div className="p-3">
                {activeEntry ? (
                  <ResultView entry={activeEntry} />
                ) : (
                  <p className="py-6 text-center text-sm text-text-muted">
                    Select a result tab to inspect its output.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tables sidebar */}
        <aside className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Table2 className="h-4 w-4 text-primary" />
            Tables & Views
          </h2>
          {tables.length === 0 ? (
            <p className="text-xs text-text-muted">
              No tables yet — load a sample database or run a CREATE TABLE query.
            </p>
          ) : (
            <ul className="space-y-1">
              {tables.map((t) => (
                <li key={t.name}>
                  <button
                    type="button"
                    onClick={() => previewTable(t.name)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
                    title={`Preview ${t.name}`}
                  >
                    <Table2 className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                    <span className="truncate">{t.name}</span>
                    <span className="ml-auto text-[10px] uppercase text-text-muted">{t.type === "view" ? "view" : ""}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 border-t border-border pt-3 text-[11px] leading-relaxed text-text-muted">
            Click a table to preview its schema and first 100 rows.
          </p>
        </aside>
      </div>

      {/* History drawer */}
      {showHistory && (
        <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <History className="h-4 w-4 text-primary" />
              Query History
            </h2>
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <span>Saved: {saved.length}</span>
              <button
                type="button"
                onClick={() => {
                  setRecent([]);
                  setSaved([]);
                  try {
                    localStorage.removeItem(HISTORY_KEY);
                    localStorage.removeItem(SAVED_KEY);
                  } catch {
                    // ignore
                  }
                }}
                className="text-error transition-opacity hover:opacity-80"
              >
                Clear all
              </button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Recent</h3>
              {recent.length === 0 ? (
                <p className="text-xs text-text-muted">Run a query to see it here.</p>
              ) : (
                <ul className="space-y-1.5">
                  {recent.map((entry) => (
                    <li key={`${entry.time}-${entry.sql}`}>
                      <button
                        type="button"
                        onClick={() => {
                          setSql(entry.sql);
                          void runSql(entry.sql);
                        }}
                        className="block w-full truncate rounded-lg border border-border/60 bg-background px-3 py-2 text-left font-mono text-[11px] text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                        title={entry.sql}
                      >
                        {entry.sql.split("\n")[0] || "(empty)"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Saved</h3>
              {saved.length === 0 ? (
                <p className="text-xs text-text-muted">Use Save to keep a query here.</p>
              ) : (
                <ul className="space-y-1.5">
                  {saved.map((entry) => (
                    <li key={`${entry.time}-${entry.sql}`}>
                      <button
                        type="button"
                        onClick={() => {
                          setSql(entry.sql);
                          void runSql(entry.sql);
                        }}
                        className="flex w-full items-center gap-2 truncate rounded-lg border border-border/60 bg-background px-3 py-2 text-left font-mono text-[11px] text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                        title={entry.sql}
                      >
                        <Sparkles className="h-3 w-3 shrink-0 text-primary" />
                        <span className="truncate">{entry.sql.split("\n")[0] || "(empty)"}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/** Renders a table's schema: column list with badges + CREATE statement. */
function TableSchemaView({ schema }: { schema: TableSchema }) {
  const pkColumns = schema.columns.filter((c) => c.primaryKey > 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
        <span className="inline-flex items-center gap-1.5 font-medium text-text-primary">
          <Table2 className="h-3.5 w-3.5 text-primary" />
          {schema.columns.length} column{schema.columns.length === 1 ? "" : "s"}
        </span>
        {pkColumns.length > 0 && (
          <span className="inline-flex items-center gap-1">
            <KeyRound className="h-3 w-3 text-warning" />
            Primary key: {pkColumns.map((c) => c.name).join(", ")}
          </span>
        )}
      </div>

      <ul className="overflow-hidden rounded-xl border border-border">
        {schema.columns.map((col, i) => (
          <li
            key={`${col.name}-${i}`}
            className="flex flex-wrap items-center gap-2 border-b border-border/60 bg-background px-3 py-2 text-[13px] last:border-b-0"
          >
            <span className="font-mono font-semibold text-text-primary">{col.name}</span>
            {col.type && (
              <span className="rounded-md bg-primary-light px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase text-primary">
                {col.type}
              </span>
            )}
            {col.primaryKey > 0 && (
              <span className="inline-flex items-center gap-0.5 rounded-md bg-warning-light px-1.5 py-0.5 text-[10px] font-semibold text-warning">
                <KeyRound className="h-2.5 w-2.5" />
                PK
              </span>
            )}
            {col.notNull && (
              <span className="rounded-md bg-error-light px-1.5 py-0.5 text-[10px] font-semibold text-error">
                NOT NULL
              </span>
            )}
            {col.defaultValue !== null && (
              <span className="ml-auto font-mono text-[11px] text-text-muted">
                default {col.defaultValue}
              </span>
            )}
          </li>
        ))}
      </ul>

      {schema.createSql && (
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
            <Braces className="h-3.5 w-3.5 text-primary" />
            <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
              CREATE statement
            </p>
          </div>
          <pre className="max-h-52 overflow-auto bg-background p-3 font-mono text-[11px] leading-relaxed text-text-secondary">
            {schema.createSql}
          </pre>
        </div>
      )}
    </div>
  );
}

/** Render a single result tab (grid, error, or metadata). */
function ResultView({ entry }: { entry: TabEntry }) {
  if (entry.schema) return <TableSchemaView schema={entry.schema} />;

  const data: GridData | null = entry.results && entry.results.length > 0 ? entry.results[0] : null;

  if (entry.error) {
    return (
      <div className="rounded-xl border border-error/30 bg-error-light/50 p-4" role="alert">
        <p className="text-sm font-semibold text-error">Query failed</p>
        <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-relaxed text-error/90">
          {entry.error}
        </pre>
      </div>
    );
  }

  if (!data) {
    return (
      <p className="py-4 text-center text-sm text-text-muted">
        {entry.durationMs !== undefined && (
          <span className="text-success">✓ Done in {entry.durationMs.toFixed(1)} ms — no result rows.</span>
        )}
        {!entry.durationMs && "No output."}
      </p>
    );
  }

  const hasMore = entry.results && entry.results.length > 1;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
        <span>
          {data.values.length.toLocaleString()} rows × {data.columns.length} columns
        </span>
        {entry.durationMs !== undefined && <span>in {entry.durationMs.toFixed(1)} ms</span>}
        {entry.results && entry.results[entry.results.length - 1].rowsAffected > 0 && (
          <span className="text-success">
            {entry.results[entry.results.length - 1].rowsAffected} row
            {entry.results[entry.results.length - 1].rowsAffected === 1 ? "" : "s"} affected
          </span>
        )}
      </div>
      {hasMore && (
        <p className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-text-muted">
          Query returned {entry.results!.length} result sets — showing the first.
        </p>
      )}
      <DataGrid data={data} />
    </div>
  );
}

/** Public entry — wraps the tool in the toast provider. */
export function SqlPlaygroundTool() {
  return (
    <ToastProvider>
      <SqlPlaygroundInner />
    </ToastProvider>
  );
}
