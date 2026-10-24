-- ERA FC draft protocol 3. Execute the GENERATED upgrade-spin-locks.sql, not this template.
-- Requires the original multiplayer.sql tables. Atomic migration; safe to run again.
begin;
alter table public.fc_rooms add column if not exists rules_version integer not null default 2;
alter table public.fc_members add column if not exists revision integer not null default 0;
alter table public.fc_members add column if not exists last_request_id uuid;
alter table public.fc_rooms add column if not exists capacity integer not null default 2;
alter table public.fc_rooms drop constraint if exists fc_rooms_mode_check;
alter table public.fc_rooms add constraint fc_rooms_mode_check check(mode in ('world_cup','ucl','euro','copa_america'));
alter table public.fc_rooms drop constraint if exists fc_rooms_capacity_check;
alter table public.fc_rooms add constraint fc_rooms_capacity_check check(capacity between 2 and 4);
alter table public.fc_members add column if not exists seat integer;
with ordered as (select m.room_code,m.user_id,(row_number() over(partition by m.room_code order by (m.user_id=r.owner) desc,m.user_id)-1)::integer as assigned from public.fc_members m join public.fc_rooms r on r.code=m.room_code)
 update public.fc_members m set seat=o.assigned from ordered o where m.room_code=o.room_code and m.user_id=o.user_id and m.seat is null;
alter table public.fc_members alter column seat set not null;
create unique index if not exists fc_member_seats on public.fc_members(room_code,seat);
create table if not exists public.fc_player_catalog (
 player_key text primary key, identity text not null, mode text not null,
 pool_id text not null, era_id text not null, year integer not null,
 name text not null, base_rating integer not null check(base_rating between 1 and 110),
 positions text[] not null, profile text not null
);
alter table public.fc_player_catalog drop constraint if exists fc_player_catalog_base_rating_check;
alter table public.fc_player_catalog add constraint fc_player_catalog_base_rating_check check(base_rating between 1 and 110);
create table if not exists public.fc_era_catalog (id text primary key, from_year integer not null, to_year integer not null);
create table if not exists public.fc_chemistry_pairs (id text primary key, left_identity text not null, right_identity text not null, bonus integer not null check(bonus between 1 and 3));
create table if not exists public.fc_chemistry_trios (id text primary key, identities text[] not null, bonus_mode text not null check(bonus_mode in ('flat','percent')), bonus integer not null check(bonus between 1 and 10));
create table if not exists public.fc_player_locks (
 room_code text not null references public.fc_rooms(code) on delete cascade,
 player_key text not null references public.fc_player_catalog(player_key),
 user_id uuid not null references auth.users(id), created_at timestamptz not null default now(),
 primary key(room_code,player_key)
);
alter table public.fc_player_catalog enable row level security;
alter table public.fc_era_catalog enable row level security;
alter table public.fc_chemistry_pairs enable row level security;
alter table public.fc_chemistry_trios enable row level security;
alter table public.fc_player_locks enable row level security;
revoke all on public.fc_player_catalog,public.fc_era_catalog,public.fc_chemistry_pairs,public.fc_chemistry_trios,public.fc_player_locks from anon,authenticated;
-- @CATALOG@

create or replace function public.fc_protocol_v3() returns jsonb language sql security definer set search_path=public,pg_temp as $$
 select jsonb_build_object('version',3,'chemistry_version',4,'rating_version',8,'room_version',10,'catalog_count',(select count(*) from fc_player_catalog));
