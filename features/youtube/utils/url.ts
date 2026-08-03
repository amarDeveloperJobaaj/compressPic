/**
 * YouTube URL utilities — parsing, thumbnails, oEmbed metadata, transcripts.
 * Everything runs client-side; only public, CORS-friendly endpoints are used.
 */

export interface ThumbnailOption {
  key: "default" | "medium" | "high" | "standard" | "maxres";
  label: string;
  width: number;
  height: number;
  url: string;
}

export interface VideoMeta {
  videoId: string;
  title: string;
  author: string;
  thumbnailUrl: string;
}

export interface TranscriptSegment {
  /** Human-readable timestamp, e.g. "00:01:24" */
  time: string;
  text: string;
}

export interface TranscriptResult {
  segments: TranscriptSegment[];
  error?: string;
}

/** Extract a YouTube video ID from any common URL form. Returns null if none. */
export function parseYouTubeUrl(input: string): string | null {
  const url = input.trim();
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com|youtu\.be)\/(?:watch\?.*?v=|shorts\/|embed\/|live\/|v\/|e\/)?([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && /^[A-Za-z0-9_-]{11}$/.test(match[1])) return match[1];
  }
  return null;
}

/** All standard thumbnail sizes served from i.ytimg.com. */
export function getThumbnailOptions(videoId: string): ThumbnailOption[] {
  const base = `https://i.ytimg.com/vi/${videoId}/`;
  return [
    { key: "default", label: "Default", width: 120, height: 90, url: `${base}default.jpg` },
    { key: "medium", label: "Medium", width: 320, height: 180, url: `${base}mqdefault.jpg` },
    { key: "high", label: "High", width: 480, height: 360, url: `${base}hqdefault.jpg` },
    { key: "standard", label: "Standard", width: 640, height: 480, url: `${base}sddefault.jpg` },
    { key: "maxres", label: "Max Resolution", width: 1280, height: 720, url: `${base}maxresdefault.jpg` },
  ];
}

/** Typed fetch failure so callers can distinguish service errors from raw network errors. */
export class RequestFailedError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "RequestFailedError";
    this.status = status;
  }
}

function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

/** Hosts whose direct browser fetch already failed (CORS/network) — skip it next time. */
const corsBlockedHosts = new Set<string>();

interface FetchViaProxyOptions {
  /** Skip the direct fetch entirely — for hosts known to lack CORS headers. */
  preferProxy?: boolean;
  timeoutMs?: number;
}

/**
 * Fetch a URL, falling back through a chain of public CORS proxies.
 *
 * The direct attempt is skipped for hosts we know reject browser fetches
 * (avoids pointless "Failed to fetch" errors), and network failures never
 * escape as raw TypeErrors — callers get a typed `RequestFailedError`.
 */
export async function fetchViaProxy(
  url: string,
  options: FetchViaProxyOptions = {}
): Promise<string> {
  const { preferProxy = false, timeoutMs = 15000 } = options;
  const host = hostOf(url);

  if (!preferProxy && host && !corsBlockedHosts.has(host)) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const direct = await fetch(url, { signal: controller.signal });
        if (direct.ok) return await direct.text();
      } finally {
        clearTimeout(timer);
      }
    } catch {
      if (host) corsBlockedHosts.add(host);
    }
  }

  const proxies = [
    (target: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`,
    (target: string) => `https://corsproxy.io/?url=${encodeURIComponent(target)}`,
  ];

  let lastError: unknown = null;
  for (const build of proxies) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(build(url), { signal: controller.signal });
      if (!res.ok) throw new RequestFailedError(`Request failed with status ${res.status}`, res.status);
      return await res.text();
    } catch (err) {
      lastError = err; // try the next proxy
    } finally {
      clearTimeout(timer);
    }
  }
  if (lastError instanceof RequestFailedError) throw lastError;
  throw new RequestFailedError("Could not reach the remote service — network error.");
}

/**
 * Fetch public video metadata via YouTube's oEmbed endpoint (CORS-enabled,
 * no API key required). Always resolves — falls back to placeholder data on
 * any failure so callers never have to handle null.
 */
