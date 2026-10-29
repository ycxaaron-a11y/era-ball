import {pools,positionPenalty,tier} from './data.js';
import {chemistryBonus} from './chemistry.js';
import {seeded} from './random.js';
import {prepareFinal,finalFrame} from './final-match.js';
export const sevenFormations={
 '2-3-1':[['ST'],['LM','CAM','RM'],['CB','CB'],['GK']],
 '3-2-1':[['ST'],['CM','CM'],['LB','CB','RB'],['GK']],
 '2-2-2':[['ST','ST'],['CM','CM'],['CB','CB'],['GK']],
 '3-1-2':[['ST','ST'],['CAM'],['LB','CB','RB'],['GK']]
};
export const sevenPositions=f=>sevenFormations[f].flat();
export const sevenLayout=f=>sevenFormations[f].flatMap((row,r)=>row.map((pos,c)=>({pos,x:100*(c+1)/(row.length+1),y:12+r*25})));
const cards=new Map(),buckets=new Map();
for(const pool of pools.filter(p=>p.mode==='world_cup'))for(const p of pool.players){
 const country=pool.team==='西德'?'德国':pool.team;
 cards.set(p.id,p);
 if(!buckets.has(country))buckets.set(country,{id:country,country,players:[]});
 buckets.get(country).players.push(p);
}
// Every World Cup edition remains selectable; the whole country's history is mixed.
export const sevenPools=[...buckets.values()].map(p=>({...p,players:p.players.sort((a,b)=>b.rating-a.rating||b.year-a.year||a.id.localeCompare(b.id))}));
export const sevenPoolById=new Map(sevenPools.map(p=>[p.id,p]));
export const sevenCardById=cards;
export function newSevenState(teamName='我的七人队'){
 return {version:2,teamName:String(teamName).trim().slice(0,24)||'我的七人队',formation:'2-3-1',picks:Array(7).fill(null),pool:null,rerolls:3,phase:'waiting',cup:null};
}
export function restoreSevenState(value){
 try{
  if(!value||value.version!==2||!sevenFormations[value.formation]||!Array.isArray(value.picks)||value.picks.length!==7)return null;
  const state={...newSevenState(value.teamName),...value};delete state.eraId;
  if(!Number.isInteger(state.rerolls)||state.rerolls<0||state.rerolls>3||!['waiting','ready','complete'].includes(state.phase))return null;
  const used=new Set();for(const [i,id] of state.picks.entries()){if(id===null)continue;const p=cards.get(id);if(!p||used.has(p.identity)||(i===6)!==p.positions.includes('GK'))return null;used.add(p.identity);}
  if(state.pool&&!sevenPoolById.has(state.pool))return null;
  if((state.phase==='complete')!==state.picks.every(Boolean))return null;
  if(state.phase==='ready'&&!state.pool)return null;
  if(state.cup&&(!Array.isArray(state.cup.teams)||!Array.isArray(state.cup.rounds)||!Number.isInteger(state.cup.seed)||state.cup.rounds.length>3))return null;
  return state;
 }catch{return null;}
}
export function sevenPlayers(s){return s.picks.map(id=>cards.get(id)||null);}
// All-time brawl: position and chemistry apply, historical-era penalties do not.
export function sevenAbility(s,p,pos){return Math.max(1,p.rating-positionPenalty(p,pos)+chemistryBonus(sevenPlayers(s),p));}
export function sevenOverall(s){const slots=sevenPositions(s.formation);return Math.round(sevenPlayers(s).reduce((n,p,i)=>n+(p?sevenAbility(s,p,slots[i]):0),0)/7)+(s.legendBonus||0);}
export function availableSevenPools(s,blocked=[]){
 const used=new Set(sevenPlayers(s).filter(Boolean).map(p=>p.identity)),locked=new Set(blocked),keeperOpen=!s.picks[6],outfieldOpen=s.picks.slice(0,6).some(p=>!p);
 return sevenPools.filter(pool=>pool.players.some(p=>!locked.has(p.id)&&!used.has(p.identity)&&(p.positions.includes('GK')?keeperOpen:outfieldOpen)));
}
export function spinSeven(s,random=Math.random,reroll=false,blocked=[]){
 if(s.phase==='complete'||s.cup)throw Error('本轮阵容已完成，请重开');
 if(reroll){if(s.phase!=='ready')throw Error('先 Spin 抽取国家');if(s.rerolls<=0)throw Error('重转机会已用完');}
 else if(s.phase!=='waiting'&&(s.phase!=='ready'||availableSevenPools(s,blocked).some(p=>p.id===s.pool)))throw Error('先确认一名球员，或使用额外重转');
 const options=availableSevenPools(s,blocked),alternatives=options.filter(p=>p.id!==s.pool),eligible=alternatives.length?alternatives:options;
 if(!eligible.length)throw Error('没有可选球员，请重开');
 return {...s,pool:eligible[Math.min(eligible.length-1,Math.floor(random()*eligible.length))].id,phase:'ready',rerolls:s.rerolls-(reroll?1:0)};
}
export function changeSevenFormation(s,formation){if(!sevenFormations[formation])throw Error('阵型无效');if(s.cup)throw Error('杯赛开始后不能改阵型');return {...s,formation};}
export function pickSeven(s,id,index,blocked=[]){
 if(s.phase!=='ready'||s.cup)throw Error('先 Spin，再选择球员');
 if(!Number.isInteger(index)||index<0||index>=7||s.picks[index])throw Error('这个位置已锁定');
 const p=sevenPoolById.get(s.pool)?.players.find(p=>p.id===id);if(!p)throw Error('请选择当前国家的世界杯球员');
 if(blocked.includes(id))throw Error('这个届次版本已被朋友选走，其他届次仍可选');
 if(sevenPlayers(s).some(q=>q?.identity===p.identity))throw Error('同一位球员只能选一次');
 const pos=sevenPositions(s.formation)[index];if((pos==='GK')!==p.positions.includes('GK'))throw Error(pos==='GK'?'门将位置必须选择门将':'门将只能放在门将位置');
 const picks=s.picks.map((old,i)=>i===index?id:old);return {...s,picks,phase:picks.every(Boolean)?'complete':'waiting',pool:null};
}
function shuffle(values,random){const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function botTeam(pool,index){
 const candidates=Object.keys(sevenFormations).map(formation=>{
  const used=new Set(),picks=sevenPositions(formation).map(pos=>{
   const options=pool.players.filter(p=>!used.has(p.identity)&&(pos==='GK')===p.positions.includes('GK')).sort((a,b)=>(b.rating-positionPenalty(b,pos))-(a.rating-positionPenalty(a,pos))||a.id.localeCompare(b.id));const p=options[0];if(p)used.add(p.identity);return p?.id||null;
  });return {id:`bot-${index}`,name:`${pool.country}传奇队`,formation,picks,legendBonus:0};
 });return candidates.sort((a,b)=>sevenOverall(b)-sevenOverall(a))[0];
}
export function startSevenCup(s,seed=Date.now(),humans=null){
 if(s.phase!=='complete'||!s.picks.every(Boolean))throw Error('先选满 7 人');if(s.cup)return s;
 const entrants=humans||[{...s,id:'you'}];if(entrants.length<1||entrants.length>4||entrants.some(t=>!t.picks.every(Boolean)))throw Error('等待所有玩家选满 7 人');
 const random=seeded(seed),national=sevenPools.filter(p=>new Set(p.players.filter(p=>!p.positions.includes('GK')).map(p=>p.identity)).size>=6&&p.players.some(p=>p.positions.includes('GK')));
 // Optimize each all-time national side, then seed opponents from the top 10.
 const strong=national.map(botTeam).sort((a,b)=>sevenOverall(b)-sevenOverall(a)).slice(0,10),opponents=shuffle(strong,random).slice(0,8-entrants.length).map((t,i)=>({...t,id:`bot-${i}`}));
 const teams=Array(8).fill(null),seats=[0,4,2,6];entrants.forEach((human,i)=>teams[seats[i]]={id:human.id,name:human.teamName||human.name,formation:human.formation,picks:human.picks});
 for(let i=0;i<8;i++)if(!teams[i])teams[i]=opponents.shift();
 return {...s,cup:{seed:seed>>>0,teams,rounds:[],champion:null,finalTournament:null,live:null}};
}
function poisson(mean,random){let n=0,product=1,limit=Math.exp(-mean);do{product*=random();n++;}while(product>limit&&n<14);return n-1;}
function teamView(t){const state={...t},slots=sevenPositions(t.formation);return {...t,players:sevenPlayers(t).map((p,i)=>({id:`${t.id}:${i}`,name:p.name,pos:slots[i],rating:sevenAbility(state,p,slots[i])+(t.legendBonus||0)}))};}
function scoreMatch(home,away,random,id,final=false){
 const h=teamView(home),a=teamView(away),advantage=Math.max(-.8,Math.min(.8,(sevenOverall(home)-sevenOverall(away))/25));
 const homeGoals=poisson((1.7+advantage)*(final?.82:1),random),awayGoals=poisson((1.7-advantage)*(final?.82:1),random),events=[];
 for(const [team,total] of [[h,homeGoals],[a,awayGoals]])for(let i=0;i<total;i++){
  const candidates=team.players.filter(p=>p.pos!=='GK'),weighted=candidates.flatMap(p=>Array(['ST','LW','RW','CAM'].includes(p.pos)?3:1).fill(p)),player=weighted[Math.floor(random()*weighted.length)];
  events.push({minute:1+Math.floor(random()*90),team:team.id,scorer:player.id,assist:null});
 }
 events.sort((a,b)=>a.minute-b.minute);
 const performances=[h,a].flatMap(t=>t.players.map(p=>({player:p,team:t.id,score:6+events.filter(e=>e.scorer===p.id).length})));
 const penalties=homeGoals===awayGoals?[3+Math.floor(random()*2),3+Math.floor(random()*2)]:null;if(penalties&&penalties[0]===penalties[1])penalties[random()<.5?0:1]++;
 const winner=homeGoals>awayGoals?h.id:homeGoals<awayGoals?a.id:penalties[0]>penalties[1]?h.id:a.id;
 return {id,home:h.id,away:a.id,h:homeGoals,a:awayGoals,events,performances,winner,penalties};
}
function summary(m,teams){const home=teams.find(t=>t.id===m.home),away=teams.find(t=>t.id===m.away),player=(id,pid)=>teamView(teams.find(t=>t.id===id)).players.find(p=>p.id===pid);return {home:home.name,away:away.name,homeId:home.id,awayId:away.id,homeGoals:m.h,awayGoals:m.a,homeScorers:m.events.filter(e=>e.team===home.id).map(e=>player(e.team,e.scorer).name),awayScorers:m.events.filter(e=>e.team===away.id).map(e=>player(e.team,e.scorer).name),penalties:m.penalties?{home:m.penalties[0],away:m.penalties[1]}:null,winnerId:m.winner};}
export function nextSevenRound(s){
 if(!s.cup)throw Error('先开始七人杯');if(s.cup.champion)return s;
 if(s.cup.teams.length===2)throw Error('决赛必须点击开始直播，不能直接揭晓结果');
 const random=seeded((s.cup.seed+Math.imul(s.cup.rounds.length+1,104729))>>>0),teams=s.cup.teams,matches=[];
 for(let i=0;i<teams.length;i+=2)matches.push(summary(scoreMatch(teams[i],teams[i+1],random,`seven-${s.cup.rounds.length}-${i}`),teams));
 return {...s,cup:{...s.cup,teams:matches.map(m=>teams.find(t=>t.id===m.winnerId)),rounds:[...s.cup.rounds,matches]}};
}
export function sevenFinalTournament(s){
 if(s.cup?.teams.length!==2)throw Error('尚未进入决赛');
 const teams=s.cup.teams,match=scoreMatch(teams[0],teams[1],seeded((s.cup.seed^0xa17e63)>>>0),'seven-final',true);
 return prepareFinal({seed:s.cup.seed,teams:teams.map(teamView),phases:Array.from({length:6},(_,i)=>({matches:i===5?[match]:[]}))});
}
export function startSevenFinal(s,startedAt=Date.now(),kicks=0){
 if(s.cup?.champion)return s;
 return {...s,cup:{...s.cup,finalTournament:s.cup.finalTournament||sevenFinalTournament(s),live:s.cup.live?{...s.cup.live,kicks}: {startedAt,kicks}}};
}
export function sevenFinalFrame(s,now=Date.now()){return finalFrame(s.cup.finalTournament.phases[5].matches[0],s.cup.live,now);}
export function kickSevenFinal(s,now=Date.now()){
 const frame=sevenFinalFrame(s,now);if(!frame.penalty||frame.complete)throw Error('还没有进入点球阶段');
 return {...s,cup:{...s.cup,live:{...s.cup.live,kicks:s.cup.live.kicks+1}}};
}
export function finishSevenFinal(s,now=Date.now()){
 const frame=sevenFinalFrame(s,now);if(!frame.complete)throw Error('决赛尚未结束');
 const match=s.cup.finalTournament.phases[5].matches[0];return {...s,cup:{...s.cup,rounds:[...s.cup.rounds,[summary(match,s.cup.teams)]],champion:s.cup.teams.find(t=>t.id===match.winner),live:null}};
}
export function sevenGrade(s,p,pos){return tier(sevenAbility(s,p,pos));}
export function sevenRoomState(snapshot){
 const mine=snapshot.members.find(m=>m.is_self);if(!mine)throw Error('你已不在这个房间');
 let s=restoreSevenState(mine.state);if(!s)throw Error('七人制房间版本不同，请所有人刷新');
 if(snapshot.status==='playing'){
  const humans=[...snapshot.members].sort((a,b)=>a.seat-b.seat).map(m=>({...m.state,id:`human-${m.seat}`}));s=startSevenCup(s,snapshot.seed,humans);
  for(let i=0;i<Math.min(2,snapshot.cursor);i++)s=nextSevenRound(s);
  if(snapshot.final_live){s=startSevenFinal(s,snapshot.final_live.started_at,snapshot.final_live.kicks);if(snapshot.cursor===3)s=finishSevenFinal({...s,cup:{...s.cup,live:{...s.cup.live,kicks:s.cup.finalTournament.phases[5].matches[0].shootout.length}}},snapshot.final_live.started_at+20000);}
 }
 return s;
}
