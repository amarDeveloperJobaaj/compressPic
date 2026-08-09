# AI Interview Tool — Phase-Wise Commands (PHASE 0 → 13, per master spec §90/§113)

Copy ONE phase below the `===` line and paste to the AI (fresh chat) after it has read all files in this folder. Each phase ends only when lint+build pass and the user approves. Strict order — do not skip or jump.

## How to Use

1. Start AI chat with: `Read ai-interview-tool/00-master-spec.md, 01-rules.md, 03-tool-info.md, 06-seo.md, 07-github-workflow.md, 04-instructions.md and then execute the phase I paste.`
2. Paste ONE phase per message.
3. Every phase = new branch `feature/ai-interview/phase-<N>-<slug>` + Conventional Commits + push. The AI must NOT merge — report the branch, wait for your approval.
4. After the phase, run `npm run lint` + `npm run build` yourself, walk the flow in browser, then paste the next phase.

---

## PHASE 0 — Architecture & Research

**branch:** `feature/ai-interview/phase-0-research`

```
Follow ai-interview-tool/00-master-spec.md §90-PHASE0, 01-rules.md, 07-github-workflow.md.
Execute PHASE 0 (research only — write NO product code):
1. Create branch feature/ai-interview/phase-0-research from main; commit docs-type changes with Conventional Commits; push; DO NOT merge; report.
2. Inspect the repository: existing app/ route groups, features/* pattern, components/ui + shared + seo inventory, auth (app/api/auth, lib/supabase), ALL_TOOLS registry in lib/tools.ts, sitemap.ts, theme/tokens, existing upload + validation + toast patterns.
3. Produce architecture notes in ai-interview-tool/architecture-notes.md:
   - Map of routes to reuse for landing/setup/room/report
   - Reusable component list (buttons, cards, upload, modal, spinner, toast)
   - Existing auth + DB + storage utilities to reuse
   - AI provider plan (env vars, abstraction)
   - Risk list (streaming, media permissions, RLS)
4. Completion: architecture understood; architecture-notes.md committed; build still green.
```

---

## PHASE 1 — Product Foundation

**branch:** `feature/ai-interview/phase-1-foundation`

```
Follow ai-interview-tool/00-master-spec.md §90-PHASE1, 03-tool-info.md, 06-seo.md, 07-github-workflow.md. Execute PHASE 1:

GIT: branch feature/ai-interview/phase-1-foundation; Conventional Commits per step; push at end; DO NOT merge.

1. Create features/ai-interview skeleton: components/, services/, schemas/, types/, prompts/, hooks/, store/, data/, utils/ + data/roles.ts, data/companies.ts, data/domains.ts, data/interview-types.ts (values exactly from 03-tool-info.md).
2. Landing page app/ai-mock-interview/page.tsx — full SEO page per 06-seo.md: hero ("Practice Interviews. Get Real Feedback."), How It Works (3–4 steps), Resume upload tease, role grid cards, Meet the AI Interviewer, Realistic Interview, Detailed AI Feedback, Skill Analysis, progress teaser, FAQ (6+), final CTA; generateMetadata complete; JSON-LD SoftwareApplication + FAQPage; layout.tsx reusing site shell; sitemap entry via lib/tools.ts + manual role-page entries planned.
3. Setup route app/ai-mock-interview/setup/page.tsx + InterviewSetup wizard (StepWizard): Step1 role + domain (+depth preselected), Step2 company + level, Step3 interview type + duration + resume uploader; step-level zod validation; progress bar; noindex. State in store/interview-store.ts (zustand).
4. Commit steps individually (feat: landing page, feat: setup wizard, feat: registry+sitemap).

Requirements: server components, framer-motion minimal, dark mode OK, keywords per 06-seo.md, no lorem. Verify lint + build + walk setup flow (no resume and with resume).
```

---

## PHASE 2 — Resume Intelligence

**branch:** `feature/ai-interview/phase-2-resume`

