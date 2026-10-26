import {modes} from './modes.js';
const symbols={world_cup:'<path d="M23 10h18v10c0 10-18 10-18 0zM27 34h10M32 28v6M22 13h-6v6c0 6 6 8 9 8M42 13h6v6c0 6-6 8-9 8M23 39h18"/>',ucl:'<path d="m32 8 6 13 14 2-10 10 3 15-13-7-13 7 3-15-10-10 14-2z"/>',euro:'<path d="M21 9h22v9c0 11-22 11-22 0zM26 31h12M32 26v5M24 38h16M19 15h-5v7l10 7M45 15h5v7l-10 7"/>',copa_america:'<path d="M20 10h24v8c0 8-24 8-24 0zM24 28l8 5 8-5M32 33v8M23 43h18M21 12l11 8 11-8"/>'};
export function competitionSymbol(mode){return `<svg viewBox="0 0 64 56" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">${symbols[mode]}</svg>`;}
export function initLobby({onCompetition,onResume,onProfile,onMiniGames}){
 const $=id=>document.getElementById(id);let play='solo';
 function step(competition){$('entry-options').hidden=competition;$('competition-options').hidden=!competition;$('home-title').innerHTML=competition?(play==='solo'?'选择你的<br><span>冠军征程。</span>':'一起争夺<br><span>时代之冠。</span>'):'Same court,<br><span>different era</span>';$('home-description').textContent=competition?'选择赛事，然后确定年代。你的跨时代球队，从这里开始。':'跨越年代，组建球队。让不同世代的传奇，在同一片球场相遇。';}
 $('competition-cards').innerHTML=Object.entries(modes).map(([mode,m],i)=>`<button class="competition-card" data-competition="${mode}"><span class="competition-symbol">${competitionSymbol(mode)}</span><small>0${i+1} / ${m.label}</small><strong>${m.name}</strong><span class="competition-caption">${mode==='world_cup'?'为国家而战':mode==='ucl'?'欧洲俱乐部之巅':mode==='euro'?'欧洲国家队的荣耀':'南美足球的激情'}</span><span class="card-arrow">↗</span></button>`).join('');
 $('choose-solo').onclick=()=>{play='solo';step(true);};$('choose-online').onclick=()=>{play='online';step(true);};$('lobby-back').onclick=()=>step(false);
 document.querySelectorAll('[data-competition]').forEach(button=>button.onclick=()=>onCompetition(button.dataset.competition,play));
 $('choose-minis').onclick=onMiniGames;
 $('resume-draft').onclick=onResume;$('lobby-profile').onclick=onProfile;
 return {reset:()=>step(false),update:state=>{$('resume-draft').hidden=!state.started;$('resume-draft').textContent=`继续 ${modes[state.mode].name} · ${state.picks.filter(Boolean).length} / 16 人`;$('current-competition').textContent=modes[state.mode].name;}};
}
