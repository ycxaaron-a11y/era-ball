import {musicForScene,musicSearchURL,youtubeVideoId} from './music-catalog.js';
const storage='era-fc-audio-v1';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function audioSettings(saved={}){
 return {music:saved.music===true,sfx:saved.sfx!==false,volume:Number.isFinite(saved.volume)?Math.min(1,Math.max(0,saved.volume)):.3,source:saved.source==='local'?'local':'official',links:saved.links&&typeof saved.links==='object'?Object.fromEntries(Object.entries(saved.links).filter(([,id])=>typeof id==='string'&&/^[A-Za-z0-9_-]{11}$/.test(id))):{}};
}
export function youtubeErrorMessage(code){
 return ({2:'视频链接无效，请换一个视频链接。',5:'浏览器无法播放这个视频，请在 YouTube 打开或使用本地音频。',100:'这个视频已不可用、被删除或设为私享。',101:'视频发布者禁止站外播放，请在 YouTube 打开或使用其他可嵌入视频。',150:'视频发布者禁止站外播放，请在 YouTube 打开或使用其他可嵌入视频。',153:'播放器无法验证网站来源，请在正式网站地址打开后重试。'})[code]||'YouTube 播放失败，请在新窗口打开视频检查，或选择本地音频。';
}
export function initAudio(){
 let settings;try{settings=audioSettings(JSON.parse(localStorage.getItem(storage))||{});}catch{settings=audioSettings();}
 let track=musicForScene(),context=null,fxGain=null,unlocked=false,open=false,frame=null,frameTrack=null,ytPlayer=null,apiPromise=null,notice='',localAudio=null,localURL=null,localName='';
 const container=document.createElement('aside');container.id='audio-widget';container.setAttribute('aria-label','声音设置');document.body.append(container);
 function save(){try{localStorage.setItem(storage,JSON.stringify(settings));}catch{}}
 function message(text){notice=text;const el=container.querySelector('#audio-notice');if(el)el.textContent=text;const status=container.querySelector('#music-playback-status');if(status)status.textContent=text;let brief=container.querySelector('#audio-brief');if(!brief){brief=document.createElement('p');brief.id='audio-brief';container.append(brief);}brief.hidden=!(settings.music&&!text.startsWith('正在播放')&&/无法|失败|禁止|未|没有|阻止|音量为 0/.test(text));brief.textContent=brief.hidden?'':'播放未开始 · 点开音乐设置查看原因';}
 function ensureContext(){if(context)return context;const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return null;context=new Context();fxGain=context.createGain();fxGain.gain.value=.2;fxGain.connect(context.destination);return context;}
 function clickSound(){
  if(!settings.sfx||!context||context.state!=='running')return;
  for(const [pitch,delay,duration,level,type] of [[88,0,.035,.15,'triangle'],[72,.007,.055,.08,'sine']]){const time=context.currentTime+delay,oscillator=context.createOscillator(),gain=context.createGain();oscillator.type=type;oscillator.frequency.setValueAtTime(440*2**((pitch-69)/12),time);gain.gain.setValueAtTime(.00001,time);gain.gain.exponentialRampToValueAtTime(level,time+.01);gain.gain.exponentialRampToValueAtTime(.00001,time+duration);oscillator.connect(gain);gain.connect(fxGain);oscillator.start(time);oscillator.stop(time+duration+.03);}
 }
 function command(func,args=[]){if(ytPlayer&&typeof ytPlayer[func]==='function'){try{ytPlayer[func](...args);return true;}catch{}}if(frame?.contentWindow)frame.contentWindow.postMessage(JSON.stringify({event:'command',func,args}),'https://www.youtube-nocookie.com');return false;}
 function clearOfficial(){document.body.classList.remove('has-official-music');try{ytPlayer?.destroy();}catch{}ytPlayer=null;frame?.remove();frame=null;frameTrack=null;container.querySelector('#official-music-player')?.remove();}
 function videoId(){return settings.links[track.id]||track.videoId||null;}
 function watchURL(){return videoId()?`https://www.youtube.com/watch?v=${videoId()}`:musicSearchURL(track);}
 function youtubeAPI(){
  if(window.YT?.Player)return Promise.resolve();if(apiPromise)return apiPromise;
  apiPromise=new Promise((resolve,reject)=>{const previous=window.onYouTubeIframeAPIReady;const timeout=setTimeout(()=>reject(Error('YouTube 接口未加载完成。可点视频内播放，或用“在 YouTube 打开”检查网络。')),12000);window.onYouTubeIframeAPIReady=()=>{clearTimeout(timeout);if(previous)previous();resolve();};const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.onerror=()=>{clearTimeout(timeout);reject(Error('无法连接 YouTube 播放接口。请检查 YouTube 能否直接打开，或选择本地音频。'));};document.head.append(script);}).catch(e=>{apiPromise=null;throw e;});return apiPromise;
 }
 function requestVideoPlayback(){
  if(settings.volume===0){message('音乐音量为 0，请先调高音量。');return;}
  command('setVolume',[Math.round(settings.volume*100)]);command('unMute');
  if(command('playVideo'))message('已请求播放；若仍无声，请点击视频内播放或在 YouTube 打开。');
  else message('正在等待播放器。也可以直接点视频内的播放键和扬声器图标。');
 }
 function connectPlayer(target){
  youtubeAPI().then(()=>{if(frame!==target)return;ytPlayer=new window.YT.Player(target,{host:'https://www.youtube-nocookie.com',events:{
   onReady:e=>{if(frame!==target)return;e.target.setVolume(Math.round(settings.volume*100));if(settings.music&&!document.hidden)requestVideoPlayback();},
   onStateChange:e=>{if(frame===target&&e.data===1)message('正在播放。');},
   onAutoplayBlocked:()=>{if(frame===target)message('浏览器阻止了自动播放，请点击“播放 / 解除静音”或视频内的播放键。');},
   onError:e=>{if(frame===target)message(`YouTube 错误 ${e.data}：${youtubeErrorMessage(e.data)}`);}
  }});}).catch(e=>{if(frame===target)message(e.message);});
 }
 function playOfficial(){
  localAudio?.pause();if(!settings.music||settings.source!=='official'||!unlocked||document.hidden){clearOfficial();return;}
  const id=videoId();if(!id){clearOfficial();message('这首曲目还没有播放链接。请添加视频链接，或选择本地音频；不会自动播放合成音乐。');return;}
  if(frame&&frameTrack===id){requestVideoPlayback();return;}
  clearOfficial();const holder=document.createElement('section');holder.id='official-music-player';holder.innerHTML=`<div><span>${esc(track.title)}</span><button id="close-music-player" aria-label="停止歌曲播放">×</button></div><div class="music-player-actions"><button id="play-video-music">▶ 播放 / 解除静音</button><button id="retry-video-music">重试</button><a href="${esc(watchURL())}" target="_blank" rel="noopener">在 YouTube 打开 ↗</a></div><p id="music-playback-status" role="status">正在加载；如果没有声音，请点击播放。</p>`;
  frame=document.createElement('iframe');frame.id='era-official-music-frame';frame.title=`${track.artist} — ${track.title}`;frame.width='356';frame.height='200';frame.allow='autoplay; encrypted-media; picture-in-picture';frame.referrerPolicy='strict-origin-when-cross-origin';
  frame.src=`https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&autoplay=1&mute=0&loop=1&playlist=${id}&playsinline=1&origin=${encodeURIComponent(location.origin)}`;
  frameTrack=id;holder.append(frame);container.append(holder);document.body.classList.add('has-official-music');connectPlayer(frame);
  holder.querySelector('#close-music-player').onclick=()=>{settings.music=false;save();clearOfficial();paint();};
  holder.querySelector('#play-video-music').onclick=requestVideoPlayback;
  holder.querySelector('#retry-video-music').onclick=()=>{clearOfficial();message('正在重新加载。');playOfficial();};
 }
 function playLocal(){
  clearOfficial();if(!settings.music||settings.source!=='local'||document.hidden){localAudio?.pause();return;}
  if(!localAudio){message('请选择本设备上的音频文件。文件不会上传，刷新后需要重新选择。');return;}
  localAudio.volume=settings.volume;
  const selected=localAudio;localAudio.play().then(()=>{if(settings.music&&settings.source==='local'&&localAudio===selected)message(`正在播放：${localName}`);}).catch(()=>{if(settings.music&&settings.source==='local'&&localAudio===selected)message('浏览器没有启动音频，请点击“播放本地音频”。');});
 }
 function apply(){save();if(settings.source==='local')playLocal();else playOfficial();paint();}
 async function unlock(){const audio=ensureContext();if(audio&&audio.state==='suspended')try{await audio.resume();}catch{}if(!unlocked){unlocked=true;if(settings.source==='local')playLocal();else playOfficial();}}
 function chooseLocal(file){
  if(!file)return;if(file.type&&!file.type.startsWith('audio/')){message('请选择 MP3、M4A、WAV 等音频文件。');return;}
  localAudio?.pause();if(localURL)URL.revokeObjectURL(localURL);localURL=URL.createObjectURL(file);localName=file.name;localAudio=new Audio(localURL);localAudio.id='local-background-music';localAudio.loop=true;localAudio.volume=settings.volume;localAudio.onerror=()=>message('浏览器无法读取这个音频文件，请换一个支持的格式。');settings.source='local';settings.music=true;apply();
 }
 function paint(){
  container.querySelector('#audio-controls')?.remove();container.querySelector('#audio-toggle')?.remove();
  const toggle=document.createElement('button');toggle.id='audio-toggle';toggle.type='button';toggle.textContent=settings.music?'♫ 音乐':'♫ 声音';toggle.setAttribute('aria-expanded',String(open));toggle.onclick=()=>{open=!open;paint();};container.prepend(toggle);message(notice);if(!open)return;
  const panel=document.createElement('section');panel.id='audio-controls';panel.innerHTML=`<div class="audio-heading"><b>声音</b><span>${unlocked?'':'首次点击后启动'}</span></div><label><input id="music-enabled" type="checkbox" ${settings.music?'checked':''}> 背景音乐</label><label><input id="sfx-enabled" type="checkbox" ${settings.sfx?'checked':''}> 按钮点击音效</label><label class="audio-volume" for="music-volume">音乐音量 <span>${Math.round(settings.volume*100)}%</span></label><input id="music-volume" type="range" min="0" max="100" value="${Math.round(settings.volume*100)}"><label for="music-source">播放方式</label><select id="music-source"><option value="official" ${settings.source==='official'?'selected':''}>YouTube 歌曲播放器</option><option value="local" ${settings.source==='local'?'selected':''}>本设备音频 · 不上传</option></select>${settings.source==='local'?`<label for="local-music-file">选择你有权使用的音频文件</label><input id="local-music-file" type="file" accept="audio/*"><p class="audio-now">${esc(localName||'尚未选择文件')}<br>仅在本设备播放；刷新后需重新选择。</p><button id="play-local-music">▶ 播放本地音频</button>`:`<div class="audio-track"><small>当前场景曲目</small><b>${esc(track.title)}</b><span>${esc(track.artist)}${track.year?` · ${track.year}`:''}</span></div><p class="audio-note">${esc(track.note||'')}</p><a href="${esc(watchURL())}" target="_blank" rel="noopener">在 YouTube 打开当前曲目 ↗</a><label for="music-link">指定这首歌的 YouTube 链接（本设备）</label><input id="music-link" placeholder="https://www.youtube.com/watch?v=…" value="${videoId()?`https://www.youtube.com/watch?v=${esc(videoId())}`:''}"><button id="save-music-link">保存此曲播放链接</button>`}<p id="audio-notice" role="status">${esc(notice)}</p>`;
  container.insertBefore(panel,container.querySelector('#official-music-player'));
  panel.querySelector('#music-enabled').onchange=e=>{settings.music=e.target.checked;apply();};panel.querySelector('#sfx-enabled').onchange=e=>{settings.sfx=e.target.checked;save();};
  panel.querySelector('#music-volume').oninput=e=>{settings.volume=Number(e.target.value)/100;save();if(localAudio)localAudio.volume=settings.volume;command('setVolume',[Number(e.target.value)]);panel.querySelector('.audio-volume span').textContent=`${e.target.value}%`;};
  panel.querySelector('#music-source').onchange=e=>{settings.source=e.target.value;notice='';apply();};
  if(settings.source==='local'){panel.querySelector('#local-music-file').onchange=e=>chooseLocal(e.target.files[0]);panel.querySelector('#play-local-music').onclick=()=>{settings.music=true;save();playLocal();};}
  else panel.querySelector('#save-music-link').onclick=()=>{const id=youtubeVideoId(panel.querySelector('#music-link').value);if(!id){message('请填写有效的 HTTPS YouTube 视频链接。');return;}settings.links[track.id]=id;settings.music=true;message('已保存链接，正在加载。');apply();};
 }
 document.addEventListener('pointerdown',e=>{if(!e.isTrusted)return;unlock().then(()=>{const target=e.target.closest('button,a,select,[role="option"]');if(target&&!target.disabled)clickSound();});},{capture:true});
 document.addEventListener('keydown',e=>{if(e.repeat||!['Enter',' '].includes(e.key))return;unlock().then(()=>{if(e.target.closest('button,a,[role="option"]'))clickSound();});},{capture:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){localAudio?.pause();command('pauseVideo');}else if(unlocked){if(settings.source==='local')playLocal();else playOfficial();}});
 paint();return {setScene(next){const selected=musicForScene(next),changed=selected.id!==track.id;track=selected;if(changed){notice='';if(settings.source==='official')playOfficial();if(open)paint();}},settings:()=>({...settings})};
}
