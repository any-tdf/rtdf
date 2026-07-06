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
    <a href="https://rtdf.dev" target="_blank">Сайт</a>
    <span> | </span>
    <a href="https://demo.rtdf.dev" target="_blank">Демо</a>
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

# Введение

Мобильная web-библиотека компонентов на основе [React](https://react.dev), [Tailwind CSS](https://tailwindcss.com) и дизайн-системы any-tdf.

> Ready | Tiny | Design | Fast

RTDF максимально близко следует дизайну компонентов и форме API STDF в рамках возможностей React. Специфичные для Svelte возможности сопоставляются с React props, React nodes, render functions и конфигурацией на основе Provider.

# Возможности

- Полная поддержка React 18/19, Tailwind CSS v4 и TypeScript.
- Набор mobile-first компонентов для базовых элементов, layout, навигации, ввода данных, отображения и feedback.
- Богатые API для настройки поведения, стилей, иконок, анимации и взаимодействий.
- Темная тема, переключение тем во время выполнения, генерация пользовательских тем и 42 общие темы any-tdf.
- Документация на китайском и английском языках, примеры компонентов, таблицы API, FAQ и заметки о версиях.
- Интернационализация с более чем 60 встроенными локалями.
- Экспорты по подмаршрутам для компонентов, типов, тем, локалей и утилит.
- Scaffolding через create-rtdf для Vite, React, Tailwind CSS v4, TypeScript, иконок и пресетов тем.
- SVG Symbol tooling через @any-tdf/vite-plugin-svg-symbol и опциональная поддержка Iconify.
- Расширение VS Code и пакет AI Skill для ускорения разработки с RTDF.

# Начало работы

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
# или
npm init rtdf@latest
# или
npx create-rtdf@latest
```
<!-- :: -->
<!-- yarn -->
```sh
yarn create rtdf@latest
```
<!-- ::: -->

# Предпросмотр демо

Откройте [demo.rtdf.dev](https://demo.rtdf.dev) или отсканируйте QR-код, чтобы посмотреть мобильное демо.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://rtdf.dev/assets/qr/demo_en_dark.png">
  <img src="https://rtdf.dev/assets/qr/demo_en.png" width="220" height="220" >
</picture>

# Быстрая проба

Вы можете быстро попробовать RTDF в [RTDF Demo](https://stackblitz.com/github/any-tdf/demo-rtdf) на StackBlitz.

# Обратная связь и общение

Мы рекомендуем использовать [GitHub Issues](https://github.com/any-tdf/rtdf/issues) для прямой и эффективной обратной связи. Вклад в код также приветствуется. Также доступны следующие варианты:

- [QQ Group](https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=U8ZlXJ3KVpTI9oZzs1jBnyWc3gVA0h6Y&authKey=ScWu0nU9g8BqNsC7o2eYkESwgVDVz9vzGNZEb17MrEAay9%2F7bTkXDiLJRIzo2vrg&noverify=0&group_code=581073686)
- [QQ Discord](https://pd.qq.com/s/fdd8incyr)
- [Discord](https://discord.gg/DMkHu8GGre)
- [Discussions](https://github.com/any-tdf/rtdf/discussions)

# Участники

<a href="https://github.com/any-tdf/rtdf/graphs/contributors">
  <img src="https://contrib.nn.ci/api?repo=any-tdf/rtdf" />
</a>

# Спонсоры

<a href="https://github.com/sbscan" target="_blank">
  <img src="https://avatars.githubusercontent.com/sbscan" width="60" height="auto" style="border-radius:100%" >
</a>
<a href="https://github.com/MuGuiLin" target="_blank">
  <img src="https://avatars.githubusercontent.com/MuGuiLin" width="60" height="auto" style="border-radius:100%" >
</a>
<a href="https://github.com/yuedanlabs" target="_blank">
  <img src="https://avatars.githubusercontent.com/yuedanlabs" width="60" height="auto" style="border-radius:100%" >
</a>

# Лицензия

Этот проект распространяется по лицензии MIT. Используйте его свободно и участвуйте в развитии open-source проекта.

# История звезд

<a href="https://github.com/any-tdf/rtdf">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=any-tdf/rtdf&type=Timeline&theme=dark" />
    <img alt="Star History Chart" width="100%" src="https://api.star-history.com/svg?repos=any-tdf/rtdf&type=Timeline" />
  </picture>
</a>
