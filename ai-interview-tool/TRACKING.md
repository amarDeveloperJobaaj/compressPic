# AI Interview Tool — Progress & Tracking File

**This file is the source of truth for WHAT is done, and WHEN. The AI MUST update it after every single change (every phase, every task, every merge) before completing its turn — same branch, same commit as the phase work.**

---

## How The AI Must Use This File (binding)

1. After finishing ANY phase work, update this file BEFORE commiting:
   - Move the phase status to one of: `NOT STARTED` / `IN PROGRESS` / `COMPLETED`
   - Tick the completed tasks in that phase's checklist (add new tasks if work was added)
   - Update `Recent Updates` log (add a dated row)
   - If the flow / architecture / contracts changed, update the Flow, **Flowchart**, and How-It-Works sections so they always describe reality
2. Commit it together with the phase work: `docs: update tracking file for phase N`
3. When the user merges the branch: mark in the same row the branch as `merged ✓` and log the merge date.

---

## Master Status — PHASES 0–13

> Date: **2026-08-09** · Current branch: `main` · Everything below marks the CURRENT state.

| # | Phase | Branch (`feature/ai-interview/…`) | Status | Last updated |
|---|---|---|---|---|
| 0 | Architecture & Research | `phase-0-research` | `COMPLETED · merged ✓` | 2026-08-09 |
| 1 | Product Foundation (landing + setup) | `phase-1-foundation` | `COMPLETED · merged ✓` | 2026-08-09 |
| 2 | Resume Intelligence | `phase-2-resume` | `COMPLETED · merged ✓` | 2026-08-11 |
| 3 | Interview Session Engine | `phase-3-session` | `COMPLETED · merged ✓` | 2026-08-18 |
| 4 | Interview Room UI | `phase-4-room` | `COMPLETED · merged ✓` | 2026-08-18 |
| 5 | AI Question Engine | `phase-5-question-engine` | `COMPLETED · merged ✓` | 2026-08-18 |
| 6 | Speech & Voice Loop | `phase-6-voice` | `COMPLETED · merged ✓` | 2026-08-18 |
| 7 | Adaptive Interview Engine | `phase-7-adaptive` | `COMPLETED · merged ✓` | 2026-08-18 |
| 8 | Evaluation Engine | `phase-8-evaluation` | `IN PROGRESS` (built · verified · awaiting merge) | 2026-08-18 |
| 9 | Final Report | `phase-9-report` | `IN PROGRESS` (built · verified · awaiting merge) | 2026-08-18 |
| 10 | History & Progress | `phase-10-history` | `IN PROGRESS` (built · verified · awaiting merge) | 2026-08-18 |
| 11 | Optimization | `phase-11-optimization` | `IN PROGRESS` (built · verified · awaiting merge) | 2026-08-18 |
| 12 | Production Hardening | `phase-12-hardening` | `IN PROGRESS` (built · verified · awaiting merge) | 2026-08-18 |
| 13 | Advanced Features | `phase-13-advanced` | `IN PROGRESS` (built · verified · awaiting merge) | 2026-08-18 |

### Phase detail (checklists)

#### Phase 0 — Architecture & Research
| Task | Done? | Notes |
|---|---|---|
| Repository audit (routes, components, auth, DB, API patterns) | [x] | audit done 2026-08-09 |
| Reusable component list | [x] | §4 of architecture-notes.md |
| Architecture notes (ai-interview-tool/architecture-notes.md) | [x] | created on phase-0-research |
| Risk list (media, streaming, RLS) | [x] | §9 of architecture-notes.md |

> Status: `COMPLETED ✓` — merged to `main` on 2026-08-09 (merge commit `63db455`).

#### Phase 1 — Product Foundation
| Task | Done? | Notes |
|---|---|---|
| features/ai-interview skeleton + data files (roles/companies/domains/types) | [x] | + experience-levels, durations, faqs, types, schemas, zustand store |
| Landing page with SEO (metadata + JSON-LD + FAQ) | [x] | /ai-mock-interview — hero, how-it-works, roles, features, report preview, FAQ, CTA |
| Setup wizard (role → company → type + resume) | [x] | 3 steps, zod per step, progress bar, noindex, resume capture (analysis in Phase 2) |
| `lib/tools.ts` registry + sitemap update | [x] | new "AI Tools" category; sitemap auto-derived from ALL_TOOLS |

