import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import hljs from 'highlight.js';
import {
	Avatar,
	AvatarGroup,
	Badge,
	Button,
	ButtonGroup,
	Calendar,
	Card,
	Cell,
	Checkbox,
	ColorPicker,
	ConfigProvider,
	Divider,
	FullKeyboard,
	Icon,
	Input,
	Loading,
	NoticeBar,
	NumKeyboard,
	Pagination,
	Progress,
	ProgressLoop,
	Radio,
	Rate,
	Skeleton,
	Slider,
	Stepper,
	Steps,
	Switch,
	Tab,
	Tag,
	Swiper
} from 'rtdf/components';
import { generateColorScale, themes } from 'rtdf/theme';
import { getContrastRatio, parseOklch } from 'rtdf/utils';
import { builtInIconLibraryLabelMap, builtInIconLibraryList, defaultBuiltInIconLibrary, type BuiltInIconLibrary } from '@any-tdf/common/svg';
import { themeLabels } from '../../data/homeData';
import { generateRandomOklchColor, oklchToHex, oklchToRgb, type OklchColor } from '../../utils';
import { useAppContext } from '../../store/appStore';
import LandscapeSvg from './LandscapeSvg';

type ExtendColor = {
	id: string;
	color: string;
	alias: string;
};

type GeneratorForm = {
	name: string;
	primary: string;
	dark: string;
	success: string;
	warning: string;
	error: string;
	info: string;
	bgBase: string;
	bgSurface: string;
	bgOverlay: string;
	bgHighlight: string;
	bgBaseDark: string;
	bgSurfaceDark: string;
	bgOverlayDark: string;
	bgHighlightDark: string;
	textPrimary: string;
	textDark: string;
	textOnPrimary: string;
	textOnDark: string;
	radiusBox: string;
	radiusForm: string;
	radiusSmall: string;
	builtInIconLibrary: BuiltInIconLibrary;
	extend: ExtendColor[];
};

type BuiltInIconThemeConfig = {
	'built-in-icon-library'?: BuiltInIconLibrary;
};

type StringFormKey = Exclude<keyof GeneratorForm, 'extend'>;

type ScaleColor = {
	n: number;
	oklch: string;
};

type CachedTheme = {
	name: string;
	form: GeneratorForm;
	primaryColor: string;
	darkColor: string;
	bgLightColor: string;
	bgDarkColor: string;
};

type PreviewStyle = CSSProperties & Record<string, string>;
type ActiveTab = 'preview' | 'palette';
type CopyTarget = 'plugin' | 'theme' | null;

const cachedThemeKey = 'rtdf-cached-themes';
const scaleSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const defaultExtendColors = [
	{ color: 'oklch(0.6 0.2 250)', alias: 'blue' },
	{ color: 'oklch(0.6 0.2 300)', alias: 'purple' },
	{ color: 'oklch(0.7 0.18 50)', alias: 'orange' },
	{ color: 'oklch(0.7 0.15 190)', alias: 'cyan' }
];

const baseThemeVars = [
	['black', 'oklch(0 0 0)'],
	['white', 'oklch(1 0 0)'],
	['gray-50', 'oklch(0.961 0 0)'],
	['gray-100', 'oklch(0.925 0 0)'],
	['gray-200', 'oklch(0.845 0 0)'],
	['gray-300', 'oklch(0.767 0 0)'],
	['gray-400', 'oklch(0.683 0 0)'],
	['gray-500', 'oklch(0.6 0 0)'],
	['gray-600', 'oklch(0.51 0 0)'],
	['gray-700', 'oklch(0.42 0 0)'],
	['gray-800', 'oklch(0.321 0 0)'],
	['gray-900', 'oklch(0.218 0 0)'],
	['gray-950', 'oklch(0.159 0 0)'],
	['transparent', 'transparent']
] as const;

const backgroundFields = [
	{ key: 'bgBase', zh: '基础', en: 'Base', label: 'base' },
	{ key: 'bgSurface', zh: '表面', en: 'Surface', label: 'surface' },
	{ key: 'bgOverlay', zh: '浮层', en: 'Overlay', label: 'overlay' },
	{ key: 'bgHighlight', zh: '高亮', en: 'Highlight', label: 'highlight' },
	{ key: 'bgBaseDark', zh: '暗基础', en: 'Dark Base', label: 'base-D' },
	{ key: 'bgSurfaceDark', zh: '暗表面', en: 'Dark Surface', label: 'surf-D' },
	{ key: 'bgOverlayDark', zh: '暗浮层', en: 'Dark Overlay', label: 'over-D' },
	{ key: 'bgHighlightDark', zh: '暗高亮', en: 'Dark Highlight', label: 'hl-D' }
] as const;

const functionColorFields = [
	{ key: 'success', zh: '成功', en: 'Success' },
	{ key: 'warning', zh: '警告', en: 'Warning' },
	{ key: 'error', zh: '错误', en: 'Error' },
	{ key: 'info', zh: '信息', en: 'Info' }
] as const;

const skeletonIconPreviewTypes = ['img', 'video', 'code', 'qrcode', 'barcode'] as const;

const radiusGroups = [
	{
		key: 'radiusBox',
		zh: '容器类',
		en: 'Box',
		descZh: '弹窗/卡片/单元格/骨架屏',
		descEn: 'Popup/Card/Cell/Skeleton',
		options: [
			{ value: '0', label: '0' },
			{ value: '0.25rem', label: '0.25' },
			{ value: '0.375rem', label: '0.375' },
			{ value: '0.5rem', label: '0.5' },
			{ value: '0.75rem', label: '0.75' },
			{ value: '1rem', label: '1' },
			{ value: '1.5rem', label: '1.5' },
			{ value: '2rem', label: '2' }
		]
	},
	{
		key: 'radiusForm',
		zh: '表单类',
		en: 'Form',
		descZh: '按钮/输入框/日历/分页',
		descEn: 'Button/Input/Calendar/Pagination',
		options: [
			{ value: '0', label: '0' },
			{ value: '0.25rem', label: '0.25' },
			{ value: '0.375rem', label: '0.375' },
			{ value: '0.5rem', label: '0.5' },
			{ value: '0.75rem', label: '0.75' },
			{ value: '1rem', label: '1' },
			{ value: '1.5rem', label: '1.5' },
			{ value: 'calc(infinity * 1px)', label: 'full' }
		]
	},
	{
		key: 'radiusSmall',
		zh: '小型控件类',
		en: 'Small',
		descZh: '开关/进度/滑块/步进器',
		descEn: 'Switch/Progress/Slider/Stepper',
		options: [
			{ value: '0', label: '0' },
			{ value: '0.25rem', label: '0.25' },
			{ value: '0.375rem', label: '0.375' },
			{ value: '0.5rem', label: '0.5' },
			{ value: '0.75rem', label: '0.75' },
			{ value: '1rem', label: '1' },
			{ value: '1.5rem', label: '1.5' },
			{ value: 'calc(infinity * 1px)', label: 'full' }
		]
	}
] as const;

const parseOklchSafe = (color: string) => parseOklch(color) ?? { l: 0.5, c: 0.15, h: 250 };

const oklchObjToStr = (obj: { l: number; c: number; h: number }) => {
	return `oklch(${Number(obj.l.toFixed(3))} ${Number(obj.c.toFixed(3))} ${Number(obj.h.toFixed(3))})`;
};

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

const createExtendColors = () =>
	defaultExtendColors.map((item, index) => ({
		...item,
		id: `${item.alias}-${index}`
	}));

const generateBgColors = (primaryColor: string, darkColor: string) => {
	const p = parseOklchSafe(primaryColor);
	const d = parseOklchSafe(darkColor);
	return {
		bgBase: `oklch(0.967 ${(p.c * 0.05).toFixed(4)} ${p.h.toFixed(1)})`,
		bgSurface: `oklch(0.985 0.005 ${d.h.toFixed(1)})`,
		bgOverlay: `oklch(0.955 0.005 ${d.h.toFixed(1)})`,
		bgHighlight: `oklch(0.98 ${(p.c * 0.03).toFixed(4)} ${p.h.toFixed(1)})`,
		bgBaseDark: `oklch(0.15 ${(d.c * 0.08).toFixed(4)} ${d.h.toFixed(1)})`,
		bgSurfaceDark: `oklch(0.22 ${(d.c * 0.06).toFixed(4)} ${((d.h + 15) % 360).toFixed(1)})`,
		bgOverlayDark: `oklch(0.19 ${(d.c * 0.05).toFixed(4)} ${d.h.toFixed(1)})`,
		bgHighlightDark: `oklch(0.08 ${(d.c * 0.04).toFixed(4)} ${d.h.toFixed(1)})`
	};
};

const generateTextColors = (primaryColor: string, darkColor: string) => {
	const p = parseOklchSafe(primaryColor);
	const d = parseOklchSafe(darkColor);
	return {
		textPrimary: `oklch(0.144 ${(p.c * 0.05).toFixed(3)} ${p.h.toFixed(1)})`,
		textDark: `oklch(0.917 ${(d.c * 0.25).toFixed(3)} ${d.h.toFixed(1)})`,
		textOnPrimary: `oklch(0.883 ${(d.c * 0.28).toFixed(3)} ${d.h.toFixed(1)})`,
		textOnDark: `oklch(0.189 ${(p.c * 0.17).toFixed(3)} ${p.h.toFixed(1)})`
	};
};

const formFromTheme = (themeName: string, isZh = false): GeneratorForm => {
	const theme = themes.find((item) => item.name === themeName) || themes[0];
	const primary = theme['color-primary'];
	const dark = theme['color-dark'];
	const bg = generateBgColors(primary, dark);
	const text = generateTextColors(primary, dark);
	return {
		name: isZh ? themeLabels[theme.name] || theme.name : theme.name,
		primary,
		dark,
		success: theme['color-success'],
		warning: theme['color-warning'],
		error: theme['color-error'],
		info: theme['color-info'],
		bgBase: theme['color-bg-base'] || bg.bgBase,
		bgSurface: theme['color-bg-surface'] || bg.bgSurface,
		bgOverlay: theme['color-bg-overlay'] || bg.bgOverlay,
		bgHighlight: theme['color-bg-highlight'] || bg.bgHighlight,
		bgBaseDark: theme['color-bg-base-dark'] || bg.bgBaseDark,
		bgSurfaceDark: theme['color-bg-surface-dark'] || bg.bgSurfaceDark,
		bgOverlayDark: theme['color-bg-overlay-dark'] || bg.bgOverlayDark,
		bgHighlightDark: theme['color-bg-highlight-dark'] || bg.bgHighlightDark,
		textPrimary: theme['color-text-primary'] || text.textPrimary,
		textDark: theme['color-text-dark'] || text.textDark,
		textOnPrimary: theme['color-text-on-primary'] || text.textOnPrimary,
		textOnDark: theme['color-text-on-dark'] || text.textOnDark,
		radiusBox: theme['radius-box'],
		radiusForm: theme['radius-form'],
		radiusSmall: theme['radius-small'],
		builtInIconLibrary: (theme as BuiltInIconThemeConfig)['built-in-icon-library'] || defaultBuiltInIconLibrary,
		extend: createExtendColors()
	};
};

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

const randomOklch = (lightness: [number, number], chroma: [number, number], hue: [number, number] = [0, 360]) => {
	return oklchObjToStr({
		l: randomBetween(lightness[0], lightness[1]),
		c: randomBetween(chroma[0], chroma[1]),
		h: randomBetween(hue[0], hue[1])
	});
};

const oklchColorToStr = (color: OklchColor) => oklchObjToStr({ l: color.l, c: color.c, h: color.h });

const randomOption = <T,>(options: readonly T[]) => options[Math.floor(Math.random() * options.length)];

