-- Requires protocol 3. Included automatically in upgrade-all-v4.sql.
begin;
alter table public.fc_rooms add column if not exists season_v4 jsonb;
create or replace function public.fc_season_v4(p_code text,p_expected integer default null)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare r public.fc_rooms; n integer; cursor_value integer;
begin
 if auth.uid() is null or not exists(select 1 from fc_members where room_code=p_code and user_id=auth.uid()) then raise exception 'Not a member'; end if;
 select * into r from fc_rooms where code=p_code for update;
 if r.rules_version<>3 then raise exception 'FC_RULES_MISMATCH'; end if;
 select count(*) into n from fc_members where room_code=p_code and jsonb_array_length(state->'picks')=16 and not exists(select 1 from jsonb_array_elements(state->'picks') p where p='null'::jsonb);
 if n<>2 then raise exception 'FC_SEASON_WAITING'; end if;
 if r.season_v4 is null then
  r.season_v4=jsonb_build_object('version',4,'seed',floor(random()*2147483647)::bigint,'cursor',0);
 end if;
 cursor_value=(r.season_v4->>'cursor')::integer;
 if p_expected is not null and p_expected=cursor_value and cursor_value<6 then
  r.season_v4=jsonb_set(r.season_v4,'{cursor}',to_jsonb(cursor_value+1));
 end if;
 update fc_rooms set season_v4=r.season_v4 where code=p_code;
 return r.season_v4;
end $$;
revoke all on function public.fc_season_v4(text,integer) from public,anon;
grant execute on function public.fc_season_v4(text,integer) to authenticated;
notify pgrst, 'reload schema';
commit;