> Status: `COMPLETED ✓` — merged to `main` on 2026-08-09 (merge commit `cbf75a3`).

#### Phase 2 — Resume Intelligence
| Task | Done? | Notes |
|---|---|---|
| Resume upload API + Supabase storage (`resumes` bucket, private) | [x] | `POST /api/interview/resume/upload` — PDF-only, ≤10 MB, private bucket, graceful storage-off fallback |
| Resume analyze API → CandidateProfile (Zod §19) | [x] | `POST /api/interview/resume/analyze` — filePath or resumeText, Zod-validated, prompt-injection safe |
| PDF text extraction (server pdfjs + client fallback) | [x] | `services/resume/extract-text.ts` + `utils/pdf-client.ts` — runtime-verified on a real PDF |
| services/ai (provider abstraction + heuristic fallback) + prompts/resume (versioned) | [x] | OpenAI-compatible REST adapter (no SDK) + heuristic analyzer — runtime-verified (name/level/skills/projects/education/certs) |
| Resume uploader UI (progress, analyzing state, retry, fallback) + "Skip resume" | [x] | Candidate profile preview (name, level, skills, projects) in setup step 3 — browser-verified |
| Supabase migration `004_interview_resumes.sql` + `storage.sql` resumes bucket | [x] | private bucket, admin-only policies |

> Status: `COMPLETED ✓` — merged to `main` on 2026-08-11 (merge commit `a23b036`).

#### Phase 3 — Interview Session Engine
| Task | Done? | Notes |
|---|---|---|
| DB schema (resumes, sessions, questions, answers, evaluations, reports) | [x] | `005_interview_sessions.sql` — 6 tables, auth.uid() RLS, §79 status check, updated_at triggers, indexes; types hand-synced in `lib/supabase/database.types.ts` |
| Session create/get/start/end APIs (ownership) | [x] | create (201/400/401/503) + GET `:id` (recovery, 403 for non-owner) + start (409 on invalid transition) + end (idempotent) — all auth-only, server-derived user id |
| Session recovery on reconnect | [x] | `GET /api/interview/session/:id` returns session + ordered questions with answers (§76); service `getSessionRecovery` |
| User auth wired (per user decision) | [x] | Supabase Auth via browser client (no clash with admin `/api/auth/*`), `/ai-mock-interview/auth` page (sign in/up + email-confirm + not-configured states), `useAuth` hook, Start button gates to sign-in |

> Status: `COMPLETED ✓` — merged to `main` on 2026-08-18 (merge commit `47e3f5f`).

#### Phase 4 — Interview Room UI
| Task | Done? | Notes |
|---|---|---|
| Room page (camera, AI interviewer, controls, timer) | [x] | `/ai-mock-interview/room` + `InterviewRoom` orchestrator — LIVE badge, countdown timer (§11), VideoPanel, AIInterviewerPanel (pure-CSS avatar reused from landing), QuestionPanel, TranscriptPanel (local text fallback), controls bar; desktop grid + mobile stacked (§12/§16) |
| PermissionModal + getUserMedia fallbacks | [x] | explainer dialog (§30) → camera+mic → audio-only → video-only → text-only chain (§75), friendly per-error guidance, mic/cam toggles with live track state, stream cleanup on leave |
| RecordingConsent flow | [x] | checkbox before Start (§31), gates Begin; consent stored with the session (config.recordingConsent) |
| State-machine visuals (IDs per §79 of master spec) | [x] | room drives idle→preparing→ready→active→ending→completed; interviewer visual states (waiting/listening/thinking/speaking/processing/success) + §78 loading labels; LISTENING/PROCESSING/ASKING wired for Phase 5/6 |
| Session wiring (Phase 3 APIs) | [x] | create/start/end via session-client; recovery-shaped GET ready for reconnect (§76); auto-end when the time budget hits zero |

> Status: `COMPLETED ✓` — merged to `main` on 2026-08-18 (merge commit `47e3f5f`).

