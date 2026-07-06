# create-rtdf

`create-rtdf` is the scaffolding command for creating RTDF React projects. The recommended command is:

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

## Template Presets

| Short name | Template | Description |
| --- | --- | --- |
| vrtt | Vite & React & Tailwind CSS v4 & TypeScript | Default |
| vrut | Vite & React & UnoCSS & TypeScript | TypeScript only |

## Options

| Option | Default | Description |
| --- | --- | --- |
| - | - | Project name, passed directly. |
| -t / --template | vrtt | Template to use. |
| -l / --language | en_US | Prompt language. |
| -i / --icon-usage | any-tdf-icon | Icon usage mode. |
| -m / --theme-mode | multi | Theme mode. |

## Icon Usage

| Short name | Description |
| --- | --- |
| any-tdf-icon | Use `@any-tdf/vite-plugin-svg-symbol` for SVG symbols. |
| iconify | Use Iconify icon sets. Tailwind CSS v4 uses `@iconify/tailwind4`; UnoCSS uses `@unocss/preset-icons`. |
| both | Configure both SVG Symbol and Iconify. |
| none | Do not configure an icon solution. Configure it later. |

The generated demo also supports switching RTDF built-in icon libraries from the theme panel.

## Theme Mode

| Short name | Description |
| --- | --- |
| single | Generate only the baseline ANYTDF theme. |
| multi | Generate the ANYTDF, Sage, and GoldWood built-in themes. |
| all | Generate all 42 built-in themes. |
