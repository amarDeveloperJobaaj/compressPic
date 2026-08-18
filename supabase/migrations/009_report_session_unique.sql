-- ============================================================================
-- Vizo Tool — Phase 9 additive migration (Final Report)
-- ----------------------------------------------------------------------------
-- Guarantees ONE report per completed session so the report engine can
-- persist idempotently (upsert on session_id) — a retried generation call
-- refreshes the row instead of duplicating it.
-- ============================================================================

create unique index if not exists idx_reports_session_unique
  on public.interview_reports (session_id);
