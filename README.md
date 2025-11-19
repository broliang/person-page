# Liang Shuang - Academic Homepage

这是一个基于 React + Vite + Tailwind CSS 构建的个人学术主页。

## 主要特性

- **数据驱动**：所有简历信息存储在 `public/profile.json` 中，修改方便，无需重新编译代码（本地开发时）。
- **自动排序**：论文列表会自动根据年份从新到旧排序。
- **响应式设计**：完美适配手机端和桌面端展示。
- **GitHub Pages 部署**：集成了自动部署工作流。

## 本地开发

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 构建生产版本：
   ```bash
   npm run build
   ```

## 如何更新内容

只需修改 `public/profile.json` 文件中的 JSON 数据，推送到 GitHub 后，网页会自动更新。
