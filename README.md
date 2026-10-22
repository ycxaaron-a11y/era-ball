# ERA FC
世界杯 / 欧冠跨时代足球选秀网站。无需安装 npm 依赖。

## 运行
需要 Node.js（测试）和 Python 3（本地 HTTP 服务）。
```sh
cd /workspace/era-ball
npm test
npm run dev
```
浏览器打开运行机器的 3000 端口。也可将 index.html、style.css、app.js、data.js 部署到任意静态网站服务。不要通过 file:// 打开 ES modules。

## 当前玩法
世界杯：阿根廷 2022、巴西 2002、法国 2018。
欧冠：皇马 2017、巴萨 2011、曼城 2023。
内置精选阵容；不是所有球队、年代、完整赛事注册名单。评级为人工估值，详见网页玩法说明。
支持 16 人选秀、3 次重转、4 种阵型、位置扣分、浏览器本地保存、简化赛季。

## 跨设备联机配置
1. 在自己的 Supabase 项目 SQL Editor 执行 supabase/multiplayer.sql（新增 fc_* 表，不覆盖既有表）。
2. Authentication > Providers 中启用 Anonymous Sign-Ins。匿名注册需要允许浏览器访问 Supabase。
3. 网站点击「联机对战」，填写 Project URL 及 publishable key 或 legacy anon public key。绝不要填写 service_role / secret key。
4. 创建房间，另一台设备或不同浏览器加入房间码。加入会开始新的本地阵容，请先完成或保存旧选秀。
5. 双方独立选满 16 人，服务端生成一次共同决赛结果。通过每 2 秒 HTTP 轮询同步，无需开启 Realtime publication。

联机为朋友间原型：成员认证和两人限制在数据库执行，但客户端提交的评分和选秀过程尚未由服务器权威校验，不适合公开竞技或有奖活动。联机决赛采用首发原始评分；本地赛季采用位置适配评分。暂不支持重连恢复、观战、房间清理、替补自动换人。网络错误可在联机面板查看。

## 验证范围
本地数据/阵型/评分/模拟规则使用 Node 内置测试。没有 Supabase 项目配置前，联机 SQL 和双设备流程不能算作已验证。
