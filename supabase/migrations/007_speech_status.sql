-- ============================================================================
-- Vizo Tool — AI interview Phase 6: 'speaking' session status (additive)
-- ----------------------------------------------------------------------------
-- Run AFTER migration 005/006. Phase 6 adds the voice loop: while the AI
-- interviewer reads a question aloud (TTS) the room sits in the 'speaking'
-- §79 sub-state before falling into 'listening' (STT). The status check
-- constraint is rebuilt to admit the new value; no data is changed, and the
-- existing constraint name is preserved for drop/re-add idempotency.
-- ============================================================================

alter table public.interview_sessions
  drop constraint if exists interview_sessions_status_check;

alter table public.interview_sessions
  add constraint interview_sessions_status_check
  check (status in ('idle','preparing','ready','active','listening',
                    'processing','asking','speaking','ending',
                    'generating_report','completed'));