const buildScaleList = (baseColor: string): ScaleColor[] => {
	const scale = generateColorScale(baseColor);
	return scaleSteps.map((step) => ({
		n: step,
		oklch: formatOklch(scale[step])
	}));
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

const buildPreviewStyle = (form: GeneratorForm, primaryColors: ScaleColor[], darkColors: ScaleColor[], height: number): PreviewStyle => {
	const style: PreviewStyle = {
		height: `${height}px`,
		'--color-success': form.success,
		'--color-warning': form.warning,
		'--color-error': form.error,
		'--color-info': form.info,
		'--color-bg-base': form.bgBase,
		'--color-bg-surface': form.bgSurface,
		'--color-bg-overlay': form.bgOverlay,
		'--color-bg-highlight': form.bgHighlight,
		'--color-bg-base-dark': form.bgBaseDark,
		'--color-bg-surface-dark': form.bgSurfaceDark,
		'--color-bg-overlay-dark': form.bgOverlayDark,
		'--color-bg-highlight-dark': form.bgHighlightDark,
		'--color-text-primary': form.textPrimary,
		'--color-text-dark': form.textDark,
		'--color-text-on-primary': form.textOnPrimary,
		'--color-text-on-dark': form.textOnDark,
		'--radius-box': form.radiusBox,
		'--radius-form': form.radiusForm,
		'--radius-small': form.radiusSmall
	};
	primaryColors.forEach((item) => {
		style[item.n === 600 ? '--color-primary' : `--color-primary-${item.n}`] = item.oklch;
	});
	darkColors.forEach((item) => {
		style[item.n === 600 ? '--color-dark' : `--color-dark-${item.n}`] = item.oklch;
	});
	form.extend.forEach((item, index) => {
		style[`--color-extend${index}`] = item.color;
		if (item.alias) style[`--color-${item.alias}`] = item.color;
	});
	return style;
};

const buildPluginConfig = (form: GeneratorForm) => {
	return `/* 主题配置，放入入口 CSS。HTML 使用 data-theme="${form.name}" 后生效。 */
/* primary 和 dark 只需传入基础色，插件会自动计算 50-950 梯度。 */
@plugin "rtdf/theme" {
	name: "${form.name}";

	color-primary: ${form.primary}; /* ${oklchToHex(form.primary)} ${oklchToRgb(form.primary)} */
	color-dark: ${form.dark}; /* ${oklchToHex(form.dark)} ${oklchToRgb(form.dark)} */

	color-bg-base: ${form.bgBase}; /* ${oklchToHex(form.bgBase)} ${oklchToRgb(form.bgBase)} */
	color-bg-surface: ${form.bgSurface}; /* ${oklchToHex(form.bgSurface)} ${oklchToRgb(form.bgSurface)} */
	color-bg-overlay: ${form.bgOverlay}; /* ${oklchToHex(form.bgOverlay)} ${oklchToRgb(form.bgOverlay)} */
	color-bg-highlight: ${form.bgHighlight}; /* ${oklchToHex(form.bgHighlight)} ${oklchToRgb(form.bgHighlight)} */
	color-bg-base-dark: ${form.bgBaseDark}; /* ${oklchToHex(form.bgBaseDark)} ${oklchToRgb(form.bgBaseDark)} */
	color-bg-surface-dark: ${form.bgSurfaceDark}; /* ${oklchToHex(form.bgSurfaceDark)} ${oklchToRgb(form.bgSurfaceDark)} */
	color-bg-overlay-dark: ${form.bgOverlayDark}; /* ${oklchToHex(form.bgOverlayDark)} ${oklchToRgb(form.bgOverlayDark)} */
	color-bg-highlight-dark: ${form.bgHighlightDark}; /* ${oklchToHex(form.bgHighlightDark)} ${oklchToRgb(form.bgHighlightDark)} */

	color-text-primary: ${form.textPrimary}; /* ${oklchToHex(form.textPrimary)} ${oklchToRgb(form.textPrimary)} */
	color-text-dark: ${form.textDark}; /* ${oklchToHex(form.textDark)} ${oklchToRgb(form.textDark)} */
	color-text-on-primary: ${form.textOnPrimary}; /* ${oklchToHex(form.textOnPrimary)} ${oklchToRgb(form.textOnPrimary)} */
	color-text-on-dark: ${form.textOnDark}; /* ${oklchToHex(form.textOnDark)} ${oklchToRgb(form.textOnDark)} */

	color-success: ${form.success}; /* ${oklchToHex(form.success)} ${oklchToRgb(form.success)} */
	color-warning: ${form.warning}; /* ${oklchToHex(form.warning)} ${oklchToRgb(form.warning)} */
	color-error: ${form.error}; /* ${oklchToHex(form.error)} ${oklchToRgb(form.error)} */
	color-info: ${form.info}; /* ${oklchToHex(form.info)} ${oklchToRgb(form.info)} */

	radius-box: ${form.radiusBox};
	radius-form: ${form.radiusForm};
	radius-small: ${form.radiusSmall};

	built-in-icon-library: ${form.builtInIconLibrary};
}`;
};

const buildThemeConfig = (form: GeneratorForm, primaryColors: ScaleColor[], darkColors: ScaleColor[]) => {
	const scaleVars = [
		...primaryColors.map((item) => `	${item.n === 600 ? '--color-primary' : `--color-primary-${item.n}`}: ${item.oklch};`),
		...darkColors.map((item) => `	${item.n === 600 ? '--color-dark' : `--color-dark-${item.n}`}: ${item.oklch};`)
	].join('\n');
	const baseVars = baseThemeVars
		.map(
			([name, value]) => `	--color-${name}: ${value};${value === 'transparent' ? '' : ` /* ${oklchToHex(value)} ${oklchToRgb(value)} */`}`
		)
		.join('\n');
	const extendVars = form.extend
		.filter((item) => item.alias)
		.map(
			(item, index) =>
				`	--color-extend${index}: ${item.color}; /* ${oklchToHex(item.color)} ${oklchToRgb(item.color)} */\n	--color-${item.alias}: ${item.color}; /* ${oklchToHex(item.color)} ${oklchToRgb(item.color)} */`
		)
		.join('\n');
	return `/* 初始主题 CSS 变量。用于检查 Tailwind CSS v4 输出结果。 */
@theme {
${scaleVars}

${baseVars}

	--color-bg-base: ${form.bgBase};
	--color-bg-surface: ${form.bgSurface};
	--color-bg-overlay: ${form.bgOverlay};
	--color-bg-highlight: ${form.bgHighlight};
	--color-bg-base-dark: ${form.bgBaseDark};
	--color-bg-surface-dark: ${form.bgSurfaceDark};
	--color-bg-overlay-dark: ${form.bgOverlayDark};
	--color-bg-highlight-dark: ${form.bgHighlightDark};

	--color-text-primary: ${form.textPrimary};
	--color-text-dark: ${form.textDark};
	--color-text-on-primary: ${form.textOnPrimary};
	--color-text-on-dark: ${form.textOnDark};

	--color-success: ${form.success};
	--color-warning: ${form.warning};
	--color-error: ${form.error};
	--color-info: ${form.info};
${extendVars ? `\n${extendVars}\n` : ''}
	--radius-box: ${form.radiusBox};
	--radius-form: ${form.radiusForm};
	--radius-small: ${form.radiusSmall};
}`;
};

const ColorSectionIcon = () => (
	<svg className="h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<path
			className="fill-black/50 dark:fill-white/50"
			d="M6.45711 18.9539L15.0208 10.3902L13.6066 8.97596L5.04289 17.5397L6.45711 18.9539ZM12.1924 7.56174L10.7782 6.14753L12.1924 4.73331L13.9602 6.50108L16.7886 3.67265C17.1791 3.28213 17.8123 3.28213 18.2028 3.67265L20.3241 5.79397C20.7146 6.1845 20.7146 6.81766 20.3241 7.20819L17.4957 10.0366L19.2635 11.8044L17.8492 13.2186L16.435 11.8044L7.24264 20.9968H3V16.7541L12.1924 7.56174Z"
		></path>
	</svg>
);

const RadiusSectionIcon = () => (
	<svg className="h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<path
			className="fill-black/50 dark:fill-white/50"
			d="M21 19V21H19V19H21ZM17 19V21H15V19H17ZM13 19V21H11V19H13ZM9 19V21H7V19H9ZM5 19V21H3V19H5ZM21 15V17H19V15H21ZM5 15V17H3V15H5ZM5 11V13H3V11H5ZM16 3C18.6874 3 20.8817 5.12366 20.9954 7.78322L21 8V13H19V8C19 6.40893 17.7447 5.09681 16.1756 5.00512L16 5H11V3H16ZM5 7V9H3V7H5ZM5 3V5H3V3H5ZM9 3V5H7V3H9Z"
		></path>
	</svg>
);

const InfoTipIcon = ({ className }: { className: string }) => (
	<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
		<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z"></path>
	</svg>
);

const SectionTitle = ({
	title,
	icon,
	help,
	className = 'mt-2'
}: {
	title: string;
	icon?: ReactNode;
	help?: ReactNode;
	className?: string;
}) => (
	<div className={`${className} flex items-center gap-2`}>
		<div className="h-px flex-1 bg-black/10 dark:bg-white/20"></div>
		{icon}
		<span className="shrink-0 text-xs text-black/50 dark:text-white/50">{title}</span>
		{help ? (
			<div className="group/radiusTip relative">
				<InfoTipIcon className="h-3.5 w-3.5 shrink-0 cursor-help text-black/30 dark:text-white/30" />
				<div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-36 -translate-x-1/2 rounded bg-black px-2 py-1.5 text-xs leading-tight text-white opacity-0 transition-opacity group-hover/radiusTip:opacity-100 dark:bg-white dark:text-black">
					{help}
					<div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-black dark:border-t-white"></div>
				</div>
			</div>
		) : null}
		<div className="h-px flex-1 bg-black/10 dark:bg-white/20"></div>
	</div>
);

const PanelHelp = ({ children }: { children: ReactNode }) => <div className="space-y-0.5">{children}</div>;

const getContrastLevel = (ratio: number) => {
	if (ratio >= 7) return { level: 'AAA', color: 'text-green-600 dark:text-green-400' };
	if (ratio >= 4.5) return { level: 'AA', color: 'text-blue-600 dark:text-blue-400' };
	if (ratio >= 3) return { level: 'A', color: 'text-yellow-600 dark:text-yellow-400' };
	return { level: 'Fail', color: 'text-red-600 dark:text-red-400' };
};

const calculateColorPickerPosition = (rect: DOMRect) => {
	const pickerWidth = 320;
	const pickerHeight = 520;
	const margin = 8;
	const bottomMargin = 20;
	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;
	let top = rect.top;
	let left = rect.right + margin;

	if (left + pickerWidth > viewportWidth - margin) {
		left = rect.left - pickerWidth - margin;
	}
	if (left < margin) {
		left = Math.min(rect.right + margin, viewportWidth - pickerWidth - margin);
	}

	const maxTop = viewportHeight - pickerHeight - bottomMargin;
	if (top > maxTop) top = maxTop;
	if (top < margin) top = margin;

	return { top, left };
};

const ColorPickerButton = ({
	label,
	caption,
	ariaLabel,
	value,
	size = 'sm',
	onChange,
	onOpen,
	textPreviewBg,
	contrastTarget,
	showContrast = false,
	compact = false
}: {
	label?: string;
	caption?: string;
	ariaLabel?: string;
	value: string;
	size?: 'sm' | 'md';
	onChange: (value: string) => void;
	onOpen?: () => void;
	textPreviewBg?: string;
	contrastTarget?: string;
	showContrast?: boolean;
	compact?: boolean;
}) => {
	const [open, setOpen] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const color = parseOklchSafe(value);
	const sizeClass = size === 'md' ? 'h-8 w-8' : 'h-6 w-6';
	const textColor = textPreviewBg ? value : undefined;
	const buttonClass = textPreviewBg
		? `${sizeClass} flex cursor-pointer items-center justify-center rounded-sm border border-black/20 font-bold dark:border-white/20`
		: `${sizeClass} cursor-pointer rounded-sm border border-black/20 dark:border-white/20`;
	const buttonLabel = ariaLabel ?? label ?? caption ?? 'Pick color';
	const rootClass = caption
		? 'group relative flex flex-1 flex-col items-center gap-0.5'
		: compact
			? 'group relative shrink-0'
			: 'group relative';
	const isColorPickerZh = typeof window === 'undefined' ? true : localStorage.getItem('lang') === 'zh_CN';
	const contrastInfo = useMemo(() => {
		if (!showContrast || !contrastTarget) return null;
		const current = parseOklch(value);
		const target = parseOklch(contrastTarget);
		if (!current || !target) return null;
		const ratio = getContrastRatio(current, target);
		const { level, color: contrastColor } = getContrastLevel(ratio);
		return { ratio: ratio.toFixed(2), level, color: contrastColor };
	}, [contrastTarget, showContrast, value]);

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setPosition(calculateColorPickerPosition(event.currentTarget.getBoundingClientRect()));
		onOpen?.();
		setOpen((prev) => !prev);
	};

	useEffect(() => {
		if (!open) return;
		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setOpen(false);
		};
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	}, [open]);

	return (
		<div className={rootClass}>
			<button
				className={buttonClass}
				style={{ backgroundColor: textPreviewBg || value, color: textColor }}
				type="button"
				aria-label={buttonLabel}
				onClick={handleClick}
			>
				{textPreviewBg ? <span>A</span> : null}
			</button>
			{caption ? <span className="leading-none text-xs text-black/50 dark:text-white/50">{caption}</span> : null}
			{label ? (
				<div className="z-9999 pointer-events-none absolute top-1/2 left-full ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-700">
					{label}
					<div className="absolute top-1/2 right-full -translate-y-1/2 border-4 border-transparent border-r-gray-800 dark:border-r-gray-700"></div>
				</div>
			) : null}
			{open ? (
				<>
					<div
						className="fixed inset-0"
						style={{ zIndex: 9998 }}
						onClick={() => setOpen(false)}
						onKeyDown={() => setOpen(false)}
						role="button"
						tabIndex={0}
						aria-label="Close picker"
					></div>
					<div
						className="fixed w-80 origin-top-left rounded-lg border border-black/10 bg-white p-4 shadow-lg dark:border-white/20 dark:bg-gray-900"
						style={{ top: `${position.top}px`, left: `${position.left}px`, zIndex: 9999 }}
					>
						<ColorPicker
							visible
							value={color}
							modes={['oklch']}
							popup={null}
							onChange={(colors) => {
								const next = colors[0];
								if (next) onChange(next);
							}}
						/>
						{contrastInfo ? (
							<div className="mt-3 flex items-center justify-between rounded-md bg-black/5 px-3 py-2 dark:bg-white/5">
								<div className="flex items-center gap-2">
									<span className="text-xs text-black/60 dark:text-white/60">{isColorPickerZh ? '对比度' : 'Contrast'}</span>
									<span className="font-mono text-sm font-medium">{contrastInfo.ratio}:1</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-xs text-black/60 dark:text-white/60">WCAG</span>
									<span className={`font-mono text-sm font-bold ${contrastInfo.color}`}>{contrastInfo.level}</span>
									<div className="group/wcag relative flex-none">
										<InfoTipIcon className="h-3.5 w-3.5 cursor-help text-black/40 dark:text-white/40" />
										<div className="pointer-events-none absolute right-0 bottom-full z-10 mb-2 w-48 rounded bg-black px-2.5 py-2 text-xs leading-relaxed text-white opacity-0 transition-opacity group-hover/wcag:opacity-100 dark:bg-white dark:text-black">
											<div className="mb-1 font-medium">
												{isColorPickerZh ? '网页内容无障碍指南' : 'Web Content Accessibility Guidelines'}
											</div>
											<div className="space-y-0.5 text-white/80 dark:text-black/70">
												<div>
													<span className="font-bold text-green-400 dark:text-green-600">AAA</span> ≥7:1{' '}
													{isColorPickerZh ? '最高标准' : 'Enhanced'}
												</div>
												<div>
													<span className="font-bold text-blue-400 dark:text-blue-600">AA</span> ≥4.5:1{' '}
													{isColorPickerZh ? '推荐标准' : 'Minimum'}
												</div>
												<div>
													<span className="font-bold text-yellow-400 dark:text-yellow-600">A</span> ≥3:1{' '}
													{isColorPickerZh ? '大文字可用' : 'Large text'}
												</div>
											</div>
											<div className="absolute top-full right-2 border-4 border-transparent border-t-black dark:border-t-white"></div>
										</div>
									</div>
								</div>
							</div>
						) : null}
					</div>
				</>
			) : null}
		</div>
	);
};

