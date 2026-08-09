# AI Interview Tool — Tool Info & Spec (source: `00-master-spec.md`)

## What It Is

A standalone, SEO-first AI Mock Interview module inside VizoTool. Own landing page, own funnel, own flow — a realistic voice/video interview with an AI interviewer. Full spec: `00-master-spec.md` (§ sections cited below).

## Canonical User Flow (ONE flow — do not deviate, §8, §79)

```text
LANDING (/ai-mock-interview + role/domain subpages)
  → SETUP   (resume, role, domain, company, level, interview type, duration)
  → PROFILE (resume analyzed → candidate profile)
  → INTERVIEW (camera+mic, AI interviewer, adaptive Q&A with follow-ups)
  → REPORT  (detailed report + improvement plan)
  → RE-START (try another role/domain from report)
```

Interview state machine (§79): `IDLE → PREPARING → READY → ACTIVE → LISTENING → PROCESSING → ASKING → ENDING → GENERATING_REPORT → COMPLETED`. Error states handled separately.

## Routes (§82, adapted to this repo)

| Route | Purpose | Index? |
|---|---|---|
| `/ai-mock-interview` | SEO landing page (metadata + JSON-LD + FAQ) | yes |
| `/ai-mock-interview/[role]` (e.g. software-engineer, frontend-developer) | SEO per-role/domain pages | yes (only roles in the registry) |
| `/ai-mock-interview/setup` | interview configuration wizard | no |
| `/ai-mock-interview/room` | live interview session | no |
| `/ai-mock-interview/report` | post-interview report + improvement plan | no |

Route style mirrors existing site tools; final naming follows existing conventions.

## Setup Fields (§9–11)

- **Resume** — PDF upload (DOCX later), max size, client + server validation
- **Target Role** — Software Engineer, Frontend, Backend, Full Stack, Data Analyst, Data Scientist, Product Manager (+ extensible)
- **Domain** — MERN, Java, Python, React, Node.js, PHP, Data Science, ML, DevOps, Cybersecurity
- **Experience Level** — Fresher, 0–1, 1–3, 3–5, 5–8, 8+ years
- **Target Company** — presets (Google, Microsoft, Amazon, TCS, Infosys, Startup) + custom
- **Interview Type** — Technical, HR, Behavioral, System Design, Mixed (default)
- **Duration** — 10/20/30/45/60 min; MVP default 15–20 min

Never imply possession of any company's confidential questions (§22).

## Tech Stack (reuse ONLY existing)

- Next.js 16 (App Router; server components; route handlers, streaming) + React 19 + TS 5
- Tailwind 4 + existing theme (dark mode); existing `components/ui`, `components/shared`, `components/seo`
- zustand for runtime state; zod for validation
- Supabase (existing) for auth + DB + storage; existing `lib/supabase/*`
- framer-motion for UI motion only
- Pattern: thin `app/` pages + logic in `features/ai-interview/**` (§86)

## Feature Folder Structure (§86)

```text
features/ai-interview/
  components/  InterviewSetup, ResumeUploader, InterviewRoom, VideoPanel,
               AIInterviewer, InterviewControls, QuestionPanel, TranscriptPanel,
               InterviewTimer, PermissionModal, RecordingConsent,
               InterviewReport, ScoreCard, StrengthsCard, WeaknessesCard,
               ImprovementCard, QuestionAnalysis, InterviewHistory
  services/    interview/, resume/, ai/, speech/, tts/   (provider abstractions)
  schemas/     interview.ts, resume.ts, evaluation.ts, report.ts
  types/       index.ts (interview + evaluation types)
  prompts/     resume/, question/, followup/, evaluation/, report/ (versioned)
  hooks/       useInterviewSession, useMediaDevices, useSpeechInput, ...
  data/        roles.ts, companies.ts, domains.ts, interview-types.ts
  store/       interview-store.ts (zustand)
```

## Provider Abstractions (§34–36 — avoid lock-in)

- `services/ai/` → `AIProvider` interface: `analyzeResume`, `generateQuestion`, `generateFollowUp`, `evaluateAnswer`, `generateReport`; provider classes (Gemini/OpenAI/Claude/DeepSeek) selected at runtime via env or Admin config
- `services/speech/` → `SpeechToTextProvider` (`transcribe`, `detectLanguage`): browser SpeechRecognition or Whisper
- `services/tts/` → `TextToSpeechProvider` (`synthesize`): browser SpeechSynthesis first, others later

### Dynamic Provider & Admin Control (master spec §118)

The active provider, model, API key, generation settings, and prompts are managed from the **existing VizoTool Admin Panel** — not hardcoded, no redeploy needed:

- New admin tables: `ai_provider_configs` (provider, encrypted key, model, generation_config, is_active, is_enabled) and `ai_prompt_configs` (prompt_key, content, version, status draft/active/archived)
- New `AI Configuration Service` (`services/ai-config/`): resolves active provider/model/key/credentials/prompt, caches config, invalidates on admin save
- Keys: encrypted at rest server-side, decrypted only to build a request, masked in admin UI, rotation + Test Connection flows
- Prompts versioned; the session pins the prompt version at session start (snapshot)
- Env vars (`AI_PROVIDER`, `AI_API_KEY`, …) become secure bootstrap only
- Graceful failure when provider disabled: "AI interview service is temporarily unavailable."
- Admin AI endpoints follow existing `app/api/admin/**` conventions + admin permissions + audit logging (§118)

Runtime is unchanged for the Interview Engine: it asks the config service and talks only to the active `AIProvider` adapter.

## API Surface (§48; final naming per repo conventions)

```text
POST /api/interview/resume/upload        multipart upload → storage
POST /api/interview/resume/analyze       resume text → candidate profile (AI)
POST /api/interview/session/create       creates session row (auth-scoped)
GET  /api/interview/session/:id          session state (owner only)
POST /api/interview/session/:id/start
POST /api/interview/session/:id/end
POST /api/interview/question/generate    next question (structured JSON, §53)
POST /api/interview/question/follow-up    follow-up on transcript
POST /api/interview/answer/transcribe     audio → transcript
POST /api/interview/answer/evaluate       transcript → per-dimension scores
POST /api/interview/report/generate       full report (one call)
GET  /api/interview/report/:id
GET  /api/interview/history
DELETE /api/interview/session/:id
```

All route handlers: auth (existing session), ownership checks (§49–50), zod, rate limiting.

## Data Model (§41–47)

Tables (Supabase): `users` (existing) → `resumes` → `interview_sessions` → `interview_questions` (parent_question_id for follow-ups) → `interview_answers` → `interview_evaluations` → `interview_reports` → `interview_metrics`. Columns exactly per §42–47. RLS must scope everything to `auth.uid()`.

## Interview Engine Contracts (§51–53, §54–57)

- Question call gets full context: profile, company, role, domain, level, type, topic state, previous Q&A, performance summary, remaining time
- Output ALWAYS strict JSON: `{ action: FOLLOW_UP | NEW_TOPIC | INCREASE_DIFFICULTY | DECREASE_DIFFICULTY | CLARIFICATION | END_INTERVIEW, question, topic, difficulty, reason }` (Zod-validated)
- Evaluation dimensions: technical accuracy, relevance, completeness, clarity, structure, depth (§54)
- Communication: pace, pauses, filler words, repetition — metrics only, never psychology (§55–§57)

## Scoring (§97–98)

| Component | Default | Technical | HR |
|---|---|---|---|
| Technical Knowledge | 30% | 40% | — |
| Problem Solving | 20% | 25% | — |
| Answer Quality | 15% | 15% | 20% |
| Communication | 15% | 10% | 30% |
| Project Knowledge | 10% | 10% | — |
| Behavioral | 10% | — | 30% |
| Clarity | — | — | 20% |

Weights configurable; scores presented as practice indicators, never hiring predictions.

## Report Structure (§58–63)

Overall score + grade; category scores table (5); then: overall summary, what you did well, what went wrong, areas of improvement, question-level analysis, communication metrics (filler words/pace), recommended preparation topics, suggested next interview, improvement plan with practice topics.

## Security & Consent (§72–76, §31–32)

- Server-only env: `AI_PROVIDER/AI_API_KEY`, `STT_*`, `TTS_*`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (§105)
- Recording consent checkbox BEFORE any capture; camera/mic requested only when starting the room, with explanations (§30–31)
- Resume/answers are data (prompt-injection protection, §73)
- All AI output Zod-validated with retry/fallback (§74)
- Session recovery on network loss (§76) — state persists (memory → DB rows as session continues)

## SEO Requirements

- Follow `06-seo.md`: keyword map, metadata, canonical, OG/Twitter, JSON-LD on landing + role pages, FAQ verbatim matching JSON-LD
- Sitemap via `lib/tools.ts` registry (`/ai-mock-interview`) + manual entries for role pages; session/setup/report never indexed

## MVP Cut (§91–92)

In: resume upload/analyze, setup fields, live room with voice (TTS/STT + text fallback), adaptive questions, follow-ups, report + improvement plan, session persistence, consent flows.
Out: coding, whiteboard, multi-round, replay, avatars, emotion detection, complex company integrations.