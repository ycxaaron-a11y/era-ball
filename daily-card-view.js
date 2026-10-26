import {dailyCardById,DAILY_LIMIT,searchDailyCards,newDailyRound,restoreDailyRound,guessDaily,giveUpDaily,compareDailyCards} from './daily-card.js';
import {eras} from './data.js';
import {positionList} from './display.js';
import {playerSilhouette} from './effects.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key='era-fc-daily-card-v1',statuses={match:'完全匹配',near:'接近或部分匹配',miss:'不匹配'};
const columns=[['player','球员'],['team','球队'],['continent','洲别'],['region','地区'],['position','位置'],['height','身高'],['era','年代 / 年份'],['tier','等级']];
export function createDailyCardView({onAllGames}){
 const root=document.getElementById('daily-card-screen'),$=id=>root.querySelector(`#${id}`);let round=null,results=[],active=0,storageError='';
 function persist(){try{localStorage.setItem(key,JSON.stringify(round));storageError='';}catch{storageError='当前浏览器无法保存进度，请保持本页打开。';}}
 function load(){try{return restoreDailyRound(JSON.parse(localStorage.getItem(key)));}catch{return null;}}
 function feedback(text){$('daily-message').textContent=text;}
 function submit(id){try{round=guessDaily(round,id);persist();render();if(round.status==='playing')$('daily-search').focus({preventScroll:true});}catch(e){feedback(e.message);}}
 function renderSuggestions(){
  const input=$('daily-search'),list=$('daily-suggestions');results=searchDailyCards(input.value,{exclude:round.guesses});active=0;
  list.hidden=!input.value.trim()||round.status!=='playing';input.setAttribute('aria-expanded',String(!list.hidden));
  list.innerHTML=results.length?results.map((card,i)=>`<button type="button" role="option" id="daily-option-${i}" data-daily-choice="${esc(card.id)}" aria-selected="${i===active}"><strong>${esc(card.name)}</strong><span>${esc(card.team)} · ${card.year} · ${esc(card.tier)}</span><small>${esc(positionList(card.positions))} · ${card.heightCm} cm</small></button>`).join(''):'<p>没有找到可选版本。试试中文名、英文名或球员别称。</p>';
  list.querySelectorAll('[data-daily-choice]').forEach(button=>button.onclick=()=>submit(button.dataset.dailyChoice));
  input.setAttribute('aria-activedescendant',results.length&&!list.hidden?'daily-option-0':'');
 }
 function updateActive(){const input=$('daily-search'),list=$('daily-suggestions');list.querySelectorAll('[role="option"]').forEach((el,i)=>el.setAttribute('aria-selected',String(i===active)));input.setAttribute('aria-activedescendant',`daily-option-${active}`);list.querySelector(`#daily-option-${active}`)?.scrollIntoView({block:'nearest'});}
 function cell(item,column){
  const arrow=item.direction>0?'▲':item.direction<0?'▼':'',direction=item.direction?(column==='era'?(item.direction>0?'目标年份更晚':'目标年份更早'):column==='height'?(item.direction>0?'目标更高':'目标更矮'):(item.direction>0?'目标等级更高':'目标等级更低')):'';
  const value=column==='height'?`${item.value} cm`:column==='position'?positionList(item.value):item.value;
  return `<td class="daily-cell ${item.status} ${column==='player'?'daily-player-cell':''}" title="${esc([statuses[item.status],direction,item.note].filter(Boolean).join(' · '))}"><span class="daily-value">${esc(value)}${arrow?` <span class="daily-arrow" aria-label="${direction}">${arrow}</span>`:''}</span>${column==='era'?`<small>${esc(item.note)}</small>`:''}<span class="daily-match-icon" aria-label="${statuses[item.status]}">${item.status==='match'?'✓':item.status==='near'?'≈':'—'}</span></td>`;
 }
 function render(){
  results=[];active=0;
  const target=dailyCardById.get(round.targetId),ended=round.status!=='playing',era=eras.find(e=>e.id===target.eraId),remaining=DAILY_LIMIT-round.guesses.length;
  const headline=round.status==='won'?`猜中了！用了 ${round.guesses.length} 次。`:round.status==='lost'?'12 次机会用完了，本轮答案揭晓。':round.status==='gave_up'?'本轮已放弃，答案在这里。':'';
  const answer=ended?`<section class="daily-answer ${round.status==='won'?'daily-won':''}" aria-label="本轮答案"><div class="daily-answer-avatar">${playerSilhouette()}</div><div><p class="eyebrow">${round.status==='won'?'WELL PLAYED':'THE ANSWER'}</p><h2>${esc(target.name)}</h2><p>${esc(target.team)} · ${target.year} · ${esc(target.tier)}</p><small>${esc(positionList(target.positions))} · ${target.heightCm} cm · ${esc(target.continent)} / ${esc(target.region)}</small></div></section>`:'';
  const rows=round.guesses.map(id=>{const card=dailyCardById.get(id),compared=compareDailyCards(card,target);return `<tr data-daily-guess="${esc(id)}">${columns.map(([field])=>cell(compared[field],field)).join('')}</tr>`;}).join('');
  root.innerHTML=`<div class="daily-shell"><header class="daily-header"><div><p class="eyebrow">MINI GAMES / FOOTBALL</p><h1>DAILY CARD</h1></div><button id="daily-all-games">← ALL GAMES</button></header><p class="daily-subtitle">无限练习 · 在 ${DAILY_LIMIT} 次以内，猜中球员、球队和年份对应的这张卡。</p><section class="daily-mystery"><div class="daily-card-back" aria-hidden="true">?</div><div><span class="eyebrow">YOUR MYSTERY CARD</span><p>年代 <b>${esc(era.label)}</b><span>等级 <b>${esc(target.tier)}</b></span></p><small>先看年代和等级；觉得不熟，也可以直接 Give up 再开一轮。</small></div><div class="daily-remaining"><b>${remaining}</b><span>次机会剩余</span></div></section><p class="daily-result" role="status">${esc(headline)}</p>${answer}<form id="daily-form" class="daily-search-form" autocomplete="off"><div class="daily-input-wrap"><label class="sr-only" for="daily-search">输入球员姓名，选择球队和年份版本</label><input id="daily-search" role="combobox" aria-autocomplete="list" aria-controls="daily-suggestions" aria-expanded="false" placeholder="输入球员名字… / Guess a player…" maxlength="100" ${ended?'disabled':''}><div id="daily-suggestions" class="daily-suggestions" role="listbox" aria-label="选择球员版本" hidden></div></div><button class="primary" type="submit" ${ended?'disabled':''}>猜这张卡</button><span class="daily-count">${round.guesses.length} / ${DAILY_LIMIT}</span></form><p id="daily-message" class="daily-message" role="status">${esc(storageError||(!ended?'搜索支持中文、英文和 C罗等别称；点候选直接猜，或用 ↑↓ 选择、Enter 提交。':''))}</p><div class="daily-legend"><span class="legend-match">紫色 / 完全匹配</span><span class="legend-near">金色 / 接近或部分匹配</span><span class="legend-miss">灰色 / 不匹配</span></div><details class="daily-rules"><summary>怎么看提示？</summary><p>球队和地理信息按这张卡当时的球队所在地计算，不是球员出生地。地区采用本游戏的地理分组。球队相同为紫色；同国球队，或该球员在现有名单中曾效力过目标球队，为金色。</p><p>位置组合完全相同为紫色，任一位置重合为金色。身高相同为紫色，相差不超过 5 cm 为金色。年份完全相同为紫色，同年代或相邻年代区间为金色。等级相同为紫色，相差一级为金色。</p><p>▲ 表示目标更高、年份更晚或等级更高，▼ 相反。球员姓名匹配只说明人猜对了，还需找到正确球队和年份的版本。猜重复版本不会扣机会；刷新会保留本轮。</p></details><div class="daily-actions">${ended?'<button id="daily-new-round" class="primary">再来一轮 ↻</button>':'<button id="daily-give-up">GIVE UP · 放弃并揭晓</button>'}</div><div class="daily-table-wrap" tabindex="0" aria-label="猜测记录，可横向滚动"><table class="daily-table"><thead><tr>${columns.map(([,label])=>`<th scope="col">${label}</th>`).join('')}</tr></thead><tbody>${rows||'<tr><td colspan="8" class="daily-empty">你的第一条线索，从一个球员名字开始。</td></tr>'}</tbody></table></div><footer class="daily-footer">ERA FC · DAILY CARD <span>12 GUESSES. ONE LEGEND.</span></footer></div>`;
  $('daily-all-games').onclick=onAllGames;
  if(ended){$('daily-new-round').onclick=()=>{round=newDailyRound(Math.random,round.targetId);persist();render();$('daily-search').focus({preventScroll:true});};return;}
  $('daily-give-up').onclick=()=>{round=giveUpDaily(round);persist();render();};
  $('daily-search').oninput=renderSuggestions;
  $('daily-search').onkeydown=e=>{if((e.key==='ArrowDown'||e.key==='ArrowUp')&&results.length){e.preventDefault();active=(active+(e.key==='ArrowDown'?1:-1)+results.length)%results.length;updateActive();}else if(e.key==='Escape'){$('daily-suggestions').hidden=true;e.target.setAttribute('aria-expanded','false');}};
  $('daily-form').onsubmit=e=>{e.preventDefault();if(!results.length){feedback('先输入名字，再从搜索结果中选择一个球员版本。');return;}submit(results[active].id);};
 }
 return {open(){if(!round){round=load()||newDailyRound();persist();}results=[];active=0;render();},snapshot:()=>round};
}
