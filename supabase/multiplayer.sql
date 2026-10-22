-- Additive migration: leaves existing teams/players/draft_rooms/draft_picks intact.
-- Run in Supabase SQL Editor. Enable Authentication > Providers > Anonymous Sign-Ins.
create table if not exists public.fc_rooms (
 code text primary key, mode text not null check(mode in ('world_cup','ucl')),
 owner uuid not null references auth.users(id), result jsonb,
 revision integer not null default 0, created_at timestamptz not null default now()
);
create table if not exists public.fc_members (
 room_code text references public.fc_rooms(code) on delete cascade,
 user_id uuid references auth.users(id), state jsonb,
 primary key(room_code,user_id)
);
alter table public.fc_rooms enable row level security;
alter table public.fc_members enable row level security;
revoke all on public.fc_rooms, public.fc_members from anon, authenticated;

create or replace function public.fc_connect(p_code text,p_mode text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare c text; r public.fc_rooms;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 if p_code is null then
  c=upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
  insert into fc_rooms(code,mode,owner) values(c,p_mode,auth.uid()) returning * into r;
 else
  select * into r from fc_rooms where code=upper(p_code) for update;
  if not found then raise exception 'Room not found'; end if;
  if (select count(*) from fc_members where room_code=r.code)>=2 and not exists(select 1 from fc_members where room_code=r.code and user_id=auth.uid()) then raise exception 'Room is full'; end if;
 end if;
 insert into fc_members(room_code,user_id) values(r.code,auth.uid()) on conflict do nothing;
 return jsonb_build_object('code',r.code,'mode',r.mode,'revision',r.revision);
end $$;

create or replace function public.fc_read(p_code text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r public.fc_rooms; members jsonb;
begin
 if not exists(select 1 from fc_members where room_code=p_code and user_id=auth.uid()) then raise exception 'Not a member'; end if;
 select * into r from fc_rooms where code=p_code;
 select jsonb_agg(jsonb_build_object('host',user_id=r.owner,'state',state)) into members from fc_members where room_code=p_code;
 return jsonb_build_object('code',r.code,'mode',r.mode,'members',members,'result',r.result);
end $$;

create or replace function public.fc_submit(p_code text,p_state jsonb)
returns void language plpgsql security definer set search_path=public as $$
declare r public.fc_rooms; a numeric; b numeric; h integer; v integer; ready integer;
begin
 select * into r from fc_rooms where code=p_code for update;
 if not exists(select 1 from fc_members where room_code=p_code and user_id=auth.uid()) then raise exception 'Not a member'; end if;
 if r.result is not null then return; end if;
 if p_state->>'mode' <> r.mode or jsonb_typeof(p_state->'picks') is distinct from 'array' then raise exception 'Invalid draft'; end if;
 if jsonb_array_length(p_state->'picks')<>16 or (p_state->>'rerolls')::integer not between 0 and 3 or p_state->>'formation' not in ('4-3-3','4-4-2','4-2-4','3-5-2') then raise exception 'Invalid draft'; end if;
 if exists(select 1 from jsonb_array_elements(p_state->'picks') p where p<>'null'::jsonb and ((p->>'rating')::int not between 1 and 100 or p->>'name' is null)) then raise exception 'Invalid player'; end if;
 update fc_members set state=p_state where room_code=p_code and user_id=auth.uid();
 update fc_rooms set revision=revision+1 where code=p_code;
 select count(*) into ready from fc_members m where room_code=p_code and state is not null and (select count(*) from jsonb_array_elements(m.state->'picks') p where p<>'null'::jsonb)=16;
 if ready=2 then
  select avg((p->>'rating')::numeric) into a from fc_members m, lateral jsonb_array_elements(m.state->'picks') with ordinality as x(p,n) where m.room_code=p_code and m.user_id=r.owner and n<=11;
  select avg((p->>'rating')::numeric) into b from fc_members m, lateral jsonb_array_elements(m.state->'picks') with ordinality as x(p,n) where m.room_code=p_code and m.user_id<>r.owner and n<=11;
  h=0; v=0;
  for i in 1..5 loop
   if random()<greatest(.08,least(.65,.27+(a-b)/70)) then h=h+1; end if;
   if random()<greatest(.08,least(.65,.27+(b-a)/70)) then v=v+1; end if;
  end loop;
  update fc_rooms set result=jsonb_build_object('home',h,'away',v,'penalties',case when h=v then case when random()<a/(a+b) then '房主点球获胜' else '客队点球获胜' end else '' end) where code=p_code;
 end if;
end $$;
revoke all on function public.fc_connect(text,text),public.fc_read(text),public.fc_submit(text,jsonb) from public,anon;
grant execute on function public.fc_connect(text,text),public.fc_read(text),public.fc_submit(text,jsonb) to authenticated;
