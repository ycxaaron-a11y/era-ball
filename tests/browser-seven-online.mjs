const {chromium}=await import(process.env.ERA_PLAYWRIGHT_MODULE||'playwright');
import assert from 'node:assert/strict';import {randomUUID} from 'node:crypto';
import {createTestDatabase} from './database-harness.mjs';
import {sevenPoolById,sevenPlayers,sevenPositions,sevenAbility,sevenRoomState,sevenFinalTournament,nextSevenRound,startSevenCup} from '../seven-a-side.js';
const {db,rpc,addUser}=await createTestDatabase(),browser=await chromium.launch({executablePath:process.env.ERA_CHROMIUM||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--no-proxy-server']});
const pages=[],names=['混战甲队','<b>混战乙队</b>','混战丙队','混战丁队'],errors=[];
async function bridge(route){try{const req=route.request(),url=new URL(req.url()),body=JSON.parse(req.postData()||'{}');if(url.pathname==='/auth/v1/signup'){const id=randomUUID();await addUser(id);return route.fulfill({json:{access_token:id,refresh_token:id,expires_at:Math.floor(Date.now()/1000)+3600}});}const uid=(await req.allHeaders()).authorization?.replace('Bearer ',''),name=url.pathname.split('/').at(-1),keys={fc7_protocol:[],fc7_read:['p_code'],fc7_connect:['p_code','p_capacity','p_name'],fc7_action:['p_code','p_action','p_payload','p_revision','p_request_id']}[name];if(!keys)throw Error(name);await route.fulfill({json:await rpc(uid,name,keys.map(k=>body[k]))});}catch(e){await route.fulfill({status:400,json:{message:e.message,details:e.detail,code:e.code||'P0001'}});}}
try{
 for(let i=0;i<4;i++){const c=await browser.newContext({viewport:i===3?{width:390,height:1050}:{width:1440,height:1050},reducedMotion:'reduce'});await c.addInitScript(name=>{localStorage.setItem('era-fc-profile-v1',JSON.stringify({teamName:name}));localStorage.setItem('era-fc-audio-v1',JSON.stringify({music:false,sfx:false}));},names[i]);await c.route('https://tvlklxtlgiknorambkou.supabase.co/**',bridge);const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));pages.push(p);await p.goto((process.env.ERA_SITE_URL||'http://127.0.0.1:3001/')+'#seven');}
 const host=pages[0];await host.selectOption('#seven-capacity','4');await host.click('#seven-create');await host.waitForSelector('.seven-room');const code=(await host.locator('.seven-room>div:first-child b').textContent()).match(/[A-Z0-9]{3}$/)[0];
 for(const p of pages.slice(1)){await p.fill('#seven-code',code);await p.click('#seven-join');await p.waitForSelector('.seven-room');}
 await host.waitForFunction(()=>document.querySelectorAll('.seven-members p').length===4);assert.equal(await host.locator('.seven-members strong b').count(),0);for(const name of names)assert.ok((await host.locator('.seven-members').textContent()).includes(name));
 const users=await Promise.all(pages.map(p=>p.evaluate(()=>JSON.parse(sessionStorage.getItem('era-fc-auth-v2')).access_token)));
 await host.click('#seven-spin');await host.waitForSelector('[data-seven-player]');let snapshot=await rpc(users[0],'fc7_read',[code]),state=snapshot.members.find(m=>m.is_self).state,pool=sevenPoolById.get(state.pool),card=pool.players.find(p=>!p.positions.includes('GK'));
 await host.locator(`[data-seven-player="${card.id}"]`).click();await host.locator('[data-seven-slot="0"]').click();assert.equal((await rpc(users[0],'fc7_read',[code])).members.find(m=>m.is_self).state.picks.filter(Boolean).length,0);await host.locator('[data-seven-slot="0"]').click();await host.waitForFunction(()=>document.querySelector('[data-seven-slot="0"] .placed-player'));
 console.log('PASS seven browser lobby: anonymous auth, 4 seats, Chinese names escaped, country spin and two-click server-confirmed pick');
 for(let u=0;u<4;u++){
  for(let n=u===0?1:0;n<7;n++){
   snapshot=await rpc(users[u],'fc7_read',[code]);let mine=snapshot.members.find(m=>m.is_self),s=mine.state;
   if(s.phase!=='ready'){snapshot=await rpc(users[u],'fc7_action',[code,'spin',{},mine.revision,randomUUID()]);mine=snapshot.members.find(m=>m.is_self);s=mine.state;}
   const blocked=new Set(snapshot.locks.filter(l=>!l.mine).map(l=>l.player_id)),used=new Set(sevenPlayers(s).filter(Boolean).map(p=>p.identity)),options=[];
   for(const [i,pos] of sevenPositions(s.formation).entries())if(!s.picks[i])for(const p of sevenPoolById.get(s.pool).players)if(!blocked.has(p.id)&&!used.has(p.identity)&&(pos==='GK')===p.positions.includes('GK'))options.push({p,i,r:sevenAbility(s,p,pos)});
   const pick=options.sort((a,b)=>b.r-a.r)[0];assert.ok(pick);await rpc(users[u],'fc7_action',[code,'pick',{player:pick.p.id,slot:pick.i},mine.revision,randomUUID()]);
  }
 }
 for(const p of pages){await p.waitForSelector('#seven-start-cup');await p.click('#seven-start-cup');}
 await Promise.all(pages.map(p=>p.waitForSelector('#seven-next-round')));snapshot=await rpc(users[0],'fc7_read',[code]);const humans=snapshot.members.map(m=>({...m.state,id:`human-${m.seat}`}));
 let chosenSeed=1;for(;chosenSeed<100;chosenSeed++){const s=nextSevenRound(nextSevenRound(startSevenCup({...snapshot.members[0].state,cup:null},chosenSeed,humans)));if(sevenFinalTournament(s).phases[5].matches[0].shootout.length)break;}assert.ok(chosenSeed<100);await db.query('update fc7_rooms set seed=$1 where code=$2',[chosenSeed,code]);
 await host.click('#seven-next-round');await Promise.all(pages.map(p=>p.waitForFunction(()=>document.querySelectorAll('.seven-fixture').length===4)));await pages[1].click('#seven-next-round');await Promise.all(pages.map(p=>p.waitForSelector('#seven-start-final')));
 await host.click('#seven-start-final');await Promise.all(pages.map(p=>p.waitForSelector('#seven-screen .final-live')));const started=(await rpc(users[0],'fc7_read',[code])).final_live.started_at;assert.ok(!(await host.locator('.seven-cup h2').textContent()).includes('冠军'));await pages[3].reload();await pages[3].waitForSelector('#seven-screen .final-live');assert.equal((await rpc(users[0],'fc7_read',[code])).final_live.started_at,started);
 const states=await Promise.all(users.map(u=>rpc(u,'fc7_read',[code])));const cups=states.map(sevenRoomState);for(const c of cups.slice(1))assert.deepEqual(c.cup,cups[0].cup);
 await db.query("update fc7_rooms set final_live=jsonb_set(final_live,'{started_at}',to_jsonb((floor(extract(epoch from clock_timestamp())*1000)-12000)::bigint)) where code=$1",[code]);
 await Promise.all(pages.map(p=>p.waitForSelector('#seven-screen #final-kick:visible')));const shots=cups[0].cup.finalTournament.phases[5].matches[0].shootout.length;
 await Promise.all([pages[0].click('#seven-screen #final-kick'),pages[1].click('#seven-screen #final-kick')]);assert.equal((await rpc(users[0],'fc7_read',[code])).final_live.kicks,1);
 for(let i=1;i<shots;i++){await host.waitForFunction(n=>document.querySelectorAll('#seven-screen #shootout-events li').length===n,i);await host.click('#seven-screen #final-kick');}
 await Promise.all(pages.map(p=>p.waitForFunction(()=>document.querySelector('.seven-cup h2')?.textContent.includes('冠军 ·'))));const winner=await host.locator('.seven-cup h2').textContent();for(const p of pages.slice(1))assert.equal(await p.locator('.seven-cup h2').textContent(),winner);
 await pages[3].screenshot({path:'/tmp/era-seven-online-mobile.png',fullPage:true});assert.ok(await pages[3].evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
 await host.click('#seven-restart');await Promise.all(pages.slice(1).map(p=>p.waitForFunction(()=>document.querySelector('#seven-message')?.textContent.includes('有玩家离开'))));
 console.log('PASS seven browser multiplayer: all-ready shared cup, round synchronization, live final/reload, manual penalty CAS, same champion on 4 clients, host leave, mobile layout');
}finally{await browser.close();await db.close();}
