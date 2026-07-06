import { useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { switchMode, switchTheme } from 'rtdf/theme';
import Header from './components/Header';
import CmdK from './components/CmdK';
import Fund from './components/Fund';
import HomePage from './pages/Home';
import GuideLayout from './pages/guide/GuideLayout';
import ComponentsPage from './pages/components/ComponentsPage';
import NotFound from './pages/NotFound';
import { AppContextProvider, type LangType, type ThemeMode } from './store/appStore';
import { delParamsUrl } from './utils';
import { normalizeThemeName } from './utils/theme';

const getStoredLang = (): LangType => {
	const stored = localStorage.getItem('lang');
	if (stored === 'zh_CN' || stored === 'en_US') return stored;
	return 'zh_CN';
};

const getStoredThemeMode = (): ThemeMode => {
	const stored = localStorage.getItem('theme');
	if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored;
	return 'auto';
};

function App() {
	const location = useLocation();
	const [lang, setLang] = useState<LangType>(getStoredLang());
	const [isShowNav, setIsShowNav] = useState(false);
	const [isCmdK, setIsCmdK] = useState(false);
	const [isShowFund, setIsShowFund] = useState(false);
	const [showThemeSwitch, setShowThemeSwitch] = useState(false);
	const [currentColor, setCurrentColor] = useState(normalizeThemeName(localStorage.getItem('theme_color')));
	const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredThemeMode());
	const [sysTheme, setSysTheme] = useState<'light' | 'dark'>(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
	const [isWideScreen, setIsWideScreen] = useState(localStorage.getItem('isFull') === 'full');

	const showLeftNav = useMemo(() => {
		return location.pathname.startsWith('/guide') || location.pathname.startsWith('/components');
	}, [location.pathname]);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const themeParam = urlParams.get('theme');
		const storedTheme = normalizeThemeName(localStorage.getItem('theme_color'));
		const isIframe = window.self !== window.top;
		const nextTheme = normalizeThemeName(isIframe && themeParam ? themeParam : storedTheme);
		if (isIframe && themeParam) {
			localStorage.setItem('theme_color', nextTheme);
		}
		setCurrentColor(nextTheme);
	}, [location.search]);

	useEffect(() => {
		switchTheme(currentColor);
		localStorage.setItem('theme_color', currentColor);
	}, [currentColor]);

	useEffect(() => {
		const mql = window.matchMedia('(prefers-color-scheme: dark)');
		const updateSysTheme = (isDark: boolean) => {
			setSysTheme(isDark ? 'dark' : 'light');
			if (themeMode === 'auto') {
				switchMode(isDark ? 'dark' : 'primary');
			}
		};
		updateSysTheme(mql.matches);
		const handler = (event: MediaQueryListEvent) => updateSysTheme(event.matches);
		mql.addEventListener('change', handler);
		return () => mql.removeEventListener('change', handler);
	}, [themeMode]);

	useEffect(() => {
		if (themeMode === 'auto') {
			switchMode(sysTheme === 'dark' ? 'dark' : 'primary');
		} else {
			switchMode(themeMode === 'dark' ? 'dark' : 'primary');
		}
		localStorage.setItem('theme', themeMode);
	}, [sysTheme, themeMode]);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const langParam = urlParams.get('lang');
		if (langParam === 'zh_CN' || langParam === 'en_US') {
			localStorage.setItem('lang', langParam);
			setLang(langParam);
			const nextUrl = new URL(window.location.href);
			nextUrl.searchParams.delete('lang');
			setTimeout(() => {
				window.history.replaceState({}, '', nextUrl.toString());
			}, 10);
			return;
		}
		const stored = localStorage.getItem('lang');
		if (stored === 'zh_CN' || stored === 'en_US') {
			setLang(stored);
			return;
		}
		const browserLang = navigator.language.substring(0, 2) === 'en' ? 'en_US' : 'zh_CN';
		localStorage.setItem('lang', browserLang);
		setLang(browserLang);
	}, [location.search]);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has('fund')) {
			setIsShowFund(true);
			setTimeout(() => {
				window.history.replaceState({}, '', delParamsUrl(window.location.href, 'fund'));
			}, 10);
		}
	}, [location.search]);

	const contextValue = useMemo(
		() => ({
			lang,
			setLang,
			isShowNav,
			setIsShowNav,
			isCmdK,
			setIsCmdK,
			isShowFund,
			setIsShowFund,
			showThemeSwitch,
			setShowThemeSwitch,
			currentColor,
			setCurrentColor,
			themeMode,
			setThemeMode,
			sysTheme,
			setSysTheme,
			isWideScreen,
			setIsWideScreen
		}),
		[lang, isShowNav, isCmdK, isShowFund, showThemeSwitch, currentColor, themeMode, sysTheme, isWideScreen]
	);

	return (
		<AppContextProvider value={contextValue}>
			<main className="relative min-h-screen text-justify antialiased">
				<Header showLeftNav={showLeftNav} />
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/guide/*" element={<GuideLayout />} />
					<Route path="/components" element={<ComponentsPage />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
				<CmdK />
				{isShowFund ? <Fund /> : null}
			</main>
		</AppContextProvider>
	);
}

export default App;
