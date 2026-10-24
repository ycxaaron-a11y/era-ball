// Optional integration suite: run against real PostgreSQL SQL semantics in PGlite.
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createTestDatabase} from './database-harness.mjs';
import {pools,freshState,startDraft,spinDraft,pickPlayer,networkState,positions,playerAbility} from '../data.js';
const {db,rpc,addUser,migration}=await createTestDatabase();
try{
 await db.exec("insert into fc_chemistry_pairs(id,left_identity,right_identity,bonus) values('milan-balance','andrea-pirlo','gennaro-gattuso',2);update fc_chemistry_trios set bonus_mode='percent' where id='dutch-three';");await db.exec(migration);assert.equal((await db.query("select count(*)::integer as n from fc_chemistry_pairs where id='milan-balance'")).rows[0].n,0);assert.equal((await db.query("select bonus_mode from fc_chemistry_trios where id='dutch-three'")).rows[0].bonus_mode,'flat');
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
 const expanded=await room('ucl'),expandedPool=pools.find(p=>p.id==='ucl-real-madrid-2024'),vini=expandedPool.players.find(p=>p.identity==='vinicius-junior');assert.equal((await rpc(a,'fc_protocol_v3',[])).catalog_count,2260);await write(expanded,0,pickPlayer({...expanded.states[0],pool:expandedPool.id,drawPhase:'ready'},vini.id,7));const newStored=(await rpc(a,'fc_read_v3',[expanded.code])).members.find(m=>m.is_self).state;assert.equal(newStored.picks[7].baseRating,105);assert.equal(newStored.picks[7].rating,93);assert.match(newStored.picks[7].name,/维尼修斯/);console.log('PASS SQL: full fresh setup loads 2260 versions; new Vinicius claim recomputed from 105 to 93 at CB');
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
 assert.equal(stored.picks[2].rating,100);assert.equal((await rpc(a,'fc_protocol_v3',[])).chemistry_version,4);assert.equal((await rpc(a,'fc_protocol_v3',[])).rating_version,8);
 const benched={...chem.states[0],picks:[...chem.states[0].picks]};benched.picks[11]=benched.picks[1];benched.picks[1]=null;await write(chem,0,benched);const withoutTrio=(await rpc(a,'fc_read_v3',[chem.code])).members.find(m=>m.is_self).state;assert.equal(withoutTrio.picks[2].rating,100);assert.equal(withoutTrio.picks[11].rating,102);const removedPartner={...benched,picks:[...benched.picks]};removedPartner.picks[11]=null;await write(chem,0,removedPartner);assert.equal((await rpc(a,'fc_read_v3',[chem.code])).members.find(m=>m.is_self).state.picks[2].rating,97);
 for(const [poolId,combination] of [['ucl-barcelona-2015',[[2,'lionel-messi'],[0,'neymar'],[1,'luis-suarez']]],['ucl-milan-1989',[[3,'ruud-gullit'],[1,'marco-van-basten'],[4,'frank-rijkaard']]]]){
  const r=await room('ucl'),source=pools.find(p=>p.id===poolId);for(const [slot,id] of combination){const person=source.players.find(p=>p.identity===id);await write(r,0,pickPlayer({...r.states[0],pool:source.id,drawPhase:'ready'},person.id,slot));}
  const canonical=(await rpc(a,'fc_read_v3',[r.code])).members.find(m=>m.is_self).state;for(const [slot] of combination)assert.equal(canonical.picks[slot].rating,playerAbility(r.states[0],r.states[0].picks[slot],positions(r.states[0].formation)[slot]));if(poolId==='ucl-barcelona-2015')assert.equal(canonical.picks[2].rating,115);
  const reserve={...r.states[0],picks:[...r.states[0].picks]};for(const [i,[slot]] of combination.entries()){reserve.picks[11+i]=reserve.picks[slot];reserve.picks[slot]=null;}await write(r,0,reserve);const benchState=(await rpc(a,'fc_read_v3',[r.code])).members.find(m=>m.is_self).state;for(let i=11;i<14;i++)assert.equal(benchState.picks[i].rating,playerAbility(reserve,reserve.picks[i],'SUB'));
  const wrong={...reserve,picks:[...reserve.picks]};wrong.picks[10]=wrong.picks[11];wrong.picks[11]=null;await write(r,0,wrong);const wrongState=(await rpc(a,'fc_read_v3',[r.code])).members.find(m=>m.is_self).state;assert.equal(wrongState.picks[10].rating,playerAbility(wrong,wrong.picks[10],'GK'));for(let i=12;i<14;i++)assert.equal(wrongState.picks[i].rating,playerAbility(wrong,wrong.picks[i],'SUB'));

 }
 const crossClub=await room('ucl');for(const [poolId,identity,slot] of [['ucl-psg-2020','neymar',11],['ucl-barcelona-2015','lionel-messi',10],['ucl-barcelona-2015','luis-suarez',12]]){const source=pools.find(p=>p.id===poolId),person=source.players.find(p=>p.identity===identity);await write(crossClub,0,pickPlayer({...crossClub.states[0],pool:source.id,drawPhase:'ready'},person.id,slot));}const crossStored=(await rpc(a,'fc_read_v3',[crossClub.code])).members.find(m=>m.is_self).state;for(const [slot,pos] of [[11,'SUB'],[10,'GK'],[12,'SUB']])assert.equal(crossStored.picks[slot].rating,playerAbility(crossClub.states[0],crossClub.states[0].picks[slot],pos));assert.equal(crossStored.picks[11].rating,crossStored.picks[11].baseRating+5);
 const retired=await room('ucl'),milan=pools.find(p=>p.id==='ucl-milan-2007');for(const [identity,slot] of [['andrea-pirlo',11],['gennaro-gattuso',12]]){const person=milan.players.find(p=>p.identity===identity);await write(retired,0,pickPlayer({...retired.states[0],pool:milan.id,drawPhase:'ready'},person.id,slot));}const retiredState=(await rpc(a,'fc_read_v3',[retired.code])).members.find(m=>m.is_self).state;for(const slot of [11,12])assert.equal(retiredState.picks[slot].rating,retiredState.picks[slot].baseRating);console.log('PASS SQL: cross-club MSN activates by identity, deleted Pirlo/Gattuso pair stays inactive after upgrade');
 const defense=await room('ucl'),liverpool=pools.find(p=>p.id==='ucl-liverpool-2019'),vvd=liverpool.players.find(p=>p.identity==='virgil-van-dijk');await write(defense,0,pickPlayer({...defense.states[0],pool:liverpool.id,drawPhase:'ready'},vvd.id,7));assert.equal((await rpc(a,'fc_read_v3',[defense.code])).members.find(m=>m.is_self).state.picks[7].rating,105);console.log('PASS SQL: defensive 105 ratings, BBC/MSN +5, Dutch +5, max-with-pairs and bench activation match client');
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
