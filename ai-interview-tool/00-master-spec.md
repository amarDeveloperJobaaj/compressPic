# VizoTool — AI Mock Interview

## Product, UX, AI & Technical Development Documentation

**Document:** `00-master-spec.md`
**Product:** VizoTool
**Module:** AI Mock Interview
**Status:** Product Specification & Development Blueprint
**Version:** 1.0
**Last Updated:** August 2026

---

# 1. Executive Summary

The **AI Mock Interview** is a major product module of VizoTool designed to simulate realistic job interviews using Artificial Intelligence.

Unlike traditional interview-preparation tools that only display questions or provide text-based chatbot interactions, this system provides an **immersive interview experience** similar to a real online video interview.

The candidate will:

1. Upload their resume.
2. Select their target domain.
3. Select or enter a target company.
4. Select the desired job role.
5. Select experience level.
6. Choose an interview type.
7. Start a live AI-powered interview.
8. Enable their camera and microphone.
9. Interact with an AI interviewer using voice.
10. Answer dynamically generated questions.
11. Receive contextual follow-up questions.
12. Complete the interview.
13. Receive a detailed AI-generated performance report.

The report analyzes: technical knowledge, answer quality, communication, problem solving, project knowledge, relevance, clarity, answer structure, speaking behavior, strengths, weaknesses, mistakes, areas of improvement, recommended preparation topics, question-by-question performance, and an overall interview score.

The long-term objective is a realistic **AI interview simulator and personal interview coach**.

---

# 2. Product Vision

> **Help every candidate practice realistic job interviews with an AI interviewer before facing a real interviewer.**

The system must not feel like a simple chatbot. It should feel like: *"I am actually sitting in an interview."*

The candidate should experience:

- A professional interview environment
- AI voice interaction
- Camera-based interview
- Natural follow-up questions
- Resume-specific questions
- Company/role-specific questions
- Increasing or decreasing difficulty
- Real-time interview flow
- Professional post-interview feedback

---

# 3. Product Mission

Make high-quality interview practice: accessible, affordable, personalized, realistic, data-driven, and repeatable. A candidate practices multiple times and clearly understands how performance improves.

---

# 4. Product Goals

- **G1 — Realistic Experience:** resembles Zoom/Google Meet from the candidate's perspective.
- **G2 — Personalized:** questions from resume, skills, projects, experience, company, role, domain, interview type, previous answers.
- **G3 — Adaptive:** AI decides what to ask next based on the previous response.
- **G4 — Detailed Evaluation:** actionable feedback, not just a score.
- **G5 — Improvement Tracking:** track performance across attempts.

---

# 5. Non-Goals (v1 must NOT)

- Replace human interviewers / guarantee employment / predict hiring
- Claim access to confidential company questions
- Diagnose emotions or mental states; psychological conclusions from expressions
- Unrestricted facial recognition
- Record without explicit consent

---

# 6. Target Users

- **Students** — placements, internships, entry-level
- **Freshers** — first technical + HR interviews
- **Working Professionals** — switches, promotions, senior roles
- **Experienced Developers** — technical rounds, system design, leadership

---

# 7. User Personas

**Fresher** — first SWE job: basic technical practice, HR questions, communication feedback, confidence.
**Junior Developer** — better company: resume questions, project deep dives, company simulation.
**Experienced Engineer** — senior interviews: system design, architecture, leadership, deep follow-ups.

# 8. Core User Journey

```text
                    VizoTool
                       |
                       v
              AI Mock Interview
                       |
                       v
               Interview Setup
                       |
          +------------+-------------+
          |            |             |
        Resume       Company        Role
          |            |             |
          +------------+-------------+
                       |
                       v
               Candidate Profile
                       |
                       v
               Interview Strategy
                       |
                       v
                Start Interview
                       |
                       v
              Camera + Microphone
                       |
                       v
                 AI Question
                       |
                       v
                 User Answer
                       |
                       v
                Speech-to-Text
                       |
                       v
              Answer Evaluation
                       |
                       v
              Next Question
                       |
          +--------+--------+
          |                 |
       Follow-up         New Topic
          |                 |
          +--------+--------+
                       |
                       v
                End Interview
                       |
                       v
              AI Final Evaluation
                       |
                       v
              Detailed Report
                       |
                       v
             Improvement Plan
```

---

# 9. Interview Setup

Configure before start:

- **Resume** — upload PDF (DOC/DOCX later).
- **Target Role** — Software Engineer, Frontend, Backend, Full Stack, Data Analyst, Data Scientist, Product Manager.
- **Domain** — MERN, Java, Python, React, Node.js, PHP, Data Science, ML, DevOps, Cybersecurity.
- **Experience Level** — Fresher, 0–1, 1–3, 3–5, 5–8, 8+ years.
- **Target Company** — Google, Microsoft, Amazon, TCS, Infosys, Startup, Custom.

The system must never imply it holds confidential interview material from any company.

---

# 10. Interview Types

- **Technical** — programming, frameworks, databases, APIs, architecture, debugging.
- **HR** — introduction, career goals, strengths, weaknesses, motivation, teamwork.
- **Behavioral** — leadership, conflict, decision making, failure, teamwork, ownership.
- **System Design** — architecture, scalability, databases, caching, load balancing, distributed systems.
- **Mixed** — combination of Technical + HR + Behavioral + Project. **Default recommendation.**

---

# 11. Interview Duration

10 / 20 / 30 / 45 / 60 minutes. **MVP: 15–20 minutes.** Longer interviews after the core system is stable.

---

# 12. Interview UI / UX

Feels like a professional video meeting:

```text
+---------------------------------------------------+
| VizoTool AI Interview           18:42    ● LIVE    |
+---------------------------------------------------+
|               USER CAMERA                         |
|                                    +--------+     |
|                                    |   AI   |     |
|                                    |INTER-  |     |
|                                    |VIEWER  |     |
|                                    +--------+     |
+---------------------------------------------------+
| Question / AI transcript ring text               |
+---------------------------------------------------+
|  🎤 Mic    📹 Camera    🔊 Speaker        End     |
+---------------------------------------------------+
```

---

# 13. Visual Design Direction

> **Do not redesign VizoTool globally to accommodate this module.**

Reuse existing: colors, typography, spacing, buttons, cards, animations, navigation, theme, responsive behavior, components, SEO helpers, utility components. Only the interview room may introduce specialized video-interview UI.

---

# 14. Theme

Professional, modern, focused, minimal, premium, trustworthy. Avoid excessive gradients/animations, distracting backgrounds, gaming-style UI, visual noise. The candidate stays focused on the interviewer.

---

# 15. Interview Room Theme

Optional darker, focused environment, consistent with the design language.

Hierarchy: Background → Video area → AI interviewer → Question → Controls.

The AI interviewer should visually communicate: Listening, Thinking, Speaking, Processing, Waiting.

---

# 16. Responsive Design

Support desktop, laptop, tablet, mobile. **Desktop/laptop is primary** (camera interviews); mobile gets a stacked functional layout.

---

# 17. Accessibility

