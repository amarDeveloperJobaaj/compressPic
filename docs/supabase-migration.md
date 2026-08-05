# Supabase Migration Guide

This document explains how to replace the dummy in-memory blog data with
**Supabase** — without touching any UI, route or component — and how to import
every existing blog + guide into the database with zero content loss.

---

## Architecture overview

The UI never talks to Supabase directly. It talks to one seam:
`lib/blog/service.ts` (the repository functions the public blog pages, admin
panel, blog editor, sitemap and related-tools sections all import).

```
UI (pages, admin, editor, sitemap)
        │  imports only stable functions from lib/blog/service.ts
        ▼
lib/blog/service.ts ──────── in-memory store (lib/blog/data.ts)  [today]
        │
        ▼
lib/blog/repository/ (BlogRepository interface + factory)
        ├── memory.ts      wraps the in-memory store (contract exercised today)
        └── supabase.ts    production implementation (lib/supabase/* clients)
```

The repository factory `lib/blog/repository/index.ts` (`getBlogRepository()`)
switches on `BLOG_STORAGE`:

| `BLOG_STORAGE` | Behaviour                                             |
| -------------- | ----------------------------------------------------- |
| `memory`       | (default) in-memory dummy store — works with zero env  |
| `supabase`     | real database via the `lib/blog/repository/supabase.ts` layer |

Everything the app needs to work today (SSG pages, admin panel, editor) keeps
using `lib/blog/service.ts`. Flipping to Supabase is a matter of making the
service functions delegate to `getBlogRepository()` — signatures do not change.

> **Phase 2 status (Admin CMS):** the entire admin panel already talks to
> `getBlogRepository()` — blog CRUD/trash/bulk API routes, the dashboard, and
> the categories/tags/authors/comments/newsletter/settings/media pages. Set
> `BLOG_STORAGE=supabase` and the admin panel operates on the live database
> with zero UI changes. Only the **public** blog pages still read
> `lib/blog/service.ts` (memory) until Step 3 delegates it too.

---

## Step 1 — Set up the database

### 1a. Apply the SQL

Run these files in order in the Supabase SQL editor (or via the Supabase CLI):

```bash
supabase db push
# or paste the files in this order:
#   supabase/schema.sql        -> extensions, enums, 12 tables, triggers, indexes, RLS
#   supabase/storage.sql       -> blog-images + author-images buckets & policies
#   supabase/seed.sql          -> taxonomy defaults (NOT the posts — those are imported)
```

> If an older copy of `schema.sql` was already applied, run
> `supabase/migrations/002_blog_cms.sql` instead — it is additive.

### 1b. Environment variables

Add to `.env.local` (`.env.example` already documents these):

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Server-only. Never prefix with NEXT_PUBLIC_ and never commit it.
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# "memory" (default) | "supabase"
BLOG_STORAGE=memory
```

**Security:** `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security. It is
used only in `lib/supabase/admin.ts` (server-only) and the migration CLI.
Never import it in a client component, never ship it to the browser.

