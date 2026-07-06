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
    <a href="https://rtdf.dev" target="_blank">ウェブサイト</a>
    <span> | </span>
    <a href="https://demo.rtdf.dev" target="_blank">デモ</a>
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

# はじめに

[React](https://react.dev)、[Tailwind CSS](https://tailwindcss.com)、any-tdf デザインシステムをベースにしたモバイル Web コンポーネントライブラリです。

> Ready | Tiny | Design | Fast

RTDF は、React で可能な限り STDF のコンポーネント設計と API 形状に近づけています。Svelte 固有の機能は React props、React nodes、render functions、Provider-based configuration にマッピングされます。

# 特徴

- React 18/19、Tailwind CSS v4、TypeScript を完全サポート。
- 汎用、レイアウト、ナビゲーション、データ入力、表示、フィードバック向けのモバイルファーストなコンポーネント群。
- コンポーネントの動作、スタイル、アイコン、アニメーション、インタラクションを調整できる豊富な API。
- ダークモード、ランタイムテーマ切り替え、カスタムテーマ生成、42 個の any-tdf 共有テーマをサポート。
- 中国語と英語のドキュメント、コンポーネント例、API テーブル、FAQ、バージョンノートを提供。
- 60 以上の組み込みロケールによる国際化をサポート。
- コンポーネント、型、テーマ、ロケール、ユーティリティの専用サブパスを提供。
- create-rtdf により、Vite、React、Tailwind CSS v4、TypeScript、アイコン、テーマプリセットを素早く作成。
- @any-tdf/vite-plugin-svg-symbol による SVG Symbol ツールと、任意の Iconify 対応。
- VS Code 拡張機能と AI Skill パッケージにより RTDF 開発を効率化。

# はじめ方

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
# または
npm init rtdf@latest
# または
npx create-rtdf@latest
```
<!-- :: -->
<!-- yarn -->
```sh
yarn create rtdf@latest
```
<!-- ::: -->

# デモプレビュー

[demo.rtdf.dev](https://demo.rtdf.dev) にアクセスするか、QR コードをスキャンしてモバイルデモをプレビューしてください。

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://rtdf.dev/assets/qr/demo_en_dark.png">
  <img src="https://rtdf.dev/assets/qr/demo_en.png" width="220" height="220" >
</picture>

# クイック試用

StackBlitz の [RTDF Demo](https://stackblitz.com/github/any-tdf/demo-rtdf) で RTDF を素早く試すことができます。

# フィードバックとコミュニケーション

直接的で効果的なフィードバックとコミュニケーションには [GitHub Issues](https://github.com/any-tdf/rtdf/issues) の使用をお勧めします。コードの貢献も大歓迎です。以下のオプションからも選択できます。

- [QQ グループ](https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=U8ZlXJ3KVpTI9oZzs1jBnyWc3gVA0h6Y&authKey=ScWu0nU9g8BqNsC7o2eYkESwgVDVz9vzGNZEb17MrEAay9%2F7bTkXDiLJRIzo2vrg&noverify=0&group_code=581073686)
- [QQ Discord](https://pd.qq.com/s/fdd8incyr)
- [Discord](https://discord.gg/DMkHu8GGre)
- [Discussions](https://github.com/any-tdf/rtdf/discussions)

# 貢献者

<a href="https://github.com/any-tdf/rtdf/graphs/contributors">
  <img src="https://contrib.nn.ci/api?repo=any-tdf/rtdf" />
</a>

# スポンサー

<a href="https://github.com/sbscan" target="_blank">
  <img src="https://avatars.githubusercontent.com/sbscan" width="60" height="auto" style="border-radius:100%" >
</a>
<a href="https://github.com/MuGuiLin" target="_blank">
  <img src="https://avatars.githubusercontent.com/MuGuiLin" width="60" height="auto" style="border-radius:100%" >
</a>
<a href="https://github.com/yuedanlabs" target="_blank">
  <img src="https://avatars.githubusercontent.com/yuedanlabs" width="60" height="auto" style="border-radius:100%" >
</a>

# ライセンス

このプロジェクトは MIT ライセンスの下でライセンスされています。このオープンソースプロジェクトを自由にお楽しみいただき、貢献してください。

# スター履歴

<a href="https://github.com/any-tdf/rtdf">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=any-tdf/rtdf&type=Timeline&theme=dark" />
    <img alt="Star History Chart" width="100%" src="https://api.star-history.com/svg?repos=any-tdf/rtdf&type=Timeline" />
  </picture>
</a>
