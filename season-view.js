import {finalMarkup,updateFinalLive} from './final-view.js';
import {standings,statistics} from './tournament.js';
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let container=null;
export function closeSeason(){document.body.classList.remove('watching-season');if(container)container.hidden=true;history.replaceState(null,'',location.pathname+location.search);}
export function seasonVisible(){return document.body.classList.contains('watching-season');}
export function renderSeason(t,cursor,{online=false,onNext,onExit,error='',pending=false,autoRunning=false,phaseIndex=Math.max(0,cursor-1),reveal=null,onAuto,onStop,onSkip,onPage,live=null,onKick}={}){
 if(!container){container=document.createElement('section');container.id='season-page';container.tabIndex=-1;document.querySelector('main').after(container);}
 const fresh=!seasonVisible();container.classList.toggle('in-final-live',Boolean(live));document.body.classList.add('watching-season');container.hidden=false;history.replaceState(null,'','#season');
 const displayCursor=live?Math.min(cursor,5):cursor;
 const visiblePhases=t.phases.slice(0,displayCursor).map((p,i)=>({...p,matches:reveal&&reveal.phase===i?p.matches.slice(0,reveal.count):p.matches}));
 const completedCursor=cursor-(reveal&&reveal.count<t.phases[reveal.phase].matches.length?1:0);
 const page=Math.max(0,Math.min(5,phaseIndex)),phase=t.phases[page],played=page<cursor,shown=played?(visiblePhases[page]?.matches||[]):[],groupPage=page<3;
 const team=id=>t.teams.find(x=>x.id===id),all=visiblePhases.flatMap(p=>p.matches),stats=statistics({...t,phases:visiblePhases},cursor),sort=key=>[...stats].sort((a,b)=>b[key]-a[key]||a.id.localeCompare(b.id));
 const rank=(title,key,suffix)=>`<section class="season-panel"><h3>${title}</h3>${sort(key).slice(0,5).map((p,i)=>`<div class="award-row"><span>${i+1}. ${esc(p.name)}<small>${esc(p.team)}</small></span><b>${key==='average'?p[key].toFixed(1):p[key]}${suffix}</b></div>`).join('')||'<p class="hint">首轮比赛后公布</p>'}</section>`;
 const best=sort('award')[0],winner=team(t.champion);
 const game=m=>`<details class="fixture ${team(m.home).human||team(m.away).human?'human-fixture':''}"><summary><span>${esc(team(m.home).name)}</span><b>${m.h} : ${m.a}${m.penalties?`<small>点球 ${m.penalties.join(' : ')}</small>`:''}</b><span>${esc(team(m.away).name)}</span></summary><div class="match-report"><p>全场 MVP：<b>${esc(m.mvp.player.name)}</b> · ${m.mvp.score.toFixed(1)} 分</p><div class="team-mvps"><span>${esc(team(m.home).name)} MVP<br><b>${esc(m.homeMvp.player.name)}</b> · ${m.homeMvp.score.toFixed(1)}</span><span>${esc(team(m.away).name)} MVP<br><b>${esc(m.awayMvp.player.name)}</b> · ${m.awayMvp.score.toFixed(1)}</span></div><div class="goal-events">${m.events.map(e=>{const p=team(e.team).players.find(x=>x.id===e.scorer),a=team(e.team).players.find(x=>x.id===e.assist);return`<p><b>${e.minute}′ ⚽ ${esc(p.name)}</b><small>${esc(team(e.team).name)}${a?` · 助攻：${esc(a.name)}`:' · 无助攻'}</small></p>`;}).join('')||'<p>双方均未进球</p>'}</div>${m.penalties?'<p class="hint">点球大战进球不计入射手榜。</p>':m.extraTime?'<p class="hint">加时赛分出胜负。</p>':''}</div></details>`;
 const pageChanged=container.dataset.phase!==String(page);container.dataset.phase=String(page);
 const groupTables=()=>`<div class="groups-grid">${t.groups.map(g=>`<section class="season-panel"><h3>${g.name} 组 <small>${g.name==='A'||g.name==='B'?'上半区':'下半区'}</small></h3><table><thead><tr><th>球队</th><th>赛</th><th>净胜球</th><th>积分</th></tr></thead><tbody>${standings(g.teams,all.filter(m=>m.group===g.name)).map((r,i)=>`<tr class="${team(r.id).human?'human-row':''}"><td>${i+1}. ${esc(r.name)}${completedCursor>=3&&i<2?' ✓':''}</td><td>${r.played}</td><td>${r.gf-r.ga}</td><td><b>${r.points}</b></td></tr>`).join('')}</tbody></table></section>`).join('')}</div>`;
 const summary=h=>{const group=t.groups.find(g=>g.teams.some(x=>x.id===h.id)),rows=standings(group.teams,all.filter(m=>m.group===group.name)),place=rows.findIndex(r=>r.id===h.id)+1;
  if(completedCursor<3)return`${group.name} 组 · 第 ${place} 名 · 小组赛进行中`;
  if(place>2)return'小组赛出局';
  if(all.filter(m=>!m.group).some(m=>(m.home===h.id||m.away===h.id)&&m.winner!==h.id)){const lost=all.find(m=>!m.group&&(m.home===h.id||m.away===h.id)&&m.winner!==h.id);return`${t.phases.find(p=>p.matches.some(m=>m.id===lost.id)).title}出局`;}
  return cursor===6?'🏆 本届冠军':'已晋级 · 继续征战';
 };
 const navigation=[['小组赛',0,0],['四分之一决赛',3,3],['半决赛',4,4],['决赛',5,5]];
 container.innerHTML=`<div class="season-top"><button id="season-back">← 返回阵容</button><span>${online?'联机 · 双方同步轮次':'单人 · 冠军征程'}</span></div>
 <div class="season-hero"><div><p class="eyebrow">THE ROAD TO GLORY</p><h1>${phase.title}</h1><p>${t.mode==='ucl'?'欧冠':'世界杯'} · 自定义 16 队杯赛</p></div><div class="round-counter"><b>${cursor} / 6</b><span>已完成轮次</span></div></div>
 <nav class="season-stages" aria-label="赛季阶段">${navigation.map(([label,index,unlock])=>`<button data-phase="${index===0?Math.min(2,Math.max(0,cursor-1)):index}" class="${(groupPage&&index===0)||page===index?'active':''}" ${cursor<unlock||pending||autoRunning?'disabled':''}>${label}</button>`).join('')}</nav>
 ${cursor===6&&page===5&&!live?`<section class="champion-banner"><span>🏆 本届冠军</span><h2>${esc(winner.name)}</h2><p>赛季 MVP：${esc(best.name)} · ${esc(best.team)}</p><p>金靴：${esc(sort('goals')[0].name)} ${sort('goals')[0].goals} 球 · 助攻王：${esc(sort('assists')[0].name)} ${sort('assists')[0].assists} 次</p></section>`:''}
 <div class="season-human-status">${t.teams.filter(x=>x.human).map(h=>`<div><b>${esc(h.name)}</b><span>${summary(h)}</span></div>`).join('')}</div>
 <div class="season-toolbar"><div><b>${live?'决赛直播进行中':autoRunning?'自动模拟 · 每 0.3 秒揭晓一场':cursor===5?'决赛已就绪，请手动开始':cursor===6?'本届比赛已结束':`下一轮：${t.phases[cursor].title}`}</b><p>${autoRunning?'逐场揭晓，到决赛前自动停止。':online?'双方共享赛季进度。':'可逐轮观看，也可直接查看最终结局。'}</p></div><div class="season-controls"><button class="primary" id="season-next" ${live||cursor===6||pending||autoRunning?'disabled':''}>${live?'决赛直播中…':pending?'模拟中…':cursor===6?'赛季已结束':cursor===5?'手动开始决赛 →':`开始${t.phases[cursor].title} →`}</button>${autoRunning?'<button id="season-stop">停止自动模拟</button>':`<button id="season-auto" ${live||cursor>=5||pending?'disabled':''}>自动模拟至决赛</button>`}${!online?`<button id="season-skip" ${live||cursor===6||pending||autoRunning?'disabled':''}>Skip to end · 直接看结局</button>`:''}</div></div>
 ${error?`<p class="season-error" role="alert">${esc(error)}</p>`:''}
 ${groupPage?`<div class="group-round-tabs">${[0,1,2].map(i=>`<button data-phase="${i}" ${i>cursor||pending||autoRunning?'disabled':''} class="${page===i?'active':''}">小组赛第 ${i+1} 轮</button>`).join('')}</div>`:''}
 <section class="stage-matches">${live&&page===5?finalMarkup(t):`<h2>${played?'本轮战报':'本轮对阵'} ${reveal?`<small>${shown.length} / ${phase.matches.length} 场已揭晓</small>`:''}</h2>${played?shown.map(game).join('')||'<p class="season-panel">等待第一场比赛揭晓…</p>':phase.matches.map(m=>`<div class="fixture pending-fixture"><span>${esc(team(m.home).name)}</span><b>VS</b><span>${esc(team(m.away).name)}</span></div>`).join('')}<p class="hint">${played?'点击比分展开进球、助攻和双方 MVP。':'开始本轮后揭晓比分。'}</p>`}</section>
 ${groupPage?`<details class="stage-extra"><summary>查看小组积分榜</summary>${groupTables()}<p class="hint">小组前二晋级；同分按净胜球、进球数、固定签位排序。</p></details>`:''}
 <details class="stage-extra"><summary>${cursor===6?'赛季荣誉榜':'查看实时个人榜'}</summary><div class="season-awards">${rank('⚽ 射手榜','goals',' 球')}${rank('↗ 助攻榜','assists',' 次')}${rank('★ MVP 次数','mvps',' 次')}${rank('场均表现','average',' 分')}</div></details>`;
 container.querySelector('#season-back').onclick=()=>{closeSeason();onExit?.();};container.querySelector('#season-next').onclick=onNext;
 container.querySelector('#season-auto')?.addEventListener('click',onAuto);container.querySelector('#season-stop')?.addEventListener('click',onStop);container.querySelector('#season-skip')?.addEventListener('click',onSkip);
 container.querySelectorAll('[data-phase]').forEach(b=>b.onclick=()=>onPage?.(+b.dataset.phase));
 if(live&&page===5)updateFinalLive(t,live,onKick,pending);
 if(fresh||pageChanged){window.scrollTo(0,0);container.focus({preventScroll:true});}
}