const RadiusGrid = ({
	group,
	value,
	isZh,
	onChange
}: {
	group: (typeof radiusGroups)[number];
	value: string;
	isZh: boolean;
	onChange: (value: string) => void;
}) => (
	<div className="mt-1">
		<div className="text-xs text-black/50 dark:text-white/50">
			{isZh ? `${group.zh}（${group.descZh}）` : `${group.en} (${group.descEn})`}
		</div>
		<div className="mt-1 grid grid-cols-4 gap-x-1 gap-y-1 py-1">
			{group.options.map((option) => (
				<button
					key={option.value}
					className="group flex cursor-pointer flex-col items-center gap-0.5"
					onClick={() => onChange(option.value)}
					type="button"
				>
					<div className="site-radius-swatch relative h-8 w-full overflow-hidden rounded transition-all">
						<div
							className={`site-radius-swatch-inner absolute -bottom-10 -left-14 h-16 w-24 border-2 transition-colors ${
								value === option.value
									? 'border-primary dark:border-dark'
									: 'border-gray-300 group-hover:border-gray-400 dark:border-white/20 dark:group-hover:border-white/40'
							}`}
							style={{ borderRadius: option.value }}
						></div>
					</div>
					<span
						className={`text-xs transition-colors ${value === option.value ? 'text-primary dark:text-dark' : 'text-black/40 dark:text-white/40'}`}
					>
						{option.label}
					</span>
				</button>
			))}
		</div>
	</div>
);

const PaletteRow = ({ title, colors }: { title: string; colors: ScaleColor[] }) => (
	<div className="mb-1 flex justify-between gap-1 text-center text-xs">
		{colors.map((color, index) => (
			<div
				key={`${title}-${color.n}`}
				className="h-12 rounded-sm"
				style={{
					backgroundColor: color.oklch,
					color: getContrastTextColor(color.oklch),
					flex: index === 6 ? '2' : '1'
				}}
			>
				<div className="flex h-full items-center justify-center">
					<div className={index === 6 ? 'text-xl font-bold' : ''}>{index === 6 ? title : color.n}</div>
				</div>
			</div>
		))}
	</div>
);

const CodeBlock = ({
	code,
	copied,
	isZh,
	height,
	onCopy
}: {
	code: string;
	copied: boolean;
	isZh: boolean;
	height: number;
	onCopy: () => void;
}) => <HighlightedCodeBlock code={code} copied={copied} height={height} isZh={isZh} onCopy={onCopy} />;

const HighlightedCodeBlock = ({
	code,
	copied,
	isZh,
	height,
	onCopy
}: {
	code: string;
	copied: boolean;
	isZh: boolean;
	height: number;
	onCopy: () => void;
}) => {
	const highlightedCode = useMemo(() => hljs.highlight(code, { language: 'css', ignoreIllegals: true }).value, [code]);

	return (
		<div className="relative flex-1 overflow-auto rounded-t-sm rounded-b-lg bg-black/5 dark:bg-white/5" style={{ height: `${height}px` }}>
			<article className="prose dark:prose-invert max-w-none text-sm">
				<pre>
					<code className="hljs language-css" dangerouslySetInnerHTML={{ __html: highlightedCode }}></code>
				</pre>
			</article>
			<button
				aria-label="copy"
				className="absolute top-0 right-0 rounded-bl-sm bg-black/5 px-3 py-2 text-sm hover:opacity-80 dark:bg-white/10"
				onClick={onCopy}
				type="button"
			>
				<svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path
						className="fill-gray-700 dark:fill-gray-300"
						d="M6 4V8H18V4H20.0066C20.5552 4 21 4.44495 21 4.9934V21.0066C21 21.5552 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5551 3 21.0066V4.9934C3 4.44476 3.44495 4 3.9934 4H6ZM8 2H16V6H8V2Z"
					></path>
				</svg>
			</button>
			{copied ? <div className="absolute top-1 right-14 text-sm">{isZh ? '已复制！' : 'Copied!'}</div> : null}
		</div>
	);
};

const PreviewBlock = ({ title, component, children }: { title: string; component?: string; children: ReactNode }) => (
	<div className="mb-6 break-inside-avoid border-b border-black/10 pb-6 dark:border-white/10">
		<div className="text-text-primary/60 dark:text-text-dark/60 mb-2 text-xs font-medium">
			{title}
			{component ? <span className="ml-1 opacity-50">{component}</span> : null}
		</div>
		{children}
	</div>
);

