-- ============================================================================
-- Vizo Tool — Phase 2 Admin CMS (additive migration)
-- ----------------------------------------------------------------------------
-- Run AFTER supabase/schema.sql (or migrations 001/002) on an existing
-- database. Everything here is idempotent / additive — nothing is dropped.
-- ============================================================================

-- Admin "pin to top" flag on blogs ---------------------------------------------
alter table public.blogs
  add column if not exists pinned boolean not null default false;

create index if not exists idx_blogs_pinned
  on public.blogs (pinned desc)
  where status = 'published' and deleted_at is null;

-- Faster admin comment-moderation queue ----------------------------------------
create index if not exists idx_comments_status_created
  on public.comments (status, created_at desc);
