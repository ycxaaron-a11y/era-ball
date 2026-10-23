import test from 'node:test';
import assert from 'node:assert/strict';
import { pools, freshState, startDraft, poolById, networkState } from '../data.js';
import { selectCandidate, placeCandidate, candidateFor } from '../placement.js';
import { positionNames, positionName, positionList, heightLabel } from '../display.js';

test('every catalog player has a Chinese display name and position labels use Chinese', () => {
  for (const p of pools.flatMap(s => s.players)) {
    assert.match(p.name, /\p{Script=Han}/u, p.identity);
    assert.doesNotMatch(p.name, /[A-Za-z]/, p.identity);
    assert.notEqual(p.name, '球员');
    assert.doesNotMatch(positionList(p.positions), /[A-Za-z]/);
    assert.notEqual(p.name, p.originalName);
  }
  for (const code of ['ST','LW','RW','LM','RM','CAM','CDM','SS','LB','RB','CB','LWB','RWB','GK','SUB']) assert.match(positionName(code), /\p{Script=Han}/u);
  assert.ok(Object.keys(positionNames).length >= 15);
});
test('known heights are in centimetres and missing data is labelled rather than fabricated', () => {
  const players = pools.flatMap(p => p.players), known = players.filter(p => p.heightCm !== null);
  assert.ok(known.length > 450);
  assert.ok(known.every(p => Number.isInteger(p.heightCm) && p.heightCm >= 150 && p.heightCm <= 210));
  const messi = players.find(p => p.identity === 'lionel-messi');
  assert.equal(heightLabel(messi), '170 厘米');
  assert.equal(heightLabel({heightCm:null}), '身高待补充');
  assert.equal(heightLabel({}), '身高待补充');
});
test('selecting and previewing never modifies draft, rerolls, pool or network payload', () => {
  const state = startDraft(freshState(), '2020s', [], () => 0);
  const saved = JSON.stringify(state), outgoing = JSON.stringify(networkState(state));
  const player = poolById(state.pool).players[0];
  const selection = selectCandidate(state, player.id);
  assert.equal(selection.slot, null);
  const preview = placeCandidate(state, selection, 0, () => 0);
  assert.equal(preview.confirmed, false);
  assert.equal(preview.state, state);
  assert.equal(preview.placement.slot, 0);
  assert.equal(candidateFor(state, preview.placement).id, player.id);
  assert.equal(JSON.stringify(state), saved);
  assert.equal(JSON.stringify(networkState(preview.state)), outgoing);
  assert.equal(state.picks.filter(Boolean).length, 0);
});
test('changing preview slot rearms confirmation; only second tap of the same slot picks the player', () => {
  const state = startDraft(freshState(), '2020s', [], () => 0);
  const player = poolById(state.pool).players[0];
  const selection = selectCandidate(state, player.id);
  let result = placeCandidate(state, selection, 0, () => 0);
  result = placeCandidate(state, result.placement, 10, () => 0);
  assert.equal(result.confirmed, false); assert.equal(result.state, state);
  assert.equal(result.placement.slot, 10);
  result = placeCandidate(state, result.placement, 10, () => 0);
  assert.equal(result.confirmed, true); assert.equal(result.placement, null);
  assert.equal(result.state.picks[10].id, player.id);
  assert.equal(result.state.picks.filter(Boolean).length, 1);
  assert.equal(result.state.rerolls, 3);
  assert.notEqual(result.state.pool, state.pool);
});
test('new candidate, new formation and stale pools cannot accidentally confirm a preview', () => {
  const state = startDraft(freshState(), '2020s', [], () => 0), players = poolById(state.pool).players;
  const a = placeCandidate(state, selectCandidate(state, players[0].id), 0);
  const b = selectCandidate(state, players[1].id);
  assert.equal(b.slot, null);
  assert.equal(placeCandidate(state, b, 0).confirmed, false);
  const changed = {...state,formation:'4-4-2'};
  assert.equal(placeCandidate(changed, a.placement, 0).confirmed, false);
  const stale = {...state,pool:pools.find(p=>p.mode===state.mode&&p.id!==state.pool).id};
  assert.throws(()=>placeCandidate(stale,a.placement,0));
  assert.throws(()=>placeCandidate(state,null,0),/先从右侧/);
});
test('preview cannot overwrite an occupied slot, and bench supports the same two-tap flow', () => {
  let state = startDraft(freshState(), '2020s', [], () => 0), player = poolById(state.pool).players[0];
  let selection = selectCandidate(state, player.id), result = placeCandidate(state, selection, 11);
  result = placeCandidate(state, result.placement, 11, () => 0);state=result.state;
  const next = poolById(state.pool).players.find(p=>p.identity!==player.identity);
  selection=selectCandidate(state,next.id);
  assert.throws(()=>placeCandidate(state,selection,11),/空位置/);
  assert.equal(state.picks[11].id,player.id);
});
