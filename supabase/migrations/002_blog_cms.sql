-- ============================================================================
-- Vizo Tool — Phase 2 additive migration (blog CMS)
-- ----------------------------------------------------------------------------
-- Run this ONLY if supabase/schema.sql (Phase 1) was already applied to the
-- database. It adds the CMS-only pieces without touching existing tables,
-- columns or rows — existing blogs/categories/tags/engagement stay intact.
--
-- If you are applying schema.sql for the first time, skip this file — the
-- base schema already includes the 'scheduled' status.
-- ============================================================================

-- 1. Scheduled status for posts ---------------------------------------------
-- "scheduled" = post is future-dated; published_at holds the publish time.
-- PG 12+ allows ADD VALUE outside a transaction block; Supabase runs PG 15+.
alter type public.blog_status add value if not exists 'scheduled';

-- 2. Authors: social profile links (used by the author manager + author card) --
alter table public.authors
  add column if not exists website text,
  add column if not exists instagram text,
  add column if not exists linkedin text;

-- 3. Categories: SEO + featured image for category landing pages ---------------
alter table public.categories
  add column if not exists seo jsonb not null default '{}'::jsonb,
  add column if not exists featured_image text;

-- 4. Index for scheduled publishing (cron-friendly query) ----------------------
create index if not exists idx_blogs_scheduled on public.blogs (published_at)
  where status = 'scheduled' and deleted_at is null;
