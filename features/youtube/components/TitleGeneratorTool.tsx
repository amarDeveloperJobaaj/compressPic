"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCcw, RotateCcw, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CopyButton,
  HistoryPanel,
  NoteCard,
  SectionCard,
  ShareButton,
} from "./shared";
import { cn } from "@/lib/utils";
import {
  TONES,
  VIDEO_CATEGORIES,
  generateTitles,
  normalizeTopic,
  type Tone,
  type VideoCategory,
} from "../utils/generators";
import { loadHistory, pushHistory, type HistoryEntry } from "../utils/history";

const HISTORY_KEY = "yt-titles";

interface TitleDraft {
  topic: string;
  category: VideoCategory;
  tone: Tone;
  withNumber: boolean;
  withEmoji: boolean;
}

/** Small CTR suggestion shown under each generated title. */
function ctrTip(title: string, score: number): string {
  const hasNumber = /\d/.test(title);
  const hasBracket = /[()|]/.test(title);
  if (score >= 80) return "Strong — keyword and length are in the sweet spot";
  if (!hasNumber) return "Tip: add a number (e.g. \u201c7 ways\u201d) to boost CTR";
  if (!hasBracket) return "Tip: a bracket or separator makes it stand out in the feed";
  return "Tip: sharpen the wording to push the score higher";
}

const TONE_DESCRIPTIONS: Record<Tone, string> = {
  Informative: "Clear, educational phrasing that ranks well.",
  Catchy: "Bold hooks designed to get clicks.",
  Professional: "Polished and credible — great for business channels.",
  "Fun & Casual": "Relaxed, friendly, and personal.",
  Emotional: "Connects through story and feeling.",
  Urgent: "FOMO-driven phrasing that drives action.",
};

export function TitleGeneratorTool() {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState<VideoCategory>("Technology");
  const [tone, setTone] = useState<Tone>("Catchy");
  const [withNumber, setWithNumber] = useState(true);
  const [withEmoji, setWithEmoji] = useState(false);
  const [titles, setTitles] = useState<{ title: string; score: number }[]>([]);
  const [entries, setEntries] = useState<HistoryEntry<TitleDraft>[]>(() =>
    loadHistory<TitleDraft>(HISTORY_KEY)
  );

  const runGenerate = useCallback((draft: TitleDraft) => {
    const generated = generateTitles(
      draft.topic,
      draft.category,
      draft.tone,
      draft.withNumber,
      draft.withEmoji
    );
    setTitles(generated);
    if (normalizeTopic(draft.topic)) {
      setEntries(
        pushHistory<TitleDraft>(HISTORY_KEY, {
          id: `${draft.topic}-${draft.category}-${draft.tone}`.toLowerCase().replace(/\s+/g, "-"),
          label: draft.topic,
          sublabel: `${draft.category} · ${draft.tone} · ${generated.length} titles`,
          data: draft,
        })
      );
    }
  }, []);

  const handleGenerate = useCallback(() => {
    if (!normalizeTopic(topic)) return;
    runGenerate({ topic: normalizeTopic(topic), category, tone, withNumber, withEmoji });
  }, [topic, category, tone, withNumber, withEmoji, runGenerate]);

  const handleReset = useCallback(() => {
    setTopic("");
    setCategory("Technology");
    setTone("Catchy");
    setWithNumber(true);
    setWithEmoji(false);
    setTitles([]);
  }, []);

  const bestScore = titles.length > 0 ? Math.max(...titles.map((t) => t.score)) : 0;

  return (
    <div className="space-y-6">
      <SectionCard
        icon={Type}
        title="Title Settings"
        description="Enter your topic and pick a style — we'll generate 12+ titles with SEO scores."
        actions={
          <div className="flex flex-wrap gap-2">
            <ShareButton title="YouTube Title Generator" />
            <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Video topic / keyword"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="e.g. investing for beginners"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-sm font-medium text-text-primary">Category</p>
              <div className="flex flex-wrap gap-1.5">
                {VIDEO_CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                      category === item
                        ? "border-primary bg-primary-light text-primary"
                        : "border-border bg-background text-text-secondary hover:border-primary/40 hover:text-primary"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-sm font-medium text-text-primary">Tone</p>
              <div className="flex flex-wrap gap-1.5">
                {TONES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTone(item)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                      tone === item
                        ? "border-primary bg-primary-light text-primary"
                        : "border-border bg-background text-text-secondary hover:border-primary/40 hover:text-primary"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-text-muted">{TONE_DESCRIPTIONS[tone]}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={withNumber}
                onChange={(event) => setWithNumber(event.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              Include numbers (listicles)
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={withEmoji}
                onChange={(event) => setWithEmoji(event.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              Add emoji
            </label>
          </div>

          <Button type="button" onClick={handleGenerate} disabled={!normalizeTopic(topic)}>
            <RefreshCcw className="h-4 w-4" /> Generate Titles
          </Button>
        </div>
      </SectionCard>

      {titles.length > 0 && (
        <>
          <NoteCard tone="success">
            Generated {titles.length} titles. Scores reward keyword inclusion, the 30–65 character
            sweet spot, numbers, and power words. Click any title to copy it.
          </NoteCard>

          <div className="grid gap-3 md:grid-cols-2">
            {titles.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="group flex flex-col justify-between gap-3 rounded-2xl border border-border bg-surface/80 p-4 shadow-lg shadow-black/5 backdrop-blur-xl"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold leading-snug text-text-primary">
                      {item.title}
                    </p>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold",
                        item.score >= 80
                          ? "bg-success-light text-success"
                          : item.score >= 60
                            ? "bg-primary-light text-primary"
                            : "bg-amber-500/10 text-amber-600"
                      )}
                    >
                      {item.score}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-text-muted">{item.title.length} chars</p>
                  <p className="mt-1 text-xs text-text-muted">{ctrTip(item.title, item.score)}</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        item.score >= 80 ? "bg-success" : item.score >= 60 ? "bg-primary" : "bg-amber-500"
                      )}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <CopyButton text={item.title} label="Copy" variant="outline" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface/80 p-4">
            <div className="text-sm text-text-secondary">
              Best score:{" "}
              <span className="font-bold text-success">{bestScore}/100</span> · Copy all {titles.length} titles:
            </div>
            <CopyButton text={titles.map((t) => t.title).join("\n")} label="Copy all titles" />
          </div>
        </>
      )}

      {entries.length > 0 && (
        <HistoryPanel<TitleDraft>
          storageKey={HISTORY_KEY}
          entries={entries}
          onEntriesChange={setEntries}
          onLoad={(draft) => {
            setTopic(draft.topic);
            setCategory(draft.category);
            setTone(draft.tone);
            setWithNumber(draft.withNumber);
            setWithEmoji(draft.withEmoji);
            runGenerate(draft);
          }}
        />
      )}
    </div>
  );
}
