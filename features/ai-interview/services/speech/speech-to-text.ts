/**
 * Speech-to-text provider abstraction (master spec §35) + the Phase 6
 * browser `SpeechRecognition` implementation.
 *
 * The abstraction is the seam for server STT (Whisper/Deepgram/AssemblyAI)
 * later; today the MVP transcribes in-browser, so there are no API routes
 * and no audio leaves the device (§37, §105). Every consumer falls back to
 * manual text input when this provider is unsupported (§75).
 *
 * Note: `SpeechRecognition` is Chromium-only and NOT part of TypeScript's
 * lib.dom — the minimal interface below keeps the casts in one place
 * (architecture notes §9 risk list).
 */

export type SpeechErrorKind =
  | "not-supported"
  | "no-speech"
  | "aborted"
  | "denied"
  | "network"
  | "unknown";

export interface SpeechRecognitionError {
  kind: SpeechErrorKind;
  message: string;
}

export interface SpeechRecognizerOptions {
  /** BCP-47 language tag — defaults to the browser UI language. */
  lang?: string;
  /** Keep listening across pauses (true) or stop after one utterance. */
  continuous?: boolean;
  /** Deliver live partials (true) — final results always delivered. */
  interimResults?: boolean;
  onResult: (transcript: string, isFinal: boolean) => void;
  onEnd: () => void;
  onError: (error: SpeechRecognitionError) => void;
}

export interface SpeechRecognizer {
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export interface SpeechToTextProvider {
  readonly name: string;
  /** Chromium ships SpeechRecognition; everyone else gets the text fallback. */
  isSupported: () => boolean;
  /** Browser UI language (e.g. "en-US") — the recognition language. */
  detectLanguage: () => string;
  createRecognizer: (options: SpeechRecognizerOptions) => SpeechRecognizer | null;
}

/** Minimal typing for the Web Speech recognition API (not in lib.dom). */
interface BrowserSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: {
    resultIndex: number;
    results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
  }) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
}

function recognitionConstructor(): (new () => BrowserSpeechRecognition) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => BrowserSpeechRecognition;
    webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function toSpeechError(raw: string | undefined): SpeechRecognitionError {
  switch (raw) {
    case "no-speech":
      return { kind: "no-speech", message: "I didn't catch that — try speaking again." };
    case "aborted":
      return { kind: "aborted", message: "Speech recognition was stopped." };
    case "audio-capture":
      return { kind: "denied", message: "Could not capture the microphone. Check your mic and try again, or type your answer." };
    case "network":
      return { kind: "network", message: "Speech recognition needs a network connection. You can still type your answer." };
    case "not-allowed":
    case "service-not-allowed":
      return { kind: "denied", message: "Microphone access was denied. Allow it in your browser, or type your answer instead." };
    case "language-not-supported":
      return { kind: "unknown", message: "Your browser language isn't supported for speech. Try English, or type your answer." };
    default:
      return { kind: "unknown", message: "Speech recognition had a problem. You can still type your answer." };
  }
}

function browserRecognizer(options: SpeechRecognizerOptions): SpeechRecognizer | null {
  const Ctor = recognitionConstructor();
  if (!Ctor) return null;

  const recognition = new Ctor();
  recognition.lang = options.lang ?? "en-US";
  recognition.continuous = options.continuous ?? true;
  recognition.interimResults = options.interimResults ?? true;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    let interim = "";
    let final = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0]?.transcript ?? "";
      if (result.isFinal) final += transcript;
      else interim += transcript;
    }
    if (final) options.onResult(final.trim(), true);
    if (interim) options.onResult(interim.trim(), false);
  };

  recognition.onerror = (event) => options.onError(toSpeechError(event.error));

  recognition.onend = () => options.onEnd();

  return {
    start: () => {
      try {
        recognition.start();
      } catch {
        // Already running — nothing to do.
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch {
        // Not running.
      }
    },
    abort: () => {
      try {
        recognition.abort();
      } catch {
        // Not running.
      }
    },
  };
}

export const browserSpeechToTextProvider: SpeechToTextProvider = {
  name: "browser-speech-recognition",
  isSupported: () => recognitionConstructor() !== null,
  detectLanguage: () =>
    typeof navigator !== "undefined"
      ? navigator.language || "en-US"
      : "en-US",
  createRecognizer: (options) => browserRecognizer(options),
};
