"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import {
  browserSpeechToTextProvider,
  type SpeechRecognizer,
} from "../services/speech/speech-to-text";

/** Capability is fixed per browser — subscribe never fires; a no-op unsubscribe. */
function subscribeCapability(): () => void {
  return () => {};
}

/**
 * Speech-to-text hook for the interview room (§28, §35, §75).
 *
 * While `listening`, live partials stream into `interimTranscript` and
 * settled sentences accumulate into `finalTranscript`. When the user stops
 * speaking (a final result followed by a short silence window), `onFinalAnswer`
 * fires with the full answer so the room can submit it. Every failure path
 * leaves the manual text input as the always-reachable fallback.
 *
 * Browser notes: SpeechRecognition is Chromium-only — `supported` is false
 * elsewhere and `start()` becomes a no-op.
 */

const SILENCE_MS = 3000;

export interface UseSpeechRecognitionOptions {
  /** BCP-47 language tag — defaults to the browser UI language. */
  lang?: string;
  /** Fired with the accumulated answer when the user stops speaking. */
  onFinalAnswer?: (text: string) => void;
}

export interface UseSpeechRecognitionResult {
  supported: boolean;
  listening: boolean;
  interimTranscript: string;
  finalTranscript: string;
  error: string | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionResult {
  const { lang, onFinalAnswer } = options;
  const langRef = useRef(lang);
  const onFinalAnswerRef = useRef(onFinalAnswer);
  useEffect(() => {
    langRef.current = lang;
    onFinalAnswerRef.current = onFinalAnswer;
  }, [lang, onFinalAnswer]);

  // SSR-safe capability detection (same pattern as useMediaQuery) — the
  // server snapshot is false, then the client value is picked up on hydration.
  const supported = useSyncExternalStore(
    subscribeCapability,
    () => browserSpeechToTextProvider.isSupported(),
    () => false
  );
  const [listening, setListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognizerRef = useRef<SpeechRecognizer | null>(null);
  const finalRef = useRef("");
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Each fresh recognizer bumps the generation; stale recognizers' late
  // async events (e.g. onend after reset+start) are ignored.
  const generationRef = useRef(0);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  /** Stop the recognizer and drop the reference (keeps accumulated text). */
  const stopRecognition = useCallback(() => {
    clearSilenceTimer();
    generationRef.current++;
    recognizerRef.current?.stop();
    recognizerRef.current = null;
    setListening(false);
  }, [clearSilenceTimer]);

  const ensureRecognizer = useCallback(() => {
    if (recognizerRef.current) return recognizerRef.current;
    if (!supported) return null;

    const generation = generationRef.current;
    const recognizer = browserSpeechToTextProvider.createRecognizer({
      lang: langRef.current ?? browserSpeechToTextProvider.detectLanguage(),
      continuous: true,
      interimResults: true,
      onResult: (text, isFinal) => {
        if (generation !== generationRef.current) return; // stale recognizer
        setError(null);
        if (isFinal) {
          finalRef.current = finalRef.current ? `${finalRef.current} ${text}` : text;
          setFinalTranscript(finalRef.current);
          setInterimTranscript("");
          // An answer ends when silence follows a settled sentence.
          clearSilenceTimer();
          silenceTimerRef.current = setTimeout(() => {
            const answer = finalRef.current.trim();
            if (answer) {
              stopRecognition();
              onFinalAnswerRef.current?.(answer);
            }
          }, SILENCE_MS);
        } else {
          setInterimTranscript(text);
        }
      },
      onEnd: () => {
        if (generation !== generationRef.current) return; // stale recognizer
        setListening(false);
      },
      onError: (speechError) => {
        if (generation !== generationRef.current) return; // stale recognizer
        // "no-speech" is informational — keep waiting for the answer.
        if (speechError.kind === "no-speech") return;
        setError(speechError.message);
        if (
          speechError.kind === "denied" ||
          speechError.kind === "network" ||
          speechError.kind === "unknown"
        ) {
          stopRecognition();
        }
      },
    });
    recognizerRef.current = recognizer;
    return recognizer;
  }, [supported, clearSilenceTimer, stopRecognition]);

  const start = useCallback(() => {
    if (!supported) return;
    setError(null);
    const recognizer = ensureRecognizer();
    if (!recognizer) return;
    recognizer.start();
    setListening(true);
  }, [supported, ensureRecognizer]);

  const stop = useCallback(() => {
    stopRecognition();
  }, [stopRecognition]);

  const reset = useCallback(() => {
    stopRecognition();
    finalRef.current = "";
    setFinalTranscript("");
    setInterimTranscript("");
    setError(null);
  }, [stopRecognition]);

  // Cleanup on unmount — never leave the mic hot.
  useEffect(
    () => () => {
      clearSilenceTimer();
      recognizerRef.current?.abort();
      recognizerRef.current = null;
    },
    [clearSilenceTimer]
  );

  return {
    supported,
    listening,
    interimTranscript,
    finalTranscript,
    error,
    start,
    stop,
    reset,
  };
}
