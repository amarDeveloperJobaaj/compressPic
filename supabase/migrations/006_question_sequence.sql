-- ============================================================================
-- Vizo Tool — AI interview Phase 5: question sequence uniqueness (additive)
-- ----------------------------------------------------------------------------
-- Run AFTER migration 005. Guarantees one sequence number per session so the
-- question engine can never persist two questions with the same position,
-- even under retries. Additive only — nothing is dropped or altered.
-- ============================================================================

create unique index if not exists idx_questions_session_seq_unique
  on public.interview_questions (session_id, sequence);

-- One answer per question: makes storeAnswer's idempotent retry race-safe.
create unique index if not exists idx_answers_question_unique
  on public.interview_answers (question_id);
