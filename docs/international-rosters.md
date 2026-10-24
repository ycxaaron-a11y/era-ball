# 欧洲杯与美洲杯：精选名单

新增国家队欧洲杯 `euro`、美洲杯 `copa_america`，各 16 支球队年代、合计 710 条球员版本。欧冠 `ucl` 仍是俱乐部赛事，导航明确分开。名单由编辑挑选，不声称完整复刻每届全部报名名单或所有历史届次；能力是游戏估值。

欧洲杯：法国 1984、荷兰 1988、丹麦 1992、法国 2000、葡萄牙 2004、希腊 2004、西班牙 2008/2012、葡萄牙 2016、法国 2016、意大利/英格兰 2020、西班牙/法国/英格兰/德国 2024。2020 欧洲杯实际在 2021 年举行，游戏保留赛事名称年份 2020，均属于 2020–2024 来源区间。

美洲杯：阿根廷 1993、巴西 1997/1999/2004/2007、乌拉圭 2011、智利 2015/2016、阿根廷 2015/2016、巴西 2019、秘鲁 2019、阿根廷/巴西 2021、阿根廷/哥伦比亚 2024。

`catalog-international.js` 按稳定球员身份复用已有中文名和自然位置，补充其他球员的中文音译。原来整理过的身高保持不变，缺少资料时仍使用已向用户说明的稳定位置估值，不显示估字。新增模式的来源池不是全部 12 段均有记录：无名单区间在设置页禁用，征战战术年代仍可自由选择。

## 实际核对的现代比赛资料

此次实际读取 StatsBomb Open Data 的 competitions、欧洲杯 2024 比赛列表、美洲杯 2024 比赛列表，以及下列完整比赛阵容 JSON。它们用于核对部分 2024 年球员成员身份，不用于生成游戏能力值，也不能证明其他历史名单已全部在线核验。

| 来源球队 | 比赛阵容记录 |
| --- | --- |
| 西班牙 2024 | [3930160](https://github.com/statsbomb/open-data/blob/master/data/lineups/3930160.json) |
| 英格兰 2024 | [3930163](https://github.com/statsbomb/open-data/blob/master/data/lineups/3930163.json) |
| 法国 2024 | [3938643](https://github.com/statsbomb/open-data/blob/master/data/lineups/3938643.json) |
| 德国 2024 | [3930176](https://github.com/statsbomb/open-data/blob/master/data/lineups/3930176.json) |
| 阿根廷 2024 | [3939977](https://github.com/statsbomb/open-data/blob/master/data/lineups/3939977.json) |
| 哥伦比亚 2024 | [3939991](https://github.com/statsbomb/open-data/blob/master/data/lineups/3939991.json)、[3939975](https://github.com/statsbomb/open-data/blob/master/data/lineups/3939975.json) |

对照时区分全名和常用名，例如 Dani / Daniel Carvajal、Dani / Daniel Olmo、Dayot / Dayotchanculle Upamecano、Pascal Gross / Groß、Richard Ríos / Richard。卢库米在对巴拉圭的阵容里可查，但伤后未出现在后续对巴西名单，不据某一场缺席就删除其赛事版本。

未复制原始比赛事件或完整阵容 JSON 入库，仅整理游戏所需事实和编辑数据；署名及使用范围沿用 [年代研究说明](era-research.md) 和现有 StatsBomb 署名图片。
