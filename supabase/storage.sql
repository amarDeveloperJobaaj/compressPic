-- ============================================================================
-- Vizo Tool — Blog storage buckets (Supabase Storage)
-- ----------------------------------------------------------------------------
-- Run AFTER schema.sql. Creates the public buckets the blog uses and locks
-- down writes to admins (the service-role key bypasses RLS for server actions).
-- ============================================================================

-- blog-images : cover images + inline content images (up to 50 MB)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  52428800,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- author-images : author avatars (up to 5 MB)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'author-images',
  'author-images',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public read for both buckets (public buckets allow anonymous reads already,
-- but an explicit policy keeps the intent visible and version-safe).
create policy "blog storage: public read"
  on storage.objects for select
  using (bucket_id in ('blog-images', 'author-images'));

-- Writes are admin-only. Server actions use the service-role key, which
-- bypasses RLS entirely — these policies protect direct client access.
create policy "blog storage: admin insert"
  on storage.objects for insert
  with check (bucket_id in ('blog-images', 'author-images') and public.is_admin());

create policy "blog storage: admin update"
  on storage.objects for update
  using (bucket_id in ('blog-images', 'author-images') and public.is_admin());

create policy "blog storage: admin delete"
  on storage.objects for delete
  using (bucket_id in ('blog-images', 'author-images') and public.is_admin());
