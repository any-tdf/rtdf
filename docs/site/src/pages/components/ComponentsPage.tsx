import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import hljs from 'highlight.js';
import Menu from '../../components/Menu';
import Tabs from '../../components/Tabs';
import { menuList, type MenuList, type MenuListChild } from '../../data/menuList';
import { useAppContext } from '../../store/appStore';
import ComponentDoc from './ComponentDoc';

const sourceModulesZh = import.meta.glob('../../../../../packages/rtdf/src/pages/**/zh_CN.tsx', {
	query: '?raw',
	import: 'default'
});
const sourceModulesEn = import.meta.glob('../../../../../packages/rtdf/src/pages/**/en_US.tsx', {
	query: '?raw',
	import: 'default'
});

const flattenMenuList = (list: MenuList[]) => {
	return list.reduce<MenuListChild[]>((acc, cur) => {
		if (cur.childs) acc.push(...cur.childs);
		return acc;
	}, []);
};

const ComponentsPage = () => {
	const { lang, isShowNav, setIsShowNav, isCmdK, currentColor, themeMode, sysTheme, isWideScreen } = useAppContext();
	const isZh = lang === 'zh_CN';
	const [searchParams, setSearchParams] = useSearchParams();
	const [currentTab, setCurrentTab] = useState(0);
	const [currentNav, setCurrentNav] = useState<MenuListChild | null>(null);
	const [highlightedCode, setHighlightedCode] = useState('');
	const [loading, setLoading] = useState(true);
	const [demoHeight, setDemoHeight] = useState(0);
	const [navBarHeight, setNavBarHeight] = useState(0);
	const [titleWidth, setTitleWidth] = useState(0);
	const [isShowIframe, setIsShowIframe] = useState(true);
	const [visible, setVisible] = useState(true);
	const [menuChange, setMenuChange] = useState(true);
	const titleRef = useRef<HTMLDivElement | null>(null);
	const tabContainerRef = useRef<HTMLDivElement | null>(null);

	const menuChildList = useMemo(() => flattenMenuList(menuList), []);
	const updateLayoutSizes = useCallback(() => {
		if (!titleRef.current) return;
		const navHeight = document.documentElement.clientHeight - 56;
		const nextHeight = document.documentElement.clientHeight - 70 - titleRef.current.offsetHeight - 100;
		setDemoHeight(nextHeight);
		setNavBarHeight(navHeight);
		setTitleWidth(tabContainerRef.current?.clientWidth || titleRef.current.clientWidth);
	}, []);
	const updateParams = useCallback(
		(updates: Record<string, string>) => {
			const nextParams = new URLSearchParams(searchParams);
			Object.entries(updates).forEach(([key, value]) => nextParams.set(key, value));
			setSearchParams(nextParams);
		},
		[searchParams, setSearchParams]
	);
	const reloadPreview = useCallback(() => {
		setIsShowIframe(false);
		window.setTimeout(() => {
			setIsShowIframe(true);
		}, 10);
	}, []);
	const changeNav = useCallback(
		(nav: string) => {
			setVisible(false);
			setMenuChange(false);
			window.setTimeout(() => {
				updateParams({ nav, tab: searchParams.get('tab') || '0' });
				setVisible(true);
				setMenuChange(true);
			}, 10);
		},
		[searchParams, updateParams]
	);

	useEffect(() => {
		const tabParam = Number(searchParams.get('tab') || 0);
		setCurrentTab(Number.isNaN(tabParam) ? 0 : tabParam);
		const navParam = searchParams.get('nav');
		const nextNav = navParam ? menuChildList.find((item) => item.nav === navParam) : menuList[0].childs[0];
		setCurrentNav(nextNav || menuList[0].childs[0]);
	}, [menuChildList, searchParams]);

	useEffect(() => {
		if (!currentNav) return;
		updateLayoutSizes();
		window.addEventListener('resize', updateLayoutSizes);
		return () => window.removeEventListener('resize', updateLayoutSizes);
	}, [currentNav, updateLayoutSizes]);

	useEffect(() => {
		if (!currentNav || !tabContainerRef.current) return;
		const observer = new ResizeObserver(updateLayoutSizes);
		observer.observe(tabContainerRef.current);
		if (titleRef.current) observer.observe(titleRef.current);
		updateLayoutSizes();
		return () => observer.disconnect();
	}, [currentNav, updateLayoutSizes]);

	useEffect(() => {
		if (!currentNav) return;
		updateLayoutSizes();
		const frame = window.requestAnimationFrame(updateLayoutSizes);
		const timer = window.setTimeout(updateLayoutSizes, 520);
		return () => {
			window.cancelAnimationFrame(frame);
			window.clearTimeout(timer);
		};
	}, [currentNav, isWideScreen, updateLayoutSizes]);

	useEffect(() => {
		const loadSource = async () => {
			if (!currentNav) return;
			setLoading(true);
			const isEn = lang === 'en_US';
			const sources = isEn ? sourceModulesEn : sourceModulesZh;
			const sourcePath = Object.keys(sources).find((key) => key.includes(`/pages/${currentNav.nav}/`));
			if (!sourcePath) {
				setHighlightedCode('');
				setLoading(false);
				return;
			}
			const source = (await sources[sourcePath]()) as string;
			const highlighted = hljs.highlight(source, { language: 'typescript', ignoreIllegals: true }).value;
			setHighlightedCode(highlighted);
			setLoading(false);
		};

		loadSource();
	}, [currentNav, lang]);

	useEffect(() => {
		const handleKeydown = (event: KeyboardEvent) => {
			if (isCmdK) return;
			if (event.code === 'ArrowLeft') {
				if (currentTab > 0) {
					reloadPreview();
					const next = currentTab - 1;
					setCurrentTab(next);
					updateParams({ tab: next.toString() });
				}
			}
			if (event.code === 'ArrowRight') {
				if (currentTab < 4) {
					reloadPreview();
					const next = currentTab + 1;
					setCurrentTab(next);
					updateParams({ tab: next.toString() });
				}
			}
			if (event.code === 'ArrowUp') {
				const currentIndex = menuChildList.findIndex((item) => item.nav === currentNav?.nav);
				if (currentIndex > 0) {
					const next = menuChildList[currentIndex - 1];
					changeNav(next.nav);
				}
			}
			if (event.code === 'ArrowDown') {
				const currentIndex = menuChildList.findIndex((item) => item.nav === currentNav?.nav);
				if (currentIndex < menuChildList.length - 1) {
					const next = menuChildList[currentIndex + 1];
					changeNav(next.nav);
				}
			}
		};
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	}, [changeNav, currentNav, currentTab, isCmdK, menuChildList, reloadPreview, updateParams]);

	const menuClick = (menu: MenuListChild) => {
		if (isShowNav) setIsShowNav(false);
		changeNav(menu.nav);
	};

	const tabClick = (index: number) => {
		reloadPreview();
		setCurrentTab(index);
		updateParams({ tab: index.toString(), nav: searchParams.get('nav') || 'button' });
	};

	const demoUrl = useMemo(() => {
		if (!currentNav) return '';
		const resolvedMode = themeMode === 'auto' ? sysTheme : themeMode;
		const base = import.meta.env.DEV ? `${window.location.protocol}//${window.location.hostname}:8887/` : 'https://demo.rtdf.dev/';
		return `${base}${currentNav.nav}/${isZh ? 'zh_CN' : 'en_US'}?channel=iframe&theme=${currentColor}&darkMode=${resolvedMode === 'dark' ? 'dark' : 'light'}&lang=${lang}`;
	}, [currentColor, currentNav, isZh, lang, sysTheme, themeMode]);

	if (!currentNav) return null;

	return (
		<div className="flex">
			<div
				className={`fixed top-14 -left-52 z-100 w-52 overflow-y-scroll border-black/10 bg-white transition-all duration-300 md:left-0 md:bg-transparent dark:border-white/20 dark:bg-black dark:md:bg-transparent ${
					isShowNav ? 'left-0' : '-left-52'
				}`}
				style={{ height: `${navBarHeight}px` }}
			>
				<Menu menuList={menuList} currentNav={currentNav.nav} onMenuClick={menuClick} />
			</div>
			<div
				className={`mx-auto flex w-full flex-col transition-all duration-500 ease-out md:pl-48 ${
					isWideScreen ? 'max-w-full' : 'max-w-368'
				} ${visible ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'}`}
			>
				<div className="relative z-20 px-4 pt-4 md:flex md:space-x-4 md:px-8" ref={titleRef}>
					{loading ? (
						<div>{isZh ? '请等待……' : 'Please wait...'}</div>
					) : (
						<>
							<div className="flex items-center text-2xl font-bold md:text-4xl">
								<div>{isZh ? currentNav.title : currentNav.title_en}</div>
								<a href={demoUrl} target="_blank" rel="noreferrer" aria-label={isZh ? '扫码预览' : 'Scan to preview'}>
									<div className="ml-2 h-8 w-8 rounded-sm bg-gray-100 p-1 text-gray-500 md:hidden dark:bg-gray-700">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" style={{ fill: 'currentColor' }}>
											<path fill="none" d="M0 0h24v24H0z" />
											<path d="M13 21v2h-2v-2H3a1 1 0 0 1-1-1V6h20v14a1 1 0 0 1-1 1h-8zm-9-2h16V8H4v11zm9-9h5v2h-5v-2zm0 4h5v2h-5v-2zm-4-4v3h3a3 3 0 1 1-3-3zM2 3h20v2H2V3z" />
										</svg>
									</div>
								</a>
							</div>
							<div className="mt-4 text-xs text-gray-500 md:text-sm">{isZh ? currentNav.tip : currentNav.tip_en}</div>
						</>
					)}
				</div>
				<div className="relative z-10 -mt-14 p-4 md:px-8 md:py-4" ref={tabContainerRef}>
					<Tabs currentTab={currentTab} onChange={tabClick} />
				</div>
				<div className="my-4 ml-4"></div>
				{currentTab === 0 ? (
					<div className="mt-2 flex flex-1 justify-around py-4 md:pr-4 md:pl-8" style={{ width: `${titleWidth}px` }}>
						<div className="grow overflow-y-scroll rounded-sm bg-black/5 dark:bg-white/5" style={{ height: `${demoHeight}px` }}>
							{highlightedCode ? (
								<article className="site-prose-clean prose dark:prose-invert max-w-none text-sm">
									<pre>
										<code className="hljs" dangerouslySetInnerHTML={{ __html: highlightedCode }}></code>
									</pre>
								</article>
							) : null}
						</div>
						<div
							className="ml-2 hidden w-98 shrink-0 grow-0 border border-black/10 md:block dark:border-white/10"
							style={{ height: `${demoHeight}px` }}
						>
							{currentNav?.nav ? (
								isShowIframe ? (
									<iframe title="Demo" id="iframe-id" src={demoUrl} height={demoHeight - 2} width="390" />
								) : (
									<div
										className="text-primary dark:text-dark flex flex-col justify-center"
										style={{ width: '390px', height: `${demoHeight - 2}px` }}
									>
										<div>
											<svg
												className="mx-auto my-1 h-10 w-10 animate-spin"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
										</div>
									</div>
								)
							) : null}
						</div>
					</div>
				) : null}
				{currentTab === 1 ? (
					<div className="mt-4 flex-1 p-4 md:px-8 md:py-4" style={{ width: `${titleWidth}px` }}>
						{menuChange ? <ComponentDoc nav={currentNav.nav} docType="api" /> : null}
					</div>
				) : null}
				{currentTab === 2 ? (
					<div className="mx-auto mt-4 flex-1 rounded-sm p-4 md:px-8 md:py-4" style={{ width: `${titleWidth}px` }}>
						{menuChange ? <ComponentDoc nav={currentNav.nav} docType="guide" /> : null}
					</div>
				) : null}
				{currentTab === 3 ? (
					<div className="mt-4 flex-1 rounded-sm p-4 md:px-8 md:py-4" style={{ width: `${titleWidth}px` }}>
						{menuChange ? <ComponentDoc nav={currentNav.nav} docType="faq" /> : null}
					</div>
				) : null}
				{currentTab === 4 ? (
					<div className="mt-4 flex-1 rounded-sm p-4 md:px-8 md:py-4" style={{ width: `${titleWidth}px` }}>
						{menuChange ? <ComponentDoc nav={currentNav.nav} docType="version" /> : null}
					</div>
				) : null}
			</div>
		</div>
	);
};

export default ComponentsPage;
