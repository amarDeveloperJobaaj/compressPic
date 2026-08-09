# AI Interview Tool — Architecture Notes (Phase 0)

**Date:** 2026-08-09 · **Branch:** `feature/ai-interview/phase-0-research`
**Scope:** Research only — no product code. Maps the existing VizoTool repo so the AI Mock Interview module reuses everything instead of recreating it.

---

## 1. Repository Overview

- **Framework:** Next.js **16.2.12** (App Router), React **19.2.4**, TypeScript 5.
  - ⚠️ Per `AGENTS.md`: Next.js 16 is NOT training-data Next.js — read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
  - Dev script is `next dev --webpack`.
- **Styling:** Tailwind **4** (CSS-first, `@theme` tokens in `app/globals.css`), class-based dark mode (`.dark` on `<html>`, dark is the default).
- **State:** zustand **5** (one store per tool in `store/<tool>-store.ts`).
- **Validation:** zod **4** (used across blog + admin APIs).
- **UI motion:** framer-motion **12** (wrapped in `components/shared/MotionProvider.tsx`).
- **Backend:** Supabase (`@supabase/ssr` + `@supabase/supabase-js`) — blog content + storage; **no public user auth exists yet** (see §5).
- **PDF text extraction:** `pdfjs-dist` **^6.2.108** is already a dependency — ideal for resume parsing in Phase 2 (no new dependency needed).
- **Not present (will add later):** no LLM/STT/TTS SDKs (we use server-side `fetch` adapters + browser APIs — aligned with master spec §34–36); no `ai_provider_configs` / `ai_prompt_configs` tables (Phase 5+ per §118).

---

## 2. Tool Pattern (the convention the AI Interview module must follow)

Observed end-to-end from `passport-photo-maker` / `image-to-pdf` / `remove-background`:

```text
lib/tools.ts                  → registry: TOOL_CATEGORIES → ALL_TOOLS → getToolBySlug()
app/<slug>/page.tsx           → thin page (metadata, PageTransition, layout, feature components)
features/<slug>/components/*  → UI building blocks (UploadZone, editors, controls…)
features/<slug>/utils/*       → pure logic (image/pdf processing)
store/<slug>-store.ts         → zustand store (all tool state + async actions)
```

- `app/<slug>/page.tsx` is `"use client"` for interactive tools and holds **no business logic** — it composes store + feature components.
- Utility/registery files (`lib/*`) stay free of React/lucide imports so server files (sitemap) can import them.
- For the interview module: `features/ai-interview/**` + `store/interview-store.ts` + thin `app/ai-mock-interview/**` pages exactly per `03-tool-info.md` §Feature Folder.

---

## 3. Route Map (existing → where the interview routes land)

### Existing routes relevant to us

| Route | Purpose | Reuse for interview |
|---|---|---|
| `app/[slug]/page.tsx` | Registry-driven SEO landing (conversion pairs, finance, YouTube) with `generateStaticParams` + `dynamicParams = false` | **Pattern source** for `/ai-mock-interview/[role]` subpages |
| `app/<tool-slug>/page.tsx` | Tool pages (e.g. `app/compress`, `app/passport-photo-maker`) | Pattern source for landing/setup/room/report pages |
| `app/admin/**` | Admin panel (login + `(protected)` sections: blogs, media, settings…) | Hosts the future **AI Configuration** section (§118) |
| `app/api/admin/**` + `app/api/auth/**` | Admin API + admin auth routes | API/auth conventions to mirror |
| `app/og/route.tsx` | Dynamic OG image generator (`/og?title=…`) | OG images for landing/role pages |
| `app/robots.ts` | Disallows `/admin`, `/api` | Add interview noindex pages to robots if needed (none required — robots only blocks admin/api) |
| `app/blog`, `app/blogs` | Blog system | Internal links + SEO content source |

### New interview routes (Phase 1+)

| Route | Purpose | Index? | Notes |
|---|---|---|---|
| `app/ai-mock-interview/page.tsx` | SEO landing | ✅ yes | Add to `lib/tools.ts` registry → sitemap auto |
| `app/ai-mock-interview/[role]/page.tsx` | SEO role subpages | ✅ yes | `generateStaticParams` from a role registry (like `app/[slug]`) |
| `app/ai-mock-interview/setup/page.tsx` | Setup wizard | ❌ noindex | |
| `app/ai-mock-interview/room/page.tsx` | Interview room | ❌ noindex | |
| `app/ai-mock-interview/report/page.tsx` | Report + improvement plan | ❌ noindex | |

