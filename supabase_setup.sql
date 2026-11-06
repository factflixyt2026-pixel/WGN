-- WayGo production schema. Run in Supabase SQL editor. REVIEW before deployment.
create extension if not exists pgcrypto;
create table if not exists public.profiles(id uuid primary key references auth.users(id) on delete cascade,first_name text not null default 'Študent',avatar_url text,vip_until timestamptz,created_at timestamptz default now());
create table if not exists public.admins(user_id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.quiz_questions(id integer primary key,correct text[] not null,review boolean not null default true);
create table if not exists public.quiz_awards(user_id uuid not null references auth.users(id) on delete cascade,question_id integer not null references public.quiz_questions(id),xp integer not null check(xp between 0 and 10),created_at timestamptz not null default now(),primary key(user_id,question_id));
create table if not exists public.question_views(user_id uuid not null references auth.users(id) on delete cascade,question_id integer not null,opened_on date not null default (now() at time zone 'utc')::date,primary key(user_id,question_id,opened_on));
create table if not exists public.study_groups(id uuid primary key default gen_random_uuid(),name text not null check(length(name) between 3 and 60),description text,owner_id uuid not null references auth.users(id),created_at timestamptz default now());
create table if not exists public.group_members(group_id uuid references public.study_groups(id) on delete cascade,user_id uuid references auth.users(id) on delete cascade,primary key(group_id,user_id));
create table if not exists public.stripe_customers(user_id uuid primary key references auth.users(id) on delete cascade,stripe_customer_id text unique not null);
create table if not exists public.stripe_events(event_id text primary key,received_at timestamptz not null default now());
create or replace function public.new_profile() returns trigger language plpgsql security definer set search_path=public as $$begin insert into public.profiles(id) values(new.id) on conflict do nothing;return new;end$$;
drop trigger if exists auth_profile on auth.users;create trigger auth_profile after insert on auth.users for each row execute function public.new_profile();
insert into public.profiles(id) select id from auth.users on conflict do nothing;
alter table public.profiles enable row level security;alter table public.admins enable row level security;alter table public.quiz_questions enable row level security;alter table public.quiz_awards enable row level security;alter table public.question_views enable row level security;alter table public.study_groups enable row level security;alter table public.group_members enable row level security;alter table public.stripe_customers enable row level security;alter table public.stripe_events enable row level security;
drop policy if exists profile_read on public.profiles;create policy profile_read on public.profiles for select to authenticated using(true);
drop policy if exists profile_update on public.profiles;create policy profile_update on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
-- Column-level permissions prevent VIP updates from browser clients.
revoke all on public.profiles from anon,authenticated;grant select(id,first_name,avatar_url,vip_until,created_at) on public.profiles to authenticated;grant update(first_name,avatar_url) on public.profiles to authenticated;
drop policy if exists award_read on public.quiz_awards;create policy award_read on public.quiz_awards for select to authenticated using(user_id=auth.uid());
drop policy if exists groups_read on public.study_groups;create policy groups_read on public.study_groups for select to authenticated using(true);
drop policy if exists groups_create on public.study_groups;create policy groups_create on public.study_groups for insert to authenticated with check(owner_id=auth.uid());
drop policy if exists members_read on public.group_members;create policy members_read on public.group_members for select to authenticated using(true);
drop policy if exists members_join on public.group_members;create policy members_join on public.group_members for insert to authenticated with check(user_id=auth.uid());
-- All other tables have no direct client policies; keys, roles, VIP and views remain server-managed.
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from public.admins where user_id=auth.uid())$$;
create or replace function public.open_question(p_question_id int) returns jsonb language plpgsql security definer set search_path=public as $$
declare v_user uuid:=auth.uid();v_vip boolean;v_count int;v_seen boolean;v_today date:=(now() at time zone 'utc')::date;
begin
 if v_user is null then raise exception 'Prihlás sa v profile.';end if;
 if not exists(select 1 from public.quiz_questions where id=p_question_id) then raise exception 'Otázka neexistuje.';end if;
 select coalesce(vip_until>now(),false) into v_vip from public.profiles where id=v_user;
 -- Serialize concurrent opens per user; prevents bypassing the daily cap.
 perform pg_advisory_xact_lock(hashtext(v_user::text));
 select exists(select 1 from public.question_views where user_id=v_user and question_id=p_question_id and opened_on=v_today) into v_seen;
 select count(*) into v_count from public.question_views where user_id=v_user and opened_on=v_today;
 if not coalesce(v_vip,false) and not v_seen and v_count>=20 then return jsonb_build_object('allowed',false,'remaining',0,'vip',false);end if;
 insert into public.question_views(user_id,question_id,opened_on) values(v_user,p_question_id,v_today) on conflict do nothing;
 if not v_seen then v_count:=v_count+1;end if;
 return jsonb_build_object('allowed',true,'remaining',case when v_vip then null else greatest(0,20-v_count) end,'vip',coalesce(v_vip,false));
