"use client";

import { useCallback, useRef, useState } from "react";
import { Bot, FileText, Loader2, RotateCcw, Sparkles, Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  MAX_RESUME_SIZE,
  useInterviewStore,
} from "@/features/ai-interview/store/interview-store";
import { Button } from "@/components/ui/button";

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
 * Resume capture + analysis (Phase 2).
 *
 * Flow: pick/drop PDF → client validation → upload (progress) → analyze
 * ("Analyzing resume…") → CandidateProfile preview (§19). On storage
 * misconfiguration the upload degrades gracefully and analysis still runs
 * from client-extracted text. "Skip resume" is the no-file path.
 */
export function ResumeUploader() {
  const resumeFile = useInterviewStore((s) => s.resumeFile);
  const resumeStatus = useInterviewStore((s) => s.resumeStatus);
  const resumeError = useInterviewStore((s) => s.resumeError);
  const resumeSkipped = useInterviewStore((s) => s.resumeSkipped);
  const candidateProfile = useInterviewStore((s) => s.candidateProfile);
  const resumeAnalysisSource = useInterviewStore((s) => s.resumeAnalysisSource);
  const setResumeFile = useInterviewStore((s) => s.setResumeFile);
  const setResumeStatus = useInterviewStore((s) => s.setResumeStatus);
  const setResumeError = useInterviewStore((s) => s.setResumeError);
  const setResumePath = useInterviewStore((s) => s.setResumePath);
  const setCandidateProfile = useInterviewStore((s) => s.setCandidateProfile);
  const setResumeSkipped = useInterviewStore((s) => s.setResumeSkipped);
  const clearResume = useInterviewStore((s) => s.clearResume);
  const roleId = useInterviewStore((s) => s.roleId);
  const domainId = useInterviewStore((s) => s.domainId);
  const experienceLevelId = useInterviewStore((s) => s.experienceLevelId);

  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  /** Analyze a PDF whose text we already have (extracted on the client). */
  const analyzeFromText = useCallback(
    async (text: string) => {
      setResumeStatus("analyzing");
      setResumeError(null);
      try {
        const res = await fetch("/api/interview/resume/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resumeText: text,
            roleId,
            domainId,
            experienceLevelId,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error ?? "Analysis failed.");
        setCandidateProfile(data.profile, data.source ?? "ai");
        setResumeStatus("analyzed");
      } catch (e) {
        setResumeError(e instanceof Error ? e.message : "Resume analysis failed.");
        setResumeStatus("error");
      }
    },
    [roleId, domainId, experienceLevelId, setCandidateProfile, setResumeError, setResumeStatus]
  );

  const uploadThenAnalyze = useCallback(
    async (file: File) => {
      setResumeStatus("uploading");
      setUploadProgress(10);
      setResumeError(null);

      try {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/interview/resume/upload", {
          method: "POST",
          body: form,
        });
        const data = await res.json();
        setUploadProgress(60);

        if (res.ok && data.ok && data.path) {
          setResumePath(data.path);
          setResumeStatus("analyzing");
          const analyzeRes = await fetch("/api/interview/resume/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filePath: data.path, roleId, domainId, experienceLevelId }),
          });
          const analyzeData = await analyzeRes.json();
          if (!analyzeRes.ok || !analyzeData.ok) {
            throw new Error(analyzeData.error ?? "Analysis failed.");
          }
          setCandidateProfile(analyzeData.profile, analyzeData.source ?? "ai");
          setResumeStatus("analyzed");
          setUploadProgress(100);
          return;
        }

        // Storage unavailable / rejected → graceful client-side fallback:
        // extract text with pdf.js, then analyze from text (§74).
        if (data.fallbackToClient) {
          const { extractPdfTextClient } = await import("@/features/ai-interview/utils/pdf-client");
          const text = await extractPdfTextClient(file);
          await analyzeFromText(text);
          setUploadProgress(100);
          return;
        }

        throw new Error(data.error ?? "Upload failed.");
      } catch (e) {
        setResumeError(e instanceof Error ? e.message : "Upload failed.");
        setResumeStatus("error");
      }
    },
    [analyzeFromText, roleId, domainId, experienceLevelId, setCandidateProfile, setResumeError, setResumePath, setResumeStatus]
  );

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
      setResumeSkipped(false);
      setResumeFile(file);
      // Kick off upload + analyze immediately (event handler, not an effect).
      void uploadThenAnalyze(file);
    },
    [setResumeFile, setResumeSkipped, uploadThenAnalyze]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      acceptFile(e.dataTransfer.files?.[0]);
    },
    [acceptFile]
  );

  if (resumeSkipped) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary">Resume skipped</p>
            <p className="mt-0.5 text-xs text-text-muted">
              The AI interviewer will run a general interview for your role.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setResumeSkipped(false)}>
            <Upload className="h-4 w-4" />
            Upload instead
          </Button>
        </div>
      </div>
    );
  }

  if (resumeFile && (resumeStatus === "uploading" || resumeStatus === "analyzing")) {
    const analyzing = resumeStatus === "analyzing";
    return (
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
            {analyzing ? (
              <Sparkles className="h-5 w-5 animate-pulse" />
            ) : (
              <Loader2 className="h-5 w-5 animate-spin" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text-primary">{resumeFile.name}</p>
            <p className="mt-0.5 text-xs text-text-muted">
              {analyzing
                ? "Analyzing resume — building your candidate profile…"
                : `Uploading resume… ${uploadProgress}%`}
            </p>
          </div>
          <button
            type="button"
            onClick={clearResume}
            aria-label="Cancel resume upload"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-primary-light hover:text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-primary-light/50">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r from-primary to-sky-500 transition-all duration-500",
              analyzing && "animate-pulse"
            )}
            style={{
              width: analyzing ? "90%" : `${Math.max(12, uploadProgress)}%`,
            }}
          />
        </div>
      </div>
    );
  }

  if (resumeFile && resumeStatus === "analyzed" && candidateProfile) {
    return (
      <div className="rounded-2xl border border-primary/30 bg-surface p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
              <Bot className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">
                {candidateProfile.candidate_name}
              </p>
              <p className="text-xs text-text-muted">
                {candidateProfile.experience_level} · {formatSize(resumeFile.size)} PDF
              </p>
            </div>
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

        {resumeAnalysisSource === "heuristic" && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
            Quick scan — no AI provider is configured, so this profile was built locally from your
            resume text.
          </p>
        )}

        {candidateProfile.skills.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Skills</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {candidateProfile.skills.slice(0, 12).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-primary/20 bg-primary-light/50 px-2.5 py-1 text-xs text-text-primary"
                >
                  {skill}
                </span>
              ))}
              {candidateProfile.skills.length > 12 && (
                <span className="px-1 py-1 text-xs text-text-muted">
                  +{candidateProfile.skills.length - 12} more
                </span>
              )}
            </div>
          </div>
        )}

        {candidateProfile.projects.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Projects
            </p>
            <ul className="mt-2 space-y-1.5">
              {candidateProfile.projects.slice(0, 3).map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="min-w-0">
                    <span className="font-medium text-text-primary">{p.name}</span>
                    {p.technologies.length > 0 && (
                      <span className="text-text-muted"> — {p.technologies.join(", ")}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-4 text-xs text-text-muted">
          ✓ Profile ready — the AI interviewer will ask about your projects and skills.
        </p>
      </div>
    );
  }

  if (resumeFile && resumeStatus === "error") {
    return (
      <div className="rounded-2xl border border-error/30 bg-surface p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-error-light text-error">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text-primary">{resumeFile.name}</p>
            <p className="mt-0.5 text-xs text-error">{resumeError ?? "Resume processing failed."}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <Button size="sm" onClick={() => uploadThenAnalyze(resumeFile)}>
            <RotateCcw className="h-4 w-4" />
            Retry
          </Button>
          <Button variant="outline" size="sm" onClick={clearResume}>
            <Upload className="h-4 w-4" />
            Choose another file
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setResumeSkipped(true)}>
            Skip resume
          </Button>
        </div>
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
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-text-muted">
          The AI interviewer reads your projects and skills to personalize questions.
        </p>
        <Button variant="ghost" size="sm" onClick={() => setResumeSkipped(true)}>
          Skip resume
        </Button>
      </div>
    </div>
  );
}
