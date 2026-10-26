// Original cinematic sports score, synthesized rather than sampled instruments.
// A 32-bar arc replaces the former plucked-string/hand-drum groove completely.
const progression=[50,46,53,48]; // D minor / B-flat / F / C
const themes=[
 [69,65,67,64,65,62,64,67],
 [74,72,69,67,69,65,67,69],
 [65,null,62,null,64,null,67,null],
 [74,77,76,72,74,69,72,69]
];
const hz=midi=>440*2**((midi-69)/12);
export function createMusicBus(context,destination){
 const compressor=context.createDynamicsCompressor();compressor.threshold.value=-17;compressor.knee.value=16;compressor.ratio.value=4;compressor.attack.value=.012;compressor.release.value=.3;compressor.connect(destination);
 const input=context.createGain();input.gain.value=.7;input.connect(compressor);
 const delay=context.createDelay(1);delay.delayTime.value=.416667;
 const wet=context.createGain();wet.gain.value=.14;delay.connect(wet);wet.connect(input);
 const feedback=context.createGain();feedback.gain.value=.19;delay.connect(feedback);feedback.connect(delay);
 // Rounded bowed-string spectrum: no bright sawtooth, brass or single-note beeps.
 const real=new Float32Array(20),imag=new Float32Array(20);for(let n=1;n<20;n++)imag[n]=1/n**1.65;
 const strings=context.createPeriodicWave(real,imag);
 const noise=context.createBuffer(1,context.sampleRate*2,context.sampleRate),data=noise.getChannelData(0);let seed=937451;
 for(let i=0;i<data.length;i++){seed=(1664525*seed+1013904223)>>>0;data[i]=seed/2147483648-1;}
 return {context,input,delay,noise,strings,dispose(){input.disconnect();delay.disconnect();wet.disconnect();feedback.disconnect();compressor.disconnect();}};
}
export function scheduleMusicStep(bus,step,time,track){
 const {context:c,input,delay,noise,strings}=bus,beat=60/track.bpm,bar=Math.floor(step/16)%32,s=step%16,section=Math.floor(bar/8),root=progression[bar%4],nodes=[];
 function envelope(g,level,attack,duration){g.gain.setValueAtTime(.0001,time);g.gain.linearRampToValueAtTime(level,time+attack);g.gain.setValueAtTime(level,time+Math.max(attack,duration*.55));g.gain.exponentialRampToValueAtTime(.0001,time+duration);}
 function string(note,duration,level,attack=.12,wide=false){
  for(const detune of (wide?[-6,6]:[0])){
   const o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();o.setPeriodicWave(strings);o.frequency.value=hz(note);o.detune.value=detune;f.type='lowpass';f.frequency.value=note<48?650:2100;f.Q.value=.45;
   envelope(g,level/(wide?2:1),attack,duration);o.connect(f);f.connect(g);g.connect(input);if(wide)g.connect(delay);o.start(time);o.stop(time+duration+.02);nodes.push(o);o.onended=()=>{o.disconnect();f.disconnect();g.disconnect();};
  }
 }
 function noiseHit(level,duration,frequency,type='bandpass',attack=.006){
  const n=c.createBufferSource(),g=c.createGain(),f=c.createBiquadFilter();n.buffer=noise;f.type=type;f.frequency.value=frequency;f.Q.value=.5;envelope(g,level,attack,duration);n.connect(f);f.connect(g);g.connect(input);n.start(time);n.stop(time+duration+.01);nodes.push(n);n.onended=()=>{n.disconnect();f.disconnect();g.disconnect();};
 }
 function lowDrum(level=.62,high=100){
  const o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(high,time);o.frequency.exponentialRampToValueAtTime(high*.38,time+.2);envelope(g,level,.006,.48);o.connect(g);g.connect(input);o.start(time);o.stop(time+.5);nodes.push(o);o.onended=()=>{o.disconnect();g.disconnect();};
 }
 // Wide, slow-moving harmony; two-bar themes rather than repeated short bleeps.
 if(s===0){
  const third=root===50?3:4,chord=[root,root+third,root+7];
  for(const n of chord)string(n,beat*4.7,section===2?.043:.052,.42,true);
  string(root-12,beat*3.8,.1,.16);
  if(bar%4===0)noiseHit(.055,beat*2.2,3300,'highpass',.28);
 }
 if(s===0||s===8){const note=themes[section][(bar%4)*2+(s===8?1:0)];if(note!==null)string(note,beat*2.5,section===3?.105:.085,.23,true);}
 // Bowed low strings build momentum, absent during the middle breathing section.
 if(section!==2&&s%2===0){const n=root+(s%8===6?7:0);string(n,beat*.42,section===0?.047:.065,.045);}
 // Cinematic low drums and broad snare, no hand-drum or shaker pattern.
 if(s===0||s===8||(section===3&&s===11))lowDrum(section===2?.3:.62);
 if(section!==2&&(s===4||s===12)){noiseHit(.18,.22,1700);lowDrum(.12,175);}
 if(section===3&&s%4===2)noiseHit(.026,.08,4800,'highpass');
 if(bar%8===7&&s>=12&&s%2===0){lowDrum(.13+(s-12)*.025,170-(s-12)*10);noiseHit(.045,.1,1400);}
 return nodes;
}
export function createOriginalMusic(context,destination){
 let bus=null,timer=null,nodes=new Set(),step=0,next=0,current=null;
 function stop(){if(timer!==null)clearInterval(timer);timer=null;for(const n of nodes)try{n.stop();}catch{}nodes.clear();if(bus)bus.dispose();bus=null;current=null;}
 function start(track){if(current===track.id&&timer!==null)return;stop();current=track.id;bus=createMusicBus(context,destination);next=context.currentTime+.04;
  const schedule=()=>{if(next<context.currentTime-.1)next=context.currentTime+.02;while(next<context.currentTime+.16){for(const n of scheduleMusicStep(bus,step,next,track)){nodes.add(n);n.addEventListener('ended',()=>nodes.delete(n),{once:true});}step=(step+1)%(track.steps||512);next+=60/track.bpm/4;}};
  schedule();timer=setInterval(schedule,35);
 }
 return {start,stop};
}
