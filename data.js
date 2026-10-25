import {internationalSquads} from './catalog-international.js';
import {modes,isMode} from './modes.js';
import {balanceRatings} from './rating-balance.js';
import {expansionSquads} from './catalog-expansion.js';
import { chemistryBonus } from './chemistry.js';
import { chineseNames } from './player-names-zh.js';
import { buildHeightProfiles } from './heights.js';
import { worldCupSquads } from './catalog-world-cup.js';
import { uclSquads } from './catalog-ucl.js';

export const eras = [
  ['1960s', '1960–1969', 1960, 1969], ['1970s-a', '1970–1974', 1970, 1974],
  ['1970s-b', '1975–1979', 1975, 1979], ['1980s-a', '1980–1984', 1980, 1984],
  ['1980s-b', '1985–1989', 1985, 1989], ['1990s-a', '1990–1994', 1990, 1994],
  ['1990s-b', '1995–1999', 1995, 1999], ['2000s-a', '2000–2004', 2000, 2004],
  ['2000s-b', '2005–2009', 2005, 2009], ['2010s-a', '2010–2014', 2010, 2014],
  ['2010s-b', '2015–2019', 2015, 2019], ['2020s', '2020–2024', 2020, 2024]
].map(([id, label, from, to]) => ({ id, label, from, to }));
export const eraById = id => eras.find(e => e.id === id);
export const eraForYear = year => eras.find(e => year >= e.from && year <= e.to);
export const tier = r => r >= 105 ? 'S+' : r >= 98 ? 'S' : r >= 90 ? 'A' : r >= 82 ? 'B' : r >= 75 ? 'C' : 'D';
export const tierClass = t => `tier-${t === 'S+' ? 'sp' : t.toLowerCase()}`;
const allSquads = balanceRatings([...worldCupSquads, ...uclSquads, ...expansionSquads, ...internationalSquads]);
const heightProfiles = buildHeightProfiles(allSquads.flatMap(squad => squad.players));
export const pools = allSquads.map(squad => ({
  ...squad, era: String(squad.year), eraId: eraForYear(squad.year).id,
  players: squad.players.map(p => ({
    ...p, originalName: p.name, name: p.displayName || chineseNames[p.identity] || '球员', ...heightProfiles.get(p.identity), id: `${squad.id}:${p.identity}`, pos: p.positions[0], tier: tier(p.rating),
    profile: p.profile || 'universal', year: squad.year, era: String(squad.year),
    team: squad.team, flag: squad.flag
  }))
}));
export const poolById = id => pools.find(p => p.id === id);
export const formations = {
  '4-3-3': [['LW', 'ST', 'RW'], ['CM', 'CDM', 'CM'], ['LB', 'CB', 'CB', 'RB'], ['GK']],
  '4-3-3-attacking': [['LW', 'ST', 'RW'], ['CAM'], ['CM', 'CM'], ['LB', 'CB', 'CB', 'RB'], ['GK']],
  '4-4-2': [['ST', 'ST'], ['LM', 'CM', 'CM', 'RM'], ['LB', 'CB', 'CB', 'RB'], ['GK']],
  '3-3-4': [['LW', 'ST', 'ST', 'RW'], ['CM', 'CM', 'CM'], ['CB', 'CB', 'CB'], ['GK']],
  '4-2-4': [['LW', 'ST', 'ST', 'RW'], ['CM', 'CM'], ['LB', 'CB', 'CB', 'RB'], ['GK']],
  '3-5-2': [['ST', 'ST'], ['LM', 'CM', 'CDM', 'CM', 'RM'], ['CB', 'CB', 'CB'], ['GK']],
  '4-2-3-1': [['ST'], ['LW', 'CAM', 'RW'], ['CDM', 'CDM'], ['LB', 'CB', 'CB', 'RB'], ['GK']],
  '4-3-1-2': [['ST', 'ST'], ['CAM'], ['CM', 'CDM', 'CM'], ['LB', 'CB', 'CB', 'RB'], ['GK']],
  '3-4-1-2': [['ST', 'ST'], ['CAM'], ['LWB', 'CM', 'CM', 'RWB'], ['CB', 'CB', 'CB'], ['GK']]
};
// Keep legacy shapes readable for existing drafts and completed online seasons.
export const formationChoices = ['4-3-3','4-3-3-attacking','3-3-4','4-2-4','4-2-3-1','4-3-1-2'];
export const formationName = f => f === '4-3-3-attacking' ? '4-3-3 进攻型' : f;
export const positions = f => formations[f].flat();
export function formationLayout(f) {
  const rows = formations[f];
  return rows.flatMap((row, r) => row.map((pos, c) => ({ pos,
    x: 100 * (c + 1) / (row.length + 1), y: rows.length === 4 ? 14 + r * 24 : 10 + r * 80 / (rows.length - 1) })));
}

