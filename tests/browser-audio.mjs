const {chromium}=await import(process.env.ERA_PLAYWRIGHT_MODULE||'playwright');
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.ERA_CHROMIUM||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--no-proxy-server']});
try{
 const c=await browser.newContext({viewport:{width:390,height:1000}});
 await c.addInitScript(()=>{
  if(!localStorage.getItem('era-fc-audio-v1'))localStorage.setItem('era-fc-audio-v1',JSON.stringify({music:false,sfx:false,source:'official',links:{'lobby-let-go':'4VvAUcJ2Yms'},volume:.3}));
  window.musicStarts=0;window.bufferStarts=0;window.musicBuses=0;window.gainNodes=[];const Native=window.AudioContext;
  window.AudioContext=class extends Native{
   constructor(...args){super(...args);window.testAudioContext=this;}
   createOscillator(){const o=super.createOscillator(),start=o.start.bind(o);o.start=(...args)=>{window.musicStarts++;return start(...args);};return o;}
   createBufferSource(){const n=super.createBufferSource(),start=n.start.bind(n);n.start=(...args)=>{window.bufferStarts++;return start(...args);};return n;}
   createDynamicsCompressor(){window.musicBuses++;return super.createDynamicsCompressor();}
   createGain(){const g=super.createGain();window.gainNodes.push(g);return g;}
  };
 });
 const p=await c.newPage(),errors=[],external=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/youtube|youtu\.be|googlevideo/.test(r.url()))external.push(r.url());});
 await p.goto(process.env.ERA_SITE_URL||'http://127.0.0.1:3001/');await p.click('#audio-toggle');assert.equal(await p.locator('#music-enabled').isChecked(),false);assert.equal(await p.locator('iframe,input[type=file],#music-link').count(),0);assert.match(await p.locator('.audio-track b').textContent(),/MATCHDAY/);
 await p.check('#music-enabled');await p.waitForFunction(()=>window.musicStarts>15);assert.equal(await p.evaluate(()=>testAudioContext.state),'running');
 const first=await p.evaluate(()=>musicStarts);await p.waitForTimeout(750);assert.ok(await p.evaluate(n=>musicStarts>n,first),'rhythmic loop continues on its own');
 await p.locator('#music-volume').evaluate(el=>{el.value='65';el.dispatchEvent(new Event('input',{bubbles:true}));});await p.waitForTimeout(250);assert.ok(await p.evaluate(()=>Math.abs(gainNodes[0].gain.value-.65)<.01));
 await p.uncheck('#music-enabled');const stopped=await p.evaluate(()=>musicStarts);await p.waitForTimeout(500);assert.equal(await p.evaluate(()=>musicStarts),stopped,'muting stops scheduled notes');
 const beforeClick=await p.evaluate(()=>bufferStarts);await p.check('#sfx-enabled');await p.click('#audio-toggle');assert.ok(await p.evaluate(n=>bufferStarts>n,beforeClick),'click effects work with background muted');
 await p.click('#audio-toggle');await p.check('#music-enabled');await p.uncheck('#sfx-enabled');const buses=await p.evaluate(()=>musicBuses);await p.click('#audio-toggle');await p.click('#choose-solo');await p.click('[data-competition="world_cup"]');await p.click('#start-draft');await p.click('#audio-toggle');assert.match(await p.locator('.audio-track b').textContent(),/MATCHDAY/);assert.equal(await p.evaluate(()=>musicBuses),buses,'navigation must not construct or restart music bus');await p.waitForTimeout(200);assert.match(await p.locator('#audio-notice').textContent(),/正在播放原创音乐/);
 await p.uncheck('#music-enabled');await p.uncheck('#sfx-enabled');await p.reload();await p.click('#audio-toggle');assert.equal(await p.locator('#music-enabled').isChecked(),false);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
 // Render the full arrangement through real Web Audio offline: catches silence,
 // invalid schedules, runaway feedback and digital clipping across a full loop.
 const rendered=await p.evaluate(async()=>{
  const {release}=await (await fetch('/release.json')).json();const {createMusicBus,scheduleMusicStep}=await import(`/releases/${release}/music-engine.js`);const {musicCatalog}=await import(`/releases/${release}/music-catalog.js`);const result=[];
  for(const track of musicCatalog){const duration=track.steps*60/track.bpm/4+4,c=new OfflineAudioContext(1,Math.ceil(24000*duration),24000),g=c.createGain();g.gain.value=1;g.connect(c.destination);const bus=createMusicBus(c,g);for(let i=0;i<track.steps;i++)scheduleMusicStep(bus,i,.05+i*60/track.bpm/4,track);const buffer=await c.startRendering(),data=buffer.getChannelData(0);let sum=0,peak=0;for(const v of data){sum+=v*v;peak=Math.max(peak,Math.abs(v));}result.push({id:track.id,rms:Math.sqrt(sum/data.length),peak});bus.dispose();}
  return result;
 });
 for(const r of rendered){assert.ok(r.rms>.05&&r.rms<.4,`${r.id} audible controlled average ${r.rms}`);assert.ok(r.peak<1,`${r.id} no clipping ${r.peak}`);}
 console.log('PASS original music: full 32-bar electric piano score rendered',JSON.stringify(rendered));console.log('PASS controls: real playback, looping, volume, mute, click SFX, scene change, saved preferences, no external audio requests or mobile errors');await c.close();
}finally{await browser.close();}
