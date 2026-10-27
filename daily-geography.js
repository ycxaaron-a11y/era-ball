// Game geography: the location of this card's team, not the player's birthplace.
const place=(country,continent,region)=>Object.freeze({country,continent,region});
const countries={
 '巴西':place('巴西','南美洲','南美东部'),'阿根廷':place('阿根廷','南美洲','南美南部'),'乌拉圭':place('乌拉圭','南美洲','南美南部'),'智利':place('智利','南美洲','南美西部'),'秘鲁':place('秘鲁','南美洲','南美西部'),'哥伦比亚':place('哥伦比亚','南美洲','南美西北部'),
 '英格兰':place('英格兰','欧洲','北欧'),'荷兰':place('荷兰','欧洲','西欧'),'意大利':place('意大利','欧洲','南欧'),'法国':place('法国','欧洲','西欧'),'德国':place('德国','欧洲','中欧'),'保加利亚':place('保加利亚','欧洲','东南欧'),'克罗地亚':place('克罗地亚','欧洲','东南欧'),'西班牙':place('西班牙','欧洲','南欧'),'葡萄牙':place('葡萄牙','欧洲','南欧'),'丹麦':place('丹麦','欧洲','北欧'),'希腊':place('希腊','欧洲','南欧'),
 '塞内加尔':place('塞内加尔','非洲','西非'),'加纳':place('加纳','非洲','西非'),'摩洛哥':place('摩洛哥','非洲','北非')
};
Object.assign(countries,{'日本':place('日本','亚洲','东亚'),'韩国':place('韩国','亚洲','东亚'),'土耳其':place('土耳其','欧洲','东南欧'),'比利时':place('比利时','欧洲','西欧'),'喀麦隆':place('喀麦隆','非洲','中非'),'瑞典':place('瑞典','欧洲','北欧'),'捷克':place('捷克','欧洲','中欧'),'巴拉圭':place('巴拉圭','南美洲','南美中部'),'墨西哥':place('墨西哥','北美洲','中北美'),'厄瓜多尔':place('厄瓜多尔','南美洲','南美西部')});
const clubCountries={'皇家马德里':'西班牙','巴塞罗那':'西班牙','费耶诺德':'荷兰','阿贾克斯':'荷兰','利物浦':'英格兰','诺丁汉森林':'英格兰','阿斯顿维拉':'英格兰','曼彻斯特联':'英格兰','切尔西':'英格兰','曼彻斯特城':'英格兰','波尔图':'葡萄牙','AC 米兰':'意大利','国际米兰':'意大利','尤文图斯':'意大利','马赛':'法国','巴黎圣日耳曼':'法国','勒沃库森':'德国','沙尔克 04':'德国','拜仁慕尼黑':'德国','多特蒙德':'德国'};
Object.assign(clubCountries,{'阿森纳':'英格兰','马德里竞技':'西班牙','瓦伦西亚':'西班牙','里昂':'法国','那不勒斯':'意大利','托特纳姆热刺':'英格兰','PSV 埃因霍温':'荷兰'});
export function teamGeography(pool){
 if(pool.team==='西德')return countries['德国'];
 if(pool.team==='凯尔特人')return place('苏格兰','欧洲','北欧');
 if(pool.team==='贝尔格莱德红星')return place(pool.year<1992?'南斯拉夫':'塞尔维亚','欧洲','东南欧');
 const value=countries[clubCountries[pool.team]||pool.team];
 if(!value)throw Error(`Daily Card 缺少球队地理资料：${pool.team}`);
 return value;
}
