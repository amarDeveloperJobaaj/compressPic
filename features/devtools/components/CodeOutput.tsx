"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Maximize2, X, Download, Code2 } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { Button } from "@/components/ui/button";
import { downloadText } from "../utils/download";
import { cn } from "@/lib/utils";

interface CodeOutputProps {
  /** Pre-highlighted HTML (already escaped). Rendered when non-empty. */
  html?: string;
  /** Raw text used for copy/download and as the plain fallback. */
  text: string;
  /** Shown when text is empty. */
  placeholder?: string;
  /** Tailwind classes for the inline preview's max height. */
  previewClass?: string;
  /** Modal title. */
  title?: string;
  /** Filename for the Download action (omitting hides Download). */
  filename?: string;
  mime?: string;
  ariaLabel?: string;
}

/**
 * Syntax-highlighted code output with preserved whitespace and a
 * fullscreen viewer (Esc / backdrop to close, Copy + Download actions).
 */
export function CodeOutput({
  html,
  text,
  placeholder,
  previewClass = "max-h-[420px]",
  title = "Output",
  filename,
  mime = "text/plain;charset=utf-8",
  ariaLabel,
}: CodeOutputProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const dialogLabel = ariaLabel ?? title;

  // Esc to close, lock body scroll, move focus into the dialog while open.
  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      trigger?.focus();
    };
  }, [open]);

  const content =
    html && text ? (
      <span dangerouslySetInnerHTML={{ __html: html }} />
    ) : (
      <span className={text ? "text-text-primary" : "text-text-muted"}>
        {text || placeholder || ""}
      </span>
    );

  const modal = open
    ? createPortal(
        <div
          ref={dialogRef}
          className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={dialogLabel}
          tabIndex={-1}
          onClick={(e) => {
            // Click on the backdrop (outside the panel) closes the modal.
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          {/* Modal header */}
          <div className="flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <Code2 className="h-4 w-4 shrink-0 text-primary" />
              <h3 className="truncate text-sm font-semibold text-text-primary">{title}</h3>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <CopyButton text={text} label="Copy" disabled={!text} />
              {filename && text && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => downloadText(filename, text, mime)}
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close fullscreen"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          {/* Modal content */}
          <div className="flex-1 overflow-auto p-4 sm:p-6">
            <pre className="whitespace-pre rounded-xl border border-border bg-background p-4 font-mono text-[13px] leading-relaxed shadow-inner">
              {content}
            </pre>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div className="relative">
      <div
        className={cn(
          "overflow-auto rounded-xl border border-border bg-background p-4 font-mono text-[13px] leading-relaxed shadow-inner",
          previewClass
        )}
      >
        {/* whitespace-pre keeps JSON/SQL indentation intact */}
        <pre className="whitespace-pre">{content}</pre>
      </div>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View ${title} fullscreen`}
        title="Fullscreen"
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface/90 text-text-secondary shadow-sm backdrop-blur transition-all hover:border-primary/40 hover:text-primary active:scale-95"
      >
        <Maximize2 className="h-3.5 w-3.5" />
      </button>
      {modal}
    </div>
  );
}
