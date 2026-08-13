/**
 * Text-to-speech provider abstraction (master spec §36) + the Phase 6
 * browser `SpeechSynthesis` implementation.
 *
 * Questions are ALWAYS shown as text too (§29, §17) — TTS is an overlay, so
 * a missing/broken voice never blocks the interview. The abstraction is the
 * seam for server TTS (OpenAI/ElevenLabs/Google) later; today everything
 * runs in the browser.
 */

export interface SynthesizeOptions {
  /** Words per minute hint (0.1–10; browser default when omitted). */
  rate?: number;
  pitch?: number;
  /** Voice to use — defaults to a voice matching the browser language. */
  voice?: SpeechSynthesisVoice | null;
}

export interface TextToSpeechProvider {
  readonly name: string;
  isSupported: () => boolean;
  /**
   * Speak `text`. Resolves when playback finishes, errors, or is cancelled
   * by `stop()` — so callers can sequence "speak question → start listening".
   */
  synthesize: (text: string, options?: SynthesizeOptions) => Promise<void>;
  /** Stop playback immediately (and flush the queue). */
  stop: () => void;
  isSpeaking: () => boolean;
  /** Preferred voice: browser-language match first, else the default. */
  pickVoice: (lang?: string) => SpeechSynthesisVoice | null;
}

function speechSynthesis(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  return window.speechSynthesis ?? null;
}

function voices(synth: SpeechSynthesis): SpeechSynthesisVoice[] {
  return synth.getVoices();
}

export function pickBrowserVoice(lang?: string): SpeechSynthesisVoice | null {
  const synth = speechSynthesis();
  if (!synth) return null;
  const all = voices(synth);
  if (all.length === 0) return null;

  const want = lang ?? (typeof navigator !== "undefined" ? navigator.language : "en-US");
  const base = want.split("-")[0]?.toLowerCase() ?? "en";

  // Exact language match first (en-US → en-US), then language family (en-*).
  const exact =
    all.find((v) => v.lang.toLowerCase() === want.toLowerCase()) ??
    all.find((v) => v.lang.toLowerCase().startsWith(base)) ??
    all.find((v) => v.default) ??
    all[0];
  return exact;
}

function browserSynthesize(text: string, options: SynthesizeOptions = {}): Promise<void> {
  const synth = speechSynthesis();
  if (!synth) {
    return Promise.resolve();
  }

  // Never queue: a new question supersedes anything still playing.
  synth.cancel();

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate ?? 1;
    utterance.pitch = options.pitch ?? 1;
    const voice = options.voice === undefined ? pickBrowserVoice() : options.voice;
    if (voice) utterance.voice = voice;

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    utterance.onend = finish;
    utterance.onerror = finish;

    // `oncancel` isn't in lib.dom (Chrome fires it on cancel() before onend).
    const cancelable = utterance as SpeechSynthesisUtterance & {
      oncancel: (() => void) | null;
    };
    cancelable.oncancel = finish;

    synth.speak(utterance);

    // Chrome can silently pause long utterances; nudge it back to life.
    const watchdog = setInterval(() => {
      if (!settled && synth.speaking && synth.paused) {
        synth.resume();
      }
    }, 1000);
    // The interval is cleared when playback ends; a final clear guards leaks.
    utterance.onend = () => {
      clearInterval(watchdog);
      finish();
    };
    utterance.onerror = () => {
      clearInterval(watchdog);
      finish();
    };
    cancelable.oncancel = () => {
      clearInterval(watchdog);
      finish();
    };
  });
}

export const browserTextToSpeechProvider: TextToSpeechProvider = {
  name: "browser-speech-synthesis",
  isSupported: () => speechSynthesis() !== null,
  synthesize: (text, options) => browserSynthesize(text, options),
  stop: () => {
    const synth = speechSynthesis();
    if (synth) {
      synth.cancel();
      // Safari keeps the synth busy after cancel — reset its state.
      synth.resume();
    }
  },
  isSpeaking: () => speechSynthesis()?.speaking ?? false,
  pickVoice: (lang) => pickBrowserVoice(lang),
};