Keyboard navigation, screen-reader controls, clear focus states, proper contrast, permission explanations, captions/transcript, and a text alternative to AI voice. Users must never depend on audio alone.

# 18. Resume Analysis

One of the most important personalization layers.

```text
Resume Upload → File Validation → Text Extraction → Resume Normalization
→ LLM Analysis → Candidate Profile
```

---

# 19. Candidate Profile

The AI converts the resume into structured information:

```json
{
  "candidate_name": "Candidate",
  "experience_level": "Junior",
  "skills": ["React", "Node.js", "MongoDB", "JavaScript"],
  "projects": [
    {
      "name": "E-commerce Platform",
      "technologies": ["React", "Node.js", "MongoDB"]
    }
  ],
  "experience": [],
  "education": [],
  "certifications": [],
  "likely_strengths": [],
  "potential_weaknesses": []
}
```

---

# 20. Resume-Based Question Generation

Example — resume says:

> Built an HR Management System using React and Node.js.

AI:

> "Can you explain the architecture of the HR Management System you built?"

Follow-up:

> "Why did you choose MongoDB instead of PostgreSQL?"

Follow-up:

> "How did you handle authentication?"

This creates a realistic project deep-dive interview.

---

# 21. Resume Integrity

Detect inconsistencies carefully, never accuse. If resume says "Expert in system design" but the candidate cannot explain basic concepts, the report says:

> "Your practical explanation did not demonstrate the depth expected from the level stated on your resume."

**Never say:** "You lied on your resume."

---

# 22. Company Context

Company selection influences interview **style**, not claims. Use publicly reported patterns, role expectations, industry standards, public job descriptions, commonly reported formats.

**Never:** "These are Google's actual interview questions."
**Always:** "This simulation is designed around commonly reported interview patterns and the expectations of the selected role."

---

# 23. Interview Engine

The core intelligence layer. It determines: what to ask, when to follow up, difficulty, topic selection, progression, topic switching, and when to end.

---

# 24. Adaptive Interview Logic

Not fixed Q1 → Q2 → Q3. Instead:

```text
Question → Answer → Evaluate
  Strong      → harder follow-up
  Weak        → clarification
  Incorrect   → concept check
  Good        → new topic
  Excellent   → advanced topic
```

---

# 25. Interview Difficulty

Levels: Beginner, Intermediate, Advanced, Expert. Adapts dynamically:

- Weak answer → "Let's approach this from the basics. What is the purpose of an API?"
- Strong answer → "How would you design this API for 1 million daily requests?"

---

# 26. Question Categories

- **Technical** — concepts, implementation, debugging, architecture, performance
- **Project** — architecture, decisions, challenges, trade-offs, results
- **Behavioral** — leadership, conflict, failure, ownership
- **HR** — introduction, motivation, career goals
- **Problem Solving** — scenarios, debugging, design decisions

---

# 27. Question Lifecycle

```text
Generated → Asked → Answered → Transcribed → Evaluated → Stored → Used for next decision
```

---

# 28. Speech-to-Text

```text
Audio → Speech-to-Text → Transcript
```

The transcript is used for evaluation, follow-ups, the final report, communication analysis, and history.

---

# 29. Text-to-Speech

```text
LLM → Text → TTS → Audio (candidate hears the question)
```

The UI always displays the question as text too.

---

# 30. Browser Audio/Video

```js
navigator.mediaDevices.getUserMedia({ video: true, audio: true });
```

Permissions requested only when required, with a clear explanation of why camera/mic are needed.

---

# 31. Recording Policy — Explicit Consent

Before any recording:

```text
Your interview may be recorded for analysis.
[X] I agree to recording and processing
```

Never silently record. Inform users what/why/how is recorded, how long it is kept, and that it can be deleted.

---

# 32. Privacy

Sensitive data: resume, audio, video, transcript, scores, history.
Controls: secure storage, access control, encryption in transit, user deletion, retention policy, explicit consent.

---

# 33. Real-Time Architecture

```text
Browser (Camera + Mic) → Interview UI → Backend Session
   → Speech-to-Text → Transcript → LLM → Next Question
   → TTS → AI Interviewer
```

# 34. AI Provider Abstraction

One interface; providers swappable without rewriting the engine:

```text
AIProvider
  generateQuestion()
  generateFollowUp()
  evaluateAnswer()
  generateReport()
  analyzeResume()
```

Implementations: OpenAIProvider, GeminiProvider, ClaudeProvider, DeepSeekProvider.

> **Dynamic control (§118, block 10):** the ACTIVE provider/model/credentials/prompts are chosen at runtime from the Admin Panel through the AI Configuration Service. The engine never hardcodes a provider, model, or key. See the AI Configuration & Admin Control specification (§118).

---

# 35. STT Provider Abstraction

```text
SpeechToTextProvider
  transcribe()
  detectLanguage()
```

Providers: Whisper, Deepgram, AssemblyAI, BrowserSpeech.

---

# 36. TTS Provider Abstraction

```text
TextToSpeechProvider
  synthesize()
```

Providers: Browser TTS, OpenAI TTS, ElevenLabs, Google TTS.

---

# 37. Recommended MVP Stack

- LLM: Gemini / OpenAI free or low-cost tier
- STT: Browser Speech Recognition or Whisper
- TTS: Browser SpeechSynthesis
- Camera: Browser MediaDevices API
- DB: Supabase / PostgreSQL
- Storage: Supabase Storage
- Hosting: Vercel

Providers stay configurable through the abstraction layer, and the active provider/model/credentials are managed from the Admin Panel (dynamic configuration per §118). Environment variables act as secure bootstrap configuration only.

---

# 38. Cost Optimization

- One structured evaluation per answer → decides the next question (no calls per UI event)
- Final report: one comprehensive call with all answers
- Avoid invoking an expensive model for tiny events

---

# 39. Model Routing (future)

- Transcript cleanup → cheap model
- Question generation → medium model
- Complex/system-design evaluation → advanced model
- Final report → advanced model

---

# 40. Interview Session State

```json
{
  "session_id": "...",
  "current_question": 7,
  "current_topic": "authentication",
  "difficulty": "advanced",
  "questions_asked": 7,
  "questions_answered": 6,
  "remaining_time": 612,
  "performance_summary": {},
  "candidate_profile": {}
}
```

---

# 41. Database Architecture

```text
users
  → resumes
  → interview_sessions
      → interview_questions
      → interview_answers
      → interview_evaluations
      → interview_reports
      → interview_metrics
  → ai_provider_configs     (admin-managed AI provider settings, §118)
  → ai_prompt_configs       (admin-managed versioned prompts, §118)
  → ai_usage_logs           (per-interview AI usage for monitoring, §118)
```

The `ai_*` tables are admin-only (RLS: admins only); sessions store provider/prompt **snapshots**, never credentials (§118).

---

# 42. `resumes`

`id`, `user_id`, `file_name`, `file_url`, `parsed_text`, `candidate_profile`, `created_at`, `updated_at`.

---

# 43. `interview_sessions`

`id`, `user_id`, `resume_id`, `target_company`, `target_role`, `domain`, `experience_level`, `interview_type`, `duration`, `status`, `started_at`, `ended_at`, `overall_score`, `created_at`.

