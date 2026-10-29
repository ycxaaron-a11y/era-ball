const {chromium}=await import(process.env.ERA_PLAYWRIGHT_MODULE||'playwright');
import assert from 'node:assert/strict';import {freshState,startDraft,pools} from '../data.js';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--no-proxy-server']});
try{
 const c=await browser.newContext({viewport:{width:390,height:1050},reducedMotion:'reduce'}),p=await c.newPage(),errors=[];
 const s=startDraft(freshState('world_cup','扩充测试'),'1990s-a',[]);s.pool='wc-nigeria-1994';s.drawPhase='ready';s.formation='4-3-3-attacking';
 await c.addInitScript(s=>{localStorage.setItem('era-fc-v2',JSON.stringify(s));localStorage.setItem('era-fc-profile-v1',JSON.stringify({teamName:s.teamName}));localStorage.setItem('era-fc-audio-v1',JSON.stringify({music:false,sfx:false}));},s);
 p.on('pageerror',e=>errors.push(e.message));const site=process.env.ERA_SITE_URL||'http://127.0.0.1:3004/';await p.goto(site+'#draft');
 const card=p.locator('[data-player="wc-nigeria-1994:jay-jay-okocha"]');await card.waitFor();assert.match(await card.textContent(),/奥科查/);await card.click();await p.locator('[data-slot="3"]').click();assert.match(await p.locator('[data-slot="3"]').textContent(),/奥科查/);await p.locator('[data-slot="3"]').click();assert.match(await p.locator('[data-slot="3"] .placed-player').textContent(),/奥科查/);
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await p.goto(site);const result=await p.evaluate(async()=>{const app=document.querySelector('script[type="module"]').src,base=new URL('.',app);const {searchDailyCards}=await import(new URL('daily-card.js',base));const {sevenPoolById}=await import(new URL('seven-a-side.js',base));return {search:searchDailyCards('范志毅').map(p=>p.name),china:sevenPoolById.get('中国').players.length};});assert.ok(result.search.includes('范志毅'));assert.equal(result.china,23);
 assert.deepEqual(errors,[]);await p.screenshot({path:'/tmp/era-r24-mobile.png',fullPage:true});console.log('PASS published asset graph: new Nigeria candidate previews and locks, Chinese names searchable, China all-time country pool, mobile fits');
}finally{await browser.close();}
