"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Captions, Download, FileText, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CopyButton,
  EmptyState,
  HistoryPanel,
  NoteCard,
  SectionCard,
  ShareButton,
  StatPill,
  UrlForm,
} from "./shared";
import { cn } from "@/lib/utils";
import {
  downloadText,
  fetchTranscript,
  parseYouTubeUrl,
  type TranscriptResult,
} from "../utils/url";
import { loadHistory, pushHistory, type HistoryEntry } from "../utils/history";

const HISTORY_KEY = "yt-transcripts";

type ViewMode = "timestamps" | "plain";

export function TranscriptTool() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [view, setView] = useState<ViewMode>("timestamps");
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<HistoryEntry<{ videoId: string }>[]>(() =>
    loadHistory<{ videoId: string }>(HISTORY_KEY)
  );

  const requestRef = useRef(0);

  const loadVideo = useCallback(async (rawUrl: string) => {
    const id = parseYouTubeUrl(rawUrl);
    if (!id) {
      setError("That doesn't look like a valid YouTube URL.");
      return;
    }
    const requestId = ++requestRef.current;
    setError(null);
    setLoading(true);
    setVideoId(id);
    setQuery("");
    const fetched = await fetchTranscript(id);
    if (requestRef.current !== requestId) return; // stale response — ignore
    setResult(fetched);
    if (fetched.segments.length > 0) {
      setEntries(
        pushHistory<{ videoId: string }>(HISTORY_KEY, {
          id,
          label: `Video transcript (${id.slice(0, 8)}…)`,
          sublabel: `${fetched.segments.length} segments`,
          data: { videoId: id },
        })
      );
    }
    setLoading(false);
  }, []);

  const handleReset = useCallback(() => {
    requestRef.current += 1;
    setLoading(false);
    setUrl("");
    setVideoId(null);
    setResult(null);
    setQuery("");
    setError(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!url.trim()) return;
    void loadVideo(url);
  }, [url, loadVideo]);

  const filteredSegments = useMemo(() => {
    if (!result) return [];
    const q = query.trim().toLowerCase();
    if (!q) return result.segments;
    return result.segments.filter((segment) => segment.text.toLowerCase().includes(q));
  }, [result, query]);

  const plainText = useMemo(() => {
    if (!result) return "";
    return result.segments.map((segment) => segment.text).join(" ");
  }, [result]);

  const timestampedText = useMemo(() => {
    if (!result) return "";
    return result.segments.map((segment) => `[${segment.time}] ${segment.text}`).join("\n");
  }, [result]);

  const exportText = view === "timestamps" ? timestampedText : plainText;
  const wordCount = useMemo(
    () => (result ? result.segments.reduce((sum, s) => sum + s.text.split(/\s+/).length, 0) : 0),
    [result]
  );

  const downloadPdf = useCallback(() => {
    if (!result) return;
    void import("jspdf").then(({ jsPDF }) => {
      const doc = new jsPDF();
      doc.setFontSize(11);
      let y = 14;
      for (const segment of result.segments) {
        const line = `[${segment.time}] ${segment.text}`;
        const wrapped = doc.splitTextToSize(line, 190);
        for (const part of wrapped as string[]) {
          if (y > 280) {
            doc.addPage();
            y = 14;
          }
          doc.text(part, 10, y);
          y += 5.5;
        }
      }
      doc.save(`youtube-transcript-${videoId}.pdf`);
    });
  }, [result, videoId]);

  return (
    <div className="space-y-6">
      <SectionCard
        icon={Captions}
        title="Get Transcript"
        description="Works for any video with captions enabled by the uploader."
        actions={
          <div className="flex flex-wrap gap-2">
            <ShareButton title="YouTube Transcript Extractor" />
            <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
        }
      >
        <UrlForm
          value={url}
          onChange={setUrl}
          onSubmit={handleSubmit}
          submitLabel={loading ? "Fetching…" : "Get Transcript"}
          loading={loading}
          error={error}
          examples={[
            "https://youtu.be/dQw4w9WgXcQ",
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          ]}
        />
      </SectionCard>

      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-surface/80 py-10">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-text-secondary">Fetching the transcript…</p>
        </div>
      )}

      {result && result.error && (
        <NoteCard tone="warning">{result.error}</NoteCard>
      )}

      {result && result.segments.length > 0 && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatPill label="Segments" value={result.segments.length} />
            <StatPill label="Words" value={wordCount.toLocaleString()} />
            <StatPill label="Characters" value={plainText.length.toLocaleString()} tone="primary" />
          </div>

          <SectionCard title="Transcript" description="Switch views, search, and export.">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex rounded-xl border border-border bg-background p-1" role="tablist" aria-label="Transcript view">
                {(
                  [
                    { key: "timestamps", label: "Timestamp view" },
                    { key: "plain", label: "Plain text" },
                  ] as { key: ViewMode; label: string }[]
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={view === tab.key}
                    aria-controls="transcript-panel"
                    onClick={() => setView(tab.key)}
                    className={cn(
                      "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
                      view === tab.key
                        ? "bg-primary text-white shadow"
                        : "text-text-secondary hover:text-primary"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <CopyButton text={exportText} label="Copy" />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => downloadText(timestampedText, `youtube-transcript-${videoId}.txt`)}
                >
                  <Download className="h-4 w-4" /> TXT
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={downloadPdf}>
                  <FileText className="h-4 w-4" /> PDF
                </Button>
              </div>
            </div>

            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the transcript…"
                aria-label="Search transcript"
                className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
            {query.trim() && (
              <p className="mt-2 text-xs text-text-muted">
                {filteredSegments.length} matching segment{filteredSegments.length === 1 ? "" : "s"}
              </p>
            )}

            <div
              id="transcript-panel"
              role="tabpanel"
              aria-label="Transcript content"
              className="mt-4 max-h-[28rem] overflow-y-auto rounded-xl border border-border bg-background/60"
            >
              {view === "timestamps" ? (
                <ul className="divide-y divide-border/60">
                  {filteredSegments.map((segment, index) => (
                    <li key={index} className="flex gap-3 px-4 py-2.5 text-sm leading-relaxed">
                      <span className="shrink-0 rounded-md bg-primary-light px-1.5 py-0.5 font-mono text-xs text-primary">
                        {segment.time}
                      </span>
                      <span className="text-text-secondary">{segment.text}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-4 text-sm leading-relaxed text-text-secondary">
                  {filteredSegments.map((segment) => segment.text).join(" ")}
                </div>
              )}
              {filteredSegments.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-text-muted">No matches found.</p>
              )}
            </div>
          </SectionCard>
        </>
      )}

      {videoId && !loading && !result?.error && result?.segments.length === 0 && (
        <EmptyState
          icon={Captions}
          title="No transcript found"
          description="This video likely has captions disabled. Try another video with captions enabled."
        />
      )}

      {!videoId && !loading && (
        <EmptyState
          icon={Captions}
          title="No transcript yet"
          description="Paste a YouTube video link above to extract its transcript with timestamps."
        />
      )}

      {entries.length > 0 && (
        <HistoryPanel<{ videoId: string }>
          storageKey={HISTORY_KEY}
          entries={entries}
          onEntriesChange={setEntries}
          onLoad={(data) => void loadVideo(`https://youtu.be/${data.videoId}`)}
        />
      )}
    </div>
  );
}
