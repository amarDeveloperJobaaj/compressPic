"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Loader2,
  LogIn,
  RefreshCw,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Capsule } from "@/components/ui/capsule";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CUSTOM_COMPANY_ID } from "@/features/ai-interview/data/companies";
import { DOMAINS } from "@/features/ai-interview/data/domains";
import { INTERVIEW_TYPES } from "@/features/ai-interview/data/interview-types";
import { ROLES } from "@/features/ai-interview/data/roles";
import { useAuth } from "@/features/ai-interview/hooks/useAuth";
import { useInterviewSession } from "@/features/ai-interview/hooks/useInterviewSession";
import { useMediaDevices } from "@/features/ai-interview/hooks/useMediaDevices";
import { useQuestionEngine } from "@/features/ai-interview/hooks/useQuestionEngine";
import { useSpeechRecognition } from "@/features/ai-interview/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/features/ai-interview/hooks/useTextToSpeech";
import type { CreateInterviewSessionInput } from "@/features/ai-interview/schemas/interview-session";
import {
  isInterviewLive,
  remainingSeconds,
  useInterviewRoomStore,
} from "@/features/ai-interview/store/interview-room-store";
import { useInterviewStore } from "@/features/ai-interview/store/interview-store";
import { AIInterviewerPanel } from "./AIInterviewerPanel";
import { InterviewControls } from "./InterviewControls";
import { InterviewTimer } from "./InterviewTimer";
import { PermissionModal } from "./PermissionModal";
import { QuestionPanel } from "./QuestionPanel";
import { RecordingConsent } from "./RecordingConsent";
import { TranscriptPanel } from "./TranscriptPanel";
import { VideoPanel } from "./VideoPanel";

/**
 * Interview room (master spec §12, §15, §30–31, §75, §79).
 *
 *   auth → permissions (getUserMedia + fallbacks) → consent (§31)
 *   → session create/start (Phase 3 APIs) → ASKING (first question, Phase 5)
 *   → LISTENING (answer) → PROCESSING (persist + next question) → ASKING loop
 *   → End (confirm) → session end → COMPLETED.
 *
 * The question engine (Phase 5) drives the §79 sub-states; the voice loop
 * (Phase 6) runs around it: question → SPEAKING (TTS reads it aloud) →
 * LISTENING (STT captures the answer) → PROCESSING → next question. Voice is
 * an overlay — the question is always shown as text and the text input is
 * always available (§17, §29, §75).
 */

