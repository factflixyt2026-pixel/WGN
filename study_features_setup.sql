-- Doplnok po supabase_setup.sql
create table if not exists public.saved_questions (
 user_id uuid not null references auth.users(id) on delete cascade,
 question_id integer not null,
 created_at timestamptz not null default now(),
 primary key(user_id,question_id)
);
create table if not exists public.study_activity (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 question_id integer not null,
 mistakes integer not null default 0 check(mistakes>=0),
 xp integer not null default 0 check(xp>=0),
 created_at timestamptz not null default now()
);
create index if not exists study_activity_user_time_idx on public.study_activity(user_id,created_at desc);
alter table public.saved_questions enable row level security;
alter table public.study_activity enable row level security;
drop policy if exists saved_own on public.saved_questions;
create policy saved_own on public.saved_questions for all to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
drop policy if exists activity_read_own on public.study_activity;
create policy activity_read_own on public.study_activity for select to authenticated using (user_id=(select auth.uid()));
drop policy if exists activity_insert_own on public.study_activity;
create policy activity_insert_own on public.study_activity for insert to authenticated with check (user_id=(select auth.uid()) and xp=0);
-- Klient nesmie sám pridávať dôveryhodné XP do activity. Udalosti so skóre z klienta budú odmietnuté.
-- Na produkcii zaznamenávaj XP iba v dôveryhodnej RPC submit_answer.
