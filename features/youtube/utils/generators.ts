/**
 * Content generators for YouTube title, description, and tag-suggestion tools.
 * Pure functions — no DOM, no state, easy to test.
 */

export const VIDEO_CATEGORIES = [
  "Technology",
  "Finance & Investing",
  "Gaming",
  "Education",
  "Lifestyle & Vlogs",
  "Cooking & Food",
  "Fitness & Health",
  "Business & Marketing",
  "Entertainment",
  "Travel",
] as const;

export const TONES = [
  "Informative",
  "Catchy",
  "Professional",
  "Fun & Casual",
  "Emotional",
  "Urgent",
] as const;

export type VideoCategory = (typeof VIDEO_CATEGORIES)[number];
export type Tone = (typeof TONES)[number];

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "of", "in", "on", "for", "to", "with",
  "at", "by", "from", "up", "about", "into", "over", "after", "is", "are", "was",
  "were", "be", "been", "how", "what", "why", "when", "where", "this", "that",
  "your", "you", "my", "me", "i", "we", "our", "it", "its", "as", "so", "if",
]);

const POWER_WORDS = [
  "ultimate", "best", "top", "how", "guide", "secrets", "easy", "fast",
  "2026", "free", "proven", "simple", "powerful", "amazing", "incredible",
  "shocking", "mistakes", "tips", "hacks", "master", "revealed", "hidden",
  "complete", "step-by-step", "beginner", "advanced", "new",
];

/** Clean a topic/keyword into words for use inside templates. */
export function normalizeTopic(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z0-9₹$%&'+\- ]/g, "")
    .trim();
}

