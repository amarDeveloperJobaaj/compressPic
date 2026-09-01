"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { Design } from "@/lib/vizodesign/types";

interface CopyPromptButtonProps {
  design: Design;
}

export function CopyPromptButton({ design }: CopyPromptButtonProps) {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(design.ai_prompt);
      setCopied(true);
      setToast(true);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setToast(false), 3000);
    } catch {
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/20 bg-transparent px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:border-primary hover:bg-primary-light/50 active:scale-[0.98]"
        aria-label={`Copy AI prompt for ${design.name}`}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy AI Prompt
          </>
        )}
      </button>
      {toast && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg">
          AI prompt copied to clipboard
        </div>
      )}
    </div>
  );
}