const PreviewPanel = ({
	isZh,
	previewDark,
	previewStyle,
	builtInIconLibrary,
	extend
}: {
	isZh: boolean;
	previewDark: boolean;
	previewStyle: PreviewStyle;
	builtInIconLibrary: BuiltInIconLibrary;
	extend: ExtendColor[];
}) => {
	const [activeTab, setActiveTab] = useState(0);
	const [rateValue, setRateValue] = useState(4.5);
	const [radioValue, setRadioValue] = useState('alipay');
	const [sliderValue, setSliderValue] = useState(65);
	const [sliderBarValue, setSliderBarValue] = useState(60);
	const [notifySwitch, setNotifySwitch] = useState(true);
	const [autoUpdateSwitch, setAutoUpdateSwitch] = useState(false);
	const [locationSwitch, setLocationSwitch] = useState(true);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [productCount, setProductCount] = useState(1);
	const [currentPage, setCurrentPage] = useState(3);
	const [currentPage2, setCurrentPage2] = useState(5);
	const [numKeyboardValue, setNumKeyboardValue] = useState('');
	const [fullKeyboardValue, setFullKeyboardValue] = useState('');
	const [checkboxValues, setCheckboxValues] = useState(['agree']);
	const componentOrder = useMemo(() => Array.from({ length: 29 }, (_, index) => index).sort(() => Math.random() - 0.5), []);
	const barList = useMemo(
		() =>
			Array.from({ length: 40 }, (_, index) => {
				const x = (index - 20) / 8;
				return Math.floor(Math.exp((-x * x) / 2) * 40) + 4;
			}),
		[]
	);
	const now = useMemo(() => new Date(), []);
	const currentMonthStr = useMemo(() => `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`, [now]);
	const selectedDates = useMemo(() => {
		const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
		const maxStartDay = Math.max(1, daysInMonth - 9);
		const startDay = Math.floor(Math.random() * maxStartDay) + 1;
		return Array.from({ length: 10 }, (_, index) => `${currentMonthStr}${String(startDay + index).padStart(2, '0')}`);
	}, [currentMonthStr, now]);
	const randomWallImage = useMemo(() => `/assets/images/home/wall_${Math.floor(Math.random() * 4) + 1}.jpg`, []);
	const swiperData = useMemo(
		() =>
			[1, 2, 3, 4].map((index) => ({
				type: 'img' as const,
				url: `/assets/images/home/wall_${index}.jpg`
			})),
		[]
	);
	const loadingTypes = useMemo(() => ['1_4', '1_12', '1_24', '1_36'], []);
	const categories = useMemo(
		() => [
			{ text: isZh ? '推荐' : 'Featured' },
			{ text: isZh ? '热销' : 'Hot' },
			{ text: isZh ? '新品' : 'New' },
			{ text: isZh ? '特惠' : 'Sale' }
		],
		[isZh]
	);
	const paymentData = useMemo(
		() => [
			{ name: 'alipay', label: isZh ? '支付宝' : 'Alipay' },
			{ name: 'wechat', label: isZh ? '微信支付' : 'WeChat Pay' },
			{ name: 'card', label: isZh ? '银行卡' : 'Bank Card' }
		],
		[isZh]
	);
	const logisticsSteps = useMemo(
		() => [
			{
				step: {
					title: isZh ? '订单已提交' : 'Order Placed',
					desc: isZh ? '12 月 20 日 14:30' : 'Dec 20, 14:30',
					bar: { type: 'icon' as const, content: { name: 'ri-checkbox-circle-line', size: 16 } }
				}
			},
			{
				step: {
					title: isZh ? '商家已发货' : 'Shipped',
					desc: isZh ? '12 月 21 日 09:15' : 'Dec 21, 09:15',
					bar: { type: 'icon' as const, content: { name: 'ri-gift-line', size: 16 } }
				}
			},
			{
				step: {
					title: isZh ? '运输中' : 'In Transit',
					desc: isZh ? '12 月 22 日 06:00' : 'Dec 22, 06:00',
					bar: { type: 'icon' as const, content: { name: 'ri-truck-line', size: 16 } }
				}
			},
			{
				step: {
					title: isZh ? '派送中' : 'Out for Delivery',
					desc: isZh ? '预计今日送达' : 'Expected today',
					bar: { type: 'icon' as const, content: { name: 'ri-home-4-line', size: 16 } }
				}
			}
		],
		[isZh]
	);
	const checkboxData = useMemo(
		() => [{ name: 'agree', label: isZh ? '我已阅读并同意服务协议' : 'I agree to the Terms of Service' }],
		[isZh]
	);
	const getExtendColor = (index: number) => extend[index]?.color || 'oklch(0 0 0)';
	const getKeyboardValue = (prev: string, key: string) => {
		if (key === 'delete') return prev.slice(0, -1);
		if (key === 'done' || key === 'close') return prev;
		return `${prev}${key}`;
	};

	const lineLegend = [0, 1, 2, 3].filter((index) => extend[index]);

	const renderLineChart = () => (
		<svg className="h-40 w-full" viewBox="0 0 320 160" preserveAspectRatio="xMidYMid meet">
			<line x1="40" y1="20" x2="300" y2="20" stroke="currentColor" strokeOpacity="0.1" />
			<line x1="40" y1="50" x2="300" y2="50" stroke="currentColor" strokeOpacity="0.1" />
			<line x1="40" y1="80" x2="300" y2="80" stroke="currentColor" strokeOpacity="0.1" />
			<line x1="40" y1="110" x2="300" y2="110" stroke="currentColor" strokeOpacity="0.1" />
			<line x1="40" y1="140" x2="300" y2="140" stroke="currentColor" strokeOpacity="0.1" />
			<text x="30" y="24" textAnchor="end" fill="currentColor" fillOpacity="0.5" fontSize="10">
				600
			</text>
			<text x="30" y="54" textAnchor="end" fill="currentColor" fillOpacity="0.5" fontSize="10">
				450
			</text>
			<text x="30" y="84" textAnchor="end" fill="currentColor" fillOpacity="0.5" fontSize="10">
				300
			</text>
			<text x="30" y="114" textAnchor="end" fill="currentColor" fillOpacity="0.5" fontSize="10">
				150
			</text>
			<text x="30" y="144" textAnchor="end" fill="currentColor" fillOpacity="0.5" fontSize="10">
				0
			</text>
			<text x="70" y="155" textAnchor="middle" fill="currentColor" fillOpacity="0.5" fontSize="10">
				10-13
			</text>
			<text x="147" y="155" textAnchor="middle" fill="currentColor" fillOpacity="0.5" fontSize="10">
				10-14
			</text>
			<text x="223" y="155" textAnchor="middle" fill="currentColor" fillOpacity="0.5" fontSize="10">
				10-15
			</text>
			<text x="300" y="155" textAnchor="middle" fill="currentColor" fillOpacity="0.5" fontSize="10">
				10-16
			</text>
			{extend[0] ? (
				<>
					<path d="M70 25 Q108 60 147 95 T223 70 T300 55" fill="none" stroke={getExtendColor(0)} strokeWidth="1.5" strokeLinecap="round" />
					{[
						[70, 25],
						[147, 95],
						[223, 70],
						[300, 55]
					].map(([cx, cy]) => (
						<circle key={`line-0-${cx}`} cx={cx} cy={cy} r="3" fill={getExtendColor(0)} />
					))}
				</>
			) : null}
			{extend[1] ? (
				<>
					<path d="M70 35 Q108 55 147 65 T223 120 T300 20" fill="none" stroke={getExtendColor(1)} strokeWidth="1.5" strokeLinecap="round" />
					{[
						[70, 35],
						[147, 65],
						[223, 120],
						[300, 20]
					].map(([cx, cy]) => (
						<circle key={`line-1-${cx}`} cx={cx} cy={cy} r="3" fill={getExtendColor(1)} />
					))}
				</>
			) : null}
			{extend[2] ? (
				<>
					<path d="M70 80 Q108 45 147 50 T223 85 T300 40" fill="none" stroke={getExtendColor(2)} strokeWidth="1.5" strokeLinecap="round" />
					{[
						[70, 80],
						[147, 50],
						[223, 85],
						[300, 40]
					].map(([cx, cy]) => (
						<circle key={`line-2-${cx}`} cx={cx} cy={cy} r="3" fill={getExtendColor(2)} />
					))}
				</>
			) : null}
			{extend[3] ? (
				<>
					<path
						d="M70 110 Q108 100 147 75 T223 100 T300 85"
						fill="none"
						stroke={getExtendColor(3)}
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
					{[
						[70, 110],
						[147, 75],
						[223, 100],
						[300, 85]
					].map(([cx, cy]) => (
						<circle key={`line-3-${cx}`} cx={cx} cy={cy} r="3" fill={getExtendColor(3)} />
					))}
				</>
			) : null}
		</svg>
	);

	const renderPieChart = () => (
		<svg className="h-32 w-32 shrink-0" viewBox="0 0 160 160">
			<circle cx="80" cy="80" r="60" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="20" />
			{extend[0] ? (
				<circle
					cx="80"
					cy="80"
					r="60"
					fill="none"
					stroke={getExtendColor(0)}
					strokeWidth="20"
					strokeDasharray="188.5 377"
					strokeDashoffset="94.25"
					transform="rotate(-90 80 80)"
				/>
			) : null}
			{extend[1] ? (
				<circle
					cx="80"
					cy="80"
					r="60"
					fill="none"
					stroke={getExtendColor(1)}
					strokeWidth="20"
					strokeDasharray="117.8 377"
					strokeDashoffset="-94.25"
					transform="rotate(-90 80 80)"
				/>
			) : null}
			{extend[2] ? (
				<circle
					cx="80"
					cy="80"
					r="60"
					fill="none"
					stroke={getExtendColor(2)}
					strokeWidth="20"
					strokeDasharray="47.1 377"
					strokeDashoffset="-212.05"
					transform="rotate(-90 80 80)"
				/>
			) : null}
			{extend[3] ? (
				<circle
					cx="80"
					cy="80"
					r="60"
					fill="none"
					stroke={getExtendColor(3)}
					strokeWidth="20"
					strokeDasharray="23.6 377"
					strokeDashoffset="-259.15"
					transform="rotate(-90 80 80)"
				/>
			) : null}
			<text x="80" y="72" textAnchor="middle" fill="currentColor" fillOpacity="0.5" fontSize="10">
				{isZh ? '总量' : 'Total'}
			</text>
			<text x="80" y="92" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="bold">
				3,200
			</text>
		</svg>
	);

	const renderBlock = (index: number) => {
		if (index === 0) {
			return (
				<PreviewBlock key={index} title={isZh ? '轮播图' : 'Carousel'} component="Swiper">
					<div style={{ width: '300px', margin: '0 auto' }}>
						<Swiper
							data={swiperData}
							py="6"
							px="2"
							indicateInjClass="bg-none"
							indicateColor="bg-black/10 dark:bg-white/10"
							indicateActiveColor={previewDark ? 'bg-dark' : 'bg-primary'}
							indicateStyle="longLine"
							interval={6}
							containerWidth={300}
						/>
					</div>
					<div className="mt-3" style={{ width: '300px', margin: '0 auto' }}>
						<Swiper
							data={swiperData}
							py="8"
							px="6"
							indicateInjClass="bg-none"
							indicateColor="bg-black/10 dark:bg-white/10"
							indicateActiveColor={previewDark ? 'bg-dark' : 'bg-primary'}
							containerWidth={300}
							translateZ={600}
						/>
					</div>
				</PreviewBlock>
			);
		}
		if (index === 1) {
			return (
				<PreviewBlock key={index} title={isZh ? '商品操作' : 'Product Actions'} component="Button / ButtonGroup">
					<div className="flex flex-col">
						<Button>{isZh ? '立即购买' : 'Buy Now'}</Button>
						<Button fill="colorLight">{isZh ? '收藏商品' : 'Add to Wishlist'}</Button>
						<Button fill="lineState">{isZh ? '加入购物车' : 'Add to Cart'}</Button>
						<div className="mt-2 flex justify-between gap-2 px-4">
							<Button state="success" customSize customWidth={44} customHeight={44} icon={{ name: 'ri-checkbox-circle-line', size: 20 }} />
							<Button state="warning" customSize customWidth={44} customHeight={44} icon={{ name: 'ri-error-warning-line', size: 20 }} />
							<Button state="error" customSize customWidth={44} customHeight={44} icon={{ name: 'ri-close-circle-line', size: 20 }} />
							<Button state="info" customSize customWidth={44} customHeight={44} icon={{ name: 'ri-information-line', size: 20 }} />
						</div>
						<div className="mt-3">
							<ButtonGroup fill="lineState" items={[{ text: 'S' }, { text: 'M' }, { text: 'L' }, { text: 'XL' }]} />
						</div>
					</div>
				</PreviewBlock>
			);
		}
		if (index === 2) {
			return (
				<PreviewBlock key={index} title={isZh ? '订单状态' : 'Order Status'} component="Badge">
					<Card bg="gray" shadow="none" mx="0" my="0" px="0" py="4">
						<div className="flex items-center justify-around">
							{[
								{ text: '2', cls: 'bg-warning', icon: 'ri-wallet-3-line', label: isZh ? '待付款' : 'Unpaid' },
								{ text: 'Hot', cls: 'bg-info', icon: 'ri-gift-line', label: isZh ? '待发货' : 'Pending', radius: 'leaf' as const },
								{ icon: 'ri-truck-line', label: isZh ? '待收货' : 'Shipping' },
								{ text: 'New', cls: 'bg-error', icon: 'ri-star-line', label: isZh ? '待评价' : 'Review' }
							].map((item) => (
								<div key={item.label} className="flex flex-col items-center gap-1">
									{item.text ? (
										<Badge text={item.text} injClass={item.cls} radius={item.radius}>
											<Icon name={item.icon} theme size={24} />
										</Badge>
									) : (
										<Icon name={item.icon} theme size={24} />
									)}
									<span className="text-xs">{item.label}</span>
								</div>
							))}
						</div>
					</Card>
				</PreviewBlock>
			);
		}
		if (index === 3) {
			return (
				<PreviewBlock key={index} title={isZh ? '入住日期' : 'Check-in Date'} component="Calendar">
					<Calendar
						popup={null}
						clear={false}
						mode="range"
						startMonth={currentMonthStr}
						initMonth={currentMonthStr}
						initSelectedDates={selectedDates}
						height={35}
					/>
				</PreviewBlock>
			);
		}
		if (index === 4) {
			return (
				<PreviewBlock key={index} title={isZh ? '插画' : 'Illustration'}>
					<Card bg="gray" shadow="none" mx="0" my="0" p="0">
						<div className="flex h-48 items-center overflow-hidden">
							<LandscapeSvg dark={previewDark} />
						</div>
					</Card>
				</PreviewBlock>
			);
		}
		if (index === 5) {
			return (
				<PreviewBlock key={index} title={isZh ? '物流追踪' : 'Shipping Status'} component="Steps">
					<Card bg="gray" shadow="none" mx="0" my="0" p="3">
						<Steps steps={logisticsSteps} current={3} vertical />
					</Card>
				</PreviewBlock>
			);
		}
		if (index === 6) {
			return (
				<PreviewBlock key={index} title={isZh ? '加载中' : 'Loading'} component="Loading">
					<div className="flex flex-wrap items-center justify-around gap-2">
						{loadingTypes.map((type) => (
							<Loading key={type} theme type={type} />
						))}
					</div>
				</PreviewBlock>
			);
		}
		if (index === 7) {
			return (
				<PreviewBlock key={index} title={isZh ? '数据统计' : 'Statistics'} component="ProgressLoop">
					<div className="flex items-center justify-around">
						{[
							{ percent: 78, label: isZh ? '任务' : 'Tasks', className: '' },
							{ percent: 45, label: isZh ? '存储' : 'Storage', className: '!stroke-success' },
							{ percent: 92, label: isZh ? '电量' : 'Battery', className: '!stroke-warning' }
						].map((item) => (
							<div key={item.label} className="flex flex-col items-center gap-1">
								<div className="h-14 w-14">
									<ProgressLoop percent={item.percent} strokeWidth={3} injClass={item.className} />
								</div>
								<span className="text-text-primary/50 dark:text-text-dark/50 text-xs">{item.label}</span>
							</div>
						))}
					</div>
				</PreviewBlock>
			);
		}
		if (index === 8) {
			return (
				<PreviewBlock key={index} title={isZh ? '快捷功能' : 'Quick Actions'} component="Icon">
					<div className="flex flex-wrap items-center justify-around gap-3">
						{[
							{ icon: 'ri-scan-2-line', label: isZh ? '扫一扫' : 'Scan' },
							{ icon: 'ri-bank-card-line', label: isZh ? '付款' : 'Pay' },
							{ icon: 'ri-coupon-3-line', label: isZh ? '卡券' : 'Coupon' },
							{ icon: 'ri-gift-line', label: isZh ? '福利' : 'Gift' }
						].map((item) => (
							<div key={item.label} className="flex flex-col items-center gap-1">
								<Icon name={item.icon} theme size={28} />
								<span className="text-xs">{item.label}</span>
							</div>
						))}
					</div>
				</PreviewBlock>
			);
		}
		if (index === 9) {
			return (
				<PreviewBlock key={index} title={isZh ? '会员等级' : 'VIP Level'} component="Progress">
					<div className="flex flex-col gap-2">
						<div className="text-text-primary/50 dark:text-text-dark/50 flex items-center justify-between text-xs">
							<span>Lv.3</span>
							<span>1680/2000 {isZh ? '经验' : 'EXP'}</span>
							<span>Lv.4</span>
						</div>
						<Progress percent={84} height="2" />
						<Progress percent={65} height="4" percentPosition="block" />
					</div>
				</PreviewBlock>
			);
		}
		if (index === 10) {
			return (
				<PreviewBlock key={index} title={isZh ? '商品评分' : 'Product Rating'} component="Rate">
					<Card bg="gray" shadow="none" mx="0" my="0" px="4" py="3">
						<div className="flex items-center justify-between">
							<div className="flex flex-col">
								<span className="text-2xl font-bold">{rateValue}</span>
								<span className="text-text-primary/50 dark:text-text-dark/50 text-xs">{isZh ? '综合评分' : 'Overall'}</span>
							</div>
							<Rate value={rateValue} half width={24} height={24} onClick={setRateValue} />
						</div>
					</Card>
				</PreviewBlock>
			);
		}
		if (index === 11) {
			return (
				<PreviewBlock key={index} title={isZh ? '偏好设置' : 'Settings'} component="Switch">
					<Card bg="gray" shadow="none" mx="0" my="0" px="4" py="3">
						<div className="flex flex-col gap-3">
							<div className="flex items-center justify-between">
								<span className="text-sm">{isZh ? '消息通知' : 'Notifications'}</span>
								<Switch active={notifySwitch} onChange={setNotifySwitch} />
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm">{isZh ? '自动更新' : 'Auto Update'}</span>
								<Switch active={autoUpdateSwitch} inside="state" onChange={setAutoUpdateSwitch} />
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm">{isZh ? '位置服务' : 'Location'}</span>
								<Switch active={locationSwitch} onChange={setLocationSwitch} />
							</div>
						</div>
					</Card>
				</PreviewBlock>
			);
		}
		if (index === 12) {
			return (
				<PreviewBlock key={index} title={isZh ? '音量调节' : 'Volume'} component="Slider">
					<div className="flex items-center gap-3 px-2 pt-5">
						<Icon name="ri-volume-mute-line" size={20} />
						<div className="flex-1">
							<Slider value={sliderValue} showTip="always" onChange={(value) => setSliderValue(value)} />
						</div>
						<Icon name="ri-volume-up-line" size={20} />
					</div>
					<div className="mt-4 px-2 pt-12">
						<Slider lineBlock showTip="never" value={sliderBarValue} onChange={(value) => setSliderBarValue(value)}>
							<div className="relative grow items-end">
								<div className="flex items-end justify-between overflow-hidden" style={{ transform: 'translateY(-22px)' }}>
									{barList.map((item, barIndex) => (
										<div
											key={`${item}-${barIndex}`}
											className={`w-1 rounded-full ${barIndex / 40 < sliderBarValue / 100 ? (previewDark ? 'bg-dark' : 'bg-primary') : previewDark ? 'bg-gray-500' : 'bg-gray-200'}`}
											style={{ height: `${item}px` }}
										></div>
									))}
								</div>
							</div>
						</Slider>
					</div>
				</PreviewBlock>
			);
		}
		if (index === 13) {
			return (
				<PreviewBlock key={index} title={isZh ? '支付方式' : 'Payment'} component="Radio">
					<Radio data={paymentData} value={radioValue} onChange={setRadioValue} />
				</PreviewBlock>
			);
		}
		if (index === 14) {
			return (
				<PreviewBlock key={index} title={isZh ? '用户登录' : 'User Login'} component="Input">
					<Card bg="gray" shadow="none" mx="0" my="0">
						<div className="flex flex-col gap-3">
							<Input
								value={username}
								placeholder={isZh ? '请输入用户名' : 'Username'}
								label1={{ name: 'ri-user-3-line', size: 18 }}
								clear
								onChange={setUsername}
							/>
							<Input
								value={password}
								type="password"
								placeholder={isZh ? '请输入密码' : 'Password'}
								label1={{ name: 'ri-lock-line', size: 18 }}
								clear
								onChange={setPassword}
							/>
							<Input
								placeholder={isZh ? '请输入用户名' : 'Username'}
								label1={{ name: 'ri-user-3-line', size: 18 }}
								inputStyle="line"
								clear
							/>
						</div>
					</Card>
				</PreviewBlock>
			);
		}
		if (index === 15) {
			return (
				<PreviewBlock key={index} title={isZh ? '活动通知' : 'Notice'} component="NoticeBar">
					<NoticeBar
						textList={[
							isZh ? '双 12 大促进行中，全场满 300 减 50！' : 'Holiday Sale: Get $50 off on orders over $300!',
							isZh ? '新用户注册即送 100 元优惠券！' : 'New users get $100 coupon on signup!'
						]}
						leftIcon="volume"
						vertical
					/>
					<div className="mt-3">
						<NoticeBar
							textList={[
								isZh
									? '欢迎来到 RTDF 主题生成器，快来定制属于你的专属主题吧！'
									: 'Welcome to RTDF Theme Generator, customize your own theme now!'
							]}
							rightIcon={null}
							leftChild={<span className="text-base">🥳</span>}
						/>
					</div>
				</PreviewBlock>
			);
		}
		if (index === 16) {
			return (
				<PreviewBlock key={index} title={isZh ? '商品分类' : 'Categories'} component="Tab">
					<div className="flex flex-col gap-3">
						<Tab labels={categories} active={activeTab} mx="0" onClickTab={setActiveTab} />
						<Tab labels={categories} active={activeTab} mx="0" lineType onClickTab={setActiveTab} />
					</div>
				</PreviewBlock>
			);
		}
		if (index === 17) {
			return (
				<PreviewBlock key={index} title={isZh ? '购物车商品' : 'Cart Item'} component="Stepper">
					<Card bg="gray" shadow="none" mx="0" my="0" p="3">
						<div className="flex gap-3">
							<div className="rounded-box h-20 w-20 shrink-0 overflow-hidden">
								<img src={randomWallImage} alt="product" className="h-full w-full object-cover" />
							</div>
							<div className="flex flex-1 flex-col justify-between">
								<div>
									<div className="text-sm font-medium">{isZh ? '无线蓝牙耳机 Pro' : 'Wireless Earbuds Pro'}</div>
									<div className="text-text-primary/50 dark:text-text-dark/50 text-xs">
										{isZh ? '颜色：星空黑 | 规格：标准版' : 'Black | Standard'}
									</div>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-primary dark:text-dark font-bold">¥299</span>
									<Stepper value={productCount} min={1} max={10} onChange={setProductCount} />
								</div>
							</div>
						</div>
					</Card>
				</PreviewBlock>
			);
		}
		if (index === 18) {
			return (
				<PreviewBlock key={index} title={isZh ? '账户设置' : 'Account Settings'} component="Cell">
					<div className="overflow-hidden rounded-lg">
						<Cell title={isZh ? '个人资料' : 'Profile'} right="arrow" />
						<Cell title={isZh ? '账户安全' : 'Security'} right="arrow" />
						<Cell title={isZh ? '深色模式' : 'Dark Mode'} right={{ type: 'switch' }} />
					</div>
				</PreviewBlock>
			);
		}
		if (index === 19) {
			return (
				<PreviewBlock key={index} title={isZh ? '加载占位' : 'Skeleton'} component="Skeleton">
					<Card bg="gray" shadow="none" mx="0" my="0" p="3">
						<div className="flex flex-col gap-3">
							<div className="flex gap-3">
								<Skeleton type="img" width="12" height="12" />
								<div className="flex flex-1 flex-col gap-2">
									<Skeleton type="p" width="16" height="2" />
									<Skeleton type="p" width="full" height="2" />
									<Skeleton type="p" width="12" height="2" />
								</div>
							</div>
							<div className="grid grid-cols-5 gap-2">
								{skeletonIconPreviewTypes.map((type) => (
									<div key={type} className="flex min-w-0 flex-col items-center gap-1">
										<Skeleton type={type} width="8" height="8" iconRatio={0.62} />
										<span className="w-full truncate text-center text-xs opacity-60">{type}</span>
									</div>
								))}
							</div>
						</div>
					</Card>
				</PreviewBlock>
			);
		}
		if (index === 20) {
			return (
				<PreviewBlock key={index} title={isZh ? '内容分隔' : 'Divider'} component="Divider">
					<Card bg="gray" shadow="none" mx="0" my="0" px="4" py="3">
						<div className="text-sm">{isZh ? '上方内容' : 'Content above'}</div>
						<Divider text={isZh ? '分隔线' : 'Divider'} />
						<div className="text-sm">{isZh ? '下方内容' : 'Content below'}</div>
					</Card>
				</PreviewBlock>
			);
		}
		if (index === 21) {
			return (
				<PreviewBlock key={index} title={isZh ? '用户头像' : 'User Avatar'} component="Avatar">
					<div className="flex items-end justify-around">
						<Avatar image="/assets/images/home/wall_1.jpg" size="sm" />
						<Avatar image="/assets/images/home/wall_2.jpg" size="base" />
						<Avatar image="/assets/images/home/wall_3.jpg" size="md" />
						<Avatar icon={{ name: 'ri-user-3-line', size: 32 }} size="md" />
					</div>
					<div className="mt-4 pl-4">
						<AvatarGroup
							data={[
								{ image: '/assets/images/home/wall_1.jpg' },
								{ image: '/assets/images/home/wall_2.jpg' },
								{ image: '/assets/images/home/wall_3.jpg' },
								{ image: '/assets/images/home/wall_4.jpg' },
								{ image: '/assets/images/home/avatar_1.jpg' }
							]}
						/>
					</div>
				</PreviewBlock>
			);
		}
		if (index === 22) {
			return (
				<PreviewBlock key={index} title={isZh ? '分页器' : 'Pagination'} component="Pagination">
					<div className="flex flex-col gap-28 pt-20">
						<Pagination total={100} pageSize={10} current={currentPage} maxShowPage={5} showNextOmitPage onChange={setCurrentPage} />
						<Pagination total={100} pageSize={10} current={currentPage2} maxShowPage={5} type="block" onChange={setCurrentPage2} />
					</div>
				</PreviewBlock>
			);
		}
		if (index === 23) {
			return (
				<PreviewBlock key={index} title={isZh ? '数字键盘' : 'NumKeyboard'} component="NumKeyboard">
					<div className="bg-bg-surface dark:bg-bg-surface-dark mb-2 flex h-10 items-center justify-between rounded-sm px-3">
						<span className="text-text-primary/50 dark:text-text-dark/50 text-xs">{isZh ? '输入金额' : 'Amount'}</span>
						<span className="font-bold">{numKeyboardValue || '0.00'}</span>
					</div>
					<NumKeyboard
						value={numKeyboardValue}
						popup={null}
						height="10"
						onClick={(key) => setNumKeyboardValue((prev) => getKeyboardValue(prev, key))}
					/>
				</PreviewBlock>
			);
		}
		if (index === 24) {
			return (
				<PreviewBlock key={index} title={isZh ? '用户协议' : 'Agreement'} component="Checkbox">
					<Checkbox data={checkboxData} checkeds={checkboxValues} onChange={setCheckboxValues} />
				</PreviewBlock>
			);
		}
		if (index === 25) {
			return (
				<PreviewBlock key={index} title={isZh ? '折线图' : 'Line Chart'} component="Extend Colors">
					<Card bg="gray" shadow="none" mx="0" my="0" px="4" py="3">
						<div className="mb-3 flex items-center gap-4">
							{lineLegend.map((legendIndex) => (
								<div key={legendIndex} className="flex items-center gap-1">
									<span className="h-2 w-2 rounded-full" style={{ backgroundColor: getExtendColor(legendIndex) }}></span>
									<span className="text-xs">{extend[legendIndex]?.alias || `C${legendIndex + 1}`}</span>
								</div>
							))}
						</div>
						{renderLineChart()}
					</Card>
				</PreviewBlock>
			);
		}
		if (index === 26) {
			return (
				<PreviewBlock key={index} title={isZh ? '环形图' : 'Donut Chart'} component="Extend Colors">
					<Card bg="gray" shadow="none" mx="0" my="0" px="4" py="4">
						<div className="flex items-center justify-between">
							<div className="flex flex-col gap-2">
								{lineLegend.map((legendIndex) => (
									<div key={legendIndex} className="flex items-center gap-2">
										<span className="h-2 w-2 rounded-full" style={{ backgroundColor: getExtendColor(legendIndex) }}></span>
										<span className="text-xs">
											{extend[legendIndex]?.alias || `C${legendIndex + 1}`}: {[1600, 1000, 400, 200][legendIndex]}
										</span>
									</div>
								))}
							</div>
							{renderPieChart()}
						</div>
					</Card>
				</PreviewBlock>
			);
		}
		if (index === 27) {
			return (
				<PreviewBlock key={index} title={isZh ? '全键盘' : 'Full Keyboard'} component="FullKeyboard">
					<div className="bg-bg-surface dark:bg-bg-surface-dark mb-2 flex h-10 items-center justify-between rounded-sm px-3">
						<span className="text-text-primary/50 dark:text-text-dark/50 text-xs">{isZh ? '输入内容' : 'Input'}</span>
						<span className="font-bold">{fullKeyboardValue || (isZh ? '请输入' : 'Type here')}</span>
					</div>
					<FullKeyboard
						value={fullKeyboardValue}
						popup={null}
						onClick={(key) => setFullKeyboardValue((prev) => getKeyboardValue(prev, key))}
					/>
				</PreviewBlock>
			);
		}
		return (
			<PreviewBlock key={index} title={isZh ? '标签' : 'Tags'} component="Tag">
				<div className="flex flex-wrap gap-2">
					<Tag text={isZh ? '新品' : 'New'} state="success" fill="light" />
					<Tag text={isZh ? '热销' : 'Hot'} state="warning" />
					<Tag text={isZh ? '限时' : 'Limited'} state="error" fill="line" />
					<Tag text={isZh ? '推荐' : 'Featured'} state="theme" />
					<Tag text={isZh ? '中性' : 'Neutral'} state="neutral" fill="light" />
				</div>
			</PreviewBlock>
		);
	};

	return (
		<ConfigProvider builtInIconLibrary={builtInIconLibrary} syncTheme={false}>
			<div
				className={`mx-4 mb-2 overflow-auto rounded-sm border ${
					previewDark ? 'bg-bg-base-dark text-text-dark border-white/10' : 'bg-bg-base text-text-primary border-black/10'
				}`}
				style={previewStyle}
				data-theme="generator-preview"
				data-mode={previewDark ? 'dark' : 'light'}
			>
				<div
					className={`mx-auto px-6 py-5 ${previewDark ? 'bg-bg-base-dark text-text-dark' : 'bg-bg-base text-text-primary'}`}
					style={{
						columns: '300px',
						columnGap: '32px',
						columnRule: '1px solid rgba(128, 128, 128, 0.1)'
					}}
				>
					{componentOrder.map((index) => renderBlock(index))}
				</div>
			</div>
		</ConfigProvider>
	);
};

