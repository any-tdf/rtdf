<div align="center">

  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://rtdf.dev/assets/favicon_logo_dark/android-chrome-512x512.png">
    <img src="https://rtdf.dev/assets/favicon_logo/android-chrome-512x512.png" alt="logo" width="120" height="auto" />
  </picture>

  <h1>RTDF</h1>

![](https://img.shields.io/badge/-React-%2361dafb?logo=react&logoColor=001319)
![](https://img.shields.io/badge/-Tailwind%204-%2300a6f4?logo=tailwindcss&logoColor=ffffff)
![](https://img.shields.io/badge/-TypeScript-%233178c6?logo=typescript&logoColor=ffffff)

[![npm](https://img.shields.io/npm/v/rtdf?logo=npm&label=rtdf&style=for-the-badge&color=aeb5f4&logoColor=DCE4FD&labelColor=010319)](https://www.npmjs.com/package/rtdf)
[![npm](https://img.shields.io/npm/v/create-rtdf?logo=npm&label=create&style=for-the-badge&color=ebb2ba&logoColor=FBDDDD&labelColor=190104)](https://www.npmjs.com/package/create-rtdf)
[![npm](https://img.shields.io/npm/v/rtdf-skill?logo=npm&label=skill&style=for-the-badge&color=c7f292&logoColor=F0FCD6&labelColor=0E1901)](https://www.npmjs.com/package/rtdf-skill)
[![npm](https://img.shields.io/npm/v/@any-tdf/vite-plugin-svg-symbol?logo=npm&label=icon&style=for-the-badge&color=8cf2be&logoColor=D5FCE3&labelColor=01190C)](https://www.npmjs.com/package/@any-tdf/vite-plugin-svg-symbol)
[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/RTDF.rtdf-vscode-extension?label=extension&style=for-the-badge&color=fda0f0&logoColor=fda0f0&labelColor=12020f)](https://marketplace.visualstudio.com/items?itemName=RTDF.rtdf-vscode-extension)
[![GitHub stars](https://img.shields.io/github/stars/any-tdf/rtdf?logo=github&label=star&style=for-the-badge&color=A1DAD7&logoColor=D9F8F2&labelColor=011918)](https://github.com/any-tdf/rtdf)
[![npm license](https://img.shields.io/npm/l/rtdf?logo=github&style=for-the-badge&color=B9C46A&logoColor=F3F3CB&labelColor=161901)](https://www.npmjs.com/package/rtdf)

  <h3>
    <a href="https://rtdf.dev" target="_blank">网站</a>
    <span> | </span>
    <a href="https://demo.rtdf.dev" target="_blank">Demo</a>
  </h3>
  <p>
    <a href="https://github.com/any-tdf/rtdf/blob/main/README.md" target="_blank">English</a>
    <span> • </span>
    <a href="https://github.com/any-tdf/rtdf/blob/main/readme/README_zh_CN.md" target="_blank">简体中文</a>
    <span> • </span>
    <a href="https://github.com/any-tdf/rtdf/blob/main/readme/README_zh_TW.md" target="_blank">繁體中文</a>
    <span> • </span>
    <a href="https://github.com/any-tdf/rtdf/blob/main/readme/README_ja_JP.md" target="_blank">日本語</a>
    <span> • </span>
    <a href="https://github.com/any-tdf/rtdf/blob/main/readme/README_ko_KR.md" target="_blank">한국어</a>
    <span> • </span>
    <a href="https://github.com/any-tdf/rtdf/blob/main/readme/README_es_ES.md" target="_blank">Español</a>
    <span> • </span>
    <a href="https://github.com/any-tdf/rtdf/blob/main/readme/README_ru_RU.md" target="_blank">Русский</a>
    <span> • </span>
    <a href="https://github.com/any-tdf/rtdf/blob/main/readme/README_fr_FR.md" target="_blank">Français</a>
    <span> • </span>
    <a href="https://github.com/any-tdf/rtdf/blob/main/readme/README_de_DE.md" target="_blank">Deutsch</a>
    <span> • </span>
    <a href="https://github.com/any-tdf/rtdf/blob/main/readme/README_it_IT.md" target="_blank">Italiano</a>
  </p>
</div>

# 介绍

基于 [React](https://react.dev) 、 [Tailwind CSS](https://tailwindcss.com) 与 any-tdf 设计系统的移动 Web 组件库。

> Ready | Tiny | Design | Fast

> 即用 | 轻量 | 设计 | 快速

RTDF 尽可能贴近 STDF 的组件设计和 API 形态。Svelte 特有能力会映射为 React props、React 节点、渲染函数和基于 Provider 的配置。

# 特性

- 完整支持 React 18/19 、 Tailwind CSS v4 与 TypeScript。
- 面向移动端，覆盖通用、布局、导航、数据录入、信息展示和反馈组件。
- API 丰富，可配置组件行为、样式、图标、动画和交互细节。
- 支持暗模式、运行时主题切换、自定义主题生成和 42 个 any-tdf 内置主题。
- 提供中英文文档、组件示例、API 表格、FAQ 和版本说明。
- 支持国际化，已内置 60+ 个语言包。
- 支持按需引入，并提供组件、类型、主题、语言包和工具函数等子路径导出。
- 配套 create-rtdf 脚手架，快速创建 Vite、React、Tailwind CSS v4、TypeScript、图标和主题预设项目。
- 配套 SVG Symbol 工具，支持 @any-tdf/vite-plugin-svg-symbol，也可选择 Iconify。
- 配套 VS Code 插件和 AI Skill，提升 RTDF 开发效率。

# 快速上手

<!-- :::code-groups -->
<!-- bun -->
```sh
bun create rtdf@latest
```
<!-- :: -->
<!-- pnpm -->
```sh
pnpm create rtdf@latest
```
<!-- :: -->
<!-- npm -->
```sh
npm create rtdf@latest
# 或
npm init rtdf@latest
# 或
npx create-rtdf@latest
```
<!-- :: -->
<!-- yarn -->
```sh
yarn create rtdf@latest
```
<!-- ::: -->

# 预览 Demo

访问 [demo.rtdf.dev](https://demo.rtdf.dev) ，或扫描二维码访问移动端 Demo：

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://rtdf.dev/assets/qr/demo_zh_dark.png">
  <img src="https://rtdf.dev/assets/qr/demo_zh.png" width="220" height="220" >
</picture>

# 快速尝试

可以到 StackBlitz 的 [RTDF Demo](https://stackblitz.com/github/any-tdf/demo-rtdf) 快速尝试 RTDF。

# 反馈与交流

推荐使用 [GitHub Issues](https://github.com/any-tdf/rtdf/issues) 进行直接有效地反馈与交流，贡献代码就更好了。也可以选择以下几种方式：

- [QQ 群](https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=U8ZlXJ3KVpTI9oZzs1jBnyWc3gVA0h6Y&authKey=ScWu0nU9g8BqNsC7o2eYkESwgVDVz9vzGNZEb17MrEAay9%2F7bTkXDiLJRIzo2vrg&noverify=0&group_code=581073686)
- [QQ 频道](https://pd.qq.com/s/fdd8incyr)
- [Discord](https://discord.gg/DMkHu8GGre)
- [Discussions](https://github.com/any-tdf/rtdf/discussions)

# 贡献者

<a href="https://github.com/any-tdf/rtdf/graphs/contributors">
  <img src="https://contrib.nn.ci/api?repo=any-tdf/rtdf" />
</a>

# 赞助者

<a href="https://github.com/sbscan" target="_blank">
  <img src="https://avatars.githubusercontent.com/sbscan" width="60" height="auto" style="border-radius:100%" >
</a>
<a href="https://github.com/MuGuiLin" target="_blank">
  <img src="https://avatars.githubusercontent.com/MuGuiLin" width="60" height="auto" style="border-radius:100%" >
</a>
<a href="https://github.com/yuedanlabs" target="_blank">
  <img src="https://avatars.githubusercontent.com/yuedanlabs" width="60" height="auto" style="border-radius:100%" >
</a>

# 开源协议

本项目基于 MIT 协议，请自由地享受和参与开源。

# Star 历史

<a href="https://github.com/any-tdf/rtdf">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=any-tdf/rtdf&type=Timeline&theme=dark" />
    <img alt="Star History Chart" width="100%" src="https://api.star-history.com/svg?repos=any-tdf/rtdf&type=Timeline" />
  </picture>
</a>