function titleCase(input: string): string {
  return input
    .split(" ")
    .map((word) => (word.length <= 2 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
    .join(" ");
}

/** Generate a list of candidate titles for a topic, category, and tone. */
export function generateTitles(
  rawTopic: string,
  category: VideoCategory,
  tone: Tone,
  withNumber = true,
  withEmoji = false
): { title: string; score: number }[] {
  const topic = normalizeTopic(rawTopic);
  const base = topic || "Your Topic";
  const T = titleCase(base);

  const templates: string[] = [];

  // Informative / how-to backbone.
  templates.push(
    `How to ${base} — Step-by-Step Guide`,
    `${T}: The Complete Guide for Beginners`,
    `How I Mastered ${base} in 30 Days`,
    `The Truth About ${base} Nobody Talks About`
  );

  // Numbers & listicles.
  if (withNumber) {
    templates.push(
      `Top 10 ${T} Mistakes to Avoid in 2026`,
      `7 ${T} Tips That Actually Work`,
      `5 ${T} Tricks You Should Know`,
      `3 Reasons Why ${T} Matters`
    );
  }

  // Questions.
  templates.push(
    `Why ${T} Matters More Than Ever`,
    `What Nobody Tells You About ${base}`,
    `Is ${T} Worth It in 2026?`
  );

  // Tone-specific lines.
  if (tone === "Catchy") {
    templates.push(
      `${T} — You've Been Doing It Wrong`,
      `Stop Making These ${T} Mistakes`,
      `${T}: The 10-Minute Fix`
    );
  } else if (tone === "Professional") {
    templates.push(
      `${T}: A Practical Overview for Professionals`,
      `Mastering ${base}: Lessons from Experience`,
      `${T} in 2026 — What You Need to Know`
    );
  } else if (tone === "Fun & Casual") {
    templates.push(
      `Let's Talk About ${base} (It's Not That Complicated)`,
      `My Honest Take on ${base}`,
      `${T} — Explained Like You're 5`
    );
  } else if (tone === "Emotional") {
    templates.push(
      `Why I Almost Gave Up on ${base}`,
      `The Emotional Side of ${base}`,
      `${T}: A Story of Persistence`
    );
  } else if (tone === "Urgent") {
    templates.push(
      `${T} — Do This Before It's Too Late`,
      `You NEED to Know This About ${base}`,
      `Critical ${T} Update You Can't Miss`
    );
  }

  // Category flavor.
  const categoryBoost: Record<VideoCategory, string[]> = {
    Technology: [`${T}: Beginner to Pro in One Video`, `${base} vs the Competition in 2026`],
    "Finance & Investing": [`How to ${base} (Even on a Small Budget)`, `${T} Explained Simply`],
    Gaming: [`Ultimate ${T} Walkthrough`, `${base} — Tips, Tricks & Hidden Secrets`],
    Education: [`Learn ${base} Fast — Full Course`, `${T} Made Easy`],
    "Lifestyle & Vlogs": [`A Day in My Life: ${base}`, `My ${T} Routine (Real & Unedited)`],
    "Cooking & Food": [`The Perfect ${base} Recipe`, `${T} — 3 Ways to Make It`],
    "Fitness & Health": [`Transform Your Body with ${base}`, `${T} for Busy People`],
    "Business & Marketing": [`Grow Faster with ${base}`, `${T}: A Marketer's Playbook`],
    Entertainment: [`${T} — Everything You Need to Know`, `Reacting to ${base} (Spoilers!)`],
    Travel: [`${base}: Ultimate Travel Guide`, `How to ${base} on a Budget`],
  };
  templates.push(...categoryBoost[category]);

  const emoji = withEmoji ? ["🚀", "🔥", "💡", "✅", "🎯", "⭐"][tone.length % 6] : "";

  const seen = new Set<string>();
  const titles: { title: string; score: number }[] = [];
  for (const tpl of templates) {
    let title = tpl;
    if (emoji) title = `${emoji} ${title}`;
    if (seen.has(title.toLowerCase())) continue;
    seen.add(title.toLowerCase());
    titles.push({ title, score: scoreTitle(title, base) });
  }
  return titles.slice(0, 12);
}

/** Simple SEO scoring: keyword presence, length, power words, numbers, brackets. */
export function scoreTitle(title: string, keyword: string): number {
  let score = 50;
  const lower = title.toLowerCase();
  const kw = normalizeTopic(keyword).toLowerCase();
  if (kw && lower.includes(kw)) score += 15;
  if (title.length >= 30 && title.length <= 65) score += 15;
  if (/\d/.test(title)) score += 10;
  if (POWER_WORDS.some((word) => lower.includes(word))) score += 10;
  if (/[()|–—-]/.test(title)) score += 5;
  if (title.length > 70) score -= 10;
  if (title.length < 20) score -= 5;
  return Math.max(0, Math.min(100, score));
}

/** Extract keyword-style tags from a title (for tag suggestions). */
export function extractKeywords(text: string, max = 10): string[] {
  const words = normalizeTopic(text)
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length >= 3 && !STOP_WORDS.has(word));
  // Bigrams give more specific tags.
  const bigrams: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i + 1]}`);
  }
  return [...new Set([...words, ...bigrams])].slice(0, max);
}

export interface DescriptionDraft {
  text: string;
  hashtags: string[];
  hook: string;
  bullets: string[];
  keywordLine: string;
}

/** Build a structured, SEO-friendly video description. */
export function generateDescription(
  rawTopic: string,
  rawKeywords: string,
  cta: "subscribe" | "comment" | "link" | "none",
  includeHashtags: boolean,
  tone: Tone
): DescriptionDraft {
  const topic = normalizeTopic(rawTopic) || "this topic";
  const base = topic;
  const T = titleCase(base);
  const keywords = rawKeywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const openers: Record<Tone, string> = {
    Informative: `In this video, I break down ${base} step by step so you can understand it clearly and apply it right away.`,
    Catchy: `Ready for the ${base} breakdown everyone's talking about? You won't want to miss this.`,
    Professional: `A practical, no-fluff overview of ${base} — covering the essentials professionals actually need.`,
    "Fun & Casual": `Hey friends! Today we're diving into ${base} — and I promise it's easier than it sounds.`,
    Emotional: `${T} has been a journey for me, and in this video I'm sharing everything I've learned along the way.`,
    Urgent: `If you care about ${base}, watch this now — this changes everything you thought you knew.`,
  };

  const bullets = [
    `What ${base} really means and why it matters`,
    `The biggest mistakes people make with ${T}`,
    `My step-by-step process for getting it right`,
    `Tools and resources that make ${T} easier`,
    `Actionable tips you can use today`,
  ];

  const ctaLines: Record<typeof cta, string> = {
    subscribe:
      "If you found this helpful, hit that subscribe button and turn on notifications — new videos every week! 🔔",
    comment: "What did I miss about this topic? Drop your thoughts in the comments below 👇",
    link: "Links and resources from this video are in the description below 👇",
    none: "",
  };

  const keywordLine =
    keywords.length > 0
      ? `\n\nKey topics covered: ${keywords.join(", ")}.`
      : "";

  const hashtags = includeHashtags
    ? ["#YouTube", `#${base.replace(/\s+/g, "")}`, ...extractKeywords(`${base} ${keywords.join(" ")}`, 5).map((k) => `#${k.replace(/\s+/g, "")}`)]
    : [];

  const text = [
    openers[tone],
    "",
    "In this video:",
    ...bullets.map((b) => `• ${b}`),
    "",
    keywordLine.trim() || "Don't forget to like this video if it helped!",
    "",
    ctaLines[cta],
    "",
    hashtags.join(" "),
  ]
    .filter((line) => line.trim() !== "")
    .join("\n");

  return { text, hashtags, hook: openers[tone], bullets, keywordLine: keywordLine.trim() };
}

/** Count characters, words, and YouTube-visible preview length of a description. */
export function analyzeText(text: string) {
  const visible = text.slice(0, 157);
  return {
    chars: text.length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    visibleChars: visible.length,
  };
}
