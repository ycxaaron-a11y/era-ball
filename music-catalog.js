// Original compositions only; no recordings, embeds or external playback services.
export const musicCatalog=[
 {id:'kickoff',title:'KICKOFF · 开场哨',subtitle:'128 BPM · 电子鼓 / 合成贝斯 / 体育场旋律',bpm:128,energy:0},
 {id:'floodlights',title:'FLOODLIGHTS · 聚光时刻',subtitle:'132 BPM · 推进节奏 / 跳动贝斯 / 琶音',bpm:132,energy:1},
 {id:'extra-time',title:'EXTRA TIME · 决胜时刻',subtitle:'136 BPM · 重鼓 / 双层主旋律 / 冲刺节奏',bpm:136,energy:2}
];
export const lobbyMusic=musicCatalog[0];
export function musicForScene({screen='home'}={}){return musicCatalog[screen==='season'?2:screen==='draft'?1:0];}
