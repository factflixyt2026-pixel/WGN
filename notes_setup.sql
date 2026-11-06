-- Spusti v Supabase SQL Editor po supabase_setup.sql.
create table if not exists public.study_notebooks (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 title text not null check (char_length(title) between 1 and 120),
 color text not null default '#a66cff',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique (id,user_id)
);
create table if not exists public.study_notes (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 notebook_id uuid null,
 title text not null check (char_length(title) between 1 and 120),
 content text not null default '',
 color text not null default '#a66cff',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 foreign key (notebook_id,user_id) references public.study_notebooks(id,user_id) on delete set null (notebook_id)
);
create index if not exists study_notebooks_owner_idx on public.study_notebooks(user_id);
create index if not exists study_notes_owner_idx on public.study_notes(user_id,notebook_id);
alter table public.study_notebooks enable row level security;
alter table public.study_notes enable row level security;
drop policy if exists own_notebooks on public.study_notebooks;
create policy own_notebooks on public.study_notebooks for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists own_notes on public.study_notes;
create policy own_notes on public.study_notes for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create or replace function public.waygo_notes_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists study_notebooks_touch on public.study_notebooks;
create trigger study_notebooks_touch before update on public.study_notebooks for each row execute function public.waygo_notes_updated_at();
drop trigger if exists study_notes_touch on public.study_notes;
create trigger study_notes_touch before update on public.study_notes for each row execute function public.waygo_notes_updated_at();


-- Dizajn obalu a vnútorných stránok (bezpečné aj pri existujúcich zošitoch).
alter table public.study_notebooks add column if not exists cover_style text not null default 'violet';
alter table public.study_notebooks add column if not exists symbol text not null default 'book open';
alter table public.study_notebooks add column if not exists page_type text not null default 'lined';

-- Ručne písané ťahy: súkromné JSON dáta priradené k poznámke.
alter table public.study_notes add column if not exists drawing jsonb not null default '[]'::jsonb;
