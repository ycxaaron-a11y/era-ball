# 决赛直播：一次合并升级

继续使用原 GitHub 仓库、原 Supabase 项目和 https://era-ball.netlify.app 。

1. 打开 [合并 SQL](https://github.com/ycxaaron-a11y/era-ball/blob/main/supabase/upgrade-all-v5.sql)，点击代码区复制按钮复制整个文件。也可点 Raw，再全选复制。
2. 进入原 Supabase 项目 → **SQL Editor → New query / +**。
3. 粘贴全部代码，点击 **Run**。
4. 看到 **Success. No rows returned** 即成功。此脚本包含球员版本锁、羁绊、逐轮赛季和决赛直播接口，上次运行过也可重跑，不会清空已有房间或赛季。
5. 等 Netlify 最新部署完成后，双方强制刷新原网站（Mac：Command + Shift + R；Windows：Ctrl + Shift + R）。建议新建一局，以免双方混用旧的比赛引擎。
6. 自动模拟在决赛前停下，点击 **手动开始决赛**，观看常规时间和必要的加时；进入点球后，点击 **揭晓下一脚**，每次只推进一脚。

也可以在网站联机升级提示处点 **复制升级 SQL**，再完成第 2–6 步。无需重新建项目、开匿名登录或填公开 key。原项目需要已执行最初的 `supabase/multiplayer.sql`；此前已经运行过的项目不用重复该初始化。单人决赛无需 SQL 升级。
