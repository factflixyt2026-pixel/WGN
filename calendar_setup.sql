
-- WayGo personal calendar: run in Supabase SQL Editor
create table if not exists public.calendar_events (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 title text not null check (char_length(title) between 1 and 120),
 event_date date not null,
 event_time time not null,
 notes text not null default '' check (char_length(notes)<=1000),
 created_at timestamptz not null default now()
);
create index if not exists calendar_events_user_date on public.calendar_events(user_id,event_date);
alter table public.calendar_events enable row level security;
drop policy if exists calendar_own_select on public.calendar_events;
drop policy if exists calendar_own_insert on public.calendar_events;
drop policy if exists calendar_own_update on public.calendar_events;
drop policy if exists calendar_own_delete on public.calendar_events;
create policy calendar_own_select on public.calendar_events for select to authenticated using ((select auth.uid())=user_id);
create policy calendar_own_insert on public.calendar_events for insert to authenticated with check ((select auth.uid())=user_id);
create policy calendar_own_update on public.calendar_events for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy calendar_own_delete on public.calendar_events for delete to authenticated using ((select auth.uid())=user_id);
