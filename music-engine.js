// An original 16-bar electronic sports cue, synthesized locally with Web Audio.
// The score and noise generator never touch Math.random or the match engine.
const roots=[45,41,48,43,45,41,48,43,45,48,41,43,45,41,43,45];
const melody=[76,null,79,81,null,79,76,74,72,null,76,79,81,null,79,76,77,null,81,84,null,81,77,76,74,null,79,83,86,83,79,null];
const hz=midi=>440*2**((midi-69)/12);
export function createMusicBus(context,destination){
 const compressor=context.createDynamicsCompressor();compressor.threshold.value=-16;compressor.knee.value=12;compressor.ratio.value=5;compressor.attack.value=.004;compressor.release.value=.18;compressor.connect(destination);
 const input=context.createGain();input.gain.value=.72;input.connect(compressor);
 const delay=context.createDelay(1);delay.delayTime.value=.234375;
 const wet=context.createGain();wet.gain.value=.16;delay.connect(wet);wet.connect(input);
 const feedback=context.createGain();feedback.gain.value=.22;delay.connect(feedback);feedback.connect(delay);
 const noise=context.createBuffer(1,context.sampleRate,context.sampleRate),data=noise.getChannelData(0);let seed=937451;
 for(let i=0;i<data.length;i++){seed=(1664525*seed+1013904223)>>>0;data[i]=(seed/4294967296)*2-1;}
 return {context,input,delay,noise,dispose(){input.disconnect();delay.disconnect();wet.disconnect();feedback.disconnect();compressor.disconnect();}};
}
export function scheduleMusicStep(bus,step,time,track){
 const {context:c,input,delay,noise}=bus,beat=60/track.bpm,tick=beat/4,bar=Math.floor(step/16)%16,s=step%16,root=roots[bar],nodes=[];
 delay.delayTime.setValueAtTime(beat*.75,time);
 function source(node,gain,duration){node.connect(gain);gain.connect(input);node.start(time);node.stop(time+duration);nodes.push(node);node.onended=()=>{node.disconnect();gain.disconnect();};return node;}
 function envelope(g,level,attack,hold,duration){g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(level,time+attack);g.gain.setValueAtTime(level,time+hold);g.gain.exponentialRampToValueAtTime(.0001,time+duration);}
 function tone(note,duration,level,type='sawtooth',echo=false){const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=hz(note);envelope(g,level,.008,Math.min(duration*.45,.12),duration);const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=note<48?850:4200;f.Q.value=.6;o.connect(f);f.connect(g);g.connect(input);o.start(time);o.stop(time+duration+.01);nodes.push(o);o.onended=()=>{o.disconnect();f.disconnect();g.disconnect();};if(echo)g.connect(delay);}
 function percussion(kind){
  const g=c.createGain();
  if(kind==='kick'){const o=c.createOscillator();o.frequency.setValueAtTime(145,time);o.frequency.exponentialRampToValueAtTime(43,time+.12);envelope(g,.85,.003,.015,.25);source(o,g,.27);return;}
  const n=c.createBufferSource(),f=c.createBiquadFilter();n.buffer=noise;f.type='highpass';f.frequency.value=kind==='snare'?1200:7000;n.connect(f);f.connect(g);g.connect(input);
  const duration=kind==='snare'?.14:kind==='open'?.12:.035;envelope(g,kind==='snare'?.23:kind==='open'?.095:.065,.002,.005,duration);n.start(time);n.stop(time+duration+.01);nodes.push(n);n.onended=()=>{n.disconnect();f.disconnect();g.disconnect();};
  if(kind==='snare')tone(50,.085,.1,'triangle');
 }
 // Four-on-the-floor kick, backbeat, offbeat hats and short fills.
 if(s%4===0)percussion('kick');
 if(s===4||s===12)percussion('snare');
 if(s%2===0)percussion(s%4===2?'open':'hat');
 if(bar%4===3&&s>=14)percussion('snare');
 if(track.energy===2&&s%2===1)percussion('hat');
 // A short breakdown every sixteen bars gives the loop breathing room.
 const breakdown=bar===7||bar===15;
 if(s%2===0&&!breakdown){const bass=root-12+([6,14].includes(s)?12:0);tone(bass,tick*1.45,.16,'sawtooth');tone(bass,tick*1.45,.17,'sine');}
 if(s===0){const chord=[root+12,root+(root===45?3:4)+12,root+19];for(const n of chord)tone(n,beat*3.6,.018,'triangle',true);}
 // Original call-and-response motif, with an octave lift in the second half.
 if(s%2===0&&!breakdown){const n=melody[(bar%4)*8+s/2];if(n!==null){const lift=bar>=8?12:0;tone(n+lift,tick*1.4,.052,'triangle',true);tone(n+lift,tick*1.2,.018,'sawtooth');}}
 if((track.energy>0||bar>=8)&&s%2===1&&!breakdown){const arp=[root+24,root+31,root+27,root+36][Math.floor(s/2)%4];tone(arp,tick*.75,.022,'triangle',true);}
 return nodes;
}
export function createOriginalMusic(context,destination){
 let bus=null,timer=null,nodes=new Set(),step=0,next=0,current=null;
 function stop(){if(timer!==null)clearInterval(timer);timer=null;for(const n of nodes)try{n.stop();}catch{}nodes.clear();if(bus)bus.dispose();bus=null;current=null;}
 function start(track){if(current===track.id&&timer!==null)return;stop();current=track.id;bus=createMusicBus(context,destination);step=0;next=context.currentTime+.04;
  const schedule=()=>{if(next<context.currentTime-.1)next=context.currentTime+.02;while(next<context.currentTime+.16){for(const n of scheduleMusicStep(bus,step,next,track)){nodes.add(n);n.addEventListener('ended',()=>nodes.delete(n),{once:true});}step=(step+1)%256;next+=60/track.bpm/4;}};
  schedule();timer=setInterval(schedule,35);
 }
 return {start,stop};
}