export async function fetchVideoMeta(videoId: string): Promise<VideoMeta> {
  const fallback = (): VideoMeta => ({
    videoId,
    title: "Untitled video",
    author: "Unknown creator",
    thumbnailUrl: getThumbnailOptions(videoId)[2].url,
  });
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(oembedUrl(videoId), { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return fallback();
    const data = (await res.json()) as {
      title?: string;
      author_name?: string;
      thumbnail_url?: string;
    };
    return {
      videoId,
      title: data.title ?? "Untitled video",
      author: data.author_name ?? "Unknown creator",
      thumbnailUrl: data.thumbnail_url ?? getThumbnailOptions(videoId)[2].url,
    };
  } catch {
    return fallback();
  }
}

function oembedUrl(videoId: string): string {
  return `https://www.youtube.com/oembed?url=${encodeURIComponent(
    `https://www.youtube.com/watch?v=${videoId}`
  )}&format=json`;
}

/** Parse the transcript HTML from youtubetranscript.com into timed segments. */
function parseTranscriptHtml(html: string): TranscriptResult {
  // Detect known failure messages before parsing.
  const lower = html.toLowerCase();
  if (
    lower.includes("could not find any transcripts") ||
    lower.includes("transcripts are disabled") ||
    lower.includes("no transcripts") ||
    lower.includes("video unavailable")
  ) {
    return {
      segments: [],
      error: "No public transcript is available for this video — captions may be disabled or the video is unavailable.",
    };
  }

  const doc = new DOMParser().parseFromString(html, "text/html");
  const transcriptNode = doc.querySelector<HTMLElement>("#transcript");
  // Require the transcript node — never fall back to whole-page boilerplate.
  if (!transcriptNode) {
    return {
      segments: [],
      error: "We couldn't extract a transcript from this video. Captions may be disabled by the uploader.",
    };
  }
  const raw = transcriptNode.innerText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const segments: TranscriptSegment[] = [];
  const timeRe = /^\[(\d{1,2}):(\d{2})(?::(\d{2}))?\]\s*(.*)$/;
  let lastTime = "";

  for (const line of raw) {
    const match = line.match(timeRe);
    if (match) {
      const [, h, m, s, text] = match;
      const time = s ? `${h.padStart(2, "0")}:${m}:${s}` : `${h.padStart(2, "0")}:${m}`;
      segments.push({ time, text: text.trim() });
      lastTime = time;
    } else if (segments.length > 0 && !/^(youtube|transcript)/i.test(line)) {
      // Continuation of the previous segment.
      segments[segments.length - 1].text += ` ${line}`;
    } else {
      segments.push({ time: lastTime, text: line });
    }
  }

  if (segments.length === 0) {
    return {
      segments: [],
      error: "We couldn't extract a transcript from this video. Captions may be disabled by the uploader.",
    };
  }
  return { segments };
}

/** Format a seconds value as "MM:SS" (or "HH:MM:SS" past an hour). */
function formatSeconds(total: number): string {
  const s = Math.max(0, Math.floor(total));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${String(h).padStart(2, "0")}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Defensively parse the tactiq transcript response (several known shapes). */
function parseTactiqResponse(json: unknown): TranscriptSegment[] {
  let items: unknown[] = [];
  if (Array.isArray(json)) {
    items = json;
  } else if (json && typeof json === "object") {
    const obj = json as Record<string, unknown>;
    const nested = ["transcript", "captions", "segments", "data"].find((key) =>
      Array.isArray(obj[key])
    );
    if (nested) items = obj[nested] as unknown[];
  }

  const segments: TranscriptSegment[] = [];
  for (const raw of items) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as Record<string, unknown>;
    let text = "";
    if (typeof item.text === "string") text = item.text.trim();
    else if (typeof item.caption === "string") text = item.caption.trim();
    else if (typeof item.content === "string") text = item.content.trim();
    if (!text) continue;
    let seconds = Number(item.start);
    if (!Number.isFinite(seconds)) seconds = Number(item.startMs) / 1000;
    if (!Number.isFinite(seconds)) seconds = 0;
    segments.push({ time: formatSeconds(seconds), text });
  }
  return segments;
}

/**
 * Try the tactiq transcript endpoint first — it is CORS-enabled, so it works
 * directly from the browser without a proxy. Returns null when the service
 * itself can't be reached or the response shape is unexpected.
 */
async function fetchTactiqTranscript(videoId: string): Promise<TranscriptResult | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    let json: unknown;
    try {
      const res = await fetch("https://tactiq-apps-prod.tactiq.io/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
          langCode: "en",
        }),
        signal: controller.signal,
      });
      if (!res.ok) return null;
      json = await res.json();
    } finally {
      clearTimeout(timer);
    }
    const segments = parseTactiqResponse(json);
    if (segments.length === 0) {
      return {
        segments: [],
        error:
          "No public transcript is available for this video — captions may be disabled or the video is unavailable.",
      };
    }
    return { segments };
  } catch {
    return null; // network/CORS/preflight failure — let the proxy source try
  }
}

/**
 * Fetch the public transcript for a video. Tries a CORS-friendly endpoint
 * directly, then falls back to youtubetranscript.com through a proxy chain.
 * Always resolves — never throws.
 */
export async function fetchTranscript(videoId: string): Promise<TranscriptResult> {
  const tactiq = await fetchTactiqTranscript(videoId);
  if (tactiq && tactiq.segments.length > 0) return tactiq;

  try {
    // youtubetranscript.com doesn't send CORS headers — go straight to the proxy.
    const url = `https://youtubetranscript.com/?server_vid2=${encodeURIComponent(videoId)}`;
    const html = await fetchViaProxy(url, { preferProxy: true, timeoutMs: 10000 });
    const parsed = parseTranscriptHtml(html);
    if (parsed.segments.length > 0 || parsed.error) return parsed;
  } catch {
    // proxy chain failed — fall through
  }

  if (tactiq?.error) return tactiq;
  return {
    segments: [],
    error:
      "Could not fetch a transcript. The video may have captions disabled, or the transcript service is temporarily unavailable.",
  };
}

/** Download a remote image as a file (with an open-in-new-tab fallback). */
export async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("bad response");
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch {
    // CORS-restricted environments: fall back to opening the image.
    window.open(url, "_blank", "noopener");
  }
}

/** Download a plain-text string as a file. */
export function downloadText(content: string, filename: string, mime = "text/plain"): void {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

/** Shared browser clipboard helper. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers / non-secure contexts.
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      return true;
    } catch {
      return false;
    }
  }
}
