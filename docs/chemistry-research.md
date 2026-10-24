# 历史搭档与羁绊

本版本 13 组双人羁绊使用有真实同队比赛记录的搭档。证据来自实际读取的 [StatsBomb Open Data](https://github.com/statsbomb/open-data) 比赛阵容及部分传球事件；不据此推断私人友情。以下链接为对应比赛的双方阵容记录，每组两人均出现在同一队名单中（可能包含替补）。

| 搭档 | 核验比赛 | 阵容记录 |
| --- | --- | --- |
| C罗 / 贝尔、C罗 / 本泽马、贝尔 / 本泽马、莫德里奇 / 克罗斯 | 2017 欧冠决赛，皇马对尤文 | [18244](https://github.com/statsbomb/open-data/blob/master/data/lineups/18244.json) |
| 哈维 / 伊涅斯塔、梅西 / 阿尔维斯 | 2011 欧冠决赛，巴萨对曼联 | [18236](https://github.com/statsbomb/open-data/blob/master/data/lineups/18236.json) |
| 贝利 / 雅伊尔津霍 | 1970 世界杯决赛，巴西对意大利 | [3888702](https://github.com/statsbomb/open-data/blob/master/data/lineups/3888702.json) |
| 克鲁伊夫 / 内斯肯斯 | 1972 欧洲冠军杯决赛，阿贾克斯对国际米兰 | [3750235](https://github.com/statsbomb/open-data/blob/master/data/lineups/3750235.json) |
| 马拉多纳 / 布鲁查加 | 1986 世界杯决赛，阿根廷对西德 | [3889149](https://github.com/statsbomb/open-data/blob/master/data/lineups/3889149.json) |
| 皮尔洛 / 加图索 | 2007 欧冠决赛，米兰对利物浦 | [3750200](https://github.com/statsbomb/open-data/blob/master/data/lineups/3750200.json) |
| 萨拉赫 / 马内 | 2019 欧冠决赛，利物浦对热刺 | [22912](https://github.com/statsbomb/open-data/blob/master/data/lineups/22912.json) |
| 梅西 / 阿尔瓦雷斯 | 2022 世界杯决赛，阿根廷对法国 | [3869685](https://github.com/statsbomb/open-data/blob/master/data/lineups/3869685.json) |
| 坎特 / 博格巴 | 2018 世界杯决赛，法国对克罗地亚 | [8658](https://github.com/statsbomb/open-data/blob/master/data/lineups/8658.json) |

进一步读取 2011 决赛事件，两方向直接成功传球合计：哈维与伊涅斯塔 60 次，梅西与阿尔维斯 28 次。2017 决赛莫德里奇与克罗斯为 17 次。这些是单场观察，不是整个生涯的统计或评分，也不用于按传球次数机械分配能力。贝尔在 2017 决赛后段替补出场，该场与部分锋线搭档没有直接成功传球记录，不代表长期缺乏配合。

C罗与罗伯托·卡洛斯未作为真实皇马队友设置羁绊：卡洛斯 2007 年离队，C罗 2009 年加盟。

## 游戏设定

双人组双方各加 2 分，多组每人上限 3 分；首发或替补均可参与。

新增三人组合：BBC 为 C罗、贝尔、本泽马（2017 皇马）；MSN 为梅西、内马尔、苏亚雷斯（2015 巴萨）；荷兰三剑客为古力特、范巴斯滕、里杰卡尔德（1989 米兰）。历史参照还可查看 [UEFA 2015 赛季](https://www.uefa.com/uefachampionsleague/history/seasons/2015/) 和 [UEFA 1989 赛季](https://www.uefa.com/uefachampionsleague/history/seasons/1989/)；三人组合及数值并不是这些来源机构提出的统计结论。

三人组只需三人都在本队 16 人名单内，首发、替补或错位都可激活；移出球队后才失效。BBC / MSN 每人固定加 5 分；荷兰三剑客按各自初始能力乘 5%，四舍五入为整数。对于同一球员，取双人加分与三人加分的较高值，不重复叠加；随后扣除位置与年代影响，基础能力上限 110，羁绊后的实际能力不封顶。依据最终能力更新评级和边框，原始评级变化提示仍显示原卡评级。

移到替补、移除一方会取消三人组，其余双人组按原规则保留。同身份不同历史版本可跨年代激活，这是梦幻阵容的编辑设定，不代表这些特定版本曾同时比赛。自己的阵容仍限制同身份仅一人。

数值、叠加上限及跨版本激活均属于游戏平衡设定，不是来源机构的结论。数据署名及使用范围参见 [年代研究说明](era-research.md)。没有复制原始事件数据到本仓库。
