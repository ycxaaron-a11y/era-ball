const {chromium}=await import(process.env.ERA_PLAYWRIGHT_MODULE||'playwright');
import assert from 'node:assert/strict';
import {pools,freshState,startDraft} from '../data.js';
const browser=await chromium.launch({executablePath:process.env.ERA_CHROMIUM||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--no-proxy-server']});
try{for(const width of [390,1440]){
 const madrid=pools.find(p=>p.id==='ucl-real-madrid-2017'),cr=madrid.players.find(p=>p.identity==='cristiano-ronaldo'),bale=madrid.players.find(p=>p.identity==='gareth-bale');
 const state=startDraft(freshState('ucl'),'2020s',[]);state.pool=madrid.id;state.drawPhase='ready';state.picks[0]=cr;state.picks[11]=bale;
 const context=await browser.newContext({viewport:{width,height:1100}});await context.addInitScript(s=>localStorage.setItem('era-fc-v2',JSON.stringify(s)),state);const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:3000/#draft');
 assert.equal((await p.locator('.intro h1').innerText()).replace(/\s+/g,' '),'Same court, different era');
 const card=p.locator(`[data-player="${cr.id}"]`);assert.equal(cr.rating,109);assert.equal(await card.locator('.dark-matter').count(),0);assert.equal(await card.locator('.splus-stardust i').count(),12);assert.doesNotMatch(await card.getAttribute('class'),/mythic/);
 const slot=p.locator('[data-slot="0"]');assert.equal(await slot.locator('em').textContent(),'111');assert.equal(await slot.locator('.dark-matter>i').count(),14);assert.match(await slot.evaluate(e=>getComputedStyle(e).animationName),/matter-float.*matter-recoil/);
 const motion=await slot.evaluate(async e=>{const frames=[];for(let i=0;i<6;i++){frames.push([getComputedStyle(e).translate,getComputedStyle(e).rotate]);await new Promise(r=>setTimeout(r,80));}return frames;});assert.ok(new Set(motion.map(x=>x[0])).size>1);assert.ok(new Set(motion.map(x=>x[1])).size>1);
 await p.click('[data-slot="11"]');assert.equal(await p.locator('#move-player,#remove-player').count(),0);await p.click('#close');assert.equal(await slot.locator('em').textContent(),'111');
 await p.screenshot({path:`/tmp/era-effects-${width}.png`,fullPage:true});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);console.log(`PASS ${width}px: slogan, 109 lightning-only, 111 floating/recoil/particles, confirmed slots are immutable`);await context.close();
}}finally{await browser.close()}
