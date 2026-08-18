-- ============================================================================
-- Vizo Tool — Phase 8 additive migration (Evaluation Engine)
-- ----------------------------------------------------------------------------
-- Extends `interview_evaluations` so every stored §54 evaluation carries:
--   1. the derived overall score + verdict (deterministic, server-computed),
--   2. the communication metrics payload (filler words + pace, §55–57),
-- and guarantees ONE evaluation per answer (unique answer_id) so the turn
-- loop and the on-demand evaluate route can persist idempotently.
-- ============================================================================

-- 1. Derived score + verdict (computed server-side, see evaluation-store) ----
alter table public.interview_evaluations
  add column if not exists overall_score numeric(5,2),
  add column if not exists verdict text;

-- 2. Communication metrics payload (word count, fillers, WPM, pace band) -----
alter table public.interview_evaluations
  add column if not exists metrics jsonb not null default '{}'::jsonb;

-- 3. One evaluation per answer — idempotent upsert key -----------------------
create unique index if not exists idx_evaluations_answer_unique
  on public.interview_evaluations (answer_id);
