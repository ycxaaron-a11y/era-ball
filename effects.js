export function playerSilhouette() {
  return '<svg class="player-silhouette" viewBox="0 0 64 80" aria-hidden="true" focusable="false"><circle cx="32" cy="22" r="13"/><path d="M8 78V65c0-15 9-24 24-24s24 9 24 24v13z"/></svg>';
}
export function splusLightning(tier) {
  if (tier !== 'S+') return '';
  return `<svg class="splus-thunder" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <g class="bolt bolt-a"><path d="M2 16 4 4 16 5 22 2 29 8 38 3 49 5 56 2 63 7 76 3 84 6 97 3 98 15"/><path d="m2 14 3 9-3 8 3 12-4 9 4 13-3 11 3 8-2 13 13-2 8 3 14-4 9 5 14-4 9 2 13-4 10 4 13-1 1-11"/><path class="branch" d="m22 2 3 11 5-3m45 86-5-10 8 1M2 52l7-4-2 9"/></g>
    <g class="bolt bolt-b"><path d="m3 9 14-5 7 3 9-6 12 6 8-3 12 3 13-5 8 5 12-4 0 15-3 12 4 11-2 9 3 9-4 11 3 14-2 15-11-3-8 4-14-5-9 3-12-3-10 4-13-2-9 3-10-2"/><path class="branch" d="m97 31-7 5 5 6m-2 42-8 2 3 6M33 1l-3 10 8-3"/></g>
  </svg>`;
}

export function placementImpact() {
  return `<span class="placement-impact" aria-hidden="true"><span class="impact-ring"></span>${[-1,-.65,0,.65,1].map((x,i)=>`<span class="impact-dust" style="--dust-x:${x*70}px;--dust-y:${26+Math.abs(x)*12}px;--dust-delay:${i*.018}s"></span>`).join('')}</span>`;
}

export const hasDarkMatter = rating => rating >= 110;
export function darkMatter(rating){
 if(!hasDarkMatter(rating))return '';
 return `<span class="dark-matter" aria-hidden="true">${Array.from({length:14},(_,i)=>{const angle=i*Math.PI*2/14;return `<i style="--particle-x:${50+49*Math.cos(angle)}%;--particle-y:${50+49*Math.sin(angle)}%;--particle-delay:${-(i*.137)}s;--particle-size:${i%3===0?3:2}px"></i>`;}).join('')}<span class="matter-orbit"></span></span>`;
}
