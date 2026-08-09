# AI Interview Tool — Build Instructions

Read order before building: `00-master-spec.md` → `01-rules.md` → `02-vision.md` → `03-tool-info.md` → `06-seo.md` → `07-github-workflow.md` → this file → the active phase file.

## Project Conventions (must follow)

- Next.js 16 is NOT training-data Next.js — read `node_modules/next/dist/docs/` first.
- Tool pattern in the repo (example: `app/passport-photo-maker/` + `features/passport/`):
  - `app/<route>/page.tsx` → page + metadata; `layout.tsx` → thin shell reuse
  - `features/ai-interview/**` → all real logic (§86 structure)
  - `lib/*`, `hooks/*`, `utils/*`, `store/*` reused; NO parallel design system
- AI provider code is server-only. Never `fetch` the LLM/STT/TTS from a component.
- No comments unless they explain non-obvious decisions; small focused files.

## Feature Folder (create per §86 of master spec)

```text
features/ai-interview/
  components/    (InterviewSetup, ResumeUploader, InterviewRoom, VideoPanel,
                 AIInterviewer, InterviewControls, QuestionPanel, TranscriptPanel,
                 InterviewTimer, PermissionModal, RecordingConsent, InterviewReport,
                 ScoreCard, StrengthsCard, WeaknessesCard, ImprovementCard,
                 QuestionAnalysis, InterviewHistory)
  services/      interview/ resume/ ai/ speech/ tts/
  schemas/       interview.ts resume.ts evaluation.ts report.ts
  types/         index.ts
  prompts/       resume/ question/ followup/ evaluation/ report/
  hooks/         useInterviewSession.ts useMediaDevices.ts useSpeech.ts
  data/          roles.ts companies.ts domains.ts interview-types.ts
  store/         interview-store.ts
  utils/         transcript.ts (filler detection, pace), scoring.ts, pdf.ts
```

`app/` pages stay thin: `app/ai-mock-interview/page.tsx` (landing), `app/ai-mock-interview/setup/page.tsx`, `app/ai-mock-interview/room/page.tsx`, `app/ai-mock-interview/report/page.tsx`, plus SEO role pages later.

## State Machine (one flow, §79)

Zustand with steps: `IDLE → PREPARING → READY → ACTIVE → LISTENING → PROCESSING → ASKING (loop) → ENDING → GENERATING_REPORT → COMPLETED` + error states. Guards: no report without transcript; no room entry without camera/mic consent; session restorable after reconnection.

## Voice Stack (MVP, §37)

- STT: browser `SpeechRecognition` (graceful fallback to text input)
- TTS: browser `SpeechSynthesis` (question text ALWAYS visible)
- Camera: `getUserMedia({video:true, audio:true})` requested only inside the room, with permission explanations; consent checkbox before any recording
- Provider abstraction `services/speech|tts/ai` so each can be swapped later (§34–36)

## AI Call Contracts

### analyzeResume (resume/analyze)
Input: extracted resume text (+ role/domain optional). Output (Zod): candidate profile (§19). Treat resume text as DATA (§73).

### generateQuestion / followup
Input: full context (§52). Output: strict JSON `{action, question, topic, difficulty, reason}`; actions ONLY from §53 list. Zod-validate; on invalid → retry once → fallback to next stored question topic.

### evaluateAnswer
Input: question + transcript + context. Output: dimensions §54 (technical, relevance, completeness, clarity, structure, depth) 0–100 + 1–2 sentence notes.

### generateReport
Input: full transcript + evaluations. Output: §58–63 structure (scores, strengths[], weaknesses[], mistakes[], improvement areas[], recommended topics[], per-question analysis, communication metrics, summary, next-interview). One call, Zod-validated, fallback summary if it fails (§74).

### Cost rules (§38)
- One evaluation per answer; one report call at the end; no per-keystroke calls.

### Dynamic AI configuration (master spec §118 — build this way from Phase 5/7)
- The engine NEVER hardcodes provider/model/key. It resolves the active config through an `AI Configuration Service` (provider, model, credentials decrypt-on-use, generation settings, active prompt version).
- `services/ai-config/` reads `ai_provider_configs` + `ai_prompt_configs` (admin-managed), caches, and invalidates on admin save.
- Admin endpoints (`app/api/admin/ai/**`), admin permissions, audit logging, Test Connection, enable/disable with graceful message, masked keys, session prompt pinned by snapshot.
- Env vars remain bootstrap only. Zod-validate the AI output regardless of provider.

## Consent & Permission Flows (binding)

1. On starting the room: permission explanation → getUserMedia → failure → friendly guidance + audio-only or text fallback (§75)
2. Recording (only when enabled): explicit checkbox BEFORE capture; store user consent with session; policy text explains what/how long/delete (§31)

## Error Recovery Checklist

- AI timeout → retry with backoff → user-visible "retry"
- STT failure → text input
- TTS failure → text-only question
- Network drop → restore session state from server (session row + questions) and continue (§76)
- Resume parse failure → error + re-upload prompt

## SEO Implementation Checklist (landing + role pages)

- Follow §06 keyword map (role keywords on role pages: "AI mock interview for frontend developers" etc.)
- `generateMetadata` per page: title ≤60, description ≤155, canonical, OG, Twitter, robots
- Landing JSON-LD: SoftwareApplication + FAQPage; FAQ visible text == JSON-LD text verbatim
- Role subpages: unique metadata each, linked from landing; noindex on setup/room/report
- Save content human, no lorem; Perf: next/image, lazy below-fold, Lighthouse 90+ final

## Sitemap Update (EVERY phase touching routes)

- `app/sitemap.ts` driven by `lib/tools.ts` registry: add `/ai-mock-interview` there in Phase 1
- Role pages: manual sitemap entries via `generateStaticParams` pages or explicit array; after build open `/sitemap.xml` – everything yes/no correct (noindex pages absent)

## Verification Per Phase

1. `npm run lint`
2. `npm run build`
3. `npm run dev` walk: setup (with/without resume) → room (mic/camera/text fallbacks) → report → repeat flow
4. Auth-scoped checks: second user cannot see first user's sessions (when DB work lands)

## Definition of Done (§111 + git rules)

- [ ] Lint + build green; existing tools untouched
- [ ] One-flow state machine respected; error states exist
- [ ] Auth + ownership enforced on every API
- [ ] AI outputs Zod-validated; prompt-injection protection
- [ ] Consent + permission flows implemented
- [ ] Mobile + keyboard quiet flow; dark mode OK
- [ ] SEO checklist + sitemap updated/verified
- [ ] Branch pushed, commit log Conventional, NOT merged