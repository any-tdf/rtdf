import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Avatar, Badge, Button, Card, Cell, Icon, Loading, NoticeBar, Progress, Rate, Slider, Stepper, Switch, Tab } from 'rtdf/components';
import { generateColorScale, themes as rtdfThemes } from 'rtdf/theme';
import { themeLabels } from '../../data/homeData';
import { useAppContext } from '../../store/appStore';
import { normalizeThemeName } from '../../utils/theme';

type ThemeWithLabel = (typeof rtdfThemes)[0] & { label: string };

const generateLightLayerStyles = (theme: ThemeWithLabel | undefined): CSSProperties => {
	if (!theme?.['color-primary'] || !theme?.['color-dark']) return {};
	const primaryScale = generateColorScale(theme['color-primary']);

	return {
		'--color-primary-50': primaryScale[50],
		'--color-primary-100': primaryScale[100],
		'--color-primary-200': primaryScale[200],
		'--color-primary-300': primaryScale[300],
		'--color-primary-400': primaryScale[400],
		'--color-primary-500': primaryScale[500],
		'--color-primary': primaryScale[600],
		'--color-primary-700': primaryScale[700],
		'--color-primary-800': primaryScale[800],
		'--color-primary-900': primaryScale[900],
		'--color-primary-950': primaryScale[950],
		'--color-dark-50': primaryScale[50],
		'--color-dark-100': primaryScale[100],
		'--color-dark-200': primaryScale[200],
		'--color-dark-300': primaryScale[300],
		'--color-dark-400': primaryScale[400],
		'--color-dark-500': primaryScale[500],
		'--color-dark': primaryScale[600],
		'--color-dark-700': primaryScale[700],
		'--color-dark-800': primaryScale[800],
		'--color-dark-900': primaryScale[900],
		'--color-dark-950': primaryScale[950],
		'--color-bg-base': theme['color-bg-base'],
		'--color-bg-surface': theme['color-bg-surface'],
		'--color-bg-overlay': theme['color-bg-overlay'],
		'--color-bg-highlight': theme['color-bg-highlight'],
		'--color-bg-base-dark': theme['color-bg-base'],
		'--color-bg-surface-dark': theme['color-bg-surface'],
		'--color-bg-overlay-dark': theme['color-bg-overlay'],
		'--color-bg-highlight-dark': theme['color-bg-highlight'],
		'--color-text-primary': theme['color-text-primary'],
		'--color-text-dark': theme['color-text-primary'],
		'--color-text-on-primary': theme['color-text-on-primary'],
		'--color-text-on-dark': theme['color-text-on-primary'],
		'--color-success': theme['color-success'],
		'--color-warning': theme['color-warning'],
		'--color-error': theme['color-error'],
		'--color-info': theme['color-info'],
		'--radius-box': theme['radius-box'],
		'--radius-form': theme['radius-form'],
		'--radius-small': theme['radius-small']
	} as CSSProperties;
};

const generateDarkLayerStyles = (theme: ThemeWithLabel | undefined): CSSProperties => {
	if (!theme?.['color-primary'] || !theme?.['color-dark']) return {};
	const darkScale = generateColorScale(theme['color-dark']);

	return {
		'--color-primary-50': darkScale[50],
		'--color-primary-100': darkScale[100],
		'--color-primary-200': darkScale[200],
		'--color-primary-300': darkScale[300],
		'--color-primary-400': darkScale[400],
		'--color-primary-500': darkScale[500],
		'--color-primary': darkScale[600],
		'--color-primary-700': darkScale[700],
		'--color-primary-800': darkScale[800],
		'--color-primary-900': darkScale[900],
		'--color-primary-950': darkScale[950],
		'--color-dark-50': darkScale[50],
		'--color-dark-100': darkScale[100],
		'--color-dark-200': darkScale[200],
		'--color-dark-300': darkScale[300],
		'--color-dark-400': darkScale[400],
		'--color-dark-500': darkScale[500],
		'--color-dark': darkScale[600],
		'--color-dark-700': darkScale[700],
		'--color-dark-800': darkScale[800],
		'--color-dark-900': darkScale[900],
		'--color-dark-950': darkScale[950],
		'--color-bg-base': theme['color-bg-base-dark'],
		'--color-bg-surface': theme['color-bg-surface-dark'],
		'--color-bg-overlay': theme['color-bg-overlay-dark'],
		'--color-bg-highlight': theme['color-bg-highlight-dark'],
		'--color-bg-base-dark': theme['color-bg-base-dark'],
		'--color-bg-surface-dark': theme['color-bg-surface-dark'],
		'--color-bg-overlay-dark': theme['color-bg-overlay-dark'],
		'--color-bg-highlight-dark': theme['color-bg-highlight-dark'],
		'--color-text-primary': theme['color-text-dark'],
		'--color-text-dark': theme['color-text-dark'],
		'--color-text-on-primary': theme['color-text-on-dark'],
		'--color-text-on-dark': theme['color-text-on-dark'],
		'--color-success': theme['color-success'],
		'--color-warning': theme['color-warning'],
		'--color-error': theme['color-error'],
		'--color-info': theme['color-info'],
		'--radius-box': theme['radius-box'],
		'--radius-form': theme['radius-form'],
		'--radius-small': theme['radius-small']
	} as CSSProperties;
};

