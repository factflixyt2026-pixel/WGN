-- Súkromné skupinové poznámky, prístup len pre členov.
create table if not exists public.group_notes (
 id uuid primary key default gen_random_uuid(),
 group_id uuid not null references public.study_groups(id) on delete cascade,
 author_id uuid not null references auth.users(id) on delete cascade,
 title text not null check(length(title) between 1 and 120),
 content text not null default '',
 created_at timestamptz not null default now()
);
alter table public.group_notes enable row level security;
drop policy if exists group_notes_members_read on public.group_notes;
create policy group_notes_members_read on public.group_notes for select to authenticated using
 (exists(select 1 from public.group_members m where m.group_id=group_notes.group_id and m.user_id=(select auth.uid())));
drop policy if exists group_notes_members_write on public.group_notes;
create policy group_notes_members_write on public.group_notes for insert to authenticated with check
 (author_id=(select auth.uid()) and exists(select 1 from public.group_members m where m.group_id=group_notes.group_id and m.user_id=(select auth.uid())));
drop policy if exists group_notes_author_delete on public.group_notes;
create policy group_notes_author_delete on public.group_notes for delete to authenticated using(author_id=(select auth.uid()));

create table if not exists public.group_quizzes (
 id uuid primary key default gen_random_uuid(),
 group_id uuid not null references public.study_groups(id) on delete cascade,
 creator_id uuid not null references auth.users(id) on delete cascade,
 topic_index integer not null check(topic_index between 0 and 20),
 created_at timestamptz not null default now()
);
alter table public.group_quizzes enable row level security;
drop policy if exists group_quizzes_read on public.group_quizzes;
create policy group_quizzes_read on public.group_quizzes for select to authenticated using
 (exists(select 1 from public.group_members m where m.group_id=group_quizzes.group_id and m.user_id=(select auth.uid())));
drop policy if exists group_quizzes_write on public.group_quizzes;
create policy group_quizzes_write on public.group_quizzes for insert to authenticated with check
 (creator_id=(select auth.uid()) and exists(select 1 from public.group_members m where m.group_id=group_quizzes.group_id and m.user_id=(select auth.uid())));
