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
    <a href="https://rtdf.dev" target="_blank">Site web</a>
    <span> | </span>
    <a href="https://demo.rtdf.dev" target="_blank">Démo</a>
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

Bibliothèque de composants web mobiles basée sur [React](https://react.dev), [Tailwind CSS](https://tailwindcss.com) et le design system any-tdf.

> Ready | Tiny | Design | Fast

RTDF suit aussi fidèlement que possible le design des composants et la forme des API de STDF dans le cadre de React. Les fonctionnalités propres à Svelte sont mappées vers des props React, des nœuds React, des fonctions de rendu et une configuration basée sur Provider.

# Fonctionnalités

- Support complet de React 18/19, Tailwind CSS v4 et TypeScript.
- Ensemble de composants mobile-first pour contrôles généraux, layout, navigation, saisie de données, affichage et feedback.
- APIs riches pour configurer le comportement, les styles, les icônes, les animations et les interactions.
- Mode sombre, changement de thème au runtime, génération de thèmes personnalisés et 42 thèmes partagés any-tdf.
- Documentation en chinois et en anglais, exemples de composants, tableaux d'API, FAQ et notes de version.
- Internationalisation avec plus de 60 locales intégrées.
- Exports par sous-chemins pour composants, types, thèmes, locales et utilitaires.
- Scaffolding avec create-rtdf pour Vite, React, Tailwind CSS v4, TypeScript, icônes et préréglages de thème.
- Outils SVG Symbol via @any-tdf/vite-plugin-svg-symbol et support optionnel d'Iconify.
- Extension VS Code et package AI Skill pour accélérer le développement RTDF.

# Démarrage

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
# ou
npm init rtdf@latest
# ou
npx create-rtdf@latest
```
<!-- :: -->
<!-- yarn -->
```sh
yarn create rtdf@latest
```
<!-- ::: -->

# Aperçu de la démo

Visitez [demo.rtdf.dev](https://demo.rtdf.dev) ou scannez le QR code pour accéder à la démo mobile.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://rtdf.dev/assets/qr/demo_en_dark.png">
  <img src="https://rtdf.dev/assets/qr/demo_en.png" width="220" height="220" >
</picture>

# Essai rapide

Vous pouvez essayer rapidement RTDF sur [RTDF Demo](https://stackblitz.com/github/any-tdf/demo-rtdf) de StackBlitz.

# Retours et échanges

Nous recommandons d'utiliser [GitHub Issues](https://github.com/any-tdf/rtdf/issues) pour des retours et échanges directs et efficaces. Les contributions de code sont également très appréciées. Vous pouvez aussi choisir parmi les options suivantes :

- [Groupe QQ](https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=U8ZlXJ3KVpTI9oZzs1jBnyWc3gVA0h6Y&authKey=ScWu0nU9g8BqNsC7o2eYkESwgVDVz9vzGNZEb17MrEAay9%2F7bTkXDiLJRIzo2vrg&noverify=0&group_code=581073686)
- [QQ Discord](https://pd.qq.com/s/fdd8incyr)
- [Discord](https://discord.gg/DMkHu8GGre)
- [Discussions](https://github.com/any-tdf/rtdf/discussions)

# Contributeurs

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

# Licence

Ce projet est sous licence MIT. N'hésitez pas à profiter de ce projet open source et à y contribuer.

# Historique des étoiles

<a href="https://github.com/any-tdf/rtdf">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=any-tdf/rtdf&type=Timeline&theme=dark" />
    <img alt="Star History Chart" width="100%" src="https://api.star-history.com/svg?repos=any-tdf/rtdf&type=Timeline" />
  </picture>
</a>
