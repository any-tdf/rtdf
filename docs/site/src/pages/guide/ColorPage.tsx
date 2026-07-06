import { useMemo } from 'react';
import { generateColorScale, themes } from 'rtdf/theme';
import { getContrastRatio, parseOklch } from 'rtdf/utils';
import ModeSwitch from '../../components/ModeSwitch';
import ThemeSwitch from '../../components/ThemeSwitch';
import { colorObjToArr, getOklchOpacity } from '../../utils';
import { useAppContext } from '../../store/appStore';
import { defaultThemeName, normalizeThemeName } from '../../utils/theme';

type ColorScale = Record<string, string> & { default: string };

const opacityList = [0.05, 0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 0.95];

const grayList = [
	{ key: 'gray-50', color: 'oklch(0.961 0 0)' },
	{ key: 'gray-100', color: 'oklch(0.925 0 0)' },
	{ key: 'gray-200', color: 'oklch(0.845 0 0)' },
	{ key: 'gray-300', color: 'oklch(0.767 0 0)' },
	{ key: 'gray-400', color: 'oklch(0.683 0 0)' },
	{ key: 'gray-500', color: 'oklch(0.6 0 0)' },
	{ key: 'gray-600', color: 'oklch(0.51 0 0)' },
	{ key: 'gray-700', color: 'oklch(0.42 0 0)' },
	{ key: 'gray-800', color: 'oklch(0.321 0 0)' },
	{ key: 'gray-900', color: 'oklch(0.218 0 0)' },
	{ key: 'gray-950', color: 'oklch(0.159 0 0)' }
];

const extendList = [
	{ color: 'oklch(0.6 0.2 250)', alias: 'blue' },
	{ color: 'oklch(0.6 0.2 300)', alias: 'purple' },
	{ color: 'oklch(0.7 0.18 50)', alias: 'orange' },
	{ color: 'oklch(0.7 0.15 190)', alias: 'cyan' }
];

const parseOklchSafe = (color: string) => parseOklch(color) ?? { l: 0.5, c: 0.15, h: 0 };

const formatOklchValue = (value: string) => {
	const num = Number(value);
	if (!Number.isFinite(num)) return value;
	return num.toFixed(3).replace(/\.?0+$/, '');
};

const formatOklch = (color: string) => {
	const match = color.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
	if (!match) return color;
	return `oklch(${formatOklchValue(match[1])} ${formatOklchValue(match[2])} ${formatOklchValue(match[3])})`;
};

const buildColorScale = (baseColor: string): ColorScale => {
	const scale = generateColorScale(baseColor);
	return {
		50: formatOklch(scale[50]),
		100: formatOklch(scale[100]),
		200: formatOklch(scale[200]),
		300: formatOklch(scale[300]),
		400: formatOklch(scale[400]),
		500: formatOklch(scale[500]),
		700: formatOklch(scale[700]),
		800: formatOklch(scale[800]),
		900: formatOklch(scale[900]),
		950: formatOklch(scale[950]),
		default: formatOklch(scale[600])
	};
};

const generateBgColors = (primaryColor: string, darkColor: string) => {
	const p = parseOklchSafe(primaryColor);
	const d = parseOklchSafe(darkColor);
	return {
		base: `oklch(0.967 ${(p.c * 0.05).toFixed(4)} ${p.h.toFixed(1)})`,
		surface: `oklch(0.985 0.005 ${d.h.toFixed(1)})`,
		overlay: `oklch(0.955 0.005 ${d.h.toFixed(1)})`,
		highlight: `oklch(0.98 ${(p.c * 0.03).toFixed(4)} ${p.h.toFixed(1)})`,
		baseDark: `oklch(0.15 ${(d.c * 0.08).toFixed(4)} ${d.h.toFixed(1)})`,
		surfaceDark: `oklch(0.22 ${(d.c * 0.06).toFixed(4)} ${((d.h + 15) % 360).toFixed(1)})`,
		overlayDark: `oklch(0.19 ${(d.c * 0.05).toFixed(4)} ${d.h.toFixed(1)})`,
		highlightDark: `oklch(0.08 ${(d.c * 0.04).toFixed(4)} ${d.h.toFixed(1)})`
	};
};

