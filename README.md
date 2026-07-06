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
    <a href="https://rtdf.dev" target="_blank">Website</a>
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

# Introduction

Mobile web component library based on [React](https://react.dev), [Tailwind CSS](https://tailwindcss.com), and the any-tdf design system.

> Ready | Tiny | Design | Fast

RTDF follows the STDF component design and API shape as closely as React allows. Framework-specific Svelte features are mapped to React props, React nodes, render functions, and Provider-based configuration.

# Features

- Full support for React 18/19, Tailwind CSS v4, and TypeScript.
- Mobile-first component set covering general controls, layout, navigation, data entry, display, and feedback.
- Rich APIs for configuring component behavior, styling, icons, animation, and interaction details.
- Built-in dark mode, runtime theme switching, custom theme generation, and 42 shared any-tdf themes.
- Chinese and English documentation, component examples, API tables, FAQ pages, and version notes.
- Internationalization support with 60+ built-in locale objects.
- Tree-shakable package exports and dedicated subpaths for components, types, themes, locales, and utilities.
- Scaffolding with `create-rtdf` for Vite, React, Tailwind CSS v4, TypeScript, icons, and theme presets.
- SVG symbol tooling through `@any-tdf/vite-plugin-svg-symbol`, with optional Iconify support.
- VS Code extension and AI Skill package for faster RTDF development.

# Getting Started

Create a new RTDF project:

```sh
bun create rtdf@latest
```

Create a React, Vite, Tailwind CSS v4, TypeScript, Iconify, and multi-theme project:

```sh
bun create rtdf@latest my-app -t vrtt -l en_US -i iconify -m multi
```

Install RTDF in an existing React project:

```sh
bun add rtdf@3.0.0-alpha.0
```

Import the component styles once in your app entry:

```tsx
import 'rtdf/style.css';
```

Use components from the root entry:

```tsx
import { Button, ConfigProvider } from 'rtdf';
import { en_US } from 'rtdf/lang';

const App = () => (
	<ConfigProvider locale={en_US} theme="ANYTDF" mode="primary">
		<Button fill="solid">RTDF</Button>
	</ConfigProvider>
);
```

# Preview Demo

Visit [demo.rtdf.dev](https://demo.rtdf.dev) on a mobile browser, or scan the QR code to preview the mobile demo:

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://rtdf.dev/assets/qr/demo_en_dark.png">
  <img src="https://rtdf.dev/assets/qr/demo_en.png" width="220" height="220" >
</picture>

# Quick Try

You can quickly try RTDF on StackBlitz's [RTDF Demo](https://stackblitz.com/github/any-tdf/demo-rtdf).

# Feedback and Communication

We recommend using [GitHub Issues](https://github.com/any-tdf/rtdf/issues) for direct and effective feedback and communication. Contributions of code are also highly appreciated. You can also choose from the following options:

- [QQ Group](https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=U8ZlXJ3KVpTI9oZzs1jBnyWc3gVA0h6Y&authKey=ScWu0nU9g8BqNsC7o2eYkESwgVDVz9vzGNZEb17MrEAay9%2F7bTkXDiLJRIzo2vrg&noverify=0&group_code=581073686)
- [QQ Discord](https://pd.qq.com/s/fdd8incyr)
- [Discord](https://discord.gg/DMkHu8GGre)
- [Discussions](https://github.com/any-tdf/rtdf/discussions)

# Contributors

<a href="https://github.com/any-tdf/rtdf/graphs/contributors">
  <img src="https://contrib.nn.ci/api?repo=any-tdf/rtdf" />
</a>

# Sponsors

<a href="https://github.com/sbscan" target="_blank">
  <img src="https://avatars.githubusercontent.com/sbscan" width="60" height="auto" style="border-radius:100%" >
</a>
<a href="https://github.com/MuGuiLin" target="_blank">
  <img src="https://avatars.githubusercontent.com/MuGuiLin" width="60" height="auto" style="border-radius:100%" >
</a>
<a href="https://github.com/yuedanlabs" target="_blank">
  <img src="https://avatars.githubusercontent.com/yuedanlabs" width="60" height="auto" style="border-radius:100%" >
</a>

# License

This project is licensed under the MIT License. Feel free to enjoy and contribute to this open-source project.

# Star History

<a href="https://github.com/any-tdf/rtdf">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=any-tdf/rtdf&type=Timeline&theme=dark" />
    <img alt="Star History Chart" width="100%" src="https://api.star-history.com/svg?repos=any-tdf/rtdf&type=Timeline" />
  </picture>
</a>
