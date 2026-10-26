import test from 'node:test';
import assert from 'node:assert/strict';
import {audioSettings} from '../audio.js';
import {musicForScene,musicCatalog} from '../music-catalog.js';
test('music preserves explicit mute and volume preferences and discards obsolete provider settings',()=>{
 assert.deepEqual(audioSettings(),{music:true,sfx:true,volume:.45});
 assert.deepEqual(audioSettings({music:false,sfx:false,volume:.3,source:'official',links:{lobby:'obsolete'}}),{music:false,sfx:false,volume:.3});
 assert.equal(audioSettings({volume:9}).volume,1);assert.equal(audioSettings({volume:-2}).volume,0);assert.equal(audioSettings({volume:NaN}).volume,.45);
});
test('one original score stays identical through every screen and competition',()=>{
 const home=musicForScene();assert.equal(home.bpm,120);assert.equal(musicCatalog.length,1);
 for(const screen of ['home','daily-card','draft','season'])for(const mode of ['world_cup','ucl','euro','copa_america'])assert.equal(musicForScene({screen,mode}),home);
 assert.ok(!home.videoId);
});
