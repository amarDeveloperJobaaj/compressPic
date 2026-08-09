-- ============================================================================
-- Vizo Tool — CMS schema sync (idempotent, safe to re-run)
-- ----------------------------------------------------------------------------
-- WHY: If you created your Supabase database from an EARLIER version of
-- supabase/schema.sql, it is missing the Phase-2 blog-CMS columns:
--   • blogs.pinned                       (admin "pin to top")
--   • blog_status 'scheduled'            (scheduled publishing)
--   • authors.website / instagram / linkedin
--   • categories.seo / featured_image
--
-- WHAT THIS DOES: applies the same additive, `if not exists` changes as
-- supabase/migrations/002_blog_cms.sql + 003_admin_cms.sql in one script.
-- Nothing is dropped; existing rows are untouched. Safe to run again.
--
-- HOW TO USE (pick one):
--   1. Supabase Dashboard  →  SQL Editor  →  paste everything  →  Run
--   2. CLI:  npx supabase db push          (applies migrations/ in order)
-- ============================================================================

-- 1. Scheduled status for posts (PG 12+ allows ADD VALUE outside a txn) ------
alter type public.blog_status add value if not exists 'scheduled';

-- 2. Authors: social profile links -------------------------------------------
alter table public.authors
  add column if not exists website text,
  add column if not exists instagram text,
  add column if not exists linkedin text;

-- 3. Categories: SEO + featured image ----------------------------------------
alter table public.categories
  add column if not exists seo jsonb not null default '{}'::jsonb,
  add column if not exists featured_image text;

-- 4. Admin "pin to top" flag on blogs ----------------------------------------
alter table public.blogs
  add column if not exists pinned boolean not null default false;

-- 5. Indexes (skipped automatically if they already exist) -------------------
create index if not exists idx_blogs_pinned
  on public.blogs (pinned desc)
  where status = 'published' and deleted_at is null;

create index if not exists idx_blogs_scheduled on public.blogs (published_at)
  where status = 'scheduled' and deleted_at is null;

create index if not exists idx_comments_status_created
  on public.comments (status, created_at desc);

-- 6. Verify (should return rows for all three) -------------------------------
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'blogs'
  and column_name in ('pinned', 'published_at');
