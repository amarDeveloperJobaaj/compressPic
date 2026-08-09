"use client";

import { useCallback, useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  MAX_RESUME_SIZE,
  useInterviewStore,
} from "@/features/ai-interview/store/interview-store";

const ACCEPT = "application/pdf,.pdf";

function isPdf(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

/** Human-readable file size (KB/MB). */
function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Resume capture zone — client-side validation only (PDF, ≤10 MB).
 * Server-side validation, text extraction, and AI analysis land in Phase 2.
 */
export function ResumeUploader() {
  const resumeFile = useInterviewStore((s) => s.resumeFile);
  const setResumeFile = useInterviewStore((s) => s.setResumeFile);
  const clearResume = useInterviewStore((s) => s.clearResume);

  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptFile = useCallback(
    (file: File | undefined | null) => {
      if (!file) return;
      if (!isPdf(file)) {
        setError("Please upload a PDF resume.");
        return;
      }
      if (file.size > MAX_RESUME_SIZE) {
        setError("That file is over 10 MB. Please upload a smaller resume.");
        return;
      }
      setError(null);
      setResumeFile(file);
    },
    [setResumeFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      acceptFile(e.dataTransfer.files?.[0]);
    },
    [acceptFile]
  );

  if (resumeFile) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-text-primary">{resumeFile.name}</p>
          <p className="text-xs text-text-muted">
            {formatSize(resumeFile.size)} · PDF · analysis coming in Phase 2
          </p>
        </div>
        <button
          type="button"
          onClick={clearResume}
          aria-label="Remove resume"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-primary-light hover:text-primary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200",
          dragOver
            ? "border-primary bg-primary-light/40"
            : "border-border bg-surface hover:border-primary/40 hover:bg-primary-light/20"
        )}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
          <Upload className="h-5 w-5" />
        </span>
        <span className="text-sm font-semibold text-text-primary">
          Drop your resume here or click to browse
        </span>
        <span className="text-xs text-text-muted">PDF only · up to 10 MB</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(e) => acceptFile(e.target.files?.[0])}
      />
      {error && (
        <p role="alert" className="mt-2 text-xs text-error">
          {error}
        </p>
      )}
      <p className="mt-3 text-xs text-text-muted">
        No resume? Skip it — the AI interviewer can run a general interview for your role.
      </p>
    </div>
  );
}
