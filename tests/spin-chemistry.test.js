import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,startDraft,spinDraft,pickPlayer,pools,poolById,reroll,hydrateState,playerAbility,playerTier,networkState,strength,availablePools} from '../data.js';
import {selectCandidate} from '../placement.js';
import {activeChemistry,chemistryBonus,chemistryPairs} from '../chemistry.js';

test('starting a draft waits for manual Spin and never reveals a pool automatically',()=>{
 const waiting=startDraft(freshState(),'2020s',[]);
 assert.equal(waiting.drawPhase,'awaiting');assert.equal(waiting.pool,null);
 assert.equal(waiting.rerolls,3);assert.equal(hydrateState(waiting).started,true);
 assert.throws(()=>selectCandidate(waiting,pools[0].players[0].id));
 const ready=spinDraft(waiting,()=>0);assert.equal(ready.drawPhase,'ready');assert.ok(poolById(ready.pool));assert.equal(ready.rerolls,3);
 assert.throws(()=>spinDraft(ready));
});
test('a confirmed pick hides candidates and waits for the next Spin without secretly drawing the next pool',()=>{
 let state=spinDraft(startDraft(freshState(),'2020s',[]),()=>0);
 const pool=state.pool, player=poolById(pool).players[0];state=pickPlayer(state,player.id,0);
 assert.equal(state.pool,pool);assert.equal(state.drawPhase,'awaiting');assert.equal(state.rerolls,3);
 assert.throws(()=>selectCandidate(state,poolById(pool).players[1].id));
 assert.equal(hydrateState(state).drawPhase,'awaiting');
 state=spinDraft(state,()=>0);assert.equal(state.drawPhase,'ready');assert.equal(state.rerolls,3);
});
test('extra rerolls are separate paid spins, capped at three',()=>{
 let state=spinDraft(startDraft(freshState(),'2020s',[]),()=>0);
 for(let i=0;i<3;i++){const previous=state.pool;state=reroll(state);assert.equal(state.drawPhase,'awaiting');assert.equal(state.pool,previous);state=spinDraft(state,()=>0)}
 assert.equal(state.rerolls,0);assert.throws(()=>reroll(state));
});
test('opponent locks match the exact team-era player key, not all versions of a person',()=>{
 const old=pools.find(p=>p.id==='wc-brazil-1962').players.find(p=>p.identity==='pele');
 const newer=pools.find(p=>p.id==='wc-brazil-1970').players.find(p=>p.identity==='pele');
 let state=startDraft(freshState(),'2020s',[]);state={...state,pool:'wc-brazil-1970',drawPhase:'ready'};
 assert.throws(()=>selectCandidate(state,newer.id,[newer.id]));
 assert.doesNotThrow(()=>selectCandidate(state,newer.id,[old.id]));
 assert.throws(()=>pickPlayer(state,newer.id,0,Math.random,[newer.id]));
 const fullPool=pools.find(p=>p.id==='wc-brazil-1970');
 assert.ok(!availablePools(state,fullPool.players.map(p=>p.id)).some(p=>p.id===fullPool.id));
});
test('real historical partners gain on both sides, including bench partners; unrelated players do not',()=>{
 const x={identity:'xavi',rating:96,positions:['CM'],year:2011,profile:'universal'};
 const i={identity:'andres-iniesta',rating:91,positions:['CM'],year:2011,profile:'universal'};
 const state=freshState();state.picks[3]=x;assert.equal(chemistryBonus(state.picks,x),0);
 state.picks[11]=i;assert.equal(activeChemistry(state.picks).length,1);
 assert.equal(chemistryBonus(state.picks,x),2);assert.equal(chemistryBonus(state.picks,i),2);
 assert.equal(playerAbility(state,x,'CM'),98);assert.equal(playerTier(state,x),'S');
 assert.equal(networkState(state).picks[3].rating,98);
 assert.equal(networkState(state).picks.slice(0,11).reduce((sum,p)=>sum+(p?.rating||0),0)/11,strength(state));
 state.picks[11]=null;assert.equal(chemistryBonus(state.picks,x),0);assert.equal(playerTier(state,x),'A');
});
test('BBC trio supersedes pair bonuses and can raise ability beyond the old 100 cap',()=>{
 const picks=[{identity:'cristiano-ronaldo',rating:99,positions:['LW']},{identity:'gareth-bale',rating:92,positions:['RW']},{identity:'karim-benzema',rating:92,positions:['ST']}];
 assert.equal(activeChemistry(picks).length,3);for(const p of picks)assert.equal(chemistryBonus(picks,p),5);
 const state={...freshState(),picks:[...picks,...Array(13).fill(null)]};
 assert.equal(playerAbility(state,picks[0],'LW'),104);assert.equal(playerTier(state,picks[1],'RW'),'A');
 assert.ok(!chemistryPairs.some(p=>p.players.includes('cristiano-ronaldo')&&p.players.includes('roberto-carlos')));
});
