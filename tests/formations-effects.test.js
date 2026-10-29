import {globalSquads} from '../catalog-global.js';
import {varietySquads} from '../catalog-variety.js';
import {expansionSquads} from '../catalog-expansion.js';
import { startSpunDraft } from './helpers.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { formations, formationChoices, formationLayout, positions, pools, freshState, spinDraft, poolById, networkState, hydrateState, strength } from '../data.js';
import { estimateHeight } from '../heights.js';
import { playerHeights } from '../player-heights.js';
import { splusLightning, playerSilhouette, splusStardust } from '../effects.js';

test('all six selectable formations and legacy shapes have eleven on-field players and one keeper; new layouts have attacking midfielders', () => {
  assert.equal(formationChoices.length, 6);assert.ok(!formationChoices.includes('4-4-2'));assert.ok(formationChoices.includes('3-3-4'));assert.deepEqual(positions('3-3-4'),['LW','ST','ST','RW','CM','CM','CM','CB','CB','CB','GK']);assert.ok(!formationChoices.includes('3-5-2'));assert.ok(!formationChoices.includes('3-4-1-2'));assert.deepEqual(positions('4-3-3-attacking').slice(3,6),['CAM','CM','CM']);
  for (const f of Object.keys(formations)) {
    const layout = formationLayout(f);
    assert.equal(layout.length, 11);assert.equal(positions(f).filter(p=>p==='GK').length, 1);
    assert.deepEqual(layout.map(p=>p.pos), positions(f));
    assert.ok(layout.every(p=>p.x>0&&p.x<100&&p.y>=10&&p.y<=90));
    assert.equal(new Set(layout.map(p=>`${p.x}/${p.y}`)).size, 11);
  }
  for (const f of ['4-2-3-1','4-3-1-2','4-3-3-attacking']) assert.ok(positions(f).includes('CAM'));
  assert.ok(positions('3-4-1-2').includes('LWB'));assert.ok(positions('3-4-1-2').includes('RWB'));
});
test('new formations submit through the existing RPC whitelist without losing the actual layout or scores', () => {
  for (const formation of ['3-3-4','4-2-3-1','4-3-1-2','4-3-3-attacking']) {
    const state=startSpunDraft(freshState(),'2020s',[],()=>0);state.formation=formation;
    state.picks=poolById(state.pool).players.slice(0,16);
    const payload=networkState(state);
    assert.ok(['4-3-3','4-4-2','4-2-4','3-5-2'].includes(payload.formation));
    assert.equal(payload.lineupFormation,formation);
    assert.equal(payload.picks.slice(0,11).reduce((s,p)=>s+p.rating,0)/11,strength(state));
    const restored=hydrateState(payload);assert.equal(restored.formation,formation);
    assert.equal(restored.lineupFormation,undefined);
    restored.formation='4-4-2';assert.equal(hydrateState(restored).formation,'4-4-2');
  }
});
test('every identity has a stable height across its era versions and known values are not overwritten', () => {
  const seen=new Map(), supplied=new Map([...expansionSquads,...varietySquads,...globalSquads].flatMap(s=>s.players).filter(p=>Number.isInteger(p.heightCm)).map(p=>[p.identity,p.heightCm]));
  for (const p of pools.flatMap(s=>s.players)) {
    assert.ok(Number.isInteger(p.heightCm)&&p.heightCm>=150&&p.heightCm<=210);
    if(seen.has(p.identity))assert.equal(p.heightCm,seen.get(p.identity));
    seen.set(p.identity,p.heightCm);
    if(playerHeights[p.identity]) {assert.equal(p.heightCm,playerHeights[p.identity]);assert.equal(p.heightEstimated,false)}
    else if(supplied.has(p.identity)){assert.equal(p.heightCm,supplied.get(p.identity));assert.equal(p.heightEstimated,false);}else assert.equal(p.heightEstimated,true);
  }
  assert.equal(estimateHeight('unknown-keeper','GK'),estimateHeight('unknown-keeper','GK'));
  assert.ok(estimateHeight('unknown-keeper','GK')>estimateHeight('unknown-winger','RW'));
});
test('S+ uses actual branched SVG bolts while other tiers remain free of lightning, and avatar has no name fragment', () => {
  const svg=splusLightning('S+');assert.match(svg,/<svg/);assert.match(svg,/bolt-a/);assert.match(svg,/bolt-b/);assert.match(svg,/branch/);
  for(const t of ['S','A','B','C','D'])assert.equal(splusLightning(t),'');
  assert.match(playerSilhouette(),/player-silhouette/);assert.match(playerSilhouette(),/<circle/);assert.match(playerSilhouette(),/<path/);
  assert.doesNotMatch(playerSilhouette(),/<text/);
});

test('ordinary S+ gains white edge stardust only from 105 to 109',()=>{for(const score of [104,110,115])assert.equal(splusStardust(score),'');for(const score of [105,109])assert.equal((splusStardust(score).match(/<i /g)||[]).length,12);});
