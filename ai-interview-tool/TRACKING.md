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
| 2 | Resume Intelligence | `phase-2-resume` | `NOT STARTED` | — |
| 3 | Interview Session Engine | `phase-3-session` | `NOT STARTED` | — |
| 4 | Interview Room UI | `phase-4-room` | `NOT STARTED` | — |
| 5 | AI Question Engine | `phase-5-question-engine` | `NOT STARTED` | — |
| 6 | Speech & Voice Loop | `phase-6-voice` | `NOT STARTED` | — |
| 7 | Adaptive Interview Engine | `phase-7-adaptive` | `NOT STARTED` | — |
| 8 | Evaluation Engine | `phase-8-evaluation` | `NOT STARTED` | — |
| 9 | Final Report | `phase-9-report` | `NOT STARTED` | — |
| 10 | History & Progress | `phase-10-history` | `NOT STARTED` | — |
| 11 | Optimization | `phase-11-optimization` | `NOT STARTED` | — |
| 12 | Production Hardening | `phase-12-hardening` | `NOT STARTED` | — |
| 13 | Advanced Features | `phase-13-advanced` | `NOT STARTED` | — |

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
| Task | Done? |
|---|---|
| Resume upload API + Supabase storage | [ ] |
| Resume analyze API → CandidateProfile (Zod) | [ ] |
| services/ai + prompts/resume (versioned) | [ ] |
| Resume uploader UI + "Skip resume" | [ ] |

#### Phase 3 — Interview Session Engine
| Task | Done? |
|---|---|
| DB schema (resumes, sessions, questions, answers, evaluations, reports) | [ ] |
| Session create/get/start/end APIs (ownership) | [ ] |
| Session recovery on reconnect | [ ] |

#### Phase 4 — Interview Room UI
| Task | Done? |
|---|---|
| Room page (camera, AI interviewer, controls, timer) | [ ] |
| PermissionModal + getUserMedia fallbacks | [ ] |
| RecordingConsent flow | [ ] |
| State-machine visuals (IDs per §79 of master spec) | [ ] |

#### Phase 5 — AI Question Engine
| Task | Done? |
|---|---|
| AIProvider interface + Gemini adapter | [ ] |
| Question generate API (Zod-validated strict JSON) | [ ] |
| Follow-up API | [ ] |
| Questions stored with parent_question_id | [ ] |

#### Phase 6 — Speech & Voice Loop
| Task | Done? |
|---|---|
| Browser STT (SpeechRecognition) + text fallback | [ ] |
| Browser TTS (SpeechSynthesis), question text always shown | [ ] |
| Filler words + pace metrics util | [ ] |
| Listening/speaking states wired to state machine | [ ] |

#### Phase 7 — Adaptive Interview Engine
| Task | Done? |
|---|---|
| Answer evaluate API (dimensions §54) | [ ] |
| Adaptive controller (follow-up vs new topic vs difficulty) | [ ] |
| END_INTERVIEW rules (time/question budget) | [ ] |
| Session-state store (topic, difficulty, performance) | [ ] |

#### Phase 8 — Evaluation Engine
| Task | Done? |
|---|---|
| interview_evaluations persistence | [ ] |
| Communication metrics pipeline | [ ] |
| Eval dataset + runnable script | [ ] |

#### Phase 9 — Final Report
| Task | Done? |
|---|---|
| Report generation API (single call, Zod) | [ ] |
| Report page (score ring, categories, per-question, improvement plan) | [ ] |
| Weighted scoring model per interview type | [ ] |

#### Phase 10 — History & Progress
| Task | Done? |
|---|---|
| History API + list UI | [ ] |
| Delete + restart interviews | [ ] |
| Skill progress + score trends | [ ] |

#### Phase 11 — Optimization
| Task | Done? |
|---|---|
| Cost caps (context budget, single evaluation per answer) | [ ] |
| Caching + rate limits | [ ] |
| Streaming responses + media perf | [ ] |

#### Phase 12 — Production Hardening
| Task | Done? |
|---|---|
| Security/ownership tests (401/403 matrix) | [ ] |
| Privacy (consent stores, retention, delete-all) | [ ] |
| Observability + analytics events | [ ] |
| Lighthouse pass, cross-browser QA | [ ] |

#### Phase 13 — Advanced Features
| Task | Done? |
|---|---|
| Interviewer personalities / multi-round | [ ] |
| Coding interview / system design whiteboard (design docs first) | [ ] |
| Premium/credits hooks (flags only, no payments) | [ ] |

---

## Flow — How The Product Works (one flow only)

```
/ai-mock-interview (landing, SEO)
   │  2 CTAs → setup
   ▼
SETUP   resume(PDF) + role + domain + company + level + type + duration
   │   resume → analyze (server, Gemini) → candidate profile
   ▼
INTERVIEW  Camera+Mic → consent → AI interviewer room
   │   AI asks (TTS + text) → user answers (STT or text)
   │   engine evaluates → follow-up / new topic / harder / easier / end
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
| Evaluation | Per-answer dimension scores + communication metrics | `services/ai` + `evaluation` |
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