import {pools,eras,fit,tier} from './data.js';
import {chemistryBonus} from './chemistry.js';
import {clubPlayerCountries} from './player-countries.js';
export const sevenFormations={
 '2-3-1':[['ST'],['LM','CAM','RM'],['CB','CB'],['GK']],
 '3-2-1':[['ST'],['CM','CM'],['LB','CB','RB'],['GK']],
 '2-2-2':[['ST','ST'],['CM','CM'],['CB','CB'],['GK']],
 '3-1-2':[['ST','ST'],['CAM'],['LB','CB','RB'],['GK']]
};
export const sevenPositions=f=>sevenFormations[f].flat();
export const sevenLayout=f=>sevenFormations[f].flatMap((row,r)=>row.map((pos,c)=>({pos,x:100*(c+1)/(row.length+1),y:12+r*25})));
const nationality=new Map(pools.filter(p=>p.mode!=='ucl').flatMap(s=>s.players.map(p=>[p.identity,s.team==='西德'?'德国':s.team])));
const cards=new Map(),buckets=new Map();
for(const pool of pools)for(const p of pool.players){
 const country=pool.mode==='ucl'?(clubPlayerCountries.get(p.identity)||nationality.get(p.identity)):(pool.team==='西德'?'德国':pool.team);
 if(!country)throw Error(`七人制缺少国家归属：${p.identity}`);
 cards.set(p.id,p);const id=`${country}:${pool.eraId}`;
 if(!buckets.has(id))buckets.set(id,{id,country,eraId:pool.eraId,players:new Map()});
 // The same person can have several club/cup cards in a five-year interval;
 // expose their strongest existing version once, not duplicate identities.
 const bucket=buckets.get(id),old=bucket.players.get(p.identity);
 if(!old||old.rating<p.rating)bucket.players.set(p.identity,p);
}
export const sevenPools=[...buckets.values()].map(p=>({...p,players:[...p.players.values()].sort((a,b)=>b.rating-a.rating||a.id.localeCompare(b.id))}));
export const sevenPoolById=new Map(sevenPools.map(p=>[p.id,p]));
export const sevenCardById=cards;
export function newSevenState(eraId='2020s',teamName='我的七人队'){
 if(!eras.some(e=>e.id===eraId))throw Error('请选择有效年代');
 return {version:1,eraId,teamName:String(teamName).trim().slice(0,24)||'我的七人队',formation:'2-3-1',picks:Array(7).fill(null),pool:null,rerolls:3,phase:'waiting',cup:null};
}
export function restoreSevenState(value){
 try{
  if(!value||value.version!==1||!sevenFormations[value.formation]||!eras.some(e=>e.id===value.eraId)||!Array.isArray(value.picks)||value.picks.length!==7)return null;
  const state={...newSevenState(value.eraId,value.teamName),...value};
  if(!Number.isInteger(state.rerolls)||state.rerolls<0||state.rerolls>3||!['waiting','ready','complete'].includes(state.phase))return null;
  const used=new Set();for(const [i,id] of state.picks.entries()){if(id===null)continue;const p=cards.get(id);if(!p||eras.find(e=>p.year>=e.from&&p.year<=e.to)?.id!==state.eraId)return null;if(!pools.find(s=>s.id===id.split(':')[0])?.players.some(x=>x.id===id))return null;if(used.has(p.identity)||(i===6)!==p.positions.includes('GK'))return null;used.add(p.identity);}
  if(state.pool&&sevenPoolById.get(state.pool)?.eraId!==state.eraId)return null;
  if(state.phase==='complete'&&!state.picks.every(Boolean))return null;
  if(state.phase==='ready'&&!state.pool)return null;
  if(state.cup&&(!Array.isArray(state.cup.teams)||!Array.isArray(state.cup.rounds)||!Number.isInteger(state.cup.seed)||state.cup.rounds.length>3))return null;
  return state;
 }catch{return null;}
}
export function sevenPlayers(s){return s.picks.map(id=>cards.get(id)||null);}
export function sevenAbility(s,p,pos){return fit(p,pos,s.eraId)+chemistryBonus(sevenPlayers(s),p);}
export function sevenOverall(s){const slots=sevenPositions(s.formation);return Math.round(sevenPlayers(s).reduce((n,p,i)=>n+(p?sevenAbility(s,p,slots[i]):0),0)/7);}
export function availableSevenPools(s){
 const used=new Set(sevenPlayers(s).filter(Boolean).map(p=>p.identity)),keeperOpen=!s.picks[6],outfieldOpen=s.picks.slice(0,6).some(p=>!p);
 return sevenPools.filter(pool=>pool.eraId===s.eraId&&pool.players.some(p=>!used.has(p.identity)&&(p.positions.includes('GK')?keeperOpen:outfieldOpen)));
}
export function spinSeven(s,random=Math.random,reroll=false){
 if(s.phase==='complete'||s.cup)throw Error('本轮阵容已完成，请重开');
 if(reroll){if(s.phase!=='ready')throw Error('先 Spin 抽取国家');if(s.rerolls<=0)throw Error('重转机会已用完');}
 else if(s.phase!=='waiting')throw Error('先确认一名球员，或使用额外重转');
 const options=availableSevenPools(s),alternatives=options.filter(p=>p.id!==s.pool),eligible=alternatives.length?alternatives:options;
 if(!eligible.length)throw Error('当前年代没有可用球员，请重开');
 const index=Math.min(eligible.length-1,Math.max(0,Math.floor(random()*eligible.length)));
 return {...s,pool:eligible[index].id,phase:'ready',rerolls:s.rerolls-(reroll?1:0)};
}
export function changeSevenFormation(s,formation){if(!sevenFormations[formation])throw Error('阵型无效');if(s.cup)throw Error('杯赛开始后不能改阵型');return {...s,formation};}
export function pickSeven(s,id,index){
 if(s.phase!=='ready'||s.cup)throw Error('先 Spin，再选择球员');
 if(!Number.isInteger(index)||index<0||index>=7||s.picks[index])throw Error('这个位置已锁定');
 const p=sevenPoolById.get(s.pool)?.players.find(p=>p.id===id);if(!p)throw Error('请选择当前国家的球员');
 if(sevenPlayers(s).some(q=>q?.identity===p.identity))throw Error('同一位球员只能选一次');
 const pos=sevenPositions(s.formation)[index];if((pos==='GK')!==p.positions.includes('GK'))throw Error(pos==='GK'?'门将位置必须选择门将':'门将只能放在门将位置');
 const picks=s.picks.map((old,i)=>i===index?id:old);return {...s,picks,phase:picks.every(Boolean)?'complete':'waiting',pool:null};
}
function randomFor(seed){let value=seed>>>0;return ()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296;};}
function shuffle(values,random){const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function botTeam(pool,index){
 const used=new Set(),picks=sevenPositions('2-3-1').map(pos=>{const options=pool.players.filter(p=>!used.has(p.identity)&&(pos==='GK')===p.positions.includes('GK')).sort((a,b)=>fit(b,pos,pool.eraId)-fit(a,pos,pool.eraId));const p=options[0];if(p)used.add(p.identity);return p?.id||null;});
 return {id:`bot-${index}`,name:`${pool.country}七人队`,formation:'2-3-1',picks};
}
export function startSevenCup(s,seed=Date.now()){
 if(s.phase!=='complete'||!s.picks.every(Boolean))throw Error('先选满 7 人');
 if(s.cup)return s;
 const random=randomFor(seed),national=sevenPools.filter(p=>p.eraId===s.eraId&&p.players.filter(p=>!p.positions.includes('GK')).length>=6&&p.players.some(p=>p.positions.includes('GK')));
 const candidates=shuffle(national,random);if(!candidates.length)throw Error('当前年代杯赛球队不足');
 const opponents=Array.from({length:7},(_,i)=>{const team=botTeam(candidates[i%candidates.length],i);if(candidates.length<7)team.name+=` · ${i+1}队`;return team;});
 const teams=[{id:'you',name:s.teamName,formation:s.formation,picks:s.picks},...opponents];
 return {...s,cup:{seed:seed>>>0,teams,rounds:[],champion:null}};
}
function poisson(mean,random){let n=0,product=1;const limit=Math.exp(-mean);do{product*=random();n++;}while(product>limit&&n<14);return n-1;}
function matchSeven(home,away,eraId,random){
 const rating=team=>sevenOverall({...team,eraId}),a=rating(home),b=rating(away),advantage=Math.max(-.8,Math.min(.8,(a-b)/25));
 const h=poisson(1.7+advantage,random),v=poisson(1.7-advantage,random);
 const penalties=h===v?{home:0,away:0}:null;let winner=h>v?home:away;
 if(penalties){for(let i=0;i<5;i++){if(random()<.74)penalties.home++;if(random()<.74)penalties.away++;}let sudden=0;while(penalties.home===penalties.away&&sudden++<12){if(random()<.74)penalties.home++;if(random()<.74)penalties.away++;}if(penalties.home===penalties.away){if(random()<.5)penalties.home++;else penalties.away++;}winner=penalties.home>penalties.away?home:away;}
 const scorers=(team,total)=>{const outfield=team.picks.map(id=>cards.get(id)).filter(p=>p&&!p.positions.includes('GK'));return Array.from({length:total},()=>outfield[Math.floor(random()*outfield.length)].name);};
 return {home:home.name,away:away.name,homeId:home.id,awayId:away.id,homeGoals:h,awayGoals:v,homeScorers:scorers(home,h),awayScorers:scorers(away,v),penalties,winnerId:winner.id};
}
export function nextSevenRound(s){
 if(!s.cup)throw Error('先开始七人杯');if(s.cup.champion)return s;
 const random=randomFor((s.cup.seed+Math.imul(s.cup.rounds.length+1,104729))>>>0),teams=s.cup.teams,matches=[];
 for(let i=0;i<teams.length;i+=2)matches.push(matchSeven(teams[i],teams[i+1],s.eraId,random));
 const winners=matches.map(m=>teams.find(t=>t.id===m.winnerId));
 return {...s,cup:{...s.cup,teams:winners,rounds:[...s.cup.rounds,matches],champion:winners.length===1?winners[0]:null}};
}
export function sevenGrade(s,p,pos){return tier(sevenAbility(s,p,pos));}