---

# 44. `interview_questions`

`id`, `session_id`, `question`, `question_type`, `topic`, `difficulty`, `sequence`, `parent_question_id`, `asked_at`.

`parent_question_id` supports follow-up relationships.

---

# 45. `interview_answers`

`id`, `question_id`, `transcript`, `audio_url`, `video_url`, `duration_seconds`, `created_at`.

---

# 46. `interview_evaluations`

`id`, `answer_id`, `technical_score`, `relevance_score`, `clarity_score`, `communication_score`, `problem_solving_score`, `answer_quality_score`, `strengths`, `weaknesses`, `missing_points`, `improvement`, `created_at`.

---

# 47. `interview_reports`

`id`, `session_id`, `overall_score`, `technical_score`, `communication_score`, `problem_solving_score`, `project_score`, `behavioral_score`, `strengths`, `weaknesses`, `improvement_areas`, `recommended_topics`, `summary`, `created_at`.

---

# 48. API Architecture

```text
POST   /api/interview/resume/upload
POST   /api/interview/resume/analyze

POST   /api/interview/session/create
GET    /api/interview/session/:id
POST   /api/interview/session/:id/start
POST   /api/interview/session/:id/end

POST   /api/interview/question/generate
POST   /api/interview/question/follow-up

POST   /api/interview/answer/transcribe
POST   /api/interview/answer/evaluate

POST   /api/interview/report/generate
GET    /api/interview/report/:id

GET    /api/interview/history
DELETE /api/interview/session/:id
```

Final route naming must follow existing VizoTool conventions.

> **Admin AI endpoints** (providers, prompts, usage, test connection, audit) are separate admin-only routes following the existing VizoTool admin API pattern — see §118 block 31 (Admin AI API).

---

# 49. Authentication

Use VizoTool's existing auth — never create a second system. All data is scoped to the authenticated user (only own resumes/interviews/reports).

---

# 50. Authorization

Verify on every request: (1) authentication, (2) session ownership, (3) resource ownership. Never trust a `user_id` from the client — derive identity from the server-side auth session.

---

# 51. Prompt Architecture

Versioned prompts:

```text
/prompts
  /resume
  /interview
  /followup
  /evaluation
  /report
```

Versioned names: `interview-question-v1`, `evaluation-v1`, `report-v1`... — improvements traceable.

> **Dynamic prompt management (§118, blocks 4–5):** the same prompts are stored in the `ai_prompt_configs` table and can be edited/published from the Admin Panel. Source files serve as the v1 seed, and Admin-published versions are the runtime source of truth — the two must stay in sync.

---

# 52. Question Prompt Context

The AI receives structured context: candidate profile, company, role, domain, level, interview type, current topic, previous questions + answers, performance summary, remaining time. The prompt must demand structured JSON output.

---

# 53. Structured AI Output

Never depend on free-form AI output:

```json
{
  "action": "FOLLOW_UP",
  "question": "Why did you choose JWT?",
  "topic": "authentication",
  "difficulty": "medium",
  "reason": "Mentioned JWT but did not explain the trade-off."
}
```

Actions: `FOLLOW_UP`, `NEW_TOPIC`, `INCREASE_DIFFICULTY`, `DECREASE_DIFFICULTY`, `CLARIFICATION`, `END_INTERVIEW`.

# 54. Answer Evaluation Dimensions

- **Technical accuracy** — is the content correct?
- **Relevance** — direct answer to the question?
- **Completeness** — key concepts covered?
- **Clarity** — understandable?
- **Structure** — logically organized?
- **Depth** — appropriate for experience level?

---

# 55. Communication Analysis

Measurable behaviors only — no psychological claims:

- Speaking pace
- Answer duration
- Long pauses
- Filler words
- Repeated phrases
- Answer structure
- Clarity

Avoid "You are an anxious person." Prefer "You had 5 long pauses during the interview."

---

# 56. Filler Word Detection

Common: um, umm, uh, like, basically, actually, you know, so.

Report style:

```text
Filler Words: 17
Most frequent:
"basically" — 6
"like" — 5
"actually" — 3
```

---

# 57. Speaking Pace

```text
Speaking Pace: 142 words/minute   Assessment: Moderate
```

A communication metric — never a personality judgment.

---

# 58. Final Report

```text
Interview Result

Overall Score: 78 / 100

Technical            82
Communication        80
Problem Solving       79
Project Knowledge    88
Behavioral           72
```

---

# 59. Report Sections

1. Overall summary (short AI overview)
2. What you did well (specific strengths)
3. What went wrong (specific mistakes)
4. Areas of improvement (prioritized)
5. Question analysis (per-question feedback)
6. Communication analysis (speaking metrics)
7. Recommended preparation (topics to study)
8. Suggested next interview (AI recommendation)

---

# 60. Example Strengths

- Strong understanding of React fundamentals
- Explained project architecture clearly
- Practical examples, not just theory
- Good understanding of REST APIs

---

# 61. Example Weaknesses

- Auth and authorization mixed together
- Database indexing depth lacking
- Answers short for the experience level
- Implementation without reasoning

---

# 62. Improvement Plan

Prioritized plan with topics + practice sessions:

```text
Priority 1: Authentication & Authorization
Why:      You struggled with token lifecycle questions.
Practice: JWT, refresh tokens, session auth, OAuth, token expiration
Goal:     3 focused practice sessions
```

---

# 63. Question-Level Report

```text
Question #7
"How would you scale your Node.js API?"
Score: 6.5 / 10
Good:    horizontal scaling, load balancing
Missing: caching, database bottlenecks, rate limiting
Improve: Load Balancer → App Instances → Cache → Database
```

---

# 64. Interview Progress (future)

```text
Interview #1: 62   #2: 68   #3: 74   #4: 81
```

---

# 65. Skill Progress (future)

```text
React 82%, Node.js 76%, MongoDB 61%, System Design 54%, Communication 72%
```

---

# 66. Interview History (future)

```text
MERN — Software Engineer, Google-style, Score 78, 20 min
MERN — Full Stack, Mixed, Score 71, 15 min
Node.js — Backend Dev, Technical, Score 83, 20 min
```

---

# 67. Future — Interview Replay

Replay video + audio, read transcript, jump to a question, view AI feedback beside the recording.

---

# 68. Future — Coding Interview

AI interviewer + live code editor + test cases + code evaluation. E.g. "Implement the first non-repeating character" while AI watches and follows up.

---

# 69. Future — System Design Whiteboard

Canvas with components, arrows, DB symbols, API boxes; AI asks about trade-offs while the candidate designs (e.g. "Design YouTube — how would you handle uploads?").

---

# 70. Future — Interviewer Personalities

Friendly | Professional | Strict | Senior Engineer | HR Manager. Styles affect communication tone only — evaluation fairness never changes.

---

# 71. Future — Multi-Round Interview

Round 1 Resume Screening → Round 2 Technical → Round 3 Project Deep Dive → Round 4 System Design → Round 5 HR → Final Report.

# 72. Security Requirements