**Sitemap rule (binding, `06-seo.md`):** `/ai-mock-interview` must be added to `lib/tools.ts` (`href`, category, name, description) so `app/sitemap.ts` picks it up automatically (priority ~0.9). Role pages get manual entries. Setup/room/report NEVER enter the registry or sitemap. Verify `/sitemap.xml` after build.

---

## 4. Reusable Component Inventory

### `components/ui/` (theme primitives)
| Component | Notes |
|---|---|
| `button.tsx` | CVA variants + sizes — use for all CTAs |
| `card.tsx` | Card + Header/Title/Description/Content/Footer slots |
| `input.tsx` | Input with label + error message |
| `dialog.tsx` | Radix dialog modal (overlay, content, header, footer) — base for PermissionModal / consent |
| `progress.tsx` | Radix progress bar — setup wizard progress + report bars |
| `capsule.tsx`, `shimmer-button.tsx`, `spotlight.tsx`, `sparkles.tsx`, `flip-words.tsx`, `text-generate-effect.tsx`, `background-beams.tsx`, `grid-pattern.tsx`, `bento-grid.tsx`, `card-hover-effect.tsx` | Marketing/hero animation primitives for the landing page |
| `Logo.tsx` | Brand logo |

### `components/shared/`
| Component | Notes |
|---|---|
| `Container.tsx` / `Section.tsx` | Layout scaffolding |
| `MotionProvider.tsx` | framer-motion provider (already global in root layout) |
| `PageTransition.tsx` | Page enter/exit animation — used on every tool page |

### `components/layout/`
`Header.tsx`, `Footer.tsx`, `NavDropdown.tsx`, `MobileDrawer.tsx`, `ThemeToggle.tsx` — global shell; **do not modify** unless adding the tool to nav derives from the registry (it does: header nav derives from `lib/tools.ts` categories — adding the tool to the registry auto-adds it to nav/footer/home).

### `components/seo/`
| Component | Notes |
|---|---|
| `JsonLd.tsx` | Generic JSON-LD script block |
| `Breadcrumbs.tsx` | Visual trail + BreadcrumbList JSON-LD |
| `FaqSection.tsx` | FAQ accordion + FAQPage JSON-LD (faq text must match JSON-LD verbatim) |
| `ToolSeoContent.tsx` | Long-form SEO content block used on tool pages |
| `RelatedTools.tsx` | Cross-links tools from registry |
| `AdSlot.tsx`, `AnalyticsScripts.tsx`, `HowToSection.tsx`, `ConversionSeoContent.tsx` | Ads, analytics, how-to schema, conversion pages |

### Toast (important — not in `components/ui`)
`features/playground/components/Toast.tsx` exports **`ToastProvider` + `useToast()`** (`toast(msg, "success" | "error" | "info")`). Used by background-remover, SQL playground, etc. — **reuse this for interview feedback** rather than creating a new toast.

### Category SEO pages (pattern for role subpages)
`components/category/`: `CategoryHero.tsx`, `CategoryLanding.tsx`, `CategoryFaq.tsx`, `CategoryIcon.tsx`, `CategorySeoContent.tsx` — driven by `lib/category-pages.ts` (`CATEGORY_PAGES`). Useful reference when building `/ai-mock-interview/[role]` pages.

### Not present — create in `features/ai-interview/`
No generic upload-progress bar, no stepper/wizard, no video/audio components, no spinner primitive beyond inline Tailwind spinners (tools use `h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent` inline). Per master spec §86 these live inside `features/ai-interview/components/`.

---

## 5. Auth, Database & Storage (what exists / what's missing)

