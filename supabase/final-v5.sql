-- Shared final clock and atomic, one-click-per-kick shootout progression.
begin;
alter table public.fc_rooms add column if not exists final_v5 jsonb;
create or replace function public.fc_final_v5(p_code text,p_action text default 'read',p_expected integer default null)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare r public.fc_rooms; now_ms bigint; elapsed bigint; shots integer;
begin
 if auth.uid() is null or not exists(select 1 from fc_members where room_code=p_code and user_id=auth.uid()) then raise exception 'Not a member'; end if;
 select * into r from fc_rooms where code=p_code for update;
 if r.rules_version<>3 then raise exception 'FC_RULES_MISMATCH'; end if;
 if coalesce((r.season_v4->>'cursor')::integer,0)<5 then raise exception 'FC_FINAL_NOT_READY'; end if;
 if p_action not in ('read','start','kick','finish') then raise exception 'FC_FINAL_ACTION'; end if;
 now_ms=floor(extract(epoch from clock_timestamp())*1000)::bigint;
 if p_action='start' and r.final_v5 is null and (r.season_v4->>'cursor')::integer=5 then
  r.final_v5=jsonb_build_object('started_at',now_ms,'kicks',0,'completed',false);
 end if;
 if p_action in ('kick','finish') then
  if r.final_v5 is null then raise exception 'FC_FINAL_NOT_STARTED'; end if;
  elapsed=now_ms-(r.final_v5->>'started_at')::bigint;
  shots=(r.final_v5->>'kicks')::integer;
  if p_action='kick' and not (r.final_v5->>'completed')::boolean then
   if elapsed<10667 then raise exception 'FC_FINAL_TOO_EARLY'; end if;
   if p_expected=shots and shots<220 then r.final_v5=jsonb_set(r.final_v5,'{kicks}',to_jsonb(shots+1)); end if;
  elsif p_action='finish' then
   if elapsed<8000 then raise exception 'FC_FINAL_TOO_EARLY'; end if;
   r.final_v5=jsonb_set(r.final_v5,'{completed}','true'::jsonb);
   r.season_v4=jsonb_set(r.season_v4,'{cursor}','6'::jsonb);
  end if;
 end if;
 update fc_rooms set final_v5=r.final_v5,season_v4=r.season_v4 where code=p_code;
 return jsonb_build_object('live',r.final_v5,'server_now',now_ms);
end $$;
revoke all on function public.fc_final_v5(text,text,integer) from public,anon;
grant execute on function public.fc_final_v5(text,text,integer) to authenticated;
notify pgrst, 'reload schema';
commit;
