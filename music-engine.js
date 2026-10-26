// Original stadium groove: soft plucked strings, hand percussion and warm bass.
// Independent deterministic noise never touches the game's random generator.
const roots=[48,43,45,41,48,43,41,43,45,41,48,43,41,43,48,48];
const phrases=[
 [64,null,67,null,69,null,67,null],[62,null,null,59,62,null,64,null],
 [64,null,60,null,57,null,60,null],[60,null,null,65,64,null,60,null],
 [67,null,64,null,62,null,64,null],[62,null,59,null,55,null,59,null],
 [60,null,65,null,64,null,60,null],[59,null,null,62,67,null,null,null]
];
const hz=midi=>440*2**((midi-69)/12);
export function createMusicBus(context,destination){
 const compressor=context.createDynamicsCompressor();compressor.threshold.value=-17;compressor.knee.value=14;compressor.ratio.value=4;compressor.attack.value=.006;compressor.release.value=.22;compressor.connect(destination);
 const input=context.createGain();input.gain.value=.85;input.connect(compressor);
 const delay=context.createDelay(1);delay.delayTime.value=.375;
 const wet=context.createGain();wet.gain.value=.12;delay.connect(wet);wet.connect(input);
 const feedback=context.createGain();feedback.gain.value=.18;delay.connect(feedback);feedback.connect(delay);
 const noise=context.createBuffer(1,context.sampleRate,context.sampleRate),data=noise.getChannelData(0);let seed=937451;
 for(let i=0;i<data.length;i++){seed=(1664525*seed+1013904223)>>>0;data[i]=seed/2147483648-1;}
 return {context,input,delay,noise,dispose(){input.disconnect();delay.disconnect();wet.disconnect();feedback.disconnect();compressor.disconnect();}};
}
export function scheduleMusicStep(bus,step,time,track){
 const {context:c,input,delay,noise}=bus,beat=60/track.bpm,tick=beat/4,bar=Math.floor(step/16)%16,s=step%16,root=roots[bar],nodes=[];
 function envelope(g,level,attack,duration){g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(level,time+attack);g.gain.exponentialRampToValueAtTime(.0001,time+duration);}
 function tone(note,duration,level,type='sine',echo=false){
  const o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();o.type=type;o.frequency.value=hz(note);f.type='lowpass';f.frequency.value=note<48?450:1700;f.Q.value=.4;
  envelope(g,level,.018,duration);o.connect(f);f.connect(g);g.connect(input);if(echo)g.connect(delay);o.start(time);o.stop(time+duration+.02);nodes.push(o);o.onended=()=>{o.disconnect();f.disconnect();g.disconnect();};
 }
 function noiseHit(level,duration,frequency,type='bandpass'){
  const n=c.createBufferSource(),g=c.createGain(),f=c.createBiquadFilter();n.buffer=noise;f.type=type;f.frequency.value=frequency;f.Q.value=.6;envelope(g,level,.004,duration);n.connect(f);f.connect(g);g.connect(input);n.start(time);n.stop(time+duration+.01);nodes.push(n);n.onended=()=>{n.disconnect();f.disconnect();g.disconnect();};
 }
 function drum(frequency,duration,level){
  const o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(frequency,time);o.frequency.exponentialRampToValueAtTime(frequency*.4,time+.1);envelope(g,level,.006,duration);o.connect(g);g.connect(input);o.start(time);o.stop(time+duration+.01);nodes.push(o);o.onended=()=>{o.disconnect();g.disconnect();};
 }
 // Grounded kick/backbeat, syncopated hand drums, restrained shaker.
 if([0,6,8].includes(s))drum(115,.25,.7);
 if([4,12].includes(s)){noiseHit(.26,.13,1500);drum(175,.13,.13);}
 if([3,10,14].includes(s))drum(s===10?280:220,.1,.12);
 if(s%2===0)noiseHit(s%4===2?.065:.04,.045,4700,'highpass');
 if(bar%4===3&&s===15)drum(200,.12,.15);
 // Sustained bass and staggered string voicings replace the old bright synth stabs.
 if(s===0||s===7||s===10){tone(root-12,beat*(s===0?1.5:.9),.24);tone(root-12,beat*.7,.045,'triangle');}
 const third=root===45?3:4,chord=[root+12,root+12+third,root+19];
 if([0,1,2,8,9,10].includes(s)){const n=chord[s%8];tone(n,beat*1.35,.065,'triangle',true);tone(n+12,beat*.8,.009);}
 // Lower-register phrases with longer notes and deliberate space, no octave lift.
 if(s%2===0){const n=phrases[bar%8][s/2];if(n!==null){tone(n,beat*.95,.11,'triangle',true);tone(n+12,beat*.6,.012);}}
 return nodes;
}
export function createOriginalMusic(context,destination){
 let bus=null,timer=null,nodes=new Set(),step=0,next=0,current=null;
 function stop(){if(timer!==null)clearInterval(timer);timer=null;for(const n of nodes)try{n.stop();}catch{}nodes.clear();if(bus)bus.dispose();bus=null;current=null;}
 function start(track){if(current===track.id&&timer!==null)return;stop();current=track.id;bus=createMusicBus(context,destination);next=context.currentTime+.04;
  const schedule=()=>{if(next<context.currentTime-.1)next=context.currentTime+.02;while(next<context.currentTime+.16){for(const n of scheduleMusicStep(bus,step,next,track)){nodes.add(n);n.addEventListener('ended',()=>nodes.delete(n),{once:true});}step=(step+1)%256;next+=60/track.bpm/4;}};
  schedule();timer=setInterval(schedule,35);
 }
 return {start,stop};
}
