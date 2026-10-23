import { poolById, pickPlayer } from './data.js';

// Preview is transient UI state. It never changes the saved draft or outgoing network state.
export function candidateFor(state, placement) {
  if (!placement || placement.pool !== state.pool) return null;
  return poolById(state.pool)?.players.find(p => p.id === placement.playerId) || null;
}
export function selectCandidate(state, playerId) {
  if (!state.started || state.picks.every(Boolean)) throw Error('请先开始选秀，并保留一个空阵容位置。');
  const player = poolById(state.pool)?.players.find(p => p.id === playerId);
  if (!player || state.picks.some(p => p?.identity === player.identity)) throw Error('这位球员已入队或不在当前名单中。');
  return { playerId, pool: state.pool, slot: null, formation: state.formation };
}
export function placeCandidate(state, placement, slot, random = Math.random) {
  const player = candidateFor(state, placement);
  if (!player) throw Error('先从右侧选择一位球员，再点击阵容位置。');
  if (!Number.isInteger(slot) || slot < 0 || slot >= 16 || state.picks[slot]) throw Error('请选择一个空位置；已有球员可在详情中换位。');
  if (placement.slot !== slot || placement.formation !== state.formation) {
    return { state, placement: { ...placement, slot, formation: state.formation }, confirmed: false };
  }
  return { state: pickPlayer(state, player.id, slot, random), placement: null, confirmed: true };
}