#### Phase 5 — AI Question Engine
| Task | Done? | Notes |
|---|---|---|
| AIProvider generateQuestion/generateFollowUp (typed §52 context) | [x] | OpenAI-compatible provider implements both with strict-JSON Zod validation → retry → heuristic fallback (§74); heuristic provider (no AI key) conducts the whole interview deterministically |
| Question generate API (Zod-validated strict JSON) | [x] | `POST /api/interview/question/generate` — first question; idempotent (re-returns the stored question on retry) |
| Follow-up API | [x] | `POST /api/interview/question/follow-up` — persists the answer (idempotent) + generates the next question in one round-trip |
| Questions stored with parent_question_id | [x] | FOLLOW_UP/CLARIFICATION link to the question they build on; sequences unique per session (migration `006`, retry on 23505) |
| Versioned question + follow-up prompts | [x] | `prompts/question/question-v1.ts` + `followup/followup-v1.ts` — professional interviewer, one question/turn, strict JSON (§53), DATA-only context (§73) |
| Heuristic question bank + difficulty system | [x] | `services/ai/heuristic-questions.ts` — domain/skill/project/behavioral/HR banks keyed by domain id, topic dedupe, rotating follow-ups, no repeats; initial difficulty from experience level |
| Engine drives §79 sub-states + persists answers | [x] | Room: Begin → ASKING → first question → LISTENING → answer → PROCESSING → next question; answers stored to `interview_answers`, §40 `current_state` kept in sync (questionsAsked/Answered, currentTopic, difficulty, currentQuestion) |
| Ownership + idempotency hardening | [x] | 403 for another user's session; start idempotent (retry-safe Begin); answer idempotent (unique `question_id` index); live verified vs live Supabase |

> Status: `COMPLETED ✓` — merged to `main` on 2026-08-18 (merge commit `47e3f5f`).

#### Phase 6 — Speech & Voice Loop
| Task | Done? | Notes |
|---|---|---|
| Browser STT (SpeechRecognition) + text fallback | [x] | `services/speech/speech-to-text.ts` — `SpeechToTextProvider` abstraction (§35) + Chromium-only browser impl (minimal typing, not in lib.dom); `useSpeechRecognition` hook: continuous + interim results, silence auto-submit (3s), generation guard against stale recognizer events, friendly per-error messages; text input always reachable (§75) |
| Browser TTS (SpeechSynthesis), question text always shown | [x] | `services/tts/text-to-speech.ts` — `TextToSpeechProvider` abstraction (§36) + browser impl (voice pick, cancel-on-speak, pause watchdog, resolve-on-end); `useTextToSpeech` hook; speaker toggle in controls; question text always visible (§29) |
| Filler words + pace metrics util | [x] | `utils/transcript.ts` — §56 filler list (um/umm/uh/like/basically/actually/you know/so, clause-start rule for "so") + §57 words-per-minute + pace bands; `analyzeTranscript`; 9 unit tests |
| Listening/speaking states wired to state machine | [x] | new `speaking` §79 sub-state (enum + transitions + migration `007` status check); room loop: ASKING → SPEAKING (TTS) → LISTENING (STT) → PROCESSING → next question; spoken `durationSeconds` stored with answers for Phase 8 pace; migration `007_speech_status.sql` |

> Status: `COMPLETED ✓` — merged to `main` on 2026-08-18 (merge commit `47e3f5f`).

#### Phase 7 — Adaptive Interview Engine
| Task | Done? | Notes |
|---|---|---|
| Answer evaluate API (dimensions §54) | [x] | `POST /api/interview/answer/evaluate` — evaluates the stored answer on the six §54 dimensions (Zod-strict via the shared provider path, heuristic fallback) and returns overall + verdict; ownership 403/404 |
| Adaptive controller (follow-up vs new topic vs difficulty) | [x] | `services/interview/adaptive-controller.ts` — pure §24 mapping (excellent→NEW_TOPIC harder, strong→FOLLOW_UP harder, good→NEW_TOPIC, weak→CLARIFICATION simpler, wrong→concept check) + §25 difficulty ladder + follow-up depth cap; provider writes the question honoring `adaptiveIntent` (prompt v1 + heuristic) |
| END_INTERVIEW rules (time/question budget) | [x] | controller `shouldEndInterview` — time ≤ 0 OR questions ≥ budget (~1 per 2 min, §40) → engine finalizes the session (completed + ended_at) and the room closes; client turn type now carries `ended` |
| Session-state store (topic, difficulty, performance) | [x] | §40 `current_state` updated per turn: currentTopic, controller difficulty, questionsAsked/Answered, and a running `performanceSummary` (overall avg, per-topic avg, verdict counts) via `mergePerformance` |

