import assert from 'node:assert/strict';import {randomUUID} from 'node:crypto';
import {createTestDatabase} from './database-harness.mjs';
import {sevenCardById,sevenPoolById,sevenPositions,sevenPlayers,sevenAbility,sevenRoomState,sevenFinalFrame,sevenFinalTournament,startSevenCup,nextSevenRound} from '../seven-a-side.js';
const {db,rpc,addUser,migration}=await createTestDatabase();
try{
 const users=Array.from({length:5},()=>randomUUID());for(const uid of users)await addUser(uid);const [a,b,c,d,outsider]=users;
 assert.equal((await rpc(a,'fc7_protocol',[])).catalog_count,sevenCardById.size);
 const created=await rpc(a,'fc7_connect',[null,2,'七人房主']),code=created.code;assert.match(code,/^[A-Z0-9]{3}$/);assert.equal(created.members[0].seat,0);
 const joined=await rpc(b,'fc7_connect',[code,2,'七人朋友']);assert.deepEqual(joined.members.map(m=>m.seat),[0,1]);assert.equal((await rpc(b,'fc7_connect',[code,2,'重复加入'])).members.length,2);
 await assert.rejects(rpc(c,'fc7_connect',[code,2,'第三人']),/FC7_ROOM_FULL/);await assert.rejects(rpc(outsider,'fc7_read',[code]),/FC7_NOT_MEMBER/);
 const action=(uid,verb,payload={},revision=null,id=randomUUID())=>rpc(uid,'fc7_action',[code,verb,payload,revision,id]);
 // Controlled legal draws exercise cross-era versions and exact-version races.
 await db.query("update fc7_members set state=state||'{\"pool\":\"巴西\",\"phase\":\"ready\"}'::jsonb where room_code=$1",[code]);
 const pele=sevenPoolById.get('巴西').players.find(p=>p.identity==='pele'),otherPele=sevenPoolById.get('巴西').players.find(p=>p.identity==='pele'&&p.id!==pele.id),requestId=randomUUID();
 await action(a,'pick',{player:pele.id,slot:0,rating:999},0,requestId);assert.equal((await action(a,'pick',{player:pele.id,slot:0},0,requestId)).members.find(m=>m.is_self).revision,1);
 await assert.rejects(action(b,'pick',{player:pele.id,slot:0},0),/FC7_PLAYER_LOCKED/);await action(b,'pick',{player:otherPele.id,slot:0},0);
 await assert.rejects(action(a,'formation',{formation:'4-3-3'},1),/FC7_FORMATION/);await action(a,'formation',{formation:'3-1-2'},1);
 await db.query("update fc7_members set state=state||'{\"pool\":\"巴西\",\"phase\":\"ready\"}'::jsonb where room_code=$1 and user_id=$2",[code,a]);
 await assert.rejects(action(a,'pick',{player:otherPele.id,slot:1},2),/FC7_DUPLICATE/);
 const keeper=sevenPoolById.get('巴西').players.find(p=>p.positions.includes('GK'));await assert.rejects(action(a,'pick',{player:keeper.id,slot:1},2),/FC7_KEEPER/);
 const outside=sevenPoolById.get('阿根廷').players[0];await assert.rejects(action(a,'pick',{player:outside.id,slot:2},2),/FC7_INVALID_PLAYER/);
 console.log('PASS seven SQL: member-only read, 3-char rooms, capacity/seats, idempotency, exact-version locks, cross-era same person across rivals, GK/duplicate/country validation');
 for(const uid of [a,b]){
  for(let n=1;n<7;n++){
   let snapshot=await rpc(uid,'fc7_read',[code]),mine=snapshot.members.find(m=>m.is_self),state=mine.state;
   if(state.phase!=='ready'){snapshot=await action(uid,'spin',{},mine.revision);mine=snapshot.members.find(m=>m.is_self);state=mine.state;}
   const pool=sevenPoolById.get(state.pool),used=new Set(sevenPlayers(state).filter(Boolean).map(p=>p.identity)),blocked=new Set(snapshot.locks.filter(l=>!l.mine).map(l=>l.player_id)),options=[];
   for(const [i,pos] of sevenPositions(state.formation).entries())if(!state.picks[i])for(const p of pool.players)if(!used.has(p.identity)&&!blocked.has(p.id)&&(pos==='GK')===p.positions.includes('GK'))options.push({p,i,r:sevenAbility(state,p,pos)});
   const selected=options.sort((a,b)=>b.r-a.r)[0];assert.ok(selected);await action(uid,'pick',{player:selected.p.id,slot:selected.i},mine.revision);
  }
 }
 let snapshot=await rpc(a,'fc7_read',[code]);await action(a,'ready',{},snapshot.members.find(m=>m.is_self).revision);assert.equal((await rpc(a,'fc7_read',[code])).status,'drafting');snapshot=await rpc(b,'fc7_read',[code]);await action(b,'ready',{},snapshot.members.find(m=>m.is_self).revision);
 snapshot=await rpc(a,'fc7_read',[code]);assert.equal(snapshot.status,'playing');assert.equal(snapshot.members.length,2);assert.ok(Number.isInteger(snapshot.seed));assert.deepEqual(sevenRoomState(snapshot).cup,sevenRoomState(await rpc(b,'fc7_read',[code])).cup);
 const cup=sevenRoomState(snapshot).cup;assert.equal(cup.teams[0].id,'human-0');assert.equal(cup.teams[4].id,'human-1');
 await assert.rejects(action(a,'formation',{formation:'2-2-2'},999),/FC7_ROSTER_LOCKED/);
 await Promise.all([action(a,'advance',{expected:0}),action(b,'advance',{expected:0})]);assert.equal((await rpc(a,'fc7_read',[code])).cursor,1);await action(a,'advance',{expected:1});assert.equal((await rpc(a,'fc7_read',[code])).cursor,2);
 await action(a,'start_final');const start=(await rpc(a,'fc7_read',[code])).final_live.started_at;await action(b,'start_final');assert.equal((await rpc(a,'fc7_read',[code])).final_live.started_at,start);
 await assert.rejects(action(a,'kick',{expected:0}),/FC7_TOO_EARLY/);await assert.rejects(action(a,'finish'),/FC7_TOO_EARLY/);
 await db.query("update fc7_rooms set final_live=jsonb_set(final_live,'{started_at}',to_jsonb((floor(extract(epoch from clock_timestamp())*1000)-12000)::bigint)) where code=$1",[code]);
 await Promise.all([action(a,'kick',{expected:0}),action(b,'kick',{expected:0})]);snapshot=await rpc(a,'fc7_read',[code]);assert.equal(snapshot.final_live.kicks,1);
 const final=sevenRoomState(snapshot).cup.finalTournament.phases[5].matches[0];for(let k=1;k<final.shootout.length;k++)await action(a,'kick',{expected:k});
 await action(a,'finish');snapshot=await rpc(a,'fc7_read',[code]);assert.equal(snapshot.cursor,3);const first=sevenRoomState(snapshot),second=sevenRoomState(await rpc(b,'fc7_read',[code]));assert.deepEqual(first.cup,second.cup);assert.ok(first.cup.champion);await action(a,'advance',{expected:3});assert.equal((await rpc(a,'fc7_read',[code])).cursor,3);
 await db.exec(migration);assert.equal((await rpc(a,'fc7_read',[code])).cursor,3);
 console.log('PASS seven SQL: all-ready starts one shared seed, opposite halves, same bracket/results, atomic advancement, immutable final clock, early-action rejection, kick CAS, finish and migration rerun');
 const exhausted=await rpc(a,'fc7_connect',[null,2,'重转测试']);let draw=await rpc(a,'fc7_action',[exhausted.code,'spin',{},0,randomUUID()]);
 for(let n=0;n<3;n++){const mine=draw.members.find(m=>m.is_self);draw=await rpc(a,'fc7_action',[exhausted.code,'spin',{reroll:true},mine.revision,randomUUID()]);}
 let me=draw.members.find(m=>m.is_self);assert.equal(me.state.rerolls,0);await assert.rejects(rpc(a,'fc7_action',[exhausted.code,'spin',{reroll:true},me.revision,randomUUID()]),/FC7_NO_REROLLS/);await assert.rejects(rpc(a,'fc7_action',[exhausted.code,'spin',{},me.revision,randomUUID()]),/FC7_PICK_FIRST/);
 await db.query('insert into fc7_locks(room_code,player_key,user_id) select $1,player_key,$2::uuid from fc7_catalog where country=$3',[exhausted.code,a,me.state.pool]);
 const free=await rpc(a,'fc7_action',[exhausted.code,'spin',{},me.revision,randomUUID()]);assert.notEqual(free.members.find(m=>m.is_self).state.pool,me.state.pool);assert.equal(free.members.find(m=>m.is_self).state.rerolls,0);
 await action(b,'leave');assert.equal((await rpc(a,'fc7_read',[code])).status,'closed');
 await db.exec('set role authenticated');try{await assert.rejects(db.query('select * from fc7_members'),/permission denied/);}finally{await db.exec('reset role');}
 console.log('PASS seven SQL: three-reroll limit, only exhausted pools get a free replacement, participant leave closes active cup, direct table access denied');
 for(const capacity of [3,4]){let room=await rpc(a,'fc7_connect',[null,capacity,'多人七人杯']);for(const uid of users.slice(1,capacity))room=await rpc(uid,'fc7_connect',[room.code,2,'朋友']);assert.equal(room.members.length,capacity);assert.equal(new Set(room.members.map(m=>m.seat)).size,capacity);}
 console.log('PASS seven SQL: 3- and 4-player room membership/seat capacity');
}finally{await db.close();}