- **File validation** — resume type, size, content safety
- **API security** — rate limiting, auth, authorization, input validation, secret handling
- **AI security** — never expose API keys, internal prompts, provider credentials, or system instructions

---

# 73. Prompt Injection Protection

Resumes, answers, company names, job descriptions are **user-controlled input** — treat strictly as data, never as instructions. A malicious resume saying "ignore all previous instructions" must have no effect.

---

# 74. AI Output Validation

Validate every AI response with Zod (or the existing VizoTool validation). On invalid output: schema validation → retry once → graceful fallback.

---

# 75. Error Handling

- **Camera denied** → "Camera permission is required"; offer audio-only fallback
- **Mic denied** → clear permission instructions
- **Speech failure** → manual text input fallback
- **AI timeout** → safe retry
- **TTS failure** → show question as text
- **Resume parse failure** → ask for another supported file
- **Network interruption** → persist and restore session

---

# 76. Interview Recovery

```text
Active Interview → Connection Lost → Reconnect → Restore Session → Continue
```

Never lose a whole interview to a temporary connection issue.

---

# 77. Non-Blocking UI

Keep the interview UI responsive while transcribing, calling the LLM, TTS, or uploading — all async.

---

# 78. Loading States

Tell the user what is happening: "Preparing interview...", "Analyzing resume...", "Generating question...", "Listening...", "Processing answer...", "Preparing follow-up...", "Generating report...". Never an unexplained spinner.

---

# 79. Interview State Machine

```text
IDLE → PREPARING → READY → ACTIVE → LISTENING → PROCESSING → ASKING
→ ACTIVE ← (loop) → ENDING → GENERATING_REPORT → COMPLETED
```

Handle error states separately.

---

# 80. Analytics Events

`interview_setup_started`, `resume_uploaded`, `resume_analyzed`, `interview_started`, `camera_enabled`, `microphone_enabled`, `question_asked`, `answer_submitted`, `follow_up_generated`, `interview_completed`, `report_generated`, `report_viewed`, `interview_restarted`.

Collect nothing beyond product essentials.

---

# 81. Product Metrics

- Activation: started after visiting
- Completion rate
- Average interview duration
- Repeat rate (returns)
- Score improvement across attempts
- Report engagement
- Progress tracking engagement

---

# 82. SEO Strategy

SEO-ready public pages:

- `/ai-mock-interview` (landing)
- `/ai-mock-interview/software-engineer`
- `/ai-mock-interview/frontend-developer`
- `/ai-mock-interview/backend-developer`
- `/ai-mock-interview/mern`
- `/ai-mock-interview/java`
- `/ai-mock-interview/python`

The interview session UI is NOT indexable. Follow existing VizoTool routing conventions.

---

# 83. Landing Page Copy

- **Hero:** "Practice Interviews. Get Real Feedback."
- **Subheading:** Practice personalized mock interviews with an AI interviewer based on your resume, role, domain, and career goals.
- **CTA:** "Start Interview"
- **Secondary CTA:** "See How It Works"

---

# 84. Landing Page Sections

1. Hero
2. How It Works
3. Upload Resume
4. Choose Target Role / Domain
5. Meet AI Interviewer
6. Realistic Interview
7. Detailed AI Feedback
8. Skill Analysis
9. Interview Progress
10. FAQ
11. CTA

---

# 85. Design Principles

**Focus** — no distractions during interviews. **Clarity** — every state understandable. **Realism** — feels like a real interview. **Actionability** — feedback tells exactly what to improve. **Trust** — transparent about AI, recording, and data.

---

# 86. Component Structure

```text
features/ai-interview/
  components/
    InterviewSetup/  ResumeUploader/  InterviewRoom/
    VideoPanel/  AIInterviewer/  InterviewControls/
    QuestionPanel/  TranscriptPanel/  InterviewTimer/
    PermissionModal/  InterviewReport/  ScoreCard/
    StrengthsCard/  WeaknessesCard/  ImprovementCard/
    QuestionAnalysis/  InterviewHistory/
  services/   → interview/, resume/, ai/, speech/, tts/
  schemas/    → interview.ts, resume.ts, evaluation.ts
  types/      → interview.ts, evaluation.ts
  prompts/    → resume/, question/, followup/, evaluation/, report/
```

Directory placement follows existing VizoTool architecture.

---

# 87. Existing Project Protection Rules

NEVER: recreate VizoTool, redesign it globally, replace the global theme, change navigation unnecessarily, rename routes, remove tools, modify existing Image/PDF/Developer/SEO/Website-Analysis tools, remove reusable components, duplicate utilities, or break functionality.

---

# 88. Reuse Existing Systems

Inspect first for: buttons, cards, modals, forms, inputs, uploaders, toasts, loading states, auth, DB utilities, API utilities, SEO utilities, theme utilities, animation components, error handling, validation schemas. Reuse before creating.

---

# 89. Development Rule

The AI agent must: inspect architecture → identify reusable components, auth, DB utilities, design tokens, API patterns, validation → then add the AI Mock Interview without breaking anything. Never start with an unrelated architecture.

# 90. Phase-Wise Development Plan

Strict order — each phase completes and is tested before the next starts (Rule 14).

## PHASE 0 — Architecture & Research

**Objective:** Understand the existing VizoTool project before writing code.

**Tasks:** inspect repository, routing, components, authentication, database, storage, design system, API patterns, deployment config.

**Deliverables:** architecture map, reusable-component list, DB plan, API plan, AI provider plan, risk list.

**Completion criteria:** no implementation begins until the architecture is understood.

## PHASE 1 — Product Foundation

**Objective:** Build the feature shell.

**Tasks:** AI Interview route, landing page, interview setup page, resume uploader, role/domain/company/experience/interview-type selectors.

**Deliverable:** user can configure an interview.

## PHASE 2 — Resume Intelligence

**Objective:** personalized candidate context.

**Tasks:** upload, file validation, text extraction, parsing, candidate profile, skills/projects/experience extraction, resume summary.

**Deliverable:** structured candidate profile.

## PHASE 3 — Interview Session System

**Objective:** interview lifecycle.

**Tasks:** create session, start session, session state, timer, question storage, answer storage, completion, recovery.

**Deliverable:** complete session state system.

## PHASE 4 — Interview Room UI

**Objective:** Zoom-like interview experience.

**Tasks:** camera preview, microphone, AI interviewer panel, question panel, controls, timer, permission handling, responsive layout, interview states.

**Deliverable:** functional interview room UI.

## PHASE 5 — AI Question Engine

**Objective:** generate personalized questions.

**Tasks:** provider abstraction, resume context, role/company/domain context, question generation, question storage, difficulty system.

**Deliverable:** AI can conduct a basic interview.

## PHASE 6 — Speech System

**Objective:** enable voice interaction.

**Tasks:** speech-to-text, transcript processing, text-to-speech, AI voice, listening/speaking/processing states, fallbacks.

**Deliverable:** candidate has a voice conversation.

## PHASE 7 — Adaptive Interview Engine

**Objective:** make the interview intelligent.

**Tasks:** answer evaluation, follow-up questions, difficulty adaptation, topic switching, weak-/strong-area detection, pacing, ending logic.

