import {pools,eras} from './data.js';
import {teamGeography} from './daily-geography.js';
export const DAILY_LIMIT=12;
const aliases={
 'cristiano-ronaldo':['C罗','CR7','小小罗','克里斯蒂亚诺罗纳尔多'],
 'lionel-messi':['梅西','Messi','莱昂内尔梅西'],
 'ronaldo-nazario':['大罗','R9','罗纳尔多'],'ronaldo':['大罗','R9','罗纳尔多'],
 'ronaldinho':['小罗','罗纳尔迪尼奥'],'neymar':['内马尔','内少'],
 'luis-suarez':['苏亚雷斯','苏牙'],'wayne-rooney':['鲁尼'],
 'andres-iniesta':['伊涅斯塔','小白'],'xavi':['哈维'],
 'thierry-henry':['亨利'],'pele':['贝利','球王贝利'],'diego-maradona':['马拉多纳','老马']
};
const teamAliases={'皇家马德里':'皇马 Real Madrid','巴塞罗那':'巴萨 Barcelona','曼彻斯特联':'曼联 Manchester United','曼彻斯特城':'曼城 Manchester City','巴黎圣日耳曼':'巴黎 PSG','国际米兰':'国米 Inter','拜仁慕尼黑':'拜仁 Bayern'};
const normal=s=>String(s||'').normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
const seen=new Set();
export const dailyCards=pools.flatMap(pool=>{const geography=teamGeography(pool);return pool.players.map(player=>({...player,...geography,mode:pool.mode,poolId:pool.id,eraId:pool.eraId,cardKey:`${player.identity}|${pool.team}|${pool.year}`}));}).filter(card=>{if(seen.has(card.cardKey))return false;seen.add(card.cardKey);return true;});
export const dailyCardById=new Map(dailyCards.map(card=>[card.id,card]));
const history=new Map();for(const card of dailyCards){if(!history.has(card.identity))history.set(card.identity,new Set());history.get(card.identity).add(card.team);}
const searchIndex=dailyCards.map(card=>({card,names:[card.name,card.originalName,card.identity,...(aliases[card.identity]||[])].map(normal),text:normal([card.name,card.originalName,card.identity,...(aliases[card.identity]||[]),card.team,teamAliases[card.team],card.poolId,card.year].join(' '))}));
export function searchDailyCards(query,{exclude=[],limit=12}={}){
 const trimmed=String(query).trim().slice(0,100);if(!trimmed)return [];
 const terms=(trimmed.match(/[\p{L}\p{M}]+|\d+/gu)||[]).map(normal).filter(Boolean);if(!terms.length)return [];const excluded=new Set(exclude),whole=normal(trimmed);
 const exactNames=searchIndex.filter(row=>row.names.includes(whole));
 return (exactNames.length?exactNames:searchIndex).filter(row=>!excluded.has(row.card.id)&&terms.every(term=>row.text.includes(term))).map(row=>({...row,score:row.names.some(name=>name===whole)?0:row.names.some(name=>name.startsWith(whole))?1:2})).sort((a,b)=>a.score-b.score||b.card.year-a.card.year||a.card.id.localeCompare(b.card.id)).slice(0,limit).map(row=>row.card);
}
const tierOrder=['D','C','B','A','S','S+'];
const field=(value,status,direction=0,note='')=>({value,status,direction,note});
const distanceStatus=(distance,near)=>distance===0?'match':distance<=near?'near':'miss';
export function compareDailyCards(guess,target){
 const gp=[...guess.positions].sort(),tp=[...target.positions].sort(),height=target.heightCm-guess.heightCm,year=target.year-guess.year,tier=tierOrder.indexOf(target.tier)-tierOrder.indexOf(guess.tier),eraDistance=Math.abs(eras.findIndex(e=>e.id===guess.eraId)-eras.findIndex(e=>e.id===target.eraId));
 const teamMatch=guess.team===target.team,teamNear=!teamMatch&&(guess.country===target.country||history.get(guess.identity)?.has(target.team));
 return {
  player:field(guess.name,guess.identity===target.identity?'match':'miss'),
  team:field(guess.team,teamMatch?'match':teamNear?'near':'miss',0,teamNear?'同国球队，或这位球员在名单中曾效力过目标球队':''),
  continent:field(guess.continent,guess.continent===target.continent?'match':'miss'),
  region:field(guess.region,guess.region===target.region?'match':guess.continent===target.continent?'near':'miss'),
  position:field(guess.positions,JSON.stringify(gp)===JSON.stringify(tp)?'match':gp.some(pos=>tp.includes(pos))?'near':'miss'),
  height:field(guess.heightCm,distanceStatus(Math.abs(height),5),Math.sign(height)),
  era:field(guess.year,year===0?'match':eraDistance<=1?'near':'miss',Math.sign(year),eras.find(e=>e.id===guess.eraId)?.label||''),
  tier:field(guess.tier,distanceStatus(Math.abs(tier),1),Math.sign(tier))
 };
}
export function newDailyRound(random=Math.random,previousId=null){
 const candidates=dailyCards.filter(card=>card.id!==previousId),roll=Math.min(.999999999,Math.max(0,Number(random())||0));
 return {version:1,targetId:candidates[Math.floor(roll*candidates.length)].id,guesses:[],status:'playing'};
}
export function guessDaily(round,id){
 if(round.status!=='playing')throw Error('本轮已经结束，点击“再来一轮”继续。');
 if(!dailyCardById.has(id))throw Error('请从搜索结果中选择一个球员版本。');
 if(round.guesses.includes(id))throw Error('这个球员版本已经猜过，不会扣除机会。');
 const guesses=[...round.guesses,id],correct=dailyCardById.get(id).cardKey===dailyCardById.get(round.targetId).cardKey;
 return {...round,guesses,status:correct?'won':guesses.length>=DAILY_LIMIT?'lost':'playing'};
}
export const giveUpDaily=round=>round.status==='playing'?{...round,status:'gave_up'}:round;
export function restoreDailyRound(saved){
 if(!saved||saved.version!==1||!dailyCardById.has(saved.targetId)||!Array.isArray(saved.guesses)||saved.guesses.length>DAILY_LIMIT||new Set(saved.guesses).size!==saved.guesses.length||!saved.guesses.every(id=>dailyCardById.has(id))||!['playing','won','lost','gave_up'].includes(saved.status))return null;
 let result={version:1,targetId:saved.targetId,guesses:[],status:'playing'};
 try{for(const id of saved.guesses)result=guessDaily(result,id);}catch{return null;}
 return saved.status==='gave_up'&&result.status==='playing'?giveUpDaily(result):result;
}
