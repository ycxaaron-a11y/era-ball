# 年代与多位置：研究记录和建模边界

检查日期：2026-10-23。球员评分和跨年代适应分属于 ERA FC 的编辑设定，并非 FIFA、UEFA 或 StatsBomb 的官方评级。

## 本次实际读取的证据

数据来源：**StatsBomb Open Data**。以下分析不代表 StatsBomb 的观点。没有将原始比赛或事件数据随游戏分发。

![StatsBomb 官方项目标识](./statsbomb-attribution.svg)

标识来自 [StatsBomb 官方 logos 仓库](https://github.com/statsbomb/logos/blob/main/HudlStatsbomb_Python.svg)。[数据说明及署名要求](https://github.com/statsbomb/open-data/blob/master/README.md)和[使用协议](https://github.com/statsbomb/open-data/blob/master/LICENSE.pdf)均已读取。该数据源面向研究和非商业分析；若将游戏商业化，应另行审查相关使用权限。

直接访问 FIFA、UEFA、IFAB、Coaches' Voice、Wikipedia 与 Wikimedia 的请求被当前云环境代理以 CONNECT 403 拦截。因而未声称读过这些站点上的文章。随后从 StatsBomb 官方 GitHub 读取了赛事、比赛、阵容和一个比赛的事件文件，得到如下可复查的有限证据：

| 观察 | 实际读取的来源 | 对游戏设计的意义 |
| --- | --- | --- |
| C 罗在 2014 年欧冠决赛被记录为 Left Wing | [比赛 18241 阵容](https://github.com/statsbomb/open-data/blob/master/data/lineups/18241.json) | 左边锋是有比赛记录的角色。 |
| C 罗在 2016 年欧冠决赛先踢 Left Wing，77:17 后为 Center Forward | [比赛 18243 阵容](https://github.com/statsbomb/open-data/blob/master/data/lineups/18243.json) | 对该时期版本开放 LW 与 ST 的满额适应，有直接的同场多位置依据。 |
| C 罗在 2017 年欧冠决赛为 Left Center Forward | [比赛 18244 阵容](https://github.com/statsbomb/open-data/blob/master/data/lineups/18244.json) | 不应把 2017 年 C 罗限制成只能踢 LW。 |
| 马拉多纳在 1986 年对英格兰时，记录从 Center Attacking Midfield 改为 Right Center Forward | [比赛 3750191 阵容](https://github.com/statsbomb/open-data/blob/master/data/lineups/3750191.json) | CAM 与 ST 都有依据；一场比赛不能证明他所有位置都一样强。 |
| 马内在 2019 年欧冠决赛由 Left Wing 改为 Left Midfield | [比赛 22912 阵容](https://github.com/statsbomb/open-data/blob/master/data/lineups/22912.json) | LW 与 LM 可同时是自然位置，不能把边锋/边前卫一律扣分。 |
| 范戴克在 2019 年欧冠决赛为 Left Center Back；事件记录含争顶、铲球、头球解围和传球 | [比赛 22912 阵容](https://github.com/statsbomb/open-data/blob/master/data/lineups/22912.json)、[事件](https://github.com/statsbomb/open-data/blob/master/data/events/22912.json) | 展现不只一种防守/持球任务。但没有证据直接测量他回到 1970 年代会有多少能力损失。 |
| 贝利在 1970 年决赛为 Right Center Forward；克鲁伊夫在 1972 年欧冠决赛为 Center Forward | [比赛 3888702](https://github.com/statsbomb/open-data/blob/master/data/lineups/3888702.json)、[比赛 3750235](https://github.com/statsbomb/open-data/blob/master/data/lineups/3750235.json) | 历史记录中的位置名称需要映射到游戏中的 ST/CAM 等简化槽位，不能机械照搬名字。 |

这些是选定比赛的记录，既不是完整生涯位置库，也不是全部扩充名单的逐人核验。数据自身也可能有缺漏，例如 1986 年阿根廷对西德的比赛目录中存在阶段标签异常，所以本项目不直接复制其整个赛制或数据库。

## 年代划分

游戏使用十二个方便抽选的区间：1960–1969、1970–1974、1975–1979、1980–1984、1985–1989、1990–1994、1995–1999、2000–2004、2005–2009、2010–2014、2015–2019、2020–2024。首段覆盖十年，其余为五年；这是为了兼顾早期代表性和现代球队多样性，并不是自然的战术分界。

同一年代一直存在不同打法。全攻全守、盯人、区域防守、控球、反击和压迫并不能只按照出生年份分类。赛事、队伍与球员习惯都重要。1992 年回传球规则的改变是门将使用脚下技术要求改变的历史背景之一；本次未能从 IFAB 网站重新核验原始规则，故不把任何精确数值惩罚宣称为规则直接推导的结论。

## 能力调整应如何理解

跨年代对阵不存在可用于验证结果的真实实验。默认应**不扣分**，只有被明确标注打法特征的球员才给予少量适应成本；不能采用“越老越弱”或“年代相差越大扣分越多”的规则。

推荐实现为可解释的角色标签，数值属于游戏平衡，而非研究测量：

- `universal`：没有年代惩罚。范戴克适合这个设定；贝利、克鲁伊夫等历史巨星也不应仅因年代古老被扣分。
- `classic-keeper`：明确作为传统门线型门将建模，进入现代出球任务较重的环境时小幅扣分。不能仅按年份把所有旧门将放进此组，亦不能忽略雅辛等例外。
- `classic-maker`：依赖自由前腰空间、较少参与整体压迫的特定球员，在现代紧凑压迫环境中可能需要适应。不能把所有历史前腰默认设为这一类。
- `classic-stopper`：主要承担盯人、较少高位持球推进的防守角色，现代高线与出球环境中可能需要适应。现代范戴克回到旧年代不属于这个例子。
- `modern-press`：依赖集体压迫机制的特定角色，进入配套压迫较少的早期环境时可能有少量适应成本。速度、体力本身不应被视为旧年代劣势。
- `modern-wingback`：进攻型翼卫依赖覆盖和协防体系，在早期环境中的调整只能表示角色配套不足，不能表示他历史上无法踢球。

对一名球员显示其原始能力、年代调整、位置调整及最终能力，并保留文字原因。年代罚分宜明显小于真正的门将/外场错位罚分，不宜因为一项假设把 S 级直接降到 B。多个自然位置使用 `positions` 数组，所有列出的自然位置都应得到同等位置适配，是否换年代与是否踢错位置分别计算。

评分阈值、每队最多三名 S/S+ 的限制、角色标签以及罚分大小均由项目编辑决定，不应写成“公平公正的客观评分”。历史球队可保留最高仅 A 的版本，让 B/C/D 球员成为真实可选的阵容部分。

## 本轮不采用联网真人头像

Wikimedia 图片请求被网络拦截，无法检查目标图片是否存在、是否确为本人，以及每张图片的作者、许可和署名要求。另一些公共足球头像 URL 没有稳定性和可再分发许可保证。任意热链容易造成破图、错人或外站拒绝访问。

本轮建议保留统一的姓名缩写/国旗头像占位，视觉层级使用等级边框和球员姓名。以后若添加头像，应建立人工核验的 `identity -> 本地图片/许可/作者/来源` 清单，只使用已确认授权的照片，并为每张图片保留 `onerror` 回退。无需为了看似完整而把未核验的网络图片链接塞进球员库。
