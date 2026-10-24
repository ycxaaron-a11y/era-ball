// Historical co-playing evidence is documented in docs/chemistry-research.md.
// The bonus is an editorial game rule, not a measurement of friendship.
export const chemistryPairs = [
  { id:'madrid-wings', players:['cristiano-ronaldo','gareth-bale'], name:'皇马两翼', bonus:2, source:'18244' },
  { id:'madrid-finishing', players:['cristiano-ronaldo','karim-benzema'], name:'皇马锋线连线', bonus:2, source:'18244' },
  { id:'bbc-partners', players:['gareth-bale','karim-benzema'], name:'锋线策应', bonus:2, source:'18244' },
  { id:'madrid-control', players:['luka-modric','toni-kroos'], name:'典礼中场', bonus:2, source:'18244' },
  { id:'barca-control', players:['xavi','andres-iniesta'], name:'哈白节奏', bonus:2, source:'18236' },
  { id:'barca-right', players:['lionel-messi','dani-alves'], name:'巴萨右路连线', bonus:2, source:'18236' },
  { id:'brazil-1970', players:['pele','jairzinho'], name:'桑巴锋线', bonus:2, source:'3888702' },
  { id:'total-football', players:['johan-cruyff','johan-neeskens'], name:'全攻全守', bonus:2, source:'3750235' },
  { id:'argentina-1986', players:['diego-maradona','jorge-burruchaga'], name:'阿根廷冠军连线', bonus:2, source:'3889149' },
  { id:'milan-balance', players:['andrea-pirlo','gennaro-gattuso'], name:'米兰攻守平衡', bonus:2, source:'3750200' },
  { id:'liverpool-wings', players:['mohamed-salah','sadio-mane'], name:'红军双翼', bonus:2, source:'22912' },
  { id:'argentina-2022', players:['lionel-messi','julian-alvarez'], name:'阿根廷新老连线', bonus:2, source:'3869685' },
  { id:'france-midfield', players:['ngolo-kante','paul-pogba'], name:'法国中场屏障', bonus:2, source:'8658' }
];
export const chemistryTrios=[
 {id:'bbc',players:['cristiano-ronaldo','gareth-bale','karim-benzema'],name:'BBC',mode:'flat',bonus:5},
 {id:'msn',players:['lionel-messi','neymar','luis-suarez'],name:'MSN',mode:'flat',bonus:5},
 {id:'dutch-three',players:['ruud-gullit','marco-van-basten','frank-rijkaard'],name:'荷兰三剑客',mode:'percent',bonus:5}
];
export const chemistryCap = 3; // Pair bonuses only; trios have their own rule.
export function activeChemistry(picks) {
  const identities = new Set(picks.filter(Boolean).map(p=>p.identity));
  return chemistryPairs.filter(pair=>pair.players.every(id=>identities.has(id)));
}
export function activeTrios(picks){
 const identities=new Set(picks.filter(Boolean).map(p=>p.identity));
 return chemistryTrios.filter(trio=>trio.players.every(id=>identities.has(id)));
}
export function chemistryBonuses(picks) {
  const result = new Map();
  for (const pair of activeChemistry(picks)) for (const id of pair.players) result.set(id,Math.min(chemistryCap,(result.get(id)||0)+pair.bonus));
  for(const trio of activeTrios(picks))for(const id of trio.players){
   const player=picks.find(p=>p?.identity===id),bonus=trio.mode==='percent'?Math.round(player.rating*trio.bonus/100):trio.bonus;
   result.set(id,Math.max(result.get(id)||0,bonus));
  }
  return result;
}
export const chemistryBonus = (picks, player) => player ? chemistryBonuses(picks).get(player.identity)||0 : 0;
