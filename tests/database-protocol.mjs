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
 const final=await room('ucl');final.states[0].formation='4-2-3-1';final.states[1].formation='3-4-1-2';
 for(let slot=0;slot<16;slot++)for(let i=0;i<2;i++){
  const read=await rpc([a,b][i],'fc_read_v3',[final.code]),blocked=read.locks.filter(l=>!l.mine).map(l=>l.player_id);
  const ready=spinDraft(final.states[i],()=>0,blocked),person=pools.find(p=>p.id===ready.pool).players.find(p=>!blocked.includes(p.id)&&!ready.picks.some(x=>x?.identity===p.identity));
  await write(final,i,pickPlayer(ready,person.id,slot,Math.random,blocked));
 }
 const x=await rpc(a,'fc_read_v3',[final.code]),y=await rpc(b,'fc_read_v3',[final.code]);assert.ok(x.result);assert.deepEqual(x.result,y.result);
 await db.exec(migration);assert.deepEqual((await rpc(a,'fc_read_v3',[final.code])).result,x.result);
 console.log('PASS SQL: full16-vs16 draft, CAM formations, identical persistent final and safe migration rerun');
}finally{await db.close()}
