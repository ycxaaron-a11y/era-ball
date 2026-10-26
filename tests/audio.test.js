import test from 'node:test';
import assert from 'node:assert/strict';
import {audioSettings} from '../audio.js';
import {musicForScene,musicCatalog} from '../music-catalog.js';
test('music preserves explicit mute and volume preferences and discards obsolete provider settings',()=>{
 assert.deepEqual(audioSettings(),{music:true,sfx:true,volume:.45});
 assert.deepEqual(audioSettings({music:false,sfx:false,volume:.3,source:'official',links:{lobby:'obsolete'}}),{music:false,sfx:false,volume:.3});
 assert.equal(audioSettings({volume:9}).volume,1);assert.equal(audioSettings({volume:-2}).volume,0);assert.equal(audioSettings({volume:NaN}).volume,.45);
});
test('original soundtrack increases pace and arrangement through lobby, draft and season',()=>{
 assert.equal(musicForScene().id,'kickoff');assert.equal(musicForScene({screen:'daily-card'}).id,'kickoff');
 assert.equal(musicForScene({screen:'draft'}).bpm,132);assert.equal(musicForScene({screen:'season'}).bpm,136);
 assert.equal(new Set(musicCatalog.map(t=>t.id)).size,3);assert.ok(musicCatalog.every(t=>!t.videoId&&t.bpm>=128));
});
