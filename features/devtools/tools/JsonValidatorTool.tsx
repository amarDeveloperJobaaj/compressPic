"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, ShieldAlert, WrapText, FileUp } from "lucide-react";
import { ToolPanel } from "../components/ToolPanel";
import { CodeTextarea } from "../components/CodeTextarea";
import { CodeOutput } from "../components/CodeOutput";
import { CopyButton } from "../components/CopyButton";
import { Button } from "@/components/ui/button";
import { readFileAsText } from "../utils/download";
import { highlightJson } from "../utils/highlight";

const EXAMPLE = `{\n  "name": "Vizo Tool",\n  "tools": 12,\n  "free": true,\n  "tags": ["image", "developer"]\n}`;

interface ValidationResult {
  valid: boolean;
  line: number | null;
  column: number | null;
  message: string | null;
}

function validate(input: string): ValidationResult {
  if (!input.trim()) return { valid: false, line: null, column: null, message: "JSON is empty." };
  try {
    JSON.parse(input);
    return { valid: true, line: null, column: null, message: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid JSON";
    // V8 error messages end with "position N"
    const match = message.match(/position (\d+)/);
    if (match) {
      const pos = Number(match[1]);
      const upTo = input.slice(0, pos);
      const line = upTo.split("\n").length;
      const lastNewline = upTo.lastIndexOf("\n");
      const column = pos - lastNewline;
      return { valid: false, line, column, message };
    }
    return { valid: false, line: null, column: null, message };
  }
}

export function JsonValidatorTool() {
  const [input, setInput] = useState(EXAMPLE);
  const [pretty, setPretty] = useState("");

  const result = useMemo(() => validate(input), [input]);

  const prettyPrint = () => {
    try {
      setPretty(JSON.stringify(JSON.parse(input), null, 2));
    } catch {
      setPretty("");
    }
  };

  const handleUpload = async (file: File) => {
    setInput(await readFileAsText(file));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolPanel
        title="JSON to Validate"
        description="Validation runs on every keystroke."
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
      </ToolPanel>

      <ToolPanel title="Result">
        {/* Status badge */}
        <div
          className={
            result.valid
              ? "flex items-center gap-2 rounded-xl border border-success/20 bg-success-light px-4 py-3 text-sm font-medium text-success"
              : "flex items-center gap-2 rounded-xl border border-error/20 bg-error-light px-4 py-3 text-sm font-medium text-error"
          }
          role="status"
        >
          {result.valid ? <ShieldCheck className="h-5 w-5 shrink-0" /> : <ShieldAlert className="h-5 w-5 shrink-0" />}
          {result.valid ? "Valid JSON" : "Invalid JSON"}
        </div>

        {!result.valid && result.message && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-text-primary">Error details</p>
            <div className="rounded-lg border border-border bg-background p-4 font-mono text-[13px] leading-relaxed">
              {result.line !== null && (
                <p className="mb-1 text-text-muted">
                  Line <span className="font-semibold text-error">{result.line}</span>, column{" "}
                  <span className="font-semibold text-error">{result.column}</span>
                </p>
              )}
              <p className="text-text-primary">{result.message}</p>
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="primary" size="sm" onClick={prettyPrint} disabled={!result.valid}>
            <WrapText className="h-3.5 w-3.5" />
            Pretty Print
          </Button>
          <CopyButton text={pretty || input} label="Copy Pretty" disabled={!result.valid} />
        </div>

        {pretty && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-text-primary">Pretty-printed output</p>
            <CodeOutput
              html={highlightJson(pretty)}
              text={pretty}
              title="Pretty-printed JSON"
              filename="pretty.json"
              mime="application/json"
              previewClass="max-h-72"
              ariaLabel="Pretty printed JSON"
            />
          </div>
        )}
      </ToolPanel>
    </div>
  );
}
