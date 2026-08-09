-- ============================================================================
-- Vizo Tool — Blog taxonomy seed
-- ----------------------------------------------------------------------------
-- Optional. Run after schema.sql + storage.sql to bootstrap the default author,
-- categories, tags and site settings.
--
-- NOTE: the real 20+ blog posts are NOT seeded here — they are imported from
-- lib/blog/data.ts (preserving every slug, date, image and SEO field) via:
--
--   npx tsx scripts/migrate-blogs.ts --apply
--
-- This keeps the seed file small and the migration idempotent (re-running the
-- import refreshes content without duplicating or renaming anything).
-- ============================================================================

-- Author ----------------------------------------------------------------------
insert into public.authors (name, slug, role, bio, email, twitter) values
  ('Amar Lodhi', 'amar-lodhi', 'Founder, Vizo Tool',
   'Software Engineer building fast, useful, ad-free online tools.',
   'hello@vizotool.com', 'https://twitter.com/amarlodhi')
on conflict (slug) do nothing;

-- Categories -------------------------------------------------------------------
insert into public.categories (name, slug, description) values
  ('Image Editing',       'image-editing',    'Compress, resize, crop, flip, watermark and convert images — all in your browser.'),
  ('Developer Tools',     'developer',        'Format JSON, generate QR codes, write SQL and ship faster with practical dev guides.'),
  ('SEO & Marketing',     'seo',              'Meta tags, schema markup, SERP previews and search optimization guides that actually work.'),
  ('Finance & Calculators','finance',         'SIP, EMI, tax and investment calculators explained with real numbers.'),
  ('YouTube Creators',    'youtube',          'Thumbnails, transcripts, titles and descriptions — creator workflows without the guesswork.'),
  ('Guides & How-Tos',    'guides',           'Practical, ad-free walkthroughs for everyday online tasks.')
on conflict (slug) do nothing;

-- Settings ----------------------------------------------------------------------
insert into public.settings (key, value, description) values
  ('site.name', jsonb_build_object('value', 'Vizo Tool'), 'Site brand name'),
  ('site.description', jsonb_build_object('value', 'Free online image, developer, SEO and finance tools.'), 'Site tagline'),
  ('blog.newsletter_enabled', jsonb_build_object('value', true), 'Show the newsletter CTA'),
  ('blog.comments_enabled', jsonb_build_object('value', true), 'Allow new comments'),
  ('blog.default_og_image', jsonb_build_object('value', '/og?title=Vizo%20Tool%20Blog'), 'Fallback OG image')
on conflict (key) do nothing;