### Auth — ⚠️ critical finding
- **Only admin auth exists:** `lib/admin/config.ts` (env-driven credentials) + `lib/admin/session.ts` (stateless HMAC-SHA256 cookie `vizotool_admin_session`), routes `app/api/auth/{login,logout,session}`.
- **No public/user-facing auth exists.** `lib/supabase/server.ts` (anon key + request cookie jar, RLS-enforced) and `lib/supabase/client.ts` (browser anon) exist, but nothing calls `supabase.auth.signIn…` yet. The admin session file explicitly documents Supabase Auth as the intended future path.
- Master spec §49–50 says: reuse VizoTool's existing auth, never create a second system. **Reality check for Phase 3+:** user-scoped sessions need a decision — either (a) wire Supabase Auth (bigger scope, touches the whole site), or (b) run MVP interviews anonymously with a local/anon session id + user-scoped columns kept RLS-ready. `02-vision.md` says "No payments/login walls in MVP". This decision must be raised with the user before Phase 3 (session engine), not silently assumed.
- **API auth pattern to copy** (admin): `app/api/admin/blogs/route.ts` — `isAdmin()` guard → parse → zod `safeParse` → try/catch → `NextResponse.json({ ok, … })`. Interview APIs will mirror this shape with ownership checks.

### Database (Supabase)
- `supabase/schema.sql`: blog tables (`authors`, `categories`, `tags`, `blogs`, `blog_tags`, `comments`, `newsletter`, `blog_views`, `blog_likes`, `blog_bookmarks`, `featured_blogs`, `settings`) + `public.is_admin()` helper + RLS policies (public read / admin all).
- Migrations convention: numbered files `supabase/migrations/002_blog_cms.sql`, `003_admin_cms.sql` → **Phase 3 adds `004_interview_cms.sql`** (resumes, interview_sessions, interview_questions, interview_answers, interview_evaluations, interview_reports per §42–47) + Phase 5/7 add `ai_provider_configs` + `ai_prompt_configs` per §118.
- `lib/supabase/database.types.ts` — generated types; regenerate after schema changes.
- **Repository pattern** (see `lib/blog/repository.ts`): memory store by default, Supabase when `BLOG_STORAGE=supabase` — a good template if interview sessions ever need a dev fallback.

### Storage
- `lib/supabase/storage.ts`: `uploadImage`/`uploadBlogImage`/`getPublicUrl`/`deleteImage` + `buildStoragePath` (sanitized keys), MIME validation, service-role client. Buckets `blog-images`, `author-images` (defined in `supabase/storage.sql`).
- **Phase 2 resume upload** should follow this pattern: new `resumes` bucket (or reuse the helper with a new bucket + `application/pdf` in allowed types). Resume uploads are user-scoped in the spec — pair with RLS.

### Env vars (server-only rules per §105/§118)
Existing: `ADMIN_*`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `BLOG_STORAGE`.
To add (bootstrap only, never `NEXT_PUBLIC_*`): `AI_PROVIDER`, `AI_API_KEY`, `AI_MODEL`, `STT_PROVIDER`, `STT_API_KEY`, `TTS_PROVIDER`, `TTS_API_KEY` — primary runtime config comes from the Admin Panel `ai_provider_configs` in later phases.

---

## 6. AI Provider Plan (Phase 5+)

- Build the `AIProvider` abstraction (`services/ai/`): `analyzeResume`, `generateQuestion`, `generateFollowUp`, `evaluateAnswer`, `generateReport` — server-only, one class per provider (Gemini first per §118; OpenAI/Claude/DeepSeek later), selected at runtime.
- **No provider SDK needed** — implement with server-side `fetch` against each provider's REST API (SDK not in package.json; avoids lock-in and matches the swappable-adapter design).
- `services/ai-config/` (Phase 5/7): resolve active provider/model/key/prompt from Admin-managed tables, cache + invalidate, decrypt key server-side only, session prompt snapshots.
- Speech: browser `SpeechRecognition` (`services/speech/`) + browser `SpeechSynthesis` (`services/tts/`) for MVP — zero new dependencies, graceful text fallbacks (§37).
- Validate EVERY AI response with zod (§74); treat resume/answers/company names strictly as data (§73).

---

## 7. Theme & Design Tokens (reuse — no new design system)

`app/globals.css` (Tailwind 4 `@theme`):

