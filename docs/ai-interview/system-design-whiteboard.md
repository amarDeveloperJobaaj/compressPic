# System Design Whiteboard — Mini Design

> Phase 13 advanced feature (master spec §13, §101). Design doc **before any
> code** (per `05-phase-commands.md`). No code exists yet. Premium/flag-gated,
> no payments wired (§107).

## 1. What it is

A system-design interview mode with a **canvas-based whiteboard**:

- The AI poses a system design prompt (e.g. "Design a URL shortener") with
  requirements + constraints.
- The candidate draws on a canvas — boxes, arrows, labels (SVG-based, no heavy
  library for MVP) — and/or types an architecture explanation.
- The AI evaluates the submission on design dimensions: requirements coverage,
  architecture quality, scalability/consistency trade-offs, data model, API
  surface, communication of the design.
- Report gains a "system design" section with the canvas snapshot + scores.

## 2. Screens (2–4)

1. **Whiteboard screen** — prompt panel (left) + canvas (center) + shape/toolbar
   (box, arrow, text, pan) + clear/undo. Reuses the room shell.
2. **Submit & evaluate** — the canvas is serialized to JSON (nodes/edges) and stored
   as the answer transcript; optional text explanation appended.
3. **Report section** — existing report page renders the canvas JSON (read-only
   SVG) + design scores.

No new top-level pages: the room's live stage renders the whiteboard layout when
`interview_type = system_design`.

## 3. Data model diff

No new tables. Reuse:

- `interview_questions` — `question_type = 'system_design'`, `question` = prompt JSON.
- `interview_answers` — `transcript` = canvas JSON (`{nodes, edges, text}` string),
  `duration_seconds` = time on the whiteboard.
- `interview_evaluations` — unchanged (design dimensions map to the §54 model via
  a design-specific prompt).
- `interview_sessions.config` — add `interviewTypeId: 'system_design'` (already generic).

## 4. API diff

- `POST /answer/evaluate` — evaluation prompt variant
  (`prompts/evaluation/evaluation-design-v1.ts`) selected by question type; heuristic
  fallback scores design dimensions deterministically.
- `GET /question/generate` — question prompt variant
  (`prompts/question/question-design-v1.ts`): emit design prompts instead of prose.
- No new endpoints. The canvas serialization happens fully client-side.

## 5. Gating

- Flag: `INTERVIEW_PREMIUM_FEATURES=system_design` (`config/flags.ts`).
- Setup wizard: the system-design type card shows a Pro badge when the flag is off.
- Heuristic fallbacks cover both prompts so the flow never hard-fails (§74).

## 6. Out of scope (explicit)

- Real-time collaboration / multi-user canvas — own design later.
- Complex diagram rendering (sequence diagrams, infrastructure icons) — MVP is
  boxes + arrows + labels.
- Live code execution — covered by the coding-interview design.
