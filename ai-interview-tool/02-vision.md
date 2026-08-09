# AI Interview Tool — Vision (aligned to master spec §1–§7, §113–§117)

## The Goal

Build a **standalone, SEO-first AI Mock Interview product** inside VizoTool — a realistic, voice-driven video interview with an AI interviewer. It is NOT a chatbot, NOT a question bank, NOT a blog feature. It has its own landing page, own funnel, own flow, and feels like a separate product with VizoTool branding.

## The Experience

The candidate:

1. Uploads a resume (PDF)
2. Picks: role, domain, company, experience level, interview type, duration
3. Starts a live interview: camera + microphone, AI interviewer in a professional room
4. Hears AI questions (TTS), answers out loud (STT), text fallback always available
5. Gets adaptive follow-up questions based on every answer
6. Finishes the session — gets a detailed professional report
7. Gets a personalized improvement plan
8. Repeats interviews and tracks progress (later phases)

The report covers: technical score, communication, problem solving, project knowledge, behavioral, per-question analysis, communication metrics (filler words, pace), strengths, weaknesses, mistakes, areas of improvement, and recommended preparation topics.

## Product Principles

1. **One flow, planned upfront** (§8): Setup → Profile → Interview → Report → Improvement Plan. Nothing scattered.
2. **Realistic, not chatty** (§1, §12): the room feels like Zoom/Meet; the AI plays a persona and follows up.
3. **Personalized** (§4 G2, §18–§22): questions come from real resume content, role, domain, and company context.
4. **SEO-first landing** with role/domain subpages and rich FAQs — the interview itself is never indexed.
5. **Modular like the rest of VizoTool** (§86): small files, provider abstractions (LLM/STT/TTS), existing theme, existing tool pattern.
6. **Trustworthy**: explicit recording consent, no psychological claims, no "confidential company questions", scores explained as practice indicators (§31, §55, §96, §98).

## Target Users

- Students (placements, internships)
- Freshers (first technical + HR interviews)
- Working professionals (job switches, promotions)
- Experienced engineers (system design, architecture, leadership)

## Success Criteria

- Landing page 90+ Lighthouse, valid JSON-LD, sitemap inclusion, keyword-rich but natural copy.
- Users complete: setup → live voice interview → report, on desktop + mobile, without leaving the module.
- Reports are genuinely useful and actionable; scores explain.
- Adding a new role/domain takes less than a day.
- Interview session survives a network drop (§76).

## Long-Term Vision (future phases)

Evolve into a **continuous AI career coach** (§114–115): progress tracking (62 → 68 → 74 → 81), skill progress, interview history, replay, coding interviews, system design whiteboard, multi-round interviews, and personalized prep plans powered by the adaptive interview loop:

```text
REALISTIC INTERVIEW → ACCURATE EVALUATION → ACTIONABLE FEEDBACK
→ PERSONALIZED IMPROVEMENT → REPEAT INTERVIEW → MEASURABLE PROGRESS
```

## Non-Goals (initial version)

- No coding/whiteboard/multi-round interview, no avatars, no emotion detection
- No hiring guarantees, no confidential question banks, no psychological diagnosis
- No payments/login walls in MVP (future: credits/plans)