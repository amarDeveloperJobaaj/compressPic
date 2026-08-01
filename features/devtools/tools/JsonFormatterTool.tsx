"use client";

import { useMemo, useState } from "react";
import {
  Braces,
  FileUp,
  WrapText,
  Minus,
  ListTree,
  Download,
} from "lucide-react";
import { ToolPanel } from "../components/ToolPanel";
import { CodeTextarea } from "../components/CodeTextarea";
import { CodeOutput } from "../components/CodeOutput";
import { CopyButton } from "../components/CopyButton";
import { Button } from "@/components/ui/button";
import { downloadText, readFileAsText } from "../utils/download";
import { highlightJson } from "../utils/highlight";
import { cn } from "@/lib/utils";

const EXAMPLE = `{"name":"CompressPix","tags":["image","tools"],"stats":{"tools":12,"free":true},"nested":{"deep":{"deeper":[1,2,3]}}}`;

/** Recursive collapsible JSON tree node. */
function JsonNode({
  name,
  value,
  depth,
}: {
  name: string | null;
  value: unknown;
  depth: number;
}) {
  const [open, setOpen] = useState(depth < 2);
  const isObject = value !== null && typeof value === "object" && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const isCollapsible = isObject || isArray;

  const label = name ? <span className="text-sky-600 dark:text-sky-400">{name}: </span> : null;

  if (!isCollapsible) {
    return (
      <div className="py-0.5 pl-4" style={{ paddingLeft: depth * 16 + 8 }}>
        {label}
        <span
          className={cn(
            typeof value === "string"
              ? "text-emerald-600 dark:text-emerald-400"
              : typeof value === "number"
                ? "text-amber-600 dark:text-amber-400"
                : "text-fuchsia-600 dark:text-fuchsia-400"
          )}
        >
          {JSON.stringify(value)}
        </span>
      </div>
    );
  }

  const entries = isObject
    ? Object.entries(value as Record<string, unknown>)
    : (value as unknown[]).map((v, i) => [String(i), v] as [string, unknown]);

  return (
    <div className="py-0.5" style={{ paddingLeft: depth * 16 }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 font-medium text-text-primary transition-colors hover:text-primary"
      >
        <span className="inline-block w-3 text-text-muted">{open ? "▾" : "▸"}</span>
        {label}
        <span className="text-text-muted">
          {isObject ? `{${entries.length}}` : `[${entries.length}]`}
        </span>
      </button>
      {open && (
        <div className="border-l border-border/60">
          {entries.map(([key, child]) => (
            <JsonNode key={key} name={key} value={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function JsonFormatterTool() {
  const [input, setInput] = useState(EXAMPLE);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"beautify" | "minify" | "tree">("beautify");

  const parsed = useMemo(() => {
    try {
      return { ok: true as const, value: JSON.parse(input) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }, [input]);

  const run = (nextMode: "beautify" | "minify" | "tree") => {
    if (!parsed.ok) {
      setError(parsed.error);
      setOutput("");
      return;
    }
    setError(null);
    setMode(nextMode);
    if (nextMode === "tree") {
      setOutput("");
      return;
    }
    setOutput(JSON.stringify(parsed.value, null, nextMode === "beautify" ? 2 : undefined));
  };

  const handleUpload = async (file: File) => {
    const text = await readFileAsText(file);
    setInput(text);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input */}
      <ToolPanel
        title="Input JSON"
        description="Paste JSON or upload a .json file."
        actions={
          <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-primary">
            <FileUp className="h-3.5 w-3.5" />
            Upload
            <input
              type="file"
              accept=".json,application/json"
              className="sr-only"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </label>
        }
      >
        <CodeTextarea value={input} onChange={setInput} rows={16} ariaLabel="JSON input" />
        {error && (
          <p className="mt-3 rounded-lg border border-error/20 bg-error-light px-3 py-2 text-sm text-error" role="alert">
            {error}
          </p>
        )}
      </ToolPanel>

      {/* Output */}
      <ToolPanel
        title="Output"
        description="Formatted, minified, or tree view."
        actions={
          <>
            <CopyButton
              text={mode === "tree" ? JSON.stringify(parsed.ok ? parsed.value : null, null, 2) : output}
              disabled={!parsed.ok || mode === "tree"}
            />
            <Button
              variant="ghost"
              size="sm"
              disabled={!parsed.ok || mode === "tree"}
              onClick={() =>
                downloadText("formatted.json", output, "application/json")
              }
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </>
        }
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {(
            [
              { key: "beautify", label: "Beautify", icon: WrapText },
              { key: "minify", label: "Minify", icon: Minus },
              { key: "tree", label: "Tree View", icon: ListTree },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => run(key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all active:scale-[0.97]",
                mode === key
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-background text-text-secondary hover:border-primary/40 hover:text-primary"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {mode === "tree" ? (
          parsed.ok ? (
            <div className="max-h-[420px] overflow-auto rounded-xl border border-border bg-background p-3 font-mono text-[13px] leading-relaxed">
              <JsonNode name={null} value={parsed.value} depth={0} />
            </div>
          ) : (
            <p className="rounded-lg border border-error/20 bg-error-light px-3 py-2 text-sm text-error">
              Fix the JSON error to see the tree view.
            </p>
          )
        ) : (
          <CodeOutput
            html={output ? highlightJson(output) : ""}
            text={output}
            placeholder="Click Beautify, Minify, or Tree View…"
            title="Formatted JSON"
            filename="formatted.json"
            mime="application/json"
            ariaLabel="Formatted JSON output"
          />
        )}

        {parsed.ok && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
            <Braces className="h-3.5 w-3.5 text-success" />
            Valid JSON ·{" "}
            {new Blob([output]).size.toLocaleString()} bytes
          </p>
        )}
      </ToolPanel>
    </div>
  );
}