**Deliverable:** dynamic interview, not a fixed questionnaire.

## PHASE 8 — Evaluation Engine

**Objective:** evaluate every answer.

**Tasks:** technical evaluation, relevance, completeness, communication, clarity, structure, depth, answer quality.

**Deliverable:** question-level evaluations.

## PHASE 9 — Final Report

**Objective:** detailed candidate report.

**Tasks:** overall + category scores, strengths, weaknesses, mistakes, improvement areas, recommended topics, question analysis, communication metrics, summary.

**Deliverable:** professional interview report.

## PHASE 10 — Interview History & Progress

**Objective:** track improvement.

**Tasks:** history, previous reports, score comparison, skill progress, totals, delete, restart.

**Deliverable:** personal interview dashboard.

## PHASE 11 — Optimization

**Objective:** quality + cost.

**Tasks:** caching where appropriate, model routing, token optimization, streaming, audio compression, storage optimization, rate limiting, error recovery, performance.

**Deliverable:** stable, cost-efficient system.

## PHASE 12 — Production Hardening

**Objective:** prepare for real users.

**Tasks:** security audit, privacy audit, permission flows, rate limiting, input validation, AI output validation, error handling, monitoring, analytics, deletion flows, load testing.

**Deliverable:** production-ready module.

## PHASE 13 — Advanced Features

Coding interviews, system design, whiteboard, interview replay, advanced voice analysis, multi-round interviews, interviewer personalities, personalized prep plans, company/role simulation modes, skill progressions, premium plans.

---

# 91. MVP Definition

MVP is complete when a user can:

```text
1. Open AI Mock Interview
2. Upload resume
3. Select role, domain, company, experience, interview type
4. Start interview
5. Enable camera
6. Enable microphone
7. Hear AI question
8. Answer using voice (text fallback)
9. Receive next question (+ follow-up)
10. Complete interview
11. Receive AI report
```

Report must include: overall score, technical score, communication score, strengths, weaknesses, mistakes, improvement areas, question-level feedback.

---

# 92. MVP Exclusions (scope guard)

No: live coding, whiteboard, multi-round interviews, advanced facial analysis, complex avatar renderings, real-time emotion detection, complex company integrations, advanced video editing.

---

# 93. Testing Strategy

- **Unit:** score calculations, session transitions, question state, validation, AI response parsing.
- **Integration:** resume → profile, session → question, answer → evaluation, transcript → report.
- **E2E:** signup → resume upload → setup → start → answer → follow-up → end → report.

---

# 94. AI Evaluation Testing

Keep a fixed evaluation dataset (question, expected concepts, candidate answer, expected score range, expected missing points) and run it against prompt/model changes before production — prevents quality regression.

---

# 95. Quality Rules

One clear question per turn, no repetition, uses candidate-specific information, relevant follow-ups, adjusts difficulty, never insults, never hiring guarantees, never fabricates company info, always constructive, explains scores.

---

# 96. Interviewer Personality Rules

Professional, respectful, neutral, concise, context-aware. Never mocks, embarrasses, uses inappropriate language, misleads, or reveals internal prompts.

# 97. Scoring Model (configurable weights)

| Component | Default | Technical | HR |
|---|---|---|---|
| Technical Knowledge | 30% | 40% | — |
| Problem Solving | 20% | 25% | — |
| Answer Quality | 15% | 15% | 20% |
| Communication | 15% | 10% | 30% |
| Project Knowledge | 10% | 10% | — |
| Behavioral | 10% | — | 30% |
| Clarity | — | — | 20% |

Weights vary by interview type and must remain configurable.

---

# 98. Score Interpretation

| Range | Label |
|---|---|
| 90–100 | Excellent |
| 80–89 | Strong |
| 70–79 | Good |
| 60–69 | Needs Improvement |
| Below 60 | Needs Significant Practice |

Scores are practice indicators — never hiring decisions. The system must say so.

---

# 99. Data Retention Policy

- Resume: until user deletes it
- Interview transcript / report: until user deletes it
- Video: optional retention
- Policy must be communicated to users

---

# 100. User Controls

Delete resume / interview / recording / report / history; disable recording; export report.

---

# 101. Monetization Strategy (future)

- **Free** — 1–2 interviews/month, basic report, standard interviewer
- **Pro** — more interviews, advanced report, detailed question analysis, history, advanced models, company/role simulations
- **Premium** — high quota, advanced voice, coding + system design interviews, multi-round, personalized prep plan

Pricing is set only after measuring actual AI infrastructure costs.

---

# 102. Cost Control

Track cost per interview: LLM tokens, STT minutes, TTS minutes, storage, video duration, DB usage, bandwidth. The average AI cost per 20-minute interview ($ per LLM+STT+TTS+storage+infra) becomes the internal pricing baseline.

---

# 103. AI Provider Failure Strategy

Fallback chains: primary LLM → fallback LLM; primary STT → fallback STT; primary TTS → fallback TTS — implemented where cost and compatibility permit. No single-provider lock-in.

---

# 104. Observability

Track AI/STT/TTS latency, failed AI calls, invalid AI responses, session interruptions, resume parsing failures, report generation failures. Avoid logging raw sensitive content.

---

# 105. Environment Variables (server-side only)

