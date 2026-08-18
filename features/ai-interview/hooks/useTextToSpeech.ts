"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { browserTextToSpeechProvider } from "../services/tts/text-to-speech";

/** Capability is fixed per browser — subscribe never fires; a no-op unsubscribe. */
function subscribeCapability(): () => void {
  return () => {};
}

/**
 * Text-to-speech hook for the interview room (§29, §36).
 *
 * `speak(text)` resolves when the line finishes playing (or is cancelled),
 * so the room can sequence: question → TTS → start listening. The speaker
 * toggle disables voice entirely — the question text is always shown anyway,
 * so turning TTS off never blocks the interview.
 */
export function useTextToSpeech() {
  const providerRef = useRef(browserTextToSpeechProvider);
  // SSR-safe capability detection (same pattern as useMediaQuery) — the
  // server snapshot is false, then the client value is picked up on hydration.
  const supported = useSyncExternalStore(
    subscribeCapability,
    () => browserTextToSpeechProvider.isSupported(),
    () => false
  );
  const [enabled, setEnabled] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  // Toggling the speaker off stops whatever is playing.
  useEffect(() => {
    if (!enabled) providerRef.current.stop();
  }, [enabled]);

  // Never leave audio playing when the room unmounts.
  useEffect(() => () => providerRef.current.stop(), []);

  const stop = useCallback(() => {
    providerRef.current.stop();
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    async (text: string) => {
      if (!enabled || !supported) return;
      setSpeaking(true);
      try {
        await providerRef.current.synthesize(text);
      } finally {
        setSpeaking(false);
      }
    },
    [enabled, supported]
  );

  return {
    supported,
    enabled,
    setEnabled,
    speaking,
    speak,
    stop,
  };
}