const GeneratorPage = () => {
	const { lang, currentColor, themeMode, sysTheme, setThemeMode } = useAppContext();
	const isZh = lang === 'zh_CN';
	const resolvedMode = themeMode === 'auto' ? sysTheme : themeMode;
	const [form, setForm] = useState(() => formFromTheme(currentColor, isZh));
	const [activeTab, setActiveTab] = useState<ActiveTab>('preview');
	const [previewDark, setPreviewDark] = useState(resolvedMode === 'dark');
	const [cachedThemes, setCachedThemes] = useState<CachedTheme[]>(() => {
		const saved = localStorage.getItem(cachedThemeKey);
		return saved ? (JSON.parse(saved) as CachedTheme[]) : [];
	});
	const [selectedCachedTheme, setSelectedCachedTheme] = useState<string | null>(null);
	const [cacheWarning, setCacheWarning] = useState('');
	const [copied, setCopied] = useState<CopyTarget>(null);
	const [viewportWidth, setViewportWidth] = useState(() => document.documentElement.clientWidth);
	const [viewportHeight, setViewportHeight] = useState(() => document.documentElement.clientHeight);
	const warningTimer = useRef<number | null>(null);
	const copyTimer = useRef<number | null>(null);

	useEffect(() => {
		setForm(formFromTheme(currentColor, isZh));
		setSelectedCachedTheme(null);
	}, [currentColor, isZh]);

	useEffect(() => {
		setPreviewDark(resolvedMode === 'dark');
	}, [resolvedMode]);

	useEffect(() => {
		const updateSize = () => {
			setViewportWidth(document.documentElement.clientWidth);
			setViewportHeight(document.documentElement.clientHeight);
		};
		window.addEventListener('resize', updateSize);
		return () => window.removeEventListener('resize', updateSize);
	}, []);

	useEffect(() => {
		localStorage.setItem(cachedThemeKey, JSON.stringify(cachedThemes));
	}, [cachedThemes]);

	useEffect(() => {
		return () => {
			if (warningTimer.current) window.clearTimeout(warningTimer.current);
			if (copyTimer.current) window.clearTimeout(copyTimer.current);
		};
	}, []);

	const primaryColors = useMemo(() => buildScaleList(form.primary), [form.primary]);
	const darkColors = useMemo(() => buildScaleList(form.dark), [form.dark]);
	const sidePanelHeight = viewportHeight - 74;
	const previewHeight = viewportHeight - 114;
	const codeBlockHeight = viewportWidth >= 1280 ? viewportHeight - 334 : (viewportHeight - 334) / 2;
	const previewStyle = useMemo(
		() => buildPreviewStyle(form, primaryColors, darkColors, previewHeight),
		[darkColors, form, previewHeight, primaryColors]
	);
	const pluginConfig = useMemo(() => buildPluginConfig(form), [form]);
	const themeConfig = useMemo(() => buildThemeConfig(form, primaryColors, darkColors), [darkColors, form, primaryColors]);
	const setField = <K extends StringFormKey>(field: K, value: GeneratorForm[K]) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		setSelectedCachedTheme(null);
	};

	const setCoreField = (field: 'primary' | 'dark', value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		setSelectedCachedTheme(null);
	};

	const setExtendField = (id: string, key: 'color' | 'alias', value: string) => {
		setForm((prev) => ({
			...prev,
			extend: prev.extend.map((item) => (item.id === id ? { ...item, [key]: value } : item))
		}));
		setSelectedCachedTheme(null);
	};

	const addExtendColor = () => {
		setForm((prev) => ({
			...prev,
			extend: [...prev.extend, { id: `extend-${Date.now()}`, color: 'oklch(0 0 0)', alias: '' }]
		}));
		setSelectedCachedTheme(null);
	};

	const deleteExtendColor = (id: string) => {
		setForm((prev) => ({ ...prev, extend: prev.extend.filter((item) => item.id !== id) }));
		setSelectedCachedTheme(null);
	};

	const showWarning = (text: string) => {
		setCacheWarning(text);
		if (warningTimer.current) window.clearTimeout(warningTimer.current);
		warningTimer.current = window.setTimeout(() => setCacheWarning(''), 2000);
	};

	const randomForm = () => {
		const primaryColor = generateRandomOklchColor('light');
		const darkColor = generateRandomOklchColor('dark');
		const primary = oklchColorToStr(primaryColor);
		const dark = oklchColorToStr(darkColor);
		const baseLightness = randomBetween(0.92, 0.98);
		const bgHue = Math.random() * 360;
		const bgChroma = randomBetween(0.01, 0.04);
		const surfaceLightDiff = randomBetween(0.02, 0.05) * (Math.random() > 0.5 ? 1 : -1);
		const surfaceLightness = Math.max(0.88, Math.min(1, baseLightness + surfaceLightDiff));
		const surfaceHueOffset = randomBetween(10, 30) * (Math.random() > 0.5 ? 1 : -1);
		const surfaceHue = (((bgHue + surfaceHueOffset) % 360) + 360) % 360;
		const overlayLightDiff = randomBetween(0.01, 0.03) * (Math.random() > 0.5 ? 1 : -1);
		const overlayLightness = Math.max(0.88, Math.min(1, baseLightness + overlayLightDiff));
		const baseDarkLightness = randomBetween(0.12, 0.22);
		const bgDarkHue = Math.random() * 360;
		const bgDarkChroma = randomBetween(0.01, 0.04);
		const surfaceDarkDiff = randomBetween(0.05, 0.1) * (Math.random() > 0.5 ? 1 : -1);
		const surfaceDarkLightness = Math.max(0.05, Math.min(0.35, baseDarkLightness + surfaceDarkDiff));
		const surfaceDarkHueOffset = randomBetween(10, 30) * (Math.random() > 0.5 ? 1 : -1);
		const surfaceDarkHue = (((bgDarkHue + surfaceDarkHueOffset) % 360) + 360) % 360;
		const overlayDarkDiff = randomBetween(0.03, 0.06) * (Math.random() > 0.5 ? 1 : -1);
		const overlayDarkLightness = Math.max(0.04, Math.min(0.3, baseDarkLightness + overlayDarkDiff));
		const highlightHue = Math.random() > 0.5 ? primaryColor.h : Math.random() * 360;
		const highlightDarkHue = Math.random() > 0.5 ? darkColor.h : Math.random() * 360;
		const textLightHue = Math.random() * 360;
		const textDarkHue = Math.random() * 360;
		const textLightChroma = randomBetween(0.01, 0.04);
		const textDarkChroma = randomBetween(0.01, 0.04);
		const boxRadius = randomOption(radiusGroups[0].options).value;
		const formRadius = randomOption(radiusGroups[1].options).value;
		const smallRadius = randomOption(radiusGroups[2].options).value;
		setForm((prev) => ({
			...prev,
			name: 'new theme',
			primary,
			dark,
			success: randomOklch([0.55, 0.65], [0.15, 0.22], [140, 160]),
			warning: randomOklch([0.55, 0.65], [0.15, 0.22], [60, 85]),
			error: randomOklch([0.55, 0.65], [0.15, 0.22], [20, 40]),
			info: randomOklch([0.55, 0.65], [0.15, 0.22], [240, 270]),
			bgBase: oklchObjToStr({ l: baseLightness, c: bgChroma, h: bgHue }),
			bgSurface: oklchObjToStr({ l: surfaceLightness, c: bgChroma, h: surfaceHue }),
			bgOverlay: oklchObjToStr({ l: overlayLightness, c: bgChroma, h: bgHue }),
			bgHighlight: oklchObjToStr({ l: randomBetween(0.96, 1), c: Math.random() * 0.02, h: highlightHue }),
			bgBaseDark: oklchObjToStr({ l: baseDarkLightness, c: bgDarkChroma, h: bgDarkHue }),
			bgSurfaceDark: oklchObjToStr({ l: surfaceDarkLightness, c: bgDarkChroma, h: surfaceDarkHue }),
			bgOverlayDark: oklchObjToStr({ l: overlayDarkLightness, c: bgDarkChroma, h: bgDarkHue }),
			bgHighlightDark: oklchObjToStr({ l: randomBetween(0.04, 0.12), c: Math.random() * 0.02, h: highlightDarkHue }),
			textPrimary: oklchObjToStr({ l: randomBetween(0.15, 0.3), c: textLightChroma, h: textLightHue }),
			textDark: oklchObjToStr({ l: randomBetween(0.85, 0.95), c: textDarkChroma, h: textDarkHue }),
			textOnPrimary: oklchObjToStr({ l: randomBetween(0.92, 1), c: textLightChroma * 0.5, h: primaryColor.h }),
			textOnDark: oklchObjToStr({ l: randomBetween(0.08, 0.2), c: textDarkChroma * 0.5, h: darkColor.h }),
			radiusBox: boxRadius,
			radiusForm: formRadius,
			radiusSmall: smallRadius,
			extend: prev.extend.map((_, index) => ({
				id: `extend-${Date.now()}-${index}`,
				color: randomOklch([0.5, 0.7], [0.12, 0.25]),
				alias: `extend${index + 1}`
			}))
		}));
		setSelectedCachedTheme(null);
	};

	const resetForm = () => {
		setForm(formFromTheme(currentColor, isZh));
		setSelectedCachedTheme(null);
	};

	const saveTheme = () => {
		if (!form.name.trim()) {
			showWarning(isZh ? '请输入主题名称' : 'Please enter theme name');
			return;
		}
		if (cachedThemes.some((theme) => theme.name === form.name)) {
			showWarning(isZh ? '主题名称已存在' : 'Theme name already exists');
			return;
		}
		if (cachedThemes.length >= 10) {
			showWarning(isZh ? '最多缓存 10 个主题' : 'Maximum 10 themes');
			return;
		}
		const theme: CachedTheme = {
			name: form.name,
			form,
			primaryColor: form.primary,
			darkColor: form.dark,
			bgLightColor: form.bgBase,
			bgDarkColor: form.bgBaseDark
		};
		setCachedThemes((prev) => [theme, ...prev]);
	};

	const applyCachedTheme = (theme: CachedTheme) => {
		setForm({
			...theme.form,
			builtInIconLibrary: theme.form.builtInIconLibrary || defaultBuiltInIconLibrary
		});
		setSelectedCachedTheme(theme.name);
	};

	const deleteCachedTheme = (themeName: string) => {
		setCachedThemes((prev) => prev.filter((theme) => theme.name !== themeName));
		if (selectedCachedTheme === themeName) setSelectedCachedTheme(null);
	};

	const copyCode = async (code: string, target: CopyTarget) => {
		await navigator.clipboard.writeText(code);
		setCopied(target);
		if (copyTimer.current) window.clearTimeout(copyTimer.current);
		copyTimer.current = window.setTimeout(() => setCopied(null), 2000);
	};

	const setSiteMode = (isDark: boolean) => {
		setThemeMode(isDark ? 'dark' : 'light');
	};

	const toggleSiteMode = () => {
		setSiteMode(!previewDark);
	};

	return (
		<div className="w-full">
			<div className="block md:hidden">{isZh ? '请在桌面端使用！' : 'Please use it on the desktop!'}</div>
			<div className="mb-2 hidden justify-between md:flex">
				<aside className="w-52 shrink-0 overflow-y-auto overflow-x-hidden pb-2 pr-2 pt-2" style={{ height: `${sidePanelHeight}px` }}>
					<div className="flex items-center gap-2">
						<div className="shrink-0 text-xs">{isZh ? '名称' : 'Name'}</div>
						<input
							className="focus:outline-primary dark:focus:outline-dark w-full rounded-xs bg-transparent px-2 py-1 text-xs outline outline-black/10 dark:outline-white/20"
							type="text"
							value={form.name}
							maxLength={10}
							placeholder={isZh ? '请输入主题名称' : 'Please enter theme name'}
							onChange={(event) => setField('name', event.target.value)}
						/>
					</div>

					<div className="mt-2 flex flex-col gap-1">
						<SectionTitle title={isZh ? '颜色' : 'Colors'} icon={<ColorSectionIcon />} className="" />

						<div className="mt-1 text-center text-xs text-black/50 dark:text-white/50">{isZh ? '主题色' : 'Theme colors'}</div>
						<div className="flex gap-1">
							<div className="flex flex-1 flex-col items-center gap-0.5">
								<ColorPickerButton
									value={form.primary}
									size="md"
									showContrast
									contrastTarget="oklch(1 0 0)"
									onOpen={() => setSiteMode(false)}
									onChange={(value) => setCoreField('primary', value)}
								/>
								<span className="leading-none text-xs text-black/50 dark:text-white/50">primary</span>
							</div>
							<div className="flex flex-1 flex-col items-center gap-0.5">
								<ColorPickerButton
									value={form.dark}
									size="md"
									showContrast
									contrastTarget="oklch(0 0 0)"
									onOpen={() => setSiteMode(true)}
									onChange={(value) => setCoreField('dark', value)}
								/>
								<span className="leading-none text-xs text-black/50 dark:text-white/50">dark</span>
							</div>
						</div>

						<div className="mt-2 flex items-center justify-center gap-1">
							<span className="text-center text-xs text-black/50 dark:text-white/50">{isZh ? '背景色' : 'Background'}</span>
							<div className="group/bg relative">
								<InfoTipIcon className="h-3 w-3 cursor-help text-black/30 dark:text-white/30" />
								<div className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 w-36 -translate-x-1/2 rounded bg-black px-2 py-1.5 text-xs leading-relaxed text-white opacity-0 transition-opacity group-hover/bg:opacity-100 dark:bg-white dark:text-black">
									{isZh ? (
										<PanelHelp>
											<div>
												<b>base</b> 页面基础背景
											</div>
											<div>
												<b>surface</b> 卡片/容器表面
											</div>
											<div>
												<b>overlay</b> 弹窗/浮层背景
											</div>
											<div>
												<b>highlight</b> 高亮元素背景
											</div>
											<div className="pt-1 text-white/70 dark:text-black/60">亮色模式用浅色，暗色 (-D) 用深色</div>
										</PanelHelp>
									) : (
										<PanelHelp>
											<div>
												<b>base</b> Page background
											</div>
											<div>
												<b>surface</b> Card / container
											</div>
											<div>
												<b>overlay</b> Popup / modal
											</div>
											<div>
												<b>highlight</b> Highlight elements
											</div>
											<div className="pt-1 text-white/70 dark:text-black/60">Light mode: light, Dark (-D): dark</div>
										</PanelHelp>
									)}
								</div>
							</div>
						</div>
						<div className="mt-1 flex gap-1">
							{backgroundFields.slice(0, 4).map((field) => (
								<div key={field.key} className="flex flex-1 flex-col items-center gap-0.5">
									<ColorPickerButton
										value={form[field.key]}
										showContrast
										contrastTarget={form.textPrimary}
										onOpen={() => setSiteMode(false)}
										onChange={(value) => setField(field.key, value)}
									/>
									<span className="leading-none text-xs text-black/50 dark:text-white/50">{field.label}</span>
								</div>
							))}
						</div>
						<div className="mt-1 flex gap-1">
							{backgroundFields.slice(4).map((field) => (
								<div key={field.key} className="flex flex-1 flex-col items-center gap-0.5">
									<ColorPickerButton
										value={form[field.key]}
										showContrast
										contrastTarget={form.textDark}
										onOpen={() => setSiteMode(true)}
										onChange={(value) => setField(field.key, value)}
									/>
									<span className="leading-none text-xs text-black/50 dark:text-white/50">{field.label}</span>
								</div>
							))}
						</div>

						<div className="mt-2 flex items-center justify-center gap-1">
							<span className="text-center text-xs text-black/50 dark:text-white/50">{isZh ? '文字色' : 'Text'}</span>
							<div className="group/text relative">
								<InfoTipIcon className="h-3 w-3 cursor-help text-black/30 dark:text-white/30" />
								<div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 w-36 -translate-x-1/2 rounded bg-black px-2 py-1.5 text-xs leading-relaxed text-white opacity-0 transition-opacity group-hover/text:opacity-100 dark:bg-white dark:text-black">
									{isZh ? (
										<PanelHelp>
											<div>
												<b>primary</b> 亮色模式全局文字（深色）
											</div>
											<div>
												<b>onPri</b> 亮色主题色上文字（浅色）
											</div>
											<div>
												<b>dark</b> 暗色模式全局文字（浅色）
											</div>
											<div>
												<b>onDark</b> 暗色主题色上文字（深色）
											</div>
										</PanelHelp>
									) : (
										<PanelHelp>
											<div>
												<b>primary</b> Primary mode text (dark)
											</div>
											<div>
												<b>onPri</b> On primary in primary (light)
											</div>
											<div>
												<b>dark</b> Dark mode text (light)
											</div>
											<div>
												<b>onDark</b> On dark in dark (dark)
											</div>
										</PanelHelp>
									)}
								</div>
							</div>
						</div>
						<div className="mt-1 flex gap-0.5">
							<div className="flex flex-1 flex-col items-center gap-0.5">
								<ColorPickerButton
									value={form.textPrimary}
									textPreviewBg={form.bgBase}
									showContrast
									contrastTarget={form.bgBase}
									onOpen={() => setSiteMode(false)}
									onChange={(value) => setField('textPrimary', value)}
								/>
								<span className="leading-none text-xs text-black/50 dark:text-white/50">primary</span>
							</div>
							<div className="flex flex-1 flex-col items-center gap-0.5">
								<ColorPickerButton
									value={form.textOnPrimary}
									textPreviewBg={form.primary}
									showContrast
									contrastTarget={form.primary}
									onOpen={() => setSiteMode(false)}
									onChange={(value) => setField('textOnPrimary', value)}
								/>
								<span className="leading-none text-xs text-black/50 dark:text-white/50">onPri</span>
							</div>
							<div className="flex flex-1 flex-col items-center gap-0.5">
								<ColorPickerButton
									value={form.textDark}
									textPreviewBg={form.bgBaseDark}
									showContrast
									contrastTarget={form.bgBaseDark}
									onOpen={() => setSiteMode(true)}
									onChange={(value) => setField('textDark', value)}
								/>
								<span className="leading-none text-xs text-black/50 dark:text-white/50">dark</span>
							</div>
							<div className="flex flex-1 flex-col items-center gap-0.5">
								<ColorPickerButton
									value={form.textOnDark}
									textPreviewBg={form.dark}
									showContrast
									contrastTarget={form.dark}
									onOpen={() => setSiteMode(true)}
									onChange={(value) => setField('textOnDark', value)}
								/>
								<span className="leading-none text-xs text-black/50 dark:text-white/50">onDark</span>
							</div>
						</div>

						<div className="mt-2 text-center text-xs text-black/50 dark:text-white/50">{isZh ? '功能色' : 'Functional colors'}</div>
						<div className="flex gap-1">
							{functionColorFields.map((field) => (
								<div key={field.key} className="flex flex-1 flex-col items-center gap-0.5">
									<ColorPickerButton value={form[field.key]} onChange={(value) => setField(field.key, value)} />
									<span className="leading-none text-xs text-black/50 dark:text-white/50">{field.key}</span>
								</div>
							))}
						</div>

						<div className="mt-2 flex items-center justify-center gap-2">
							<div className="text-center text-xs text-black/50 dark:text-white/50">{isZh ? '扩展色' : 'Extended colors'}</div>
							<button
								className="cursor-pointer rounded-sm bg-black/5 px-1 dark:bg-white/10"
								onClick={addExtendColor}
								type="button"
								aria-label={isZh ? '新增扩展色' : 'Add extended color'}
							>
								<svg className="h-3 w-3 transition-all hover:scale-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
									<path className="fill-black dark:fill-white" d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
								</svg>
							</button>
						</div>
						<div className="flex flex-col gap-1">
							{form.extend.map((item, index) => (
								<div key={item.id} className="flex items-center gap-2">
									<ColorPickerButton
										ariaLabel={`extend${index}`}
										value={item.color}
										compact
										onChange={(value) => setExtendField(item.id, 'color', value)}
									/>
									<input
										className="focus:outline-primary dark:focus:outline-dark h-6 min-w-0 flex-1 rounded-xs bg-transparent px-1 py-1 text-xs outline outline-black/10 dark:outline-white/20"
										type="text"
										value={item.alias}
										placeholder={isZh ? '别名' : 'alias'}
										onChange={(event) => setExtendField(item.id, 'alias', event.target.value)}
									/>
									<button
										className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-sm bg-black/5 dark:bg-white/10"
										onClick={() => deleteExtendColor(item.id)}
										type="button"
										aria-label={isZh ? '删除扩展色' : 'Delete extended color'}
									>
										<svg className="h-3 w-3 transition-all hover:scale-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
											<path
												className="fill-error"
												d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"
											></path>
										</svg>
									</button>
								</div>
							))}
						</div>

						<SectionTitle
							title={isZh ? '圆角' : 'Radius'}
							icon={<RadiusSectionIcon />}
							help={isZh ? '全局配置后，组件仍可通过 API 单独自定义。' : 'After global config, components can still customize via API.'}
						/>
						{radiusGroups.map((group) => (
							<RadiusGrid
								key={group.key}
								group={group}
								value={form[group.key]}
								isZh={isZh}
								onChange={(value) => setField(group.key, value)}
							/>
						))}
						<SectionTitle title={isZh ? '内置图标' : 'Built-in icons'} className="mt-3" />
						<div className="mt-2 grid grid-cols-2 gap-1">
							{builtInIconLibraryList.map((item) => {
								const label = builtInIconLibraryLabelMap[item];
								return (
									<button
										key={item}
										type="button"
										className={`cursor-pointer rounded-sm border px-3 py-1.5 text-xs transition-all ${
											form.builtInIconLibrary === item
												? 'border-primary bg-primary/10 text-primary dark:border-dark dark:bg-dark/10 dark:text-dark'
												: 'border-gray-100 text-black/70 dark:border-gray-700 dark:text-white/70'
										}`}
										onClick={() => setField('builtInIconLibrary', item)}
									>
										{label}
									</button>
								);
							})}
						</div>
					</div>
				</aside>

				<main className="min-w-0 flex-1 overflow-hidden">
					<div className="flex h-10 items-center justify-between gap-2 px-4">
						<div className="flex min-w-0 flex-1 items-center gap-2">
							<div className="flex shrink-0 gap-1 rounded-md bg-black/5 p-1 dark:bg-white/5">
								<button
									onClick={() => setActiveTab('preview')}
									className={`flex cursor-pointer items-center gap-1 rounded px-3 py-1 text-xs font-medium transition-colors ${
										activeTab === 'preview' ? 'bg-bg-highlight dark:bg-bg-highlight-dark shadow-sm' : 'opacity-60 hover:opacity-100'
									}`}
									type="button"
								>
									<Icon name="ri-eye-line" size={14} />
									{isZh ? '预览' : 'Preview'}
								</button>
								<button
									onClick={() => setActiveTab('palette')}
									className={`flex cursor-pointer items-center gap-1 rounded px-3 py-1 text-xs font-medium transition-colors ${
										activeTab === 'palette' ? 'bg-bg-highlight dark:bg-bg-highlight-dark shadow-sm' : 'opacity-60 hover:opacity-100'
									}`}
									type="button"
								>
									<Icon name="ri-palette-line" size={14} />
									{isZh ? '配置' : 'Config'}
								</button>
							</div>
							<button
								className="flex cursor-pointer items-center gap-1 rounded-sm bg-black/5 px-3 py-1.5 text-xs hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
								onClick={toggleSiteMode}
								aria-label={previewDark ? (isZh ? '切换到亮色' : 'Switch to light') : isZh ? '切换到暗色' : 'Switch to dark'}
								type="button"
							>
								<Icon name={previewDark ? 'ri-sun-line' : 'ri-moon-line'} size={16} />
								{previewDark ? (isZh ? '亮色' : 'Light') : isZh ? '暗色' : 'Dark'}
							</button>
							<button
								className="flex cursor-pointer items-center gap-1 rounded-sm bg-black/5 px-3 py-1.5 text-xs hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
								onClick={randomForm}
								type="button"
							>
								<Icon name="ri-dice-line" size={14} />
								{isZh ? '随机' : 'Random'}
							</button>
							<button
								className="flex cursor-pointer items-center gap-1 rounded-sm bg-black/5 px-3 py-1.5 text-xs hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
								onClick={resetForm}
								type="button"
							>
								<Icon name="ri-refresh-line" size={14} />
								{isZh ? '重置' : 'Reset'}
							</button>
							<button
								className="flex cursor-pointer items-center gap-1 rounded-sm bg-black/5 px-3 py-1.5 text-xs hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
								onClick={saveTheme}
								type="button"
							>
								<Icon name="ri-save-line" size={14} />
								{isZh ? '暂存' : 'Cache'}
							</button>
							{cacheWarning ? <span className="text-error shrink-0 text-xs">{cacheWarning}</span> : null}
							<div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-2">
								{cachedThemes.map((theme) => (
									<div
										key={theme.name}
										className={`group relative flex shrink-0 cursor-pointer items-center gap-1 rounded-md border px-2 py-1 transition-all ${
											selectedCachedTheme === theme.name
												? 'border-primary bg-primary/10 dark:border-dark dark:bg-dark/10'
												: 'border-black/10 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5'
										}`}
										onClick={() => applyCachedTheme(theme)}
										role="button"
										tabIndex={0}
										onKeyDown={(event) => event.key === 'Enter' && applyCachedTheme(theme)}
									>
										<span
											className={`max-w-16 truncate text-xs ${selectedCachedTheme === theme.name ? 'text-primary dark:text-dark font-medium' : ''}`}
										>
											{theme.name}
										</span>
										<div className="flex h-5 w-7 overflow-hidden rounded-sm border border-black/5 dark:border-white/5">
											<div className="relative flex-1" style={{ backgroundColor: theme.bgLightColor }}>
												<div
													className="absolute bottom-0.5 left-0.5 h-2 w-2 rounded-sm"
													style={{ backgroundColor: theme.primaryColor }}
												></div>
											</div>
											<div className="relative flex-1" style={{ backgroundColor: theme.bgDarkColor }}>
												<div
													className="absolute right-0.5 bottom-0.5 h-2 w-2 rounded-sm"
													style={{ backgroundColor: theme.darkColor }}
												></div>
											</div>
										</div>
										<button
											className="bg-error absolute -top-1.5 -right-1.5 hidden h-4 w-4 cursor-pointer items-center justify-center rounded-full text-white group-hover:flex"
											onClick={(event) => {
												event.stopPropagation();
												deleteCachedTheme(theme.name);
											}}
											type="button"
											aria-label={isZh ? '删除主题' : 'Delete theme'}
										>
											<Icon name="ri-close-line" size={10} />
										</button>
									</div>
								))}
							</div>
						</div>
					</div>

					{activeTab === 'preview' ? (
						<PreviewPanel
							isZh={isZh}
							previewDark={previewDark}
							previewStyle={previewStyle}
							builtInIconLibrary={form.builtInIconLibrary}
							extend={form.extend}
						/>
					) : (
						<div className="flex flex-col px-4" style={{ height: `${previewHeight}px` }}>
							<PaletteRow title="primary" colors={primaryColors} />
							<PaletteRow title="dark" colors={darkColors} />
							<div className="mt-1 flex gap-1 text-center text-xs">
								<div className="flex flex-1 gap-1">
									<div className="flex flex-1 flex-col gap-1 rounded-sm border border-black/10 p-1 dark:border-white/10">
										<div className="text-center text-xs text-black/50 dark:text-white/50">{isZh ? '亮色背景' : 'Light BG'}</div>
										<div className="flex gap-1">
											{backgroundFields.slice(0, 4).map((field) => (
												<div key={field.key} className="flex flex-1 flex-col items-center gap-0.5">
													<div className="h-6 w-full rounded-sm border border-black/10" style={{ backgroundColor: form[field.key] }}></div>
													<span className="text-xs text-black/50 dark:text-white/50">{field.label}</span>
												</div>
											))}
										</div>
									</div>
									<div className="flex flex-1 flex-col gap-1 rounded-sm border border-black/10 p-1 dark:border-white/10">
										<div className="text-center text-xs text-black/50 dark:text-white/50">{isZh ? '暗色背景' : 'Dark BG'}</div>
										<div className="flex gap-1">
											{backgroundFields.slice(4).map((field, index) => (
												<div key={field.key} className="flex flex-1 flex-col items-center gap-0.5">
													<div className="h-6 w-full rounded-sm border border-white/10" style={{ backgroundColor: form[field.key] }}></div>
													<span className="text-xs text-black/50 dark:text-white/50">
														{['base', 'surface', 'overlay', 'highlight'][index]}
													</span>
												</div>
											))}
										</div>
									</div>
								</div>
								<div className="flex flex-1 flex-col gap-1 rounded-sm border border-black/10 p-1 dark:border-white/10">
									<div className="text-center text-xs text-black/50 dark:text-white/50">{isZh ? '文字色' : 'Text'}</div>
									<div className="flex gap-1">
										<div className="flex flex-1 flex-col items-center gap-0.5">
											<div
												className="flex h-6 w-full items-center justify-center rounded-sm border border-black/10 text-sm font-bold"
												style={{ backgroundColor: form.bgBase, color: form.textPrimary }}
											>
												A
											</div>
											<span className="text-xs text-black/50 dark:text-white/50">light</span>
										</div>
										<div className="flex flex-1 flex-col items-center gap-0.5">
											<div
												className="flex h-6 w-full items-center justify-center rounded-sm border border-white/10 text-sm font-bold"
												style={{ backgroundColor: form.bgBaseDark, color: form.textDark }}
											>
												A
											</div>
											<span className="text-xs text-black/50 dark:text-white/50">dark</span>
										</div>
										<div className="flex flex-1 flex-col items-center gap-0.5">
											<div
												className="flex h-6 w-full items-center justify-center rounded-sm border border-black/10 text-sm font-bold"
												style={{ backgroundColor: form.primary, color: form.textOnPrimary }}
											>
												A
											</div>
											<span className="text-xs text-black/50 dark:text-white/50">onPri-L</span>
										</div>
										<div className="flex flex-1 flex-col items-center gap-0.5">
											<div
												className="flex h-6 w-full items-center justify-center rounded-sm border border-black/10 text-sm font-bold"
												style={{ backgroundColor: form.dark, color: form.textOnDark }}
											>
												A
											</div>
											<span className="text-xs text-black/50 dark:text-white/50">onDark</span>
										</div>
									</div>
								</div>
							</div>
							<div className="mt-1 flex justify-between gap-1 text-center text-xs">
								{functionColorFields.map((field) => (
									<div
										key={field.key}
										className="h-12 flex-1 rounded-sm pt-4"
										style={{ backgroundColor: form[field.key], color: getContrastTextColor(form[field.key]) }}
									>
										{field.key}
									</div>
								))}
								{form.extend.map((item, index) => (
									<div
										key={item.id}
										className="flex h-12 flex-1 flex-col justify-center gap-1 rounded-sm py-1"
										style={{ backgroundColor: item.color, color: getContrastTextColor(item.color) }}
									>
										<div className="text-xs">extend{index}</div>
										<div>{item.alias}</div>
									</div>
								))}
							</div>
							<div className="mt-1 flex flex-1 flex-col gap-1 xl:flex-row">
								<CodeBlock
									code={pluginConfig}
									copied={copied === 'plugin'}
									height={codeBlockHeight}
									isZh={isZh}
									onCopy={() => copyCode(pluginConfig, 'plugin')}
								/>
								<CodeBlock
									code={themeConfig}
									copied={copied === 'theme'}
									height={codeBlockHeight}
									isZh={isZh}
									onCopy={() => copyCode(themeConfig, 'theme')}
								/>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
};

export default GeneratorPage;
