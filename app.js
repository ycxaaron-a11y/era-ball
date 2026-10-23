import { positionName, positionList, heightLabel } from './display.js';
import { candidateFor, selectCandidate, placeCandidate } from './placement.js';
import { cloudConfig } from './config.js';
import { pools, poolById, eras, eraById, positions, formations, fit, strength, season,
  tierClass, eraAdjustment, positionPenalty, freshState, hydrateState, startDraft, reroll, networkState } from './data.js';
import { request, validatePublicConfig } from './multiplayer.js';

const $ = id => document.getElementById(id);
const storage = 'era-fc-v2';
const read = (key, fallback, source = localStorage) => { try { return JSON.parse(source.getItem(key)) ?? fallback; } catch { return fallback; } };
let s = hydrateState(read(storage, null));
let placement = null, filter = '全部';
let room = null, timer = null, remote = null, busy = false, polling = false, shownResult = false;
let pendingState = null, sending = false, roomGeneration = 0, roomMessage = '';
let config = { ...cloudConfig, ...read('era-fc-cloud', {}) };
let authSession = read('era-fc-auth-v2', null, sessionStorage);
const esc = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const onlineLocked = () => Boolean(room && s.picks.every(Boolean));
const slots = () => [...positions(s.formation), ...Array(5).fill('SUB')];
function modal(html) { $('modal-body').innerHTML = html; if (!$('modal').open) $('modal').showModal(); }
function notify(t) { modal(`<h2>提示</h2><p>${esc(t)}</p>`); }
function status(t) { roomMessage = t; $('room-status').textContent = t; if ($('status')) $('status').textContent = t; }
function save() {
  localStorage.setItem(storage, JSON.stringify(s)); render();
  if (room) { pendingState = networkState(s); flush(); }
}
function adjustments(p, pos) {
  const a = eraAdjustment(p, s.targetEra), penalty = positionPenalty(p, pos);
  return `基础 ${p.rating} · 位置 −${penalty} · 年代 −${a.penalty} = ${fit(p, pos, s.targetEra)}；${a.reason}`;
}
function energy(p) { return p?.tier === 'S+' ? '<span class="splus-energy" aria-hidden="true"></span>' : ''; }
function slot(p, i, pos, xy) {
  const preview = !p && placement?.slot === i ? candidateFor(s, placement) : null;
  const shown = p || preview;
  const title = shown ? `${shown.name} · ${positionList(shown.positions)} · ${adjustments(shown, pos)}${preview ? '；再点同一位置确认' : ''}` : `空位：${positionName(pos)}`;
  return `<button class="slot ${shown ? tierClass(shown.tier) : ''} ${preview ? 'slot-preview selected' : ''} ${placement && !p ? 'can-place' : ''}" data-slot="${i}" ${xy ? `style="left:${xy[0]}%;top:${xy[1]}%"` : ''} title="${esc(title)}" aria-label="${esc(title)}">
    ${shown ? `${energy(shown)}<em>${fit(shown, pos, s.targetEra)}</em><span class="${preview ? 'preview-player' : 'placed-player'}"><b>${esc(shown.name)}</b><small class="player-height">${heightLabel(shown)}</small><small>${positionName(pos)} · ${shown.tier}</small></span>${preview ? '<small class="confirm-label">再点确认</small>' : ''}` : `<span class="plus">＋</span><small>${positionName(pos)}</small>`}</button>`;
}
function render() {
  const pool = poolById(s.pool);
  $('wc').classList.toggle('active', s.mode === 'world_cup'); $('ucl').classList.toggle('active', s.mode === 'ucl');
  $('formation').value = s.formation; $('formation').disabled = onlineLocked();
  let index = 0;
  $('pitch').innerHTML = formations[s.formation].map((row, r) => row.map((pos, c) => slot(s.picks[index], index++, pos, [100 * (c + 1) / (row.length + 1), 14 + r * 24])).join('')).join('');
  $('bench').innerHTML = s.picks.slice(11).map((p, i) => slot(p, i + 11, 'SUB')).join('');
  document.querySelectorAll('[data-slot]').forEach(el => el.onclick = () => {
    if (!s.started) return setupUI();
    const i = +el.dataset.slot;
    if (s.picks[i]) return placement ? showPlacementHint('这个位置已有球员，请选择空位。') : playerDetail(i);
    try {
      const result = placeCandidate(s, placement, i);
      s = result.state; placement = result.placement;
      if (result.confirmed) save(); else render();
    } catch (e) { showPlacementHint(e.message); }
  });
  const candidate = candidateFor(s, placement);
  showPlacementHint(candidate ? (placement.slot === null ? `已选 ${candidate.name}，点击一个空位预览上场能力。` : `${candidate.name} 正在试位：${positionName(slots()[placement.slot])}。再点同一位置确认，也可改点其他空位。`) : '先选球员 → 点击空位预览 → 再点同一空位确认。');
  $('count').textContent = `${s.picks.filter(Boolean).length} / 16`;
  $('rating').textContent = s.picks.slice(0, 11).some(Boolean) ? strength(s).toFixed(1) : '—';
  $('team-name').textContent = pool?.team || '选择你的征战年代'; $('crest').textContent = pool?.flag || '⚽';
  $('era').textContent = pool ? `ERA / ${pool.era} · ${eraById(pool.eraId).label}` : '开启一场跨年代选秀';
  $('mode-label').textContent = s.mode === 'ucl' ? 'EUROPEAN CUP / CHAMPIONS LEAGUE' : 'FIFA WORLD CUP';
  $('rerolls').textContent = `剩余 ${s.rerolls} / 3 次`;
  $('roll').disabled = !s.started || s.rerolls === 0 || s.picks.every(Boolean);
  $('simulate').disabled = s.picks.some(p => !p);
  $('simulate').textContent = room ? '查看联机决赛 ↗' : '模拟赛季 ↗';
  $('pool-count').textContent = pool ? `${pool.players.length} 位球员` : `${pools.filter(p => p.mode === s.mode).length} 支年代球队`;
  $('era-settings').innerHTML = `<div class="setup-summary"><span class="eyebrow">MATCH ERA</span><strong>${s.started ? `${eraById(s.targetEra).label} · 已锁定` : '赛前选择征战年代'}</strong><span>${s.started ? `排除 ${s.excludedEras.length} 个年代 · ${12 - s.excludedEras.length} 个年代可抽选` : '12 个年代 · 可排除不想抽到的年代'}</span></div><button id="era-open">${s.started ? '查看本局设置' : '设置并开始选秀 →'}</button>`;
  $('era-open').onclick = setupUI;
  $('filters').innerHTML = ['全部', '前锋', '中场', '后卫', '门将'].map(f => `<button class="${f === filter ? 'active' : ''}" data-filter="${f}">${f}</button>`).join('');
  document.querySelectorAll('[data-filter]').forEach(b => b.onclick = () => { filter = b.dataset.filter; render(); });
  const groups = { '前锋': ['ST', 'LW', 'RW'], '中场': ['CM', 'CAM', 'CDM', 'LM', 'RM'], '后卫': ['LB', 'RB', 'CB'], '门将': ['GK'] };
  $('players').innerHTML = pool ? pool.players.filter(p => filter === '全部' || p.positions.some(v => groups[filter].includes(v))).sort((a, b) => b.rating - a.rating).map(p => {
    const taken = s.picks.some(x => x?.identity === p.identity);
    return `<button class="player-card ${tierClass(p.tier)} ${placement?.playerId === p.id ? 'is-chosen' : ''}" data-player="${esc(p.id)}" aria-pressed="${placement?.playerId === p.id}" ${taken || s.picks.every(Boolean) ? 'disabled' : ''} title="${esc(`${p.name} · ${heightLabel(p)} · ${positionList(p.positions)}`)}">
      ${energy(p)}<span class="avatar" aria-hidden="true"><span class="portrait-fallback">${p.name.replace(/·/g, '').slice(-2)}</span></span><span class="player-info"><span class="name">${esc(p.name)}</span><small class="player-height">${heightLabel(p)}</small><small class="player-positions">${positionList(p.positions)}</small>${taken ? '<small>已入队</small>' : ''}</span><span class="tier">${p.tier}</span></button>`;
  }).join('') : '<p class="hint">先确定本局征战年代，再开始抽取球队和球员。</p>';
  document.querySelectorAll('[data-player]').forEach(b => b.onclick = () => {
    try {
      placement = placement?.playerId === b.dataset.player ? null : selectCandidate(s, b.dataset.player);
      render();
      if (placement && matchMedia('(max-width: 850px)').matches) $('pitch').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
    } catch (e) { notify(e.message); }
  });
}
function showPlacementHint(text) {
  $('placement-status').innerHTML = `<span>${esc(text)}</span>${placement ? '<button id="cancel-placement">取消试位</button>' : ''}`;
  if ($('cancel-placement')) $('cancel-placement').onclick = () => { placement = null; render(); };
}
function setupUI() {
  const locked = s.started;
  modal(`<span class="eyebrow">BEFORE KICK-OFF</span><h2>${locked ? '本局年代设置已锁定' : '这支球队，将在哪个年代征战？'}</h2>
    <p>征战年代决定比赛的战术环境。下方 Lock 只排除抽选来源，不会改变征战年代。</p>
    <label for="target-era">征战年代</label><select id="target-era" ${locked ? 'disabled' : ''}>${eras.map(e => `<option value="${e.id}" ${e.id === s.targetEra ? 'selected' : ''}>${e.label}</option>`).join('')}</select>
    <h3>排除球员年代 <small>可不选；至少保留一个</small></h3><div class="era-grid">${eras.map(e => `<label class="era-option ${s.excludedEras.includes(e.id) ? 'locked' : ''}"><input type="checkbox" name="excluded" value="${e.id}" ${s.excludedEras.includes(e.id) ? 'checked' : ''} ${locked ? 'disabled' : ''}><span>${e.label}</span><small>LOCK / 排除</small></label>`).join('')}</div>
    <p class="hint">先等概率抽一个未排除年代，再抽该年代的一支球队。每次签下球员后自动抽下一组；同一球员跨年代不可重复入队。</p>
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
  modal(`<h2>${esc(p.name)} <span class="tier">${p.tier}</span></h2><p>${esc(p.team)} · ${p.era} · ${heightLabel(p)} · 完全适应位置 ${positionList(p.positions)}</p>
    <div class="rating-details">${esc(adjustments(p, pos))}</div><p class="profile-note">${esc(eraAdjustment(p, s.targetEra).reason)}。跨年代模拟属于游戏设定，并非对球员真实表现的预测。</p>
    ${onlineLocked() ? '<p>阵容已提交决赛，本局无法再调整。</p>' : `<label for="move-slot">调整位置（有球员时交换）</label><select id="move-slot">${slots().map((v, n) => `<option value="${n}" ${n === i ? 'selected' : ''}>${n + 1}. ${positionName(v)} ${s.picks[n] ? esc(s.picks[n].name) : '空位'}</option>`).join('')}</select><div class="setup-actions"><button id="move-player" class="primary">确认调整</button><button id="remove-player">移出阵容</button></div>`}`);
  if (!onlineLocked()) {
    $('move-player').onclick = () => { const to = +$('move-slot').value; [s.picks[i], s.picks[to]] = [s.picks[to], s.picks[i]]; placement = null; save(); $('modal').close(); };
    $('remove-player').onclick = () => { s.picks[i] = null; placement = null; save(); $('modal').close(); };
  }
}
function reset(mode = s.mode) {
  if (room) return notify('请先在联机面板离开当前房间，再开启新一局。');
  if (s.started && !confirm('开启新一局会清空当前阵容并重新选择年代，继续吗？')) return;
  s = freshState(mode); placement = null; filter = '全部'; save(); setupUI();
}
$('close').onclick = () => $('modal').close();
$('setup').onclick = setupUI;
$('roll').onclick = () => { try { s = reroll(s); placement = null; save(); } catch (e) { notify(e.message); } };
$('formation').onchange = e => { if (!onlineLocked()) { s.formation = e.target.value; placement = null; save(); } };
$('wc').onclick = () => s.mode !== 'world_cup' && reset('world_cup');
$('ucl').onclick = () => s.mode !== 'ucl' && reset('ucl');
$('reset').onclick = () => reset();
$('rules').onclick = () => modal(`<h2>更多年代，更多选择</h2><p>收录 ${pools.length} 支年代球队、${pools.reduce((n, p) => n + p.players.length, 0)} 条球员年代记录，覆盖 12 个年代区间。球员库为精选真实阵容，非完整官方注册名单；评分参考该赛季表现，属于人工估值。</p>
  <div class="tier-legend">${[['S+', '99–100'], ['S', '94–98'], ['A', '88–93'], ['B', '82–87'], ['C', '75–81'], ['D', '1–74']].map(([t, r]) => `<span class="${tierClass(t)}">${t} ${r}</span>`).join('')}</div><p>每支来源球队最多 3 名 S／S+ 球员；玩家跨球队组建的梦之队不受该数量限制。候选卡只显示姓名、身高、位置和评级。先点球员，再点空位查看半透明试位与实际能力，第二次点同一空位才正式签下。试位不会消耗选人或重转次数，也不会提前提交联机。</p>
  <p>球员的多个首选位置全部不扣分；邻近位置扣 4 分，其他外场位置扣 12 分，门将错位扣 45 分。年代调整另外扣 0–3 分。点击阵中球员查看计算、换位或移除。</p>
  <p>赛前确定征战年代及排除年代，开局后锁定。本地赛季为简化 6 轮联赛、半决赛与决赛；替补暂不自动换人。联机双方共享年代规则，签满 16 人后自动提交并锁定阵容；服务端生成双方共同的决赛结果。</p>
  <p>角色适配参考公开历史比赛位置资料；跨年代结果无法客观测量。<a href="docs/era-research.md" target="_blank" rel="noopener">研究来源与建模说明 ↗</a></p>`);
$('simulate').onclick = () => {
  if (s.picks.some(p => !p)) return;
  if (room) { if (remote?.result) showResult(remote.result); else onlineUI(); return; }
  const results = season(s), semi = results[6];
  const qualified = semi.home > semi.away || semi.penalties === '点球胜', played = qualified ? results : results.slice(0, 7);
  const last = played.at(-1), win = qualified && (last.home > last.away || last.penalties === '点球胜');
  modal(`<div class="trophy">${win ? '🏆' : '⚽'}</div><h2>${win ? '你的梦之队，登上巅峰！' : qualified ? '决赛惜败，传奇仍在继续' : '半决赛止步，再战下个赛季'}</h2><p>征战 ${eraById(s.targetEra).label} · 适配评分 ${strength(s).toFixed(1)} · 实力与随机因素共同决定赛果</p>${played.map(m => `<div class="match"><span>${m.stage} · 对手 ${m.opponent}</span><b>${m.home} : ${m.away} ${m.penalties || ''}</b></div>`).join('')}`);
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
  modal(`<h2>联机 · 和朋友争夺冠军</h2><p>房主先完成赛前设置，双方将使用同样的征战年代与排除年代。选满 16 人后阵容锁定，自动进入共同决赛。</p>
    ${room ? '' : '<input id="code" aria-label="房间码" placeholder="朋友的 8 位房间码" maxlength="8">'}
    <div class="setup-actions">${room ? '<button id="leave">离开房间</button>' : '<button class="primary" id="create">创建房间</button><button id="join">加入房间</button>'}</div>
    <p id="status" role="status">${esc(roomMessage || '尚未连接，可以先玩本地选秀。')}</p><details><summary>连接设置</summary><label for="url">项目 URL</label><input id="url" value="${esc(config.url)}" ${room ? 'disabled' : ''}><label for="key">Publishable / anon public key</label><input id="key" value="${esc(config.key)}" ${room ? 'disabled' : ''}></details>
    <p class="hint">每 2 秒同步。朋友间试玩版本；同一浏览器测试请使用独立无痕窗口。离开后不自动释放旧房间名额，新一局请创建新房间。</p>`);
  if (room) $('leave').onclick = () => { disconnect(); notify('已离开房间。可以继续本地选秀，或重新开始。'); };
  else { $('create').onclick = () => connect(true); $('join').onclick = () => connect(false); }
}
$('online').onclick = onlineUI;
function disconnect() {
  placement = null; roomGeneration++; clearInterval(timer); timer = null; room = null; remote = null; pendingState = null; shownResult = false;
  sessionExpired = false; status(''); render();
}
async function connect(create) {
  if (busy || room) return;
  if (create && !s.started) { setupUI(); return; }
  const code = $('code')?.value.trim().toUpperCase() || '';
  if (!create && !/^[A-F0-9]{8}$/.test(code)) return status('请输入 8 位房间码。');
  if (s.picks.some(Boolean) && !confirm('进入联机会开始新的阵容。房主保留本局年代规则，加入者采用房主规则。继续吗？')) return;
  busy = true;
  try {
    config = validatePublicConfig({ url: $('url').value, key: $('key').value });
    localStorage.setItem('era-fc-cloud', JSON.stringify(config));
    $('create').disabled = true; $('join').disabled = true; status('正在连接…');
    const d = await rpc('fc_connect', { p_code: create ? null : code, p_mode: s.mode });
    room = d.code; roomGeneration++; shownResult = false;
    let targetEra = s.targetEra, excludedEras = s.excludedEras;
    if (!create) {
      const initial = await rpc('fc_read', { p_code: room });
      const host = initial.members.find(m => m.host)?.state;
      if (!host?.started || host.version !== 2) throw Error('房主的年代规则尚未同步，或使用了旧版网页。请双方刷新后创建新房间。');
      targetEra = host.targetEra; excludedEras = host.excludedEras;
    }
    s = startDraft(freshState(d.mode), targetEra, excludedEras); placement = null; filter = '全部';
    await rpc('fc_submit', { p_code: room, p_state: networkState(s) });
    localStorage.setItem(storage, JSON.stringify(s)); render();
    status(`房间 ${room} · 征战 ${eraById(s.targetEra).label} · 将房间码发给朋友。`);
    timer = setInterval(() => { flush(); poll(); }, 2000);
    onlineUI();
  } catch (e) {
    if (room) disconnect();
    status(`连接失败：${e.message}`);
    if ($('create')) { $('create').disabled = false; $('join').disabled = false; }
  } finally { busy = false; }
}
async function flush() {
  if (sending || !room || !pendingState) return;
  sending = true;
  const generation = roomGeneration, code = room, snapshot = pendingState; pendingState = null;
  try { await rpc('fc_submit', { p_code: code, p_state: snapshot }); }
  catch (e) { if (generation === roomGeneration) { pendingState ||= snapshot; status(`房间 ${room} · 同步失败，将自动重试：${e.message}`); } }
  finally { sending = false; }
}
async function poll() {
  if (polling || !room) return;
  polling = true; const generation = roomGeneration;
  try {
    const d = await rpc('fc_read', { p_code: room });
    if (generation !== roomGeneration) return;
    remote = d;
    const ready = d.members.filter(m => m.state?.picks?.filter(Boolean).length === 16).length;
    if (!pendingState) status(`房间 ${room} · ${d.members.length}/2 人已加入 · ${ready}/2 阵容完成 · 征战 ${eraById(s.targetEra).label}`);
    if (d.result && !shownResult) { shownResult = true; showResult(d.result); }
  } catch (e) { if (generation === roomGeneration) status(`房间 ${room} · 暂未同步：${e.message}`); }
  finally { polling = false; }
}
function showResult(result) {
  modal(`<div class="trophy">🏆</div><h2>联机决赛 · ${eraById(s.targetEra).label}</h2><p>房主 ${Number(result.home)} : ${Number(result.away)} 客队</p><p>${esc(result.penalties || '')}</p><p>双方按位置与年代调整后的首发能力参赛，赛果由服务端统一保存。</p>`);
}
render();
