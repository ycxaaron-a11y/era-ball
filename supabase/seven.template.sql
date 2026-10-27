-- Seven-a-side all-time World Cup rooms. Run generated setup-all.sql.
begin;
create table if not exists public.fc7_catalog (
 player_key text primary key references public.fc_player_catalog(player_key), country text not null
);
-- @SEVEN_CATALOG@
create table if not exists public.fc7_rooms (
 code text primary key,owner uuid not null references auth.users(id),capacity integer not null check(capacity between 2 and 4),
 status text not null default 'drafting' check(status in ('drafting','playing','closed')),
 seed bigint,cursor integer not null default 0 check(cursor between 0 and 3),final_live jsonb,created_at timestamptz not null default now()
);
create table if not exists public.fc7_members (
 room_code text not null references public.fc7_rooms(code) on delete cascade,user_id uuid not null references auth.users(id),
 seat integer not null check(seat between 0 and 3),state jsonb not null,revision integer not null default 0,last_request_id uuid,
 primary key(room_code,user_id),unique(room_code,seat)
);
create table if not exists public.fc7_locks (
 room_code text not null,player_key text not null references public.fc7_catalog(player_key),user_id uuid not null,
 primary key(room_code,player_key),foreign key(room_code,user_id) references public.fc7_members(room_code,user_id) on delete cascade
);
alter table public.fc7_catalog enable row level security;
alter table public.fc7_rooms enable row level security;
alter table public.fc7_members enable row level security;
alter table public.fc7_locks enable row level security;
revoke all on public.fc7_catalog,public.fc7_rooms,public.fc7_members,public.fc7_locks from anon,authenticated;
create or replace function public.fc7_protocol() returns jsonb language sql security definer set search_path=public,pg_temp as $$
 select jsonb_build_object('version',2,'catalog_count',(select count(*) from fc7_catalog));
$$;
create or replace function public.fc7_read(p_code text) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_room public.fc7_rooms;
begin
 if auth.uid() is null or not exists(select 1 from fc7_members m where m.room_code=p_code and m.user_id=auth.uid()) then raise exception 'FC7_NOT_MEMBER'; end if;
 select * into v_room from fc7_rooms r where r.code=p_code;
 return jsonb_build_object('code',v_room.code,'capacity',v_room.capacity,'status',v_room.status,'seed',v_room.seed,'cursor',v_room.cursor,'final_live',v_room.final_live,
 'server_now',floor(extract(epoch from clock_timestamp())*1000)::bigint,
 'members',(select jsonb_agg(jsonb_build_object('seat',m.seat,'state',m.state,'revision',m.revision,'is_self',m.user_id=auth.uid(),'host',m.user_id=v_room.owner) order by m.seat) from fc7_members m where m.room_code=p_code),
 'locks',coalesce((select jsonb_agg(jsonb_build_object('player_id',l.player_key,'mine',l.user_id=auth.uid())) from fc7_locks l where l.room_code=p_code),'[]'::jsonb));
end $$;
create or replace function public.fc7_connect(p_code text default null,p_capacity integer default 2,p_name text default '我的七人队')
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_code text;v_room public.fc7_rooms;v_seat integer;v_count integer;v_attempt integer:=0;v_name text;
begin
 if auth.uid() is null then raise exception 'FC7_AUTH'; end if;
 v_name=left(coalesce(nullif(btrim(p_name),''),'我的七人队'),24);
 if p_code is null then
  if p_capacity is null or p_capacity not between 2 and 4 then raise exception 'FC7_CAPACITY'; end if;
  loop
   v_attempt=v_attempt+1;if v_attempt>100 then raise exception 'FC7_CODE_BUSY'; end if;
   select string_agg(substr('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',1+floor(random()*36)::integer,1),'') into v_code from generate_series(1,3);
   insert into fc7_rooms(code,owner,capacity) values(v_code,auth.uid(),p_capacity) on conflict do nothing returning * into v_room;
   if found then exit;end if;
  end loop;
 else
  v_code=upper(btrim(p_code));select * into v_room from fc7_rooms r where r.code=v_code for update;
  if not found then raise exception 'FC7_ROOM_NOT_FOUND'; end if;
 end if;
 if v_room.status='closed' then raise exception 'FC7_ROOM_CLOSED'; end if;
 if exists(select 1 from fc7_members m where m.room_code=v_code and m.user_id=auth.uid()) then return fc7_read(v_code);end if;
 if v_room.status<>'drafting' then raise exception 'FC7_ALREADY_STARTED';end if;
 select count(*) into v_count from fc7_members m where m.room_code=v_code;if v_count>=v_room.capacity then raise exception 'FC7_ROOM_FULL'; end if;
 select seats.candidate into v_seat from generate_series(0,v_room.capacity-1) as seats(candidate) where not exists(select 1 from fc7_members m where m.room_code=v_code and m.seat=seats.candidate) order by seats.candidate limit 1;
 insert into fc7_members(room_code,user_id,seat,state) values(v_code,auth.uid(),v_seat,jsonb_build_object('version',2,'teamName',v_name,'formation','2-3-1','picks',jsonb_build_array(null,null,null,null,null,null,null),'pool',null,'rerolls',3,'phase','waiting','cup',null,'ready',false));
 return fc7_read(v_code);