const generateTextColors = (primaryColor: string, darkColor: string) => {
	const p = parseOklchSafe(primaryColor);
	const d = parseOklchSafe(darkColor);
	return {
		primary: `oklch(0.144 ${(p.c * 0.05).toFixed(3)} ${p.h.toFixed(1)})`,
		dark: `oklch(0.917 ${(d.c * 0.25).toFixed(3)} ${d.h.toFixed(1)})`,
		onPrimary: `oklch(0.883 ${(d.c * 0.28).toFixed(3)} ${d.h.toFixed(1)})`,
		onDark: `oklch(0.189 ${(p.c * 0.17).toFixed(3)} ${p.h.toFixed(1)})`
	};
};

const getContrastTextColor = (color: string) => {
	const background = parseOklch(color);
	if (!background) return '#000';
	const black = { l: 0.08, c: 0, h: 0 };
	const white = { l: 0.98, c: 0, h: 0 };
	const blackRatio = getContrastRatio(black, background);
	const whiteRatio = getContrastRatio(white, background);
	return blackRatio >= whiteRatio ? '#000' : '#fff';
};

const ColorScaleCard = ({ title, colors }: { title: string; colors: ColorScale }) => (
	<div className="flex flex-1 flex-col justify-between rounded-sm bg-white text-sm">
		{colorObjToArr(colors).map((item, index) => (
			<div
				key={`${title}-${item.key}`}
				className="p-4 transition hover:scale-105 hover:rounded-sm"
				style={{ backgroundColor: item.value, color: getContrastTextColor(item.value) }}
			>
				<div className="flex items-center justify-between gap-4">
					<div className="flex-1 text-left font-bold">{title}{index === 6 ? '' : `-${item.key}`}</div>
					<div className="text-right">{item.value}</div>
				</div>
			</div>
		))}
	</div>
);

const OpacityCard = ({ title, color }: { title: string; color: string }) => (
	<div className="flex flex-1 flex-col justify-between rounded-sm text-black">
		{opacityList.map((opacity) => {
			const colorValue = getOklchOpacity(color, opacity);
			return (
				<div key={`${title}-${opacity}`} className="p-2 transition hover:scale-105 hover:rounded-sm" style={{ backgroundColor: colorValue }}>
					<div className="flex items-center justify-between gap-2 text-sm">
						<div className="rounded-sm bg-white px-2 py-1">{title}/{opacity * 100}</div>
						<div className="rounded-sm bg-white px-2 py-1 text-right">{colorValue}</div>
					</div>
				</div>
			);
		})}
	</div>
);

const ColorBox = ({
	title,
	color,
	textColor = 'currentColor',
	className = ''
}: {
	title: string;
	color: string;
	textColor?: string;
	className?: string;
}) => (
	<div className={`flex h-24 flex-1 flex-col justify-between rounded-sm p-2 ${className}`} style={{ backgroundColor: color, color: textColor }}>
		<div className="font-bold">{title}</div>
		<div className="break-all text-sm">{color}</div>
	</div>
);

