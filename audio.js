import {musicForScene} from './music-catalog.js';
import {createOriginalMusic} from './music-engine.js';
const storage='era-fc-audio-v1';
export function audioSettings(saved={}){
 return {music:saved.music!==false,sfx:saved.sfx!==false,volume:Number.isFinite(saved.volume)?Math.min(1,Math.max(0,saved.volume)):.45};
}
export function initAudio(){
 let settings;try{settings=audioSettings(JSON.parse(localStorage.getItem(storage))||{});}catch{settings=audioSettings();}
 let track=musicForScene(),context=null,musicGain=null,fxGain=null,engine=null,open=false,notice='点击页面后开启原创音乐';
 const container=document.createElement('aside');container.id='audio-widget';container.setAttribute('aria-label','声音设置');document.body.append(container);
 function save(){try{localStorage.setItem(storage,JSON.stringify(settings));}catch{}}
 function message(text){notice=text;const el=container.querySelector('#audio-notice');if(el)el.textContent=text;}
 function ensureContext(){
  if(context)return context;const Context=window.AudioContext||window.webkitAudioContext;if(!Context){message('当前浏览器不支持音频播放，请尝试更新浏览器。');return null;}
  context=new Context();musicGain=context.createGain();musicGain.gain.value=settings.volume;musicGain.connect(context.destination);fxGain=context.createGain();fxGain.gain.value=.2;fxGain.connect(context.destination);engine=createOriginalMusic(context,musicGain);return context;
 }
 function apply(){
  save();if(musicGain)musicGain.gain.setTargetAtTime(settings.volume,context.currentTime,.04);
  if(!context||context.state!=='running'){message(settings.music?'点击页面后开启原创音乐':'背景音乐已关闭');return;}
  if(settings.music&&!document.hidden){engine.start(track);message(settings.volume===0?'音乐音量为 0':'正在播放原创音乐 · 鼓点 / 贝斯 / 主旋律');}
  else{engine.stop();message(settings.music?'页面隐藏时音乐暂停':'背景音乐已关闭');}
 }
 function unlock(){const audio=ensureContext();if(!audio)return;if(audio.state==='suspended'){audio.resume().then(apply).catch(()=>message('请再点一次音乐开关以启动播放'));}else apply();}
 function clickSound(){
  if(!settings.sfx||!context||context.state!=='running')return;
  for(const [pitch,delay,duration,level,type] of [[88,0,.035,.15,'triangle'],[72,.007,.055,.08,'sine']]){const time=context.currentTime+delay,o=context.createOscillator(),g=context.createGain();o.type=type;o.frequency.value=440*2**((pitch-69)/12);g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(level,time+.01);g.gain.exponentialRampToValueAtTime(.0001,time+duration);o.connect(g);g.connect(fxGain);o.start(time);o.stop(time+duration+.03);o.onended=()=>{o.disconnect();g.disconnect();};}
 }
 function paint(){
  container.replaceChildren();const toggle=document.createElement('button');toggle.id='audio-toggle';toggle.type='button';toggle.textContent=settings.music?'♫ 音乐':'♫ 声音';toggle.setAttribute('aria-expanded',String(open));toggle.onclick=()=>{open=!open;paint();};container.append(toggle);if(!open)return;
  const panel=document.createElement('section');panel.id='audio-controls';panel.innerHTML=`<div class="audio-heading"><b>声音</b><span>ORIGINAL SOUNDTRACK</span></div><label><input id="music-enabled" type="checkbox" ${settings.music?'checked':''}> 原创背景音乐</label><label><input id="sfx-enabled" type="checkbox" ${settings.sfx?'checked':''}> 按钮点击音效</label><label class="audio-volume" for="music-volume">音乐音量 <span>${Math.round(settings.volume*100)}%</span></label><input id="music-volume" type="range" min="0" max="100" value="${Math.round(settings.volume*100)}"><div class="audio-track"><small>ERA FC ORIGINALS</small><b>${track.title}</b><span>${track.subtitle}</span></div><p class="audio-note">原创电子运动配乐 · 随大厅、选秀和赛季切换。无需导入音频。</p><p id="audio-notice" role="status"></p>`;
  container.append(panel);message(notice);
  panel.querySelector('#music-enabled').onchange=e=>{settings.music=e.target.checked;unlock();apply();paint();};
  panel.querySelector('#sfx-enabled').onchange=e=>{settings.sfx=e.target.checked;save();};
  panel.querySelector('#music-volume').oninput=e=>{settings.volume=Number(e.target.value)/100;apply();panel.querySelector('.audio-volume span').textContent=`${e.target.value}%`;};
 }
 document.addEventListener('pointerdown',e=>{if(!e.isTrusted)return;unlock();if(e.target.closest('button,a,select,[role="option"]'))clickSound();},{capture:true});
 document.addEventListener('keydown',e=>{if(e.repeat||!['Enter',' '].includes(e.key))return;unlock();if(e.target.closest('button,a,[role="option"]'))clickSound();},{capture:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)engine?.stop();else if(context)unlock();});
 window.addEventListener('pagehide',()=>engine?.stop());
 paint();return {setScene(next){const selected=musicForScene(next);if(selected.id!==track.id){track=selected;apply();if(open)paint();}},settings:()=>({...settings})};
}
