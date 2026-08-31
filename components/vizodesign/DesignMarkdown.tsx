"use client";

import { useState } from "react";
import { Copy, Download, Check } from "lucide-react";

interface DesignMarkdownProps {
  markdown: string;
  designName: string;
}

export function DesignMarkdown({ markdown, designName }: DesignMarkdownProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${designName.toLowerCase().replace(/\s+/g, "-")}-design.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <span className="text-xs font-semibold text-text-muted">DESIGN.md</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/30 hover:text-primary"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/30 hover:text-primary"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </button>
        </div>
      </div>
      <div className="max-h-[600px] overflow-auto p-6">
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-text-primary">
          {markdown}
        </pre>
      </div>
    </div>
  );
}
