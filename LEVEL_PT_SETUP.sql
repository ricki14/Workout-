-- LEVEL · setup area Personal Trainer
-- Eseguire una sola volta nel SQL Editor del progetto Supabase collegato a LEVEL.
create extension if not exists pgcrypto;

create table if not exists public.trainer_codes (
  trainer_id uuid primary key references auth.users(id) on delete cascade,
  code text not null unique,
  created_at timestamptz not null default now()
);
create table if not exists public.trainer_links (
  trainer_id uuid not null references auth.users(id) on delete cascade,
  athlete_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (trainer_id, athlete_id),
  check (trainer_id <> athlete_id)
);
create table if not exists public.trainer_plans (
  athlete_id uuid primary key references auth.users(id) on delete cascade,
  trainer_id uuid not null references auth.users(id) on delete cascade,
  plan jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.trainer_codes enable row level security;
alter table public.trainer_links enable row level security;
alter table public.trainer_plans enable row level security;
revoke all on public.trainer_codes, public.trainer_links, public.trainer_plans from anon, authenticated;

create or replace function public.trainer_get_my_code()
returns text language plpgsql security definer set search_path=public,auth as $$
declare v_code text;
begin
 if auth.uid() is null then raise exception 'Autenticazione richiesta'; end if;
 if coalesce((select raw_user_meta_data->>'account_type' from auth.users where id=auth.uid()),'') <> 'pt' then raise exception 'Solo i PT possono richiedere un codice'; end if;
 insert into public.trainer_codes(trainer_id,code) values(auth.uid(),'LVL-'||upper(substr(encode(gen_random_bytes(5),'hex'),1,8))) on conflict(trainer_id) do nothing;
 select code into v_code from public.trainer_codes where trainer_id=auth.uid();
 return v_code;
end $$;

create or replace function public.athlete_link_to_trainer(p_code text)
returns boolean language plpgsql security definer set search_path=public,auth as $$
declare v_trainer uuid;
begin
 if auth.uid() is null then raise exception 'Autenticazione richiesta'; end if;
 if coalesce((select raw_user_meta_data->>'account_type' from auth.users where id=auth.uid()),'') = 'pt' then raise exception 'Un account PT non può collegarsi come atleta'; end if;
 select trainer_id into v_trainer from public.trainer_codes where upper(code)=upper(trim(p_code));
 if v_trainer is null then raise exception 'Codice non valido'; end if;
 insert into public.trainer_links(trainer_id,athlete_id) values(v_trainer,auth.uid()) on conflict(athlete_id) do update set trainer_id=excluded.trainer_id,created_at=now();
 return true;
end $$;

create or replace function public.athlete_get_assigned_plan()
returns table(plan jsonb) language sql security definer set search_path=public,auth as $$
 select tp.plan from public.trainer_plans tp join public.trainer_links tl on tl.athlete_id=tp.athlete_id and tl.trainer_id=tp.trainer_id where tl.athlete_id=auth.uid() limit 1;
$$;

create or replace function public.trainer_dashboard_clients()
returns table(id uuid,full_name text,email text,linked_at timestamptz,plan jsonb,session_count bigint,last_workout date)
language sql security definer set search_path=public,auth as $$
 select u.id,coalesce(p.full_name,u.raw_user_meta_data->>'full_name','Atleta') as full_name,u.email,tl.created_at,tp.plan,
   (select count(*) from public.workout_records wr where wr.user_id=u.id) as session_count,
   (select max(wr.date) from public.workout_records wr where wr.user_id=u.id) as last_workout
 from public.trainer_links tl join auth.users u on u.id=tl.athlete_id
 left join public.profiles p on p.id=u.id left join public.trainer_plans tp on tp.athlete_id=u.id and tp.trainer_id=tl.trainer_id
 where tl.trainer_id=auth.uid() order by tl.created_at desc;
$$;

create or replace function public.trainer_get_client_records(p_athlete_id uuid)
returns setof public.workout_records language plpgsql security definer set search_path=public,auth as $$
begin
 if not exists(select 1 from public.trainer_links where trainer_id=auth.uid() and athlete_id=p_athlete_id) then raise exception 'Atleta non collegato a questo PT'; end if;
 return query select * from public.workout_records where user_id=p_athlete_id order by date desc,created_at desc;
end $$;

create or replace function public.trainer_save_client_plan(p_athlete_id uuid,p_plan jsonb)
returns boolean language plpgsql security definer set search_path=public,auth as $$
begin
 if not exists(select 1 from public.trainer_links where trainer_id=auth.uid() and athlete_id=p_athlete_id) then raise exception 'Atleta non collegato a questo PT'; end if;
 if jsonb_typeof(p_plan) <> 'object' or jsonb_typeof(p_plan->'days') <> 'array' then raise exception 'Formato scheda non valido'; end if;
 insert into public.trainer_plans(athlete_id,trainer_id,plan,updated_at) values(p_athlete_id,auth.uid(),p_plan,now())
 on conflict(athlete_id) do update set trainer_id=excluded.trainer_id,plan=excluded.plan,updated_at=now();
 return true;
end $$;

revoke all on function public.trainer_get_my_code() from public;
revoke all on function public.athlete_link_to_trainer(text) from public;
revoke all on function public.athlete_get_assigned_plan() from public;
revoke all on function public.trainer_dashboard_clients() from public;
revoke all on function public.trainer_get_client_records(uuid) from public;
revoke all on function public.trainer_save_client_plan(uuid,jsonb) from public;
grant execute on function public.trainer_get_my_code() to authenticated;
grant execute on function public.athlete_link_to_trainer(text) to authenticated;
grant execute on function public.athlete_get_assigned_plan() to authenticated;
grant execute on function public.trainer_dashboard_clients() to authenticated;
grant execute on function public.trainer_get_client_records(uuid) to authenticated;
grant execute on function public.trainer_save_client_plan(uuid,jsonb) to authenticated;
