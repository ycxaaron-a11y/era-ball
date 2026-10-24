// Optional integration suite: run against real PostgreSQL SQL semantics in PGlite.
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createTestDatabase} from './database-harness.mjs';
import {pools,freshState,startDraft,spinDraft,pickPlayer,networkState,positions,playerAbility} from '../data.js';
const {db,rpc,addUser,migration}=await createTestDatabase();
try{
 const a=randomUUID(),b=randomUUID(),outsider=randomUUID();for(const uid of [a,b,outsider])await addUser(uid);
 async function room(mode='world_cup'){
  const r=await rpc(a,'fc_connect_v3',[null,mode]);await rpc(b,'fc_connect_v3',[r.code,mode]);
  const states=[startDraft(freshState(mode),'2020s',[]),startDraft(freshState(mode),'2020s',[])];
  for(let i=0;i<2;i++)await rpc([a,b][i],'fc_submit_v3',[r.code,networkState(states[i]),0,randomUUID()]);
  return {code:r.code,states,revisions:[1,1]};
 }
 async function write(r,i,next,id=randomUUID()){
  const result=await rpc([a,b][i],'fc_submit_v3',[r.code,networkState(next),r.revisions[i],id]);r.revisions[i]=result.revision;r.states[i]=next;return result;
 }
 const expanded=await room('ucl'),expandedPool=pools.find(p=>p.id==='ucl-real-madrid-2024'),vini=expandedPool.players.find(p=>p.identity==='vinicius-junior');assert.equal((await rpc(a,'fc_protocol_v3',[])).catalog_count,1550);await write(expanded,0,pickPlayer({...expanded.states[0],pool:expandedPool.id,drawPhase:'ready'},vini.id,7));const newStored=(await rpc(a,'fc_read_v3',[expanded.code])).members.find(m=>m.is_self).state;assert.equal(newStored.picks[7].baseRating,99);assert.equal(newStored.picks[7].rating,87);assert.match(newStored.picks[7].name,/维尼修斯/);console.log('PASS SQL: full fresh setup loads 1550 versions; new Vinicius claim recomputed from 99 to 87 at CB');
 const r=await room(),pool=pools.find(p=>p.id==='wc-brazil-1970'),pele=pool.players.find(p=>p.identity==='pele');
 const proposals=r.states.map(s=>pickPlayer({...s,pool:pool.id,drawPhase:'ready'},pele.id,0));
 const requestId=randomUUID();
 const race=await Promise.allSettled([
  rpc(a,'fc_submit_v3',[r.code,networkState(proposals[0]),1,requestId]),
  rpc(b,'fc_submit_v3',[r.code,networkState(proposals[1]),1,randomUUID()])]);
 assert.equal(race.filter(x=>x.status==='fulfilled').length,1);assert.equal(race.filter(x=>x.status==='rejected'&&x.reason.message.includes('FC_PLAYER_LOCKED')).length,1);
 r.states[0]=proposals[0];r.revisions[0]=2;
 const replay=await rpc(a,'fc_submit_v3',[r.code,networkState(proposals[0]),1,requestId]);assert.equal(replay.replayed,true);assert.equal(replay.revision,2);
 assert.equal((await rpc(a,'fc_read_v3',[r.code])).locks.length,1);
 console.log('PASS SQL: same-version competing writes have one winner; idempotent replay creates no extra pick/lock');
 const otherPool=pools.find(p=>p.id==='wc-brazil-1962'),other=otherPool.players.find(p=>p.identity==='pele');
 await write(r,1,pickPlayer({...r.states[1],pool:otherPool.id,drawPhase:'ready'},other.id,0));
 assert.equal((await rpc(a,'fc_read_v3',[r.code])).locks.length,2);
 await assert.rejects(rpc(outsider,'fc_read_v3',[r.code]),/Not a member/);
 await assert.rejects(rpc(outsider,'fc_submit_v3',[r.code,networkState(r.states[0]),0,randomUUID()]),/Not a member/);
 await assert.rejects(rpc(a,'fc_connect',[r.code,'world_cup']),/FC_RULES_MISMATCH/);
 await assert.rejects(rpc(a,'fc_submit',[r.code,networkState(r.states[0])]),/FC_RULES_V3_REQUIRED/);
 await assert.rejects(rpc(a,'fc_submit_v3',[r.code,networkState(r.states[0]),0,randomUUID()]),/FC_STALE_STATE/);
 const removed={...r.states[0],picks:Array(16).fill(null)};await write(r,0,removed);
 assert.ok(!(await rpc(a,'fc_read_v3',[r.code])).locks.some(l=>l.player_id===pele.id));
 console.log('PASS SQL: different-era same person permitted, removal releases lock, nonmembers/stale writes/old-client bypass rejected');
 const club=await room('ucl');
 for(const [i,id] of ['ucl-ajax-1995','ucl-milan-2007'].entries()){
  const p=pools.find(p=>p.id===id),person=p.players.find(x=>x.identity==='clarence-seedorf');
  assert.ok(person);await write(club,i,pickPlayer({...club.states[i],pool:p.id,drawPhase:'ready'},person.id,0));
 }
 assert.equal((await rpc(a,'fc_read_v3',[club.code])).locks.length,2);
 console.log('PASS SQL: different clubs of the same person remain independently selectable');
 const chem=await room('ucl'),madrid=pools.find(p=>p.id==='ucl-real-madrid-2017');
 for(const [slot,identity] of [[0,'cristiano-ronaldo'],[2,'gareth-bale'],[1,'karim-benzema']]){
  const person=madrid.players.find(p=>p.identity===identity),next=pickPlayer({...chem.states[0],pool:madrid.id,drawPhase:'ready'},person.id,slot);
  const tampered=networkState(next);for(const p of tampered.picks.filter(Boolean))p.rating=1;
  const reply=await rpc(a,'fc_submit_v3',[chem.code,tampered,chem.revisions[0],randomUUID()]);chem.revisions[0]=reply.revision;chem.states[0]=next;
 }
 const stored=(await rpc(a,'fc_read_v3',[chem.code])).members.find(m=>m.is_self).state;
 for(let i=0;i<11;i++)if(chem.states[0].picks[i])assert.equal(stored.picks[i].rating,playerAbility(chem.states[0],chem.states[0].picks[i],positions(chem.states[0].formation)[i]));
 console.log('PASS SQL: server recomputes chemistry, cap, positions and ratings; ignores tampered client scores');
 const final=await room('ucl');final.states[0].formation='4-2-3-1';final.states[1].formation='4-3-3-attacking';
 for(let slot=0;slot<16;slot++)for(let i=0;i<2;i++){
  const read=await rpc([a,b][i],'fc_read_v3',[final.code]),blocked=read.locks.filter(l=>!l.mine).map(l=>l.player_id);
  const ready=spinDraft(final.states[i],()=>0,blocked),person=pools.find(p=>p.id===ready.pool).players.find(p=>!blocked.includes(p.id)&&!ready.picks.some(x=>x?.identity===p.identity));
  await write(final,i,pickPlayer(ready,person.id,slot,Math.random,blocked));
 }
 const x=await rpc(a,'fc_read_v3',[final.code]),y=await rpc(b,'fc_read_v3',[final.code]);assert.ok(x.result);assert.deepEqual(x.result,y.result);const attacking=x.members.find(m=>m.state.lineupFormation==='4-3-3-attacking').state;assert.equal(attacking.lineupFormation,'4-3-3-attacking');for(let i=0;i<11;i++)assert.equal(attacking.picks[i].rating,playerAbility(final.states[1],final.states[1].picks[i],positions('4-3-3-attacking')[i]));
 await db.exec(migration);assert.deepEqual((await rpc(a,'fc_read_v3',[final.code])).result,x.result);
 const initialSeason=await rpc(a,'fc_season_v4',[final.code,null]);assert.equal(initialSeason.cursor,0);await assert.rejects(rpc(outsider,'fc_season_v4',[final.code,null]),/Not a member/);await assert.rejects(rpc(a,'fc_season_v4',[r.code,null]),/FC_SEASON_WAITING/);const advanced=await Promise.all([rpc(a,'fc_season_v4',[final.code,0]),rpc(b,'fc_season_v4',[final.code,0])]);assert.equal(advanced[0].cursor,1);assert.equal(advanced[1].cursor,1);for(let i=1;i<6;i++)await rpc(a,'fc_season_v4',[final.code,i]);const complete=await rpc(b,'fc_season_v4',[final.code,6]);assert.equal(complete.cursor,6);assert.equal(complete.seed,initialSeason.seed);await db.exec(migration);assert.deepEqual(await rpc(a,'fc_season_v4',[final.code,null]),complete);console.log('PASS SQL: shared immutable season seed, atomic round advancement, permissions, completion cap and migration rerun');
 await db.query("update fc_rooms set season_v4=jsonb_set(season_v4,'{cursor}','5'::jsonb) where code=$1",[final.code]);
 await assert.rejects(rpc(outsider,'fc_final_v5',[final.code,'read',null]),/Not a member/);
 const starts=await Promise.all([rpc(a,'fc_final_v5',[final.code,'start',null]),rpc(b,'fc_final_v5',[final.code,'start',null])]);assert.equal(starts[0].live.started_at,starts[1].live.started_at);await assert.rejects(rpc(a,'fc_final_v5',[final.code,'kick',0]),/FC_FINAL_TOO_EARLY/);await assert.rejects(rpc(a,'fc_final_v5',[final.code,'finish',null]),/FC_FINAL_TOO_EARLY/);
 await db.query("update fc_rooms set final_v5=jsonb_set(final_v5,'{started_at}',to_jsonb(floor(extract(epoch from clock_timestamp())*1000-12000)::bigint)) where code=$1",[final.code]);
 const kicks=await Promise.all([rpc(a,'fc_final_v5',[final.code,'kick',0]),rpc(b,'fc_final_v5',[final.code,'kick',0])]);assert.equal(kicks[0].live.kicks,1);assert.equal(kicks[1].live.kicks,1);await rpc(a,'fc_final_v5',[final.code,'finish',null]);assert.equal((await rpc(b,'fc_final_v5',[final.code,'read',null])).live.completed,true);assert.equal((await rpc(b,'fc_season_v4',[final.code,null])).cursor,6);await db.exec(migration);assert.equal((await rpc(a,'fc_final_v5',[final.code,'read',null])).live.kicks,1);console.log('PASS SQL: immutable final start clock, early actions rejected, atomic shared kick clicks, completion and safe rerun');
 console.log('PASS SQL: full16-vs16 draft, CAM formations, identical persistent final and safe migration rerun');
}finally{await db.close()}