const NeutralColumn = ({ tone }: { tone: 'black' | 'white' }) => (
	<div className="transparent-background flex flex-1 flex-col justify-between rounded-sm text-sm text-black">
		{[0.5, 1, 2, 2.5, 3, 4, 5, 6, 7, 7.5, 8, 9, 9.5].map((value) => {
			const opacity = value / 10;
			const color = tone === 'black' ? `oklch(0 0 0 / ${opacity})` : `oklch(1 0 0 / ${opacity})`;
			return (
				<div key={`${tone}-${value}`} className="p-2 transition hover:scale-105 hover:rounded-sm" style={{ backgroundColor: color }}>
					<div className="flex items-center justify-between gap-2">
						<div className="rounded-sm bg-white px-2 py-1 text-left">{tone}/{value * 10}</div>
						<div className="rounded-sm bg-white px-2 py-1 text-right">{color}</div>
					</div>
				</div>
			);
		})}
		<div className="p-2 transition hover:scale-105 hover:rounded-sm" style={{ backgroundColor: `oklch(${tone === 'black' ? '0' : '1'} 0 0)` }}>
			<div className="flex items-center justify-between gap-2">
				<div className="rounded-sm bg-white px-2 py-1 text-left">{tone}</div>
				<div className="rounded-sm bg-white px-2 py-1 text-right">oklch({tone === 'black' ? '0' : '1'} 0 0)</div>
			</div>
		</div>
	</div>
);

