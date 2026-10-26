# 只用网页发布到原 Cloudflare 网址

仓库工作流 `.github/workflows/deploy-cloudflare.yml` 在 GitHub 构建并通过 Cloudflare API 发布到现有 `era-ball` Worker。它绕过 Cloudflare Git 构建环境，保留原网址与 Supabase。无需在学校电脑安装软件。

## 一次性配置

1. 在 Cloudflare 右上角个人资料进入 **My Profile → API Tokens → Create Token → Create Custom Token**，取名 `era-ball-github`。
2. 权限添加 **Account → Workers Scripts → Edit** 和 **Account → Account Settings → Read**。Account Resources 只选托管 `era-ball` 的这个账户。此网站使用 workers.dev，无需 Zone 权限，也无需填写域名。不要添加 IP 过滤（GitHub 托管运行器 IP 会变动）。
3. 创建并复制 API Token。不要把令牌发送到聊天、提交到代码或放入网页前端。它只在创建后显示一次。
4. 打开 GitHub 仓库 **Settings → Secrets and variables → Actions → New repository secret**，名称填 `CLOUDFLARE_API_TOKEN`，Secret 粘贴令牌后保存。
5. 在 Cloudflare 的账户主页复制 **Account ID**，它不是 Worker Version ID、API Token 或 Supabase ID。再创建一个 repository secret，名称为 `CLOUDFLARE_ACCOUNT_ID`，Secret 为该账户 ID。
6. 回到 GitHub **Actions → Deploy ERA FC to Cloudflare → Run workflow**，选择 `main`，再点绿色 **Run workflow**。如果第一次运行因缺少 secrets 失败，也可打开它点击 **Re-run all jobs**。

成功时 GitHub 运行摘要会显示构建的版本与网址。打开原网址强制刷新，核对页脚版本。GitHub 的手动运行按钮必须在工作流已出现在默认分支后才会出现。

## 后续更新

推送到 main 会自动测试、构建、发布。Cloudflare 控制台新版本可能显示为 API 上传，不必等待 Cloudflare Git 构建记录成功。

确认首次 Actions 部署成功后，可在 Cloudflare **era-ball → Settings → Build** 的 Git 构建配置中关闭自动构建或断开构建连接（按页面提供选项），避免同一提交由两个系统重复发布。只关闭 Git 构建集成，不删除 Worker、域名或资源。若有旧的 Git 构建排队，取消它们，防止稍后覆盖新部署。

仓库 secrets 缺失会在第一步显示缺失的名称，不会输出值；令牌权限错误应查看 Publish 步骤的 Cloudflare 错误。此工作流只授予 GitHub token 读取仓库内容权限，不写代码，不对 PR 部署，发布任务串行执行。
