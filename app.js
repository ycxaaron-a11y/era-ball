import {prepareFinal,finalFrame} from './final-match.js';
import {updateFinalLive} from './final-view.js';
import {createTournament,draftTeam} from './tournament.js';
import {renderSeason,closeSeason,seasonVisible} from './season-view.js';
import { activeChemistry, chemistryBonus, chemistryPairs } from './chemistry.js';
import { playerSilhouette, splusLightning, placementImpact } from './effects.js';
import { positionName, positionList, heightLabel } from './display.js';
import { candidateFor, selectCandidate, placeCandidate } from './placement.js';
import { cloudConfig } from './config.js';
import { pools, poolById, eras, eraById, positions, formations, formationChoices, formationName, fit, strength,
  playerAbility, playerTier, availablePools, spinDraft, formationLayout, tierClass, eraAdjustment, positionPenalty, freshState, hydrateState, startDraft, reroll, networkState } from './data.js';
import { request, validatePublicConfig } from './multiplayer.js';

const $ = id => document.getElementById(id);
const storage = 'era-fc-v2';
const read = (key, fallback, source = localStorage) => { try { return JSON.parse(source.getItem(key)) ?? fallback; } catch { return fallback; } };
let s = hydrateState(read(storage, null));
let placement = null, filter = '全部';
let room = null, timer = null, remote = null, busy = false, polling = false, shownResult = false;
let roomGeneration = 0, roomMessage = '', serverRevision = 0;
let lockedIds = new Set(), committing = false, spinning = false, spinFrame = null, spinToken = 0;
let landingImpact = null;
function startLandingImpact(index) {
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const key=crypto.randomUUID();landingImpact={index,key,until:Date.now()+680};
  setTimeout(()=>{if(landingImpact?.key!==key)return;landingImpact=null;const slot=document.querySelector(`[data-slot="${index}"]`);slot?.classList.remove('is-impact');slot?.querySelector('.placement-impact')?.remove();},680);
}
let config = { ...cloudConfig, ...read('era-fc-cloud', {}) };
let authSession = read('era-fc-auth-v2', null, sessionStorage);
const esc = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uiBusy = () => busy || committing || spinning;
const onlineLocked = () => Boolean(room && s.picks.every(Boolean));
const slots = () => [...positions(s.formation), ...Array(5).fill('SUB')];
function modal(html) { $('modal-body').innerHTML = html; if (!$('modal').open) $('modal').showModal(); }
function notify(t) { modal(`<h2>提示</h2><p>${esc(t)}</p>`); }
function status(t) { roomMessage = t; $('room-status').textContent = t; if ($('status')) $('status').textContent = t; }
function save() { localStorage.setItem(storage, JSON.stringify(s)); render(); }
function adjustments(p, pos, state = s) {
  const a = eraAdjustment(p, state.targetEra), penalty = positionPenalty(p, pos);
  return `基础 ${p.rating} · 羁绊 +${chemistryBonus(state.picks,p)} · 位置 −${penalty} · 年代 −${a.penalty} = ${playerAbility(state,p,pos)}；${a.reason}`;
}
function energy(p) { return splusLightning(p?.tier); }
function slot(p, i, pos, xy) {
  const preview = !p && placement?.slot === i ? candidateFor(s, placement) : null;
  const shown = p || preview;
  const viewState = preview ? { ...s, picks: s.picks.map((x,j)=>j===i?shown:x) } : s;
  const grade = shown ? playerTier(viewState,shown,pos) : null;
  const impact = p && landingImpact?.index===i && landingImpact.until>Date.now();
  const title = shown ? `${shown.name} · ${positionList(shown.positions)} · ${adjustments(shown, pos, viewState)}${preview ? '；再点同一位置确认' : ''}` : `空位：${positionName(pos)}`;
  return `<button class="slot ${shown ? tierClass(grade) : ''} ${preview ? 'slot-preview selected' : ''} ${placement && !p ? 'can-place' : ''} ${impact?'is-impact':''}" data-slot="${i}" ${uiBusy() ? 'disabled' : ''} ${xy ? `style="left:${xy[0]}%;top:${xy[1]}%"` : ''} title="${esc(title)}" aria-label="${esc(title)}">
    ${shown ? `${energy({tier:grade})}<em>${playerAbility(viewState,shown,pos)}</em><span class="${preview ? 'preview-player' : 'placed-player'}"><b>${esc(shown.name)}</b><small class="player-height">${heightLabel(shown)}</small><small>${positionName(pos)} · ${grade}${chemistryBonus(viewState.picks,shown) ? ` ↑+${chemistryBonus(viewState.picks,shown)}` : ''}</small></span>${preview ? `<small class="confirm-label">${committing?'锁定中…':'再点确认'}</small>` : ''}` : `<span class="plus">＋</span><small>${positionName(pos)}</small>`}${impact?placementImpact():''}</button>`;
}
function render() {
  const pool = poolById(s.pool);
  $('wc').classList.toggle('active', s.mode === 'world_cup'); $('ucl').classList.toggle('active', s.mode === 'ucl');
  $('formation').innerHTML = formationChoices.map(f=>`<option value="${f}">${formationName(f)}</option>`).join('') + (formationChoices.includes(s.formation)?'':`<option value="${s.formation}" hidden>旧存档阵型（可重新选择）</option>`);
  $('formation').value = s.formation; $('formation').disabled = onlineLocked() || uiBusy();
  for (const id of ['wc','ucl','setup','reset','online','era-open']) if($(id)) $(id).disabled=uiBusy();
  renderChemistry();
  $('pitch').classList.toggle('five-lines', formations[s.formation].length === 5);
  $('pitch').innerHTML = formationLayout(s.formation).map(({pos, x, y}, i) => slot(s.picks[i], i, pos, [x, y])).join('');
  $('bench').innerHTML = s.picks.slice(11).map((p, i) => slot(p, i + 11, 'SUB')).join('');
  document.querySelectorAll('[data-slot]').forEach(el => el.onclick = () => {
    if (uiBusy()) return;
    if (!s.started) return setupUI();
    const i = +el.dataset.slot;
    if (s.picks[i]) return placement ? showPlacementHint('这个位置已有球员，请选择空位。') : playerDetail(i);
    try {
      const result = placeCandidate(s, placement, i, Math.random, [...lockedIds]);
      if (result.confirmed) commitRoster(result.state, i);
      else { placement = result.placement; render(); }
    } catch (e) { showPlacementHint(e.message); }
  });
  const candidate = candidateFor(s, placement);
  showPlacementHint(committing ? '正在向服务器确认版本锁定…' : candidate ? (placement.slot === null ? `已选 ${candidate.name}，点击一个空位预览上场能力。` : `${candidate.name} 正在试位：${positionName(slots()[placement.slot])}。再点同一位置确认，也可改点其他空位。`) : s.drawPhase === 'awaiting' ? '点击 Spin 抽取球队与年代，再选择你的球员。' : '先选球员 → 点击空位预览 → 再点同一空位确认。');
  $('count').textContent = `${s.picks.filter(Boolean).length} / 16`;
  $('rating').textContent = s.picks.slice(0, 11).some(Boolean) ? strength(s).toFixed(1) : '—';
  drawBanner(spinning && spinFrame ? spinFrame : pool);
  document.querySelector('.draw').classList.toggle('is-spinning',spinning);
  document.querySelector('.live-dot').textContent=spinning?'抽选中':s.drawPhase==='complete'?'阵容完成':s.drawPhase==='ready'?'请选择球员':'等待 Spin';
  $('mode-label').textContent = s.mode === 'ucl' ? 'EUROPEAN CUP / CHAMPIONS LEAGUE' : 'FIFA WORLD CUP';
  $('rerolls').textContent = `额外重转 ${s.rerolls} / 3 次`;
  $('spin').textContent = spinning ? 'SPINNING…' : s.drawPhase === 'complete' ? '阵容已完成' : 'SPIN · 抽取球队与年代';
  $('spin').disabled = !s.started || s.drawPhase !== 'awaiting' || uiBusy() || s.picks.every(Boolean);
  $('roll').disabled = !s.started || s.drawPhase !== 'ready' || s.rerolls === 0 || uiBusy() || s.picks.every(Boolean);
  $('simulate').disabled = s.picks.some(p => !p) || uiBusy();
  $('simulate').textContent = room ? '进入联机赛季 ↗' : '进入冠军赛季 ↗';
  $('pool-count').textContent = pool && s.drawPhase === 'ready' && !spinning ? `${pool.players.length} 位球员` : `${pools.filter(p => p.mode === s.mode).length} 支年代球队`;
  $('era-settings').innerHTML = `<div class="setup-summary"><span class="eyebrow">MATCH ERA</span><strong>${s.started ? `${eraById(s.targetEra).label} · 已锁定` : '赛前选择征战年代'}</strong><span>${s.started ? `排除 ${s.excludedEras.length} 个年代 · ${12 - s.excludedEras.length} 个年代可抽选` : '12 个年代 · 可排除不想抽到的年代'}</span></div><button id="era-open">${s.started ? '查看本局设置' : '设置并开始选秀 →'}</button>`;
  $('era-open').onclick = setupUI; $('era-open').disabled=uiBusy();
  $('filters').innerHTML = ['全部', '前锋', '中场', '后卫', '门将'].map(f => `<button class="${f === filter ? 'active' : ''}" data-filter="${f}">${f}</button>`).join('');
  document.querySelectorAll('[data-filter]').forEach(b => b.onclick = () => { filter = b.dataset.filter; render(); });
  const groups = { '前锋': ['ST', 'LW', 'RW'], '中场': ['CM', 'CAM', 'CDM', 'LM', 'RM'], '后卫': ['LB', 'RB', 'CB'], '门将': ['GK'] };
  const visible = pool && s.drawPhase === 'ready' && !spinning;
  document.querySelectorAll('[data-filter]').forEach(b=>b.disabled=!visible||uiBusy());
  $('players').innerHTML = visible ? pool.players.filter(p => filter === '全部' || p.positions.some(v => groups[filter].includes(v))).sort((a, b) => b.rating - a.rating).map(p => {
    const taken = s.picks.some(x => x?.identity === p.identity), blocked = lockedIds.has(p.id);
    return `<button class="player-card ${tierClass(p.tier)} ${placement?.playerId === p.id ? 'is-chosen' : ''}" data-player="${esc(p.id)}" aria-pressed="${placement?.playerId === p.id}" ${taken || blocked || uiBusy() || s.picks.every(Boolean) ? 'disabled' : ''} title="${esc(`${p.name} · ${heightLabel(p)} · ${positionList(p.positions)}`)}">
      ${energy(p)}<span class="avatar" aria-hidden="true">${playerSilhouette()}</span><span class="player-info"><span class="name">${esc(p.name)}</span><small class="player-height">${heightLabel(p)}</small><small class="player-positions">${positionList(p.positions)}</small><small class="player-base-rating">初始能力 <b>${p.rating}</b></small>${blocked ? '<small class="opponent-lock">🔒 对手已锁定此版本</small>' : taken ? '<small>已入队</small>' : ''}</span><span class="tier">${p.tier}</span></button>`;
  }).join('') : `<div class="spin-placeholder"><b>${spinning ? '球队与年代抽选中…' : s.picks.every(Boolean) ? '阵容已完成' : s.started ? '等待你按下 SPIN' : '先选择征战年代'}</b><p>${spinning ? '停下后才会揭晓本轮球员。' : '每次手动抽取一组，选人后不会自动跳到下一组。'}</p></div>`;
  document.querySelectorAll('[data-player]').forEach(b => b.onclick = () => {
    try {
      if(uiBusy())return;
      placement = placement?.playerId === b.dataset.player ? null : selectCandidate(s, b.dataset.player, [...lockedIds]);
      render();
      if (placement && matchMedia('(max-width: 850px)').matches) $('pitch').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
    } catch (e) { notify(e.message); }
  });
}
function showPlacementHint(text) {
  $('placement-status').innerHTML = `<span>${esc(text)}</span>${placement ? '<button id="cancel-placement">取消试位</button>' : ''}`;
  if ($('cancel-placement')) $('cancel-placement').onclick = () => { placement = null; render(); };
}
function drawBanner(pool){
  $('team-name').textContent=pool?.team||(s.started?'等待 SPIN':'选择你的征战年代');$('crest').textContent=pool?.flag||'⚽';
  $('era').textContent=pool?`年代 / ${pool.era} · ${eraById(pool.eraId).label}`:'球队与具体年代将分别揭晓';
}
async function beginSpin(paid){
  if(uiBusy()||!s.started)return;
  let outcome;
  try{
    const base=paid?reroll(s):s;outcome=spinDraft(base,Math.random,[...lockedIds]);s=base;
    placement=null;spinning=true;spinFrame=null;const token=++spinToken;save();
    const choices=availablePools(s,[...lockedIds]);const frames=matchMedia('(prefers-reduced-motion: reduce)').matches?3:22;
    const offset=Math.floor(Math.random()*choices.length);
    for(let i=0;i<frames;i++){
      if(token!==spinToken)return;
      spinFrame=choices[(offset+i)%choices.length];drawBanner(spinFrame);
      await new Promise(resolve=>setTimeout(resolve,frames===3?100:45+Math.round(180*(i/(frames-1))**3)));
    }
    if(token!==spinToken)return;
    spinning=false;spinFrame=null;s=outcome;save();
    document.querySelector('.draw').classList.remove('is-spinning');
  }catch(e){spinning=false;spinFrame=null;render();notify(e.message);}
}
const playerNames=new Map(pools.flatMap(p=>p.players).map(p=>[p.identity,p.name]));
function renderChemistry(){
  const pairs=activeChemistry(s.picks);
  $('chemistry-panel').innerHTML=`<div class="chemistry-heading"><b>🔗 阵容羁绊 <span>${pairs.length} 组</span></b><button id="chemistry-help">查看搭档</button></div>${pairs.length?pairs.map(p=>`<div class="chemistry-link"><span>${p.players.map(id=>esc(playerNames.get(id))).join(' × ')}</span><small>双方 +${p.bonus}</small></div>`).join(''):'<p class="hint">选中真实历史搭档，双方获得能力加成；每人最多 +3。</p>'}`;
  $('chemistry-help').onclick=()=>modal(`<h2>历史搭档 · 阵容羁绊</h2><p>首发或替补同时入队即可激活，双方各 +2；多组叠加时每人最多 +3，能力上限 100。达到门槛会升级评级与边框。不同球队／年代版本也可搭配，依据的是双方真实同队经历，不代表私人关系测量。</p>${chemistryPairs.map(p=>`<div class="chemistry-link"><span>${p.players.map(id=>esc(playerNames.get(id))).join(' × ')}</span><small>${p.name} · +${p.bonus}</small></div>`).join('')}<p><a href="docs/chemistry-research.md" target="_blank" rel="noopener">历史比赛依据与规则说明 ↗</a></p>`);
}
function setupUI() {
  if(uiBusy())return;
  const locked = s.started;
  modal(`<span class="eyebrow">BEFORE KICK-OFF</span><h2>${locked ? '本局年代设置已锁定' : '这支球队，将在哪个年代征战？'}</h2>
    <p>征战年代决定比赛的战术环境。下方 Lock 只排除抽选来源，不会改变征战年代。</p>
    <label for="target-era">征战年代</label><select id="target-era" ${locked ? 'disabled' : ''}>${eras.map(e => `<option value="${e.id}" ${e.id === s.targetEra ? 'selected' : ''}>${e.label}</option>`).join('')}</select>
    <h3>排除球员年代 <small>可不选；至少保留一个</small></h3><div class="era-grid">${eras.map(e => `<label class="era-option ${s.excludedEras.includes(e.id) ? 'locked' : ''}"><input type="checkbox" name="excluded" value="${e.id}" ${s.excludedEras.includes(e.id) ? 'checked' : ''} ${locked ? 'disabled' : ''}><span>${e.label}</span><small>LOCK / 排除</small></label>`).join('')}</div>
    <p class="hint">先等概率抽一个未排除年代，再抽该年代的一支球队。每次签下球员后等待下一次 Spin；自己阵容内不能重复选择同一人；双方只有抽到同一球队、同一年份的同一版本时才互相锁定。</p>
    <p class="hint">年代扣分只针对特定战术角色，最多 3 分；多数球员不扣分。范戴克跨年代不扣分。评级与扣分均为游戏估值。</p>
    <p id="setup-error" role="alert"></p><div class="setup-actions">${locked ? '<button id="setup-done" class="primary">继续本局</button>' : '<button id="start-draft" class="primary">锁定设置 · 开始选秀</button>'}</div>`);
  document.querySelectorAll('input[name="excluded"]').forEach(input => input.onchange = () => input.closest('label').classList.toggle('locked', input.checked));
  if (locked) $('setup-done').onclick = () => $('modal').close();
  else $('start-draft').onclick = () => {
    try {
      s = startDraft(s, $('target-era').value, [...document.querySelectorAll('input[name="excluded"]:checked')].map(i => i.value));
      placement = null; filter = '全部'; save(); $('modal').close();
    } catch (e) { $('setup-error').textContent = e.message; }
  };
}
function playerDetail(i) {
  const p = s.picks[i], pos = slots()[i];
  modal(`<h2>${esc(p.name)} <span class="tier">${playerTier(s,p)}${playerTier(s,p)!==p.tier?`（${p.tier} →）`:''}</span></h2><p>${esc(p.team)} · ${p.era} · ${heightLabel(p)} · 完全适应位置 ${positionList(p.positions)}</p>
    <div class="rating-details">${esc(adjustments(p, pos))}</div><p class="profile-note">${esc(eraAdjustment(p, s.targetEra).reason)}。跨年代模拟属于游戏设定，并非对球员真实表现的预测。</p>
    ${onlineLocked() ? '<p>阵容已提交赛季，本局无法再调整。</p>' : `<label for="move-slot">调整位置（有球员时交换）</label><select id="move-slot">${slots().map((v, n) => `<option value="${n}" ${n === i ? 'selected' : ''}>${n + 1}. ${positionName(v)} ${s.picks[n] ? esc(s.picks[n].name) : '空位'}</option>`).join('')}</select><div class="setup-actions"><button id="move-player" class="primary">确认调整</button><button id="remove-player">移出阵容</button></div>`}`);
  if (!onlineLocked()) {
    $('move-player').onclick = () => { const to=+$('move-slot').value, next={...s,picks:[...s.picks]}; [next.picks[i],next.picks[to]]=[next.picks[to],next.picks[i]]; $('modal').close(); commitRoster(next); };
    $('remove-player').onclick = () => { const next={...s,picks:[...s.picks]}; next.picks[i]=null; if(next.drawPhase==='complete')next.drawPhase='awaiting'; $('modal').close(); commitRoster(next); };
  }
}
function reset(mode = s.mode) {
  if(uiBusy())return;
  if (room) return notify('请先在联机面板离开当前房间，再开启新一局。');
  if (s.started && !confirm('开启新一局会清空当前阵容并重新选择年代，继续吗？')) return;
  s = freshState(mode); placement = null; filter = '全部'; save(); setupUI();
}
$('close').onclick = () => $('modal').close();
$('setup').onclick = setupUI;
$('spin').onclick = () => beginSpin(false);
$('roll').onclick = () => beginSpin(true);
$('formation').onchange = e => { if (!onlineLocked()&&!uiBusy()) commitRoster({...s,formation:e.target.value}); };
$('wc').onclick = () => s.mode !== 'world_cup' && reset('world_cup');
$('ucl').onclick = () => s.mode !== 'ucl' && reset('ucl');
$('reset').onclick = () => reset();
$('rules').onclick = () => modal(`<h2>更多年代，更多选择</h2><p>收录 ${pools.length} 支年代球队、${pools.reduce((n, p) => n + p.players.length, 0)} 条球员年代记录，覆盖 12 个年代区间。球员库为精选真实阵容，非完整官方注册名单；评分参考该赛季表现，属于人工估值。</p>
  <div class="tier-legend">${[['S+', '99–100'], ['S', '94–98'], ['A', '88–93'], ['B', '82–87'], ['C', '75–81'], ['D', '1–74']].map(([t, r]) => `<span class="${tierClass(t)}">${t} ${r}</span>`).join('')}</div><p>每支来源球队最多 3 名 S／S+ 球员；玩家跨球队组建的梦之队不受该数量限制。候选卡显示姓名、身高、位置、原始评级和初始能力；入队后按位置、年代和羁绊计算实际能力。先点球员，再点空位查看半透明试位与实际能力，第二次点同一空位才正式签下。试位不会消耗选人或重转次数，也不会提前提交联机。每轮先按 Spin，停下后才显示候选；确认入队后等待下一次手动 Spin。</p>
  <p>球员的多个首选位置全部不扣分；邻近位置扣 4 分，其他外场位置扣 12 分，门将错位扣 45 分。年代调整另外扣 0–3 分。点击阵中球员查看计算、换位或移除。</p>
  <p>赛前确定征战年代及排除年代，开局后锁定。赛季采用自定义 16 队杯赛：四组各四队，小组赛三轮后前二晋级，随后四分之一决赛、半决赛、决赛，均单场决胜。替补暂不自动换人。联机双方分别位于 A、C 组不同半区，只有都晋级才能在决赛会师；共同保存赛季种子与轮次。</p>
  <p>角色适配参考公开历史比赛位置资料；跨年代结果无法客观测量。<a href="docs/era-research.md" target="_blank" rel="noopener">研究来源与建模说明 ↗</a></p>`);
