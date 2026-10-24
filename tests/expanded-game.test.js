import { startSpunDraft } from './helpers.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { pools, eras, eraAdjustment, positions, fit, strength, freshState, spinDraft,
  drawPool, poolById, pickPlayer, reroll, hydrateState, networkState } from '../data.js';
import { request, validatePublicConfig } from '../multiplayer.js';

test('both modes cover all 12 eras with multiple teams and a broad player catalog', () => {
  assert.equal(eras.length, 12);
  for (const mode of ['world_cup', 'ucl']) {
    const candidates = pools.filter(p => p.mode === mode);
    assert.ok(candidates.length >= 24);
    for (const era of eras) assert.ok(candidates.filter(p => p.eraId === era.id).length >= 2, `${mode}: ${era.label}`);
    assert.ok(candidates.some(p => Math.max(...p.players.map(x => x.rating)) <= 93), 'include less dominant teams');
  }
  assert.ok(pools.reduce((sum, p) => sum + p.players.length, 0) >= 800);
});
test('squads retain unique identities with era-specific elite ratings and no three-player cap', () => {
  assert.equal(new Set(pools.map(p => p.id)).size, pools.length);
  const allTiers = new Set();
  for (const p of pools) {

    assert.equal(new Set(p.players.map(x => x.identity)).size, p.players.length, p.id);
    for (const x of p.players) {
      allTiers.add(x.tier);
      assert.ok(x.positions.length && x.positions.every(pos => ['GK', 'LB', 'CB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'LM', 'RM', 'ST', 'LWB', 'RWB', 'SS'].includes(pos)), x.id);
    }
  }
  assert.deepEqual([...allTiers].sort(), ['A', 'B', 'C', 'D', 'S', 'S+'].sort());
});
test('Ronaldo can play both LW and ST at full positional ability; VVD travels without era loss', () => {
  const ronaldo = pools.flatMap(p => p.players).find(p => p.identity === 'cristiano-ronaldo' && p.year >= 2014 && p.year <= 2018);
  assert.ok(ronaldo);
  assert.equal(fit(ronaldo, 'LW'), ronaldo.rating);
  assert.equal(fit(ronaldo, 'ST'), ronaldo.rating);
  const vvd = pools.flatMap(p => p.players).find(p => p.identity === 'virgil-van-dijk');
  assert.ok(vvd);
  for (const era of eras) assert.equal(eraAdjustment(vvd, era.id).penalty, 0);
});
test('era adjustments depend on role, are transparent, and do not blanket-penalize old players', () => {
  const old = { rating: 91, positions: ['GK'], year: 1970, profile: 'classic-keeper' };
  assert.equal(fit(old, 'GK', '2020s'), 88);
  assert.equal(fit(old, 'GK', '1970s-a'), 91);
  assert.equal(fit({ ...old, profile: 'universal' }, 'GK', '2020s'), 91);
  assert.equal(eraAdjustment({ ...old, positions: ['CAM'], profile: 'classic-maker' }, '2020s').penalty, 2);
  assert.equal(eraAdjustment({ year: 2023, profile: 'modern-wingback' }, '1970s-a').penalty, 2);
});
test('locked eras never enter draws, settings cannot change after starting, and all-lock is rejected', () => {
  const base = freshState();
  assert.throws(() => startSpunDraft(base, '2020s', eras.map(e => e.id)), /至少保留/);
  const s = startSpunDraft(base, '1960s', eras.filter(e => e.id !== '2010s-b').map(e => e.id));
  assert.throws(() => startSpunDraft(s, '2020s', []), /锁定/);
  for (let i = 0; i < 50; i++) assert.equal(poolById(drawPool(s)).eraId, '2010s-b');
  assert.equal(s.targetEra, '1960s');
});
test('a complete draft can be assembled with only one era unlocked in every era/mode', () => {
  for (const mode of ['world_cup', 'ucl']) for (const era of eras) {
    let s = startSpunDraft(freshState(mode), '2020s', eras.filter(e => e.id !== era.id).map(e => e.id), () => 0);
    for (let i = 0; i < 16; i++) {
      if(s.drawPhase==='awaiting')s=spinDraft(s,()=>0);
      const candidate = poolById(s.pool).players.find(p => !s.picks.some(x => x?.identity === p.identity));
      assert.ok(candidate, `${mode}/${era.id} draft got stuck`);
      s = pickPlayer(s, candidate.id, i, () => 0);
    }
    assert.equal(s.picks.filter(Boolean).length, 16);
    assert.equal(new Set(s.picks.map(p => p.identity)).size, 16);
    assert.equal(hydrateState(s).picks.filter(Boolean).length, 16);
  }
});
test('rerolls have a hard limit of 3 and picks reject overwrites or duplicate people', () => {
  let s = startSpunDraft(freshState(), '2020s', [], () => 0);
  for (let i = 0; i < 3; i++) s = spinDraft(reroll(s), () => 0);
  assert.equal(s.rerolls, 0); assert.throws(() => reroll(s));
  const id = poolById(s.pool).players[0].id;
  s = pickPlayer(s, id, 0, () => 0);
  assert.throws(() => pickPlayer(s, poolById(s.pool).players[0].id, 0));
  assert.equal(s.rerolls, 0);
});
test('online submits effective scores so existing SQL matches local strength without changing source ratings', () => {
  const s = startSpunDraft(freshState(), '2020s', [], () => 0);
  s.picks = poolById(s.pool).players.slice(0, 16);
  const wire = networkState(s);
  assert.equal(wire.picks.slice(0, 11).reduce((sum, p) => sum + p.rating, 0) / 11, strength(s));
  assert.deepEqual(wire.picks.map(p => p.baseRating), s.picks.map(p => p.rating));
  assert.deepEqual(hydrateState(wire).picks.map(p => p.rating), s.picks.map(p => p.rating));
});
test('corrupt or obsolete stored drafts reset safely', () => {
  assert.equal(hydrateState({ version: 1 }).started, false);
  const s = startSpunDraft(freshState(), '2020s', []);
  assert.equal(hydrateState({ ...s, pool: 'missing' }).started, false);
  assert.equal(hydrateState({ ...s, excludedEras: ['fake-era'] }).started, false);
});
test('Supabase empty-success response and publishable authentication header work', async () => {
  let seen;
  const result = await request({ url: 'https://example.supabase.co', key: 'sb_publishable_example' }, '/rpc', {}, null, async (url, options) => {
    seen = options; return new Response(null, { status: 204 });
  });
  assert.equal(result, null);
  assert.equal(seen.headers.Authorization, undefined);
  assert.equal(seen.headers.apikey, 'sb_publishable_example');
  await assert.rejects(request({ url: 'https://example.supabase.co', key: 'public' }, '/rpc', {}, 'session', async () => new Response(JSON.stringify({ message: 'Not a member' }), { status: 403 })), /Not a member/);
});
test('connection config strips REST suffix and rejects service role credentials', () => {
  assert.equal(validatePublicConfig({ url: 'https://demo.supabase.co/rest/v1/', key: 'sb_publishable_demo' }).url, 'https://demo.supabase.co');
  assert.throws(() => validatePublicConfig({ url: 'https://demo.supabase.co', key: 'sb_secret_demo' }));
  const jwt = 'e30.' + btoa(JSON.stringify({ role: 'service_role' })) + '.sig';
  assert.throws(() => validatePublicConfig({ url: 'https://demo.supabase.co', key: jwt }));
});