> Status: `COMPLETED ✓` — merged to `main` on 2026-08-18 (merge commit `47e3f5f`).

#### Phase 8 — Evaluation Engine
| Task | Done? | Notes |
|---|---|---|
| interview_evaluations persistence | [x] | `evaluation-store.ts` — idempotent upsert keyed on `answer_id` (migration `008` unique index + `overall_score`/`verdict`/`metrics` columns); §46→§54 column mapping documented; ownership re-verified server-side; wired into the turn loop + `POST /answer/evaluate`; `GET /session/:id/evaluations` returns per-question evaluations in order |
| Communication metrics pipeline | [x] | `communication-metrics.ts` — pure builder on `analyzeTranscript` (word count, filler count + ratio, most frequent fillers, WPM, pace band); stored in the evaluation `metrics` jsonb; 5 unit tests |
| Eval dataset + runnable script | [x] | `eval-dataset.ts` (7 curated cases: strong/brief/filler-heavy/off-topic/mid-depth/expert/verbose-slow with verdict + overall + pace expectations) + `scripts/run-eval-dataset.ts` — deterministic heuristic harness, 7/7 pass |

#### Phase 9 — Final Report
| Task | Done? | Notes |
|---|---|---|
| Report generation API (single call, Zod) | [x] | `POST /api/interview/report/generate` — one call: completed-session guard (409), deterministic scores, provider report (Zod-strict `schemas/report.ts` §58–63, heuristic fallback §74), idempotent upsert (migration `009` unique session_id); `GET /session/:id/report` fetches the stored report |
| Report page (score ring, categories, per-question, improvement plan) | [x] | `/ai-mock-interview/report/[sessionId]` — server-rendered: score ring (conic gradient), 5 category bars, strengths/weaknesses, prioritized improvement plan, communication metrics, recommended topics, per-question analysis, next-interview suggestion; generates-if-missing (idempotent), noindex |
| Weighted scoring model per interview type | [x] | `report-scoring.ts` — pure §54→category mapping (technical/problemSolving/communication/project/behavioral, 0–100), filler penalty (§55), per-interview-type weights (technical/system-design/behavioral/hr/mixed), overall = weighted mean; 7 unit tests + heuristic report tests (80/80 total) |

#### Phase 10 — History & Progress
| Task | Done? | Notes |
|---|---|---|
| History API + list UI | [x] | `GET /api/interview/sessions` — ownership-gated dashboard payload (sessions + report scores, totals); `/ai-mock-interview/history` client dashboard with stats row and session cards |
| Delete + restart interviews | [x] | `DELETE /api/interview/session/:id` (cascade); restart = prefill the setup wizard from the stored config (no orphan sessions) + room completed-state links to Report/History |
| Skill progress + score trends | [x] | dashboard aggregates per-category averages across reports (skill progress bars) + overall score trend across completed sessions (§64) |

#### Phase 11 — Optimization
| Task | Done? | Notes |
|---|---|---|
| Cost caps (context budget, single evaluation per answer) | [x] | `context-budget.ts` — prompt-only trim: last 12 answered questions for generation (§52), last 30 for the report (§63); full history stays in the DB. Single evaluation per answer already guaranteed (unique answer_id upsert + one `evaluateAnswer` call per turn) |
| Caching + rate limits | [x] | `rate-limiter.ts` — in-memory sliding window (60/min per user) wired into the four turn-loop POST routes (follow-up/generate/evaluate/report) via `enforceInterviewRateLimit` (429 + Retry-After); provider calls already retry-once + heuristic fallback (§74); AI config bootstrap cached |
| Streaming responses + media perf | [x] | Streaming SSE deliberately not added (providers need strict-JSON single responses; the room already shows text immediately); media stays local (browser STT/TTS, transcripts only — no audio uploads to compress); report page generates server-side so the client never blocks |

