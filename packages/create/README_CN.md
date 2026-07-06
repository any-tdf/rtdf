[English](https://github.com/any-tdf/rtdf/blob/main/packages/create/README.md)

# create-rtdf

一个用于创建新的 [RTDF](https://rtdf.dev) React 项目的命令行工具。

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

## 命令选项

| 命令 | 默认 | 描述 |
| --- | --- | --- |
| - | - | 项目名称，可以直接输入。 |
| `-t / --template` | `vrtt` | 要使用的模板。 |
| `-l / --language` | `en_US` | 提示语言。 |
| `-i / --icon-usage` | `any-tdf-icon` | 图标使用方式。 |
| `-m / --theme-mode` | `multi` | 主题模式。 |

## 模板预设

| 简写 | 模板 | 描述 |
| --- | --- | --- |
| `vrtt` | Vite & React & Tailwind CSS v4 & TypeScript | 默认 |
| `vrut` | Vite & React & UnoCSS & TypeScript | 仅 TypeScript |

## 图标使用方式预设

| 简写 | 描述 |
| --- | --- |
| `any-tdf-icon` | 使用 [@any-tdf/vite-plugin-svg-symbol](https://github.com/any-tdf/vite-plugin-svg-symbol) 插件管理图标。 |
| `iconify` | 使用 [Iconify](https://iconify.design) 图标集。Tailwind 使用 `@iconify/tailwind4`，UnoCSS 使用 `@unocss/preset-icons`。 |
| `both` | 同时使用 SVG Symbol 和 Iconify。 |
| `none` | 不使用任何工具管理图标，后续手动配置。 |

生成的示例项目也支持在主题面板中切换 RTDF 内置图标库。

## 主题模式预设

| 简写 | 描述 |
| --- | --- |
| `single` | 初始 ANYTDF 主题，后续可增加自定义主题。 |
| `multi` | 内置 3 个主题：ANYTDF、Sage 和 GoldWood。 |
| `all` | 全部 42 个内置主题。 |

## 许可证

本项目基于 MIT 许可证。
