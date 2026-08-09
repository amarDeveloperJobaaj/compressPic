# AI Interview Tool — SEO & Keywords Playbook

This file is BINDING for all AI work. The whole Vizotool website ranks on SEO — this tool creates the page which targets the `AI interview` search category, one of the fastest-growing 2025–2026 job-search niches. Use trending + long-tail keywords naturally. NEVER keyword-stuff. Every page, heading, FAQ answer, and button label is SEO content.

## 1. Trending Keywords (2026 — use these in titles, H1s, content)

| Keyword | Type | Where to use |
|---|---|---|
| AI mock interview | Head | Meta title, H1, hero subheadline |
| AI interview practice | Head | H1/H2, feature copy |
| Free AI interview practice | Head (intent) | Meta title variant, FAQ, CTA |
| Mock interview online | Head | H2, how-it-works copy |
| Interview practice AI | Mid | Feature section, footer links |
| AI interview coach / AI mock interview | Mid | Report page, blog links |
| Interview questions and answers | Long | FAQ, sample-question section, blog |
| Behavioral interview questions | Long | Blog + FAQ |
| Tell me about yourself answer | Long | Blog + sample section |
| Coding interview | Long | Blog / role pages |

## 2. Long-Tail Keywords (low competition, high conversion — use as internal blog/search/content targets)

Job-seeker intent clusters:

- AI mock interview for [role] — e.g. "AI mock interview for frontend developer", "AI mock interview for data analyst"
- Free mock interview practice with feedback
- Mock interview for freshers / college students
- How to prepare for [Job role] interview
- AI interview questions and answers for [role]
- Interview preparation for placements / campus placement
- Practice interview my first interview
- "Please tell me about yourself" answer for fresher
- Behavioral interview questions and answers with examples
- Resume-based mock interview
- How to pass [role] interview as a fresher
- Best mock interview app
- AI interview coach free
- Interview score / interview feedback AI

Feature-intent clusters (capture these in copy):

- AI interview with real-time feedback
- AI scored mock interview
- Interview with AI per rule persona
- Interview practice for job interview 2026
- Speak in interview practice (voice answers)

## 3. Keyword Usage Map (exactly where each type goes)

| Placement | Keyword target | Notes |
|---|---|---|
| `app/ai-interview/page.tsx` metadata.title | "AI Interview — Mock Interview Practice with AI (Free)" | ≤ 60 chars-count, brandless |
| metadata.description | "Practice AI mock interviews with a real-time AI interviewer. Get scored feedback, weaknesses report, and answers of [role]. Free." | ≤ 155 chars |
| H1 (hero) | "AI Interview practice", "mock interview", "AI interviewer" | "AI" one H1 only, natural |
| H2s | "How an AI mock interview works" / "AI asked questions for multiple roles" / "Get an AI interview report & score" | one per section |
| CTA buttons | "Start free AI mock interview", "Practice interview", "Try AI interviewer" | Natural language, no stuffing |
| FAQ section | "What is an AI mock interview?", "Is the AI interview free?", "Does it work for freshers?" | Each FAQ is button content + H3 |
| Sample questions | role keyword + a real interview question | e.g. "Frontend challenge: explain event delegation" |
| Blog | AI interview tips, role-specific prep articles | Internal-link to /ai-interview with keyword anchor |

REAL rules:

- If a keyword is used in H1, do NOT repeat verbatim in H2 (use variation/synonym).
- Primary keyword in, or just at the start of, the title + meta description FIRST sentence.
- Keep copy natural — a phrase should never feel forced. Site brand is Vizotool; tool name is "AI Interview Tool".
- FAQ copy and FAQ JSON-LD must match verbatim (same question text, same order) so rich results stay valid.

## 4. Whole-Site SEO Rules (applies beyond this tool)

- Every page: unique title + description + canonical. NEVER duplicate meta across pages.
- Every new public page in the site must be added to the sitemap (see section 5) — no exceptions.
- New blog posts must interlink (≥2 internal links) with tools, category pages.
- Keep every URL lowercase, hyphenated, one-level deep.
- Use existing `components/seo/**` for OG, Twitter, JSON-LD. Do not reinvent.
- Reuse the existing admin blog SEO panel for any AI-tool related content (blog posts, FAQ articles).
- Apply `noindex` to `/ai-interview/start`, `/ai-interview/session`, `/ai-interview/report` (tool pages), private admin flows, and `/api`.

## 5. Sitemap Rule (ALWAYS update the sitemap)

Read-only rule: the sitemap is ALWAYS updated when page-added/removed/renamed. On this project:

- The sitemap is registry-driven: `app/sitemap.ts`
- Tool pages are auto-indexed from `lib/tools.ts` (`ALL_TOOLS` registry)
- The AI interview tool MUST be added to `lib/tools.ts` with its `href` = `/ai-interview`, `category`, name, description. Then `/ai-interview` is in sitemap.xml automatically (weekly/monthly frequency, priority ~0.9).
- Routes exited on purpose = noindex, but never let a noindex page appear in sitemap: keep `/ai-interview/start`, `/ai-interview/session`, `/ai-interview/report` OUT of `ALL_TOOLS` and the sitemap (no metadata sitemap entry).
- If a NEW public SEO page is ever added (e.g. `/ai-interview/faq` or a dedicated role page), it MUST be added to `app/sitemap.ts` manually AND linked via internal-links.
- After sitemap changes, verify:
  1. `npm run build` produces sitemap
  2. open `/sitemap.xml` in browser — URL present, no excluded pages present
  3. `robots.txt` sitemap URL still valid if domain/port changes.

## 6. Verification per Phase for SEO

- [ ] Metadata complete, canonical valid, OG+Twitter done
- [ ] Keywords placed per section 3 map, no stuffing
- [ ] Sitemap updated/verified (section 5)
- [ ] Noindex applied correctly to non-content pages
- [ ] Lighthouse ≥ 90 (perf) / ≥ 95 (SEO+accessibility) on the landing page