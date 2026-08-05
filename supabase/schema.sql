-- ============================================================================
-- Vizo Tool — Blog System schema (Supabase / PostgreSQL)
-- ----------------------------------------------------------------------------
-- Run this file in the Supabase SQL editor (or `supabase db push`).
-- Order matters: extensions -> enums -> tables -> triggers -> indexes -> RLS.
-- The matching TypeScript types live in lib/supabase/database.types.ts
-- (regenerate with: supabase gen types typescript --linked > lib/supabase/database.types.ts)
--
-- If an older copy of this file was already applied, run
-- supabase/migrations/002_blog_cms.sql instead — it is additive.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. Extensions
-- ---------------------------------------------------------------------------
create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists pg_trgm;    -- fuzzy slug/title search

-- ---------------------------------------------------------------------------
-- 1. Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.blog_status as enum ('draft', 'published', 'scheduled', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.comment_status as enum ('pending', 'approved', 'spam');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- 2. Tables
-- ---------------------------------------------------------------------------

-- Authors --------------------------------------------------------------------
create table public.authors (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  role        text not null default 'Author',
  bio         text,
  avatar_url  text,               -- storage path or full URL
  email       text,
  twitter     text,
  website     text,
  instagram   text,
  linkedin    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz          -- soft delete
);

-- Categories -----------------------------------------------------------------
create table public.categories (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  slug           text not null unique,
  description    text,
  seo            jsonb not null default '{}'::jsonb,  -- { meta_title, meta_description, keywords }
  featured_image text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz
);

-- Tags -----------------------------------------------------------------------
create table public.tags (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Blogs ----------------------------------------------------------------------
-- content   : JSONB array of the BlogBlock[] union (see lib/blog/types.ts)
-- seo       : JSONB { meta_title, meta_description, keywords, og_image, twitter_image }
-- status    : draft | published | scheduled (published_at holds the publish time)
create table public.blogs (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid references public.authors (id) on delete set null,
  category_id   uuid references public.categories (id) on delete set null,
  slug          text not null unique,
  title         text not null,
  subtitle      text not null default '',
  excerpt       text not null default '',
  cover_url     text,
  cover_alt     text not null default '',
  content       jsonb not null default '[]'::jsonb,
  status        public.blog_status not null default 'draft',
  featured      boolean not null default false,
  trending      boolean not null default false,
  editors_pick  boolean not null default false,
  pinned        boolean not null default false,
  read_count    integer not null default 0,
  seo           jsonb not null default '{}'::jsonb,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz,
  -- Generated full-text vector for fast postgres search (kept in sync automatically)
  search_vector tsvector generated always as (
      setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(subtitle, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(excerpt, '')), 'B')
  ) stored,
  constraint blogs_published_at_check check (
    status <> 'published' or published_at is not null
  )
);

-- Many-to-many: blogs <-> tags -------------------------------------------------
create table public.blog_tags (
  blog_id    uuid not null references public.blogs (id) on delete cascade,
  tag_id     uuid not null references public.tags (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blog_id, tag_id)
);

-- Comments -------------------------------------------------------------------
create table public.comments (
  id           uuid primary key default gen_random_uuid(),
  blog_id      uuid not null references public.blogs (id) on delete cascade,
  parent_id    uuid references public.comments (id) on delete cascade,
  author_name  text not null,
  author_email text not null,
  content      text not null check (char_length(content) between 1 and 2000),
  status       public.comment_status not null default 'pending',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  deleted_at   timestamptz
);

-- Newsletter subscriptions -----------------------------------------------------
create table public.newsletter (
  id              uuid primary key default gen_random_uuid(),
  email           text not null unique,
  subscribed      boolean not null default true,
  source          text not null default 'blog',
  created_at      timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- Anonymous engagement (visitor_id = client-generated id stored in a cookie) ----
create table public.blog_views (
  id         uuid primary key default gen_random_uuid(),
  blog_id    uuid not null references public.blogs (id) on delete cascade,
  visitor_id text,
  viewed_at  timestamptz not null default now()
);

create table public.blog_likes (
  blog_id    uuid not null references public.blogs (id) on delete cascade,
  visitor_id text not null,
  created_at timestamptz not null default now(),
  primary key (blog_id, visitor_id)
);

create table public.blog_bookmarks (
  blog_id    uuid not null references public.blogs (id) on delete cascade,
  visitor_id text not null,
  created_at timestamptz not null default now(),
  primary key (blog_id, visitor_id)
);

-- Featured blogs (curated homepage strips) --------------------------------------
create table public.featured_blogs (
  blog_id    uuid primary key references public.blogs (id) on delete cascade,
  position   integer not null default 0,
  badge      text,
  created_at timestamptz not null default now()
);

-- Key/value settings -------------------------------------------------------------
create table public.settings (
  key         text primary key,
  value       jsonb not null default '{}'::jsonb,
  description text,
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_authors_updated_at      before update on public.authors      for each row execute function public.set_updated_at();
create trigger trg_categories_updated_at   before update on public.categories   for each row execute function public.set_updated_at();
create trigger trg_tags_updated_at         before update on public.tags         for each row execute function public.set_updated_at();
create trigger trg_blogs_updated_at        before update on public.blogs        for each row execute function public.set_updated_at();
create trigger trg_comments_updated_at     before update on public.comments     for each row execute function public.set_updated_at();
create trigger trg_settings_updated_at     before update on public.settings     for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. Indexes
-- ---------------------------------------------------------------------------
-- Blogs: hot list queries
create index idx_blogs_status_published on public.blogs (published_at desc)
  where status = 'published' and deleted_at is null;
create index idx_blogs_status on public.blogs (status);
create index idx_blogs_category on public.blogs (category_id)
  where deleted_at is null;
create index idx_blogs_author on public.blogs (author_id)
  where deleted_at is null;
create index idx_blogs_featured on public.blogs (featured desc)
  where status = 'published' and deleted_at is null;
create index idx_blogs_trending on public.blogs (trending desc)
  where status = 'published' and deleted_at is null;
create index idx_blogs_editors_pick on public.blogs (editors_pick desc)
  where status = 'published' and deleted_at is null;
create index idx_blogs_pinned on public.blogs (pinned desc)
  where status = 'published' and deleted_at is null;
-- Scheduled publishing (cron-friendly query)
create index idx_blogs_scheduled on public.blogs (published_at)
  where status = 'scheduled' and deleted_at is null;
-- Full-text + fuzzy search
create index idx_blogs_search on public.blogs using gin (search_vector);
create index idx_blogs_title_trgm on public.blogs using gin (title gin_trgm_ops);
create index idx_blogs_slug_trgm  on public.blogs using gin (slug  gin_trgm_ops);

-- Join / engagement indexes
create index idx_blog_tags_tag on public.blog_tags (tag_id);
create index idx_comments_blog on public.comments (blog_id, status, created_at desc);
create index idx_blog_views_blog    on public.blog_views (blog_id, viewed_at desc);
create index idx_blog_views_visitor on public.blog_views (visitor_id);
create index idx_newsletter_created on public.newsletter (created_at desc);

-- ---------------------------------------------------------------------------
-- 5. Row Level Security
-- ---------------------------------------------------------------------------
-- Helper: an authenticated user with the admin role (custom claim or app_metadata).
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    (auth.jwt() ->> 'role') = 'admin',
    false
  );
$$;

alter table public.authors         enable row level security;
alter table public.categories      enable row level security;
alter table public.tags            enable row level security;
alter table public.blogs           enable row level security;
alter table public.blog_tags       enable row level security;
alter table public.comments        enable row level security;
alter table public.newsletter      enable row level security;
alter table public.blog_views      enable row level security;
alter table public.blog_likes      enable row level security;
alter table public.blog_bookmarks  enable row level security;
alter table public.featured_blogs  enable row level security;
alter table public.settings        enable row level security;

-- Authors ----------------------------------------------------------------------
create policy "authors: public read"      on public.authors for select using (deleted_at is null);
create policy "authors: admin all"        on public.authors for all using (public.is_admin()) with check (public.is_admin());

-- Categories -------------------------------------------------------------------
create policy "categories: public read"   on public.categories for select using (deleted_at is null);
create policy "categories: admin all"     on public.categories for all using (public.is_admin()) with check (public.is_admin());

-- Tags -------------------------------------------------------------------------
create policy "tags: public read"         on public.tags for select using (true);
create policy "tags: admin all"           on public.tags for all using (public.is_admin()) with check (public.is_admin());

-- Blogs: visitors may only read published posts ---------------------------------
create policy "blogs: public read published" on public.blogs
  for select
  using (status = 'published' and deleted_at is null);
create policy "blogs: admin all" on public.blogs
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- blog_tags ----------------------------------------------------------------------
create policy "blog_tags: public read"    on public.blog_tags for select using (true);
create policy "blog_tags: admin all"      on public.blog_tags for all using (public.is_admin()) with check (public.is_admin());

-- Comments: visitors read approved + submit new (starts as pending) --------------
create policy "comments: public read approved" on public.comments
  for select
  using (status = 'approved' and deleted_at is null);
create policy "comments: public insert pending" on public.comments
  for insert
  with check (status = 'pending');
create policy "comments: admin all" on public.comments
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- Newsletter: visitors subscribe ------------------------------------------------
create policy "newsletter: public subscribe" on public.newsletter
  for insert
  with check (subscribed = true);
create policy "newsletter: admin all" on public.newsletter
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- Engagement: counts are public; writes go through the server actions layer -------
create policy "blog_views: public read"     on public.blog_views for select using (true);
create policy "blog_views: admin all"       on public.blog_views for all using (public.is_admin()) with check (public.is_admin());

create policy "blog_likes: public read"     on public.blog_likes for select using (true);
create policy "blog_likes: admin all"       on public.blog_likes for all using (public.is_admin()) with check (public.is_admin());

create policy "blog_bookmarks: public read" on public.blog_bookmarks for select using (true);
create policy "blog_bookmarks: admin all"   on public.blog_bookmarks for all using (public.is_admin()) with check (public.is_admin());

-- Featured ------------------------------------------------------------------------
create policy "featured_blogs: public read" on public.featured_blogs for select using (true);
create policy "featured_blogs: admin all"   on public.featured_blogs for all using (public.is_admin()) with check (public.is_admin());

-- Settings: only curated public keys are readable by visitors -----------------------
create policy "settings: public read" on public.settings
  for select
  using (public.is_admin() or key in (
    'site.name',
    'site.description',
    'blog.default_og_image',
    'blog.newsletter_enabled',
    'blog.comments_enabled',
    'contact.email'
  ));
create policy "settings: admin all" on public.settings
  for all
  using (public.is_admin())
  with check (public.is_admin());
