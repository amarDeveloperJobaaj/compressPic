"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { zipSync, strToU8 } from "fflate";
import {
  Download,
  Expand,
  FileCode2,
  FolderOpen,
  Play,
  RotateCcw,
  Sparkles,
  Upload,
  X,
  Monitor,
  Tablet,
  Smartphone,
  Minus,
  ChevronRight,
  Loader2,
  Copy,
  Share2,
} from "lucide-react";
import { PlaygroundEditor, type EditorLanguage } from "@/features/playground/components/PlaygroundEditor";
import { SplitPane } from "@/features/playground/components/SplitPane";
import { ToastProvider, useToast } from "@/features/playground/components/Toast";
import { PLAYGROUND_TEMPLATES, type PlaygroundProject } from "./templates";
import { buildPreviewDocument, type ConsoleEntry } from "./preview";
import { beautifyCode, minifyCode } from "./format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  downloadText,
  copyToClipboard,
  utf8ToBase64,
  base64ToUtf8,
} from "@/features/devtools/utils/download";

type Tab = "html" | "css" | "js";
type Device = "desktop" | "tablet" | "mobile";
type ConsoleFilter = "all" | "log" | "warn" | "error";

const STORAGE_KEY = "vizotool:html-playground:project";
const SHARE_PREFIX = "#code=";

/** Encode a project into a shareable URL hash (UTF-8 safe base64). */
export function encodeShareHash(project: PlaygroundProject): string {
  return `${SHARE_PREFIX}${utf8ToBase64(JSON.stringify(project))}`;
}

/** Decode a project from a URL hash. Returns null when invalid. */
export function decodeShareHash(hash: string): PlaygroundProject | null {
  try {
    if (!hash.startsWith(SHARE_PREFIX)) return null;
    const parsed = JSON.parse(base64ToUtf8(hash.slice(SHARE_PREFIX.length))) as PlaygroundProject;
    if (parsed && typeof parsed.html === "string") return parsed;
    return null;
  } catch {
    return null;
  }
}
const TABS: { id: Tab; label: string; language: EditorLanguage }[] = [
  { id: "html", label: "HTML", language: "html" },
  { id: "css", label: "CSS", language: "css" },
  { id: "js", label: "JavaScript", language: "javascript" },
];

/** Map a Tab id to the code language name used by the format utils. */
const CODE_LANG: Record<Tab, "html" | "css" | "javascript"> = {
  html: "html",
  css: "css",
  js: "javascript",
};

const DEVICE_WIDTHS: Record<Device, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

const EMPTY: PlaygroundProject = { html: "", css: "", js: "" };

