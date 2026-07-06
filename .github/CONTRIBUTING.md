[简体中文](https://rtdf.dev/guide/contribution?lang=zh_CN)

## Introduction

Thank you for using RTDF.

Below are guidelines for submitting feedback or code to RTDF. Before submitting an issue or PR to RTDF, please take a few minutes to read the following.

## Issue Guidelines

- When encountering an issue, please first confirm whether the issue has already been recorded or fixed.
- When submitting an issue, please describe the issue briefly and add the environment and reproduction steps.

## Local Development

Before local development, please make sure that [Git](https://git-scm.com), [Node.js](https://nodejs.org/en), and [Bun](https://bun.sh) are installed in your development environment.

RTDF uses React, Vite, Tailwind CSS v4, and TypeScript. Use Bun for package installation and project scripts.

```sh
## 1. Clone the RTDF repository and enter it
git clone git@github.com:any-tdf/rtdf.git
cd rtdf

## 2. Enter the RTDF package
cd packages/rtdf

## 3. Install dependencies
bun i

## 4. Start the demo
bun dev
```

After startup, open `http://localhost:8887` in the browser and switch the developer tools to mobile mode.

You can modify component source code in `packages/rtdf/src/lib/components` and view the result in real time.

## Verification

Before submitting a PR, please run the checks that match your change:

```sh
bun run format
bun run lint
bun run build
```

For component, route, SSR, or documentation changes, also run the relevant verification scripts from `packages/rtdf/package.json`.

## Submitting PR

If you are submitting a Pull Request on GitHub for the first time, you can read the following articles:

- [First Contributions](https://github.com/firstcontributions/first-contributions/blob/main/translations/README.zh-cn.md)
- [How to contribute code elegantly on GitHub](https://segmentfault.com/a/1190000000736629)

### Process

- Fork [RTDF](https://github.com/any-tdf/rtdf) to your own repository. If you have already forked it, sync the latest code from the main repository.
- Clone your repository to your local machine.
- Modify the component source code and verify it in the demo.
- Optionally supplement the Chinese and English documentation for this modification. Documentation is located in `docs/mds/components`.
- Go to `packages/rtdf` and run `bun i` to install dependencies.
- Format and check the code.
- Commit your changes to your repository and submit a Pull Request to the main repository.
- The Pull Request will be merged after review, and a new version will be released later when appropriate.

### Notes

- Keep your PR small enough. In general, one PR should solve a single problem or add a single feature.
- When adding or modifying components, verify the behavior in the demo.
- Add a suitable PR description. If there is a related issue, link it.