const ColorPage = () => {
	const { lang, isWideScreen, currentColor } = useAppContext();
	const isZh = lang === 'zh_CN';
	const defaultTheme = themes.find((theme) => theme.name === defaultThemeName) || themes[0];
	const selectedTheme = useMemo(() => themes.find((theme) => theme.name === normalizeThemeName(currentColor)) || defaultTheme, [currentColor, defaultTheme]);
	const primaryColors = useMemo(() => buildColorScale(selectedTheme['color-primary']), [selectedTheme]);
	const darkColors = useMemo(() => buildColorScale(selectedTheme['color-dark']), [selectedTheme]);
	const bgColors = useMemo(() => generateBgColors(selectedTheme['color-primary'], selectedTheme['color-dark']), [selectedTheme]);
	const textColors = useMemo(() => generateTextColors(selectedTheme['color-primary'], selectedTheme['color-dark']), [selectedTheme]);

	const stateColor = {
		success: selectedTheme['color-success'],
		warning: selectedTheme['color-warning'],
		error: selectedTheme['color-error'],
		info: selectedTheme['color-info']
	};

	return (
		<article
			className={`prose dark:prose-invert prose-strong:text-primary dark:prose-strong:text-dark mx-auto pb-8 ${
				isWideScreen ? 'max-w-full' : 'max-w-7xl'
			}`}
		>
			<blockquote>
				{isZh ? 'RTDF 跟随 Tailwind CSS v4 推荐使用 OKLCH 颜色模式。' : 'RTDF follows Tailwind CSS v4 recommendation to use the OKLCH color mode.'}
			</blockquote>
			<div className="mb-4 text-xs">
				{isZh ? (
					<>
						切换亮暗模式，选择下列内置主题可查看配色。到<a href="/guide/generator" target="_blank" rel="noreferrer">主题生成器</a>
						可快速配置颜色系统并生成配置文件。具体使用方法请参考<a href="/guide/theme" target="_blank" rel="noreferrer">主题配置</a>。
					</>
				) : (
					<>
						Switch the light and dark mode, select the built-in theme to view the color. To <a href="/guide/generator" target="_blank" rel="noreferrer">Theme Generator</a> quickly configure the color system and generate the configuration file. For specific usage methods, please refer to <a href="/guide/theme" target="_blank" rel="noreferrer">Theme Configuration</a>.
					</>
				)}
			</div>
			<div className="inline-flex items-center gap-4">
				<ModeSwitch />
			</div>
			<div className="flex items-center gap-4">
				<ThemeSwitch />
			</div>
			<h2>{isZh ? '概述' : 'Overview'}</h2>
			<p>
				{isZh
					? '使用合理的颜色系统，可以使整个应用配色更加统一和美观。借助 Tailwind 的配置，可以更加方便地实现这一功能，当然也包括暗模式。'
					: "Use a reasonable color system to make the entire application more unified and beautiful. With Tailwind's configuration, this function can be implemented more conveniently, including the dark mode."}
			</p>
			<p>
				{isZh
					? 'RTDF 颜色系统包含主题色、功能色、中性色、扩展色四个部分。其中主题色和功能色是必须的；中性色一般使用默认配置即可；扩展色可根据实际情况自行添加。'
					: 'RTDF color system includes four parts: theme color, functional color, neutral color, and extended color. Theme color and functional color are required; neutral color generally uses the default configuration; extended color can be added according to actual circumstances.'}
			</p>
			<blockquote>
				{isZh
					? '颜色有别于技术，是一种主观、感性、难量化的事物，所以颜色的搭配没有好坏之分，只有适合不适合。'
					: 'Color is different from technology, it is a subjective, emotional, and difficult to quantify thing, so there is no good or bad in color combination, only whether it is suitable or not.'}
			</blockquote>
			<h2>{isZh ? '主题色' : 'Theme Color'}</h2>
			<p>
				{isZh
					? '主题色是应用中最核心、最高频使用的颜色，它可能用于强调信息、引导操作，并决定应用整体的颜色基调和配色风格。'
					: 'Theme color is the most core and frequently used color in the application. It may emphasize information, guide operations, and determine the color tone and color scheme of the application.'}
			</p>
			<div className="justify-between md:flex md:space-x-8">
				<ColorBox title={isZh ? 'primary（亮模式）' : 'primary (Light Mode)'} color={primaryColors.default} textColor="var(--color-text-on-primary)" className="h-32 p-4 text-xl" />
				<ColorBox title={isZh ? 'dark（暗模式）' : 'dark (Dark Mode)'} color={darkColors.default} textColor="var(--color-text-on-dark)" className="mt-4 h-32 p-4 text-xl md:mt-0" />
			</div>
			<h3>{isZh ? '梯度色板' : 'Gradient Color Palette'}</h3>
			<p>
				{isZh
					? 'RTDF 参照 Tailwind 的调色板命名规则，使用内置算法动态地将主题色计算出 11 种颜色组成梯度色板。其中 600 号色作为默认颜色。'
					: "RTDF refers to Tailwind's color palette naming rules and uses a built-in algorithm to calculate the theme color into 11 colors to form a gradient color palette. The 600th color is the default color."}
			</p>
			<div className="justify-between space-y-8 md:flex md:space-x-8 md:space-y-0">
				<ColorScaleCard title="primary" colors={primaryColors} />
				<ColorScaleCard title="dark" colors={darkColors} />
			</div>
			<h3>{isZh ? '透明度' : 'Opacity'}</h3>
			<p>
				{isZh
					? '某些应用场景中，需要使用到主题色的透明度。注意这与上述梯度色板的差异。'
					: 'In some application scenarios, you need to use the opacity of the theme color. Note the difference from the gradient color palette above.'}
			</p>
			<div className="transparent-background justify-between space-y-8 md:flex md:space-x-8 md:space-y-0">
				<OpacityCard title="primary" color={primaryColors.default} />
				<OpacityCard title="dark" color={darkColors.default} />
			</div>
			<h3>{isZh ? '背景色' : 'Background Colors'}</h3>
			<p>
				{isZh
					? 'RTDF 提供四个层级的背景色，分别用于不同的界面层级。'
					: 'RTDF provides four levels of background colors for different interface layers.'}
			</p>
			<div className="mb-2 flex-wrap justify-around space-y-2 md:flex md:space-x-2 md:space-y-0">
				<ColorBox title="bg-base" color={bgColors.base} textColor="#000" className="h-20 border border-gray-300" />
				<ColorBox title="bg-surface" color={bgColors.surface} textColor="#000" className="h-20 border border-gray-300" />
				<ColorBox title="bg-overlay" color={bgColors.overlay} textColor="#000" className="h-20 border border-gray-300" />
				<ColorBox title="bg-highlight" color={bgColors.highlight} textColor="#000" className="h-20 border border-gray-300" />
			</div>
			<div className="flex-wrap justify-around space-y-2 md:flex md:space-x-2 md:space-y-0">
				<ColorBox title="bg-base-dark" color={bgColors.baseDark} textColor="#fff" className="h-20 border border-gray-700" />
				<ColorBox title="bg-surface-dark" color={bgColors.surfaceDark} textColor="#fff" className="h-20 border border-gray-700" />
				<ColorBox title="bg-overlay-dark" color={bgColors.overlayDark} textColor="#fff" className="h-20 border border-gray-700" />
				<ColorBox title="bg-highlight-dark" color={bgColors.highlightDark} textColor="#fff" className="h-20 border border-gray-700" />
			</div>
			<h3>{isZh ? '文字色' : 'Text Colors'}</h3>
			<div className="flex-wrap justify-around space-y-2 md:flex md:space-x-2 md:space-y-0">
				<ColorBox title="text-primary" color={bgColors.base} textColor={textColors.primary} className="h-20 border border-gray-300" />
				<ColorBox title="text-dark" color={bgColors.baseDark} textColor={textColors.dark} className="h-20 border border-gray-700" />
				<ColorBox title="text-on-primary" color={primaryColors.default} textColor={textColors.onPrimary} className="h-20 border border-gray-700" />
				<ColorBox title="text-on-dark" color={darkColors.default} textColor={textColors.onDark} className="h-20 border border-gray-700" />
			</div>
			<h2>{isZh ? '功能色' : 'Functional Color'}</h2>
			<p>
				{isZh
					? '功能色用于特定场景、特定状态等特殊语义，通常包含成功、警告、错误、信息四种。'
					: 'Functional color is used for specific scenarios and states. It usually includes success, warning, error, and information.'}
			</p>
			<div className="flex-wrap justify-around space-y-4 md:flex md:space-x-4 md:space-y-0">
				<ColorBox title="success" color={stateColor.success} textColor="#fff" />
				<ColorBox title="warning" color={stateColor.warning} textColor="#fff" />
				<ColorBox title="error" color={stateColor.error} textColor="#fff" />
				<ColorBox title="info" color={stateColor.info} textColor="#fff" />
			</div>
			<h2>{isZh ? '中性色' : 'Neutral Color'}</h2>
			<p>
				{isZh
					? '中性色包含一系列带透明度的黑白色和不同程度的灰色，用于配置亮色与暗模式不同背景、文字、分割线等颜色。'
					: 'Neutral color includes a series of black and white colors with different degrees of transparency and gray colors, used to configure backgrounds, text, and dividers in light and dark modes.'}
			</p>
			<div className="justify-between space-y-8 text-black md:flex md:space-x-8 md:space-y-0">
				<NeutralColumn tone="black" />
				<NeutralColumn tone="white" />
				<div className="flex flex-1 flex-col justify-between rounded-sm">
					{grayList.map((item) => (
						<div key={item.key} className="p-2 transition hover:scale-105 hover:rounded-sm" style={{ backgroundColor: item.color, color: getContrastTextColor(item.color) }}>
							<div className="flex items-center justify-between gap-2">
								<div className="font-bold">{item.key}</div>
								<div>{item.color}</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<h2>{isZh ? '扩展色' : 'Extended Color'}</h2>
			<p>
				{isZh
					? '扩展色是一些区分功能色与主题色的非必需装饰性颜色，主要是在需要多个颜色搭配的界面时使用。'
					: 'Extended colors are non-essential decorative colors that distinguish functional colors from theme colors. They are mainly used in interfaces that need multiple color combinations.'}
			</p>
			<div className="flex-wrap justify-around space-y-4 md:flex md:space-x-4 md:space-y-0">
				{extendList.map((extend) => (
					<ColorBox key={extend.alias} title={extend.alias} color={extend.color} textColor="#fff" />
				))}
			</div>
		</article>
	);
};

export default ColorPage;
