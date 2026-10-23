import { poolById, pickPlayer } from './data.js';

// Preview is transient UI state. It never changes the saved draft or outgoing network state.
export function candidateFor(state, placement) {
  if (!placement || state.drawPhase !== 'ready' || placement.pool !== state.pool) return null;
  return poolById(state.pool)?.players.find(p => p.id === placement.playerId) || null;
}
export function selectCandidate(state, playerId, blockedIds = []) {
  if (!state.started || state.drawPhase !== 'ready' || state.picks.every(Boolean)) throw Error('请先开始选秀，并保留一个空阵容位置。');
  const player = poolById(state.pool)?.players.find(p => p.id === playerId);
  if (!player || blockedIds.includes(playerId) || state.picks.some(p => p?.identity === player.identity)) throw Error('这位球员已入队或不在当前名单中。');
  return { playerId, pool: state.pool, slot: null, formation: state.formation };
}
export function placeCandidate(state, placement, slot, random = Math.random, blockedIds = []) {
  const player = candidateFor(state, placement);
  if (blockedIds.includes(player?.id)) throw Error('这个球队年代版本已被对手锁定，请改选其他球员。');
  if (!player) throw Error('先从右侧选择一位球员，再点击阵容位置。');
  if (!Number.isInteger(slot) || slot < 0 || slot >= 16 || state.picks[slot]) throw Error('请选择一个空位置；已有球员可在详情中换位。');
  if (placement.slot !== slot || placement.formation !== state.formation) {
    return { state, placement: { ...placement, slot, formation: state.formation }, confirmed: false };
  }
  return { state: pickPlayer(state, player.id, slot, random, blockedIds), placement: null, confirmed: true };
}
