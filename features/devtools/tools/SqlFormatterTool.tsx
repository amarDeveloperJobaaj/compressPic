"use client";

import { useMemo, useState } from "react";
import { format } from "sql-formatter";
import { FileUp, Download } from "lucide-react";
import { ToolPanel } from "../components/ToolPanel";
import { CodeTextarea } from "../components/CodeTextarea";
import { CodeOutput } from "../components/CodeOutput";
import { CopyButton } from "../components/CopyButton";
import { Button } from "@/components/ui/button";
import { downloadText, readFileAsText } from "../utils/download";
import { highlightSql } from "../utils/highlight";
import { cn } from "@/lib/utils";

const EXAMPLE = `SELECT u.id, u.name, COUNT(o.id) AS orders, SUM(o.total) AS total_spent
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.active = 1 AND u.created_at > '2025-01-01'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 2
ORDER BY total_spent DESC
LIMIT 10;`;

const DIALECTS = [
  "sql",
  "mysql",
  "postgresql",
  "sqlite",
  "mariadb",
  "mssql",
  "bigquery",
  "snowflake",
  "oracle",
  "db2",
  "hive",
  "redshift",
  "spark",
  "transactsql",
] as const;

function minifySql(input: string): string {
  // Remove comments and collapse whitespace outside string literals
  return input
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/--[^\n]*/g, " ")
    .split("\n")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function SqlFormatterTool() {
  const [input, setInput] = useState(EXAMPLE);
  const [dialect, setDialect] = useState<string>("sql");
  const [mode, setMode] = useState<"beautify" | "minify">("beautify");

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };
    try {
      const formatted =
        mode === "minify" ? minifySql(input) : format(input, { language: dialect as never, tabWidth: 2 });
      return { output: formatted, error: null };
    } catch (e) {
      return {
        output: "",
        error: e instanceof Error ? e.message : "Failed to format SQL.",
      };
    }
  }, [input, dialect, mode]);

  const handleUpload = async (file: File) => {
    setInput(await readFileAsText(file));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input */}
      <ToolPanel
        title="Input SQL"
        description="Paste a query or upload a .sql file."
        actions={
          <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-primary">
            <FileUp className="h-3.5 w-3.5" />
            Upload
            <input
              type="file"
              accept=".sql,text/plain"
              className="sr-only"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </label>
        }
      >
        {/* Dialect selector */}
        <div className="mb-4">
          <span className="mb-1.5 block text-sm font-medium text-text-primary">Dialect</span>
          <select
            value={dialect}
            onChange={(e) => setDialect(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-text-primary transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            aria-label="SQL dialect"
          >
            {DIALECTS.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <CodeTextarea value={input} onChange={setInput} rows={14} ariaLabel="SQL input" placeholder="SELECT * FROM users…" />
        {error && (
          <p className="mt-3 rounded-lg border border-error/20 bg-error-light px-3 py-2 text-sm text-error" role="alert">
            {error}
          </p>
        )}
      </ToolPanel>

      {/* Output */}
      <ToolPanel
        title="Formatted SQL"
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setMode("beautify")}>
              Beautify
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setMode("minify")}>
              Minify
            </Button>
            <CopyButton text={output} disabled={!output} />
            <Button
              variant="ghost"
              size="sm"
              disabled={!output}
              onClick={() => downloadText("formatted.sql", output, "text/plain;charset=utf-8")}
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </>
        }
      >
        <div className="mb-3 flex flex-wrap gap-2">
          {(
            [
              { key: "beautify", label: "Beautify" },
              { key: "minify", label: "Minify" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.97]",
                mode === key
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-background text-text-secondary hover:border-primary/40 hover:text-primary"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <CodeOutput
          html={output ? highlightSql(output) : ""}
          text={output}
          placeholder="Formatted SQL appears here…"
          title="Formatted SQL"
          filename="formatted.sql"
          ariaLabel="Formatted SQL output"
        />
        {output && (
          <p className="mt-3 text-xs text-text-muted">
            {new Blob([output]).size.toLocaleString()} bytes · {output.split("\n").length} lines
          </p>
        )}
      </ToolPanel>
    </div>
  );
}
