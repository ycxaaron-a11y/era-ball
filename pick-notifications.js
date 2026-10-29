import {pools} from './data.js';
const cards=new Map(pools.flatMap(pool=>pool.players.map(player=>[player.id,player])));
const colors={'S+':'#dfbbff',S:'#c485ff',A:'#f2cf77',B:'#64b9ff',C:'#76c793',D:'#d78b4f'};

// Observe confirmed snapshots only; the first read establishes a silent baseline.
export function createPickTracker(onPick){
 let room=null,seen=new Map();
 return {
  reset(){room=null;seen.clear();},
  update(snapshot){
   const initial=room!==snapshot.code;if(initial){room=snapshot.code;seen.clear();}
   for(const member of snapshot.members||[]){
    if(member.is_self)continue;
    const key=member.seat??member.user_id;
    const previous=seen.get(key),current=new Set();
    for(const pick of member.state?.picks||[]){
     const id=typeof pick==='string'?pick:pick?.id;if(!id)continue;current.add(id);
     const player=cards.get(id);
     if(!initial&&previous&&!previous.has(id)&&player)onPick({teamName:member.state?.teamName||`玩家 ${(member.seat??0)+1}`,name:player.name,tier:player.tier});
    }
    seen.set(key,current);
   }
   const present=new Set((snapshot.members||[]).filter(m=>!m.is_self).map(m=>m.seat??m.user_id));
   for(const key of seen.keys())if(!present.has(key))seen.delete(key);
  }
 };
}

let host=null,queue=[],timeout=null;
function mount(){
 if(host)return;
 const style=document.createElement('style');style.textContent=`
 .pick-notices{position:fixed;right:20px;top:90px;width:min(330px,calc(100vw - 32px));z-index:2147483647;pointer-events:none;font-family:inherit}
 .pick-notice{position:relative;background:#211f1bf5;border:1px solid var(--pick-color);border-left:4px solid var(--pick-color);border-radius:12px;padding:14px 44px 14px 16px;box-shadow:0 8px 32px #0006;pointer-events:auto;color:#f5f0e6;animation:pick-notice-in .2s ease-out}
 .pick-notice small{display:block;font-size:12px;color:#c9c0b0;margin-bottom:7px;overflow-wrap:anywhere}
 .pick-notice strong{font-size:17px;overflow-wrap:anywhere}.pick-notice b{display:inline-block;color:var(--pick-color);border:1px solid currentColor;border-radius:5px;padding:2px 7px;margin-left:10px;font-size:14px}
 .pick-notice button{position:absolute;right:8px;top:6px;background:transparent;border:0;padding:5px;color:#c9c0b0;font-size:20px;cursor:pointer;min-width:28px;min-height:28px}
 @keyframes pick-notice-in{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
 @media(max-width:600px){.pick-notices{top:72px;right:16px}}
 @media(prefers-reduced-motion:reduce){.pick-notice{animation:none}}
 `;document.head.append(style);
 host=document.createElement('aside');host.className='pick-notices';host.setAttribute('aria-label','对手选人提示');host.setAttribute('aria-live','polite');host.setAttribute('aria-atomic','true');document.body.append(host);
}
function next(){
 clearTimeout(timeout);host?.replaceChildren();const pick=queue.shift();if(!pick)return;
 mount();const notice=document.createElement('div');notice.className='pick-notice';notice.style.setProperty('--pick-color',colors[pick.tier]||colors.D);
 const label=document.createElement('small');label.textContent=`${pick.teamName} · 已选球员`;
 const name=document.createElement('strong');name.textContent=pick.name;
 const badge=document.createElement('b');badge.textContent=pick.tier;
 const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','关闭选人提示');close.onclick=next;
 notice.append(label,name,badge,close);host.append(notice);timeout=setTimeout(next,3200);
}
export function showPickNotice(pick){queue.push(pick);if(!host?.firstChild)next();}
export function clearPickNotices(){queue=[];clearTimeout(timeout);host?.replaceChildren();}
