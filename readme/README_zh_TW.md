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
    <a href="https://rtdf.dev" target="_blank">網站</a>
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

# 介紹

基於 [React](https://react.dev) 、 [Tailwind CSS](https://tailwindcss.com) 與 any-tdf 設計系統的移動 Web 元件庫。

> Ready | Tiny | Design | Fast

> 即用 | 輕量 | 設計 | 快速

RTDF 盡可能貼近 STDF 的元件設計和 API 形態。Svelte 特有能力會映射為 React props、React 節點、渲染函式和基於 Provider 的配置。

# 特性

- 完整支援 React 18/19 、 Tailwind CSS v4 與 TypeScript。
- 面向移動端，覆蓋通用、佈局、導航、資料錄入、資訊展示和回饋元件。
- API 豐富，可配置元件行為、樣式、圖示、動畫和互動細節。
- 支援暗模式、執行時主題切換、自訂主題生成和 42 個 any-tdf 內建主題。
- 提供中英文文件、元件範例、API 表格、FAQ 和版本說明。
- 支援國際化，已內建 60+ 個語言包。
- 支援按需引入，並提供元件、型別、主題、語言包和工具函式等子路徑匯出。
- 配套 create-rtdf 腳手架，快速建立 Vite、React、Tailwind CSS v4、TypeScript、圖示和主題預設專案。
- 配套 SVG Symbol 工具，支援 @any-tdf/vite-plugin-svg-symbol，也可選擇 Iconify。
- 配套 VS Code 外掛和 AI Skill，提升 RTDF 開發效率。

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

# 預覽 Demo

訪問 [demo.rtdf.dev](https://demo.rtdf.dev) ，或掃描 QR Code 訪問移動端 Demo：

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://rtdf.dev/assets/qr/demo_zh_dark.png">
  <img src="https://rtdf.dev/assets/qr/demo_zh.png" width="220" height="220" >
</picture>

# 快速嘗試

可以到 StackBlitz 的 [RTDF Demo](https://stackblitz.com/github/any-tdf/demo-rtdf) 快速嘗試 RTDF。

# 回饋與交流

推薦使用 [GitHub Issues](https://github.com/any-tdf/rtdf/issues) 進行直接有效地回饋與交流，貢獻程式碼就更好了。也可以選擇以下幾種方式：

- [QQ 群](https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=U8ZlXJ3KVpTI9oZzs1jBnyWc3gVA0h6Y&authKey=ScWu0nU9g8BqNsC7o2eYkESwgVDVz9vzGNZEb17MrEAay9%2F7bTkXDiLJRIzo2vrg&noverify=0&group_code=581073686)
- [QQ 頻道](https://pd.qq.com/s/fdd8incyr)
- [Discord](https://discord.gg/DMkHu8GGre)
- [Discussions](https://github.com/any-tdf/rtdf/discussions)

# 貢獻者

<a href="https://github.com/any-tdf/rtdf/graphs/contributors">
  <img src="https://contrib.nn.ci/api?repo=any-tdf/rtdf" />
</a>

# 贊助者

<a href="https://github.com/sbscan" target="_blank">
  <img src="https://avatars.githubusercontent.com/sbscan" width="60" height="auto" style="border-radius:100%" >
</a>
<a href="https://github.com/MuGuiLin" target="_blank">
  <img src="https://avatars.githubusercontent.com/MuGuiLin" width="60" height="auto" style="border-radius:100%" >
</a>
<a href="https://github.com/yuedanlabs" target="_blank">
  <img src="https://avatars.githubusercontent.com/yuedanlabs" width="60" height="auto" style="border-radius:100%" >
</a>

# 開源協議

本專案基於 MIT 協議，請自由地享受和參與開源。

# Star 歷史

<a href="https://github.com/any-tdf/rtdf">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=any-tdf/rtdf&type=Timeline&theme=dark" />
    <img alt="Star History Chart" width="100%" src="https://api.star-history.com/svg?repos=any-tdf/rtdf&type=Timeline" />
  </picture>
</a>
