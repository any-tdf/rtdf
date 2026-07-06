# create-rtdf

`create-rtdf` 是用于创建 RTDF React 项目的脚手架命令。推荐使用：

```sh
bun create rtdf@latest my-app
```

快速创建默认等价于 `vrtt`、`any-tdf-icon`、`multi` 和 `bun`。

创建 Tailwind CSS v4 项目：

```sh
bun create rtdf@latest my-app -t vrtt -l zh_CN -i both -m all
```

创建 UnoCSS 项目：

```sh
bun create rtdf@latest my-app -t vrut -l zh_CN -i both -m all
```

## 模板预设

| 简写 | 模板 | 描述 |
| --- | --- | --- |
| vrtt | Vite & React & Tailwind CSS v4 & TypeScript | 默认 |
| vrut | Vite & React & UnoCSS & TypeScript | 仅 TypeScript |

## 命令选项

| 命令 | 默认 | 描述 |
| --- | --- | --- |
| - | - | 项目名称，可以直接输入。 |
| -t / --template | vrtt | 要使用的模板。 |
| -l / --language | en_US | 提示语言。 |
| -i / --icon-usage | any-tdf-icon | 图标使用方式。 |
| -m / --theme-mode | multi | 主题模式。 |

## 图标使用方式

| 简写 | 描述 |
| --- | --- |
| any-tdf-icon | 使用 `@any-tdf/vite-plugin-svg-symbol` 管理 SVG 图标。 |
| iconify | 使用 Iconify 图标集。Tailwind CSS v4 使用 `@iconify/tailwind4`，UnoCSS 使用 `@unocss/preset-icons`。 |
| both | 同时配置 SVG Symbol 和 Iconify。 |
| none | 不配置图标方案，后续自行接入。 |

生成的示例项目也支持在主题面板中切换 RTDF 内置图标库。

## 主题模式

| 简写 | 描述 |
| --- | --- |
| single | 只生成基础 ANYTDF 主题，后续可自行扩展。 |
| multi | 生成 ANYTDF、Sage、GoldWood 3 个内置主题。 |
| all | 生成全部 42 个内置主题。 |