#### Phase 12 — Production Hardening
| Task | Done? | Notes |
|---|---|---|
| Security/ownership tests (401/403 matrix) | [x] | `http-status.ts` — single dependency-free error→status mapping (400/403/404/409/500) now used by ALL interview routes; full matrix unit-tested (95/95); 401 (auth guard) + 429 (Phase 11 limiter) cover the rest |
| Privacy (consent stores, retention, delete-all) | [x] | recording consent stored with each session (§31); `DELETE /api/interview/account` wipes all sessions (cascade) + resumes — GDPR-style delete-all + "Delete all data" button on the history page |
| Observability + analytics events | [x] | `analytics.ts` — structured single-line events (session created/started/ended, answer stored, evaluation persisted, report generated, deletes) logged in dev always, prod when `INTERVIEW_ANALYTICS=1`; no PII |
| Lighthouse pass, cross-browser QA | [ ] | deferred to post-merge deploy — session pages are noindex client UI; code passes lint+build+tests. Run Lighthouse on the deployed /ai-mock-interview + room before GA |

#### Phase 13 — Advanced Features
| Task | Done? |
|---|---|
| Interviewer personalities / multi-round | [x] | 4 personas (`data/interviewer-personalities.ts`) — tone directive injected into question + follow-up system prompts (provider + heuristic share the context); picker UI flag-gated with Pro badge; multi-round toggle → `round` snapshotted per session, "Practice again" increments the round |
| Coding interview / system design whiteboard (design docs first) | [x] | design docs accepted: `docs/ai-interview/coding-interview-mode.md` + `docs/ai-interview/system-design-whiteboard.md`; **coding mode IMPLEMENTED** per its doc — `coding` interview type (Pro badge when flag off), coding problem + evaluation prompts with heuristic fallbacks (`heuristic-coding-*.ts`), room CodingPanel (problem JSON → statement/examples/constraints + line-numbered editor, no camera/mic/TTS), report "Your coding solutions" card from persisted evaluations, coding weights in the scoring model; whiteboard still doc-only |
| Premium/credits hooks (flags only, no payments) | [x] | `config/flags.ts` — `INTERVIEW_PREMIUM_FEATURES`/`NEXT_PUBLIC_INTERVIEW_PREMIUM_FEATURES` (comma-list or `*`); client mirror `usePremiumFeatures`; Pro badges on locked features; no payments wired (§107)

---

## Flow — How The Product Works (one flow only)

```
/ai-mock-interview (landing, SEO)
   │  2 CTAs → setup
   ▼
SETUP   resume(PDF) + role + domain + company + level + type + duration
   │   resume → analyze (server, Gemini) → candidate profile
   ▼
SIGN IN (Supabase Auth) → session create (auth-scoped) → INTERVIEW ROOM
   ▼
Camera+Mic (permission modal + fallbacks) → recording consent (§31)
   ▼
AI interviewer room — question/transcript panels, timer, controls
   │   question loop live (Phase 5): AI asks → user answers (text) → follow-up
   │   voice loop live (Phase 6): AI asks (TTS + text) → user answers (STT or text)
   │   adaptive loop live (Phase 7): evaluate (§54) → controller decides
   │   follow-up / new topic / harder / easier / end (budgets) → question
   ▼
REPORT   score 0–100 + 5 categories + per-question + strengths/weaknesses
         + mistakes + improvement plan + recommended topics
   │
   ▼
RE-START (same config) or new role → History (future)
```

**How interviews make decisions (the loop):**

```
Q → A (audio) → STT transcript → AIProvider.evaluateAnswer() (one call)
  → Adaptive controller:
      strong → follow-up (harder)
      weak   → clarification
      wrong  → concept check
      good   → new topic
    → AIProvider.generateQuestion() → TTS → repeat
All answers → when time/question budget is up → generateReport() (one call)
```

## How The System Works (architecture in plain terms)

