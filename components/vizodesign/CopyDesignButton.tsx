"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { Design } from "@/lib/vizodesign/types";

interface CopyDesignButtonProps {
  design: Design;
}

export function CopyDesignButton({ design }: CopyDesignButtonProps) {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(design.design_markdown);
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
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
        aria-label={`Copy DESIGN.md for ${design.name}`}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy DESIGN.md
          </>
        )}
      </button>
      {toast && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg">
          DESIGN.md copied to clipboard
        </div>
      )}
    </div>
  );
}
