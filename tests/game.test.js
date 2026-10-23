import test from 'node:test';
import assert from 'node:assert/strict';
import {pools,positions,fit,tier,season,strength,formations} from '../data.js';
test('every supported mode has draftable squads including a goalkeeper',()=>{for(const p of pools){assert.ok(p.players.length>=16);assert.ok(p.players.some(x=>x.pos==='GK'));assert.equal(new Set(p.players.map(x=>x.id)).size,p.players.length);for(const x of p.players){assert.equal(x.tier,tier(x.rating));assert.ok(x.rating>=1&&x.rating<=100)}}});
test('formations always contain 11 players and one goalkeeper',()=>{for(const f of Object.keys(formations)){assert.equal(positions(f).length,11);assert.equal(positions(f).filter(x=>x==='GK').length,1)}});
test('position penalties affect squad strength',()=>{assert.equal(fit({pos:'GK',rating:92},'ST'),47);assert.equal(fit({pos:'RW',rating:95},'LW'),91);const s={formation:'4-3-3',picks:positions('4-3-3').map(pos=>({pos,rating:90}))};assert.equal(strength(s),90);assert.equal(strength({...s,picks:Array(11).fill(null)}),0)});
test('season produces actual fixtures and resolves knockout ties',()=>{const s={formation:'4-3-3',picks:positions('4-3-3').map(pos=>({pos,rating:90}))};const result=season(s,()=>.5);assert.equal(result.length,8);assert.equal(result[6].penalties,'点球胜');for(const m of result){assert.ok(m.home>=0&&m.home<=5);assert.ok(m.away>=0&&m.away<=5)}});