/** Inner component — needs the Toast context. */
function HtmlCssJsPlaygroundInner() {
  const { toast } = useToast();

  const [project, setProject] = useState<PlaygroundProject>(EMPTY);
  const [tab, setTab] = useState<Tab>("html");
  const [autoRun, setAutoRun] = useState(true);
  // Lazy init: build the initial preview once (pure function of initial state).
  const [previewDoc, setPreviewDoc] = useState(() =>
    buildPreviewDocument(project.html, project.css, project.js)
  );
  const [runKey, setRunKey] = useState(0);
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [consoleFilter, setConsoleFilter] = useState<ConsoleFilter>("all");
  const [device, setDevice] = useState<Device>("desktop");
  const [split, setSplit] = useState(52);
  const [fullscreen, setFullscreen] = useState(false);
  const [importing, setImporting] = useState<null | Tab>(null);
  const [busy, setBusy] = useState(false);

  const idRef = useRef(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  /* ------------------------- autosave / restore ------------------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      // A shared link (#code=...) takes priority over the local draft.
      const shared = decodeShareHash(window.location.hash);
      if (shared) {
        setProject(shared);
        toast("Loaded project from shared link");
        return;
      }
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as PlaygroundProject;
          if (parsed && typeof parsed.html === "string") setProject(parsed);
        }
      } catch {
        // ignore corrupt storage
      }
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
      } catch {
        // storage unavailable
      }
    }, 500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [project]);

  /* ------------------------------ preview -------------------------------- */
  const runPreview = useCallback(() => {
    setPreviewDoc(buildPreviewDocument(project.html, project.css, project.js));
    setRunKey((k) => k + 1);
  }, [project]);

  // Debounced auto-run.
  useEffect(() => {
    if (!autoRun) return;
    const timer = setTimeout(() => {
      setPreviewDoc(buildPreviewDocument(project.html, project.css, project.js));
      setRunKey((k) => k + 1);
    }, 600);
    return () => clearTimeout(timer);
  }, [project, autoRun]);

  /* ------------------------------ console -------------------------------- */
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data as { source?: string; method?: string; args?: string[] };
      if (!data || data.source !== "playground-console") return;
      const method = (["log", "warn", "error", "info", "debug"].includes(data.method ?? "") ? data.method : "log") as ConsoleEntry["method"];
      setConsoleEntries((prev) => [
        ...prev.slice(-199),
        { id: ++idRef.current, method, args: Array.isArray(data.args) ? data.args : [], time: Date.now() },
      ]);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const setPanel = (key: keyof PlaygroundProject, value: string) =>
    setProject((p) => ({ ...p, [key]: value }));

  /* ------------------------------ actions -------------------------------- */
  const applyTemplate = (templateId: string) => {
    const template = PLAYGROUND_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    setProject({ html: template.html, css: template.css, js: template.js });
    toast(`Loaded template: ${template.name}`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !importing) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setPanel(importing, text);
      toast(`Imported ${file.name}`);
    };
    reader.readAsText(file);
  };

  const exportZip = () => {
    const zip = zipSync({
      "index.html": strToU8(project.html || "<!-- empty -->"),
      "style.css": strToU8(project.css || ""),
      "script.js": strToU8(project.js || ""),
    });
    const blob = new Blob([zip], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "playground-project.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast("Project exported as ZIP");
  };

  const exportPanel = (key: Tab) => {
    const names: Record<Tab, string> = { html: "index.html", css: "style.css", js: "script.js" };
    const mimes: Record<Tab, string> = {
      html: "text/html;charset=utf-8",
      css: "text/css;charset=utf-8",
      js: "application/javascript;charset=utf-8",
    };
    downloadText(names[key], project[key], mimes[key]);
    toast(`Downloaded ${names[key]}`);
  };

  const handleBeautify = () => {
    setBusy(true);
    const key = tab;
    // Let the button state paint, then format.
    setTimeout(() => {
      setPanel(key, beautifyCode(CODE_LANG[key], project[key]));
      setBusy(false);
      toast("Code beautified");
    }, 30);
  };

  const handleMinify = () => {
    setBusy(true);
    const key = tab;
    setTimeout(() => {
      setPanel(key, minifyCode(CODE_LANG[key], project[key]));
      setBusy(false);
      toast("Code minified");
    }, 30);
  };

  const handleReset = () => {
    setProject(EMPTY);
    setConsoleEntries([]);
    toast("Project reset");
  };

  const copyPanel = async () => {
    const ok = await copyToClipboard(project[tab]);
    if (ok) toast("Copied to clipboard");
  };

  const shareProject = async () => {
    const url = `${window.location.origin}${window.location.pathname}${encodeShareHash(project)}`;
    const ok = await copyToClipboard(url);
    if (ok) toast("Share link copied to clipboard");
  };

  /* ------------------------- keyboard shortcuts -------------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.isComposing || e.keyCode === 229) return; // IME composition
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (e.key === "Enter") {
        e.preventDefault();
        runPreview();
        toast("Project ran");
      } else if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
          toast("Project saved");
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, runPreview, toast]);

  // Esc closes fullscreen preview.
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [fullscreen]);

  const visibleConsole = consoleEntries.filter(
    (entry) => consoleFilter === "all" || entry.method === consoleFilter
  );

  const activeCode = project[tab];
  const fileNames: Record<Tab, string> = { html: "index.html", css: "style.css", js: "script.js" };

  const previewFrame = (
    <iframe
      key={runKey}
      title="Live preview"
      srcDoc={previewDoc}
      sandbox="allow-scripts allow-modals allow-forms allow-popups"
      className="h-full w-full border-0 bg-white"
    />
  );

  /* ------------------------------ render --------------------------------- */
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface p-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-primary" />
          <select
            value=""
            onChange={(e) => e.target.value && applyTemplate(e.target.value)}
            aria-label="Choose a template"
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-text-secondary outline-none transition-colors hover:border-primary/40 focus-visible:border-primary"
          >
            <option value="" disabled>
              Templates…
            </option>
            {PLAYGROUND_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <Button size="sm" variant="secondary" onClick={runPreview}>
          <Play className="h-3.5 w-3.5" />
          Run
        </Button>
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-text-secondary">
          <button
            type="button"
            role="switch"
            aria-checked={autoRun}
            onClick={() => setAutoRun((v) => !v)}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
              autoRun ? "bg-primary" : "bg-border"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                autoRun ? "translate-x-[18px]" : "translate-x-0.5"
              )}
            />
          </button>
          Auto-run
        </label>

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <Button size="sm" variant="secondary" onClick={handleBeautify} disabled={busy}>
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          Beautify
        </Button>
        <Button size="sm" variant="secondary" onClick={handleMinify} disabled={busy}>
          <Minus className="h-3.5 w-3.5" />
          Minify
        </Button>

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <Button size="sm" variant="ghost" onClick={copyPanel}>
          <Copy className="h-3.5 w-3.5" />
          Copy
        </Button>
        <Button size="sm" variant="ghost" onClick={() => void shareProject()}>
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setImporting(tab);
              fileInputRef.current?.click();
            }}
          >
            <Upload className="h-3.5 w-3.5" />
            Import
          </Button>
          <Button size="sm" variant="ghost" onClick={() => exportPanel(tab)}>
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
        <Button size="sm" variant="secondary" onClick={exportZip}>
          <FolderOpen className="h-3.5 w-3.5" />
          ZIP
        </Button>
        <Button size="sm" variant="ghost" onClick={handleReset} className="text-error hover:text-error">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".html,.css,.js,text/html,text/css,application/javascript"
          className="hidden"
          onChange={handleImport}
          aria-label="Import code file"
        />
      </div>

      {/* Editors + preview */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <SplitPane left={split} onResize={setSplit} ariaLabel="Resize editor and preview">
          {/* Left: tabbed editors — shorter when stacked on phones */}
          <div className="flex h-[380px] flex-col md:h-[560px]">
            <div className="flex items-center justify-between border-b border-border bg-surface px-2 pt-2">
              <div className="flex items-center gap-1" role="tablist" aria-label="Code panels">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={tab === t.id}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-t-lg px-3.5 py-2 text-xs font-semibold transition-colors",
                      tab === t.id
                        ? "border border-b-0 border-border bg-background text-primary"
                        : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    <FileCode2 className="h-3.5 w-3.5" />
                    {t.label}
                  </button>
                ))}
              </div>
              <span className="hidden pr-3 font-mono text-[11px] text-text-muted sm:block">
                {fileNames[tab]}
              </span>
            </div>
            <div className="min-h-0 flex-1 bg-background">
              <PlaygroundEditor
                key={tab}
                language={TABS.find((t) => t.id === tab)!.language}
                value={activeCode}
                onChange={(value) => setPanel(tab, value)}
                ariaLabel={`${TABS.find((t) => t.id === tab)!.label} editor`}
              />
            </div>
          </div>

          {/* Right: preview + console — shorter when stacked on phones */}
          <div className="flex h-[420px] flex-col md:h-[560px]">
            <div className="flex items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2">
              <div className="flex items-center gap-1" role="group" aria-label="Preview device width">
                {(
                  [
                    { id: "desktop", icon: Monitor, label: "Desktop" },
                    { id: "tablet", icon: Tablet, label: "Tablet" },
                    { id: "mobile", icon: Smartphone, label: "Mobile" },
                  ] as const
                ).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    aria-label={d.label}
                    aria-pressed={device === d.id}
                    onClick={() => setDevice(d.id)}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                      device === d.id
                        ? "bg-primary-light text-primary"
                        : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    <d.icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setFullscreen(true)}
                  aria-label="Open fullscreen preview"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-primary-light hover:text-primary"
                >
                  <Expand className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex min-h-0 flex-1 items-start justify-center overflow-auto bg-[repeating-conic-gradient(#e2e8f0_0%_25%,#f8fafc_0%_50%)] bg-[length:20px_20px] p-0 dark:bg-[repeating-conic-gradient(#1e293b_0%_25%,#0f172a_0%_50%)]">
              <div
                className="h-full overflow-hidden shadow-lg transition-all duration-300"
                style={{ width: DEVICE_WIDTHS[device] }}
              >
                {previewFrame}
              </div>
            </div>

            {/* Console */}
            <div className="border-t border-border bg-background">
              <div className="flex items-center justify-between px-3 py-1.5">
                <div className="flex items-center gap-1">
                  {(["all", "log", "warn", "error"] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setConsoleFilter(f)}
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide transition-colors",
                        consoleFilter === f
                          ? "bg-primary-light text-primary"
                          : "text-text-muted hover:text-text-primary"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-text-muted">
                    {visibleConsole.length} log{visibleConsole.length === 1 ? "" : "s"}
                  </span>
                  {consoleEntries.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setConsoleEntries([])}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-primary-light hover:text-primary"
                      aria-label="Clear console"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="h-28 overflow-auto border-t border-border px-3 py-2 font-mono text-[12px] leading-relaxed">
                {visibleConsole.length === 0 ? (
                  <p className="text-text-muted">
                    Console output appears here — try{" "}
                    <code className="rounded bg-border/50 px-1">console.log(&quot;hi&quot;)</code>
                  </p>
                ) : (
                  visibleConsole.map((entry) => (
                    <div
                      key={entry.id}
                      className={cn(
                        "flex items-start gap-2 border-b border-border/40 py-1 last:border-0",
                        entry.method === "error" && "text-error",
                        entry.method === "warn" && "text-warning",
                        entry.method === "log" && "text-text-primary"
                      )}
                    >
                      <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-text-muted" />
                      <span className="min-w-0 flex-1 break-all">
                        {entry.args.map((arg, i) => (
                          <span key={i}>
                            {arg}
                            {i < entry.args.length - 1 ? <span className="text-text-muted"> </span> : null}
                          </span>
                        ))}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </SplitPane>
      </div>

      <p className="text-center text-xs text-text-muted">
        Shortcuts: <kbd className="rounded bg-border/60 px-1.5 py-0.5 font-mono">Ctrl/⌘+Enter</kbd> run ·{" "}
        <kbd className="rounded bg-border/60 px-1.5 py-0.5 font-mono">Ctrl/⌘+S</kbd> save · Autosaves every edit
      </p>

      {/* Fullscreen preview modal */}
      {fullscreen &&
        createPortal(
          <div
            ref={fullscreenRef}
            className="fixed inset-0 z-[70] flex flex-col bg-background"
            role="dialog"
            aria-modal="true"
            aria-label="Fullscreen preview"
          >
            <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2.5">
              <p className="text-sm font-semibold text-text-primary">Live Preview</p>
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
                aria-label="Close fullscreen preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1">{previewFrame}</div>
          </div>,
          document.body
        )}
    </div>
  );
}

/** Public entry — wraps the tool in the toast provider. */
export function HtmlCssJsPlaygroundTool() {
  return (
    <ToastProvider>
      <HtmlCssJsPlaygroundInner />
    </ToastProvider>
  );
}
