[简体中文](https://github.com/any-tdf/rtdf/blob/main/packages/create/README_CN.md)

# create-rtdf

A CLI for creating new [RTDF](https://rtdf.dev) React projects.

```sh
bun create rtdf@latest my-app
```

The quick command defaults to `vrtt`, `any-tdf-icon`, `multi`, and `bun`.

Create a Tailwind CSS v4 project:

```sh
bun create rtdf@latest my-app -t vrtt -l en_US -i both -m all
```

Create an UnoCSS project:

```sh
bun create rtdf@latest my-app -t vrut -l en_US -i both -m all
```

## Options

| Option | Default | Description |
| --- | --- | --- |
| - | - | Project name, passed directly. |
| `-t / --template` | `vrtt` | Template to use. |
| `-l / --language` | `en_US` | Prompt language. |
| `-i / --icon-usage` | `any-tdf-icon` | Icon usage mode. |
| `-m / --theme-mode` | `multi` | Theme mode. |

## Templates

| Short name | Template | Description |
| --- | --- | --- |
| `vrtt` | Vite & React & Tailwind CSS v4 & TypeScript | Default |
| `vrut` | Vite & React & UnoCSS & TypeScript | TypeScript only |

## Icon Usage

| Short name | Description |
| --- | --- |
| `any-tdf-icon` | Use [@any-tdf/vite-plugin-svg-symbol](https://github.com/any-tdf/vite-plugin-svg-symbol). |
| `iconify` | Use [Iconify](https://iconify.design) icon sets. Tailwind uses `@iconify/tailwind4`; UnoCSS uses `@unocss/preset-icons`. |
| `both` | Use both SVG Symbol and Iconify. |
| `none` | No icon solution. Configure manually later. |

The generated demo also supports switching RTDF built-in icon libraries from the theme panel.

## Theme Mode

| Short name | Description |
| --- | --- |
| `single` | Initial ANYTDF theme, add custom themes later. |
| `multi` | 3 built-in themes: ANYTDF, Sage, and GoldWood. |
| `all` | All 42 built-in themes. |

## License

MIT.
