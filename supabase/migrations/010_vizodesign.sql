-- ============================================================================
-- VizoDesign — Visual web-design library
-- ============================================================================
-- Extends the VizoTool schema with a design system library where users can
-- browse modern website designs, view live previews, and copy DESIGN.md
-- instructions for AI coding agents.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.design_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.design_theme as enum ('dark', 'light', 'both');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.design_animation_level as enum ('minimal', 'medium', 'high');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- 2. Tables
-- ---------------------------------------------------------------------------

-- Design categories (Modern SaaS, Dark Premium, Glassmorphism, etc.) --------
create table public.design_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Designs -------------------------------------------------------------------
create table public.designs (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique,
  name               text not null,
  description        text not null default '',
  short_description  text not null default '',
  category_id        uuid references public.design_categories (id) on delete set null,
  status             public.design_status not null default 'draft',
  featured           boolean not null default false,

  -- Visual characteristics
  theme              public.design_theme not null default 'dark',
  style_type         text not null default 'modern',
  mood               text not null default 'clean',
  best_for           text[] not null default '{}',
  animation_level    public.design_animation_level not null default 'medium',
  has_3d             boolean not null default false,
  responsive         boolean not null default true,
  accessibility_level text not null default 'wcag-aware',

  -- Preview
  preview_type       text not null default 'component',
  preview_component  text,
  preview_image      text,
  thumbnail          text,

  -- Content
  design_system      jsonb not null default '{}'::jsonb,
  design_markdown    text not null default '',
  ai_prompt          text not null default '',

  -- Metadata
  technologies       text[] not null default '{}',
  frameworks         text[] not null default '{}',
  tags               text[] not null default '{}',
  seo                jsonb not null default '{}'::jsonb,

  -- Analytics
  view_count         integer not null default 0,
  copy_count         integer not null default 0,
  sort_order         integer not null default 0,

  -- Timestamps
  published_at       timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz
);

-- Analytics events ----------------------------------------------------------
create table public.design_events (
  id          uuid primary key default gen_random_uuid(),
  design_id   uuid not null references public.designs (id) on delete cascade,
  event_type  text not null,
  visitor_id  text,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. updated_at triggers
-- ---------------------------------------------------------------------------
create trigger trg_design_categories_updated_at
  before update on public.design_categories
  for each row execute function public.set_updated_at();

create trigger trg_designs_updated_at
  before update on public.designs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. Indexes
-- ---------------------------------------------------------------------------
create index idx_designs_status_published on public.designs (published_at desc)
  where status = 'published' and deleted_at is null;
create index idx_designs_category on public.designs (category_id)
  where deleted_at is null;
create index idx_designs_featured on public.designs (featured desc)
  where status = 'published' and deleted_at is null;
create index idx_designs_slug_trgm on public.designs using gin (slug gin_trgm_ops);
create index idx_designs_name_trgm on public.designs using gin (name gin_trgm_ops);
create index idx_designs_tags on public.designs using gin (tags);
create index idx_designs_technologies on public.designs using gin (technologies);
create index idx_designs_theme on public.designs (theme)
  where status = 'published' and deleted_at is null;
create index idx_design_events_design on public.design_events (design_id, created_at desc);
create index idx_design_events_type on public.design_events (event_type);

-- ---------------------------------------------------------------------------
-- 5. Row Level Security
-- ---------------------------------------------------------------------------
alter table public.design_categories enable row level security;
alter table public.designs         enable row level security;
alter table public.design_events   enable row level security;

-- Design categories: public read, admin all
create policy "design_categories: public read" on public.design_categories
  for select using (true);
create policy "design_categories: admin all" on public.design_categories
  for all using (public.is_admin()) with check (public.is_admin());

-- Designs: public read published, admin all
create policy "designs: public read published" on public.designs
  for select
  using (status = 'published' and deleted_at is null);
create policy "designs: admin all" on public.designs
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- Design events: public insert (analytics), admin read all
create policy "design_events: public insert" on public.design_events
  for insert
  with check (true);
create policy "design_events: public read" on public.design_events
  for select using (true);
create policy "design_events: admin all" on public.design_events
  for all using (public.is_admin()) with check (public.is_admin());