### 1c. Regenerate the TypeScript types

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase gen types typescript --linked > lib/supabase/database.types.ts
```

`lib/supabase/database.types.ts` is hand-written to match `schema.sql` today;
regenerating keeps it in sync with the live database.

---

## Step 2 — Import existing content (blogs + guides)

All current articles live in `lib/blog/data.ts` (`BLOG_POSTS` + `BLOG_CATEGORIES`)
— there are no MDX/JSON content files. The migration preserves **everything**:

- **Slugs are preserved verbatim** — never regenerated, so old URLs keep working
  (`/blog/<slug>` stays identical → zero SEO impact).
- Titles, subtitles, excerpts, cover images, alt text, authors, categories,
  tags, published/updated dates, read counts, feature flags
  (featured/trending/editor's pick) and SEO overrides are all mapped 1:1.
- Content is stored as the JSONB `BlogBlock[]` array — the block engine,
  embedded tools, TOC and schema generation all keep working unchanged.

### Preview the plan (no database needed)

```bash
npm run migrate:blogs -- --dry-run
```

This prints the full report — post/guide counts, categories, tags, authors,
block inventory (tool embeds, FAQ, code, images) and every slug that will be
imported. It never touches the database.

### Run the migration

```bash
npm run migrate:blogs -- --apply
```

`--apply` reads `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` from
the environment (`.env.local` is loaded automatically by the npm script).

Guarantees of `--apply`:

- **Idempotent** — re-running updates rows in place; nothing duplicates.
- **Non-destructive** — no deletes, no renames, no slug changes. Rows that
  already exist are updated and keep their `created_at`.
- **By slug** — every upsert keys on the preserved `slug`, so a row created
  by the CMS later with the same slug is updated, not duplicated.

Per-post failures are collected and reported at the end; the CLI exits non-zero
if any post failed so you can fix and re-run.

---

## Step 3 — Flip the data layer

Once the data is imported, make the **public** service layer delegate to the
repository (the admin panel already does):

1. In `lib/blog/service.ts`, replace each public function body with the
   matching `getBlogRepository()` call (or re-export the repository methods).
2. Set `BLOG_STORAGE=supabase` in `.env.local`.
3. Delete the mutable `store` array and stop seeding from `lib/blog/data.ts`
   (keep the file — it now serves as the migration source).

**What stays identical:** every `BlogSummary`, `BlogPost` and `BlogInput`
shape, every function name, the admin REST API routes, and every UI component.

---

## Step 4 — Replace admin auth (optional)

Static admin auth remains in place by design. To move it to Supabase Auth
later:

1. In `lib/admin/session.ts`, replace the internals of:
   - `validateAdminCredentials` → `supabase.auth.signInWithPassword({ email, password })`
   - `verifySessionToken` / `isAdmin` → `supabase.auth.getUser()`
   - `createSessionToken` / logout → Supabase cookie-based session helpers
     from `@supabase/ssr`.
2. Give the admin user `app_metadata.role = 'admin'` — the RLS helper
   `public.is_admin()` reads exactly that claim.

**What stays identical:** the login page, protected layout, admin shell and
every admin page.

---

## Data model quick reference

| Table              | Purpose                                                        |
| ------------------ | -------------------------------------------------------------- |
| `blogs`            | Posts; `content` = JSONB `BlogBlock[]`, `seo` = overrides       |
| `authors`          | Post authors (FK from `blogs.author_id`)                       |
| `categories`       | Post categories (FK from `blogs.category_id`)                  |
| `tags` / `blog_tags` | Many-to-many tags                                             |
| `comments`         | Nested comments (self-FK `parent_id`), moderated via `status`  |
| `newsletter`       | Email subscriptions                                            |
| `blog_views`       | Anonymous view analytics (`visitor_id` from a cookie)          |
| `blog_likes`       | Unique per `(blog_id, visitor_id)`                             |
| `blog_bookmarks`   | Unique per `(blog_id, visitor_id)`                             |
| `featured_blogs`   | Curated strips with ordering + badge                           |
| `settings`         | Key/value site settings (public subset readable by visitors)   |

**RLS summary:** visitors (anon) read published blogs, approved comments and
public settings, and can insert pending comments + newsletter subscriptions.
Admins get full CRUD via `public.is_admin()`. Server actions use the
service-role key which bypasses RLS — the policies protect direct client access.

**Storage:** `blog-images` (up to 50 MB) and `author-images` (up to 5 MB)
public buckets with admin-only writes. Upload helpers live in
`lib/supabase/storage.ts`.

**Indexes:** partial indexes for the hot list queries (published/featured/
trending/editor's pick), a GIN index on the generated `search_vector`, trigram
indexes on title/slug, plus join and engagement indexes.

---

## Migration internals (files)

| File                                  | Purpose                                              |
| ------------------------------------- | ---------------------------------------------------- |
| `lib/blog/migrate.ts`                 | Pure plan builder — maps `lib/blog/data.ts` → rows   |
| `lib/blog/migrate-supabase.ts`        | Idempotent executor (upserts by slug, syncs tags)    |
| `scripts/migrate-blogs.ts`            | CLI (`--dry-run` / `--apply` / `--json`)             |
| `lib/blog/repository/`                | `BlogRepository` interface + memory/supabase impls   |
| `lib/supabase/{client,server,admin,storage}.ts` | Clients + storage helpers                 |
| `lib/blog/{validation,actions,seo,content,pagination,search}.ts` | Zod validation, server actions, SEO/schema, search & pagination helpers |

## Notes

- Public pages use SSG (`generateStaticParams`) + ISR today. With a real
  database, prefer `revalidatePath` after admin writes (built into
  `lib/blog/actions.ts`) or move to dynamic rendering.
- Blog embeds, TOC ids, reading time and SEO schema are computed from the post
  content itself, so they keep working unchanged after migration.
- The same-origin `/og?title=…` cover URLs are stored as-is; no storage upload
  is required for the current corpus.
