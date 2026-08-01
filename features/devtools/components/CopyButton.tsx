"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { copyToClipboard } from "../utils/download";

interface CopyButtonProps {
  /** Text to copy when clicked. */
  text: string;
  className?: string;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  /** Accessible name override (defaults to the label). */
  ariaLabel?: string;
}

/** Copy-to-clipboard button with a brief "Copied!" confirmation state. */
export function CopyButton({
  text,
  className,
  label = "Copy",
  disabled = false,
  size = "sm",
  ariaLabel,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (!ok) return;
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled || !text}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border font-medium transition-all",
        size === "sm" ? "h-9 px-3 text-xs" : "h-10 px-4 text-sm",
        copied
          ? "border-success/40 bg-success-light text-success"
          : "border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-primary",
        "disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97]",
        className
      )}
      aria-label={copied ? "Copied" : (ariaLabel ?? label)}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {/* Icon-only buttons (empty label) keep their fixed size when copied. */}
      {label ? (copied ? "Copied!" : label) : null}
    </button>
  );
}