```text
AI_PROVIDER=
AI_API_KEY=
STT_PROVIDER=
STT_API_KEY=
TTS_PROVIDER=
TTS_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Never expose secret keys to the browser.

> **Dynamic configuration (§118):** these env vars are the secure bootstrap/fallback, used at startup or when no Admin Panel configuration exists. The production runtime reads credentials from the Admin-managed `ai_provider_configs` and decrypts them server-side only when building an AI request (§118).

---

# 106. Environments

Development / Staging / Production with environment-specific AI configuration.

---

# 107. Feature Flags

`AI_MOCK_INTERVIEW_ENABLED`, `VOICE_INTERVIEW_ENABLED`, `VIDEO_RECORDING_ENABLED`, `ADVANCED_EVALUATION_ENABLED`, `CODING_INTERVIEW_ENABLED`, `SYSTEM_DESIGN_ENABLED`.

Gradual rollout.

---

# 108. Rollout Strategy

Internal testing → developer testing → small beta → limited public release → full release.

---

# 109. Beta Feedback Focus

Interview realism, question quality, voice quality, transcript accuracy, report usefulness, camera experience, difficulty, latency, overall satisfaction.

---

# 110. Launch Checklist

**Product:** setup works, resume upload works, AI questions work, follow-ups work, interview ends, report generated.
**UI:** responsive, theme preserved, loading states, error states, permission states.
**AI:** structured output, injection protection, tested evaluations, provider fallback, token monitoring.
**Security:** auth, authorization, rate limits, secure uploads, protected keys.
**Privacy:** recording consent, retention policy, delete controls, explanations.
**Analytics:** start/completion/report events, error monitoring.

---

# 111. Definition of Done

A feature is complete only when: UI + backend implemented, validation exists, error handling, loading states, mobile responsiveness, auth + authorization enforced, database persistence works, AI responses validated, testing complete, and existing VizoTool functionality unaffected.

---

# 112. AI Coding Agent Rules

1. Never recreate VizoTool
2. Never redesign the existing website
3. Inspect existing code before new components
4. Reuse existing components
5. Do not modify unrelated tools
6. Do not rename existing routes without approval
7. Do not remove existing functionality
8. Do not expose API keys
9. Do not trust client-provided IDs for authorization
10. Validate all AI structured responses
11. Never record without explicit consent
12. Never make unsupported psychological claims
13. Never claim confidential company questions
14. Complete + test each phase before the next
15. Do not implement future-phase features prematurely

---

# 113. Recommended Build Order

```text
PHASE 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13
```

# 114. Final Product Vision

The final version evolves into a complete AI-powered interview preparation platform — the **VizoTool AI Career Coach**:

```text
Resume Analysis → Interview Simulation → Preparation Plan
→ Skill Analysis → Progress Tracking → Personalized Plan → Next Interview
```

The product must answer: *"What should I practice before my next interview?"* — not just *"How did I perform last time?"*

---

# 115. Long-Term Vision — Continuous Coach

Learn from previous sessions and identify patterns:

```text
You consistently do well in: React, REST APIs, projects
You consistently struggle with: system design, DB optimization, behavioral answers
Your communication trend: 72 → 76 → 81
Your technical trend:     68 → 74 → 82
```

Recommended next session: MongoDB indexing, system design fundamentals, STAR answers, authentication architecture.

The continuous improvement loop:

```text
Practice → Interview → Evaluate → Identify Weaknesses → Practice Weak Areas
→ Interview Again → Measure Improvement → Repeat
```

---

# 116. Final Product Principle

Not "another AI chatbot that asks questions" — but:

> **A realistic AI-powered interview simulation and personal interview coach.**

The core loop:

```text
REALISTIC INTERVIEW → ACCURATE EVALUATION → ACTIONABLE FEEDBACK
→ PERSONALIZED IMPROVEMENT → REPEAT INTERVIEW → MEASURABLE PROGRESS
```

---

# 117. Final Success Criteria

A new user can independently complete:

```text
Visit VizoTool → Open AI Mock Interview → Upload Resume → Select Role
→ Select Domain → Select Company → Choose Interview Type → Start Interview
→ Allow Camera/Microphone → Interact with AI Interviewer
→ Answer Personalized Questions → Handle Follow-ups → Complete Interview
→ Get Detailed Report → Understand Mistakes → See Strengths
→ See Improvement Areas → Get Preparation Recommendations
→ Take Another Interview → Track Improvement
```

**Core Product Promise:** *Practice like it's real. Learn from every answer. Improve before the real interview.*

---

**Status:** Ready for implementation planning
**Recommended Next Step:** Phase 0 — Existing Vizotool architecture audit + AI Mock Interview technical design

---

# 118. AI Provider Configuration & Admin Control (master feature spec)

## Purpose & Core Requirement

The system must NOT permanently hardcode a specific AI provider, API key, model, or generation configuration into application code. The active AI provider and its configuration are **dynamically controlled from the existing VizoTool Admin Panel** — an administrator changes Gemini (or any future provider) settings **without modifying source code or redeploying**.

- Initial provider: **Gemini**
- Future providers: OpenAI, Anthropic (Claude), DeepSeek, or any compatible provider
- The architecture therefore uses an abstraction layer (§118, block 9) plus a dedicated configuration service (§118, block 10)

The Admin Panel integration MUST reuse: existing admin authentication, existing permission system (§118, block 18), existing database (Supabase), existing design system, existing reusable components, and existing API conventions. No second admin system, no parallel auth.

## 1. Admin Panel Configuration Surface

Administrators manage, per environment, from the existing Admin Panel:

| Setting | Example | Notes |
|---|---|---|
| Provider | `Gemini` | later: `OpenAI`, `Claude`, `DeepSeek` |
| API Key | masked `••••••••••••91X` | add / update / rotate / remove / test; never shown in full |
| Model | `gemini-2.5-flash` | not hardcoded; change via Admin Panel only |
| Generation settings | temperature, max output tokens, top-p, top-k, response format | provider-specific — only supported parameters are offered |
| Status | Enabled / Disabled | disabled → graceful failure (block 6) |
| Fallback provider | optional | block 13 |
| Prompts | see block 4–5 | versioned, publishable |

Rules:

- The API key is NEVER exposed to normal users; the admin UI shows masked credentials only.
- Model names are data, not code — changing the model is an Admin Panel update, not a deployment (assuming the provider adapter supports it).

## 2. Dynamic AI Provider Requirement (details)

- No provider/model/key constants in the Interview Engine or feature components.
- The Interview Engine requests current configuration through the **AI Configuration Service** (block 10) on every operation (or from the validated cache, block 23).
- The first provider adapter implemented is `GeminiProvider`; the architecture must keep every provider behind the same `AIProvider` interface (block 9).

## 3. Generation Configuration

Supported generation settings where the provider supports them:

```text
Temperature
Maximum Output Tokens
Top P
Top K
Response Format (e.g. JSON)
```

Rule: provider-specific settings are validated against the selected provider's capabilities. Unsupported settings are never forced onto a provider — the adapter rejects or ignores them with a clear admin-side warning.

## 4. Prompt Management (Admin-controlled)

The Admin Panel manages all interview prompts dynamically — no prompt changes in source code:

- Resume Analysis Prompt
- Interview System Prompt
- Question Generation Prompt
- Follow-up Question Prompt
- Answer Evaluation Prompt
- Final Report Prompt

Example (Interview System Prompt):

> You are a professional technical interviewer for the selected role. Ask one question at a time. Adapt difficulty based on the candidate's answers.

Prompt storage (block 12) and management rules:

- Prompt editor with preview, draft mode, and "publish/activate" action
- Required-placeholder validation before publishing (block 22)
- Cannot publish an empty prompt
- Active version shown in the editor
- Full version history retained

## 5. Prompt Versioning

Store per prompt key: `prompt_key`, `prompt_name`, `prompt_content`, `version`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`.

Statuses: `Draft`, `Active`, `Archived`.

- Only ONE version is normally Active per prompt key (unless a future feature explicitly supports multiple active variants).
- New interviews always use the Active version at the time the session starts (block 28).
- Example: `Interview Prompt v1 → v2 → v3`.

## 6. Enable / Disable Provider

Admin Panel includes:

```text
AI Provider Status: [Enabled] [Disabled]
```

- Disabled → interview service fails gracefully showing only a human message:

> AI interview service is temporarily unavailable. Please try again later.

- Never expose to users: API keys, internal errors, provider credentials, stack traces.

## 7. Test Connection

Admin Panel button: **Test Connection**.

Flow:

```text
Admin Panel → Test Connection → AI Configuration Service
→ provider adapter (e.g. GeminiProvider) → provider API
→ test response → Admin Panel shows result (latency, model availability)
```

The test verifies: API key validity, provider availability, model availability, basic request/response behavior. Test output never includes the API key.

## 8. AI Configuration Architecture