$$;
create or replace function public._fc_connect_rules(p_code text,p_mode text,p_rules integer)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare c text; r public.fc_rooms; n integer;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 if p_mode not in ('world_cup','ucl','euro','copa_america') or p_mode is null then raise exception 'Invalid mode'; end if;
 if p_code is null then
  loop
   c=upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
   insert into fc_rooms(code,mode,owner,rules_version) values(c,p_mode,auth.uid(),p_rules) on conflict do nothing returning * into r;
   exit when found;
  end loop;
 else
  select * into r from fc_rooms where code=upper(trim(p_code)) for update;
  if not found then raise exception 'Room not found'; end if;
  if r.rules_version<>p_rules then raise exception 'FC_RULES_MISMATCH'; end if;
  if r.result is not null then raise exception 'FC_ROOM_FINISHED'; end if;
  select count(*) into n from fc_members where room_code=r.code;
  if n>=r.capacity and not exists(select 1 from fc_members where room_code=r.code and user_id=auth.uid()) then raise exception 'Room is full'; end if;
 end if;
 if not exists(select 1 from fc_members where room_code=r.code and user_id=auth.uid()) then
  select min(i) into n from generate_series(0,r.capacity-1) i where not exists(select 1 from fc_members where room_code=r.code and seat=i);
  insert into fc_members(room_code,user_id,seat) values(r.code,auth.uid(),n);
 end if;
 return jsonb_build_object('code',r.code,'mode',r.mode,'capacity',r.capacity,'rules_version',r.rules_version);
end $$;
create or replace function public.fc_connect(p_code text,p_mode text)
returns jsonb language sql security definer set search_path=public,pg_temp as $$ select _fc_connect_rules(p_code,p_mode,2); $$;
create or replace function public.fc_connect_v3(p_code text,p_mode text)
returns jsonb language sql security definer set search_path=public,pg_temp as $$ select _fc_connect_rules(p_code,p_mode,3); $$;

create or replace function public.fc_create_room_v9(p_mode text,p_capacity integer)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare connected jsonb;
begin
 if p_capacity is null or p_capacity not between 2 and 4 then raise exception 'FC_INVALID_CAPACITY'; end if;
 connected=_fc_connect_rules(null,p_mode,3);
 update fc_rooms set capacity=p_capacity where code=connected->>'code' and owner=auth.uid();
 return connected||jsonb_build_object('capacity',p_capacity);
end $$;

create or replace function public.fc_read_v3(p_code text)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare r public.fc_rooms; members jsonb; locks jsonb;
begin
 if auth.uid() is null or not exists(select 1 from fc_members where room_code=p_code and user_id=auth.uid()) then raise exception 'Not a member'; end if;
 select * into r from fc_rooms where code=p_code;
 if r.rules_version<>3 then raise exception 'FC_RULES_MISMATCH'; end if;
 select jsonb_agg(jsonb_build_object('host',user_id=r.owner,'is_self',user_id=auth.uid(),'state',state,'revision',revision,'seat',seat) order by seat) into members from fc_members where room_code=p_code;
 select coalesce(jsonb_agg(jsonb_build_object('player_id',player_key,'mine',user_id=auth.uid())),'[]'::jsonb) into locks from fc_player_locks where room_code=p_code;
 return jsonb_build_object('code',r.code,'mode',r.mode,'members',members,'locks',locks,'result',r.result,'capacity',r.capacity,'rules_version',3);
end $$;

create or replace function public._fc_effective_rating(p_key text,p_position text,p_target text,p_identities text[],p_starters text[])
returns integer language plpgsql stable security definer set search_path=public,pg_temp as $$
declare c public.fc_player_catalog; e public.fc_era_catalog; pos_loss integer; era_loss integer:=0; chemistry integer; trio_bonus integer;
begin
 select * into strict c from fc_player_catalog where player_key=p_key;
 select * into strict e from fc_era_catalog where id=p_target;
 pos_loss=case when p_position='SUB' or p_position=any(c.positions) then 0
  when p_position='GK' or 'GK'=any(c.positions) then 45
  when (p_position=any(array['LW','RW','LM','RM']) and c.positions&&array['LW','RW','LM','RM'])
    or (p_position=any(array['ST','CAM']) and c.positions&&array['ST','CAM'])
    or (p_position=any(array['CM','CDM','CAM']) and c.positions&&array['CM','CDM','CAM'])
    or (p_position=any(array['LB','RB','CB','LWB','RWB']) and c.positions&&array['LB','RB','CB','LWB','RWB']) then 4 else 12 end;
 if c.year between e.from_year and e.to_year or c.identity='virgil-van-dijk' or c.profile='universal' then era_loss=0;
 elsif c.year<1992 and e.from_year>=1995 and c.profile='classic-keeper' then era_loss=3;
 elsif c.year<1995 and e.from_year>=2005 and c.profile in ('classic-stopper','classic-maker') then era_loss=2;
 elsif c.year>=2005 and e.to_year<=1984 and c.profile='modern-wingback' then era_loss=2;
 elsif c.year>=2005 and e.to_year<=1984 and c.profile='modern-press' then era_loss=1;
 end if;
 select least(3,coalesce(sum(bonus),0)) into chemistry from fc_chemistry_pairs
  where (left_identity=c.identity or right_identity=c.identity) and left_identity=any(p_identities) and right_identity=any(p_identities);
 if c.identity=any(p_identities) then
  select coalesce(max(case when bonus_mode='percent' then round(c.base_rating*bonus/100.0)::integer else bonus end),0) into trio_bonus
   from fc_chemistry_trios where c.identity=any(identities) and identities<@p_identities;
  chemistry=greatest(chemistry,trio_bonus);
 end if;
 return greatest(15,c.base_rating+chemistry-pos_loss-era_loss);
