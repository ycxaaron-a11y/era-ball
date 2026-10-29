import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {globalSquads} from '../catalog-global.js';import {pools,positions,positionPenalty} from '../data.js';import {dailyCards,searchDailyCards} from '../daily-card.js';import {sevenPoolById} from '../seven-a-side.js';
const editions=new Set(globalSquads.map(s=>s.id)),old=pools.filter(s=>!editions.has(s.id)),added=pools.filter(s=>editions.has(s.id));
const normal=s=>s.replace(/[łŁ]/g,'l').replace(/[øØ]/g,'o').normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const aliases={'liassine-cadamuro':'Liassine Cadamuro-Bentaïba','abdullah-zubromawi':'Abdullah Sulaiman Zubromawi','ahmed-jamil':'Ahmed Jamil Madani','naim-saadavi':'Naeim Saadavi'};
test('24 new editions add 542 cards and over 450 new identities with usable complete lineups',()=>{
 assert.equal(added.length,24);assert.equal(added.flatMap(s=>s.players).length,542);
 const known=new Set(old.flatMap(s=>s.players.map(p=>p.identity)));assert.ok(new Set(added.flatMap(s=>s.players).filter(p=>!known.has(p.identity)).map(p=>p.identity)).size>450);
 for(const s of added){assert.ok(s.players.length>=20);assert.ok(s.players.filter(p=>p.pos==='GK').length>=2);assert.equal(new Set(s.players.map(p=>p.identity)).size,s.players.length);const used=new Set();for(const pos of positions('4-3-3')){const p=s.players.filter(p=>!used.has(p.identity)&&(p.pos==='GK')===(pos==='GK')).sort((a,b)=>positionPenalty(a,pos)-positionPenalty(b,pos))[0];assert.ok(p);used.add(p.identity);}for(const p of s.players){assert.match(p.name,/[\u3400-\u9fff]/);assert.ok(p.heightCm>=150&&p.heightCm<=210);assert.ok(dailyCards.some(c=>c.id===p.id));}}
});
test('all 271 new World Cup members match the downloaded historical squad records',()=>{
 const fixture=JSON.parse(readFileSync(new URL('./fixtures/global-world-cup.json',import.meta.url)));let count=0;
 for(const s of fixture.squads){const p=pools.find(p=>p.id===s.pool),source=[...s.players];assert.equal(p.players.length,source.length);
 for(const player of p.players){const target=normal(aliases[player.identity]||player.identity);let i=source.findIndex(row=>{const words=row.name.split(' ');return normal(row.name)===target||normal([...words].reverse().join(' '))===target;});
 if(i<0){const tokens=player.identity.split('-').map(normal);i=source.findIndex(row=>tokens.every(t=>normal(row.name).includes(t)));}
 assert.ok(i>=0,`${s.pool}: ${player.identity} is missing from source`);const row=source.splice(i,1)[0];assert.equal(player.pos==='GK',row.position==='GK');count++;}assert.equal(source.length,0);}
 assert.equal(count,271);
});
test('new national pools feed seven-a-side and new names are searchable across editions',()=>{
 for(const country of ['中国','美国','伊朗','尼日利亚','瑞士','哥斯达黎加'])assert.ok(sevenPoolById.get(country)?.players.length>=20);
 for(const name of ['奥科查','多诺万','哈吉','范志毅','萨比策','贝莱隆'])assert.ok(searchDailyCards(name).length,name);
 assert.equal(added.flatMap(s=>s.players).filter(p=>p.tier==='S+').length,1);
});