| Part | What it does | Where |
|---|---|---|
| Land/Setup | SEO page + wizard collecting interview config | `app/ai-mock-interview/**` |
| Resume pipeline | PDF → text → structured candidate profile | `features/ai-interview/services/resume/` + `api/interview/resume/*` |
| Session engine | Creates/persists the interview, state machine, recovery | `app/api/interview/session/*` + `interview_sessions` table |
| Interview room | Browser camera/mic, media device handling, timer | `features/ai-interview/components/InterviewRoom…` |
| AI Configuration Service | Resolves active provider/model/prompt from the Admin Panel (encrypted, cached), model switching, prompt pinning | `services/ai-config/` + tables `ai_provider_configs`, `ai_prompt_configs` |
| Provider adapters | `AIProvider` abstraction → Gemini (future: OpenAI, Claude, DeepSeek) | `services/ai/` |
| Speech | STT provider (browser first) | `services/speech/` |
| TTS | TTS provider (browser first) | `services/tts/` |
| Evaluation | Per-answer §54 dimension scores (Phase 7 evaluate + adaptive controller) | `services/ai` + `services/interview/adaptive-controller.ts` |
| Report | One AI call → structured report + improvement plan and scoring weights | `app/api/interview/report/*` |
| Admin | Manage providers, models, keys, prompts, usage, audit | existing Admin Panel (new section `AI Configuration`) |
| DB | Supabase: all tables + RLS owner-scoping + admin ai_* tables | `supabase/migrations/` |

**What the engine MUST NOT do:** hardcode any provider/model/key; talk to a provider without going through `AI Configuration Service` → adapter; accept unvalidated AI output; trust client IDs.

## Flowcharts (visual — AI must keep these truthful too)

### Chart 1 — User journey (how the product works end-to-end)

```text
                         ┌─────────────────────────────────────┐
                         │      /ai-mock-interview (Landing)   │
                         │  SEO page · metadata · FAQ · JSON-LD │
                         └──────────────────┬──────────────────┘
                                            │  CTA → setup
                                            ▼
┌──────────────────────────────────────────────────────────────┐
│ SETUP wizard (3 steps)                                        │
│  Resume(PDF) → Role → Domain → Company → Level → Type → Time │
└──────────────────────────┬───────────────────────────────────┘
                           │ resume → /api/interview/resume/analyze
                           ▼
                   Candidate Profile (skills/projects)
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ INTERVIEW ROOM  (camera + mic + AI interviewer)               │
│  PermissionModal → getUserMedia → RecordingConsent           │
└──────────────────────────┬───────────────────────────────────┘
                           ▼
        ┌─────────────── Q&A loop (Chart 2) ───────────────┐
        │   Q → A → STT → evaluate → follow-up/new topic   │
        └──────────────────────────┬───────────────────────┘
                           │  time up OR END_INTERVIEW
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ REPORT  score 0–100 · 5 categories · per-question            │
│ strengths · weaknesses · mistakes · improvement plan ·       │
│ recommended topics                                            │
└──────────────────────────┬───────────────────────────────────┘
                           ▼
          Practice Again (same config)  /  Try Another Role
                           ▼
                History & Progress (Phase 10+)
```

### Chart 2 — Adaptive interview loop (how the AI "thinks")

```text
              │ question asked (TTS + text shown)
              ▼
    user speaks / types answer
              │
              ▼
   Speech-to-Text (STT) ──fail──► manual text input (fallback)
              │
              ▼
   evaluateAnswer() — one AI call (dimensions §54)
              │
              ▼
   Adaptive controller (state: topic · difficulty · summary)
   ┌────────────┬────────────┬────────────┬──────────────┐
   │ Strong     │ Weak       │ Wrong      │ Topic done   │
   │ (harder    │ (clarify / │ (concept   │ (new topic)  │
   │ follow-up) │ simplify)  │ check)     │              │
   └────────────┴────────────┴────────────┴──────────────┘
              │ generateQuestion() (strict JSON, Zod)
              ▼
        budget used? ──no──► ask next question
              │ yes
              ▼
        END_INTERVIEW → generateReport() (one call)
```

### Chart 3 — Voice pipeline within the room

```text
AI question text ──► TTS (SpeechSynthesis) ──► 🔊 question heard
                        │ (text always shown too)
USer answer ──► 🎤 Mic ──► STT (SpeechRecognition) ──► transcript text
   │                                                      │
   └────────────(no audio / denied)──► manual typing ─────┘
```

### Chart 4 — Build & delivery pipeline per phase (how work gets done)

```text
user pastes PHASE N command
          │
          ▼
create branch feature/ai-interview/phase-N-<slug> (from main)
          │
          ▼
build phase tasks → npm run lint → npm run build   ◄── fixes stay on branch
          │
          ▼
UPDATE TRACKING.md  (status + checklist + log row)
          │
          ▼
git commit (conventional) + git push
          │
          ▼
report to user  ──►  user reviews / says "merge"
          │                                   │
          │   user merges                     ▼
          ▼                        TRACKING.md -> merged ✓, COMPLETED
next phase starts only after merge            │
                                              ▼
                              commit on main + branch cleanup (by user's OK)
```

