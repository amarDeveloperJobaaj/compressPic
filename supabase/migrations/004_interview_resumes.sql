-- ============================================================================
-- Vizo Tool — AI interview additive migration: resumes storage bucket
-- ----------------------------------------------------------------------------
-- Run this ONLY if supabase/storage.sql (older version) was already applied.
-- It adds the private `resumes` bucket used by Phase 2 (Resume Intelligence)
-- without touching existing buckets, policies, tables or rows.
--
-- If you are applying supabase/storage.sql fresh, skip this file — the
-- current storage.sql already includes the resumes bucket.
-- ============================================================================

-- resumes : AI interview resume PDFs (up to 10 MB)
-- PRIVATE bucket — resumes are sensitive data (master spec §32 Privacy).
-- Reads/writes happen server-side via the service-role client (bypasses RLS).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes',
  'resumes',
  false,
  10485760,
  array['application/pdf']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- resumes : admin-only writes (server reads the file back for analysis).
-- The bucket is private, so there is intentionally NO public select policy.
create policy "resume storage: admin insert"
  on storage.objects for insert
  with check (bucket_id = 'resumes' and public.is_admin());

create policy "resume storage: admin update"
  on storage.objects for update
  using (bucket_id = 'resumes' and public.is_admin());

create policy "resume storage: admin delete"
  on storage.objects for delete
  using (bucket_id = 'resumes' and public.is_admin());