end$$;
create or replace function public.submit_answer(p_question_id int,p_selected text[]) returns jsonb language plpgsql security definer set search_path=public as $$
declare v_user uuid:=auth.uid();v_correct text[];v_review boolean;v_mistakes int;v_xp int;v_old int;v_today date:=(now() at time zone 'utc')::date;
begin
 if v_user is null then raise exception 'Prihlás sa.';end if;
 if not exists(select 1 from public.question_views where user_id=v_user and question_id=p_question_id and opened_on=v_today) then raise exception 'Najprv otvor otázku.';end if;
 select correct,review into v_correct,v_review from public.quiz_questions where id=p_question_id;
 if not found then raise exception 'Otázka neexistuje.';end if;
 if p_selected is null or cardinality(p_selected)=0 or exists(select 1 from unnest(p_selected) x where x not in('a','b','c','d','e','f','g','h')) or (select count(distinct x) from unnest(p_selected) x)<>cardinality(p_selected) then raise exception 'Neplatný výber.';end if;
 if v_review then return jsonb_build_object('xp',0,'review',true,'correct',v_correct);end if;
 select xp into v_old from public.quiz_awards where user_id=v_user and question_id=p_question_id;
 if found then return jsonb_build_object('xp',0,'already',true,'earned',v_old,'correct',v_correct);end if;
 select count(*) into v_mistakes from unnest(array['a','b','c','d','e','f','g','h']) t(x) where (x=any(v_correct)) is distinct from (x=any(p_selected));
 v_xp:=greatest(0,10-2*v_mistakes);
 insert into public.quiz_awards(user_id,question_id,xp) values(v_user,p_question_id,v_xp) on conflict do nothing;
 if not found then return jsonb_build_object('xp',0,'already',true,'correct',v_correct);end if;
 return jsonb_build_object('xp',v_xp,'mistakes',v_mistakes,'correct',v_correct);
end$$;
create or replace function public.get_leaderboard(p_period text) returns table(first_name text,xp bigint) language sql stable security definer set search_path=public as $$select p.first_name,sum(a.xp)::bigint from public.quiz_awards a join public.profiles p on p.id=a.user_id where a.created_at>=case when p_period='year' then date_trunc('year',now()) else date_trunc('month',now()) end group by a.user_id,p.first_name order by 2 desc limit 100$$;
create or replace function public.admin_dashboard() returns jsonb language plpgsql security definer set search_path=public as $$begin if not public.is_admin() then raise exception 'Prístup zamietnutý.';end if;return jsonb_build_object('users',(select count(*) from public.profiles),'vip',(select count(*) from public.profiles where vip_until>now()),'review',(select count(*) from public.quiz_questions where review));end$$;
create or replace function public.admin_verify_question(p_question_id int,p_correct text[]) returns void language plpgsql security definer set search_path=public as $$begin if not public.is_admin() then raise exception 'Prístup zamietnutý.';end if;if p_correct is null or cardinality(p_correct)=0 or exists(select 1 from unnest(p_correct) x where x not in('a','b','c','d','e','f','g','h')) or (select count(distinct x) from unnest(p_correct) x)<>cardinality(p_correct) then raise exception 'Neplatný kľúč.';end if;update public.quiz_questions set correct=p_correct,review=false where id=p_question_id;if not found then raise exception 'Otázka neexistuje.';end if;end$$;
revoke all on function public.open_question(int),public.submit_answer(int,text[]),public.get_leaderboard(text),public.admin_dashboard(),public.admin_verify_question(int,text[]) from public;
grant execute on function public.open_question(int),public.submit_answer(int,text[]),public.get_leaderboard(text),public.admin_dashboard(),public.admin_verify_question(int,text[]) to authenticated;
-- ADMIN SETUP: create an Auth account via the normal sign-up flow, then in SQL editor run:
-- insert into public.admins(user_id) select id from auth.users where email='YOUR_ADMIN_EMAIL' on conflict do nothing;
-- Do not place any admin password in HTML or JavaScript.