```text
                    VizoTool Admin Panel
                            |
                            v
                 AI Configuration Service
                            |
              +-------------+-------------+
              |             |             |
           Provider        Model        Prompts
              |             |             |
              +-------------+-------------+
                            |
                            v
                   Interview AI Engine
                            |
                    AI Provider Adapter
                            |
                            v
                      Gemini API
```

Layers explained:

1. **VizoTool Admin Panel** — existing admin UI; new "AI Configuration" section managed with existing permissions/design system (reuses existing admin shell).
2. **AI Configuration Service** — backend service owning config logic: active provider/model/prompts, credentials decryption, snapshots, caching, audit hooks.
3. **Interview AI Engine** — requestor; never accesses providers directly, only through the service + adapter.
4. **AI Provider Adapter** — abstraction implementation per provider.
5. **Provider API** — Gemini (or OpenAI/Claude/DeepSeek later).

## 9. AI Provider Abstraction (unchanged contract)

```text
AIProvider
  generateQuestion()
  generateFollowUp()
  evaluateAnswer()
  analyzeResume()
  generateReport()
```

Implementations: `GeminiProvider`, `OpenAIProvider`, `ClaudeProvider`, `DeepSeekProvider`.

- The Interview Engine depends on the abstraction (`AIProvider`) — never directly on Gemini.
- The active implementation is resolved via the AI Configuration Service.

## 10. AI Configuration Service (responsibilities)

Both app-side and admin-side flows use ONE service:

```text
getActiveProvider()          -> selected provider id/slug
getActiveModel()             -> current model name
getProviderCredentials()     -> decrypted credentials (used only to build the request)
getGenerationSettings()      -> temperature/max tokens/top-p/top-k/response format
getPrompt()                  -> active prompt content for a task
getActivePromptVersion()     -> current version number for a prompt key
getFallbackProvider()        -> fallback config (if enabled)
getConfigurationSnapshot()   -> full snapshot for the session (no secrets)
```

The Interview Engine flow at runtime:

```text
Interview Engine
      ↓
AI Configuration Service
      ↓
Active Provider
      ↓
Active Model
      ↓
Active Prompt
      ↓
Provider Adapter
      ↓
AI API
```

## 11. Database Design — `ai_provider_configs`

Stored in the existing Supabase database (RLS: admin role only).

| Field | Purpose |
|---|---|
| `id` | primary key |
| `provider` | provider slug (`gemini`, `openai`, `claude`, `deepseek`) |
| `display_name` | human label for the admin UI |
| `api_key_encrypted` | encrypted API key (block 15 encryption) |
| `model` | active model (e.g. `gemini-2.5-flash`) |
| `generation_config` | JSON: temperature, max output tokens, top-p, top-k, response format |
| `is_active` | current active config for this provider |
| `is_enabled` | provider enabled/disabled switch |
| `created_at` / `updated_at` | timestamps |
| `created_by` / `updated_by` | admin user references |

The encrypted key and config never leave the server; the UI receives only masked values.

## 12. Database Design — `ai_prompt_configs`

| Field | Purpose |
|---|---|
| `id` | primary key |
| `prompt_key` | task key: `resume_analysis`, `interview_system`, `question_generation`, `follow_up`, `answer_evaluation`, `final_report` |
| `prompt_name` | human label (e.g. "Interview Prompt v2") |
| `prompt_content` | the prompt template with standardized placeholders |
| `version` | version number (per key) |
| `status` | `draft` / `active` / `archived` |
| `created_at` / `updated_at` | timestamps |
| `created_by` / `updated_by` | admin user references |

Model field remains dynamic: changing `model` is an Admin Panel action, not code.

## 13. Provider Fallback Configuration

```text
Primary Provider:  Gemini
Fallback Provider: OpenAI (optional)
```

Runtime behavior:

```text
Interview Engine
       ↓
Primary Provider
       ↓
Request Failed / Invalid Response
       ↓
Fallback Provider (if configured + compatible)
       ↓
Continue Interview
```

- Fallback is enabled/configured from the Admin Panel only.
- Fallback must be enabled ONLY when providers support compatible request/response behavior (same AIProvider interface guarantees).
- The snapshot stored per session records which chain was used (§21).

## 14. API Key Security (never-compromise)

**NEVER store API keys in:** Frontend source, public environment variables, client-side JavaScript, browser `localStorage`/`sessionStorage`, URLs, logs, analytics events.

**Prefer:**

```text
Admin Panel → Secure Backend → Encryption → Database
```

- Key decryption happens ONLY server-side, ONLY when building an API request.
- Reuse any existing VizoTool secret/encryption mechanism if present — the docs instruct implementers to reuse it rather than introduce an alternative.
- The admin UI always shows masked credentials (`••••••••••••91X`).
- Rotation works without downtime (§16).

## 15. Encryption Requirement (at rest)

> AI provider API keys must be encrypted at rest whenever stored in the application database.

Rules:

- The encryption key is NEVER stored in the database next to the ciphertext.
- The encryption secret is managed via a secure server-side secret mechanism (env-based bootstrap secret, loaded server-side only) — never `NEXT_PUBLIC_*`.

## 16. API Key Rotation (safe process)

```text
Admin adds new key
    → Validate new key
    → Encrypt new key
    → Store new key
    → Mark new config active
    → Old key becomes inactive
```

- Rotation happens through the Admin Panel; the new key is tested (Test Connection §7) before activation.
- Avoids downtime whenever possible; old key is retired (inactive) instead of deleted immediately.

## 17. Audit Logging

Log important AI configuration changes:

```text
Gemini API key updated
Gemini model changed
Prompt updated
Prompt activated
Provider disabled
Fallback provider changed
```

Audit record: `admin_user_id`, `action`, `resource`, `timestamp`, `old_non_sensitive_value`, `new_non_sensitive_value`.

DO NOT log: API keys, secrets, full sensitive prompt content (summary ok).

## 18. Admin Authorization (permissions)

Reuse the existing VizoTool admin RBAC. Suggested permission scope:

```text
ai_config_view        read provider/model/prompts
ai_config_edit        edit provider config (credentials, model, generation)
ai_provider_manage    enable/disable provider
ai_prompt_view        view prompts
ai_prompt_edit        edit draft prompts
ai_prompt_publish     publish/activate prompt versions
ai_config_test        run Test Connection
ai_audit_view         view audit logs
```

No separate authorization architecture unless the existing system forces it.

## 19. Admin UI Structure

New section in the EXISTING Admin Panel (same theme, same nav, same components):

```text
Admin Panel
   +-- AI Configuration
          +-- Providers
          +-- Models
          +-- Prompts
          +-- Fallback
          +-- Usage
          +-- Logs
```

Provider page example:

```text
AI Provider Configuration

Provider          [ Gemini ]
API Key           [ •••••••••••••••••••• ]
Model             [ gemini-2.5-flash ]
Temperature       [ 0.7 ]
Max Output Tokens [ 2048 ]
Status            [ Enabled ]

[ Test Connection ] [ Save Configuration ]
```

- All controls/handlers/fields to mask reuse; no new design language.
- Publishing prompts requires confirmation (draft → review → publish).

## 20. Usage & Cost Monitoring (Admin)

Admin Panel shows:

```text
Total AI Requests          Successful              Failed
Input Tokens               Output Tokens
Estimated AI Cost          Average Latency

Interviews Today           Interviews This Month
Average Tokens / Interview Average AI Cost / Interview
```

Provider-specific usage shown where the provider API exposes it. This feeds §10 cost model / §102.

## 21. Rate Limits (configurable)

```text
Max Interviews Per User / Day
Max Interviews Per User / Month
Max Interview Duration
Max AI Requests Per Session
```

Configurable in Admin Panel; tuned for the future pricing model (§101); stored server-side; enforced by the same middlewares as the interview API.

## 22. Prompt Safety (editor safeguards)

- Validate required placeholders: `{{candidate_profile}} {{target_role}} {{target_company}} {{previous_answers}} {{current_question}}`
- Prevent accidental empty production prompts (active prompt can never be empty)
- Show active version; support draft mode; confirmation step before publishing; keep version history
- Placeholder syntax is standardized in `prompts/` and reused across all versioned prompt templates

## 23. Configuration Cache

```text
Admin Panel
     ↓
Database
     ↓
Configuration Cache
     ↓
Interview Engine
```

- Avoid querying DB on every AI call; cache the resolvable config.
- Invalidation:

```text
Admin saves → invalidate cache → new configuration becomes active
```

- Interview in flight keeps its snapshot (§25); new sessions use the new values.

## 24. Configuration Priority & Environment Boundaries

Priority (highest first):

```text
Emergency Override
        ↓
Admin Panel Configuration
        ↓
Secure Environment Fallback (bootstrap)
        ↓
Application Default
```

- Normal production configuration comes from the Admin Panel.
- Environment variables act as secure fallback/bootstrap only (§105) — they are NOT the primary day-to-day config.
- `Development` / `Staging` / `Production` keep separate configurations; dev credentials never leak into prod (env boundary + admin-owned scoped config).

## 25. Admin Configuration Flow (end-to-end)

```text
Admin Login
    ↓
Open AI Configuration
    ↓
Select Gemini
    ↓
Enter API Key
    ↓
Select Model
    ↓
Configure Generation Settings
    ↓
Configure Prompts
    ↓
Test Connection
    ↓
Save
    ↓
Encrypt Credentials
    ↓
Persist Configuration
    ↓
Invalidate Cache
    ↓
Configuration Active
```

## 26. Interview Runtime Flow (end-to-end)

```text
User Starts Interview
        ↓
Interview Engine
        ↓
AI Configuration Service
        ↓
Load Active Gemini Configuration
        ↓
Load Active Prompt
        ↓
Build Structured Request
        ↓
Gemini Provider Adapter
        ↓
Gemini API
        ↓
Validate AI Response (Zod)
        ↓
Return Question / Continue Interview
```

## 27. Dynamic Model Switching (explicit guarantee)

An administrator can change:

```text
gemini-model-A  →  gemini-model-B
```

- WITHOUT changing Interview Engine source code.
- The Engine obtains the current model dynamically from the AI Configuration Service on each conversation turn.
- Fallback model chain optional and configurable.

## 28. Dynamic Prompt Switching & Session Pinning

- Publishing `Interview Prompt v2` means new interviews use v2.
- **Existing running interview sessions keep the prompt version they started with** (session snapshot §29) — we never silently change an in-flight conversation.
- Document this pinning policy; if multi-variant supports, it is explicit and opt-in.

## 29. Configuration Snapshot (per session, no secrets)

For reproducibility each session persists at start:

```json
{
  "provider": "gemini",
  "model": "gemini-2.5-flash",
  "prompt_versions": {
    "question": 3,
    "evaluation": 2,
    "report": 1
  },
  "generation_config": { "temperature": 0.7, "max_tokens": 2048 }
}
```

- NEVER store the API key (or its encrypted form needed for reuse) in session data.
- Old reports remain explainable after the admin later changes AI configuration, because the snapshot is what the session actually used.

## 30. Environment & Bootstrap

Env file now serves as secure bootstrap (not day-to-day config):

```text
AI_PROVIDER=                 ## bootstrap provider id
AI_API_KEY=                  ## bootstrap key (used only if no Admin Panel configuration exists)
AI_MODEL=                    ## bootstrap model
STT_PROVIDER=/STT_API_KEY=
TTS_PROVIDER=/TTS_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

No secret goes near `NEXT_PUBLIC_*`.

## 31. AI Configuration Admin API (internal, architectural example)

Conceptual routes (actual naming follows existing VizoTool API conventions, admin-protected, audit-aware):

```text
GET    /api/admin/ai/providers
POST   /api/admin/ai/providers
PATCH  /api/admin/ai/providers/:id
DELETE /api/admin/ai/providers/:id

POST   /api/admin/ai/providers/:id/test

GET    /api/admin/ai/prompts
POST   /api/admin/ai/prompts
PATCH  /api/admin/ai/prompts/:id
POST   /api/admin/ai/prompts/:id/activate

GET    /api/admin/ai/usage
GET    /api/admin/ai/audit-logs
```

Every endpoint runs through existing admin auth + permissions (§18), Zod validation, and audit hooks (§17).

## 32. Main Architecture Overview (update)

```text
                         VizoTool
                            |
             +--------------+--------------+
             |                             |
        User Application              Admin Panel
             |                             |
             |                     AI Configuration
             |                             |
             |                    +--------+--------+
             |                    |        |        |
             |                 Provider  Model   Prompts
             |                    |        |        |
             +----------+---------+--------+--------+
                        |
                        v
                AI Configuration
                     Service
                        |
                        v
                 Interview Engine
                        |
                 Provider Adapter
                        |
                        v
                    Gemini API
                        |
                        v
                 AI Interview Result
```

## 33. Completion Checklist (AI config feature)

- [ ] Dynamic Gemini provider configuration
- [ ] Dynamic Gemini model configuration (Admin Panel, no deploy)
- [ ] Admin-controlled API key (masked UI, add/update/rotate/remove/test)
- [ ] API key encryption at rest (key not colocated with ciphertext)
- [ ] API key rotation without downtime
- [ ] Test Connection feature (no key leak)
- [ ] Enable/disable provider + graceful failure message
- [ ] Prompt management + prompt versioning (draft/active/archived; one active; publish flow)
- [ ] Generation parameters (temperature, max tokens, top-p/top-k, response format)
- [ ] AIProvider abstraction + GeminiProvider adapter (+ future providers)
- [ ] AI Configuration Service (block 10 interface)
- [ ] Fallback provider config + compatibility guard
- [ ] Usage & cost monitoring
- [ ] Rate limits (config-driven)
- [ ] Admin permissions for AI config
- [ ] Audit logging (no secrets)
- [ ] Configuration caching + invalidation
- [ ] Configuration snapshot per session (prompts/models pinned; no keys)
- [ ] Env var bootstrap; dev/staging/prod boundaries
- [ ] Fully integrated into EXISTING VizoTool Admin Panel/design/auth
- [ ] No redesign of VizoTool, no breaking existing tools

**Status:** Ready for implementation planning
**Recommended Next Step:** Phase 0 — Existing VizoTool architecture audit + AI Mock Interview technical design