import {pools,positions,playerAbility,positionPenalty,simulationVersion,catalogVersion,legacyPoolIds} from './data.js';
import {seeded} from './random.js';
import {prepareFinal} from './final-match.js';
export {seeded} from './random.js';
export function draftTeam(state,id,name,canonical=false){return{id,name,human:true,players:state.picks.slice(0,11).map((p,i)=>({id:`${id}:${i}`,name:p.name,pos:positions(state.lineupFormation||state.formation)[i],rating:canonical?p.rating:playerAbility(state,p,positions(state.formation)[i])}))};}
const power=t=>t.players.reduce((a,p)=>a+p.rating,0)/t.players.length;
function weighted(players,rng,assist=false){const weights=players.map(p=>(p.pos==='GK'?.015:['ST','LW','RW'].includes(p.pos)?assist?3:6:['CAM','CM','LM','RM'].includes(p.pos)?assist?5:3:1)*p.rating);let roll=rng()*weights.reduce((a,b)=>a+b,0);return players.find((_,i)=>(roll-=weights[i])<=0)||players.at(-1);}
function match(home,away,knockout,rng,id,goalFactor=1){
 const goals=(a,b)=>{let n=0;for(let i=0;i<7;i++)if(rng()<Math.max(.06,Math.min(.52,(.205+(a-b)/100)*goalFactor)))n++;return n;};
 const h=goals(power(home),power(away)),a=goals(power(away),power(home));const events=[];
 for(const [team,n] of [[home,h],[away,a]])for(let i=0;i<n;i++){const scorer=weighted(team.players,rng),assist=rng()<.77?weighted(team.players.filter(p=>p.id!==scorer.id),rng,true):null;events.push({minute:1+Math.floor(rng()*90),team:team.id,scorer:scorer.id,assist:assist?.id||null});}
 events.sort((a,b)=>a.minute-b.minute);
 const performances=[home,away].flatMap(t=>t.players.map(p=>({player:p,team:t.id,score:0})));
 // Match ratings combine individual contributions, result, and a seeded performance variation.
 for(const row of performances){const won=row.team===home.id?h>a:a>h;row.score=Math.round(Math.min(10,5.3+row.player.rating/100+events.filter(e=>e.scorer===row.player.id).length*1.1+events.filter(e=>e.assist===row.player.id).length*.65+(won?.35:0)+rng()*.65)*10)/10;}
 const best=team=>performances.filter(p=>!team||p.team===team).sort((a,b)=>b.score-a.score||a.player.id.localeCompare(b.player.id))[0];
 let winner=null,penalties=null;if(knockout){winner=h>a?home.id:a>h?away.id:rng()<power(home)/(power(home)+power(away))?home.id:away.id;if(h===a){const loser=3+Math.floor(rng()*3);penalties=winner===home.id?[loser+1,loser]:[loser,loser+1];}}
 return{id,home:home.id,away:away.id,h,a,events,winner,penalties,mvp:best(),homeMvp:best(home.id),awayMvp:best(away.id),performances};
}
export function standings(teams,matches){return teams.map(t=>{const row={id:t.id,name:t.name,played:0,points:0,gf:0,ga:0,won:0,drawn:0,lost:0};for(const m of matches){if(m.home!==t.id&&m.away!==t.id)continue;const [a,b]=m.home===t.id?[m.h,m.a]:[m.a,m.h];row.played++;row.gf+=a;row.ga+=b;if(a>b){row.points+=3;row.won++;}else if(a===b){row.points++;row.drawn++;}else row.lost++;}return row;}).sort((a,b)=>b.points-a.points||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf||a.id.localeCompare(b.id));}
function botPlayers(pool,id,adjustment=2){
 const remaining=[...pool.players],players=positions('4-3-3').map((pos,i)=>{remaining.sort((a,b)=>(b.rating-positionPenalty(b,pos))-(a.rating-positionPenalty(a,pos)));const p=remaining.shift();return{id:`${id}:${i}`,name:p.name,pos,rating:Math.max(15,p.rating-positionPenalty(p,pos)-adjustment)};});
 // The new national-team cups contain almost exclusively deep finalist squads.
 // Keep those AI averages comparable to the established modes, without changing human teams.
 if(['euro','copa_america'].includes(pool.mode)){const excess=Math.max(0,Math.ceil(players.reduce((sum,p)=>sum+p.rating,0)/11-(91-adjustment)));for(const p of players)p.rating=Math.max(15,p.rating-excess);}
 return players;
}
export function createTournament({mode='ucl',seed,humans,aiAdjustment,finalGoalFactor,catalogVersion:usedCatalog=catalogVersion}){
 const adjustment=aiAdjustment??-1,finalFactor=finalGoalFactor??(humans.length===1?.76:.88);
 const rng=seeded(seed);const candidates=pools.filter(p=>p.mode===mode&&(usedCatalog>=catalogVersion||legacyPoolIds.has(p.id))).map(p=>({p,order:rng()})).sort((a,b)=>a.order-b.order);
 const bots=candidates.slice(0,16-humans.length).map(({p},i)=>({id:`bot-${i}`,name:`${p.team} ${p.year}`,players:botPlayers(p,`bot-${i}`,Math.max(-3,Math.min(10,adjustment)))}));
 const groups=Array.from({length:4},(_,i)=>({name:'ABCD'[i],teams:[]}));if(humans.length<1||humans.length>4)throw Error('杯赛支持 1–4 名玩家');humans.forEach((human,i)=>groups[[0,2,1,3][i]].teams.push(human));for(const group of groups)while(group.teams.length<4)group.teams.push(bots.shift());
 const teams=groups.flatMap(g=>g.teams),phases=[];const fixtures=[[[0,3],[1,2]],[[0,2],[3,1]],[[0,1],[2,3]]];
 for(let r=0;r<3;r++)phases.push({title:`小组赛 · 第 ${r+1} 轮`,matches:groups.flatMap(g=>fixtures[r].map(([a,b],i)=>({...match(g.teams[a],g.teams[b],false,rng,`g${r}-${g.name}-${i}`),group:g.name})))});
 const rows=groups.map(g=>standings(g.teams,phases.flatMap(p=>p.matches).filter(m=>m.group===g.name))),find=id=>teams.find(t=>t.id===id);
 let entrants=[rows[0][0].id,rows[1][1].id,rows[1][0].id,rows[0][1].id,rows[2][0].id,rows[3][1].id,rows[3][0].id,rows[2][1].id];
 for(const title of ['四分之一决赛','半决赛','决赛']){const matches=[];for(let i=0;i<entrants.length;i+=2)matches.push(match(find(entrants[i]),find(entrants[i+1]),true,rng,`k${phases.length}-${i}`,title==='决赛'?finalFactor:1));phases.push({title,matches});entrants=matches.map(m=>m.winner);}
 return prepareFinal({version:5,seed,mode,groups,teams,phases,champion:entrants[0]});
}
export function statistics(tournament,cursor){const matches=tournament.phases.slice(0,cursor).flatMap(p=>p.matches);return tournament.teams.flatMap(t=>t.players.map(p=>{const played=matches.filter(m=>m.home===t.id||m.away===t.id),goals=played.reduce((n,m)=>n+m.events.filter(e=>e.scorer===p.id).length,0),assists=played.reduce((n,m)=>n+m.events.filter(e=>e.assist===p.id).length,0),mvps=played.filter(m=>m.mvp.player.id===p.id).length,total=played.reduce((n,m)=>n+(m.performances.find(x=>x.player.id===p.id)?.score||0),0);return{...p,team:t.name,goals,assists,mvps,played:played.length,average:played.length?total/played.length:0,award:goals*3+assists*2+mvps*2+total/10};})).filter(p=>p.played);}

// Older tabs only know the pre-expansion NPC catalog. A mixed room uses that
// exact catalog (and its seeded ordering) so all clients generate the same cup.
export function optionsForRoomMembers(members){
 const options={catalogVersion:members.every(m=>m.state?.catalogVersion===catalogVersion)?catalogVersion:19};
 return members.every(m=>m.state?.simulationVersion===simulationVersion)?options:{...options,aiAdjustment:2,finalGoalFactor:.88};
}
