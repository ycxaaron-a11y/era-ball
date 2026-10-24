import { readFileSync, writeFileSync } from 'node:fs';
import { pools, eras } from '../data.js';
import { chemistryPairs } from '../chemistry.js';
const q = x => `'${String(x).replaceAll("'", "''")}'`;
const players = pools.flatMap(pool=>pool.players.map(p=>`(${[p.id,p.identity,pool.mode,pool.id,pool.eraId].map(q).join(',')},${p.year},${q(p.name)},${p.rating},ARRAY[${p.positions.map(q).join(',')}],${q(p.profile)})`));
const catalog = `insert into public.fc_player_catalog(player_key,identity,mode,pool_id,era_id,year,name,base_rating,positions,profile) values\n${players.join(',\n')}\non conflict(player_key) do update set identity=excluded.identity,mode=excluded.mode,pool_id=excluded.pool_id,era_id=excluded.era_id,year=excluded.year,name=excluded.name,base_rating=excluded.base_rating,positions=excluded.positions,profile=excluded.profile;\n`+
`insert into public.fc_era_catalog(id,from_year,to_year) values ${eras.map(e=>`(${q(e.id)},${e.from},${e.to})`).join(',')} on conflict(id) do update set from_year=excluded.from_year,to_year=excluded.to_year;\n`+
`insert into public.fc_chemistry_pairs(id,left_identity,right_identity,bonus) values ${chemistryPairs.map(p=>`(${q(p.id)},${q(p.players[0])},${q(p.players[1])},${p.bonus})`).join(',')} on conflict(id) do update set left_identity=excluded.left_identity,right_identity=excluded.right_identity,bonus=excluded.bonus;`;
const original = readFileSync(new URL('../supabase/multiplayer.sql',import.meta.url),'utf8');
const legacy = original.slice(original.indexOf('create or replace function public.fc_submit('),original.indexOf('revoke all on function')).replace('select * into r from fc_rooms where code=p_code for update;', "select * into r from fc_rooms where code=p_code for update;\n if r.rules_version=3 then raise exception 'FC_RULES_V3_REQUIRED'; end if;");
const template=readFileSync(new URL('../supabase/upgrade-spin-locks.template.sql',import.meta.url),'utf8');
writeFileSync(new URL('../supabase/upgrade-spin-locks.sql',import.meta.url),template.replace('-- @CATALOG@',()=>catalog).replace('-- @LEGACY_SUBMIT@',()=>legacy));
console.log(`Built protocol 3 migration: ${players.length} player versions, ${chemistryPairs.length} chemistry pairs.`);

const root=new URL('../supabase/',import.meta.url);
writeFileSync(new URL('upgrade-all-v4.sql',root),readFileSync(new URL('upgrade-spin-locks.sql',root),'utf8')+'\n'+readFileSync(new URL('season-v4.sql',root),'utf8'));

writeFileSync(new URL('upgrade-all-v5.sql',root),readFileSync(new URL('upgrade-all-v4.sql',root),'utf8')+'\n'+readFileSync(new URL('final-v5.sql',root),'utf8'));