export function positionPenalty(p, pos) {
  if (!p) return 0;
  const preferred = p.positions || [p.pos];
  if (pos === 'SUB' || preferred.includes(pos)) return 0;
  if (preferred.includes('GK') || pos === 'GK') return 45;
  const groups = [['LW', 'RW', 'LM', 'RM'], ['ST', 'CAM'], ['CM', 'CDM', 'CAM'], ['LB', 'RB', 'CB', 'LWB', 'RWB']];
  return groups.some(g => g.includes(pos) && preferred.some(v => g.includes(v))) ? 4 : 12;
}
// Counterfactual adaptation is an editorial game model, not a measured historical fact.
// Most players have no era penalty. Only specifically tagged tactical roles are adjusted.
export function eraAdjustment(p, targetEra) {
  const era = eraById(targetEra);
  if (!p || !era || (p.year >= era.from && p.year <= era.to)) return { penalty: 0, reason: '本年代环境，无年代扣分' };
  if (p.identity === 'virgil-van-dijk' || !p.profile || p.profile === 'universal') {
    return { penalty: 0, reason: '技术与身体能力具备跨年代适应性，无年代扣分' };
  }
  if (p.year < 1992 && era.from >= 1995 && p.profile === 'classic-keeper') {
    return { penalty: 3, reason: '传统门将进入回传规则改革后的环境：脚下出球适应 −3' };
  }
  if (p.year < 1995 && era.from >= 2005 && p.profile === 'classic-stopper') {
    return { penalty: 2, reason: '传统盯人中卫进入高位防线：大空间防守适应 −2' };
  }
  if (p.year < 1995 && era.from >= 2005 && p.profile === 'classic-maker') {
    return { penalty: 2, reason: '传统自由组织者进入紧凑压迫环境：接球空间适应 −2' };
  }
  if (p.year >= 2005 && era.to <= 1984 && p.profile === 'modern-wingback') {
    return { penalty: 2, reason: '现代进攻边卫进入较早战术体系：套边支援与身后保护适应 −2' };
  }
  if (p.year >= 2005 && era.to <= 1984 && p.profile === 'modern-press') {
    return { penalty: 1, reason: '依赖集体压迫的现代角色进入早期体系：协同适应 −1' };
  }
  return { penalty: 0, reason: '此战术角色在目标年代没有额外扣分' };
}
export function fit(p, pos, targetEra, bonus = 0) {
  if (!p) return 0;
  return Math.max(15, p.rating + bonus - positionPenalty(p, pos) - eraAdjustment(p, targetEra).penalty);
}
export const playerAbility = (s, p, pos) => fit(p, pos, s.targetEra, chemistryBonus(s.picks, p));
export function playerTier(s, p, pos) {
  if (!p) return null;
  const index=s.picks.indexOf(p);
  return tier(playerAbility(s,p,pos || (index>=0 ? index<11 ? positions(s.formation)[index] : 'SUB' : p.pos || p.positions?.[0] || 'SUB')));
}
export function strength(s) {
  return s.picks.slice(0, 11).reduce((sum, p, i) => sum + playerAbility(s, p, positions(s.formation)[i]), 0) / 11;
}
export function freshState(mode = 'world_cup',teamName='我的球队') {
  return { version: 2, mode, teamName, formation: '4-3-3', picks: Array(16).fill(null), pool: null,
    rerolls: 3, targetEra: '2020s', excludedEras: [], started: false, drawPhase: 'awaiting', lockProtocol: 3 };
}
export function availablePools(s, blockedIds = []) {
  const blocked = new Set(blockedIds);
  const picked = new Set(s.picks.filter(Boolean).map(p => p.identity));
  return pools.filter(p => p.mode === s.mode && !s.excludedEras.includes(p.eraId) && p.players.some(x => !picked.has(x.identity) && !blocked.has(x.id)));
}
export function validateSettings(s) {
  if (!isMode(s.mode) || !eraById(s.targetEra)) throw Error('请选择有效的赛事和征战年代。');
  if (!Array.isArray(s.excludedEras) || s.excludedEras.some(id => !eraById(id))) throw Error('排除年代无效。');
  const candidates = availablePools(s);
  if (!candidates.length || new Set(candidates.flatMap(p => p.players.map(x => x.identity))).size < 16) {
    throw Error('请至少保留一个有足够球员的年代，才能完成 16 人选秀。');
  }
}
export function roomPoolCapacity(state,capacity){
 const versions=new Map();for(const pool of pools.filter(p=>p.mode===state.mode&&!state.excludedEras.includes(p.eraId)))for(const player of pool.players)versions.set(player.identity,(versions.get(player.identity)||0)+1);
 return [...versions.values()].reduce((sum,n)=>sum+Math.min(capacity,n),0);
}
export function validateRoomPool(state,capacity){if(roomPoolCapacity(state,capacity)<16*capacity)throw Error(`保留的年代不足以让 ${capacity} 人各选满 16 人，请取消更多年代的 Lock 后再创建房间。`);}
export function drawPool(s, random = Math.random, blockedIds = []) {
  const options = availablePools(s, blockedIds);
  if (!options.length) return null;
  // Draw an eligible era first, then a team within it. More catalog entries do not weight an era more heavily.
  const eligibleEras = [...new Set(options.map(p => p.eraId))];
  const eraId = eligibleEras[Math.min(eligibleEras.length - 1, Math.floor(random() * eligibleEras.length))];
  const eraPools = options.filter(p => p.eraId === eraId);
  const alternatives = eraPools.filter(p => p.id !== s.pool);
  const choices = alternatives.length ? alternatives : eraPools;
  return choices[Math.min(choices.length - 1, Math.floor(random() * choices.length))].id;
}
export function startDraft(s, targetEra, excludedEras, random = Math.random) {
  if (s.started) throw Error('本局年代设置已经锁定，请开启新一局。');
  const next = { ...s, targetEra, excludedEras: [...new Set(excludedEras)] };
  validateSettings(next);
  next.started = true; next.pool = null; next.drawPhase = 'awaiting';
  return next;
}
export function spinDraft(s, random = Math.random, blockedIds = []) {
  if (!s.started || s.drawPhase !== 'awaiting' || s.picks.every(Boolean)) throw Error('当前不能 Spin，请先完成本轮选人。');
  const pool = drawPool(s, random, blockedIds);
  if (!pool) throw Error('没有剩余可选的球队和球员，请调整设置后开启新一局。');
  return { ...s, pool, drawPhase: 'ready' };
}
export function pickPlayer(s, playerId, slot, random = Math.random, blockedIds = []) {
  if (!s.started || s.drawPhase !== 'ready' || !Number.isInteger(slot) || slot < 0 || slot > 15 || s.picks[slot]) throw Error('请先选中一个空阵容位置。');
  const player = poolById(s.pool)?.players.find(p => p.id === playerId);
  if (!player || blockedIds.includes(playerId) || s.picks.some(p => p?.identity === player.identity)) throw Error('该球员已入队或不在本轮候选名单。');
  const next = { ...s, picks: [...s.picks] }; next.picks[slot] = player;
  next.drawPhase = next.picks.every(Boolean) ? 'complete' : 'awaiting';
  return next;
}
export function reroll(s, random = Math.random) {
  if (!s.started || s.drawPhase !== 'ready' || s.rerolls <= 0 || s.picks.every(Boolean)) throw Error('本轮无法重转。');
  return { ...s, rerolls: s.rerolls - 1, drawPhase: 'awaiting' };
}
export function hydrateState(saved) {
  if (saved?.lineupFormation) { saved = { ...saved, formation: saved.lineupFormation }; delete saved.lineupFormation; }
  const fallback = freshState(isMode(saved?.mode)?saved.mode:'world_cup',saved?.teamName||'我的球队');
  if (!saved || saved.version !== 2 || !formations[saved.formation] || !Array.isArray(saved.picks) || saved.picks.length !== 16 || !Number.isInteger(saved.rerolls) || saved.rerolls < 0 || saved.rerolls > 3) return fallback;
  try {
    validateSettings(saved);
    if (!saved.started) return fallback;
    const phase = saved.drawPhase || (saved.picks.every(Boolean) ? 'complete' : 'ready');
    if (!['awaiting','ready','complete'].includes(phase)) return fallback;
    if (saved.pool !== null && (!poolById(saved.pool) || poolById(saved.pool).mode !== saved.mode || saved.excludedEras.includes(poolById(saved.pool).eraId))) return fallback;
    if (phase === 'ready' && !saved.pool) return fallback;
    const allowed = pools.filter(p => p.mode === saved.mode && !saved.excludedEras.includes(p.eraId));
    const catalog = new Map(allowed.flatMap(p => p.players).map(p => [p.id, p]));
    const picks = saved.picks.map(p => p ? catalog.get(p.id) : null);
    if (picks.some((p, i) => saved.picks[i] && !p) || new Set(picks.filter(Boolean).map(p => p.identity)).size !== picks.filter(Boolean).length) return fallback;
    return { ...fallback, ...saved, picks, drawPhase: phase };
  } catch { return fallback; }
}
// Existing SQL averages rating; submit effective values so online and local rules agree.
export function networkState(s) {
  const legacyFormations = ['4-3-3', '4-4-2', '4-2-4', '3-5-2'];
  // The deployed RPC validates four legacy formation tags but calculates scores only
  // from submitted effective ratings. Preserve the actual layout separately.
  return { ...s, lineupFormation: s.formation, formation: legacyFormations.includes(s.formation) ? s.formation : '4-3-3', picks: s.picks.map((p, i) => p ? { ...p, baseRating: p.rating,
    rating: playerAbility(s, p, i < 11 ? positions(s.formation)[i] : 'SUB') } : null) };
}
export function season(s, random = Math.random) {
  const power = strength(s);
  return Array.from({ length: 8 }, (_, i) => {
    const opponent = 77 + random() * 13;
    const goals = chance => { let n = 0; for (let j = 0; j < 5; j++) if (random() < chance) n++; return n; };
    const home = goals(Math.max(.08, Math.min(.65, .27 + (power - opponent) / 70)));
    const away = goals(Math.max(.08, Math.min(.65, .27 + (opponent - power) / 70)));
    return { stage: i < 6 ? `联赛阶段 · 第 ${i + 1} 轮` : i === 6 ? '半决赛' : '决赛', home, away,
      opponent: Math.round(opponent), penalties: i >= 6 && home === away ? (random() < power / (power + opponent) ? '点球胜' : '点球负') : null };
  });
}

// Confirmed players keep their slot; formation changes preserve those slot assignments.
export function assertDraftProgress(previous,next){
 if(previous.picks.some((p,i)=>p&&p.id!==next.picks[i]?.id))throw Error('球员入队后位置已锁定，不能换位、替换或移出阵容。');
}

export function awakenedSlots(previous,next,confirmedSlot=null){
 return next.picks.flatMap((p,i)=>{if(!p)return [];const pos=i<11?positions(next.formation)[i]:'SUB',now=playerAbility(next,p,pos),old=previous.picks[i];
  const before=old?playerAbility(previous,old,i<11?positions(previous.formation)[i]:'SUB'):0;
  return now>=110&&(before<110||i===confirmedSlot)?[i]:[];
 });
}
