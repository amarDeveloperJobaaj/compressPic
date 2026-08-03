"use client";

import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlignLeft, Download, RotateCcw, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CopyButton,
  HistoryPanel,
  NoteCard,
  SectionCard,
  ShareButton,
  StatPill,
} from "./shared";
import { cn } from "@/lib/utils";
import {
  TONES,
  analyzeText,
  generateDescription,
  normalizeTopic,
  type DescriptionDraft,
  type Tone,
} from "../utils/generators";
import { loadHistory, pushHistory, type HistoryEntry } from "../utils/history";
import { downloadText } from "../utils/url";

const HISTORY_KEY = "yt-descriptions";

const CTA_OPTIONS = [
  { value: "subscribe", label: "Subscribe" },
  { value: "comment", label: "Ask for comments" },
  { value: "link", label: "Link in description" },
  { value: "none", label: "No CTA" },
] as const;

type CtaValue = (typeof CTA_OPTIONS)[number]["value"];

interface DescriptionDraftState {
  topic: string;
  keywords: string;
  cta: CtaValue;
  includeHashtags: boolean;
  tone: Tone;
}

export function DescriptionGeneratorTool() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [cta, setCta] = useState<CtaValue>("subscribe");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [tone, setTone] = useState<Tone>("Informative");
  const [draft, setDraft] = useState<DescriptionDraft | null>(null);
  const [entries, setEntries] = useState<HistoryEntry<DescriptionDraftState>[]>(() =>
    loadHistory<DescriptionDraftState>(HISTORY_KEY)
  );

  const runGenerate = useCallback((state: DescriptionDraftState) => {
    const generated = generateDescription(
      state.topic,
      state.keywords,
      state.cta,
      state.includeHashtags,
      state.tone
    );
    setDraft(generated);
    if (normalizeTopic(state.topic)) {
      setEntries(
        pushHistory<DescriptionDraftState>(HISTORY_KEY, {
          id: state.topic.toLowerCase().replace(/\s+/g, "-"),
          label: state.topic,
          sublabel: `${generated.text.length} chars · ${state.tone}`,
          data: state,
        })
      );
    }
  }, []);

  const handleGenerate = useCallback(() => {
    if (!normalizeTopic(topic)) return;
    runGenerate({ topic: normalizeTopic(topic), keywords, cta, includeHashtags, tone });
  }, [topic, keywords, cta, includeHashtags, tone, runGenerate]);

  const handleReset = useCallback(() => {
    setTopic("");
    setKeywords("");
    setCta("subscribe");
    setIncludeHashtags(true);
    setTone("Informative");
    setDraft(null);
  }, []);

  const analysis = useMemo(() => (draft ? analyzeText(draft.text) : null), [draft]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          icon={Wand2}
          title="Description Settings"
          description="Tell us about the video — we'll write an SEO-ready description."
          actions={
            <div className="flex flex-wrap gap-2">
              <ShareButton title="YouTube Description Generator" />
              <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Video topic"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="e.g. 5 productivity apps I use daily"
            />
            <Input
              label="Keywords (comma separated)"
              value={keywords}
              onChange={(event) => setKeywords(event.target.value)}
              placeholder="productivity apps, time management, focus"
            />

            <div>
              <p className="mb-1.5 text-sm font-medium text-text-primary">Call to action</p>
              <div className="flex flex-wrap gap-1.5">
                {CTA_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setCta(option.value)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                      cta === option.value
                        ? "border-primary bg-primary-light text-primary"
                        : "border-border bg-background text-text-secondary hover:border-primary/40 hover:text-primary"
                    )}
                  >
                    {option.label}
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
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={includeHashtags}
                onChange={(event) => setIncludeHashtags(event.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              Include hashtag suggestions
            </label>

            <Button type="button" onClick={handleGenerate} disabled={!normalizeTopic(topic)}>
              <Wand2 className="h-4 w-4" /> Generate Description
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          icon={AlignLeft}
          title="Preview"
          description="Live preview of your generated description."
          actions={
            draft && (
              <div className="flex flex-wrap gap-2">
                <CopyButton text={draft.text} label="Copy" />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    downloadText(
                      draft.text,
                      `youtube-description-${normalizeTopic(topic).replace(/\s+/g, "-") || "video"}.txt`
                    )
                  }
                >
                  <Download className="h-4 w-4" /> TXT
                </Button>
              </div>
            )
          }
        >
          {draft ? (
            <div className="space-y-4">
              {analysis && (
                <div className="grid gap-3 sm:grid-cols-3">
                  <StatPill label="Characters" value={analysis.chars.toLocaleString()} />
                  <StatPill label="Words" value={analysis.words.toLocaleString()} />
                  <StatPill
                    label="Visible in search"
                    value={`${analysis.visibleChars}/157`}
                    tone={analysis.visibleChars >= 130 ? "primary" : "default"}
                  />
                </div>
              )}

              <div className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-xl border border-border bg-background/60 p-4 font-mono text-[13px] leading-relaxed text-text-secondary">
                {draft.text}
              </div>

              {draft.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {draft.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary-light/60 px-2.5 py-1 text-xs font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <NoteCard tone="info">
                The first ~157 characters are visible in search results — keep your main keyword near
                the start. Full descriptions can be up to 5,000 characters.
              </NoteCard>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/40 px-6 py-14 text-center">
              <AlignLeft className="h-8 w-8 text-primary" />
              <p className="mt-3 text-sm text-text-secondary">
                Generate a description to see the live preview here.
              </p>
            </div>
          )}
        </SectionCard>
      </div>

      {draft && draft.keywordLine && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-3 sm:grid-cols-3">
          <StatPill label="Hook" value="Included" tone="primary" />
          <StatPill label="Bullet points" value={draft.bullets.length} />
          <StatPill label="Hashtags" value={draft.hashtags.length} />
        </motion.div>
      )}

      {entries.length > 0 && (
        <HistoryPanel<DescriptionDraftState>
          storageKey={HISTORY_KEY}
          entries={entries}
          onEntriesChange={setEntries}
          onLoad={(state) => {
            setTopic(state.topic);
            setKeywords(state.keywords);
            setCta(state.cta);
            setIncludeHashtags(state.includeHashtags);
            setTone(state.tone);
            runGenerate(state);
          }}
        />
      )}
    </div>
  );
}
