# Pong（在 cangku 仓库）

这是一个用 HTML、CSS 和 JavaScript 实现的简单 Pong 游戏。玩家控制左侧挡板（鼠标或 ↑/↓ 键），右侧挡板由电脑控制。包含弹跳小球、挡板与墙壁碰撞检测以及计分板。

文件

- index.html — 游戏入口（已提交）
- style.css — 样式（已提交）
- script.js — 游戏逻辑（已提交）

如何在本地运行

1. 克隆仓库（如果尚未克隆）

   git clone https://github.com/lixiaopeter/cangku.git
   cd cangku

2. 使用简单静态服务器启动（推荐）

   - Python 3:  
     python3 -m http.server 8000

   - 然后在浏览器打开:  http://localhost:8000/index.html

3. 或者直接在浏览器中打开 index.html（双击），但某些浏览器对本地文件可能有限制，推荐使用静态服务器。

在 GitHub 上通过 Pages 发布（需仓库管理员或拥有相应权限）

说明：我已将 README.md 添加到仓库，但我当前无法直接替你在仓库设置中启用 GitHub Pages（该操作需要修改仓库设置的权限）。下面给出通过网页界面或命令行（使用个人访问令牌）启用 Pages 的步骤。

方法 A：通过仓库设置（网页界面，最简单）

1. 打开你的仓库页面： https://github.com/lixiaopeter/cangku
2. 点击上方的 "Settings"（设置）。
3. 左侧菜单选择 "Pages"（或页面设置）。
4. 在 "Build and deployment" 或 "Source" 部分，选择分支：`main`，目录选择 `/ (root)`，然后点击 "Save" 或 "Save and deploy"。
5. 保存后页面会显示站点的 URL（通常是 https://lixiaopeter.github.io/cangku/），等待几分钟即可访问。

方法 B：使用 GitHub REST API（需要你的个人访问令牌）

你可以在本地运行下面的 curl 命令（将 `YOUR_TOKEN` 替换为具有 `repo` 权限的个人访问令牌）：

curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.github.com/repos/lixiaopeter/cangku/pages \
  -d '{"source":{"branch":"main","path":"/"}}'

说明：如果仓库已有 Pages 配置，可能需要使用 `PUT` 或 `PATCH` 端点，具体请参考 GitHub API 文档：
https://docs.github.com/en/rest/pages

我已完成的工作

- 已将 README.md 添加到仓库根目录，包含本地运行步骤与 Pages 启用说明。

接下来我可以为你做的事（你选择其一）：

- 如果你希望，我可以提供一段更友好的 README（包含截图或 GIF）并提交更新。
- 我可以把启用 Pages 的 curl 命令封装成一个脚本供你在本地运行（仍需要你提供并在本地使用个人访问令牌）。
- 如果你把仓库的 Settings 权限授予我（不建议在聊天中传令牌），我可以替你启用 Pages（当前无法远程替你修改仓库设置）。

告诉我你想要哪一种，我会继续执行。
