"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clapperboard,
  Download,
  FileAudio,
  FileVideo,
  RotateCcw,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
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
  downloadImage,
  fetchTranscript,
  fetchVideoMeta,
  getThumbnailOptions,
  parseYouTubeUrl,
  type VideoMeta,
} from "../utils/url";
import {
  isDownloaderConfigured,
  requestDownload,
  type DownloadFormat,
} from "../services/downloader";
import { loadHistory, pushHistory, type HistoryEntry } from "../utils/history";

const HISTORY_KEY = "yt-video-downloads";

const FORMAT_TABS: { key: DownloadFormat; label: string; icon: LucideIcon }[] = [
  { key: "mp4", label: "Video (MP4)", icon: FileVideo },
  { key: "mp3", label: "Audio (MP3)", icon: FileAudio },
  { key: "m4a", label: "Audio (M4A)", icon: FileAudio },
];

const QUALITIES: Record<DownloadFormat, string[]> = {
  mp4: ["1080p", "720p", "480p", "360p"],
  mp3: ["320kbps", "192kbps", "128kbps"],
  m4a: ["256kbps", "128kbps"],
};

const TRANSCRIPT_PREVIEW_LINES = 8;

export function VideoDownloaderTool() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [format, setFormat] = useState<DownloadFormat>("mp4");
  const [quality, setQuality] = useState("720p");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const [previewSegments, setPreviewSegments] = useState<string[]>([]);
  const [entries, setEntries] = useState<HistoryEntry<{ videoId: string }>[]>(() =>
    loadHistory<{ videoId: string }>(HISTORY_KEY)
  );

  const requestRef = useRef(0);
  const transcriptRef = useRef(0);
  const configured = useMemo(() => isDownloaderConfigured(), []);

  const loadVideo = useCallback(async (rawUrl: string) => {
    const id = parseYouTubeUrl(rawUrl);
    if (!id) {
      setError("That doesn't look like a valid YouTube URL. Try a watch, shorts, or youtu.be link.");
      return;
    }
    const requestId = ++requestRef.current;
    setError(null);
    setLoading(true);
    setDownloadError(null);
    setShowTranscript(false);
    setTranscriptError(null);
    setPreviewSegments([]);
    setVideoId(id);
    const fetched = await fetchVideoMeta(id);
    if (requestRef.current !== requestId) return; // stale response — ignore
    setMeta(fetched);
    setEntries(
      pushHistory<{ videoId: string }>(HISTORY_KEY, {
        id,
        label: fetched.title,
        sublabel: `by ${fetched.author}`,
        data: { videoId: id },
      })
    );
    setLoading(false);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!url.trim()) return;
    void loadVideo(url);
  }, [url, loadVideo]);

  const handleReset = useCallback(() => {
    requestRef.current += 1;
    transcriptRef.current += 1;
    setLoading(false);
    setDownloading(false);
    setTranscriptLoading(false);
    setUrl("");
    setVideoId(null);
    setMeta(null);
    setFormat("mp4");
    setQuality("720p");
    setError(null);
    setDownloadError(null);
    setShowTranscript(false);
    setTranscriptError(null);
    setPreviewSegments([]);
  }, []);

  const handleFormatChange = useCallback((next: DownloadFormat) => {
    setFormat(next);
    setQuality(QUALITIES[next][0]);
    setDownloadError(null);
  }, []);

  const loadTranscriptPreview = useCallback(async () => {
    if (!videoId) return;
    if (showTranscript) {
      // Toggle off — cancel any in-flight request and clear state.
      transcriptRef.current += 1;
      setShowTranscript(false);
      setTranscriptError(null);
      setPreviewSegments([]);
      return;
    }
    setShowTranscript(true);
    setTranscriptLoading(true);
    setTranscriptError(null);
    setPreviewSegments([]);
    const requestId = ++transcriptRef.current;
    try {
      const result = await fetchTranscript(videoId);
      if (transcriptRef.current !== requestId) return; // stale response — ignore
      if (result.error) {
        setTranscriptError(result.error);
      } else {
        setPreviewSegments(result.segments.slice(0, TRANSCRIPT_PREVIEW_LINES).map((s) => s.text));
      }
    } catch {
      if (transcriptRef.current !== requestId) return;
      setTranscriptError("An unexpected error occurred while fetching the transcript.");
    } finally {
      if (transcriptRef.current === requestId) setTranscriptLoading(false);
    }
  }, [videoId, showTranscript]);

  const handleDownload = useCallback(async () => {
    if (!videoId || !configured) return;
    setDownloading(true);
    setDownloadError(null);
    const res = await requestDownload({ videoId, format, quality });
    setDownloading(false);
    if (!res.ok || !res.url) {
      setDownloadError(res.message ?? "The download could not be prepared.");
      return;
    }
    const a = document.createElement("a");
    a.href = res.url;
    a.download = `youtube-${videoId}.${format}`;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [videoId, configured, format, quality]);

  const thumbnailOptions = videoId ? getThumbnailOptions(videoId) : [];
  const standardThumb = thumbnailOptions.find((o) => o.key === "standard");
  const maxresThumb = thumbnailOptions.find((o) => o.key === "maxres");

  return (
    <div className="space-y-6">
      <SectionCard
        icon={Clapperboard}
        title="Video Downloader"
        description="Paste a link, pick a format and quality, and save the video or audio."
        actions={
          <div className="flex flex-wrap gap-2">
            <ShareButton title="YouTube Video Downloader" />
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
          submitLabel={loading ? "Fetching…" : "Get Video Info"}
          loading={loading}
          error={error}
          examples={[
            "https://youtu.be/dQw4w9WgXcQ",
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://youtube.com/shorts/dQw4w9WgXcQ",
          ]}
        />
      </SectionCard>

      {!configured && (
        <NoteCard tone="warning">
          The download service isn&apos;t configured on this site yet, so the Download button stays
          disabled — this tool never bypasses YouTube&apos;s access controls. You can still use every
          other feature: video info, HD thumbnails, transcript preview, and share links.
        </NoteCard>
      )}

      {videoId && (
        <>
          {meta && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface/80 p-5 shadow-xl shadow-black/5 backdrop-blur-xl sm:flex-row sm:items-center"
            >
              <img
                src={meta.thumbnailUrl}
                alt={`Thumbnail preview for ${meta.title}`}
                width={160}
                height={90}
                className="w-full max-w-[240px] rounded-lg object-cover sm:w-40"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold leading-snug text-text-primary">{meta.title}</p>
                <p className="mt-1 text-sm text-text-secondary">by {meta.author}</p>
                <p className="mt-1 font-mono text-xs text-text-muted">{videoId}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <CopyButton text={`https://youtu.be/${videoId}`} label="Copy link" />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={!standardThumb}
                    onClick={() =>
                      standardThumb &&
                      void downloadImage(standardThumb.url, `youtube-thumbnail-${videoId}-hd.jpg`)
                    }
                  >
                    <Download className="h-4 w-4" /> Thumbnail (SD)
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={!maxresThumb}
                    onClick={() =>
                      maxresThumb &&
                      void downloadImage(maxresThumb.url, `youtube-thumbnail-${videoId}-maxres.jpg`)
                    }
                  >
                    <Download className="h-4 w-4" /> Thumbnail (Max HD)
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          <SectionCard
            icon={Download}
            title="Download"
            description="Choose your format and quality, then start the download."
          >
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Output format">
              {FORMAT_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={format === tab.key}
                    aria-controls="download-panel"
                    onClick={() => handleFormatChange(tab.key)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                      format === tab.key
                        ? "border-primary bg-primary-light text-primary shadow"
                        : "border-border bg-background text-text-secondary hover:border-primary/40 hover:text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" /> {tab.label}
                  </button>
                );
              })}
            </div>

            <div id="download-panel" role="tabpanel" aria-label="Download options" className="mt-5">
            <p className="mb-2 text-sm font-medium text-text-primary">Quality</p>
            <div className="flex flex-wrap gap-2">
              {QUALITIES[format].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setQuality(item);
                    setDownloadError(null);
                  }}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                    quality === item
                      ? "border-primary bg-primary-light text-primary"
                      : "border-border bg-background text-text-secondary hover:border-primary/40 hover:text-primary"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                size="lg"
                disabled={!configured || downloading}
                onClick={() => void handleDownload()}
                className="sm:w-auto"
              >
                {downloading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Preparing…
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" /> Download {format.toUpperCase()} · {quality}
                  </>
                )}
              </Button>
              <p className="text-xs text-text-muted">
                File size depends on the video&apos;s length and the quality you pick.
              </p>
            </div>

            {downloadError && (
              <p className="mt-3 text-sm text-error" role="alert">
                {downloadError}
              </p>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <StatPill label="Format" value={format.toUpperCase()} />
              <StatPill label="Quality" value={quality} tone="primary" />
              <StatPill label="Service" value={configured ? "Connected" : "Not configured"} />
            </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={FileVideo}
            title="Transcript Preview"
            description="Peek at the captions before you save — full version lives in the Transcript tool."
            actions={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void loadTranscriptPreview()}
                aria-expanded={showTranscript}
              >
                {showTranscript ? "Hide preview" : "Preview transcript"}
              </Button>
            }
          >
            {showTranscript ? (
              transcriptLoading ? (
                <div className="flex items-center gap-3 rounded-xl bg-background/60 px-4 py-6">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="text-sm text-text-secondary">Loading transcript…</p>
                </div>
              ) : transcriptError ? (
                <p className="rounded-xl bg-background/60 px-4 py-6 text-sm text-text-muted">
                  {transcriptError}
                </p>
              ) : previewSegments.length > 0 ? (
                <div className="space-y-2">
                  {previewSegments.map((segment, index) => (
                    <p key={index} className="text-sm leading-relaxed text-text-secondary">
                      {segment}
                    </p>
                  ))}
                  <p className="pt-2 text-xs text-text-muted">
                    Showing the first {TRANSCRIPT_PREVIEW_LINES} lines — open the{" "}
                    <Link href="/youtube-transcript" className="font-medium text-primary hover:underline">
                      Transcript Extractor
                    </Link>{" "}
                    for the full text.
                  </p>
                </div>
              ) : (
                <p className="rounded-xl bg-background/60 px-4 py-6 text-sm text-text-muted">
                  No transcript available — captions may be disabled for this video.
                </p>
              )
            ) : (
              <p className="text-sm text-text-muted">
                Toggle the preview to see the video&apos;s public captions, if available.
              </p>
            )}
          </SectionCard>

          <HistoryPanel<{ videoId: string }>
            storageKey={HISTORY_KEY}
            entries={entries}
            onEntriesChange={setEntries}
            onLoad={(data) => void loadVideo(`https://youtu.be/${data.videoId}`)}
          />
        </>
      )}

      {!videoId && !loading && (
        <EmptyState
          icon={Clapperboard}
          title="No video yet"
          description="Paste a YouTube link above to load its info, pick a format and quality, and prepare your download."
        />
      )}

      <p className="flex items-start gap-2 text-xs text-text-muted">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Only download videos you own or have permission to use. Respect copyright and YouTube&apos;s
        Terms of Service.
      </p>
    </div>
  );
}