export function InterviewRoom() {
  const { user, loading: authLoading, configured } = useAuth();
  const media = useMediaDevices();
  const stopMedia = media.stop; // stable callback — safe in effect/useCallback deps
  const { createSession, startSession, endSession, creating, starting, ending } =
    useInterviewSession();
  const { busy: engineBusy, askFirstQuestion, answerAndAskNext } = useQuestionEngine();
  const tts = useTextToSpeech();
  const ttsSpeak = tts.speak;
  const ttsStop = tts.stop;

  const status = useInterviewRoomStore((s) => s.status);
  const sessionId = useInterviewRoomStore((s) => s.sessionId);
  const error = useInterviewRoomStore((s) => s.error);
  const recordingConsent = useInterviewRoomStore((s) => s.recordingConsent);
  const currentQuestion = useInterviewRoomStore((s) => s.currentQuestion);
  const elapsedSeconds = useInterviewRoomStore((s) => s.elapsedSeconds);
  const setStatus = useInterviewRoomStore((s) => s.setStatus);
  const setError = useInterviewRoomStore((s) => s.setError);
  const setSessionId = useInterviewRoomStore((s) => s.setSessionId);
  const setRecordingConsent = useInterviewRoomStore((s) => s.setRecordingConsent);
  const setCurrentQuestion = useInterviewRoomStore((s) => s.setCurrentQuestion);
  const setCurrentQuestionId = useInterviewRoomStore((s) => s.setCurrentQuestionId);
  const addTranscriptEntry = useInterviewRoomStore((s) => s.addTranscriptEntry);
  const resetRoom = useInterviewRoomStore((s) => s.reset);

  const setup = useInterviewStore(
    useShallow((s) => ({
      roleId: s.roleId,
      domainId: s.domainId,
      companyId: s.companyId,
      customCompany: s.customCompany,
      experienceLevelId: s.experienceLevelId,
      interviewTypeId: s.interviewTypeId,
      durationMinutes: s.durationMinutes,
      difficulty: s.difficulty,
      resumePath: s.resumePath,
      resumeFile: s.resumeFile,
      candidateProfile: s.candidateProfile,
    }))
  );

  const [confirmEnd, setConfirmEnd] = useState(false);

  const setupComplete = Boolean(
    setup.roleId &&
      setup.domainId &&
      setup.companyId &&
      setup.experienceLevelId &&
      setup.interviewTypeId &&
      setup.durationMinutes
  );

  const roleName = useMemo(
    () => ROLES.find((r) => r.id === setup.roleId)?.name ?? setup.roleId ?? "this role",
    [setup.roleId]
  );
  const domainName = useMemo(
    () => DOMAINS.find((d) => d.id === setup.domainId)?.name ?? setup.domainId,
    [setup.domainId]
  );
  const typeName = useMemo(
    () => INTERVIEW_TYPES.find((t) => t.id === setup.interviewTypeId)?.name ?? "mock",
    [setup.interviewTypeId]
  );

  // Stop camera/mic when leaving the room. `media.stop` is a stable callback.
  useEffect(() => () => stopMedia(), [stopMedia]);

  /**
   * Deliver a question (Phase 6 voice loop): SPEAKING while TTS reads it
   * aloud, then LISTENING for the answer. If voice is off/unavailable, speak
   * resolves immediately and the mic (when granted) starts listening instead.
   */
  const presentQuestion = useCallback(
    async (question: string) => {
      setStatus("speaking");
      await ttsSpeak(question);
      // The interview may have ended while the voice was playing.
      if (useInterviewRoomStore.getState().status !== "speaking") return;
      setStatus("listening");
    },
    [setStatus, ttsSpeak]
  );

  const endInterview = useCallback(async () => {
    // Guard against double-fire (End-click + timer expiry in the same tick).
    if (!isInterviewLive(useInterviewRoomStore.getState().status)) return;
    setConfirmEnd(false);
    ttsStop();
    setStatus("ending");
    if (!sessionId) {
      setStatus("completed");
      stopMedia();
      return;
    }
    const result = await endSession(sessionId);
    if (!result.ok) {
      setError(result.error);
      setStatus("active");
      return;
    }
    setStatus("completed");
    setCurrentQuestion(null);
    setCurrentQuestionId(null);
    stopMedia();
  }, [sessionId, setStatus, setError, setCurrentQuestion, setCurrentQuestionId, endSession, stopMedia, ttsStop]);

  // Room clock — ticks while the interview is live; auto-ends when the budget
  // is up. State is read via getState() so the interval never captures stale
  // values.
  useEffect(() => {
    if (!isInterviewLive(status)) return;
    const id = setInterval(() => {
      const room = useInterviewRoomStore.getState();
      room.tick();
      if (
        isInterviewLive(room.status) &&
        remainingSeconds(setup.durationMinutes ?? 20, room.elapsedSeconds) <= 0
      ) {
        void endInterview();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [status, setup.durationMinutes, endInterview]);

  const buildCreateInput = useCallback((): CreateInterviewSessionInput => {
    return {
      roleId: setup.roleId!,
      domainId: setup.domainId!,
      companyId: setup.companyId!,
      customCompany: setup.companyId === CUSTOM_COMPANY_ID ? setup.customCompany : undefined,
      experienceLevelId: setup.experienceLevelId!,
      interviewTypeId: setup.interviewTypeId!,
      durationMinutes: setup.durationMinutes!,
      difficulty: setup.difficulty,
      resumePath: setup.resumePath ?? undefined,
      resumeFileName: setup.resumeFile?.name ?? undefined,
      candidateProfile: setup.candidateProfile ?? undefined,
      recordingConsent: true,
    };
  }, [setup]);

  const beginInterview = useCallback(async () => {
    if (!recordingConsent) {
      setError("Please agree to the recording consent to start the interview.");
      return;
    }
    setError(null);
    setStatus("preparing");

    // If a previous Begin created the session but start failed, reuse it
    // instead of creating a duplicate.
    let id = sessionId;
    if (!id) {
      const created = await createSession(buildCreateInput());
      if (!created.ok) {
        setError(created.error);
        setStatus("ready");
        return;
      }
      id = created.data.session.id;
      setSessionId(id);
    }

    const started = await startSession(id);
    if (!started.ok) {
      setError(started.error);
      setStatus("ready");
      return;
    }

    // ASKING → first question from the engine (stored server-side).
    setStatus("asking");
    const first = await askFirstQuestion(id);
    if (!first.ok) {
      setError(first.error);
      setStatus("ready"); // start is idempotent — retry is safe
      return;
    }
    // The interview may have moved on (End clicked) while the AI was thinking.
    if (useInterviewRoomStore.getState().status !== "asking") return;
    if (!first.data.question) {
      setError("The interview could not start — no question was generated.");
      setStatus("ready");
      return;
    }
    setCurrentQuestionId(first.data.question.id);
    setCurrentQuestion(first.data.question.question);
    addTranscriptEntry({ speaker: "interviewer", text: first.data.question.question });
    await presentQuestion(first.data.question.question); // SPEAKING → LISTENING
  }, [
    recordingConsent,
    setError,
    setStatus,
    createSession,
    buildCreateInput,
    setSessionId,
    startSession,
    askFirstQuestion,
    setCurrentQuestion,
    setCurrentQuestionId,
    addTranscriptEntry,
    sessionId,
    presentQuestion,
  ]);

  /**
   * One answer turn (Phase 5 + 6 voice): append the candidate line locally,
   * persist the answer + generate the next question, then SPEAKING (TTS) →
   * LISTENING (STT picks the mic back up). `durationSeconds` is the spoken
   * answer length — stored with the answer for the Phase 8 pace metrics.
   */
  const submitAnswer = useCallback(
    async (text: string, durationSeconds?: number) => {
      const room = useInterviewRoomStore.getState();
      const id = room.sessionId;
      const questionId = room.currentQuestionId;
      // Only accept answers while the interviewer awaits one (prevents the
      // voice silence-timer and a manual send from double-firing).
      if (!id || !questionId || !(room.status === "listening" || room.status === "active")) {
        return;
      }

      // Spoken-answer length (voice window) — stored for Phase 8 pace metrics.
      const voiceStartedAt = useInterviewRoomStore.getState().answerStartedAt;
      useInterviewRoomStore.getState().setAnswerStartedAt(null);

      addTranscriptEntry({ speaker: "candidate", text });
      setError(null);
      setStatus("processing");

      const result = await answerAndAskNext(id, {
        questionId,
        transcript: text,
        durationSeconds: durationSeconds ?? (voiceStartedAt != null ? Math.round((Date.now() - voiceStartedAt) / 1000) : undefined),
      });
      // The interview may have ended (or failed) while the engine worked.
      const now = useInterviewRoomStore.getState();
      if (now.status !== "processing") return;

      if (!result.ok) {
        setError(result.error);
        setStatus("listening"); // same question still stands — try again
        return;
      }

      // The adaptive engine ended the interview (time/question budget —
      // END_INTERVIEW rules). Server finalized the session; close the room.
      if (result.data.ended || !result.data.question) {
        ttsStop();
        setCurrentQuestion(null);
        setCurrentQuestionId(null);
        stopMedia();
        setStatus("completed");
        return;
      }
      setCurrentQuestionId(result.data.question.id);
      setCurrentQuestion(result.data.question.question);
      addTranscriptEntry({ speaker: "interviewer", text: result.data.question.question });
      await presentQuestion(result.data.question.question); // SPEAKING → LISTENING
    },
    [
      addTranscriptEntry,
      setError,
      setStatus,
      answerAndAskNext,
      setCurrentQuestion,
      setCurrentQuestionId,
      presentQuestion,
      ttsStop,
      stopMedia,
    ]
  );

  // Voice loop (Phase 6): STT auto-submits the answer after a short silence;
  // the recognizer lifecycle is driven by the listening-state effect below.
  const stt = useSpeechRecognition({ onFinalAnswer: submitAnswer });
  const sttStart = stt.start;
  const sttStop = stt.stop;
  const sttReset = stt.reset;
  const setAnswerStartedAt = useInterviewRoomStore((s) => s.setAnswerStartedAt);

  // Submit what the mic heard (Stop & send button in the transcript panel).
  const voiceSend = useCallback(() => {
    const text = stt.finalTranscript.trim();
    sttStop();
    if (text) void submitAnswer(text);
  }, [stt.finalTranscript, sttStop, submitAnswer]);

  // User switched to typing — stop the mic without submitting.
  const voiceStop = useCallback(() => {
    setAnswerStartedAt(null);
    sttStop();
  }, [setAnswerStartedAt, sttStop]);

  // What the mic currently hears (settled + live partials).
  const liveCaption = stt.interimTranscript
    ? `${stt.finalTranscript} ${stt.interimTranscript}`.trim()
    : stt.finalTranscript;

  // Keep the recognizer in sync with the room: LISTENING + mic granted →
  // listen for the answer; anything else → stop. Starting a fresh window
  // wipes the previous answer's transcript.
  useEffect(() => {
    if (status === "listening" && media.micStatus === "granted" && media.audioEnabled) {
      setAnswerStartedAt(Date.now());
      sttReset();
      sttStart();
    } else {
      setAnswerStartedAt(null);
      sttStop();
    }
  }, [status, media.micStatus, media.audioEnabled, setAnswerStartedAt, sttReset, sttStart, sttStop]);

  const handleGranted = useCallback(
    (grant: { video: boolean; audio: boolean; note?: string }) => {
      if (grant.note) setError(grant.note);
      setStatus("ready");
    },
    [setError, setStatus]
  );

  const handleSkip = useCallback(() => setStatus("ready"), [setStatus]);

  const restart = useCallback(() => {
    resetRoom();
    setStatus("idle");
  }, [resetRoom, setStatus]);

  // ---- Auth / setup gates --------------------------------------------------
  if (authLoading) {
    return <Centered><Loader2 className="h-6 w-6 animate-spin text-primary" />Checking your session…</Centered>;
  }
  if (!configured) {
    return (
      <Centered>
        <p className="text-lg font-semibold text-text-primary">Sign-in isn&apos;t configured on this build</p>
        <p className="mt-2 max-w-md text-sm text-text-secondary">
          Interviews are tied to a signed-in account. Add your Supabase keys to the environment to
          enable the interview room.
        </p>
        <Button asChild className="mt-6">
          <Link href="/ai-mock-interview">Back to AI Interview <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </Centered>
    );
  }
  if (!user) {
    return (
      <Centered>
        <LogIn className="h-10 w-10 text-primary" />
        <p className="mt-4 text-lg font-semibold text-text-primary">Sign in to start your interview</p>
        <p className="mt-2 max-w-md text-sm text-text-secondary">
          Your session, answers and report are saved to your account.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/ai-mock-interview/auth?next=/ai-mock-interview/room">
            Sign in or create an account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </Centered>
    );
  }
  if (!setupComplete) {
    return (
      <Centered>
        <Bot className="h-10 w-10 text-primary" />
        <p className="mt-4 text-lg font-semibold text-text-primary">Set up your interview first</p>
        <p className="mt-2 max-w-md text-sm text-text-secondary">
          Choose your role, domain, company and preferences before entering the room.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/ai-mock-interview/setup">Go to setup <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </Centered>
    );
  }

  // ---- Completion ----------------------------------------------------------
  if (status === "completed") {
    return (
      <Centered>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-light text-success">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <p className="mt-5 text-2xl font-bold text-text-primary">Interview complete</p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
          Your session was saved to your account. The full evaluation — scores, question analysis
          and an improvement plan — arrives with the evaluation engine.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button onClick={restart}>
            <RefreshCw className="h-4 w-4" />
            Practice again
          </Button>
          <Button asChild variant="secondary">
            <Link href="/ai-mock-interview/setup">
              Try another role
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/ai-mock-interview">Back to AI Interview</Link>
          </Button>
        </div>
      </Centered>
    );
  }

  const live = isInterviewLive(status);
  const preStart = status === "idle" || status === "preparing" || status === "ready";

  // ---- Pre-start stage (permissions + consent) -----------------------------
  if (preStart) {
    return (
      <section className="container-page py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 text-center">
            <Capsule variant="primary" dot className="mb-4">Interview Room</Capsule>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              {roleName} · {domainName}
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              {typeName} interview · {setup.durationMinutes} minutes
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <VideoPanel
              stream={media.stream}
              videoEnabled={media.videoEnabled}
              cameraStatus={media.cameraStatus}
            />
            <AIInterviewerPanel status={status} />
          </div>

          {status === "ready" && (
            <div className="mt-6 rounded-2xl border border-border bg-surface p-6 sm:p-7">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-text-primary">
                  {media.cameraStatus === "granted" ? "Camera ready" : "Text mode"} ·{" "}
                  {media.micStatus === "granted" ? "Microphone ready" : "No microphone"}
                </p>
                <p className="text-xs text-text-muted">
                  <Video className="mr-1 inline h-3.5 w-3.5" />
                  Preview — not live yet
                </p>
              </div>

              <RecordingConsent
                checked={recordingConsent}
                onChange={setRecordingConsent}
                disabled={creating || starting}
              />

              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-error/30 bg-error-light px-4 py-3 text-sm text-error"
                >
                  {error}
                </p>
              )}

              <Button
                size="lg"
                className="mt-6 w-full"
                onClick={beginInterview}
                disabled={!recordingConsent || creating || starting}
              >
                {creating || starting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Preparing interview…
                  </>
                ) : (
                  <>
                    <Video className="h-4 w-4" />
                    Begin interview
                  </>
                )}
              </Button>
              <p className="mt-3 text-center text-xs text-text-muted">
                Starting creates your session and saves every question and answer to your account.
              </p>
            </div>
          )}

          {status === "preparing" && (
            <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border border-border bg-surface py-6 text-sm font-medium text-text-secondary">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Preparing interview…
            </div>
          )}

          <PermissionModal
            open={status === "idle"}
            cameraStatus={media.cameraStatus}
            micStatus={media.micStatus}
            error={media.error}
            onRequest={media.requestMedia}
            onGranted={handleGranted}
            onSkip={handleSkip}
            onNotNow={() => {
              stopMedia();
              window.location.href = "/ai-mock-interview";
            }}
          />
        </div>
      </section>
    );
  }

  // ---- Live stage ----------------------------------------------------------
  return (
    <section className="container-page py-6 sm:py-8">
      {/* Header: LIVE badge + timer */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Capsule variant="primary" dot className="hidden sm:flex">
            AI Interview
          </Capsule>
          <div>
            <h1 className="text-lg font-bold text-text-primary">{roleName} · {domainName}</h1>
            <p className="text-xs text-text-muted">{typeName} interview</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-full border border-error/40 bg-error/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-error">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-error" />
            </span>
            Live
          </span>
          <InterviewTimer
            durationMinutes={setup.durationMinutes ?? 20}
            elapsedSeconds={elapsedSeconds}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
        <div className="space-y-4">
          <VideoPanel
            stream={media.stream}
            videoEnabled={media.videoEnabled}
            cameraStatus={media.cameraStatus}
          />
          <QuestionPanel status={status} question={currentQuestion} />
        </div>
        <div className="space-y-4">
          <AIInterviewerPanel status={status} />
          <TranscriptPanel
            onSubmitAnswer={submitAnswer}
            submitting={engineBusy || status === "processing"}
            voiceSupported={stt.supported}
            voiceListening={stt.listening}
            liveCaption={liveCaption}
            voiceError={stt.error}
            onVoiceSend={voiceSend}
            onVoiceStop={voiceStop}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-error/30 bg-error-light px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}

      <div className="mt-5 rounded-2xl border border-border bg-surface p-4">
        <InterviewControls
          videoEnabled={media.videoEnabled}
          audioEnabled={media.audioEnabled}
          cameraStatus={media.cameraStatus}
          micStatus={media.micStatus}
          speakerEnabled={tts.enabled}
          speakerSupported={tts.supported}
          onToggleVideo={media.toggleVideo}
          onToggleAudio={media.toggleAudio}
          onToggleSpeaker={() => tts.setEnabled(!tts.enabled)}
          onEnd={() => setConfirmEnd(true)}
          live={live}
          ending={status === "ending"}
        />
      </div>

      {/* End confirmation */}
      <Dialog open={confirmEnd}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>End the interview?</DialogTitle>
            <DialogDescription>
              Your session is saved — you can review the transcript and come back to practice again
              anytime.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmEnd(false)} disabled={ending}>
              Keep going
            </Button>
            <Button variant="danger" onClick={endInterview} disabled={ending}>
              {ending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ending…
                </>
              ) : (
                "End interview"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <section className="container-page py-16 sm:py-24">
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center text-center">
        {children}
      </div>
    </section>
  );
}
