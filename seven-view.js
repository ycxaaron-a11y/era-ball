import {createPickTracker,showPickNotice,clearPickNotices} from './pick-notifications.js';
import {tier,tierClass} from './data.js';
import {positionName,positionList,heightLabel} from './display.js';
import {playerSilhouette,splusLightning,splusStardust,darkMatter,hasDarkMatter} from './effects.js';
import {finalMarkup,updateFinalLive} from './final-view.js';
import {sevenFormations,sevenPositions,sevenLayout,sevenPoolById,sevenCardById,newSevenState,restoreSevenState,sevenPlayers,sevenAbility,sevenOverall,spinSeven,pickSeven,changeSevenFormation,startSevenCup,nextSevenRound,startSevenFinal,sevenFinalFrame,kickSevenFinal,finishSevenFinal,sevenRoomState} from './seven-a-side.js';
const key='era-fc-seven-v2',roomKey='era-fc-seven-room-v2',esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const energy=rating=>hasDarkMatter(rating)?darkMatter(rating):splusLightning(tier(rating))+splusStardust(rating);
const style=rating=>`${tierClass(tier(rating))} ${hasDarkMatter(rating)?'mythic':rating>=105?'silver':''}`;
const errors={FC7_NOT_MEMBER:'你已不在这个七人房间，请重新连接。',FC7_ROOM_NOT_FOUND:'没有找到七人制房间，请检查 3 位房间码。',FC7_ROOM_CLOSED:'房主已离开，房间已关闭。',FC7_ROOM_FULL:'这个七人房间已经满员。',FC7_ALREADY_STARTED:'这个房间已开赛，不能再加入。',FC7_STALE:'状态刚刚更新，已重新读取，请再操作。',FC7_PLAYER_LOCKED:'这个届次版本被朋友抢先选走了，请选其他球员或届次。',FC7_NO_REROLLS:'额外重转机会已用完。',FC7_KEEPER:'门将只能放在门将位置。',FC7_SLOT_LOCKED:'这个位置已锁定。',FC7_DUPLICATE:'同一个人不能在自己的阵容里重复出现。',FC7_ROSTER_LOCKED:'阵容已经开赛锁定。',FC7_NOT_READY:'等待所有玩家选满并准备。',FC7_TOO_EARLY:'比赛还在进行中，请稍等。'};
export function createSevenView({onAllGames,rpc}){
 const pickTracker=createPickTracker(showPickNotice);
 const root=document.getElementById('seven-screen'),$=id=>root.querySelector(`#${id}`);
 let s=null,selected=null,preview=null,spinning=false,spinToken=0,message='',busy=false,room=null,snapshot=null,offset=0,poller=null,ticker=null,polling=false,generation=0,requestSeq=0,appliedSeq=0,fingerprint='',visible=false,finalFinishing=false,retryAt=0,focusedFinal=null,filterQuery='',formName='',capacity=2,joinCode='',upgrade=false;
 const myId=()=>snapshot?`human-${snapshot.members.find(m=>m.is_self).seat}`:'you';
 const blocked=()=>snapshot?.locks.filter(l=>!l.mine).map(l=>l.player_id)||[];
 function drawEmpty(){if(!s||s.phase!=='ready')return false;const used=new Set(sevenPlayers(s).filter(Boolean).map(p=>p.identity)),locked=new Set(blocked());return !sevenPoolById.get(s.pool)?.players.some(p=>!used.has(p.identity)&&!locked.has(p.id)&&(p.positions.includes('GK')?!s.picks[6]:s.picks.slice(0,6).some(id=>!id)));}
 function load(){try{return restoreSevenState(JSON.parse(localStorage.getItem(key)));}catch{return null;}}
 function persist(){if(room)return;try{localStorage.setItem(key,JSON.stringify(s));}catch{message='本设备暂时不能保存进度，请保持本页打开。';}}
 function error(e){upgrade=e.code==='PGRST202'||e.status===404||/fc7_protocol|function.*fc7_/i.test(e.message);message=upgrade?'七人制联机需要运行一次最新完整 SQL，下面可以直接查看并复制。':errors[e.message]||e.message||'暂时无法连接，请重试。';}
 function accept(data,seq){
  if(seq<appliedSeq)return;appliedSeq=seq;offset=data.server_now-Date.now();
  if(data.status==='closed'){pickTracker.reset();clearPickNotices();room=null;snapshot=null;sessionStorage.removeItem(roomKey);clearInterval(poller);s=null;message='有玩家离开，七人房间已关闭。';render();return;}
  const next=JSON.stringify([data.members,data.status,data.seed,data.cursor,data.final_live,data.locks]);room=data.code;sessionStorage.setItem(roomKey,room);snapshot=data;pickTracker.update(data);
  if(next===fingerprint)return;fingerprint=next;if(/^正在恢复|^正在连接/.test(message))message='';s=sevenRoomState(data);if(blocked().includes(selected)){selected=null;preview=null;message='试位的届次版本已被朋友选走，请改选。';}if(visible)render();
 }
 async function readRoom(){
  if(!room||polling||busy||!visible)return;polling=true;const code=room,token=generation,seq=++requestSeq;
  try{const data=await rpc('fc7_read',{p_code:code});if(token===generation&&room===code)accept(data,seq);}catch(e){if(token===generation){error(e);const el=$('seven-message');if(el)el.textContent=message;}}
  finally{polling=false;}
 }
 function pollingOn(){clearInterval(poller);poller=setInterval(readRoom,1500);}
 async function connect(code=null){
  if(busy)return;formName=$('seven-name').value;capacity=Number($('seven-capacity').value);joinCode=$('seven-code').value.trim().toUpperCase();if(code!==null&&!/^[A-Z0-9]{3}$/.test(joinCode)){message='请输入朋友的 3 位七人房间码。';render();return;}
  busy=true;message='正在连接七人房间…';render();const token=generation;
  try{const capability=await rpc('fc7_protocol',{});if(capability.version!==2||capability.catalog_count<sevenCardById.size)throw Object.assign(Error('fc7_protocol upgrade'),{status:404});const data=await rpc('fc7_connect',{p_code:code===null?null:joinCode,p_capacity:capacity,p_name:formName});if(token!==generation)return;upgrade=false;message='';selected=null;preview=null;accept(data,++requestSeq);pollingOn();}
  catch(e){if(token===generation)error(e);}finally{if(token===generation){busy=false;render();}}
 }
 async function network(action,payload={}){
  if(busy||!room)return;busy=true;const token=generation,code=room,seq=++requestSeq,revision=snapshot.members.find(m=>m.is_self).revision;
  try{const data=await rpc('fc7_action',{p_code:code,p_action:action,p_payload:payload,p_revision:revision,p_request_id:crypto.randomUUID()});if(token!==generation)return;message='';selected=null;preview=null;accept(data,seq);}
  catch(e){if(token===generation){error(e);if(['FC7_STALE','FC7_PLAYER_LOCKED'].includes(e.message))try{accept(await rpc('fc7_read',{p_code:code}),++requestSeq);}catch{}}}
  finally{if(token===generation){busy=false;render();}}
 }
 function act(fn){if(busy||spinning)return;try{s=fn();message='';persist();render();}catch(e){message=e.message;render();}}
 async function reset(){
  if(busy)return;if(room){busy=true;try{await rpc('fc7_action',{p_code:room,p_action:'leave',p_payload:{},p_revision:null,p_request_id:null});}catch(e){error(e);busy=false;render();return;}}
  pickTracker.reset();clearPickNotices();generation++;spinToken++;clearInterval(poller);clearInterval(ticker);room=null;snapshot=null;fingerprint='';busy=false;spinning=false;selected=null;preview=null;s=null;upgrade=false;message='';sessionStorage.removeItem(roomKey);try{localStorage.removeItem(key);}catch{}render();
 }
 function setup(){
  if(!formName)try{formName=JSON.parse(localStorage.getItem('era-fc-profile-v1'))?.teamName||'';}catch{}
  root.innerHTML=`<div class="seven-shell"><header class="seven-header"><div><p class="eyebrow">MINI GAMES / ALL-TIME BRAWL</p><h1>七人制 · 全时代混战</h1></div><button id="seven-back" ${busy?'disabled':''}>← ALL GAMES</button></header><section class="seven-setup panel"><p class="eyebrow">ONE COUNTRY. EVERY WORLD CUP.</p><h2>抽一个国家，选遍它的历代球星。</h2><p>已收录世界杯国家队跨年代合并。不选年代、不锁年代：贝利、罗纳尔多、内马尔可以在同一组候选里出现。不同届次版本保留，自己的球队不能选同一个人两次。</p><form id="seven-setup-form"><label for="seven-name">球队名</label><input id="seven-name" maxlength="24" value="${esc(formName)}" placeholder="我的七人队" ${busy?'disabled':''}><p class="hint">1 名门将 + 6 名场上球员 · 4 套阵型 · 手动 Spin · 3 次额外重转。对手为优化位置的历代传奇队，不再额外增加能力值。</p><button class="primary" type="submit" ${busy?'disabled':''}>单人混战 ↗</button><section class="seven-online-setup"><h3>好友联机 · 2–4 人</h3><label for="seven-capacity">创建房间人数</label><select id="seven-capacity" ${busy?'disabled':''}>${[2,3,4].map(n=>`<option value="${n}" ${n===capacity?'selected':''}>${n} 人</option>`).join('')}</select><label for="seven-code">朋友的七人房间码</label><input id="seven-code" maxlength="3" value="${esc(joinCode)}" placeholder="3 位字母或数字" ${busy?'disabled':''}><div class="seven-draw-actions"><button id="seven-create" type="button" ${busy?'disabled':''}>创建房间</button><button id="seven-join" type="button" ${busy?'disabled':''}>加入房间</button></div><p class="hint">各自选满 7 人并点击准备后进入同一届杯赛。两人分属上下半区，决赛有机会会师。</p></section></form><p id="seven-message" role="status">${esc(message)}</p>${upgrade?upgradeMarkup():''}</section></div>`;
  $('seven-back').onclick=onAllGames;$('seven-setup-form').onsubmit=e=>{e.preventDefault();if(busy)return;formName=$('seven-name').value;s=newSevenState(formName);message='';persist();render();};$('seven-create').onclick=()=>connect(null);$('seven-join').onclick=()=>connect('join');bindUpgrade();
 }
 function upgradeMarkup(){return `<section class="seven-upgrade"><p>在原 Supabase 项目 SQL Editor 粘贴完整 SQL 并 Run，然后重新连接。</p><button id="seven-show-sql" type="button">查看并全选完整 SQL</button><a href="https://github.com/ycxaaron-a11y/era-ball/blob/main/supabase/setup-all.sql" target="_blank" rel="noopener">GitHub 完整 SQL ↗</a><textarea id="seven-sql" hidden readonly rows="7" aria-label="完整升级 SQL"></textarea></section>`;}
 function bindUpgrade(){if($('seven-show-sql'))$('seven-show-sql').onclick=async()=>{try{const res=await fetch('supabase/setup-all.sql');if(!res.ok)throw Error('SQL 加载失败，请使用 GitHub 链接');const box=$('seven-sql');box.value=await res.text();box.hidden=false;box.focus();box.select();}catch(e){$('seven-message').textContent=e.message;}};}
 function slotMarkup(id,i,xy){
  const p=sevenCardById.get(id)||(!id&&preview===i?sevenCardById.get(selected):null),pos=sevenPositions(s.formation)[i],trial=p&&!id,state=trial?{...s,picks:s.picks.map((old,j)=>j===i?p.id:old)}:s,rating=p?sevenAbility(state,p,pos):0;
  return `<button class="slot ${p?style(rating):''} ${trial?'slot-preview selected':''}" style="left:${xy.x}%;top:${xy.y}%" data-seven-slot="${i}" ${spinning||busy||s.cup?'disabled':''} aria-label="${esc(`${positionName(pos)}${p?' · '+p.name+' · '+rating:''}${trial?'；再点确认':''}`)}">${p?`${energy(rating)}${rating!==p.rating?`<span class="was-tier">was ${p.tier}</span>`:''}<em>${rating}</em><span class="${trial?'preview-player':'placed-player'}"><b>${esc(p.name)}</b><small>${heightLabel(p)}</small><small>${positionName(pos)}</small><small>${p.year} 世界杯</small></span>${trial?'<small class="confirm-label">再点确认</small>':''}`:`<span class="plus">＋</span><small>${positionName(pos)}</small>`}</button>`;
 }
 function roomMarkup(){return !snapshot?'':`<section class="seven-room panel"><div><b>七人房间 ${esc(room)}</b><span>${snapshot.members.length} / ${snapshot.capacity} 人 · ${snapshot.status==='playing'?'杯赛进行中':'选人中'}</span></div><div class="seven-members">${snapshot.members.map(m=>`<p><strong>${esc(m.state.teamName)}${m.is_self?' · 你':''}</strong><span>${m.state.picks.filter(Boolean).length} / 7 · ${m.state.ready?'已准备':'未准备'}</span></p>`).join('')}</div><p class="hint">朋友选走的同届版本会锁定；同一人的其他世界杯届次仍可选。关闭本页不释放名额，返回本页可恢复。</p></section>`;}
 function cupMarkup(){
  const cup=s.cup,labels=['四分之一决赛','半决赛','决赛'],stage=cup.rounds.length,latest=cup.rounds.at(-1),eliminated=stage>0&&!cup.teams.some(t=>t.id===myId());
  if(cup.live)return `<section class="panel seven-cup"><h2>七人杯 · 决赛直播</h2>${finalMarkup(cup.finalTournament)}</section>`;
  return `<section class="panel seven-cup"><p class="eyebrow">ALL-TIME LEGENDS CUP</p><h2>${cup.champion?`冠军 · ${esc(cup.champion.name)}`:stage?`${labels[stage-1]} · 赛果`:'八队七人杯'}</h2><p>${cup.champion?(cup.champion.id===myId()?'你赢得了全时代七人杯！':'本届七人杯已结束。'):eliminated?'你的球队已出局，可以继续观看冠军争夺。':stage?`晋级成功，下一轮：${labels[stage]}`:'单场淘汰，决赛进入 90 分钟直播。'}</p>${latest?latest.map(m=>`<article class="seven-fixture ${m.homeId===myId()||m.awayId===myId()?'is-yours':''}"><div><b>${esc(m.home)}</b><strong>${m.homeGoals} : ${m.awayGoals}</strong><b>${esc(m.away)}</b></div>${m.penalties?`<p>点球 ${m.penalties.home} : ${m.penalties.away}</p>`:''}<small>${m.homeGoals?`${esc(m.home)}：${esc(m.homeScorers.join('、'))}`:'主队无进球'}<br>${m.awayGoals?`${esc(m.away)}：${esc(m.awayScorers.join('、'))}`:'客队无进球'}</small></article>`).join(''):`<div class="seven-entrants">${cup.teams.map(t=>`<span>${esc(t.name)}</span>`).join('')}</div>`}${cup.champion?'':stage===2?`<button id="seven-start-final" class="primary" ${busy?'disabled':''}>开始决赛 · 90 分钟直播 ↗</button>`:`<button id="seven-next-round" class="primary" ${busy?'disabled':''}>模拟${labels[stage]} ↗</button>`}<p class="hint">传奇 AI 按国家历史最佳版本优化阵型，不再额外增加能力值。无年代惩罚，位置与羁绊计入能力；冠军并非必得。</p></section>`;
 }
 function render(){
  clearInterval(ticker);if(!visible)return;if(!s){setup();return;}
  const pool=sevenPoolById.get(s.pool),picked=sevenPlayers(s),used=new Set(picked.filter(Boolean).map(p=>p.identity)),locked=new Set(blocked()),count=s.picks.filter(Boolean).length;
  root.innerHTML=`<div class="seven-shell"><header class="seven-header"><div><p class="eyebrow">MINI GAMES / ALL-TIME BRAWL</p><h1>七人制 · 全时代混战</h1><p>历届世界杯混合 · 不限年代 · 只抽国家${room?' · 好友联机':''}</p></div><div><button id="seven-back" ${busy?'disabled':''}>← ALL GAMES</button><button id="seven-restart" ${busy?'disabled':''}>${room?'离开房间 / 重开':'重开'}</button></div></header>${roomMarkup()}<p id="seven-message" role="status">${esc(message||'先选球员，再点位置试位；第二次点击同一位置锁定。')}</p>${upgrade?upgradeMarkup():''}<div class="seven-workspace"><section class="panel seven-squad"><div class="section-head"><div><p class="eyebrow">YOUR ALL-TIME SEVEN</p><h2>${esc(s.teamName)} <small>${count} / 7</small></h2></div><label class="sr-only" for="seven-formation">七人阵型</label><select id="seven-formation" ${s.cup||spinning||busy?'disabled':''}>${Object.keys(sevenFormations).map(f=>`<option ${s.formation===f?'selected':''}>${f}</option>`).join('')}</select></div><div class="pitch seven-pitch">${sevenLayout(s.formation).map((xy,i)=>slotMarkup(s.picks[i],i,xy)).join('')}</div><div class="seven-overall">阵容评分 <b>${sevenOverall(s)||'—'}</b><span>1 门将 · 6 场上球员</span></div><p class="hint">确认后球员不能移除或换位；开赛前可切换阵型，保留原槽位。没有年代惩罚；位置适配与羁绊照常生效。</p></section><div>${s.cup?cupMarkup():`<section class="panel seven-draw"><p class="eyebrow">ONE COUNTRY / EVERY ERA</p><h2 id="seven-country" class="${spinning?'is-spinning':''}">${spinning?'抽取国家中…':pool?esc(pool.country):s.phase==='complete'?'七人集结完毕':'准备抽取国家'}</h2><p>${spinning?'':pool?`${pool.players.length} 张世界杯版本 · ${Math.min(...pool.players.map(p=>p.year))}–${Math.max(...pool.players.map(p=>p.year))}`:'每次确认后，手动 Spin 下一组国家。'}</p><div class="seven-draw-actions"><button id="seven-spin" class="primary" ${(s.phase!=='waiting'&&!drawEmpty())||spinning||busy?'disabled':''}>${drawEmpty()?'本组已抢完 · 免费 Spin':'SPIN · 抽取国家'}</button><button id="seven-reroll" ${s.phase!=='ready'||s.rerolls===0||spinning||busy?'disabled':''}>重转 · ${s.rerolls} 次</button></div>${s.phase==='complete'?`<button id="seven-start-cup" class="primary" ${busy||s.ready?'disabled':''}>${room?s.ready?'已准备 · 等待朋友':'准备 · 与朋友共同开赛':'进入传奇七人杯 ↗'}</button>`:''}</section>${s.phase==='ready'&&!spinning?`<label class="seven-filter-label" for="seven-filter">查找历代球员</label><input id="seven-filter" value="${esc(filterQuery)}" placeholder="搜索姓名、位置或世界杯年份…">`:''}<div class="seven-pool" aria-label="七人制候选球员">${!spinning&&s.phase==='ready'&&pool?pool.players.map(p=>`<button class="player-card ${style(p.rating)} ${selected===p.id?'is-chosen':''}" data-seven-player="${esc(p.id)}" data-seven-search="${esc(`${p.name} ${p.originalName} ${p.year} ${positionList(p.positions)}`.toLowerCase())}" aria-pressed="${selected===p.id}" ${used.has(p.identity)||locked.has(p.id)||busy?'disabled':''}>${energy(p.rating)}<span class="avatar" aria-hidden="true">${playerSilhouette()}</span><span class="player-info"><span class="name">${esc(p.name)}</span><small>${heightLabel(p)}</small><small>${positionList(p.positions)}</small><small class="seven-source">${p.year} 世界杯</small><small class="player-base-rating">初始能力 <b>${p.rating}</b></small>${locked.has(p.id)?'<small>🔒 朋友已选此届版本</small>':used.has(p.identity)?'<small>本人已入队</small>':''}</span><span class="tier">${p.tier}</span></button>`).join(''):'<div class="seven-empty">'+(spinning?'正在揭晓…':s.phase==='complete'?'跨时代七人阵容已完成，准备争冠。':'按 Spin，揭晓下一组历代球员。')+'</div>'}</div>`}</div></div></div>`;
  $('seven-back').onclick=onAllGames;$('seven-restart').onclick=reset;$('seven-formation').onchange=e=>{preview=null;room?network('formation',{formation:e.target.value}):act(()=>changeSevenFormation(s,e.target.value));};bindUpgrade();
  root.querySelectorAll('[data-seven-player]').forEach(el=>el.onclick=()=>{if(busy)return;selected=el.dataset.sevenPlayer;preview=null;message='已选球员，请点击空位试位。';render();});
  root.querySelectorAll('[data-seven-slot]').forEach(el=>el.onclick=()=>{
   if(busy||spinning)return;const index=Number(el.dataset.sevenSlot);if(s.picks[index]){message='此位置已锁定；可切阵型，不可换人或移动。';render();return;}if(!selected){message='先从右边选择球员。';render();return;}
   try{const next=pickSeven(s,selected,index,blocked());if(preview!==index){preview=index;message='半透明卡显示适配后的能力；再点一次确认。';render();}else if(room)network('pick',{player:selected,slot:index});else{s=next;selected=null;preview=null;message=s.phase==='complete'?'7 人已锁定，准备进入七人杯。':'球员已锁定，下一轮请手动 Spin。';persist();render();}}catch(e){message=e.message;render();}
  });
  if($('seven-filter')){const filter=()=>root.querySelectorAll('[data-seven-search]').forEach(el=>el.hidden=!el.dataset.sevenSearch.includes(filterQuery.toLowerCase().trim()));$('seven-filter').oninput=e=>{filterQuery=e.target.value;filter();};filter();}
  if($('seven-spin'))$('seven-spin').onclick=()=>spin(false);if($('seven-reroll'))$('seven-reroll').onclick=()=>spin(true);
  if($('seven-start-cup'))$('seven-start-cup').onclick=()=>room?network('ready'):act(()=>startSevenCup(s));
  if($('seven-next-round'))$('seven-next-round').onclick=()=>room?network('advance',{expected:snapshot.cursor}):act(()=>nextSevenRound(s));
  if($('seven-start-final'))$('seven-start-final').onclick=()=>room?network('start_final'):act(()=>startSevenFinal(s));
  if(s.cup?.live){if(focusedFinal!==s.cup.live.startedAt){focusedFinal=s.cup.live.startedAt;root.querySelector('.final-live')?.scrollIntoView({block:'start'});}ticker=setInterval(tick,70);tick();}
 }
 function tick(){
  if(!visible||!s?.cup?.live)return;const now=Date.now()+(room?offset:0),frame=sevenFinalFrame(s,now);
  updateFinalLive(s.cup.finalTournament,frame,()=>room?network('kick',{expected:snapshot.final_live.kicks}):act(()=>kickSevenFinal(s)),busy,root);
  if(frame.complete&&!busy&&!finalFinishing&&Date.now()>retryAt){
   if(!room){s=finishSevenFinal(s,now);persist();render();return;}
   finalFinishing=true;network('finish').finally(()=>{finalFinishing=false;retryAt=Date.now()+1000;});
  }
 }
 async function spin(reroll){
  if(spinning||busy)return;let next=null;if(!room)try{next=spinSeven(s,Math.random,reroll);}catch(e){message=e.message;render();return;}
  selected=null;preview=null;filterQuery='';spinning=true;message='';const token=++spinToken;render();
  const names=['巴西','阿根廷','荷兰','德国','法国','英格兰','意大利','日本','葡萄牙'];let n=0;const id=setInterval(()=>{if(token!==spinToken){clearInterval(id);return;}const el=$('seven-country');if(el)el.textContent=names[n++%names.length];},70);
  await new Promise(resolve=>setTimeout(resolve,750));clearInterval(id);if(token!==spinToken)return;spinning=false;
  if(room)await network('spin',{reroll});else{s=next;persist();render();}
 }
 return {
  open(){visible=true;if(!s&&!room)s=load();render();let saved;try{saved=sessionStorage.getItem(roomKey);}catch{}if(room){pollingOn();readRoom();}else if(saved){busy=true;message='正在恢复七人房间…';render();const token=generation,seq=++requestSeq;rpc('fc7_read',{p_code:saved}).then(data=>{if(token===generation&&visible){accept(data,seq);pollingOn();}}).catch(e=>{if(token===generation){error(e);if(['FC7_NOT_MEMBER','FC7_ROOM_CLOSED'].includes(e.message))sessionStorage.removeItem(roomKey);render();}}).finally(()=>{if(token===generation){busy=false;render();}});}},
  close(){pickTracker.reset();clearPickNotices();visible=false;spinToken++;spinning=false;selected=null;preview=null;clearInterval(poller);clearInterval(ticker);},snapshot:()=>s
 };
}