```
Follow 00-master-spec.md §18–21, §42 (resumes), 03-tool-info.md, 07-github-workflow.md. Execute PHASE 2:

GIT: branch feature/ai-interview/phase-2-resume; Conventional Commits; push; DO NOT merge.

1. Resume upload: POST /api/interview/resume/upload (multipart, file-type/size validation, Supabase storage, user-scoped RLS), POST /api/interview/resume/analyze (extract text; PDF only MVP).
2. services/resume/: extract-text (pdf), normalize; services/ai/: AIProvider.analyzeResume → Zod-validated CandidateProfile (§19) — treat resume text strictly as data (prompt-injection protection §73).
3. prompts/resume/resume-analysis-v1.ts + versioning folder structure (prompts/question, /followup, /evaluation, /report placeholders with their version files).
4. UI: resume uploader inside setup with progress, analyze status states ("Analyzing resume..."), retry/fallback, and "Skip resume" path for non-file interviews.
5. schemas/resume.ts + interviews; connect store with candidate profile.

Verify lint + build; upload a PDF resume and inspect structured profile output.
```

---

## PHASE 3 — Interview Session Engine

**branch: `feature/ai-interview/phase-3-session`**

```
Follow 00-master-spec.md §40, §43–47, §76, §79 + 03-tool-info.md + 07-github-workflow.md. Execute PHASE 3:

GIT: branch feature/ai-interview/phase-3-session; Conventional step commits; push; DO NOT merge.

1. Supabase schema (migrations under supabase/migrations/): resumes, interview_sessions, interview_questions, interview_answers, interview_evaluations, interview_reports exactly per §42–47 (RLS user-scoped).
2. POST /api/interview/session/create (auth-only, derives user from session, fills defaults), GET /api/interview/session/:id (ownership gate), POST start/end (status transitions; end sets ended_at, overall_score later).
3. services/interview/: session service (create/store-state/question-store/answer-store) + basic sql row maps; error handling; enum status Server state IDLE→…→COMPLETED per §43 status values.
4. RESTORE: session recovery endpoint GET restores transcript/questions on reconnect (§76); store locally + persist rows per question/answer as asked (no per-keystroke writes).

Verify lint + build; create a session via API as the authed user; assert ownership 403 for another user.
```

---

## PHASE 4 — Interview Room UI

**branch:** `feature/ai-interview/phase-4-room`

```
GIT: branch feature/ai-interview/phase-4-room; commits; push; DO NOT merge.

1. Room page app/ai-mock-interview/room/page.tsx + InterviewRoom: header (LIVE badge, timer), USER CAMERA video element, AIInterviewer panel (visual states: listening/thinking/speaking/processing/waiting with radial/label animation), QuestionPanel (text stress display), TranscriptPanel, InterviewControls (mic toggle, camera toggle, speaker toggle, End with confirm), Timer.
2. PermissionModal: getMedia explanation → getUserMedia(video+audio) → clear failure states (§75) with audio-only / text-only fallbacks; request permissions only when starting the room (§30).
3. RecordingConsent (§31): checkbox visible when recording enabled; consent stored with session.
4. Responsive: desktop primary layout per §12; mobile stacked §16; dark room theme keeps site tokens; keyboard navigation + focus states + ARIA.
5. Interview states UI map exactly §79 (READY/ACTIVE/…) and LoadingStates per §78.

Verify lint + build; walk room with/without camera, with/without mic, fallbacks.
```

---

## PHASE 5 — AI Question Engine

**branch:** `feature/ai-interview/phase-5-question-engine`

