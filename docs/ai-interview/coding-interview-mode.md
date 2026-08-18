# Coding Interview Mode — Mini Design

> Phase 13 advanced feature (master spec §13, §101). Per `05-phase-commands.md`
> this item needs a design doc **before any code** — this doc is that gate and
> it has been **implemented as designed** (see status note below).
> Premium/flag-gated, no payments wired (§107).

> **Implementation status (2026-08-18):** built exactly per this doc —
> `coding` interview type (Pro-badged when the flag is off), coding problem
> prompt + coding evaluation prompt (AI + deterministic heuristic fallbacks),
> room CodingPanel (statement + editor, no camera/mic/TTS), report "Your
> coding solutions" card rendered from persisted evaluations (never via the
> AI report). No new tables, no new endpoints.

## 1. What it is

A new interview type that replaces the Q&A loop with a **live coding problem**:

- The AI poses a problem statement (with examples + constraints), not a prose question.
- The candidate writes code in an in-browser editor (monaco-free, plain textarea with
  line numbers for MVP) — no external judge service.
- The AI (or heuristic fallback) evaluates the **solution text** against expected
  concepts: algorithm choice, complexity, edge cases, code quality.
- Report gains a "coding" section: problem, submitted code, per-dimension scores
  (correctness-adjacent, complexity, edge cases, readability), improvement notes.

## 2. Screens (2–4)

1. **Coding problem screen** — problem statement panel (left) + code editor panel
   (right) + run/next controls. Reuses the room shell (VideoPanel optional — hidden
   in coding mode; mic optional).
2. **Submit & evaluate** — on submit, the answer text is stored as a `coding` answer;
   the existing evaluate loop runs with a coding evaluation context.
3. **Report section** — existing `/report/:sessionId` gains a coding card.

No new top-level pages: the room's live stage switches to the coding layout when
`interview_type = coding` (new type id `coding`).

## 3. Data model diff

No new tables. Reuse:

- `interview_questions` — `question_type = 'coding'`, `question` holds the problem
  statement (JSON string: {statement, examples, constraints}).
- `interview_answers` — `transcript` holds the submitted code.
- `interview_evaluations` — unchanged; the §54 dimensions already cover
  correctness/quality. Add nothing.
- `interview_sessions.config` — add `interviewTypeId: 'coding'` (already generic).

## 4. API diff

- `POST /answer/evaluate` — already works; evaluation prompt gets a coding variant
  (`prompts/evaluation/evaluation-coding-v1.ts`) selected by question type.
- `GET /question/generate` — question prompt gets a coding variant
  (`prompts/question/question-coding-v1.ts`): emit problem statements instead of prose.
- No new endpoints.

## 5. Gating

- Flag: `INTERVIEW_PREMIUM_FEATURES=coding_interviews` (`config/flags.ts`).
- Setup wizard: the coding interview type card shows a Pro badge when the flag is off.
- Heuristic fallbacks cover both prompts so the flow never hard-fails (§74).

## 6. Out of scope (explicit)

- No code execution / unit-test harness (external judge) — needs its own design.
- No autocomplete/IDE features — plain editor for MVP.
- No real-time shared whiteboard — that's the separate whiteboard design.
