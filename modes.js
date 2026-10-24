export const modes={world_cup:{name:'世界杯',label:'FIFA WORLD CUP',button:'wc'},ucl:{name:'欧冠',label:'UEFA CHAMPIONS LEAGUE',button:'ucl'},euro:{name:'欧洲杯',label:'UEFA EURO',button:'euro'},copa_america:{name:'美洲杯',label:'CONMEBOL COPA AMÉRICA',button:'copa'}};
export const modeName=mode=>modes[mode]?.name||'杯赛';

export const isMode=mode=>Object.prototype.hasOwnProperty.call(modes,mode);
