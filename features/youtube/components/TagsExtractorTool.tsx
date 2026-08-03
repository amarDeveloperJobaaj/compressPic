"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, RotateCcw, Tags, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "./textarea";
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
import { downloadText, fetchVideoMeta, parseYouTubeUrl } from "../utils/url";
import { extractKeywords } from "../utils/generators";
import { loadHistory, pushHistory, type HistoryEntry } from "../utils/history";

const HISTORY_KEY = "yt-tags";

interface TagAnalysis {
  count: number;
  chars: number;
  duplicates: string[];
  uniqueCount: number;
}

function analyzeTags(raw: string): TagAnalysis {
  const tags = raw
    .split(/[,\n]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
  const seen = new Map<string, number>();
  for (const tag of tags) seen.set(tag.toLowerCase(), (seen.get(tag.toLowerCase()) ?? 0) + 1);
  const duplicates = [...seen.entries()]
    .filter(([, count]) => count > 1)
    .map(([tag]) => tag);
  return {
    count: tags.length,
    chars: tags.join(",").length,
    duplicates,
    uniqueCount: seen.size,
  };
}

export function TagsExtractorTool() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualTags, setManualTags] = useState("");
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
    const meta = await fetchVideoMeta(id);
    if (requestRef.current !== requestId) return; // stale response — ignore
    setVideoTitle(meta.title);
    setEntries(
      pushHistory<{ videoId: string }>(HISTORY_KEY, {
        id,
        label: meta.title,
        sublabel: `by ${meta.author}`,
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
    setVideoTitle("");
    setManualTags("");
    setError(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!url.trim()) return;
    void loadVideo(url);
  }, [url, loadVideo]);

  const suggestedTags = useMemo(() => {
    if (!videoTitle) return [];
    const base = extractKeywords(videoTitle, 12);
    return [...new Set([videoTitle.toLowerCase(), "youtube", "video", ...base])].slice(0, 15);
  }, [videoTitle]);

  const manualAnalysis = useMemo(() => analyzeTags(manualTags), [manualTags]);
  const allTags = suggestedTags.join(", ");

  return (
    <div className="space-y-6">
      <SectionCard
        icon={Tags}
        title="Video Tags"
        description="Paste a link to generate keyword tag suggestions from the video title."
        actions={
          <div className="flex flex-wrap gap-2">
            <ShareButton title="YouTube Tags Extractor" />
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
          submitLabel={loading ? "Analyzing…" : "Analyze Video"}
          loading={loading}
          error={error}
          examples={["https://youtu.be/dQw4w9WgXcQ", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"]}
        />
      </SectionCard>

      <NoteCard tone="info">
        YouTube doesn&apos;t expose a video&apos;s private tags through any public API. This tool generates
        smart keyword suggestions from the video&apos;s public title, and lets you paste your own tags to
        check count, character budget, and duplicates.
      </NoteCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard icon={Wand2} title="Suggested Tags" description="From the video title — copy these into YouTube Studio.">
          {suggestedTags.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag, index) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="inline-flex items-center rounded-full border border-primary/25 bg-primary-light/50 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <CopyButton text={allTags} label="Copy all tags" />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => downloadText(allTags, "youtube-tags.txt")}
                >
                  <Download className="h-4 w-4" /> TXT
                </Button>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <StatPill label="Tags" value={suggestedTags.length} />
                <StatPill label="Characters" value={allTags.length} />
                <StatPill label="Description budget" value={`${Math.max(0, 500 - allTags.length)} left`} tone="primary" />
              </div>
            </>
          ) : (
            <EmptyState
              icon={Tags}
              title="No suggestions yet"
              description="Analyze a video above to generate keyword tag suggestions from its title."
            />
          )}
        </SectionCard>

        <SectionCard
          icon={Tags}
          title="Paste Your Own Tags"
          description="Comma- or line-separated — get count, character budget, and duplicates."
        >
          <Textarea
            value={manualTags}
            onChange={(event) => setManualTags(event.target.value)}
            placeholder={"tag one, tag two\ntag three"}
            rows={6}
            label="Existing tags"
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <StatPill label="Total tags" value={manualAnalysis.count} />
            <StatPill label="Characters" value={manualAnalysis.chars} />
            <StatPill
              label="Unique"
              value={`${manualAnalysis.uniqueCount}/${manualAnalysis.count || 0}`}
              tone={manualAnalysis.duplicates.length > 0 ? "default" : "primary"}
            />
          </div>
          {manualAnalysis.duplicates.length > 0 && (
            <NoteCard tone="warning">
              Duplicate tags found: {manualAnalysis.duplicates.join(", ")} — remove them to save space.
            </NoteCard>
          )}
          {manualTags.trim() && (
            <div className="mt-4 flex flex-wrap gap-2">
              <CopyButton text={manualTags} label="Copy tags" />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => downloadText(manualTags, "my-youtube-tags.txt")}
              >
                <Download className="h-4 w-4" /> TXT
              </Button>
            </div>
          )}
        </SectionCard>
      </div>

      {videoId && (
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
