## Introduction

Thank you for using RTDF.

Below are guidelines for submitting feedback or code to RTDF. Please take a few minutes to read through this content before submitting an issue or PR to RTDF.

## Issue Guidelines

- When encountering a problem, please first confirm whether this issue has already been recorded or fixed in existing issues.
- When submitting an issue, please use concise language to describe the problem encountered, and include the environment and steps to reproduce the issue.

## Local Development

Before starting local development, please ensure your development environment has [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en) or [Bun](https://bun.sh) installed.

Debugging RTDF requires a project environment, for which we provide a simple Demo project. RTDF itself is not restricted by Node version, but since the Demo uses Vite for development, please ensure your Node.js version is >= 14.18+, refer to [Vite official website](https://vitejs.dev/guide/#scaffolding-your-first-vite-project).

After modifying the code and before submitting a PR, please ensure the code is formatted and passes code format checks. You can install relevant editor plugins or format through the command line.

Recommended installations:

- [pnpm](https://pnpm.io): Package management tool, not needed when using Bun.
- [ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets): React development plugin.
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) or [WebStorm Integration](https://www.jetbrains.com/help/webstorm/tailwind-css.html): Tailwind CSS development plugin.
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) or [WebStorm Integration](https://www.jetbrains.com/help/webstorm/eslint.html): Code format checking plugin.
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) or [WebStorm Integration](https://www.jetbrains.com/help/webstorm/prettier.html): Code formatting plugin.

Follow the steps below to quickly start RTDF Demo locally.

<!-- :::code-groups -->
<!-- pnpm -->
```sh
## 1. Clone the RTDF repository
git clone git@github.com:any-tdf/rtdf.git
cd rtdf

## 2. Debug RTDF
cd packages/rtdf
## Install dependencies
pnpm i
## Start Demo
pnpm dev
```
<!-- :: -->
<!-- npm -->
```sh
## 1. Clone the RTDF repository
git clone git@github.com:any-tdf/rtdf.git
cd rtdf

## 2. Debug RTDF
cd packages/rtdf
## Install dependencies
npm i
## Start Demo
npm run dev
```
<!-- :: -->
<!-- bun -->
```sh
## 1. Clone the RTDF repository
git clone git@github.com:any-tdf/rtdf.git
cd rtdf

## 2. Debug RTDF
cd packages/rtdf
## Install dependencies
bun i
## Start Demo
bun dev
```
<!-- :: -->
<!-- yarn -->
```sh
## 1. Clone the RTDF repository
git clone git@github.com:any-tdf/rtdf.git
cd rtdf

## 2. Debug RTDF
cd packages/rtdf
## Install dependencies
yarn
## Start Demo
yarn dev
```
<!-- ::: -->

After starting successfully, you can view the effect in the browser by opening `http://localhost:8887`, please switch the developer tools of the browser to the mobile mode.

You can modify the component source code in the `packages/rtdf/src/lib/components` directory and view the modification effect in real time. Note that VS Code and WebStorm both support jumping to the component source code when calling the component.

If you don't want to develop locally, you can choose to use StackBlitz for online simple debugging. Simply open [RTDF Demo](https://stackblitz.com/github/any-tdf/demo-rtdf) to start online debugging.

## Submit PR

If you are submitting your first Pull Request on GitHub, you can read the following two articles to learn:

- [First Contribution to Open Source](https://github.com/firstcontributions/first-contributions/blob/main/translations/README.zh-cn.md)
- [如何优雅地在 GitHub 上贡献代码](https://segmentfault.com/a/1190000000736629)

### Process

- Please first fork a [RTDF](https://github.com/any-tdf/rtdf) repository to your own repository, if you have already forked it, please sync the latest code from the main repository.
- Clone your repository to your local machine.
- Modify the component source code and verify it.
- (Optional) Supplement the Chinese and English documentation of this modification, the documentation is located in the `docs/mds/components` directory. Depending on the specific modification content, you may need to modify the api, FAQ, guide, version, etc. documents. For the modification of the version, please add the tag, refer to [RTDF Version tag](https://github.com/any-tdf/rtdf/blob/main/docs/mds/components/button/version.md?plain=1).
- Go to the `packages/rtdf` directory, execute `pnpm i` or `npm i` or `bun i` to install dependencies.
- Submit the modified content to your repository, then submit a Pull Request to the main repository.
- Pull Request will be merged into the main repository after being reviewed, and a new version will be released.

### Notes

When submitting a Pull Request, please note the following:

- Keep your PR small, generally one PR solves a single component file, solves a single problem, or adds a single function, so that it is easier to review.
- When adding a new component or modifying an existing component, remember to verify it in the Demo to ensure the stability of the code.
- Please add a suitable description in the PR, if there is an associated Issue, please note it.
