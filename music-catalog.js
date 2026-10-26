// Event years select the tournament edition, not necessarily the recording release year.
import {eras} from './data.js';
export const lobbyMusic={id:'lobby-let-go',title:'Let Go',artist:'Beau Young Prince',year:2018,videoId:'4VvAUcJ2Yms',note:'Spider-Man: Into the Spider-Verse · 使用你指定的播放链接'};
const worldCup=[
 [1962,'El Rock del Mundial','Los Ramblers'],[1966,'World Cup Willie','Lonnie Donegan'],
 [1974,'Futbol','Maryla Rodowicz'],[1978,'El Mundial','Ennio Morricone'],
 [1982,'Mundial ’82','Plácido Domingo'],[1986,'A Special Kind of Hero','Stephanie Lawrence'],
 [1990,'Un’estate italiana','Edoardo Bennato & Gianna Nannini'],[1994,'Gloryland','Daryl Hall & Sounds of Blackness'],
 [1998,'La Copa de la Vida','Ricky Martin'],[2002,'Boom','Anastacia'],[2006,'The Time of Our Lives','Il Divo & Toni Braxton'],
 [2010,'Waka Waka (This Time for Africa)','Shakira','pRpeEdMmmQ0'],[2014,'We Are One (Ole Ola)','Pitbull, Jennifer Lopez & Claudia Leitte'],
 [2018,'Live It Up','Nicky Jam, Will Smith & Era Istrefi'],[2022,'Hayya Hayya (Better Together)','Trinidad Cardona, Davido & Aisha']
].map(([year,title,artist,videoId])=>({id:`wc-${year}`,year,title,artist,videoId,note:'世界杯歌曲参考；官方播放器链接可在音乐设置中指定'}));
const euro=[
 [2000,'Campione 2000','E-Type'],[2004,'Força','Nelly Furtado'],[2008,'Can You Hear Me','Enrique Iglesias'],[2012,'Endless Summer','Oceana'],[2016,"This One’s for You",'David Guetta & Zara Larsson'],[2020,'We Are the People','Martin Garrix, Bono & The Edge'],[2024,'Fire','MEDUZA, OneRepublic & Leony']
].map(([year,title,artist])=>({id:`euro-${year}`,year,title,artist,note:'欧洲杯歌曲参考；官方播放器链接可在音乐设置中指定'}));
const ucl={id:'ucl-anthem',title:'UEFA Champions League Anthem',artist:'Tony Britten',year:1992,note:'欧冠经典主题自 1992 年启用，并非每个年代都有独立歌曲'};
const copa={id:'copa-theme',title:'美洲杯赛事音乐（待选择）',artist:'CONMEBOL',note:'美洲杯各届音乐资料尚待核对，可自行指定官方播放链接'};
export const musicCatalog=[lobbyMusic,...worldCup,...euro,ucl,copa];
export function musicForScene({screen='home',mode='world_cup',eraId='2020s'}={}){
 if(screen!=='draft'&&screen!=='season')return lobbyMusic;
 if(mode==='ucl')return ucl;if(mode==='copa_america')return copa;
 const era=eras.find(e=>e.id===eraId)||eras.at(-1),tracks=mode==='euro'?euro:worldCup;
 return tracks.find(t=>t.year>=era.from&&t.year<=era.to)||{id:`${mode}-${era.id}`,title:`${mode==='euro'?'欧洲杯':'世界杯'} · ${era.label}`,artist:'年代氛围',note:'这个年代没有已核实的歌曲链接，可添加官方视频或使用本地音频'};
}
export function youtubeVideoId(value){
 try{const url=new URL(value),host=url.hostname.toLowerCase();let id='';if(url.protocol!=='https:')return null;if(host==='youtu.be')id=url.pathname.split('/')[1];else if(['youtube.com','www.youtube.com','m.youtube.com','music.youtube.com','www.youtube-nocookie.com'].includes(host))id=url.searchParams.get('v')||(/^\/(embed|shorts)\//.test(url.pathname)?url.pathname.split('/')[2]:'');return /^[A-Za-z0-9_-]{11}$/.test(id||'')?id:null;}catch{return null;}
}
export const musicSearchURL=track=>`https://www.youtube.com/results?search_query=${encodeURIComponent(`${track.artist} ${track.title} official`)}`;
