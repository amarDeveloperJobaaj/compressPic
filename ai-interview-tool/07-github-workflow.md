# AI Interview Tool — GitHub Workflow Rules & Instructions

BINDING for all AI work on this tool. The core rule: **EVERY phase gets its own separate branch and commits. NEVER merge — or push-request a merge — without the user explicitly asking.**

## 1. Golden GitHub Rules

1. Work ALWAYS in a dedicated branch — never commit directly to `main` (repo default: `main`).
2. One branch per phase. One phase = one branch. No mixing phases in a branch.
3. Branch only after the user confirms the phase is ready to start (or when the phase command was given).
4. Commit after every logical, working step — small, focused, conventional commits.
5. NEVER merge, NEVER delete branches, NEVER force-push, NEVER rewrite history (`rebase`/`amend`/`reset`) without asking.
6. At the end of a phase: push the branch (`git push -u origin <branch>`) so the user can review — but DO NOT open/merge a PR unless asked.
7. Always report to the user: branch name, commit list, verification status (lint/build), and "ready to review — I have NOT merged."

## 2. Branch Naming (one per phase)

Format: `feature/ai-interview/phase-<N>-<slug>`

| Phase | Branch name |
|---|---|
| 0 | `feature/ai-interview/phase-0-foundation` |
| 1 | `feature/ai-interview/phase-1-setup` |
| 2 | `feature/ai-interview/phase-2-session` |
| 3 | `feature/ai-interview/phase-3-report` |
| 4 | `feature/ai-interview/phase-4-polish` |
| 5 | `feature/ai-interview/phase-5-seo` |
| 6 | `feature/ai-interview/phase-6-qa` |

If the repo already has branches like `feature/ai-interview/...`, follow the existing naming pattern.

## 3. Commit Conventions (match repo style)

Repo uses Conventional Commits (verified from `git log`):

- `feat: add AI interview landing page`
- `fix: handle interview session stream errors`
- `chore: update phase docs`
- `docs: add SEO playbook reference`
- `refactor: split chat window components`

Rules:

- One logical change per commit — never "fix and add feature" combined.
- Present tense, lowercase-ish, ≤ 72 chars. If a commit does several things, split it.
- NEVER commit: `.env`, `.env.local`, secrets, `node_modules`, build output, personal files — check `git status` before committing.
- Never commit empty or "work in progress" themed messages without a clear summary.
- Always verify `git status` + `git diff` BEFORE committing to catch unintentional files.

## 4. Phase Flow (every phase identical)

1. `git switch main && git pull` (get latest, only if repo clean)
2. `git checkout -b <branch name from section 2>`
3. Build the phase with focused commits (section 3) — run `npm run lint` + `npm run build` before the final commit
4. **Update `TRACKING.md` before the final commit**: status row, ticks, "Recent Updates" row — commit with `docs: update TRACKING for phase N` (this is mandatory, same branch)
5. Finalize: `git push -u origin <branch name>`
6. Report to the user: branch name, commit list, build/lint status, and what TRACKING.md now says
7. **Ask** the user: "Do you approve?" — only after yes, the AI may merge (never alone)
8. After merge: update TRACKING.md (`merged ✓`, phase `COMPLETED`), commit on main (`docs: mark phase N completed`), then the NEXT phase rebases from updated `main` and creates its new branch

## 5. Merge Policy (non-negotiable)

- AI NEVER merges into `main`, never self-approves, never force-pushes.
- The flow: AI pushes the phase branch → user reviews → user merges (or explicitly asks the AI to merge — only then does the AI execute the merge).
- If the user asks "merge phase X", the AI executes one of: `git checkout main; git pull; git merge --no-ff <branch>` or opens a PR and asks the user to merge.
- If a merge hits conflicts, DO NOT resolve aggressively or force — stop, explain, and ask the user.

## 6. Workspace Hygiene

- Rebase the branch on top of the latest main if main moved (only after user approval).
- Once a branch is merged, ask "delete branch?" — delete only after an explicit YES.
- NEVER touch `.git/config`, credentials, or any git auth — read-only on git internals beyond everyday commands.

## 7. Phase Completion Reminder (write this at end of every build)

> Branch `<name>` pushed (`<N>` commits) — lint/build pass. Not merged — your approval first. Say "merge phase X" to proceed to review, then I merge. Do not skip.