const ThemeSystem = () => {
	const { lang } = useAppContext();
	const isZh = lang === 'zh_CN';

	const themes = useMemo<ThemeWithLabel[]>(
		() =>
			rtdfThemes.map((theme) => ({
				...theme,
				label: isZh ? themeLabels[theme.name] || theme.name : theme.name
			})),
		[isZh]
	);

	const [currentTheme, setCurrentTheme] = useState(() => normalizeThemeName(localStorage.getItem('theme_color')));
	const previewRef = useRef<HTMLDivElement | null>(null);
	const sectionRef = useRef<HTMLElement | null>(null);
	const isDraggingRef = useRef(false);
	const [switchActive, setSwitchActive] = useState(true);
	const [cellSwitchActive, setCellSwitchActive] = useState(false);
	const [sliderValue, setSliderValue] = useState(65);
	const [stepperValue, setStepperValue] = useState(3);
	const [isVisible, setIsVisible] = useState(false);

	const randomLoadingTypes = useMemo(() => {
		const types = Array.from({ length: 54 }, (_, i) => `1_${i}`);
		return types.sort(() => Math.random() - 0.5).slice(0, 5);
	}, []);

	const currentThemeData = useMemo(() => themes.find((t) => t.name === currentTheme) || themes[0], [currentTheme, themes]);

	const currentThemeColors = useMemo(() => {
		if (!currentThemeData?.['color-primary'] || !currentThemeData?.['color-dark']) {
			return {
				primary: '',
				dark: '',
				success: '',
				warning: '',
				error: '',
				info: '',
				bgBase: '',
				bgSurface: '',
				bgOverlay: '',
				bgHighlight: '',
				bgBaseDark: '',
				bgSurfaceDark: '',
				bgOverlayDark: '',
				bgHighlightDark: '',
				textPrimary: '',
				textDark: '',
				textOnPrimary: '',
				textOnDark: '',
				radiusBox: '',
				radiusForm: '',
				radiusSmall: ''
			};
		}
		return {
			primary: currentThemeData['color-primary'],
			dark: currentThemeData['color-dark'],
			success: currentThemeData['color-success'],
			warning: currentThemeData['color-warning'],
			error: currentThemeData['color-error'],
			info: currentThemeData['color-info'],
			bgBase: currentThemeData['color-bg-base'],
			bgSurface: currentThemeData['color-bg-surface'],
			bgOverlay: currentThemeData['color-bg-overlay'],
			bgHighlight: currentThemeData['color-bg-highlight'],
			bgBaseDark: currentThemeData['color-bg-base-dark'],
			bgSurfaceDark: currentThemeData['color-bg-surface-dark'],
			bgOverlayDark: currentThemeData['color-bg-overlay-dark'],
			bgHighlightDark: currentThemeData['color-bg-highlight-dark'],
			textPrimary: currentThemeData['color-text-primary'],
			textDark: currentThemeData['color-text-dark'],
			textOnPrimary: currentThemeData['color-text-on-primary'],
			textOnDark: currentThemeData['color-text-on-dark'],
			radiusBox: currentThemeData['radius-box'],
			radiusForm: currentThemeData['radius-form'],
			radiusSmall: currentThemeData['radius-small']
		};
	}, [currentThemeData]);

	const lightLayerStyles = useMemo(() => generateLightLayerStyles(currentThemeData), [currentThemeData]);
	const darkLayerStyles = useMemo(() => generateDarkLayerStyles(currentThemeData), [currentThemeData]);
	const noticeTextList = useMemo(
		() => [
			isZh
				? '欢迎使用 RTDF 组件库，简单、快速、高效的移动端组件库。支持 React 19，基于 Tailwind CSS 4，祝您使用愉快！'
				: 'Welcome to RTDF, a simple, fast, and efficient mobile component library. Supports React 19, built on Tailwind CSS 4. Enjoy your development!'
		],
		[isZh]
	);

	const updateSplitPosition = (event: React.PointerEvent<HTMLDivElement>) => {
		if (!previewRef.current) return;
		const rect = previewRef.current.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const percent = Math.min(Math.max((x / rect.width) * 100, 2), 98);
		previewRef.current.style.setProperty('--theme-preview-split', `${percent}%`);
	};

	useEffect(() => {
		const handleKeydown = (event: KeyboardEvent) => {
			if (!isVisible) return;
			if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
				event.preventDefault();
				const currentIndex = themes.findIndex((t) => t.name === currentTheme);
				const nextIndex =
					event.key === 'ArrowLeft'
						? currentIndex <= 0
							? themes.length - 1
							: currentIndex - 1
						: currentIndex >= themes.length - 1
							? 0
							: currentIndex + 1;
				setCurrentTheme(themes[nextIndex].name);
			}
		};

		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	}, [currentTheme, isVisible, themes]);

	useEffect(() => {
		const node = sectionRef.current;
		if (!node) return;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					setIsVisible(entry.isIntersecting);
				});
			},
			{ threshold: 0.3 }
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
		isDraggingRef.current = true;
		event.currentTarget.setPointerCapture(event.pointerId);
		updateSplitPosition(event);
	};

	const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
		if (!isDraggingRef.current) return;
		updateSplitPosition(event);
	};

	const handlePointerUp = () => {
		isDraggingRef.current = false;
	};

	return (
		<section ref={sectionRef} className="relative overflow-hidden py-8">
			<div className="relative z-10 mx-auto">
				<div className="mb-12 text-center">
					<div className="border-primary/20 bg-primary/5 text-primary dark:border-dark/20 dark:bg-dark/5 dark:text-dark mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm">
						<svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 3.09735L7.05025 8.04709C4.31658 10.7808 4.31658 15.2129 7.05025 17.9466C9.78392 20.6803 14.2161 20.6803 16.9497 17.9466C19.6834 15.2129 19.6834 10.7808 16.9497 8.0471L12 3.09735ZM12 0.268921L18.364 6.63288C21.8787 10.1476 21.8787 15.8461 18.364 19.3608C14.8492 22.8755 9.15076 22.8755 5.63604 19.3608C2.12132 15.8461 2.12132 10.1476 5.63604 6.63288L12 0.268921ZM7 12.9968H17C17 15.7583 14.7614 17.9968 12 17.9968C9.23858 17.9968 7 15.7583 7 12.9968Z" />
						</svg>
						<span>{isZh ? '主题系统' : 'Theme System'}</span>
					</div>

					<h2 className="mb-4 bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-3xl font-bold text-transparent md:text-4xl dark:from-white dark:via-gray-300 dark:to-white">
						{isZh ? '无限主题，双色适配' : 'Infinite Themes, Dual Colors'}
					</h2>
					<p className="mx-auto max-w-2xl text-base opacity-70">
						{isZh
							? '每个主题都包含亮色和暗色两种配色，自动适配系统偏好。'
							: 'Each theme includes both light and dark color schemes, automatically adapting to system preferences.'}
					</p>
				</div>

				<div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-center lg:gap-16">
					<div className="flex w-full max-w-3xl flex-col gap-4 lg:w-auto">
						<div className="text-center lg:text-left">
							<div className="flex items-center justify-center gap-2 lg:justify-start">
								<span className="text-xl font-bold text-gray-800 dark:text-gray-200">{isZh ? '42 套内置主题' : '42 Built-in Themes'}</span>
								<div className="group relative hidden md:block">
									<svg
										className="size-4 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M4 5C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18V6C21 5.44772 20.5523 5 20 5H4ZM1 6C1 4.34315 2.34315 3 4 3H20C21.6569 3 23 4.34315 23 6V18C23 19.6569 21.6569 21 20 21H4C2.34315 21 1 19.6569 1 18V6ZM6 13H8V15H6V13ZM10 13H14V15H10V13ZM16 13H18V15H16V13ZM5 9H7V11H5V9ZM9 9H11V11H9V9ZM13 9H15V11H13V9ZM17 9H19V11H17V9Z" />
									</svg>
									<div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-lg bg-gray-800 px-3 py-1.5 text-xs whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-gray-700">
										{isZh ? '按 ← → 键切换主题' : 'Press ← → to switch themes'}
										<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800 dark:border-t-gray-700"></div>
									</div>
								</div>
							</div>
							<div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
								{isZh ? '点击选择，拖动对比亮暗效果' : 'Click to select, drag to compare light/dark'}
							</div>
						</div>

						<div className="grid grid-cols-6 gap-x-1.5 gap-y-2">
							{themes.map((theme) => (
								<button
									key={theme.name}
									type="button"
									onClick={() => setCurrentTheme(theme.name)}
									className={`group relative flex flex-col items-center gap-1.5 rounded p-1.5 transition-all duration-300 ${
										currentTheme === theme.name ? 'bg-gray-100 shadow-sm dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
									}`}
								>
									{currentTheme === theme.name ? (
										<div className="border-primary dark:border-dark absolute -inset-px rounded border-2"></div>
									) : null}
									<div
										className={`relative flex h-6 w-full overflow-hidden rounded shadow-sm transition-transform duration-300 group-hover:scale-105 ${
											currentTheme === theme.name ? 'scale-105' : ''
										}`}
									>
										<div className="flex w-1/2 items-center justify-center bg-gray-100">
											<div className="size-2.5 rounded-full" style={{ background: theme['color-primary'] }}></div>
										</div>
										<div className="flex w-1/2 items-center justify-center bg-gray-800">
											<div className="size-2.5 rounded-full" style={{ background: theme['color-dark'] }}></div>
										</div>
									</div>

									<span className="text-xs leading-tight text-gray-600 dark:text-gray-400">{theme.label}</span>
								</button>
							))}
						</div>

						<div className="rounded-xl border border-gray-200/50 bg-white/60 p-3 backdrop-blur-sm dark:border-gray-700/30 dark:bg-gray-900/60">
							<div className="mb-1 text-center text-xs text-gray-500 dark:text-gray-400">{isZh ? '主题色' : 'Theme'}</div>
							<div className="mb-1.5 flex gap-1">
								<div className="h-6 flex-1 rounded shadow-sm" style={{ background: currentThemeColors.primary }}></div>
								<div className="h-6 flex-1 rounded shadow-sm" style={{ background: currentThemeColors.dark }}></div>
							</div>

							<div className="mb-1 text-center text-xs text-gray-500 dark:text-gray-400">{isZh ? '背景色' : 'Background'}</div>
							<div className="mb-1.5 flex gap-1">
								<div
									className="h-5 flex-1 rounded border border-gray-200 shadow-sm dark:border-gray-700"
									style={{ background: currentThemeColors.bgBase }}
								></div>
								<div
									className="h-5 flex-1 rounded border border-gray-200 shadow-sm dark:border-gray-700"
									style={{ background: currentThemeColors.bgSurface }}
								></div>
								<div
									className="h-5 flex-1 rounded border border-gray-200 shadow-sm dark:border-gray-700"
									style={{ background: currentThemeColors.bgOverlay }}
								></div>
								<div
									className="h-5 flex-1 rounded border border-gray-200 shadow-sm dark:border-gray-700"
									style={{ background: currentThemeColors.bgHighlight }}
								></div>
								<div
									className="h-5 flex-1 rounded border border-gray-700 shadow-sm dark:border-gray-500"
									style={{ background: currentThemeColors.bgBaseDark }}
								></div>
								<div
									className="h-5 flex-1 rounded border border-gray-700 shadow-sm dark:border-gray-500"
									style={{ background: currentThemeColors.bgSurfaceDark }}
								></div>
								<div
									className="h-5 flex-1 rounded border border-gray-700 shadow-sm dark:border-gray-500"
									style={{ background: currentThemeColors.bgOverlayDark }}
								></div>
								<div
									className="h-5 flex-1 rounded border border-gray-700 shadow-sm dark:border-gray-500"
									style={{ background: currentThemeColors.bgHighlightDark }}
								></div>
							</div>

							<div className="mb-1 text-center text-xs text-gray-500 dark:text-gray-400">{isZh ? '文字色' : 'Text'}</div>
							<div className="mb-1.5 flex gap-1">
								<div
									className="flex h-5 flex-1 items-center justify-center rounded text-xs font-medium"
									style={{ background: currentThemeColors.bgBase, color: currentThemeColors.textPrimary }}
								>
									Aa
								</div>
								<div
									className="flex h-5 flex-1 items-center justify-center rounded text-xs font-medium"
									style={{ background: currentThemeColors.primary, color: currentThemeColors.textOnPrimary }}
								>
									Aa
								</div>
								<div
									className="flex h-5 flex-1 items-center justify-center rounded text-xs font-medium"
									style={{ background: currentThemeColors.bgBaseDark, color: currentThemeColors.textDark }}
								>
									Aa
								</div>
								<div
									className="flex h-5 flex-1 items-center justify-center rounded text-xs font-medium"
									style={{ background: currentThemeColors.dark, color: currentThemeColors.textOnDark }}
								>
									Aa
								</div>
							</div>

							<div className="mb-1 text-center text-xs text-gray-500 dark:text-gray-400">{isZh ? '功能色' : 'Functional'}</div>
							<div className="mb-1.5 flex gap-1">
								<div className="h-5 flex-1 rounded shadow-sm" style={{ background: currentThemeColors.success }}></div>
								<div className="h-5 flex-1 rounded shadow-sm" style={{ background: currentThemeColors.warning }}></div>
								<div className="h-5 flex-1 rounded shadow-sm" style={{ background: currentThemeColors.error }}></div>
								<div className="h-5 flex-1 rounded shadow-sm" style={{ background: currentThemeColors.info }}></div>
							</div>

							<div className="mb-1 text-center text-xs text-gray-500 dark:text-gray-400">{isZh ? '圆角' : 'Radius'}</div>
							<div className="flex gap-1">
								<div className="relative h-6 flex-1 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
									<div
										className="border-primary bg-primary/10 dark:border-dark dark:bg-dark/10 absolute -bottom-6 -left-8 h-10 w-14 border-2"
										style={{ borderRadius: currentThemeColors.radiusBox }}
									></div>
								</div>
								<div className="relative h-6 flex-1 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
									<div
										className="border-primary bg-primary/10 dark:border-dark dark:bg-dark/10 absolute -bottom-6 -left-8 h-10 w-14 border-2"
										style={{ borderRadius: currentThemeColors.radiusForm }}
									></div>
								</div>
								<div className="relative h-6 flex-1 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
									<div
										className="border-primary bg-primary/10 dark:border-dark dark:bg-dark/10 absolute -bottom-6 -left-8 h-10 w-14 border-2"
										style={{ borderRadius: currentThemeColors.radiusSmall }}
									></div>
								</div>
							</div>
						</div>

						<a
							href="/guide/generator"
							className="hover:border-primary hover:bg-primary/5 dark:hover:border-dark dark:hover:bg-dark/5 group flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-3 transition-all dark:border-gray-700 dark:bg-gray-800/50"
						>
							<div className="from-primary to-primary-700 dark:from-dark dark:to-dark-700 flex size-8 items-center justify-center rounded-lg bg-linear-to-br text-white shadow-md">
								<svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11H7V13H11V17H13V13H17V11H13V7H11V11Z" />
								</svg>
							</div>
							<div className="flex-1 text-left">
								<div className="text-sm font-medium text-gray-800 dark:text-gray-200">
									{isZh ? '创建自定义主题' : 'Create Custom Theme'}
								</div>
								<div className="text-xs text-gray-500">{isZh ? '使用主题生成器' : 'Use theme generator'}</div>
							</div>
							<svg className="size-4 text-gray-400 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="currentColor">
								<path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
							</svg>
						</a>
					</div>

					<div
						ref={previewRef}
						role="presentation"
						className="relative w-full max-w-130 overflow-hidden rounded-2xl border border-gray-200/30 shadow-xl shadow-black/5 dark:border-white/10 dark:shadow-white/5"
						style={{ '--theme-preview-split': '50%' } as CSSProperties}
						onPointerMove={handlePointerMove}
						onPointerUp={handlePointerUp}
						onPointerLeave={handlePointerUp}
					>
						<div data-mode="light" style={{ ...lightLayerStyles, backgroundColor: 'var(--color-bg-base)' }}>
							<div className="flex justify-center p-3" style={{ color: 'var(--color-text-primary)' }}>
								<div className="flex w-full max-w-100 flex-col gap-2">
									<Card mx="0" my="0" p="3" shadow="sm" border="solid" borderWidth="1" injClass="border-black/5">
										<div className="flex items-center gap-3">
											<Avatar size="sm" image="/assets/images/home/avatar_1.jpg" />
											<div className="flex-1">
												<div className="text-sm font-semibold">Light Mode</div>
												<div className="text-xs opacity-60">{currentThemeData.label}</div>
											</div>
											<Badge text="11">
												<div className="bg-primary size-7" style={{ borderRadius: 'var(--radius-small)' }}></div>
											</Badge>
										</div>
									</Card>

									<NoticeBar textList={noticeTextList} rightIcon={null} />

									<div className="flex items-center justify-around py-2">
										{randomLoadingTypes.map((type) => (
											<Loading key={type} type={type} theme />
										))}
									</div>

									<Tab
										labels={[{ text: isZh ? '推荐' : 'For You' }, { text: isZh ? '关注' : 'Follow' }, { text: isZh ? '热门' : 'Hot' }]}
									/>

									<div className="flex items-center justify-around py-2">
										<Icon name="ri-home-4-line" theme />
										<Icon name="ri-heart-line" theme />
										<Icon name="ri-star-line" theme />
										<Icon name="ri-message-3-line" theme />
										<Icon name="ri-share-forward-line" theme />
									</div>

									<div>
										<Cell title={isZh ? '个人信息' : 'Profile'} />
										<Cell
											title={isZh ? '消息通知' : 'Notifications'}
											right={{ type: 'switch', switch: { onChange: setCellSwitchActive } }}
											switchActive={cellSwitchActive}
										/>
									</div>

									<div className="grid grid-cols-2 gap-2">
										<Card mx="0" my="0" p="3" shadow="sm" border="solid" borderWidth="1" injClass="border-black/5">
											<div className="flex justify-center">
												<Switch active={switchActive} onChange={setSwitchActive} />
											</div>
										</Card>
										<Card mx="0" my="0" p="3" shadow="sm" border="solid" borderWidth="1" injClass="border-black/5">
											<Slider value={sliderValue} showTip="never" onchange={(value) => setSliderValue(value)} />
										</Card>
									</div>

									<Card mx="0" my="0" p="3" shadow="sm" border="solid" borderWidth="1" injClass="border-black/5">
										<Progress percent={75} percentPosition="block" />
									</Card>

									<div className="grid grid-cols-2 gap-2">
										<Card mx="0" my="0" p="3" shadow="sm" border="solid" borderWidth="1" injClass="border-black/5">
											<Rate value={4} height={16} />
										</Card>
										<Card mx="0" my="0" p="3" shadow="sm" border="solid" borderWidth="1" injClass="border-black/5">
											<div className="flex justify-center">
												<Stepper value={stepperValue} min={1} max={10} onChange={setStepperValue} />
											</div>
										</Card>
									</div>

									<div className="grid grid-cols-4 gap-2">
										<Card mx="0" my="0" p="2" shadow="sm" border="solid" borderWidth="1" injClass="border-black/5">
											<div className="flex flex-col items-center gap-1">
												<div className="bg-success/15 flex size-6 items-center justify-center rounded-full">
													<svg className="text-success size-3.5" viewBox="0 0 24 24" fill="currentColor">
														<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z" />
													</svg>
												</div>
												<span className="text-success text-xs">{isZh ? '成功' : 'OK'}</span>
											</div>
										</Card>
										<Card mx="0" my="0" p="2" shadow="sm" border="solid" borderWidth="1" injClass="border-black/5">
											<div className="flex flex-col items-center gap-1">
												<div className="bg-warning/15 flex size-6 items-center justify-center rounded-full">
													<svg className="text-warning size-3.5" viewBox="0 0 24 24" fill="currentColor">
														<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z" />
													</svg>
												</div>
												<span className="text-warning text-xs">{isZh ? '警告' : 'Warn'}</span>
											</div>
										</Card>
										<Card mx="0" my="0" p="2" shadow="sm" border="solid" borderWidth="1" injClass="border-black/5">
											<div className="flex flex-col items-center gap-1">
												<div className="bg-error/15 flex size-6 items-center justify-center rounded-full">
													<svg className="text-error size-3.5" viewBox="0 0 24 24" fill="currentColor">
														<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 10.5858L9.17157 7.75736L7.75736 9.17157L10.5858 12L7.75736 14.8284L9.17157 16.2426L12 13.4142L14.8284 16.2426L16.2426 14.8284L13.4142 12L16.2426 9.17157L14.8284 7.75736L12 10.5858Z" />
													</svg>
												</div>
												<span className="text-error text-xs">{isZh ? '错误' : 'Error'}</span>
											</div>
										</Card>
										<Card mx="0" my="0" p="2" shadow="sm" border="solid" borderWidth="1" injClass="border-black/5">
											<div className="flex flex-col items-center gap-1">
												<div className="bg-info/15 flex size-6 items-center justify-center rounded-full">
													<svg className="text-info size-3.5" viewBox="0 0 24 24" fill="currentColor">
														<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z" />
													</svg>
												</div>
												<span className="text-info text-xs">{isZh ? '信息' : 'Info'}</span>
											</div>
										</Card>
									</div>

									<div className="grid grid-cols-2 gap-2">
										<Button fill="base" size="full">
											{isZh ? '确认' : 'Confirm'}
										</Button>
										<Button fill="lineState" size="full">
											{isZh ? '取消' : 'Cancel'}
										</Button>
									</div>
								</div>
							</div>
						</div>

						<div
							data-mode="dark"
							className="dark absolute inset-0"
							style={{
								...darkLayerStyles,
								backgroundColor: 'var(--color-bg-base-dark)',
								clipPath: 'inset(0 0 0 var(--theme-preview-split))'
							}}
						>
							<div className="flex justify-center p-3" style={{ color: 'var(--color-text-dark)' }}>
								<div className="flex w-full max-w-100 flex-col gap-2">
									<Card mx="0" my="0" p="3" shadow="sm" border="solid" borderWidth="1" injClass="border-white/10">
										<div className="flex items-center gap-3">
											<Avatar size="sm" image="/assets/images/home/avatar_1.jpg" />
											<div className="flex-1">
												<div className="text-sm font-semibold">Dark Mode</div>
												<div className="text-xs opacity-60">{currentThemeData.label}</div>
											</div>
											<Badge text="11">
												<div className="bg-dark size-7" style={{ borderRadius: 'var(--radius-small)' }}></div>
											</Badge>
										</div>
									</Card>

									<NoticeBar textList={noticeTextList} rightIcon={null} />

									<div className="flex items-center justify-around py-2">
										{randomLoadingTypes.map((type) => (
											<Loading key={type} type={type} theme />
										))}
									</div>

									<Tab
										labels={[{ text: isZh ? '推荐' : 'For You' }, { text: isZh ? '关注' : 'Follow' }, { text: isZh ? '热门' : 'Hot' }]}
									/>

									<div className="flex items-center justify-around py-2">
										<Icon name="ri-home-4-line" theme />
										<Icon name="ri-heart-line" theme />
										<Icon name="ri-star-line" theme />
										<Icon name="ri-message-3-line" theme />
										<Icon name="ri-share-forward-line" theme />
									</div>

									<div>
										<Cell title={isZh ? '个人信息' : 'Profile'} />
										<Cell
											title={isZh ? '消息通知' : 'Notifications'}
											right={{ type: 'switch', switch: { onChange: setCellSwitchActive } }}
											switchActive={cellSwitchActive}
										/>
									</div>

									<div className="grid grid-cols-2 gap-2">
										<Card mx="0" my="0" p="3" shadow="sm" border="solid" borderWidth="1" injClass="border-white/10">
											<div className="flex justify-center">
												<Switch active={switchActive} onChange={setSwitchActive} />
											</div>
										</Card>
										<Card mx="0" my="0" p="3" shadow="sm" border="solid" borderWidth="1" injClass="border-white/10">
											<Slider value={sliderValue} showTip="never" onchange={(value) => setSliderValue(value)} />
										</Card>
									</div>

									<Card mx="0" my="0" p="3" shadow="sm" border="solid" borderWidth="1" injClass="border-white/10">
										<Progress percent={75} percentPosition="block" />
									</Card>

									<div className="grid grid-cols-2 gap-2">
										<Card mx="0" my="0" p="3" shadow="sm" border="solid" borderWidth="1" injClass="border-white/10">
											<Rate value={4} height={16} />
										</Card>
										<Card mx="0" my="0" p="3" shadow="sm" border="solid" borderWidth="1" injClass="border-white/10">
											<div className="flex justify-center">
												<Stepper value={stepperValue} min={1} max={10} onChange={setStepperValue} />
											</div>
										</Card>
									</div>

									<div className="grid grid-cols-4 gap-2">
										<Card mx="0" my="0" p="2" shadow="sm" border="solid" borderWidth="1" injClass="border-white/10">
											<div className="flex flex-col items-center gap-1">
												<div className="bg-success/15 flex size-6 items-center justify-center rounded-full">
													<svg className="text-success size-3.5" viewBox="0 0 24 24" fill="currentColor">
														<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z" />
													</svg>
												</div>
												<span className="text-success text-xs">{isZh ? '成功' : 'OK'}</span>
											</div>
										</Card>
										<Card mx="0" my="0" p="2" shadow="sm" border="solid" borderWidth="1" injClass="border-white/10">
											<div className="flex flex-col items-center gap-1">
												<div className="bg-warning/15 flex size-6 items-center justify-center rounded-full">
													<svg className="text-warning size-3.5" viewBox="0 0 24 24" fill="currentColor">
														<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z" />
													</svg>
												</div>
												<span className="text-warning text-xs">{isZh ? '警告' : 'Warn'}</span>
											</div>
										</Card>
										<Card mx="0" my="0" p="2" shadow="sm" border="solid" borderWidth="1" injClass="border-white/10">
											<div className="flex flex-col items-center gap-1">
												<div className="bg-error/15 flex size-6 items-center justify-center rounded-full">
													<svg className="text-error size-3.5" viewBox="0 0 24 24" fill="currentColor">
														<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 10.5858L9.17157 7.75736L7.75736 9.17157L10.5858 12L7.75736 14.8284L9.17157 16.2426L12 13.4142L14.8284 16.2426L16.2426 14.8284L13.4142 12L16.2426 9.17157L14.8284 7.75736L12 10.5858Z" />
													</svg>
												</div>
												<span className="text-error text-xs">{isZh ? '错误' : 'Error'}</span>
											</div>
										</Card>
										<Card mx="0" my="0" p="2" shadow="sm" border="solid" borderWidth="1" injClass="border-white/10">
											<div className="flex flex-col items-center gap-1">
												<div className="bg-info/15 flex size-6 items-center justify-center rounded-full">
													<svg className="text-info size-3.5" viewBox="0 0 24 24" fill="currentColor">
														<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z" />
													</svg>
												</div>
												<span className="text-info text-xs">{isZh ? '信息' : 'Info'}</span>
											</div>
										</Card>
									</div>

									<div className="grid grid-cols-2 gap-2">
										<Button fill="base" size="full">
											{isZh ? '确认' : 'Confirm'}
										</Button>
										<Button fill="lineState" size="full">
											{isZh ? '取消' : 'Cancel'}
										</Button>
									</div>
								</div>
							</div>
						</div>

						<div
							className="absolute top-0 z-20 h-full w-0.5 -translate-x-1/2 cursor-ew-resize"
							style={{ left: 'var(--theme-preview-split)' }}
							onPointerDown={handlePointerDown}
						>
							<div className="from-primary to-primary-700 absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-linear-to-br shadow-xl transition-transform duration-300 active:scale-110">
								<svg className="size-4 text-white" viewBox="0 0 24 24" fill="currentColor">
									<path d="M8 5L3 12L8 19V5ZM16 5V19L21 12L16 5Z" />
								</svg>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-8 flex flex-wrap justify-center gap-2">
					{[
						{ icon: '🎨', text: isZh ? 'OKLCH 色彩空间' : 'OKLCH Color Space' },
						{ icon: '💎', text: isZh ? '42 套内置主题' : '42 Built-in Themes' },
						{ icon: '🌗', text: isZh ? '亮暗双色配置' : 'Light & Dark Colors' },
						{ icon: '⚙️', text: isZh ? '丰富配置项' : 'Rich Configuration' },
						{ icon: '⚡', text: isZh ? '实时主题切换' : 'Real-time Switch' },
						{ icon: '🛠', text: isZh ? '自定义主题生成' : 'Custom Theme Generator' }
					].map((tag) => (
						<span
							key={tag.text}
							className="inline-flex items-center gap-1.5 rounded-full bg-gray-100/80 px-3 py-1.5 text-xs font-medium text-gray-700 backdrop-blur-sm dark:bg-gray-800/80 dark:text-gray-300"
						>
							<span>{tag.icon}</span>
							{tag.text}
						</span>
					))}
				</div>
			</div>
		</section>
	);
};

export default ThemeSystem;
