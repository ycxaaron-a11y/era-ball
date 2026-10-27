import {eras,tier,tierClass} from './data.js';
import {positionName,positionList,heightLabel} from './display.js';
import {playerSilhouette,splusLightning,splusStardust,darkMatter,hasDarkMatter} from './effects.js';
import {sevenFormations,sevenPositions,sevenLayout,sevenPoolById,sevenCardById,newSevenState,restoreSevenState,sevenPlayers,sevenAbility,sevenOverall,spinSeven,pickSeven,changeSevenFormation,startSevenCup,nextSevenRound} from './seven-a-side.js';
const key='era-fc-seven-v1',esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const energy=rating=>hasDarkMatter(rating)?darkMatter(rating):splusLightning(tier(rating))+splusStardust(rating);
const style=rating=>`${tierClass(tier(rating))} ${hasDarkMatter(rating)?'mythic':rating>=105?'silver':''}`;
export function createSevenView({onAllGames}){
 const root=document.getElementById('seven-screen'),$=id=>root.querySelector(`#${id}`);let s=null,selected=null,preview=null,spinning=false,spinToken=0,message='';
 function persist(){try{localStorage.setItem(key,JSON.stringify(s));}catch{message='本设备暂时不能保存进度，请保持本页打开。';}}
 function act(fn){try{s=fn();message='';persist();render();}catch(e){message=e.message;render();}}
 function setup(){
  let name='';try{name=JSON.parse(localStorage.getItem('era-fc-profile-v1'))?.teamName||'';}catch{}
  root.innerHTML=`<div class="seven-shell"><header class="seven-header"><div><p class="eyebrow">MINI GAMES / SEVEN A SIDE</p><h1>七人制 · 小场传奇</h1></div><button id="seven-back">← ALL GAMES</button></header><section class="seven-setup panel"><p class="eyebrow">SAME GAME. SMALLER STAGE.</p><h2>7 个位置，一支新球队。</h2><p>1 名门将 + 6 名场上球员。世界杯、欧冠、欧洲杯、美洲杯版本汇合，按球员国家归类；同一人同年代保留最高初始能力版本，不重复放入名单。</p><form id="seven-setup-form"><label for="seven-name">球队名</label><input id="seven-name" maxlength="24" value="${esc(name)}" placeholder="我的七人队"><label for="seven-era">选择年代</label><select id="seven-era">${[...eras].reverse().map(e=>`<option value="${e.id}">${e.label}</option>`).join('')}</select><p class="hint">本局只抽所选年代的球员。开始后年代锁定；每次选人前手动 Spin 国家，另有 3 次额外重转。本玩法为单人本地七人杯，独立保存。</p><button class="primary" type="submit">开始七人选秀 ↗</button></form></section></div>`;
  $('seven-back').onclick=onAllGames;$('seven-setup-form').onsubmit=e=>{e.preventDefault();s=newSevenState($('seven-era').value,$('seven-name').value);persist();render();};
 }
 function slotMarkup(id,i,xy){
  const p=sevenCardById.get(id)||(!id&&preview===i?sevenCardById.get(selected):null),pos=sevenPositions(s.formation)[i],trial=p&&!id,state=trial?{...s,picks:s.picks.map((old,j)=>j===i?p.id:old)}:s,rating=p?sevenAbility(state,p,pos):0;
  return `<button class="slot ${p?style(rating):''} ${trial?'slot-preview selected':''}" style="left:${xy.x}%;top:${xy.y}%" data-seven-slot="${i}" ${spinning||s.cup?'disabled':''} aria-label="${esc(`${positionName(pos)}${p?' · '+p.name+' · '+rating:''}${trial?'；再点确认':''}`)}">${p?`${energy(rating)}${rating!==p.rating?`<span class="was-tier">was ${p.tier}</span>`:''}<em>${rating}</em><span class="${trial?'preview-player':'placed-player'}"><b>${esc(p.name)}</b><small>${heightLabel(p)}</small><small>${positionName(pos)}</small></span>${trial?'<small class="confirm-label">再点确认</small>':''}`:`<span class="plus">＋</span><small>${positionName(pos)}</small>`}</button>`;
 }
 function cupMarkup(){
  const cup=s.cup,labels=['四分之一决赛','半决赛','决赛'],stage=cup.rounds.length,latest=cup.rounds.at(-1),eliminated=stage>0&&!cup.teams.some(t=>t.id==='you');
  return `<section class="panel seven-cup"><p class="eyebrow">SEVEN A SIDE CUP</p><h2>${cup.champion?`冠军 · ${esc(cup.champion.name)}`:stage?`${labels[stage-1]} · 赛果`:'八队七人杯'}</h2><p>${cup.champion?(cup.champion.id==='you'?'你赢得了七人杯！':'本届七人杯已结束。'):eliminated?'你的球队已出局，可以继续查看本届冠军。':stage?`晋级成功，下一轮：${labels[stage]}`:'每轮单场淘汰。平局以模拟点球决定晋级。'}</p>${latest?latest.map(m=>`<article class="seven-fixture ${m.homeId==='you'||m.awayId==='you'?'is-yours':''}"><div><b>${esc(m.home)}</b><strong>${m.homeGoals} : ${m.awayGoals}</strong><b>${esc(m.away)}</b></div>${m.penalties?`<p>点球 ${m.penalties.home} : ${m.penalties.away}</p>`:''}<small>${m.homeGoals?`${esc(m.home)}：${esc(m.homeScorers.join('、'))}`:'主队无进球'}<br>${m.awayGoals?`${esc(m.away)}：${esc(m.awayScorers.join('、'))}`:'客队无进球'}</small></article>`).join(''):`<div class="seven-entrants">${cup.teams.map(t=>`<span>${esc(t.name)}</span>`).join('')}</div>`}${cup.champion?'':`<button id="seven-next-round" class="primary">模拟${labels[stage]} ↗</button>`}<p class="hint">七人杯独立模拟，不影响十一人赛季或房间。球员位置、年代与羁绊计入球队能力；冠军并非必得。</p></section>`;
 }
 function render(){
  if(!s){setup();return;}
  const pool=sevenPoolById.get(s.pool),picked=sevenPlayers(s),used=new Set(picked.filter(Boolean).map(p=>p.identity)),count=s.picks.filter(Boolean).length;
  root.innerHTML=`<div class="seven-shell"><header class="seven-header"><div><p class="eyebrow">MINI GAMES / SEVEN A SIDE</p><h1>七人制 · 小场传奇</h1><p>${esc(eras.find(e=>e.id===s.eraId).label)} · 全赛事球员 · 按国家抽取</p></div><div><button id="seven-back">← ALL GAMES</button><button id="seven-restart">重开</button></div></header><p id="seven-message" role="status">${esc(message||'先选球员，再点位置试位；第二次点击同一位置锁定。')}</p><div class="seven-workspace"><section class="panel seven-squad"><div class="section-head"><div><p class="eyebrow">YOUR SEVEN</p><h2>${esc(s.teamName)} <small>${count} / 7</small></h2></div><label class="sr-only" for="seven-formation">七人阵型</label><select id="seven-formation" ${s.cup||spinning?'disabled':''}>${Object.keys(sevenFormations).map(f=>`<option ${s.formation===f?'selected':''}>${f}</option>`).join('')}</select></div><div class="pitch seven-pitch">${sevenLayout(s.formation).map((xy,i)=>slotMarkup(s.picks[i],i,xy)).join('')}</div><div class="seven-overall">阵容评分 <b>${sevenOverall(s)||'—'}</b><span>1 门将 · 6 场上球员</span></div><p class="hint">确认后球员不能移除或换位；开始杯赛前可切换阵型，球员保留原槽位。自然位置不符会扣能力，特效随最终能力变化。已有两人、三人羁绊同样生效。</p></section><div>${s.cup?cupMarkup():`<section class="panel seven-draw"><p class="eyebrow">NATIONALITY DRAW</p><h2 id="seven-country" class="${spinning?'is-spinning':''}">${spinning?'抽取国家中…':pool?esc(pool.country):s.phase==='complete'?'七人集结完毕':'准备抽取国家'}</h2><p>${spinning?'':pool?`${pool.players.length} 位可选球员 · ${esc(eras.find(e=>e.id===s.eraId).label)}`:'每次确认球员后，按 Spin 再揭晓下一组。'}</p><div class="seven-draw-actions"><button id="seven-spin" class="primary" ${s.phase!=='waiting'||spinning?'disabled':''}>SPIN · 抽取国家</button><button id="seven-reroll" ${s.phase!=='ready'||s.rerolls===0||spinning?'disabled':''}>重转 · ${s.rerolls} 次</button></div>${s.phase==='complete'?'<button id="seven-start-cup" class="primary">进入七人杯 ↗</button>':''}</section><div class="seven-pool" aria-label="七人制候选球员">${!spinning&&s.phase==='ready'&&pool?pool.players.map(p=>`<button class="player-card ${style(p.rating)} ${selected===p.id?'is-chosen':''}" data-seven-player="${esc(p.id)}" aria-pressed="${selected===p.id}" ${used.has(p.identity)?'disabled':''}>${energy(p.rating)}<span class="avatar" aria-hidden="true">${playerSilhouette()}</span><span class="player-info"><span class="name">${esc(p.name)}</span><small>${heightLabel(p)}</small><small>${positionList(p.positions)}</small><small class="seven-source">${esc(p.team)} · ${p.year}</small><small class="player-base-rating">初始能力 <b>${p.rating}</b></small>${used.has(p.identity)?'<small>已入队</small>':''}</span><span class="tier">${p.tier}</span></button>`).join(''):'<div class="seven-empty">'+(spinning?'正在揭晓…':s.phase==='complete'?'你的七人阵容已锁定，准备争冠。':'按 Spin，揭晓下一组国家球员。')+'</div>'}</div>`}</div></div></div>`;
  $('seven-back').onclick=onAllGames;$('seven-restart').onclick=()=>{spinToken++;spinning=false;selected=null;preview=null;s=null;try{localStorage.removeItem(key);}catch{}message='';setup();};
  $('seven-formation').onchange=e=>{preview=null;act(()=>changeSevenFormation(s,e.target.value));};
  root.querySelectorAll('[data-seven-player]').forEach(el=>el.onclick=()=>{selected=el.dataset.sevenPlayer;preview=null;message='已选球员，请点击阵容空位试位。';render();});
  root.querySelectorAll('[data-seven-slot]').forEach(el=>el.onclick=()=>{
   const index=Number(el.dataset.sevenSlot);if(s.picks[index]){message='此位置已锁定；可以切阵型，不能换人或移动球员。';render();return;}
   if(!selected){message='先从右边选择球员。';render();return;}
   try{const next=pickSeven(s,selected,index);if(preview!==index){preview=index;message='半透明卡为试位，显示适配后的能力；再点一次这个位置确认。';render();}else{s=next;selected=null;preview=null;message=s.phase==='complete'?'7 人已锁定，点击“进入七人杯”开始。':'球员已锁定。下一轮请手动 Spin。';persist();render();}}catch(e){message=e.message;render();}
  });
  if($('seven-spin'))$('seven-spin').onclick=()=>spin(false);if($('seven-reroll'))$('seven-reroll').onclick=()=>spin(true);
  if($('seven-start-cup'))$('seven-start-cup').onclick=()=>act(()=>startSevenCup(s));
  if($('seven-next-round'))$('seven-next-round').onclick=()=>act(()=>nextSevenRound(s));
 }
 function spin(reroll){
  if(spinning)return;let next;try{next=spinSeven(s,Math.random,reroll);}catch(e){message=e.message;render();return;}
  selected=null;preview=null;spinning=true;message='';const token=++spinToken;render();
  const names=['巴西','阿根廷','荷兰','德国','法国','英格兰','意大利','日本','葡萄牙'];let n=0;
  const id=setInterval(()=>{if(token!==spinToken){clearInterval(id);return;}const el=$('seven-country');if(el)el.textContent=names[n++%names.length];},70);
  setTimeout(()=>{clearInterval(id);if(token!==spinToken)return;spinning=false;s=next;persist();render();},750);
 }
 return {open(){if(!s)try{s=restoreSevenState(JSON.parse(localStorage.getItem(key)));}catch{}render();},close(){spinToken++;spinning=false;selected=null;preview=null;},snapshot:()=>s};
}
