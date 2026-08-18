-- ============================================================================
-- Vizo Tool — AI interview Phase 3: session schema (additive migration)
-- ----------------------------------------------------------------------------
-- Run AFTER supabase/schema.sql (and migrations 002/003/004) on an existing
-- database. Adds the six interview tables from master spec §41–47, scoped to
-- Supabase Auth users (auth.users). Everything is idempotent / additive —
-- nothing is dropped.
--
--   users (auth.users) → resumes → interview_sessions
--      → interview_questions → interview_answers → interview_evaluations
--      → interview_reports
--
-- RLS is enabled everywhere and scoped to auth.uid(); the session APIs ALSO
-- re-verify ownership server-side (master spec §49–50) — never trust a
-- client-sent user id.
-- ============================================================================

-- Resumes ------------------------------------------------------------------
-- Stored-file pointer + structured candidate profile (master spec §42).
create table public.resumes (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users (id) on delete cascade,
  file_name         text,
  file_path         text,
  parsed_text       text,
  candidate_profile jsonb not null default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Interview sessions --------------------------------------------------------
-- One row per interview. status follows the §79 state machine values.
--   config        : setup snapshot (ids + resolved labels) — powers recovery
--                   and the Phase 9 report without re-querying the client.
--   current_state : §40 live state (topic, difficulty, progress) written by
--                   the adaptive engine in Phase 7.
create table public.interview_sessions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  resume_id        uuid references public.resumes (id) on delete set null,
  target_role      text not null,
  target_company   text,
  domain           text,
  experience_level text,
  interview_type   text not null,
  duration_minutes integer not null check (duration_minutes between 1 and 480),
  difficulty       text not null default 'intermediate'
                   check (difficulty in ('beginner','intermediate','advanced','expert')),
  status           text not null default 'idle'
                   check (status in ('idle','preparing','ready','active','listening',
                                     'processing','asking','ending','generating_report',
                                     'completed')),
  config           jsonb not null default '{}'::jsonb,
  current_state    jsonb not null default '{}'::jsonb,
  started_at       timestamptz,
  ended_at         timestamptz,
  overall_score    numeric(5,2),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Interview questions -------------------------------------------------------
-- parent_question_id links follow-ups to their root question (§44).
create table public.interview_questions (
  id                 uuid primary key default gen_random_uuid(),
  session_id         uuid not null references public.interview_sessions (id) on delete cascade,
  question           text not null,
  question_type      text not null default 'technical',
  topic              text,
  difficulty         text not null default 'intermediate',
  sequence           integer not null,
  parent_question_id uuid references public.interview_questions (id) on delete set null,
  asked_at           timestamptz not null default now()
);

-- Interview answers ---------------------------------------------------------
-- transcript is the evaluated text; audio/video URLs are optional recordings
-- (only ever stored with explicit consent, §31).
create table public.interview_answers (
  id               uuid primary key default gen_random_uuid(),
  question_id      uuid not null references public.interview_questions (id) on delete cascade,
  transcript       text,
  audio_url        text,
  video_url        text,
  duration_seconds numeric(10,2),
  created_at       timestamptz not null default now()
);

-- Interview evaluations -----------------------------------------------------
-- Per-answer dimension scores (§46, §54) + qualitative notes (Phase 8).
create table public.interview_evaluations (
  id                    uuid primary key default gen_random_uuid(),
  answer_id             uuid not null references public.interview_answers (id) on delete cascade,
  technical_score       numeric(5,2),
  relevance_score       numeric(5,2),
  clarity_score         numeric(5,2),
  communication_score   numeric(5,2),
  problem_solving_score numeric(5,2),
  answer_quality_score  numeric(5,2),
  strengths             jsonb not null default '[]'::jsonb,
  weaknesses            jsonb not null default '[]'::jsonb,
  missing_points        jsonb not null default '[]'::jsonb,
  improvement           text,
  created_at            timestamptz not null default now()
);

-- Interview reports ---------------------------------------------------------
-- One report per completed session (Phase 9). report holds the full payload.
create table public.interview_reports (
  id                     uuid primary key default gen_random_uuid(),
  session_id             uuid not null references public.interview_sessions (id) on delete cascade,
  overall_score          numeric(5,2),
  technical_score        numeric(5,2),
  communication_score    numeric(5,2),
  problem_solving_score  numeric(5,2),
  project_score          numeric(5,2),
  behavioral_score       numeric(5,2),
  strengths              jsonb not null default '[]'::jsonb,
  weaknesses             jsonb not null default '[]'::jsonb,
  improvement_areas      jsonb not null default '[]'::jsonb,
  recommended_topics     jsonb not null default '[]'::jsonb,
  summary                text,
  report                 jsonb not null default '{}'::jsonb,
  created_at             timestamptz not null default now()
);

-- updated_at triggers (reuse the existing helper from schema.sql) -----------
drop trigger if exists resumes_set_updated_at on public.resumes;
create trigger resumes_set_updated_at
  before update on public.resumes
  for each row execute function public.set_updated_at();

drop trigger if exists interview_sessions_set_updated_at on public.interview_sessions;
create trigger interview_sessions_set_updated_at
  before update on public.interview_sessions
  for each row execute function public.set_updated_at();

-- Indexes -------------------------------------------------------------------
create index if not exists idx_resumes_user_id
  on public.resumes (user_id, created_at desc);
create index if not exists idx_sessions_user_created
  on public.interview_sessions (user_id, created_at desc);
create index if not exists idx_sessions_status
  on public.interview_sessions (status);
create index if not exists idx_questions_session_seq
  on public.interview_questions (session_id, sequence);
create index if not exists idx_questions_parent
  on public.interview_questions (parent_question_id);
create index if not exists idx_answers_question
  on public.interview_answers (question_id);
create index if not exists idx_evaluations_answer
  on public.interview_evaluations (answer_id);
create index if not exists idx_reports_session
  on public.interview_reports (session_id);

-- Row Level Security ---------------------------------------------------------
alter table public.resumes             enable row level security;
alter table public.interview_sessions  enable row level security;
alter table public.interview_questions enable row level security;
alter table public.interview_answers   enable row level security;
alter table public.interview_evaluations enable row level security;
alter table public.interview_reports   enable row level security;

-- Direct ownership: resumes + sessions --------------------------------------
create policy "resumes: user all" on public.resumes for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "interview_sessions: user all" on public.interview_sessions for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Child tables: ownership through the session --------------------------------
create policy "interview_questions: user all" on public.interview_questions for all
  using (exists (
    select 1 from public.interview_sessions s
    where s.id = interview_questions.session_id and s.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.interview_sessions s
    where s.id = interview_questions.session_id and s.user_id = auth.uid()
  ));

create policy "interview_answers: user all" on public.interview_answers for all
  using (exists (
    select 1 from public.interview_questions q
    join public.interview_sessions s on s.id = q.session_id
    where q.id = interview_answers.question_id and s.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.interview_questions q
    join public.interview_sessions s on s.id = q.session_id
    where q.id = interview_answers.question_id and s.user_id = auth.uid()
  ));

create policy "interview_evaluations: user all" on public.interview_evaluations for all
  using (exists (
    select 1 from public.interview_answers a
    join public.interview_questions q on q.id = a.question_id
    join public.interview_sessions s on s.id = q.session_id
    where a.id = interview_evaluations.answer_id and s.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.interview_answers a
    join public.interview_questions q on q.id = a.question_id
    join public.interview_sessions s on s.id = q.session_id
    where a.id = interview_evaluations.answer_id and s.user_id = auth.uid()
  ));

create policy "interview_reports: user all" on public.interview_reports for all
  using (exists (
    select 1 from public.interview_sessions s
    where s.id = interview_reports.session_id and s.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.interview_sessions s
    where s.id = interview_reports.session_id and s.user_id = auth.uid()
  ));