let tournament=null, seasonCursor=0, seasonBusy=false, seasonRoom=null, seasonPage=null, seasonReveal=null, autoRunning=false, autoToken=0, seasonFailure='';
let finalSession=null,finalTimer=null,finalBusy=false,finalFinishing=false,finalFinishTimer=null;
const currentFinalFrame=()=>finalSession&&!finalSession.completed&&seasonCursor<6?finalFrame(tournament.phases[5].matches[0],finalSession):null;
const defaultSeasonPage=()=>seasonCursor===5?5:Math.max(0,seasonCursor-1);
function stopAuto(){autoRunning=false;autoToken++;seasonReveal=null;if(seasonVisible())paintSeason();}
const localSeasonKey='era-fc-season-v4';
const draftFingerprint=()=>JSON.stringify({mode:s.mode,target:s.targetEra,formation:s.formation,picks:networkState(s).picks});
function paintSeason(error=seasonFailure){
 seasonFailure=error;
 if(!tournament)return;
 if($('modal').open)$('modal').close();
 renderSeason(tournament,seasonCursor,{online:Boolean(seasonRoom),pending:seasonBusy||finalBusy,live:currentFinalFrame(),onKick:kickFinal,autoRunning,phaseIndex:seasonPage??defaultSeasonPage(),reveal:seasonReveal,error,onNext:()=>advanceSeason(),onAuto:runAuto,onStop:stopAuto,onSkip:skipSeason,onPage:index=>{seasonPage=index;paintSeason();window.scrollTo(0,0);},onExit:stopAuto});
}
function openLocalSeason(){
 const fingerprint=draftFingerprint(),stored=read(localSeasonKey,null);
 if(stored?.fingerprint===fingerprint&&stored?.version===4){tournament=stored.cursor===6?stored.tournament:prepareFinal(stored.tournament);finalSession=stored.finalSession||null;seasonCursor=Math.max(0,Math.min(6,stored.cursor));}
 else{finalSession=null;tournament=createTournament({mode:s.mode,seed:crypto.getRandomValues(new Uint32Array(1))[0],humans:[draftTeam(s,'host','我的梦之队')]});seasonCursor=0;}
 seasonRoom=null;seasonPage=defaultSeasonPage();persistSeason();paintSeason();if(currentFinalFrame())ensureFinalTimer();
}
function persistSeason(){if(!seasonRoom)localStorage.setItem(localSeasonKey,JSON.stringify({version:4,fingerprint:draftFingerprint(),tournament,cursor:seasonCursor,finalSession}));}
async function syncOnlineSeason(open=false){
 const code=room;if(!code)return;
 const state=await rpc('fc_season_v4',{p_code:code,p_expected:null});if(room!==code)return;
 if(seasonRoom!==code||tournament?.seed!==state.seed){
  finalSession=null;clearInterval(finalTimer);finalTimer=null;
  const members=remote.members.filter(m=>m.state).sort((a,b)=>Number(b.host)-Number(a.host));
  if(members.length!==2)return;
  tournament=createTournament({mode:s.mode,seed:state.seed,humans:members.map(m=>draftTeam(m.state,m.host?'host':'guest',m.host?'房主梦之队':'客队梦之队',true))});seasonCursor=0;seasonRoom=code;sessionStorage.setItem('era-fc-season-room-v4',code);
 }
 const changed=seasonCursor!==state.cursor;seasonCursor=Math.max(seasonCursor,state.cursor);
 if(state.cursor===5){try{const data=await rpc('fc_final_v5',{p_code:code,p_action:'read',p_expected:null});if(data.live)applyFinalData(data);}catch{/* Old projects can upgrade when starting the final. */}}
 if(state.cursor===6&&finalSession){finalSession.completed=true;clearInterval(finalTimer);finalTimer=null;}
 if(changed&&!autoRunning)seasonPage=defaultSeasonPage();
 if(open||(changed&&seasonVisible()))paintSeason();
}
async function advanceSeason(animate=false,token=autoToken){
 if(seasonBusy||seasonCursor>=6)return false;if(seasonCursor===5&&!animate)return startFinal();seasonBusy=true;let failure='';seasonFailure='';paintSeason();
 try{
  if(seasonRoom){const code=seasonRoom,data=await rpc('fc_season_v4',{p_code:code,p_expected:seasonCursor});if(room!==code)return false;seasonCursor=Math.max(seasonCursor,data.cursor);}
  else{seasonCursor++;persistSeason();}
  seasonPage=seasonCursor-1;
  if(animate){
   seasonReveal={phase:seasonPage,count:0};paintSeason();
   const total=tournament.phases[seasonPage].matches.length;
   for(let i=1;i<=total;i++){
    await new Promise(resolve=>setTimeout(resolve,300));
    if(token!==autoToken||!seasonVisible())break;
    seasonReveal={phase:seasonPage,count:i};paintSeason();
   }
  }
  return true;
 }catch(e){failure=readableError(e);return false;}
 finally{seasonReveal=null;seasonBusy=false;if(seasonCursor===5)seasonPage=5;if(seasonVisible())paintSeason(failure);}
}
async function runAuto(){
 if(autoRunning||seasonBusy||seasonCursor>=5)return;
 autoRunning=true;const token=++autoToken;paintSeason();
 try{while(autoRunning&&token===autoToken&&seasonCursor<5&&seasonVisible()){if(!await advanceSeason(true,token))break;}}
 finally{if(token===autoToken){autoRunning=false;if(seasonCursor===5)seasonPage=5;if(seasonVisible())paintSeason();}}
}
function skipSeason(){
 if(seasonRoom||seasonBusy||autoRunning||currentFinalFrame())return;
 seasonCursor=6;seasonPage=5;persistSeason();paintSeason();window.scrollTo(0,0);
}
function applyFinalData(data){
 if(!data.live)return;
 const before=Boolean(currentFinalFrame());
 const same=finalSession?.serverStartedAt===Number(data.live.started_at);
 finalSession={serverStartedAt:Number(data.live.started_at),startedAt:same?finalSession.startedAt:Number(data.live.started_at)+Date.now()-Number(data.server_now),kicks:same?Math.max(finalSession.kicks,Number(data.live.kicks)):Number(data.live.kicks),completed:Boolean(data.live.completed)||(same&&finalSession.completed)};
 if(finalSession.completed){seasonCursor=6;seasonPage=5;clearInterval(finalTimer);finalTimer=null;}
 if(!finalSession.completed){seasonPage=5;ensureFinalTimer();if(!before&&seasonVisible()){paintSeason();document.querySelector('.final-live')?.scrollIntoView({block:'start'});}}
}
function ensureFinalTimer(){if(!finalTimer)finalTimer=setInterval(tickFinal,80);}
function tickFinal(){
 const frame=currentFinalFrame();if(!frame){clearInterval(finalTimer);finalTimer=null;return;}
 if(seasonVisible())updateFinalLive(tournament,frame,kickFinal,finalBusy);
 if(frame.complete&&!finalFinishing&&!finalFinishTimer)finalFinishTimer=setTimeout(()=>{finalFinishTimer=null;finishFinal();},700);
}
async function startFinal(){
 if(seasonBusy||currentFinalFrame())return;
 seasonBusy=true;seasonFailure='';let upgrade=false;paintSeason();
 try{
  if(seasonRoom)applyFinalData(await rpc('fc_final_v5',{p_code:seasonRoom,p_action:'start',p_expected:null}));
  else{finalSession={startedAt:Date.now(),kicks:0,completed:false};persistSeason();}
  seasonPage=5;ensureFinalTimer();
 }catch(e){seasonFailure=readableError(e);if(e.code==='PGRST202'||e.status===404){upgrade=true;onlineUI();status('决赛直播需要运行一次最新合并升级 SQL（含之前所有升级）。');showUpgradeHelp();}}
 finally{seasonBusy=false;if(!upgrade){paintSeason();if(currentFinalFrame())document.querySelector('.final-live')?.scrollIntoView({block:'start'});}}
}
async function kickFinal(){
 const frame=currentFinalFrame();if(finalBusy||!frame?.penalty||frame.complete)return;
 finalBusy=true;updateFinalLive(tournament,frame,kickFinal,true);
 try{
  if(seasonRoom)applyFinalData(await rpc('fc_final_v5',{p_code:seasonRoom,p_action:'kick',p_expected:frame.kicks}));
  else{finalSession.kicks++;persistSeason();}
 }catch(e){seasonFailure=readableError(e);paintSeason();}
 finally{finalBusy=false;tickFinal();}
}
async function finishFinal(){
 if(finalFinishing||!currentFinalFrame()?.complete)return;finalFinishing=true;
 try{
  if(seasonRoom)await rpc('fc_final_v5',{p_code:seasonRoom,p_action:'finish',p_expected:null});
  finalSession.completed=true;seasonCursor=6;seasonPage=5;persistSeason();clearInterval(finalTimer);finalTimer=null;if(seasonVisible())paintSeason();
 }catch(e){seasonFailure=readableError(e);if(seasonVisible())paintSeason();}
 finally{finalFinishing=false;}
}
$('simulate').onclick=async()=>{
 if(s.picks.some(p=>!p))return;
 if(!room){openLocalSeason();return;}
 if(!remote?.result){onlineUI();return;}
 try{await syncOnlineSeason(true);}catch(e){onlineUI();status('赛季功能需要一次数据库升级，请复制合并升级 SQL。');showUpgradeHelp();}
};

