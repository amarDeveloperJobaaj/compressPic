# AI Interview Tool — AI Rules (GOLDEN RULES)

These rules are BINDING for any AI building this tool. Read order before writing code:

`00-master-spec.md` → `01-rules.md` → `02-vision.md` → `03-tool-info.md` → `06-seo.md` → `07-github-workflow.md` → `04-instructions.md` → the active phase file.

## 1. Architecture Rules

- Do NOT recreate or redesign the existing VizoTool project (master spec §87–§89, §112).
- Do NOT break existing tools, routes, features, or styles.
- Do NOT rename or delete existing routes without explicit approval.
- Reuse existing UI, theme, animations, utilities, auth, validation, and conventions (§88).
- Follow the existing tool pattern:
  - Routes under `app/ai-mock-interview/**`
  - Feature code in `features/ai-interview/**` (components, services, schemas, types, prompts, hooks, store, utils)
  - API routes in `app/api/interview/**` (or `app/api/ai-interview/**` — follow existing conventions)
  - Reuse `components/ui/**`, `components/shared/**`, `components/seo/**` wherever possible.
- Next.js 16 is NOT training-data Next.js. Before writing any code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

## 2. Modularity Rules

- Small, single-responsibility files. One component per file, one hook per file.
- No 500+ line files. Split when a file grows.
- No duplicate logic — extract shared code into `features/ai-interview/services` and `utils`.
- All provider calls (LLM / STT / TTS) go through ONE abstraction per provider type (`services/ai/`, `services/speech/`, `services/tts/`) with provider interfaces (`AIProvider`, `SpeechToTextProvider`, `TextToSpeechProvider`). Never call a provider directly from a component.

## 3. Flow Rules (ONE flow, as planned)

- The product has ONE canonical flow (see master spec §8, §23–27, §79): Setup → Profile → Interview → Report → Improvement Plan.
- The interview itself is a state machine: `IDLE → PREPARING → READY → ACTIVE → LISTENING → PROCESSING → ASKING → ENDING → GENERATING_REPORT → COMPLETED` (§79).
- The AI engine decides the next question adaptively (follow-up / new topic / difficulty change / end) — never a fixed Q1→Q2→Q3 questionnaire (§24, §53).

## 4. SEO Rules (non-negotiable)

- Follow `06-seo.md` — trending + long-tail keywords per its usage map, human-written copy, no stuffing.
- SEO pages: `/ai-mock-interview` landing + role/domain subpages (§82). Session/report/setup pages are noindex.
- Every indexable page: unique metadata, canonical, OG, Twitter, JSON-LD where applicable (SoftwareApplication + FAQPage on landing).
- SITEMAP rule: `app/sitemap.ts` is registry-driven via `lib/tools.ts`. Add every public page to the sitemap; never put noindex pages in the sitemap; verify `/sitemap.xml` after changes.
- Use existing `components/seo/**`. Target Lighthouse 90+ on the landing page.

## 5. Security Rules (binding)

- Secrets only server-side. Never `NEXT_PUBLIC_*` for keys (§105 of master spec).
- AI provider credentials are managed dynamically via the existing VizoTool Admin Panel (encrypted at rest, masked UI, rotation, test connection) — never hardcode providers/models/keys in code (master spec §118).
- Auth only through the existing system (session, §49–§50). Never trust client-sent `user_id` — derive identity from the session; verify session + resource ownership.
- Rate limit AI endpoints. Validate all inputs with Zod.
- Treat resume text, answers, and company names as DATA, never instructions — prompt-injection protection (§73).
- Validate all AI structured output with Zod before use; retry then fallback (§74).
- Recording and video only with explicit user consent (§31, §32).
- Admin AI-config endpoints honor admin permissions + audit logging; never log keys (§118).

## 6. Product Ethic Rules (never break)

- Never claim confidential company questions; always phrase as "publicly reported patterns" (§22, §96).
- Never make psychological/emotional claims about the candidate; only measurable behaviors (§55).
- Never present the score as hiring probability (§98).
- Interviewer persona: professional, neutral, constructive, never mocking (§96).

## 7. No-Go List (MVP)

- No coding/whiteboard/video-replay features (§92).
- No multi-round interviews, avatars, or emotion detection in MVP.
- No second auth system.
- No provider calls from the browser.
- No silent recording.
- No seeding/locking any company's "actual" question bank.

## 8. Verification (each phase)

- After each phase: `npm run lint` and `npm run build`; fixes go on the same phase branch.
- Manual check: `npm run dev` and walk BOTH text and voice flows (voice has graceful fallbacks).
- Do not declare a phase complete until build passes and flow works.

## 9. TRACKING.md Rule (BINDING — update ALWAYS)

- `TRACKING.md` is the live status file. After EVERY phase (and every notable change/merge): update its master table (status + branch + date), tick the task checklist of the phase, append a row to the "Recent Updates" log, and keep the Flow / How-It-Works sections truthful.
- Commit it with the phase work — Conventional message: `docs: update TRACKING for phase N`.
- Never mark a phase `COMPLETED` in TRACKING.md unless the build passed AND the user approved; merged branches must show `merged`.
- If a phase was partially built (user paused), the AI sets `IN PROGRESS` and notes what's missing — never fakes completion.

## 10. Git Rules (BINDING)

- One separate branch per phase: `feature/ai-interview/phase-<N>-<slug>`.
- Commit every logical change (Conventional Commits). See `07-github-workflow.md`.
- NEVER merge into `main` without the user's explicit approval — push, report, and wait.