"use client";

import { useEffect, useRef } from "react";
import Editor, { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useTheme } from "@/hooks/useTheme";

/**
 * Self-host Monaco (no CDN dependency). monaco-editor 0.5x+ ships ESM-only
 * with an exports map ("./*" -> "./esm/vs/*.js"), so we create workers with
 * webpack 5's native `new Worker(new URL(...))` pattern — this emits each
 * worker as its own chunk without relying on a default export.
 */
if (typeof window !== "undefined") {
  self.MonacoEnvironment = {
    getWorker(_workerId: string, label: string) {
      if (label === "json")
        return new Worker(new URL("monaco-editor/language/json/json.worker", import.meta.url));
      if (label === "css" || label === "scss" || label === "less")
        return new Worker(new URL("monaco-editor/language/css/css.worker", import.meta.url));
      if (label === "html" || label === "handlebars" || label === "razor")
        return new Worker(new URL("monaco-editor/language/html/html.worker", import.meta.url));
      if (label === "typescript" || label === "javascript")
        return new Worker(new URL("monaco-editor/language/typescript/ts.worker", import.meta.url));
      return new Worker(new URL("monaco-editor/editor/editor.worker", import.meta.url));
    },
  };
  loader.config({ monaco });
}

export type EditorLanguage =
  | "html"
  | "css"
  | "javascript"
  | "json"
  | "sql"
  | "markdown"
  | "typescript";

interface PlaygroundEditorProps {
  language: EditorLanguage;
  value: string;
  onChange?: (value: string) => void;
  height?: string | number;
  readOnly?: boolean;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
  ariaLabel?: string;
  onMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
}

/**
 * Shared Monaco editor for the playground tools. Theme-aware (follows the
 * site's light/dark mode) and fully self-hosted via webpack workers.
 */
export function PlaygroundEditor({
  language,
  value,
  onChange,
  height = "100%",
  readOnly = false,
  options,
  ariaLabel,
  onMount,
}: PlaygroundEditorProps) {
  const { isDark } = useTheme();
  const mountedRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  // Keep the editor model in sync when the theme flips.
  useEffect(() => {
    const editor = mountedRef.current;
    if (editor) {
      void monaco.editor.setTheme(isDark ? "vs-dark" : "vs");
    }
  }, [isDark]);

  return (
    <Editor
      language={language}
      value={value}
      onChange={(next) => onChange?.(next ?? "")}
      theme={isDark ? "vs-dark" : "vs"}
      height={height}
      loading={
        <div className="flex h-full items-center justify-center bg-background">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
      options={{
        fontSize: 13,
        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        readOnly,
        wordWrap: "on",
        renderWhitespace: "selection",
        smoothScrolling: true,
        cursorBlinking: "smooth",
        padding: { top: 12, bottom: 12 },
        bracketPairColorization: { enabled: true },
        ...options,
      }}
      onMount={(editor) => {
        mountedRef.current = editor;
        if (ariaLabel) editor.getDomNode()?.setAttribute("aria-label", ariaLabel);
        void monaco.editor.setTheme(isDark ? "vs-dark" : "vs");
        onMount?.(editor);
      }}
    />
  );
}