- Colors: `primary` (#2563EB light / #3B82F6 dark), `primary-dark`, `primary-light`, `background` (#F8FAFC / #0B1120), `surface` (#FFFFFF / #121B2E), `border` (#E5E7EB / #1E2A44), `text-primary` (#111827 / #E6EDF7), `text-secondary`, `text-muted`, `success`/`error`/`warning` (+ `-light` variants).
- Radii: `sm/md/lg/xl/2xl`. Animations: `fade-in`, `slide-up`, `scale-in`, `spotlight`, `beam-slow`, `glow-pulse`, `marquee`, `wave`, `logo-shine`, `logo-spark`.
- Utilities: `container-page` (1280px max), `text-balance`, `content-visibility-auto`.
- Dark mode is default; `.dark` class toggling via `ThemeToggle` + pre-hydration script.
- Focus ring: `*:focus-visible { outline: 2px solid var(--color-primary) }` — accessibility baseline already global.

**Interview room exception:** the room may introduce a focused dark video-meeting UI (§15) but must stay consistent with these tokens (`bg-background`, `bg-surface`, `border`, `text-*`) — no global theme changes.

---

## 8. SEO Plan Summary (Phase 1)

- `lib/seo.ts` already provides `buildMetadata` (title/desc/canonical/OG/Twitter), `softwareApplicationSchema`, `faqPageSchema`, `breadcrumbListSchema`, `howToSchema`, `ogImageUrl` — use these, don't reinvent (master spec §83–84 + `06-seo.md`).
- Landing title target (per `06-seo.md` map): "AI Interview — Mock Interview Practice with AI (Free)" (≤60 chars), description ≤155 chars, keyword map followed (no stuffing).
- JSON-LD: `SoftwareApplication` + `FAQPage` on landing; FAQ visible text == JSON-LD text verbatim.
- Sitemap: registry-driven (`lib/tools.ts`) — add `/ai-mock-interview` in Phase 1; role pages manual; noindex on setup/room/report; verify `/sitemap.xml` post-build.
- Lighthouse target: ≥90 perf, ≥95 SEO/a11y on landing.

---

## 9. Risk List

1. **No public user auth** — master spec assumes auth-scoped sessions (§49) but the site only has admin auth. Needs an explicit MVP decision (anonymous session vs. wiring Supabase Auth) before Phase 3. RLS-ready columns regardless.
2. **Browser media permissions** (camera/mic) — `getUserMedia` quirks across Chrome/Safari/Firefox, permission-denied flows, mobile browsers; needs audio-only + text fallbacks (§75) and PermissionModal (Phase 4).
3. **Browser SpeechRecognition availability** — only Chromium-based browsers ship it; Safari/others need text fallback; types need `any` casts (not in TS lib.dom by default).
4. **Next.js 16 differences** — params are Promises in route handlers/pages (`await params`), cookies() is async, server-only packages; must read `node_modules/next/dist/docs/` before coding.
5. **AI cost & latency** — one evaluation per answer + one report call (§38); zod-validate outputs with retry→fallback (§74); provider failover chain (§103).
6. **RLS & ownership** — every interview API must verify session ownership server-side (never trust client `user_id`, §50); admin `ai_*` tables admin-only RLS (§118).
7. **Prompt injection** — resume text/answers are untrusted data (§73); structured JSON output enforced (§53).
8. **Streaming/long-request timeouts** — LLM calls in route handlers can exceed platform limits; design report/question generation with timeouts + retries + user-visible loading states (§78).
9. **Session recovery** (§76) — network drop mid-interview must restore from persisted rows; decide persistence granularity in Phase 3 (no per-keystroke writes).
10. **Sitemap/noindex discipline** — forgetting to register the landing tool (or leaking setup/room/report into the sitemap) breaks `06-seo.md` rules; verify after every phase touching routes.
11. **Recording consent/privacy** (§31–32) — explicit consent checkbox before any capture; no silent recording; retention + delete controls.

---

## 10. Conclusion

The architecture is fully understood. The AI Mock Interview module fits cleanly into the existing pattern:

- **Reuse:** zustand stores, `features/<tool>` layout, `components/ui` + `shared` + `seo`, Toast provider, `lib/seo.ts` metadata/schema builders, Supabase clients + storage helpers, admin API/auth conventions, `lib/tools.ts` + sitemap wiring, `pdfjs-dist` for PDF text extraction.
- **Create new (inside the module only):** `features/ai-interview/**`, `store/interview-store.ts`, `app/ai-mock-interview/**` pages, `app/api/interview/**` handlers, new Supabase migrations (Phase 3+).
- **Open decision for the user:** public auth strategy for user-scoped sessions (before Phase 3).

**Build status:** unchanged by this phase (docs only). `npm run lint` + `npm run build` verified green.