```
GIT: branch feature/ai-interview/phase-5-question-engine; Conventional commits; push; DO NOT merge.

1. services/ai/: AIProvider full interface (generateQuestion, generateFollowUp, evaluateAnswer, generateReport, analyzeResume) + one provider (env-selectable: openai/gemini/deepseek/claude via AI_PROVIDER + AI_API_KEY) — server-only §34.
2. POST /api/interview/question/generate: builds prompt via prompts/question/question-v1 (context scaffolding §52) demanding the strict JSON (action/question/topic/difficulty/reason per §53); zod; retry once then fallback topic picker.
3. POST /api/interview/question/follow-up: same, inputs = latest transcript + candidate profile summary.
4. Store questions (interview_questions rows with parent_question_id for follow-ups, sequence).
5. Difficulty levels Beginner→Expert default mapping on role/level; difficulty hint on question JSON influences follow-up depth.

Verify lint + build; ask 3+ questions in a raw session and validate output structure.
```

---

## PHASE 6 — Speech & Voice Loop (branch: `feature/ai-interview/phase-6-voice`)

```
GIT: branch feature/ai-interview/phase-6-voice; commit; push; DO NOT merge.

1. services/speech/ (SpeechToTextProvider): browser SpeechRecognition impl + fallbacks; POST /api/interview/answer/transcribe (if server STT later) — MVP runs in-browser; transcript stored via answers; transcript utility (filler detection list: um/umm/uh/like/basically/actually/you know/so + pace words-per-minute).
2. services/tts/ (TextToSpeechProvider): browser SpeechSynthesis impl; question text always visible; speak on question, stop on demand.
3. Listening/Speaking/Processing states driven by the state machine (§79) and UI states from components.
4. Manual text fallback for any denied/broken voice, always reachable.
5. Microphone permission flow reuses PermissionModal (Phase 4).

Verify lint + build + full voice ride: ask yourself, answer speak, transcript appears, next question spoken.
```

---

## PHASE 7 — Adaptive Interview Engine (branch: `feature/ai-interview/phase-7-adaptive`)

```
GIT: branch feature/ai-interview/phase-7-adaptive; commit; push; DO NOT merge.

1. POST /api/interview/answer/evaluate: transcript + context → §54 dimensions via evaluateAnswer (zod) — one call per answer (no per-keystroke calls, §38).
2. Adaptive controller in services/interview/engine.ts: holds §40 session state (topic, difficulty, performance summaries, remaining time) and picks next action from evaluateAnswer + §53 decision table (strong→harder follow-up, weak→clarification, etc. §24).
3. END_INTERVIEW rules: time budget done / question budget done / user ends; ONLY engine ends (engine action).
4. store/interview-store.ts: full state machine returns to ACTIVE; all transitions testable (unit-test the controller).

Verify lint + build + run a scripted 5-answer session; log the decision trail (follow-up vs new topic vs difficulty).
```

---

## PHASE 8 — Evaluation Engine (branch: `feature/ai-interview/phase-8-evaluation`)

```
GIT: branch feature/ai-interview/phase-8-evaluation; commit; push; DO NOT merge.

1. POST /api/interview/answer/evaluate: persist interview_evaluations per answer_id (technical / relevance / completeness / clarity / structure / depth / answer quality), zod; failure → retry once → graceful neutral fallback.
2. Communication metric pipeline (utils/transcript.ts): filler words count + most frequent + pace words/min + long-pause markers → stored in evaluation notes (disclaiming "practice metrics" §55–57).
3. Fixed evaluation dataset file (features/ai-interview/data/eval-dataset.ts) with sample Q/A + expected score ranges; `npm run eval ` script executing run evaluations → report deltas (used later and when prompts change).
4. Equal scoring weights per dimension fill start (weights table integration later in Phase 9).

Verify: evaluations persisted; filler/pace outputs correct on a sample transcript.
```

---

## PHASE 9 — Final Report

**branch:** `feature/ai-interview/phase-9-report` — push; DO NOT merge.

```
1. POST /api/interview/report/generate (server): takes interview + evaluations → one structured call → zod-validated report §58–63 (+ improvement plan §62); fallback summary if AI fails (§74).
2. app/ai-mock-interview/report/page.tsx + InterviewReport: ScoreRing, category bars, per-question accordion (Question → your answer → scores → good/missing/improve), StrengthsCard, WeaknessesCard, ImprovementCard (prioritized with topics), communication metrics section, recommended-topics chips, next-interview card.
3. Industrial weights per configured scoring model (§97) == overall computed server-side; store interview_reports + sessions.overall_score (write once).
4. CTA: "Practice Again" (same config) / "Try Another Role" → setup; report export as .txt (optional).

Verify lint + build + end-to-end: full session → real report page rendered from DB row.
```

