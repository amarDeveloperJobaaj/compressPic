"use client";

import { useCallback, useMemo, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { ToolPanel } from "../components/ToolPanel";
import { CopyButton } from "../components/CopyButton";
import { Slider } from "../components/controls";
import { downloadText } from "../utils/download";
import { cn } from "@/lib/utils";

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

function uuidV4(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  arr[6] = (arr[6] & 0x0f) | 0x40; // version 4
  arr[8] = (arr[8] & 0x3f) | 0x80; // variant 10
  const h = Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function uuidV1(): string {
  // 100ns intervals since 1582-10-15 (offset from Unix epoch in 100ns units)
  const GREGORIAN_OFFSET = BigInt("122192928000000000");
  const time = BigInt(Date.now()) * BigInt(10000) + GREGORIAN_OFFSET;
  const timeHex = time.toString(16).padStart(16, "0");
  const timeLow = timeHex.slice(8);
  const timeMid = timeHex.slice(4, 8);
  const timeHi = timeHex.slice(0, 4);
  const version = ((parseInt(timeHi.slice(0, 1), 16) & 0x0f) | 0x10).toString(16);
  const clockSeq = randomHex(2);
  const node = randomHex(6);
  const clockSeqHi = ((parseInt(clockSeq.slice(0, 1), 16) & 0x3f) | 0x80).toString(16);
  return `${timeLow}-${timeMid}-${version}${timeHi.slice(1)}-${clockSeqHi}${clockSeq.slice(1)}-${node}`;
}

function uuidV7(): string {
  const millis = BigInt(Date.now());
  const randA = new Uint8Array(4);
  const randB = new Uint8Array(8);
  crypto.getRandomValues(randA);
  crypto.getRandomValues(randB);
  randA[0] = (randA[0] & 0x0f) | 0x70; // version 7
  randB[0] = (randB[0] & 0x3f) | 0x80; // variant
  const timeHex = millis.toString(16).padStart(12, "0");
  const aHex = Array.from(randA, (b) => b.toString(16).padStart(2, "0")).join("");
  const bHex = Array.from(randB, (b) => b.toString(16).padStart(2, "0")).join("");
  const raw = timeHex + aHex + bHex;
  return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}-${raw.slice(20)}`;
}

type Version = "v1" | "v4" | "v7";

const GENERATORS: Record<Version, () => string> = {
  v1: uuidV1,
  v4: uuidV4,
  v7: uuidV7,
};

export function UuidGeneratorTool() {
  const [version, setVersion] = useState<Version>("v4");
  const [count, setCount] = useState(1);
  const [downloadFormat, setDownloadFormat] = useState<"txt" | "csv" | "json">("txt");
  // A nonce bumps regeneration without calling setState from an effect.
  const [nonce, setNonce] = useState(0);

  const uuids = useMemo(
    () => Array.from({ length: count }, () => GENERATORS[version]()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version, count, nonce]
  );

  const regenerate = useCallback(() => setNonce((n) => n + 1), []);
  const text = useMemo(() => uuids.join("\n"), [uuids]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <ToolPanel
        title="Options"
        actions={
          <button
            type="button"
            onClick={regenerate}
            aria-label="Generate again"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        }
      >
        {/* Version selector */}
        <div className="mb-5 flex flex-wrap gap-2">
          {(
            [
              { key: "v1", label: "UUID v1", hint: "Time-based" },
              { key: "v4", label: "UUID v4", hint: "Random" },
              { key: "v7", label: "UUID v7", hint: "Time-ordered" },
            ] as const
          ).map(({ key, label, hint }) => (
            <button
              key={key}
              type="button"
              onClick={() => setVersion(key)}
              className={cn(
                "flex-1 rounded-xl border px-3 py-2.5 text-left transition-all active:scale-[0.98]",
                version === key
                  ? "border-primary bg-primary-light/50 text-primary"
                  : "border-border bg-background text-text-secondary hover:border-primary/40"
              )}
            >
              <span className="block text-sm font-semibold">{label}</span>
              <span className="block text-xs text-text-muted">{hint}</span>
            </button>
          ))}
        </div>

        <Slider label="Count" value={count} min={1} max={10000} onChange={setCount} suffix="" />
      </ToolPanel>

      <ToolPanel
        title={`Generated UUIDs (${uuids.length})`}
        description="Generated locally using your browser's crypto API."
        actions={
          <>
            <CopyButton text={text} label="Copy All" disabled={!uuids.length} />
            <div className="flex items-center gap-1.5">
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value as "txt" | "csv" | "json")}
                className="h-9 rounded-lg border border-border bg-surface px-2 text-xs font-medium text-text-secondary transition-colors hover:border-primary/40"
                aria-label="Download format"
              >
                <option value="txt">.txt</option>
                <option value="csv">.csv</option>
                <option value="json">.json</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  const content =
                    downloadFormat === "json"
                      ? JSON.stringify(uuids, null, 2)
                      : downloadFormat === "csv"
                        ? `UUID\n${uuids.join("\n")}`
                        : text;
                  const mime =
                    downloadFormat === "json"
                      ? "application/json"
                      : downloadFormat === "csv"
                        ? "text/csv;charset=utf-8"
                        : "text/plain;charset=utf-8";
                  downloadText(`uuids-${version}.${downloadFormat}`, content, mime);
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!uuids.length}
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          </>
        }
      >
        <div className="max-h-[360px] overflow-auto rounded-xl border border-border bg-background p-4 font-mono text-[13px] leading-relaxed">
          {uuids.map((uuid, index) => (
            <div key={`${uuid}-${index}`} className="flex items-center justify-between gap-3 py-0.5">
              <span className="truncate text-text-primary">{uuid}</span>
              <CopyButton
                text={uuid}
                label=""
                ariaLabel="Copy UUID"
                className="h-7 w-7 border-0 bg-transparent p-0"
              />
            </div>
          ))}
        </div>
      </ToolPanel>
    </div>
  );
}
