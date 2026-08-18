"use client";

import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Explicit recording consent (§31) — shown BEFORE the interview starts and
 * stored with the session (config.recordingConsent). Never silently record:
 * the user is told what is captured, why, how long it's kept, and that it
 * can be deleted.
 */
export function RecordingConsent({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background px-4 py-3.5 transition-colors",
        checked ? "border-success/40 bg-success-light/20" : "hover:border-primary/40",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
        aria-label="I agree to recording and processing"
      />
      <div>
        <p className="flex items-center gap-1.5 text-sm font-semibold text-text-primary">
          <ShieldCheck className="h-4 w-4 text-primary" />
          I agree to recording and processing
        </p>
        <p className="mt-1 text-xs leading-relaxed text-text-secondary">
          Your interview may be recorded for analysis. Recording is used only to power your
          feedback, is kept privately on your account, and can be deleted at any time.
        </p>
      </div>
    </label>
  );
}
