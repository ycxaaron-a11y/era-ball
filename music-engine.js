// Original upbeat electric-piano groove. No bowed strings, brass or bright beeps.
const roots=[43,50,40,48];
const chords=[[0,4,7,11],[0,4,7,10],[0,3,7,10],[0,4,7,11]];
const melody=[[67,71,74,71,69,67,64,62],[66,69,74,72,69,66,64,62],[64,67,71,74,71,67,66,64],[64,67,71,72,71,67,64,62]];
const hz=n=>440*2**((n-69)/12);
export function createMusicBus(context,destination){
 const compressor=context.createDynamicsCompressor();compressor.threshold.value=-18;compressor.knee.value=16;compressor.ratio.value=4;compressor.attack.value=.008;compressor.release.value=.22;compressor.connect(destination);
 const input=context.createGain();input.gain.value=.72;input.connect(compressor);
 const delay=context.createDelay(1);delay.delayTime.value=60/116*.75;const wet=context.createGain();wet.gain.value=.12;delay.connect(wet);wet.connect(input);const feedback=context.createGain();feedback.gain.value=.16;delay.connect(feedback);feedback.connect(delay);
 const noise=context.createBuffer(1,context.sampleRate,context.sampleRate),data=noise.getChannelData(0);let seed=937451;for(let i=0;i<data.length;i++){seed=(1664525*seed+1013904223)>>>0;data[i]=seed/2147483648-1;}
 return {context,input,delay,noise,dispose(){input.disconnect();delay.disconnect();wet.disconnect();feedback.disconnect();compressor.disconnect();}};
}
export function scheduleMusicStep(bus,step,time,track){
 const {context:c,input,delay,noise}=bus,bar=Math.floor(step/16)%32,s=step%16,section=Math.floor(bar/8),ch=bar%4,root=roots[ch],beat=60/track.bpm,nodes=[];
 function voice(note,duration,level,partial=1,echo=false){const o=c.createOscillator(),g=c.createGain();o.frequency.value=hz(note)*partial;g.gain.setValueAtTime(.0001,time);g.gain.linearRampToValueAtTime(level,time+.014);g.gain.exponentialRampToValueAtTime(.0001,time+duration);o.connect(g);g.connect(input);if(echo)g.connect(delay);o.start(time);o.stop(time+duration+.02);nodes.push(o);o.onended=()=>{o.disconnect();g.disconnect();};}
 function keys(note,duration,level,echo=false){voice(note,duration,level,1,echo);voice(note,duration*.6,level*.22,2.002,echo);voice(note,duration*.3,level*.07,3.004);}
 function hit(level,duration,freq,type='bandpass'){const n=c.createBufferSource(),g=c.createGain(),f=c.createBiquadFilter();n.buffer=noise;f.type=type;f.frequency.value=freq;f.Q.value=.5;g.gain.setValueAtTime(.0001,time);g.gain.linearRampToValueAtTime(level,time+.003);g.gain.exponentialRampToValueAtTime(.0001,time+duration);n.connect(f);f.connect(g);g.connect(input);n.start(time);n.stop(time+duration+.01);nodes.push(n);n.onended=()=>{n.disconnect();f.disconnect();g.disconnect();};}
 function kick(level=.65){const o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(100,time);o.frequency.exponentialRampToValueAtTime(43,time+.1);g.gain.setValueAtTime(.0001,time);g.gain.linearRampToValueAtTime(level,time+.004);g.gain.exponentialRampToValueAtTime(.0001,time+.26);o.connect(g);g.connect(input);o.start(time);o.stop(time+.28);nodes.push(o);o.onended=()=>{o.disconnect();g.disconnect();};}
 const interlude=section===2&&bar%8<4;
 // A laid-back backbeat and syncopated bass, rather than the prior orchestral march.
 if(s===0||s===8||(!interlude&&s===10))kick(interlude?.38:.65);
 if(s===4||s===12)hit(interlude?.09:.19,.13,1800);
 if(!interlude&&s%2===0)hit(s%4===2?.06:.035,.045,6200,'highpass');
 if(!interlude&&bar%8===7&&s>=14)hit(.07,.07,2400);
 if([0,6,8,14].includes(s)){voice(root-12,beat*.65,.23);voice(root,beat*.4,.035);}
 // Rolled seventh chords and a mellow electric-piano call-and-response.
 if(s===0||s===1||s===2||s===3||(!interlude&&s===10)){const index=s===10?0:s;keys(root+12+chords[ch][index],beat*(s===10?1.2:2.6),.075,true);}
 if(s%4===0){const note=melody[ch][(bar%2)*4+s/4],variation=section===3&&s===12?-2:0;keys(note+variation,beat*1.45,interlude?.05:.105,true);}
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