---

## Recent Updates (AI — append the newest row on top)

| Date | What changed | Phase | Branch / commit |
|---|---|---|---|
| 2026-08-18 | Phase 13 follow-up: coding interview mode implemented per its design doc — `coding` interview type (Pro badge when flag off), coding question + evaluation prompts (AI + heuristic fallbacks), room CodingPanel (problem statement/examples/constraints + line-numbered editor, no camera/mic/TTS), report coding-solutions card from persisted evaluations, coding weights in scoring model — tests 104/104, lint+build green | 13 | `feature/ai-interview/phase-8-evaluation` (stacked) |
| 2026-08-18 | Phase 13 built: interviewer personalities (4 personas, tone directive injected into question/follow-up prompts) + multi-round flag (round snapshotted per session, restart increments), premium feature flags + Pro-badge picker UI, coding-interview + system-design whiteboard design docs (docs/ai-interview/) — tests 99/99, lint+build green; awaiting merge | 13 | `feature/ai-interview/phase-13-advanced` (work stacked on phase-8 branch) |
| 2026-08-13 | Phase 7 built (stacked on phase-6-voice): Adaptive Interview Engine — `evaluateAnswer` on both providers (Zod §54 dimensions + deterministic heuristic evaluator, evaluation-v1 prompt), pure adaptive controller (verdict thresholds, §24 action mapping, §25 difficulty ladder, END_INTERVIEW time/question budgets, follow-up depth cap), turn loop now evaluates → decides → generates honoring `adaptiveIntent` (or ENDs the session server-side), §40 `performanceSummary` (overall + per-topic + verdict counts) persisted in `current_state`, new `POST /api/interview/answer/evaluate` route, room handles the ended flow — lint(branch)+build green (194/194), 64/64 unit tests; awaiting approval | 7 | `feature/ai-interview/phase-7-adaptive` |
| 2026-08-13 | Phase 6 built (stacked on phase-5-question-engine): Speech & Voice Loop — browser STT (SpeechRecognition, §35) + TTS (SpeechSynthesis, §36) provider abstractions with SSR-safe hooks, silence auto-submit voice answers with live captions and Stop & send, filler/pace metrics util (§56–57, 9 tests), new `speaking` §79 state (migration `007`), speaker toggle enabled, manual text fallback always reachable — lint(branch)+build green (193/193), 39/39 unit tests; awaiting approval | 6 | `feature/ai-interview/phase-6-voice` |
| 2026-08-12 | Phase 5 built (stacked on phase-4-room): AI Question Engine — typed `generateQuestion`/`generateFollowUp` (OpenAI-compatible adapter + deterministic heuristic fallback), versioned question/follow-up prompts, `POST /question/generate` + `/question/follow-up` (Zod strict JSON, answers persisted idempotently, `parent_question_id` links, §40 `current_state`), migration `006` unique sequence/answer indexes, room loop drives ASKING→LISTENING→PROCESSING (Begin → first question → answer → follow-up) — lint+build green (193/193), heuristic logic tests + live API matrix (15/15) + browser walk (zero console errors); awaiting approval | 5 | `feature/ai-interview/phase-5-question-engine` |
| 2026-08-11 | Phase 4 built (stacked on phase-3-session): Interview Room UI — PermissionModal + getUserMedia fallback chain, RecordingConsent (stored with session), AI interviewer visual states (§79), question/transcript panels, timer + auto-end, session create/start/end wiring, responsive dark room — lint(branch)+build green (190/190), browser walk zero console errors; awaiting approval | 4 | `feature/ai-interview/phase-4-room` |
| 2026-08-11 | Phase 3 built: Supabase Auth for users (auth page + useAuth + wizard sign-in gate), migration `005_interview_sessions.sql` (6 tables, RLS user-scoped), session create/get/start/end APIs with ownership gates + recovery payload — lint(branch)+build green, 16 pure-logic checks + live 503/200 smoke tests + browser walk; awaiting approval | 3 | `feature/ai-interview/phase-3-session` |
| 2026-08-18 | Phase 12 built: unified ownership status matrix + tests, delete-all privacy API + UI, env-gated analytics events — tests 95/95, lint+build green; Lighthouse/QA deferred to post-merge deploy | 12 | `feature/ai-interview/phase-12-hardening` (work stacked on phase-8 branch) |
| 2026-08-18 | Phase 11 built: context budget (prompt-only trim for generation + report), sliding-window rate limits on turn-loop routes, cost-cap tests — tests 90/90, lint+build green; awaiting merge | 11 | `feature/ai-interview/phase-11-optimization` (work stacked on phase-8 branch) |
| 2026-08-18 | Phase 10 built: history API + dashboard UI, delete + restart flows, skill progress bars + score trend — tests 80/80, lint+build green; awaiting merge | 10 | `feature/ai-interview/phase-10-history` (work stacked on phase-8 branch) |
| 2026-08-18 | Phase 9 built: single-call report API + GET, weighted scoring model (per interview type), server-rendered report page with score ring/categories/per-question/improvement plan — tests 80/80, lint+build green; awaiting merge | 9 | `feature/ai-interview/phase-9-report` (work stacked on phase-8 branch) |
| 2026-08-18 | Phase 8 built: evaluation persistence (idempotent, migration 008), communication metrics pipeline, eval dataset + runnable script — tests 69/69, lint+build green, dataset 7/7; awaiting merge | 8 | `feature/ai-interview/phase-8-evaluation` |
| 2026-08-18 | Phases 3–7 merged to `main` (`47e3f5f`) — session engine, room UI, question engine, speech & voice loop, adaptive engine all marked COMPLETED | 3–7 | `main` |
| 2026-08-18 | Blog: added trending HEIC-to-JPG guide (`62257c5`) — seeded, migrated to Supabase, live on `www.vizotool.com` | — | `main` |
| 2026-08-11 | Phase 2 merged to `main` (`a23b036`) — marked COMPLETED | 2 | `main` |
| 2026-08-10 | Phase 2 merged premium landing branch into it (3D hero, nav polish) and fully verified: lint+build green, runtime API tests (heuristic profile extraction, upload validation, storage-off fallback, PDF text extraction) + browser wizard walkthrough, zero console errors | 2 | `feature/ai-interview/phase-2-resume` |
| 2026-08-09 | Phase 2 built: resume upload API (private `resumes` bucket), analyze API → Zod CandidateProfile, services/ai provider abstraction + heuristic fallback, versioned prompts, uploader UI with progress/analyzing/retry/skip — lint+build green; awaiting approval | 2 | `feature/ai-interview/phase-2-resume` |
| 2026-08-09 | Landing polish merged to `main` (`c6cc41d`) — 3D hero scene (React Three Fiber), GLTF robot avatar, spatial tilt cards, glass live-interview preview, skills marquee — SEO copy untouched | — | `main` |
| 2026-08-09 | Landing polish (outside phase flow): 3D hero scene (React Three Fiber), spatial tilt cards, glass live-interview preview, skills marquee — SEO copy untouched | — | `feature/ai-interview/landing-polish` |
| 2026-08-09 | Phase 1 merged to `main` (`cbf75a3`) — marked COMPLETED | 1 | `main` |
| 2026-08-09 | Phase 0 merged to `main` (`63db455`) — marked COMPLETED | 0 | `main` |
| 2026-08-09 | Phase 1 built: feature skeleton + data, SEO landing, 3-step setup wizard + resume capture, registry (AI Tools) + sitemap; lint+build green; awaiting approval | 1 | `feature/ai-interview/phase-1-foundation` |
| 2026-08-09 | Phase 0 executed: full repo audit + architecture-notes.md written; build green; awaiting approval | 0 | `feature/ai-interview/phase-0-research` |
| 2026-08-09 | Docs initialised (master spec §1-117 + §118 admin AI config, SEO/Git/Rules, phase commands) | — | — |
| _(next update here)_ | | | |

## Daily Log — what a new phase run looks like for the human

1. AI opens branch `phase-N` (never main).
2. Builds the phase task, passes `lint`+`build`.
3. **Updates THIS file** (checklist row, status change, log row).
4. Commits with Conventional Commit; pushes; reports → you review with the table above.
5. You say "merge" → AI merges, marks phase `COMPLETED`, updates log; next phase starts only after that.