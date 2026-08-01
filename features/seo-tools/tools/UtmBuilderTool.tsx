"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Download, History, QrCode, Trash2 } from "lucide-react";
import QRCode from "qrcode";
import { ToolPanel } from "@/features/devtools/components/ToolPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/features/devtools/utils/download";
import { cn } from "@/lib/utils";

interface UtmFields {
  baseUrl: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}

const DEFAULTS: UtmFields = {
  baseUrl: "https://compresspix.com/",
  source: "facebook",
  medium: "cpc",
  campaign: "spring-sale",
  term: "",
  content: "",
};

const STORAGE_KEY = "compresspix-utm-history";

interface HistoryEntry {
  url: string;
  createdAt: number;
}

function buildUtmUrl(f: UtmFields): string {
  const params = new URLSearchParams();
  if (f.source) params.set("utm_source", f.source);
  if (f.medium) params.set("utm_medium", f.medium);
  if (f.campaign) params.set("utm_campaign", f.campaign);
  if (f.term) params.set("utm_term", f.term);
  if (f.content) params.set("utm_content", f.content);
  const qs = params.toString();
  if (!qs) return f.baseUrl;
  const base = f.baseUrl || "";
  return base + (base.includes("?") ? "&" : "?") + qs;
}

export function UtmBuilderTool() {
  const [fields, setFields] = useState<UtmFields>(DEFAULTS);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  // Load history from localStorage on mount (deferred so it never runs during SSR)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setHistory(JSON.parse(raw));
      } catch {
        // ignore corrupt storage
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const finalUrl = useMemo(() => buildUtmUrl(fields), [fields]);

  // Regenerate the QR code whenever the URL changes
  useEffect(() => {
    if (!finalUrl) return;
    let cancelled = false;
    QRCode.toDataURL(finalUrl, {
      width: 220,
      margin: 2,
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [finalUrl]);

  const set = (key: keyof UtmFields, value: string) =>
    setFields((f) => ({ ...f, [key]: value }));

  const saveToHistory = () => {
    if (!finalUrl) return;
    const next = [{ url: finalUrl, createdAt: Date.now() }, ...history].slice(0, 12);
    setHistory(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage full or unavailable — ignore
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "campaign-qr.png";
    link.click();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Builder */}
      <ToolPanel title="Campaign Parameters" description="Fill in the campaign details — the URL updates live.">
        <div className="space-y-4">
          <Input label="Base URL" value={fields.baseUrl} onChange={(e) => set("baseUrl", e.target.value)} placeholder="https://example.com/landing" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Source (utm_source)" value={fields.source} onChange={(e) => set("source", e.target.value)} placeholder="facebook, google, newsletter" />
            <Input label="Medium (utm_medium)" value={fields.medium} onChange={(e) => set("medium", e.target.value)} placeholder="cpc, email, social" />
          </div>
          <Input label="Campaign (utm_campaign)" value={fields.campaign} onChange={(e) => set("campaign", e.target.value)} placeholder="spring-sale" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Term (utm_term, optional)" value={fields.term} onChange={(e) => set("term", e.target.value)} placeholder="paid keyword" />
            <Input label="Content (utm_content, optional)" value={fields.content} onChange={(e) => set("content", e.target.value)} placeholder="ad-variant-a" />
          </div>
        </div>
      </ToolPanel>

      {/* Output */}
      <div className="space-y-6">
        <ToolPanel
          title="Final URL"
          description="Copy the full campaign URL or save it to history."
          actions={
            <>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(finalUrl)}>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
              <Button variant="secondary" size="sm" onClick={saveToHistory}>
                <History className="h-3.5 w-3.5" />
                Save
              </Button>
            </>
          }
        >
          <div className="break-all rounded-xl border border-border bg-background p-4 font-mono text-[13px] leading-relaxed text-text-primary">
            {finalUrl || "Enter a base URL to start…"}
          </div>

          {/* QR code */}
          <p className="mt-3 rounded-lg border border-border bg-background px-3 py-2 text-xs text-text-muted">
          Shorten-ready: paste this URL into Bitly, TinyURL, or your own shortener before publishing — the UTM parameters survive shortening.
        </p>
        <div className="mt-4 flex items-start gap-4 rounded-xl border border-border bg-background p-4">
            <div className="flex h-[110px] w-[110px] shrink-0 items-center justify-center rounded-lg border border-border bg-white">
              {qrDataUrl && finalUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrDataUrl} alt="Campaign QR code" className="h-full w-full object-contain" />
              ) : (
                <QrCode className="h-8 w-8 text-text-muted" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">QR Code</p>
              <p className="mt-1 text-xs text-text-muted">
                Scan this code to open the campaign URL — perfect for posters, cards, and slides.
              </p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={downloadQr} disabled={!qrDataUrl}>
                <Download className="h-3.5 w-3.5" />
                Download PNG
              </Button>
            </div>
          </div>
        </ToolPanel>

        {/* History */}
        <ToolPanel
          title="Campaign History"
          description="Recently saved links (stored locally in your browser)."
          actions={
            history.length > 0 ? (
              <Button variant="ghost" size="sm" onClick={clearHistory}>
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </Button>
            ) : undefined
          }
        >
          {history.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-text-muted">
              No saved campaigns yet — click Save on a URL to keep it here.
            </p>
          ) : (
            <ul className="space-y-2">
              {history.map((entry) => (
                <li
                  key={entry.url}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2"
                >
                  <span className="break-all font-mono text-xs text-text-secondary">{entry.url}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(entry.url)}
                    aria-label="Copy URL"
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-primary-light hover:text-primary"
                    )}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ToolPanel>
      </div>
    </div>
  );
}
