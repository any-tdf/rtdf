# create-rtdf Scaffolding

Use this reference when creating or modifying RTDF scaffold behavior.

## Recommended Command

```sh
bun create rtdf@latest
```

Direct project creation:

```sh
bun create rtdf@latest my-app
```

Direct creation with options:

```sh
bun create rtdf@latest my-app -t vrtt -l zh_CN -i iconify -m multi
```

## Options

| Option | Default | Meaning |
| --- | --- | --- |
| positional | - | Project name |
| `-t`, `--template` | `vrtt` | Template preset |
| `-l`, `--language` | `en_US` | Prompt language |
| `-i`, `--icon-usage` | `any-tdf-icon` | Icon setup |
| `-m`, `--theme-mode` | `multi` | Theme mode |

## Template Presets

| Preset | Template | Status |
| --- | --- | --- |
| `vrtt` | Vite + React + Tailwind + TypeScript | Ready |
| `vrut` | Vite + React + UnoCSS + TypeScript | Ready |

## Icon Usage Presets

| Preset | Meaning |
| --- | --- |
| `any-tdf-icon` | Use `@any-tdf/vite-plugin-svg-symbol` for SVG symbol sprites |
| `iconify` | Use Iconify with Tailwind CSS 4 |
| `both` | Configure both SVG symbol sprites and Iconify |
| `none` | Leave icon setup manual |

## Theme Mode Presets

| Preset | Meaning |
| --- | --- |
| `single` | Initial `ANYTDF` theme, with custom themes added later |
| `multi` | Built-in `ANYTDF`, `Sage`, and `GoldWood` themes |
| `all` | All 42 built-in themes |
