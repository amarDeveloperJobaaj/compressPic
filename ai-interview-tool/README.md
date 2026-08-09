# AI Interview Tool — Build Kit

Standalone advanced AI mock-interview tool for Vizotool (own landing page, own flow, voice-first, SEO-first, modular). Everything the AI needs is in this folder.

Key doc: the master blueprint (`00-master-spec.md`) is the single source of truth, including the **Dynamic AI Provider & Admin Configuration** spec (§118, blocks 1–33) — Gemini/other providers, models, API keys and prompts are managed at runtime from the existing VizoTool Admin Panel: no hardcoding, no redeploy, keys encrypted at rest.

## Read Order

1. `00-master-spec.md` — full product blueprint (vision, flows, AI architecture, DB, security, phases §0→13, plus §118 dynamic admin AI config)
2. `01-rules.md` — golden rules (binding)
3. `02-vision.md` — product vision
4. `03-tool-info.md` — specs, one-flow, routes, report requirements, dynamic provider config
5. `06-seo.md` — SEO & keywords playbook (trending + long-tail keywords, sitemap rule)
6. `07-github-workflow.md` — GitHub rules (branch per phase, commits, no merge without approval)
7. `04-instructions.md` — build instructions, folder plan, contracts
8. `05-phase-commands.md` — copy-paste phase commands for the AI (PHASE 0 → 13)

> SEO + sitemap and git rules are mandatory in every phase: keywords per `06-seo.md`, sitemap via `lib/tools.ts`, branch per phase per `07-github-workflow.md`. The AI never merges without your approval.

## Quick Start

1. Open a fresh AI chat and ask it to read all files in `ai-interview-tool/`.
2. Paste **PHASE 0** from `05-phase-commands.md`.
3. After each phase: run `npm run lint` + `npm run build`, verify in browser, then paste the next phase.

## Status

| Phase | Name | Status |
|---|---|---|
| 0 | Architecture & Research | Pending |
| 1 | Product Foundation | Pending |
| 2 | Resume Intelligence | Pending |
| 3 | Session Engine | Pending |
| 4 | Interview Room UI | Pending |
| 5 | AI Question Engine | Pending |
| 6 | Speech & Voice Loop | Pending |
| 7 | Adaptive Interview Engine | Pending |
| 8 | Evaluation Engine | Pending |
| 9 | Final Report | Pending |
| 10 | History & Progress | Pending |
| 11 | Optimization | Pending |
| 12 | Production Hardening | Pending |
| 13 | Advanced Features | Pending |

Update this table as phases complete. Branches: `feature/ai-interview/phase-<N>-<slug>` — see `07-github-workflow.md`.