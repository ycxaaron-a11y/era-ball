import {seeded} from './random.js';
const mean=t=>t.players.reduce((sum,p)=>sum+p.rating,0)/t.players.length;
function choose(players,rng){let roll=rng()*players.reduce((sum,p)=>sum+p.weight,0);return(players.find(p=>(roll-=p.weight)<=0)||players.at(-1)).player;}
export function prepareFinal(t){
 const m=t.phases[5].matches[0];if(m.liveVersion===5)return t;
 const rng=seeded((Number(t.seed)^0x51f15e5d)>>>0),home=t.teams.find(x=>x.id===m.home),away=t.teams.find(x=>x.id===m.away);
 m.regularScore=[m.h,m.a];m.extraTime=m.h===m.a;m.shootout=[];m.penalties=null;
 const extra=[];
 if(m.extraTime)for(const [team,other] of [[home,away],[away,home]])for(let attempt=0;attempt<2;attempt++){
  if(rng()>=Math.max(.05,Math.min(.4,.16+(mean(team)-mean(other))/120)))continue;
  const candidates=team.players.map(player=>({player,weight:player.pos==='GK'?.01:['ST','LW','RW'].includes(player.pos)?6:['CAM','CM'].includes(player.pos)?3:1})),scorer=choose(candidates,rng),helper=rng()<.77?choose(candidates.filter(x=>x.player.id!==scorer.id),rng):null;
  extra.push({minute:91+Math.floor(rng()*30),team:team.id,scorer:scorer.id,assist:helper?.id||null});if(team.id===home.id)m.h++;else m.a++;
 }
 m.events=[...m.events,...extra].sort((a,b)=>a.minute-b.minute);m.duration=m.extraTime?120:90;
 if(m.h!==m.a)m.winner=m.h>m.a?home.id:away.id;
 else{
  const totals=[0,0],attempts=[0,0],teams=[home,away],kickers=teams.map(t=>[...t.players].sort((a,b)=>(a.pos==='GK')-(b.pos==='GK')||b.rating-a.rating||a.id.localeCompare(b.id)));
  for(let i=0;i<220;i++){
   const side=i%2,team=teams[side],player=kickers[side][attempts[side]%kickers[side].length],keeper=teams[1-side].players.find(p=>p.pos==='GK');
   let scored=rng()<Math.max(.55,Math.min(.9,.76+(player.rating-(keeper?.rating||85))/220));
   // An exceptionally long sudden-death sequence still ends after a complete pair.
   if(i===218)scored=true;if(i===219)scored=false;
   attempts[side]++;if(scored)totals[side]++;
   m.shootout.push({team:team.id,player:player.id,name:player.name,scored,round:Math.floor(i/2)+1,score:[...totals]});
   const early=i<10&&(totals[0]>totals[1]+5-attempts[1]||totals[1]>totals[0]+5-attempts[0]);
   if(early||(i>=9&&i%2===1&&totals[0]!==totals[1]))break;
  }
  m.penalties=m.shootout.at(-1).score;m.winner=m.penalties[0]>m.penalties[1]?home.id:away.id;
 }
 for(const row of m.performances){const goals=extra.filter(e=>e.scorer===row.player.id).length,assists=extra.filter(e=>e.assist===row.player.id).length;row.score=Math.round(Math.min(10,row.score+goals*1.1+assists*.65+(m.extraTime&&row.team===m.winner?.3:0))*10)/10;}
 const best=id=>m.performances.filter(p=>!id||p.team===id).sort((a,b)=>b.score-a.score||a.player.id.localeCompare(b.player.id))[0];m.mvp=best();m.homeMvp=best(home.id);m.awayMvp=best(away.id);m.liveVersion=5;t.champion=m.winner;return t;
}
export function finalFrame(match,session,now=Date.now()){
 const elapsed=Math.max(0,now-session.startedAt),minute=elapsed<8000?Math.min(90,Math.floor(elapsed*90/8000)):match.extraTime?Math.min(120,90+Math.floor((elapsed-8000)*30/(8000/3))):90;
 const events=match.events.filter(e=>e.minute<=minute),score=[events.filter(e=>e.team===match.home).length,events.filter(e=>e.team===match.away).length],ended=minute>=match.duration,kicks=Math.min(session.kicks||0,match.shootout.length),penalty=ended&&match.shootout.length>0;
 return{minute,events,score,ended,penalty,kicks,shots:penalty?match.shootout.slice(0,kicks):[],complete:ended&&(!penalty||kicks===match.shootout.length),extra:minute>=90&&match.extraTime};
}
