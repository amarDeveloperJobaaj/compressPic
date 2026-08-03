"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, ImageDown, Link2, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  HistoryPanel,
  SectionCard,
  ShareButton,
  UrlForm,
} from "./shared";
import {
  copyToClipboard,
  downloadImage,
  fetchVideoMeta,
  getThumbnailOptions,
  parseYouTubeUrl,
  type ThumbnailOption,
  type VideoMeta,
} from "../utils/url";
import { loadHistory, pushHistory, type HistoryEntry } from "../utils/history";

const HISTORY_KEY = "yt-thumbnails";

export function ThumbnailDownloaderTool() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());
  const [entries, setEntries] = useState<HistoryEntry<{ videoId: string }>[]>(() =>
    loadHistory<{ videoId: string }>(HISTORY_KEY)
  );

  const requestRef = useRef(0);

  const markUnavailable = useCallback((key: string) => {
    setUnavailable((prev) => new Set(prev).add(key));
  }, []);

  const loadVideo = useCallback(async (rawUrl: string) => {
    const id = parseYouTubeUrl(rawUrl);
    if (!id) {
      setError("That doesn't look like a valid YouTube URL. Try a watch, shorts, or youtu.be link.");
      return;
    }
    const requestId = ++requestRef.current;
    setError(null);
    setLoading(true);
    setUnavailable(new Set());
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

  const handleReset = useCallback(() => {
    requestRef.current += 1;
    setLoading(false);
    setUrl("");
    setVideoId(null);
    setMeta(null);
    setError(null);
    setUnavailable(new Set());
  }, []);

  const handleSubmit = useCallback(() => {
    if (!url.trim()) return;
    void loadVideo(url);
  }, [url, loadVideo]);

  const options = videoId ? getThumbnailOptions(videoId) : [];

  return (
    <div className="space-y-6">
      <SectionCard
        icon={ImageDown}
        title="Get Thumbnails"
        description="Paste a YouTube link — we'll pull every available thumbnail size."
        actions={
          <div className="flex flex-wrap gap-2">
            <ShareButton title="YouTube Thumbnail Downloader" />
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
          submitLabel={loading ? "Fetching…" : "Get Thumbnails"}
          loading={loading}
          error={error}
          examples={[
            "https://youtu.be/dQw4w9WgXcQ",
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://youtube.com/shorts/dQw4w9WgXcQ",
          ]}
        />
      </SectionCard>

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
                <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-text-muted">
                  <Play className="h-3 w-3" /> {videoId}
                </p>
              </div>
            </motion.div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {options.map((option) => (
              <ThumbnailCard
                key={option.key}
                option={option}
                videoId={videoId}
                isUnavailable={unavailable.has(option.key)}
                onUnavailable={() => markUnavailable(option.key)}
              />
            ))}
          </div>

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
          icon={ImageDown}
          title="No video yet"
          description="Paste a YouTube video link above to preview and download its thumbnails in up to 1280×720 HD."
        />
      )}
    </div>
  );
}

function ThumbnailCard({
  option,
  videoId,
  isUnavailable,
  onUnavailable,
}: {
  option: ThumbnailOption;
  videoId: string;
  isUnavailable: boolean;
  onUnavailable: () => void;
}) {
  const filename = `youtube-thumbnail-${videoId}-${option.key}.jpg`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group overflow-hidden rounded-2xl border border-border bg-surface/80 shadow-lg shadow-black/5 backdrop-blur-xl"
    >
      <div className="relative aspect-video overflow-hidden bg-black/5">
        {isUnavailable ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-background/60 px-4 text-center">
            <ImageDown className="h-6 w-6 text-text-muted" />
            <p className="text-xs text-text-muted">Not available for this video</p>
          </div>
        ) : (
          <img
            src={option.url}
            alt={`${option.label} thumbnail (${option.width}×${option.height})`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={onUnavailable}
            onLoad={(event) => {
              const img = event.currentTarget;
              // Missing sizes fall back to the tiny 120px placeholder — detect it.
              if (option.key !== "default" && img.naturalWidth <= 120) onUnavailable();
            }}
          />
        )}
        <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
          {option.label}
        </span>
        <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
          {option.width}×{option.height}
        </span>
      </div>
      <div className="flex items-center gap-2 p-3">
        <Button
          type="button"
          variant="primary"
          size="sm"
          className="flex-1"
          disabled={isUnavailable}
          onClick={() => void downloadImage(option.url, filename)}
        >
          <Download className="h-4 w-4" /> Download
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label={`Copy image URL for ${option.label}`}
          disabled={isUnavailable}
          onClick={() => void copyToClipboard(option.url)}
        >
          <Link2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
