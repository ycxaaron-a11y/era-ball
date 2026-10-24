const {chromium}=await import(process.env.ERA_PLAYWRIGHT_MODULE || 'playwright');
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createTestDatabase} from './database-harness.mjs';
const {db,rpc,addUser}=await createTestDatabase();
const browser=await chromium.launch({executablePath:process.env.ERA_CHROMIUM || '/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--no-proxy-server']});
const submitted=[],errors=[];
async function bridge(route){
 const req=route.request(),url=new URL(req.url()),body=JSON.parse(req.postData()||'{}');
 try{
  if(url.pathname==='/auth/v1/signup'){const uid=randomUUID();await addUser(uid);return route.fulfill({json:{access_token:uid,refresh_token:uid,expires_at:Math.floor(Date.now()/1000)+3600}})}
  const uid=(await req.allHeaders()).authorization?.replace('Bearer ','');const name=url.pathname.split('/').at(-1);
  const keys={fc_protocol_v3:[],fc_season_v4:['p_code','p_expected'],fc_connect_v3:['p_code','p_mode'],fc_read_v3:['p_code'],fc_submit_v3:['p_code','p_state','p_revision','p_request_id']}[name];
  if(!keys)throw Error('Unknown test RPC');
  const result=await rpc(uid,name,keys.map(k=>body[k]));
  if(name==='fc_submit_v3')submitted.push({uid,count:body.p_state.picks.filter(Boolean).length});
  return route.fulfill({json:result});
 }catch(e){return route.fulfill({status:400,json:{message:e.message,details:e.detail,code:e.code||'P0001'}})}
}
try{
 const contexts=await Promise.all([browser.newContext({viewport:{width:1440,height:1100}}),browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'})]);
 for(const c of contexts){await c.addInitScript(()=>Math.random=()=>0);await c.route('https://tvlklxtlgiknorambkou.supabase.co/**',bridge)}
 const pages=await Promise.all(contexts.map(c=>c.newPage())),[host,guest]=pages;
 for(const p of pages){p.on('pageerror',e=>errors.push(e.message));p.on('dialog',d=>d.accept());await p.goto('http://127.0.0.1:3000/')}
 await host.click('#era-open');for(const box of await host.locator('input[name=excluded]').all()){if(!['1960s','1970s-a'].includes(await box.inputValue()))await box.check()}
 await host.click('#start-draft');assert.equal(await host.locator('[data-player]').count(),0);assert.ok(await host.locator('#spin').isEnabled());
 await host.click('#online');await host.click('#create');await host.waitForSelector('#leave',{timeout:30000});
 const code=(await host.locator('#room-status').textContent()).match(/房间 ([A-F0-9]{8})/)[1];
 await guest.click('#online');await guest.fill('#code',code);await guest.click('#join');await guest.waitForSelector('#leave',{timeout:30000});
 for(const p of pages)await p.click('#close');
 await host.evaluate(()=>{window.drawnTeams=[];window.drawnEras=[];new MutationObserver(()=>{drawnTeams.push(document.querySelector('#team-name').textContent);drawnEras.push(document.querySelector('#era').textContent)}).observe(document.querySelector('.draw-info'),{childList:true,subtree:true})});
 await host.click('#spin');assert.equal(await host.locator('[data-player]').count(),0);assert.ok(await host.locator('#spin').isDisabled());
 await host.waitForSelector('[data-player]',{timeout:12000});const frames=await host.evaluate(()=>({teams:new Set(drawnTeams).size,eras:new Set(drawnEras).size}));assert.ok(frames.teams>1&&frames.eras>1);
 await guest.click('#spin');await guest.waitForSelector('[data-player]');
 assert.equal(await host.locator('#team-name').textContent(),await guest.locator('#team-name').textContent());
 const pele='wc-brazil-1962:pele';
 for(const p of pages){await p.locator(`[data-player="${pele}"]`).click();await p.click('[data-slot="0"]')}
 assert.equal(submitted.length,2);assert.equal(await host.locator('.slot-preview').count(),1);
 await Promise.all(pages.map(p=>p.click('[data-slot="0"]')));
 await host.waitForTimeout(1800);
 const counts=await Promise.all(pages.map(p=>p.locator('#count').textContent()));assert.equal(counts.filter(x=>x.includes('1 / 16')).length,1);assert.equal(counts.filter(x=>x.includes('0 / 16')).length,1);
 const winner=pages[counts.findIndex(x=>x.includes('1 / 16'))],loser=pages[counts.findIndex(x=>x.includes('0 / 16'))];
 assert.equal(await winner.locator('[data-player]').count(),0);assert.ok(await winner.locator('#spin').isEnabled());
 if(await loser.locator('#modal').isVisible())await loser.click('#close');
 assert.ok(await loser.locator(`[data-player="${pele}"]`).isDisabled());
 await loser.locator('[data-player]:not(:disabled)').first().click();await loser.click('[data-slot="0"]');await loser.click('[data-slot="0"]');await loser.waitForFunction(()=>document.querySelector('#count').textContent.includes('1 / 16'));
 await loser.evaluate(()=>{let n=0;Math.random=()=>n++===0?.75:0});await loser.click('#spin');await loser.waitForSelector('[data-player]');
 assert.equal(await loser.locator('#team-name').textContent(),'巴西');assert.match(await loser.locator('#era').textContent(),/1970/);
 assert.ok(await loser.locator('[data-player="wc-brazil-1970:pele"]').isEnabled());
 await loser.locator('[data-player="wc-brazil-1970:pele"]').click();await loser.click('[data-slot="1"]');await loser.click('[data-slot="1"]');await loser.waitForFunction(()=>document.querySelector('#count').textContent.includes('2 / 16'));
 console.log('PASS browsers+SQL: manual animated Spin, hidden candidates until settled, no automatic next draw, preview not submitted, same-version race one winner, different-era same player allowed');
 for(const p of pages){await p.emulateMedia({reducedMotion:'reduce'});await p.evaluate(()=>Math.random=()=>0)}
 for(let round=0;round<16;round++)for(const p of pages){
  for(let attempt=0;attempt<8;attempt++){
   const state=await p.evaluate(()=>JSON.parse(localStorage.getItem('era-fc-v2')));if(state.picks.every(Boolean))break;
   if(state.drawPhase==='awaiting'){await p.click('#spin');await p.waitForSelector('[data-player]',{timeout:10000})}
   const slot=state.picks.findIndex(x=>!x),count=state.picks.filter(Boolean).length;
   await p.locator('[data-player]:not(:disabled)').first().click();await p.click(`[data-slot="${slot}"]`);await p.click(`[data-slot="${slot}"]`);
   try{await p.waitForFunction(n=>document.querySelector('#count').textContent.includes(`${n} / 16`)||document.querySelector('#modal').open||!document.querySelector('.slot-preview'),count+1,{timeout:10000})}catch(e){console.log('FAILED PICK',await p.evaluate(()=>({count:document.querySelector('#count').textContent,hint:document.querySelector('#placement-hint')?.textContent,preview:document.querySelector('.slot-preview')?.outerHTML,state:JSON.parse(localStorage.getItem('era-fc-v2')),errors:document.querySelector('#modal-body').textContent})));throw e}
   if((await p.locator('#count').textContent()).includes(`${count+1} / 16`))break;
   if(await p.locator('#modal').isVisible()){const feedback=await p.locator('#modal-body').textContent();assert.match(feedback,/抢先锁定/,feedback);await p.click('#close');}
   assert.ok(attempt<7,'Expected to find another free version');
  }
 }
 for(const p of pages)await p.waitForSelector('#season-page',{timeout:15000});
 assert.equal(await host.locator('.groups-grid').textContent(),await guest.locator('.groups-grid').textContent());assert.deepEqual(errors,[]);
 console.log('PASS browsers+SQL: mobile+desktop full16 drafts, atomic confirmed picks, shared seeded season entry, no JS errors');
 // Independent local chemistry UI: force a Madrid-2017 round using the actual Spin eligibility settings.
 const local=await browser.newContext({viewport:{width:1440,height:1100},reducedMotion:'reduce'});await local.addInitScript(()=>Math.random=()=>0);const p=await local.newPage();p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:3000/');await p.click('#ucl');for(const box of await p.locator('input[name=excluded]').all())if(await box.inputValue()!=='2010s-b')await box.check();await p.click('#start-draft');
 async function choose(id,slot){await p.click('#spin');await p.waitForSelector('[data-player]');await p.locator(`[data-player="${id}"]`).click();await p.click(`[data-slot="${slot}"]`);await p.click(`[data-slot="${slot}"]`)}
 await choose('ucl-real-madrid-2017:gareth-bale',2);assert.equal(await p.locator('.placement-impact').count(),0);await choose('ucl-liverpool-2019:virgil-van-dijk',7);await choose('ucl-real-madrid-2017:cristiano-ronaldo',0);
 assert.match(await p.locator('[data-slot="2"]').getAttribute('class'),/tier-s\b/);assert.match(await p.locator('#chemistry-panel').textContent(),/贝尔/);assert.match(await p.locator('[data-slot="2"] .was-tier').textContent(),/was A/);
 await choose('ucl-liverpool-2019:mohamed-salah',1);await choose('ucl-real-madrid-2017:karim-benzema',11);assert.match(await p.locator('[data-slot="11"]').getAttribute('class'),/tier-s\b/);await p.screenshot({path:'/tmp/era-v3-chemistry.png',fullPage:true});assert.deepEqual(errors,[]);
 console.log('PASS local browser: confirmed real partners activate panel, boost both and promote Benzema A→S with border change');

 const impact=await browser.newContext({viewport:{width:1440,height:1100}});await impact.addInitScript(()=>Math.random=()=>0);const ip=await impact.newPage();await ip.goto('http://127.0.0.1:3000/');await ip.click('#era-open');await ip.click('#start-draft');await ip.click('#spin');await ip.waitForSelector('[data-player]');
 const star=ip.locator('[data-player].tier-sp').first();assert.equal(await star.evaluate(e=>getComputedStyle(e).animationDuration),'1.8s, 1.8s');await star.click();await ip.click('[data-slot="2"]');assert.equal(await ip.locator('.placement-impact').count(),0);await ip.click('[data-slot="2"]');await ip.waitForSelector('.placement-impact');assert.equal(await ip.locator('.impact-dust').count(),5);await ip.waitForTimeout(140);await ip.screenshot({path:'/tmp/era-v3-impact.png',fullPage:true});await ip.waitForTimeout(650);assert.equal(await ip.locator('.placement-impact').count(),0);await ip.reload();assert.equal(await ip.locator('.placement-impact').count(),0);
 console.log('PASS landing: faster lightning, preview silent, confirmed S+ drop/ring/five dust plumes, one-shot cleanup, no replay on reload');
}finally{await browser.close();await db.close()}