end $$;
create or replace function public.fc7_action(p_code text,p_action text,p_payload jsonb default '{}'::jsonb,p_revision integer default null,p_request_id uuid default null)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_room public.fc7_rooms;v_member public.fc7_members;v_state jsonb;v_key text;v_slot integer;v_card public.fc_player_catalog;v_country text;v_choices text[];v_used text[];v_keepers boolean;v_outfield boolean;v_now bigint;v_kicks integer;
begin
 if auth.uid() is null then raise exception 'FC7_AUTH'; end if;
 select * into v_room from fc7_rooms r where r.code=p_code for update;
 select * into v_member from fc7_members m where m.room_code=p_code and m.user_id=auth.uid();
 if not found then raise exception 'FC7_NOT_MEMBER';end if;
 if p_action='leave' then
  delete from fc7_members m where m.room_code=p_code and m.user_id=auth.uid();
  if v_room.owner=auth.uid() or v_room.status='playing' then update fc7_rooms set status='closed' where code=p_code;end if;
  return jsonb_build_object('left',true);
 end if;
 if v_room.status='closed' then raise exception 'FC7_ROOM_CLOSED';end if;
 v_now=floor(extract(epoch from clock_timestamp())*1000)::bigint;
 if p_action in ('advance','start_final','kick','finish') then
  if v_room.status<>'playing' then raise exception 'FC7_NOT_READY';end if;
  if p_action='advance' then
   if v_room.cursor<2 and (p_payload->>'expected')::integer=v_room.cursor then update fc7_rooms set cursor=cursor+1 where code=p_code;end if;
  elsif p_action='start_final' then
   if v_room.cursor<>2 then raise exception 'FC7_FINAL_NOT_READY';end if;
   if v_room.final_live is null then update fc7_rooms set final_live=jsonb_build_object('started_at',v_now,'kicks',0) where code=p_code;end if;
  elsif p_action='kick' then
   if v_room.cursor<>2 or v_room.final_live is null then raise exception 'FC7_FINAL_NOT_READY';end if;
   if v_now-(v_room.final_live->>'started_at')::bigint<10667 then raise exception 'FC7_TOO_EARLY';end if;
   v_kicks=(v_room.final_live->>'kicks')::integer;
   if (p_payload->>'expected')::integer=v_kicks and v_kicks<220 then update fc7_rooms set final_live=jsonb_set(final_live,'{kicks}',to_jsonb(v_kicks+1)) where code=p_code;end if;
  elsif p_action='finish' then
   if v_room.final_live is null or v_now-(v_room.final_live->>'started_at')::bigint<8000 then raise exception 'FC7_TOO_EARLY';end if;
   update fc7_rooms set cursor=3 where code=p_code;
  end if;
  return fc7_read(p_code);
 end if;
 if v_room.status<>'drafting' then raise exception 'FC7_ROSTER_LOCKED';end if;
 if p_request_id is not null and p_request_id=v_member.last_request_id then return fc7_read(p_code);end if;
 if p_revision is null or p_revision<>v_member.revision then raise exception 'FC7_STALE';end if;
 v_state=v_member.state;
 if p_action='spin' then
  if v_state->>'phase'='complete' then raise exception 'FC7_ROSTER_LOCKED';end if;
  select coalesce(array_agg(c.identity),array[]::text[]) into v_used from jsonb_array_elements_text(v_state->'picks') id join fc_player_catalog c on c.player_key=id;
  v_keepers=v_state->'picks'->6='null'::jsonb;
  select exists(select 1 from jsonb_array_elements(v_state->'picks') with ordinality as x(player,n) where n<=6 and player='null'::jsonb) into v_outfield;
  if coalesce((p_payload->>'reroll')::boolean,false) then
   if v_state->>'phase'<>'ready' or (v_state->>'rerolls')::integer<=0 then raise exception 'FC7_NO_REROLLS';end if;
   v_state=jsonb_set(v_state,'{rerolls}',to_jsonb((v_state->>'rerolls')::integer-1));
  elsif v_state->>'phase'='ready' then
   if exists(select 1 from fc7_catalog s join fc_player_catalog c on c.player_key=s.player_key where s.country=v_state->>'pool'
    and not(c.identity=any(v_used)) and not exists(select 1 from fc7_locks l where l.room_code=p_code and l.player_key=s.player_key)
    and ((v_keepers and 'GK'=any(c.positions)) or (v_outfield and not('GK'=any(c.positions))))) then raise exception 'FC7_PICK_FIRST';end if;
  elsif v_state->>'phase'<>'waiting' then raise exception 'FC7_PICK_FIRST';end if;
  select array_agg(distinct s.country) into v_choices from fc7_catalog s join fc_player_catalog c on c.player_key=s.player_key
   where not(c.identity=any(v_used)) and not exists(select 1 from fc7_locks l where l.room_code=p_code and l.player_key=s.player_key)
    and ((v_keepers and 'GK'=any(c.positions)) or (v_outfield and not('GK'=any(c.positions))));
  if coalesce(cardinality(v_choices),0)=0 then raise exception 'FC7_NO_PLAYERS';end if;
  if cardinality(v_choices)>1 then v_choices=array_remove(v_choices,v_state->>'pool');end if;
  v_country=v_choices[1+floor(random()*cardinality(v_choices))::integer];
  v_state=v_state||jsonb_build_object('pool',v_country,'phase','ready','ready',false);
 elsif p_action='pick' then
  if v_state->>'phase'<>'ready' then raise exception 'FC7_SPIN_FIRST';end if;
  v_key=p_payload->>'player';v_slot=(p_payload->>'slot')::integer;
  if v_slot is null or v_slot not between 0 and 6 or v_state->'picks'->v_slot<>'null'::jsonb then raise exception 'FC7_SLOT_LOCKED';end if;
  select c.* into v_card from fc7_catalog s join fc_player_catalog c on c.player_key=s.player_key where s.player_key=v_key and s.country=v_state->>'pool';
  if not found then raise exception 'FC7_INVALID_PLAYER';end if;
  if (v_slot=6) is distinct from ('GK'=any(v_card.positions)) then raise exception 'FC7_KEEPER';end if;
  if exists(select 1 from jsonb_array_elements_text(v_state->'picks') id join fc_player_catalog c on c.player_key=id where c.identity=v_card.identity) then raise exception 'FC7_DUPLICATE';end if;
  if exists(select 1 from fc7_locks l where l.room_code=p_code and l.player_key=v_key) then raise exception 'FC7_PLAYER_LOCKED';end if;
  insert into fc7_locks(room_code,player_key,user_id) values(p_code,v_key,auth.uid());
  v_state=jsonb_set(v_state,array['picks',v_slot::text],to_jsonb(v_key))||jsonb_build_object('pool',null,'phase','waiting','ready',false);
  if not exists(select 1 from jsonb_array_elements(v_state->'picks') p where p='null'::jsonb) then v_state=jsonb_set(v_state,'{phase}','"complete"'::jsonb);end if;
 elsif p_action='formation' then
  if not coalesce(p_payload->>'formation'=any(array['2-3-1','3-2-1','2-2-2','3-1-2']),false) then raise exception 'FC7_FORMATION';end if;
  v_state=v_state||jsonb_build_object('formation',p_payload->>'formation','ready',false);
 elsif p_action='ready' then
  if v_state->>'phase'<>'complete' then raise exception 'FC7_NOT_READY';end if;
  v_state=jsonb_set(v_state,'{ready}','true'::jsonb);
 else raise exception 'FC7_ACTION';
 end if;
 update fc7_members set state=v_state,revision=revision+1,last_request_id=p_request_id where room_code=p_code and user_id=auth.uid();
 if p_action='ready' and (select count(*) from fc7_members m where m.room_code=p_code)=v_room.capacity and not exists(select 1 from fc7_members m where m.room_code=p_code and m.state->>'ready' is distinct from 'true') then
  update fc7_rooms set status='playing',seed=floor(random()*2147483647)::bigint where code=p_code;
 end if;
 return fc7_read(p_code);
end $$;
revoke all on function public.fc7_protocol(),public.fc7_read(text),public.fc7_connect(text,integer,text),public.fc7_action(text,text,jsonb,integer,uuid) from public,anon;
grant execute on function public.fc7_protocol(),public.fc7_read(text),public.fc7_connect(text,integer,text),public.fc7_action(text,text,jsonb,integer,uuid) to authenticated;
notify pgrst, 'reload schema';
commit;
