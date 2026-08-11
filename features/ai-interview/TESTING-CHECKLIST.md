# AI Mock Interview — Testing Checklist

Manual QA + verification checklist for the AI Mock Interview module (Phases 1–4:
setup, resume intelligence, session engine + auth, interview room).

Run these after pulling new phase branches, before marking a phase approved, and
before merging to `main`.

---

## 1. Prerequisites (one-time)

| Item | How | Notes |
|---|---|---|
| Supabase env vars | `cp .env.example .env.local` then fill real values | Needs `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| AI provider (optional) | `AI_PROVIDER` + `AI_API_KEY` + `AI_MODEL` in `.env.local` | Without them the resume analyzer falls back to the local heuristic — flows still work |
| Supabase CLI (optional) | `npx supabase link` (project `iejdsqcrwnkqtziejazo`) | Needed only for `db push` / `gen types` |

> No `.env.local` / no keys ⇒ the interview APIs return friendly 503s and the
> room shows "Sign-in isn't configured on this build" — that is expected.

## 2. Database setup

Apply in order (SQL editor or `npx supabase db push`):

1. `supabase/schema.sql` — blog tables + `public.is_admin()` + `public.set_updated_at()` (helpers used by later migrations)
2. `supabase/storage.sql` — buckets incl. private `resumes`
3. `supabase/migrations/002_blog_cms.sql`, `003_admin_cms.sql`
4. `supabase/migrations/004_interview_resumes.sql` — resumes bucket policies
5. `supabase/migrations/005_interview_sessions.sql` — `resumes`, `interview_sessions`, `interview_questions`, `interview_answers`, `interview_evaluations`, `interview_reports` + RLS

Verify (SQL editor):

```sql
select table_name from information_schema.tables
where table_schema = 'public' and (table_name like 'interview%' or table_name = 'resumes');
select * from pg_policies where tablename = 'interview_sessions';
```

## 3. Build & static checks

```bash
npm run lint        # NOTE: pre-existing errors exist in features/resizer/ResizePreview.tsx (unrelated)
npm run build       # must end with "✓ Compiled" and "✓ Generating static pages"
```

Expected: build green (190/190 pages at Phase 4). Lint should be clean for all
`features/ai-interview/**`, `app/api/interview/**`, `app/ai-mock-interview/**`.

## 4. Pure-logic checks (no DB needed)

Run once per phase build (already executed during Phases 3–4):

```bash
npx tsx -e "
import { canTransitionStatus, canEndSession, CreateInterviewSessionSchema } from './features/ai-interview/schemas/interview-session';
console.log('idle→active', canTransitionStatus('idle','active'));
console.log('active→completed blocked', !canTransitionStatus('active','completed'));
console.log('valid create input', CreateInterviewSessionSchema.safeParse({ roleId:'software-engineer', domainId:'mern', companyId:'google', experienceLevelId:'1-3', interviewTypeId:'mixed', durationMinutes:20 }).success);
"
```

## 5. API smoke tests

Start the server (`npm run dev`) and run against `http://localhost:3000`.

### 5a. Unauthenticated / not-configured (always checkable)

```bash
# Without .env.local — expect 503 + friendly message
curl -s -w '\n%{http_code}\n' http://localhost:3000/api/interview/session/anything
curl -s -w '\n%{http_code}\n' -X POST http://localhost:3000/api/interview/session/create -H 'content-type: application/json' -d '{}'

# With .env.local but no session cookie — expect 401 "Sign in to start an interview."
curl -s -w '\n%{http_code}\n' http://localhost:3000/api/interview/session/anything
```

### 5b. Authenticated (needs a real signed-in cookie — use the browser flow §6)

| Endpoint | Happy path | Ownership / error path |
|---|---|---|
| `POST /api/interview/session/create` | 201 `{ ok, session }` (status `idle`) | 400 invalid body; 401 no session |
| `GET /api/interview/session/:id` | 200 session + questions + answers | 404 unknown id; **403** another user's id |
| `POST /api/interview/session/:id/start` | 200 status → `active`, `started_at` set | 409 on `completed`; 403 non-owner |
| `POST /api/interview/session/:id/end` | 200 status → `completed`, `ended_at` set (idempotent) | 403 non-owner |

Ownership check (the Phase 3 acceptance test): sign in as user A (browser 1),
create a session, copy its id. Sign in as user B (browser 2 / incognito) and
`GET` that id → **403**. `GET` a random UUID → **404**.

## 6. Browser walkthrough (the main test)

Use Chrome (camera/mic + SpeechRecognition support). Expect **zero console
errors** at every step.

### 6.1 Landing + setup
- [ ] `/ai-mock-interview` loads: hero, How It Works, roles grid, FAQ, CTA (check `curl` for JSON-LD: `SoftwareApplication` + `FAQPage`)
- [ ] `/sitemap.xml` contains `/ai-mock-interview`; does NOT contain `/setup`, `/room`, `/auth`, `/report`
- [ ] `/ai-mock-interview/setup`: walk steps 1→3. Step 3 shows "Sign in to start" (not signed in) with the privacy hint
- [ ] Resume flow: upload a PDF → progress → "Analyzing resume…" → candidate profile preview; "Skip resume" also works

### 6.2 Auth
- [ ] `/ai-mock-interview/auth`: create account → "check your inbox" (email confirmation on) → confirm → sign in → redirected to `?next`
- [ ] Sign in error shows for wrong password; validation errors show for bad email / short password

### 6.3 Room — permissions & fallbacks
- [ ] From setup step 3, "Sign in to start" → sign in → land on `/ai-mock-interview/room`
- [ ] PermissionModal appears first (camera/mic explanation, §30)
- [ ] **Allow camera+mic** → "Camera ready · Microphone ready" preview → consent checkbox → Begin
- [ ] **Deny camera** → audio-only fallback message; **deny both** → text-only with friendly guidance (§75)
- [ ] "Audio only" / "Text only" buttons work; "Not now" / X / Esc returns to the landing

### 6.4 Room — live session
- [ ] Begin → "Preparing interview…" → LIVE badge + countdown timer start; welcome line shows in the QuestionPanel and Transcript
- [ ] Camera preview mirrors; mic/camera toggles mute/unmute instantly (placeholder updates)
- [ ] Type an answer in the transcript input → bubble appears (candidate side)
- [ ] Timer counts down; turns red under 1 minute; hitting 0 auto-ends the interview
- [ ] End → confirm dialog → "Ending…" → "Interview complete" screen with Practice again / Try another role
- [ ] Mobile width (~375px): layout stacks, no horizontal scroll, controls reachable

### 6.5 Regression
- [ ] Setup wizard still validates per-step; landing 3D hero still renders; existing tools (e.g. `/compress`) untouched

## 7. Security & privacy spot-checks

- [ ] Session APIs never accept a client-sent `user_id` (identity from cookie only)
- [ ] RLS: with the browser anon client, reading another user's `interview_sessions` returns nothing (policies scope to `auth.uid()`)
- [ ] Recording consent checkbox is required before Begin; `config.recordingConsent` is true on the created session row
- [ ] No secrets in the browser bundle (`grep -r "SERVICE_ROLE" .next` finds nothing)

## 8. Known limitations (not yet testable / deferred)

| Area | Status |
|---|---|
| Voice (STT/TTS) + question engine | Phase 5/6 — speaker button is disabled; transcript input is local-only |
| Reports / scores | Phase 9 |
| History / delete / restart persistence | Phase 10 |
| Resizer lint errors | Pre-existing, unrelated to this module (fix separately) |
