# supabase/ — SQL for the blog backend

Run these in order in the Supabase dashboard SQL editor (or via the CLI):

```bash
supabase db push          # or paste each file into the SQL editor
```

| File          | What it does                                                       |
| ------------- | ------------------------------------------------------------------ |
| `schema.sql`  | Extensions, enums, 12 tables, triggers, indexes, RLS policies      |
| `storage.sql` | `blog-images` + `author-images` buckets and their policies         |
| `seed.sql`    | Taxonomy defaults (author, categories, settings) — NOT the posts   |
| `migrations/002_blog_cms.sql` | Additive upgrade if an older schema.sql was already applied |

## After applying

Regenerate the TypeScript types so `lib/supabase/database.types.ts` matches
the live database:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase gen types typescript --linked > lib/supabase/database.types.ts
```

## Import the existing content (blogs + guides)

The 20+ articles currently served from `lib/blog/data.ts` are imported with
zero data loss — every slug, title, description, image, author, category, tag,
date, read time and SEO field is preserved:

```bash
npx tsx scripts/migrate-blogs.ts --dry-run   # preview only, no database needed
npx tsx scripts/migrate-blogs.ts --apply     # upsert everything (idempotent)
```

See `docs/supabase-migration.md` for the full workflow.

## What the tables map to

| Table              | Purpose                                                       |
| ------------------ | ------------------------------------------------------------- |
| `blogs`            | Posts; `content` is the JSONB `BlogBlock[]`, `seo` is overrides |
| `authors`          | Post authors (FK from `blogs.author_id`)                      |
| `categories`       | Post categories (FK from `blogs.category_id`)                 |
| `tags` / `blog_tags` | Many-to-many tags                                            |
| `comments`         | Nested comments (self-FK `parent_id`), moderated via `status` |
| `newsletter`       | Email subscriptions                                           |
| `blog_views`       | Anonymous view analytics (`visitor_id` from a cookie)         |
| `blog_likes`       | Unique per `(blog_id, visitor_id)`                            |
| `blog_bookmarks`   | Unique per `(blog_id, visitor_id)`                            |
| `featured_blogs`   | Curated strips with ordering + badge                          |
| `settings`         | Key/value site settings (public subset readable by visitors)  |

## RLS summary

- **Visitors (anon):** read published blogs, approved comments, public
  settings; insert pending comments and newsletter subscriptions.
- **Admins:** full CRUD on everything via the `public.is_admin()` helper
  (custom claim `app_metadata.role = 'admin'`).
- **Server actions** use the service-role key (`lib/supabase/admin.ts`),
  which bypasses RLS — the policies protect direct client access.