let authPending = null, sessionExpired = false;
async function auth() {
  if (sessionExpired && room) throw Error('登录已过期，请离开当前房间并创建新房间。');
  if (authSession?.url === config.url && authSession.expires_at * 1000 > Date.now() + 60000) return;
  if (authPending) return authPending;
  authPending = (async () => {
    let result;
    if (authSession?.url === config.url && authSession.refresh_token) {
      try {
        result = await request(config, '/auth/v1/token?grant_type=refresh_token', { refresh_token: authSession.refresh_token });
      } catch (e) {
        if (e.status !== 400 && e.status !== 401 && e.status !== 403) throw e;
        authSession = null; sessionStorage.removeItem('era-fc-auth-v2');
        if (room) { sessionExpired = true; throw Error('登录已过期，请离开当前房间并创建新房间。'); }
      }
    }
    if (!result) result = await request(config, '/auth/v1/signup', {});
    if (!result.access_token) throw Error('匿名登录未成功，请检查项目的 Anonymous Sign-Ins 设置。');
    sessionExpired = false;
    authSession = { ...result, expires_at: result.expires_at || Math.floor(Date.now() / 1000) + result.expires_in, url: config.url };
    sessionStorage.setItem('era-fc-auth-v2', JSON.stringify(authSession));
  })();
  try { await authPending; } finally { authPending = null; }
}
async function rpc(name, body) { await auth(); return request(config, `/rest/v1/rpc/${name}`, body, authSession.access_token); }
function onlineUI() {
  modal(`<h2>联机 · 和朋友争夺冠军</h2><p>房主先完成赛前设置，双方将使用同样的征战年代与排除年代。选满 16 人后阵容锁定，自动进入共同杯赛，双方分属不同半区。</p>
    ${room ? '' : '<input id="code" aria-label="房间码" placeholder="朋友的 8 位房间码" maxlength="8">'}
    <div class="setup-actions">${room ? '<button id="leave">离开房间</button>' : '<button class="primary" id="create">创建房间</button><button id="join">加入房间</button>'}</div>
    <p id="status" role="status">${esc(roomMessage || '尚未连接，可以先玩本地选秀。')}</p><details><summary>连接设置</summary><label for="url">项目 URL</label><input id="url" value="${esc(config.url)}" ${room ? 'disabled' : ''}><label for="key">Publishable / anon public key</label><input id="key" value="${esc(config.key)}" ${room ? 'disabled' : ''}></details>
    <p class="hint">每 1.5 秒同步。朋友间试玩版本；同一浏览器测试请使用独立无痕窗口。离开后不自动释放旧房间名额，新一局请创建新房间。</p>`);
  if (room) $('leave').onclick = () => { disconnect(); notify('已离开房间。可以继续本地选秀，或重新开始。'); };
  else { $('create').onclick = () => connect(true); $('join').onclick = () => connect(false); }
}
$('online').onclick = onlineUI;
function disconnect() {
  sessionStorage.removeItem('era-fc-season-room-v4');closeSeason();seasonRoom=null;
  placement = null; roomGeneration++; spinToken++; spinning=false; spinFrame=null; clearInterval(timer); timer = null; room = null; remote = null; lockedIds=new Set(); shownResult = false;
  sessionExpired = false; status(''); render();
}
function readableError(e) {
  if(e.message?.includes('FC_PLAYER_LOCKED'))return '这个球队年代版本已被对手抢先锁定，请选择其他球员。';
  if(e.message?.includes('FC_RULES_MISMATCH'))return '房间使用了旧版规则，请双方刷新并创建新房间。';
  if(e.message?.includes('FC_STALE_STATE'))return '阵容状态已变化，已重新同步，请再确认你的选择。';
  return e.message || '连接暂时中断，请稍后重试。';
}
async function submitSnapshot(next, requestId=crypto.randomUUID()) {
  const args={p_code:room,p_state:networkState(next),p_revision:serverRevision,p_request_id:requestId};
  let result;
  try { result=await rpc('fc_submit_v3',args); }
  catch(e) { if(e.status && e.status<500)throw e; result=await rpc('fc_submit_v3',args); }
  serverRevision=result.revision;
  return result;
}
async function commitRoster(next, impactIndex = null) {
  if(uiBusy())return;
  if(!room){s=next;placement=null;if(impactIndex!==null&&playerTier(s,s.picks[impactIndex])==='S+')startLandingImpact(impactIndex);save();return;}
  committing=true;render();const generation=roomGeneration;
  try {
    await submitSnapshot(next);
    if(generation!==roomGeneration)return;
    s=next;placement=null;if(impactIndex!==null&&playerTier(s,s.picks[impactIndex])==='S+')startLandingImpact(impactIndex);save();
  } catch(e) {
    placement=null;
    if(e.message?.includes('FC_PLAYER_LOCKED')&&e.details)lockedIds.add(e.details);
    if(e.message?.includes('FC_STALE_STATE')){
      try { const latest=await rpc('fc_read_v3',{p_code:room});const mine=latest.members.find(m=>m.is_self);if(mine?.state){s=hydrateState(mine.state);serverRevision=mine.revision;} }catch{}
    }
    if(e.message?.includes('FC_INVALID_FORMATION')){onlineUI();status('新进攻阵型需要更新数据库，请运行最新合并升级 SQL 后重试。');showUpgradeHelp();}else{status(readableError(e));notify(readableError(e));}
  } finally {committing=false;render();}
}
async function connect(create) {
  if(uiBusy()||room)return;
  if(create&&!s.started){setupUI();return;}
  const code=$('code')?.value.trim().toUpperCase()||'';
  if(!create&&!/^[A-F0-9]{8}$/.test(code))return status('请输入 8 位房间码。');
  if(s.picks.some(Boolean)&&!confirm('进入联机将使用房间阵容。新建房间会重新开始选人，继续吗？'))return;
  const preferredFormation=s.formation;busy=true;
  try{
    config=validatePublicConfig({url:$('url').value,key:$('key').value});localStorage.setItem('era-fc-cloud',JSON.stringify(config));
    $('create').disabled=true;$('join').disabled=true;status('正在连接…');
    try{await rpc('fc_protocol_v3',{});}catch(e){if(e.code==='PGRST202'||e.status===404)throw Error('新联机规则需要执行一次数据库升级 SQL。');throw e;}
    const d=await rpc('fc_connect_v3',{p_code:create?null:code,p_mode:s.mode});
    room=d.code;roomGeneration++;shownResult=false;serverRevision=0;
    const initial=await rpc('fc_read_v3',{p_code:room});remote=initial;
    lockedIds=new Set(initial.locks.filter(l=>!l.mine).map(l=>l.player_id));
    const mine=initial.members.find(m=>m.is_self);
    if(mine?.state){s=hydrateState(mine.state);serverRevision=mine.revision;}
    else{
      let targetEra=s.targetEra,excludedEras=s.excludedEras;
      if(!create){const host=initial.members.find(m=>m.host)?.state;if(!host?.started||host.lockProtocol!==3)throw Error('房主规则尚未同步，请稍后再加入。');targetEra=host.targetEra;excludedEras=host.excludedEras;}
      s=startDraft(freshState(d.mode),targetEra,excludedEras);s.formation=preferredFormation;
      await submitSnapshot(s);
    }
    placement=null;filter='全部';save();status(`房间 ${room} · 征战 ${eraById(s.targetEra).label} · 请按 Spin 开始抽选。`);
    timer=setInterval(poll,1500);onlineUI();
  }catch(e){if(room)disconnect();status(`连接失败：${readableError(e)}`);if($('create')){$('create').disabled=false;$('join').disabled=false;}if(e.message.includes('数据库升级'))showUpgradeHelp();}
  finally{busy=false;render();}
}
async function poll() {
  if(polling||!room)return;polling=true;const generation=roomGeneration;
  try{
    const d=await rpc('fc_read_v3',{p_code:room});if(generation!==roomGeneration)return;remote=d;
    const previousLocks=[...lockedIds].sort().join('|');
    lockedIds=new Set(d.locks.filter(l=>!l.mine).map(l=>l.player_id));
    const locksChanged=previousLocks!==[...lockedIds].sort().join('|');
    const candidate=candidateFor(s,placement), lost=candidate&&lockedIds.has(candidate.id);
    if(lost)placement=null;
    const ready=d.members.filter(m=>m.state?.picks?.filter(Boolean).length===16).length;
    status(lost?'你正在试位的版本已被对手锁定，请改选。':`房间 ${room} · ${d.members.length}/2 人已加入 · ${ready}/2 阵容完成 · 征战 ${eraById(s.targetEra).label}`);
    if(s.drawPhase==='ready'&&!spinning){const pool=poolById(s.pool);if(pool&&!pool.players.some(p=>!lockedIds.has(p.id)&&!s.picks.some(x=>x?.identity===p.identity))){s={...s,drawPhase:'awaiting'};placement=null;save();status('本组可选版本已全部锁定，请免费 Spin 下一组。');}}
    if(locksChanged||lost)render();
    if(d.result){const open=!shownResult;shownResult=true;try{await syncOnlineSeason(open);}catch(e){if(open){onlineUI();status('联机赛季需要执行一次合并升级 SQL。');showUpgradeHelp();}}}
  }catch(e){if(generation===roomGeneration)status(`房间 ${room} · 暂未同步：${readableError(e)}`);}
  finally{polling=false;}
}
function showUpgradeHelp(){
  if(!$('status'))return;
  const p=document.createElement('p');p.className='hint';p.innerHTML='<a href="supabase/upgrade-all-v5.sql" target="_blank" rel="noopener">打开合并升级 SQL（含全部历史升级）</a> · <button id="copy-upgrade">复制升级 SQL</button>，粘贴到 Supabase SQL Editor 后运行，再重新连接。';$('status').after(p);
  $('copy-upgrade').onclick=async()=>{try{const r=await fetch('supabase/upgrade-all-v5.sql');if(!r.ok)throw Error();await navigator.clipboard.writeText(await r.text());$('copy-upgrade').textContent='已复制';}catch{$('copy-upgrade').textContent='请打开链接复制原文';}};
}
$('formation').innerHTML = formationChoices.map(f => `<option value="${f}">${formationName(f)}</option>`).join('');
render();

if(location.hash==='#season'&&s.picks.every(Boolean)){
 const resume=sessionStorage.getItem('era-fc-season-room-v4');
 if(resume){(async()=>{try{const d=await rpc('fc_read_v3',{p_code:resume});room=resume;roomGeneration++;remote=d;const mine=d.members.find(m=>m.is_self);s=hydrateState(mine.state);serverRevision=mine.revision;shownResult=true;save();await syncOnlineSeason(true);timer=setInterval(poll,1500);}catch(e){closeSeason();notify('恢复联机赛季失败，请检查网络后刷新。'+readableError(e));}})();}
 else{try{openLocalSeason();}catch{closeSeason();}}
}