---

## PHASE 10 — History & Progress

**branch:** `feature/ai-interview/phase-10-history`

```
GIT: branch feature/ai-interview/phase-10-history; commit; push; DO NOT merge.

1. GET /api/interview/history (auth-scoped): recent sessions + reports (list page app/ai-mock-interview/history); delete session endpoint exists; interview_metrics table for trend data.
2. History UI: Recent Interviews cards (§66), score, duration, role/company; detail link to report; restart.
3. Progress view (future-v1): per-skill bars from existing evaluations + trend line (score waterfall over sessions) — simple, no chart library if avoidable (reuse existing chart/utility if any).
4. Props: user = user-scoped only (RLS re-check).

Verify lint + build + run 2 interviews → history shows 2, delete one removes it for that user only.
```

---

## PHASE 11 — Optimization

**branch:** `feature/ai-interview/phase-11-optimization`

```
GIT: branch feature/ai-interview/phase-11-optimization; commit; push; DO NOT merge.

1. Cost: cap context per call (transcript summarizer), one evaluation per answer, no redundant calls, streaming responses where supported (ReadableStream for LLM replies), audio compression for any uploaded segments.
2. Caching: company/domain → question hot-cache only where safe; report regeneration cache keyed by session id.
3. Rate limits: interview endpoints per-user (e.g. 30 sessions/hour); resume analyze token budget; monitoring: latency + token counters (console via instrumented existing logger patterns).
4. Performance: media toggle not blocking UI, layout shifts for permission states, reduce motion.

Verify: lint + build + an interview measured (~§38 cost notes in report?) — keep notes.
```

---

## PHASE 12 — Production Hardening

**branch:** `feature/ai-interview/phase-12-hardening`

```
GIT: branch feature/ai-interview/phase-12-hardening; Conventional Commits; push; DO NOT merge.

1. Security: auth+ownership matrix tests; rate limiting on all interview APIs; zod on all bodies; upload validation (type/size/magic bytes); API keys server-only; prompt-injection rule tests (resume containing "ignore previous instructions").
2. Privacy: consent stored with session; data retention note on report + history (delete everywhere); recording consent captured before any capture.
3. Robustness: camera/mic/timer fallbacks; AI output validation retry; session restore on refresh; error toasts; error boundaries on room and report.
4. Observability: log failure events (no raw transcripts), alert on high failure rate; analytics events (§80) wired to existing analytics if present else console+table.
5. Final QA: Lighthouse on landing (90+), cross-browser quick pass, mobile walk.

Verify: lint + build + list of security checks in the PR body; run a quick smoke of each endpoint as non-owner (403) and unauthenticated (401).
```

---

## PHASE 13 — Advanced Features (future)

**branch:** `feature/ai-interview/phase-13-advanced`

```
GIT: branch feature/ai-interview/phase-13-advanced; commit; push; DO NOT merge.

Only after PHASE 12 is merged and stable — implement ONE scope at a time, each on this branch or consecutive approved merge cycle:
1. High-volume: interviewer personalities (§70), multi-round interviews (§71), skill dashboards.
2. (Big) Coding interview mode → design doc first; system design whiteboard → design doc first; interview replay (permissions) — own steps.
3. Monetization hooks: credit system (quota per tier) via feature flags (§107) — no payments yet.

Every advanced item needs its own mini design (2–4 screens, data model diff, API diff) before code. Verify: lint + build + design doc accepted before each implementation.
```

---

## Phase Subscription Notes

The user may pause at any phase: mark the branch state, report, wait. Phase numbering here = master spec numbering (§90, §113): phases are sequential — never skip one.