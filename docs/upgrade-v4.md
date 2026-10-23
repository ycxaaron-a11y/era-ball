# 原网站升级到逐轮赛季

网站、GitHub 仓库和 Supabase 项目都继续使用原来的。

1. 打开 [合并升级 SQL](https://github.com/ycxaaron-a11y/era-ball/blob/main/supabase/upgrade-all-v4.sql)。点击代码区右上角的复制按钮，复制整个文件（也可打开 Raw 后全选复制）。不要复制网页导航文字。
2. 打开原 Supabase 项目，进入左侧 **SQL Editor**。
3. 点击 **New query / +** 新建查询，将全部 SQL 粘贴进去，然后点击 **Run**。
4. 看到 **Success. No rows returned** 即完成。如果出错，保留报错文字供排查，不必重建表或项目。
5. 等 Netlify 最新部署显示 Published 后，打开原网站 https://era-ball.netlify.app ，强制刷新（Mac：Command + Shift + R；Windows：Ctrl + Shift + R）。
6. 双方最好新建一局、新建房间，选满 16 人后进入赛季，每点一次推进一轮。原有协议 3 已完成房间也能使用新赛季。

此文件包含上次 Spin、版本锁和羁绊升级，以及本次赛季接口；上次执行过也可重跑，不会清空现有球员、房间或赛季进度。前提是已执行最初的 `supabase/multiplayer.sql`，你的原项目已完成这一步。不需要改匿名登录、公开 key 或 Netlify 配置。

若不方便从 GitHub 复制，网站联机提示升级时可点 **复制升级 SQL**，然后完成第 2–6 步。单人赛季不依赖数据库升级。