end $$;

-- Preserve the old private helper signature for existing callers.
create or replace function public._fc_effective_rating(p_key text,p_position text,p_target text,p_identities text[]) returns integer language sql stable security definer set search_path=public,pg_temp as $$ select _fc_effective_rating(p_key,p_position,p_target,p_identities,array[]::text[]); $$;

create or replace function public.fc_submit_v3(p_code text,p_state jsonb,p_revision integer,p_request_id uuid)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare r public.fc_rooms; m public.fc_members; host_state jsonb; v_player jsonb; c public.fc_player_catalog;
 ids text[]; starter_ids text[]; shape text[]; actual_formation text; canonical jsonb:='[]'::jsonb; updated_state jsonb;
 pool_slots integer; n integer; unique_people integer; new_claims integer; ordinal integer:=0; position text; conflicting text;
 team_name text; ready integer; a numeric; b numeric; h integer:=0; v integer:=0;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 select * into r from fc_rooms where code=p_code for update;
 if not found or r.rules_version<>3 then raise exception 'FC_RULES_MISMATCH'; end if;
 select * into m from fc_members where room_code=p_code and user_id=auth.uid();
 if not found then raise exception 'Not a member'; end if;
 if p_request_id is null or p_revision is null then raise exception 'FC_INVALID_REQUEST'; end if;
 team_name=coalesce(nullif(btrim(p_state->>'teamName'),''),'我的球队');
 if char_length(team_name)>20 or team_name ~ '[[:cntrl:]]' then raise exception 'FC_INVALID_TEAM_NAME'; end if;
 if m.state->>'teamName' is not null and m.state->>'teamName'<>team_name then raise exception 'FC_NAME_LOCKED'; end if;
 if m.last_request_id=p_request_id then return jsonb_build_object('revision',m.revision,'replayed',true,'result',r.result); end if;
 if m.revision<>p_revision then raise exception 'FC_STALE_STATE' using detail=m.revision::text; end if;
 if r.result is not null then raise exception 'FC_ROOM_FINISHED'; end if;
 if pg_column_size(p_state)>200000 or p_state->>'mode' is distinct from r.mode or p_state->>'lockProtocol' is distinct from '3'
   or p_state->>'started' is distinct from 'true' or jsonb_typeof(p_state->'picks') is distinct from 'array' then raise exception 'FC_INVALID_STATE'; end if;
 if jsonb_array_length(p_state->'picks')<>16 or jsonb_typeof(p_state->'excludedEras') is distinct from 'array'
   or not coalesce(p_state->>'drawPhase'=any(array['awaiting','ready','complete']),false) then raise exception 'FC_INVALID_STATE'; end if;
 if not exists(select 1 from fc_era_catalog where id=p_state->>'targetEra') or jsonb_array_length(p_state->'excludedEras')>11
   or exists(select 1 from jsonb_array_elements_text(p_state->'excludedEras') x where not exists(select 1 from fc_era_catalog where id=x)) then raise exception 'FC_INVALID_SETTINGS'; end if;
 if jsonb_typeof(p_state->'rerolls') is distinct from 'number' or (p_state->>'rerolls')::numeric not between 0 and 3
   or (p_state->>'rerolls')::numeric<>trunc((p_state->>'rerolls')::numeric) then raise exception 'FC_INVALID_STATE'; end if;
 actual_formation=coalesce(p_state->>'lineupFormation',p_state->>'formation');
 shape=case actual_formation
  when '4-3-3' then array['LW','ST','RW','CM','CDM','CM','LB','CB','CB','RB','GK']
  when '4-3-3-attacking' then array['LW','ST','RW','CAM','CM','CM','LB','CB','CB','RB','GK']
  when '4-4-2' then array['ST','ST','LM','CM','CM','RM','LB','CB','CB','RB','GK']
  when '3-3-4' then array['LW','ST','ST','RW','CM','CM','CM','CB','CB','CB','GK']
  when '4-2-4' then array['LW','ST','ST','RW','CM','CM','LB','CB','CB','RB','GK']
  when '3-5-2' then array['ST','ST','LM','CM','CDM','CM','RM','CB','CB','CB','GK']
  when '4-2-3-1' then array['ST','LW','CAM','RW','CDM','CDM','LB','CB','CB','RB','GK']
  when '4-3-1-2' then array['ST','ST','CAM','CM','CDM','CM','LB','CB','CB','RB','GK']
  when '3-4-1-2' then array['ST','ST','CAM','LWB','CM','CM','RWB','CB','CB','CB','GK'] else null end;
 if shape is null then raise exception 'FC_INVALID_FORMATION'; end if;
 select count(*),count(distinct cat.identity),array_agg(cat.identity) into n,unique_people,ids
  from jsonb_array_elements(p_state->'picks') p left join fc_player_catalog cat on cat.player_key=p->>'id' where p<>'null'::jsonb;
 if n<>unique_people then raise exception 'FC_INVALID_OR_DUPLICATE_PLAYER'; end if;
 select coalesce(array_agg(cat.identity),array[]::text[]) into starter_ids from jsonb_array_elements(p_state->'picks') with ordinality as x(player,nth) join fc_player_catalog cat on cat.player_key=player->>'id' where nth<=11 and player<>'null'::jsonb;
 if m.state is null and n<>0 then raise exception 'FC_INITIAL_STATE_MUST_BE_EMPTY'; end if;
 if m.state is null then
  select coalesce(sum(least(r.capacity,versions)),0) into pool_slots from (select count(*)::integer as versions from fc_player_catalog cat where cat.mode=r.mode and not exists(select 1 from jsonb_array_elements_text(p_state->'excludedEras') era where era=cat.era_id) group by cat.identity) available;
  if pool_slots<16*r.capacity then raise exception 'FC_INSUFFICIENT_POOL'; end if;
 end if;
 if m.state is not null and (m.state->'targetEra' is distinct from p_state->'targetEra' or m.state->'excludedEras' is distinct from p_state->'excludedEras') then raise exception 'FC_SETTINGS_LOCKED'; end if;
 if auth.uid()<>r.owner then
  select state into host_state from fc_members where room_code=p_code and user_id=r.owner;
  if host_state is null or host_state->'targetEra' is distinct from p_state->'targetEra' or host_state->'excludedEras' is distinct from p_state->'excludedEras' then raise exception 'FC_SETTINGS_LOCKED'; end if;
 end if;
 select count(*) into new_claims from jsonb_array_elements(p_state->'picks') p where p<>'null'::jsonb
  and not exists(select 1 from fc_player_locks l where l.room_code=p_code and l.player_key=p->>'id' and l.user_id=auth.uid());
 if new_claims>1 then raise exception 'FC_ONE_PICK_AT_A_TIME'; end if;
 select l.player_key into conflicting from fc_player_locks l where l.room_code=p_code and l.user_id<>auth.uid()
  and exists(select 1 from jsonb_array_elements(p_state->'picks') p where p->>'id'=l.player_key) limit 1;
 if conflicting is not null then raise exception 'FC_PLAYER_LOCKED' using detail=conflicting; end if;
 delete from fc_player_locks l where l.room_code=p_code and l.user_id=auth.uid() and not exists(select 1 from jsonb_array_elements(p_state->'picks') chosen where chosen->>'id'=l.player_key);
 for v_player in select value from jsonb_array_elements(p_state->'picks') loop
  ordinal=ordinal+1;
  if v_player='null'::jsonb then canonical=canonical||jsonb_build_array(null); continue; end if;
  select * into c from fc_player_catalog where player_key=v_player->>'id';
  if not found or c.mode<>r.mode or exists(select 1 from jsonb_array_elements_text(p_state->'excludedEras') x where x=c.era_id) then raise exception 'FC_INVALID_PLAYER_POOL'; end if;
  if not exists(select 1 from fc_player_locks l where l.room_code=p_code and l.player_key=c.player_key and l.user_id=auth.uid()) and c.pool_id is distinct from p_state->>'pool' then raise exception 'FC_INVALID_PLAYER_POOL'; end if;
  position=case when ordinal<=11 then shape[ordinal] else 'SUB' end;
  v_player=v_player||jsonb_build_object('name',c.name,'identity',c.identity,'baseRating',c.base_rating,'rating',_fc_effective_rating(c.player_key,position,p_state->>'targetEra',ids,starter_ids));
  canonical=canonical||jsonb_build_array(v_player);
  insert into fc_player_locks(room_code,player_key,user_id) values(p_code,c.player_key,auth.uid()) on conflict do nothing;
 end loop;
 updated_state=jsonb_set(p_state,'{picks}',canonical)||jsonb_build_object('teamName',team_name);
 update fc_members set state=updated_state,revision=revision+1,last_request_id=p_request_id where room_code=p_code and user_id=auth.uid();
 update fc_rooms set revision=revision+1 where code=p_code;
 select count(*) into ready from fc_members member where member.room_code=p_code and member.state is not null
  and (select count(*) from jsonb_array_elements(member.state->'picks') p where p<>'null'::jsonb)=16;
 if ready=r.capacity then
  select avg((p->>'rating')::numeric) into a from fc_members member,lateral jsonb_array_elements(member.state->'picks') with ordinality x(p,i) where member.room_code=p_code and member.user_id=r.owner and i<=11;
  select avg((p->>'rating')::numeric) into b from fc_members member,lateral jsonb_array_elements(member.state->'picks') with ordinality x(p,i) where member.room_code=p_code and member.user_id<>r.owner and i<=11;
  for i in 1..5 loop
   if random()<greatest(.08,least(.65,.27+(a-b)/70)) then h=h+1; end if;
   if random()<greatest(.08,least(.65,.27+(b-a)/70)) then v=v+1; end if;
  end loop;
  update fc_rooms set result=jsonb_build_object('home',h,'away',v,'penalties',case when h=v then case when random()<a/(a+b) then '房主点球获胜' else '客队点球获胜' end else '' end) where code=p_code;
 end if;
 return jsonb_build_object('revision',m.revision+1,'replayed',false);
end $$;
-- @LEGACY_SUBMIT@
revoke all on function public._fc_connect_rules(text,text,integer), public._fc_effective_rating(text,text,text,text[]),public._fc_effective_rating(text,text,text,text[],text[]) from public,anon,authenticated;
revoke all on function public.fc_create_room_v9(text,integer),public.fc_protocol_v3(),public.fc_connect(text,text),public.fc_connect_v3(text,text),public.fc_read_v3(text),public.fc_submit_v3(text,jsonb,integer,uuid) from public,anon;
grant execute on function public.fc_create_room_v9(text,integer),public.fc_protocol_v3(),public.fc_connect(text,text),public.fc_connect_v3(text,text),public.fc_read_v3(text),public.fc_submit_v3(text,jsonb,integer,uuid) to authenticated;
notify pgrst, 'reload schema';
commit;
