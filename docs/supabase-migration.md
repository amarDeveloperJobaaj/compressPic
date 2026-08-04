# Supabase Migration Guide

This document explains how to replace the dummy in-memory blog data and static
admin auth with **Supabase** — without touching any UI, route or component.

## Why this works

Every UI (public blog pages, admin panel, blog editor) talks to **one of two seams**:

| Concern | Seam to replace | Location |
| --- | --- | --- |
| Blog data | `lib/blog/service.ts` repository functions | `getAllPosts`, `getPostBySlug`, `createPost`, `updatePost`, `deletePost`, … |
| Admin auth | `lib/admin/session.ts` helpers | `validateAdminCredentials` + `createSessionToken`/`verifySessionToken` |

The UI only calls functions with stable signatures. Swap the implementation,
keep the signatures, and nothing else changes.

---

## Step 1 — Install the client

```bash
npm install @supabase/supabase-js @supabase/ssr
```

Create `.env.local` entries:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Step 2 — Replace the blog data layer

Create `lib/blog/supabase.ts` implementing the same function names as
`lib/blog/service.ts` against the `blog_posts` table. Suggested schema:

```sql
create table public.blog_posts (
  id text primary key,
  slug text unique not null,
  title text not null,
  subtitle text,
  excerpt text,
  cover text,
  cover_alt text,
  category text not null,
  tags text[] default '{}',
  author text,
  author_role text,
  published_at timestamptz,
  updated_at timestamptz default now(),
  read_time text,
  status text default 'draft',
  featured boolean default false,
  trending boolean default false,
  editors_pick boolean default false,
  read_count int default 0,
  seo jsonb default '{}',
  content jsonb not null      -- the BlogBlock[] array, stored as JSONB
);
```

Then change the imports inside `lib/blog/service.ts` so the public functions
delegate to Supabase (or swap the module entirely — the UI does not import
`lib/blog/service.ts` internals, only the exported functions).

**What stays identical:** every `BlogSummary`, `BlogPost` and `BlogInput`
shape, every function name, and the admin REST API routes.

## Step 3 — Replace admin auth

1. Remove `ADMIN_USERNAME` / `ADMIN_PASSWORD` from `.env.example` (optional).
2. Keep `ADMIN_SESSION_SECRET` — or move to Supabase sessions entirely.
3. In `lib/admin/session.ts`, replace the internals of:
   - `validateAdminCredentials` → `supabase.auth.signInWithPassword({ email, password })`
   - `verifySessionToken` / `isAdmin` → `supabase.auth.getUser()`
   - `createSessionToken` / logout → Supabase cookie-based session helpers
     from `@supabase/ssr`.

**What stays identical:** the login page form fields, the `/api/auth/*` routes,
the protected layout, the admin shell and every admin page.

## Step 4 — Delete the dummy store

Once the repository delegates to Supabase you can remove the mutable
`store` array in `lib/blog/service.ts` and optionally stop seeding from
`lib/blog/data.ts` (keep the seeds if you want to import them into Supabase).

## Notes

- The public pages use SSG (`generateStaticParams`) + ISR (`revalidate`)
  today. With a real database you may prefer `export const dynamic` or
  `revalidatePath` after admin writes.
- Keep `proxy.ts` (it is only an optimistic guard) — or remove it once
  Supabase sessions handle redirects themselves.
- Blog embeds, TOC ids, reading time and SEO schema are computed from the
  post content itself, so they keep working unchanged.
