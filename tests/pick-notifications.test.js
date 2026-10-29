import test from 'node:test';
import assert from 'node:assert/strict';
import {createPickTracker} from '../pick-notifications.js';
import {pools} from '../data.js';
const [a,b,c]=pools[0].players;
const member=(seat,picks,is_self=false)=>({seat,is_self,state:{teamName:`队伍 ${seat}`,picks}});
test('confirmed opponent picks notify once, exclude self, and silently baseline join or reload',()=>{
 const events=[],tracker=createPickTracker(e=>events.push(e));
 const read=members=>tracker.update({code:'ABC',members});
 read([member(0,[],true),member(1,[a])]);assert.equal(events.length,0);
 read([member(0,[c],true),member(1,[a,b])]);
 assert.deepEqual(events,[{teamName:'队伍 1',name:b.name,tier:b.tier}]);
 read([member(0,[c],true),member(1,[a,b])]);assert.equal(events.length,1);
 tracker.reset();read([member(1,[a,b])]);assert.equal(events.length,1);
 tracker.update({code:'XYZ',members:[member(1,[a,b,c])]});assert.equal(events.length,1);
});
test('seven-player string IDs and simultaneous opponents queue every new confirmed card',()=>{
 const events=[],tracker=createPickTracker(e=>events.push(e));
 tracker.update({code:'ABC',members:[member(1,[]),member(2,[]),member(3,[])]});
 tracker.update({code:'ABC',members:[member(1,[a.id,b.id]),member(2,[c.id]),member(3,[])]});
 assert.deepEqual(events.map(e=>e.name),[a.name,b.name,c.name]);
 assert.ok(events.every(e=>!Object.hasOwn(e,'rating')));
 tracker.update({code:'ABC',members:[member(1,[a.id,b.id]),member(2,[c.id]),member(3,[null,'unknown-card'])]});
 assert.equal(events.length,3);
});
