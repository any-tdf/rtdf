import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ModeSwitch from './ModeSwitch';
import ThemeSwitch from './ThemeSwitch';
import { useAppContext } from '../store/appStore';

type HeaderProps = {
	showLeftNav: boolean;
};

const Header = ({ showLeftNav }: HeaderProps) => {
	const location = useLocation();
	const { lang, isShowNav, setIsShowNav, setIsCmdK, setIsShowFund, showThemeSwitch, setShowThemeSwitch } = useAppContext();
	const [showNav, setShowNav] = useState(false);
	const themeSwitchMobileRef = useRef<HTMLButtonElement | null>(null);
	const themeSwitchDesktopRef = useRef<HTMLDivElement | null>(null);

	const isZh = lang === 'zh_CN';
	const developmentStatus = isZh ? '紧张开发中……' : 'In active development...';
	const releaseStatus = isZh ? 'Alpha 版本' : 'Alpha version';
	const isMac = navigator.userAgent.toUpperCase().includes('MAC');
	const cmdKey = isMac ? '⌘' : 'Ctrl';

	const currentRoute = useMemo(() => location.pathname, [location.pathname]);

	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			const target = event.target as Node;
			if (
				(themeSwitchMobileRef.current && themeSwitchMobileRef.current.contains(target)) ||
				(themeSwitchDesktopRef.current && themeSwitchDesktopRef.current.contains(target))
			) {
				return;
			}
			setShowThemeSwitch(false);
		};
		window.addEventListener('click', handleClick);
		return () => window.removeEventListener('click', handleClick);
	}, [setShowThemeSwitch]);

	const toggleNav = () => setIsShowNav((prev) => !prev);

	const openCmdK = () => setIsCmdK(true);

	const toggleFund = () => setIsShowFund(true);

	const toggleThemeSwitch = () => setShowThemeSwitch((prev) => !prev);

	const switchLang = () => {
		const url = new URL(window.location.href);
		url.searchParams.set('lang', isZh ? 'en_US' : 'zh_CN');
		window.location.href = url.toString();
	};

	return (
		<div className="sticky top-0 z-100 border-black/5 backdrop-blur-sm dark:border-white/10">
			<div className="flex h-14 items-center justify-between">
				{showLeftNav ? (
					<button className="cursor-pointer p-4 md:hidden" onClick={toggleNav} type="button">
						{!isShowNav ? (
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M21.0001 4.50004L7.50007 4.5L7.50006 6L21.0001 6.00004V4.50004Z" fill="currentColor" />
								<path d="M5.25007 4.5L3.00098 4.5L3.00098 6L5.25007 6V4.5Z" fill="currentColor" />
								<path d="M7.50007 11.2501L21.0001 11.2501V12.7501L7.50006 12.7501L7.50007 11.2501Z" fill="currentColor" />
								<path d="M3.00098 11.2501H5.25007V12.7501H3.00098L3.00098 11.2501Z" fill="currentColor" />
								<path d="M7.50007 18L21.0001 18V19.5L7.50006 19.5L7.50007 18Z" fill="currentColor" />
								<path d="M3.00098 18H5.25007V19.5H3.00098L3.00098 18Z" fill="currentColor" />
							</svg>
						) : (
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
								<path
									fill="currentColor"
									d="M10.4143 4.58594L10.4142 11.0003L16.0003 11.0004L16.0003 13.0004L10.4142 13.0003L10.4141 19.4144L3 12.0002L10.4143 4.58594ZM18.0002 19.0002V5.00018H20.0002V19.0002H18.0002Z"
								/>
							</svg>
						)}
					</button>
				) : null}

				<div className="flex items-end">
					<Link to="/" className="flex items-center justify-between py-2 md:pl-6" aria-label={isZh ? '首页' : 'Home'}>
						<div className="fill-primary flex h-8 w-16 flex-col items-center justify-center">
							<svg viewBox="0 0 80 80">
								<path
									className="fill-primary dark:fill-dark"
									d="M40 0C54.8054 0 67.7312 8.04427 74.6475 20H30V30H40C45.5228 30 50 34.4772 50 40C50 45.5228 45.5228 50 40 50H30V80H10V20H0V0H40ZM78.7393 30C79.5619 33.1962 80 36.547 80 40C80 62.0914 62.0914 80 40 80V60C51.0457 60 60 51.0457 60 40C60 36.3571 59.0259 32.9417 57.3242 30H78.7393Z"
								/>
								<path className="fill-dark dark:fill-primary" d="M20 30H40L20 80V50H0L20 0V30Z" />
							</svg>
						</div>
					</Link>
					<div className="relative bottom-1 flex items-center gap-2 pr-4 pb-0.5 pl-2 text-xs text-gray-500">
						<span className="border-warning/30 bg-warning/10 text-warning dark:border-dark/30 dark:bg-dark/10 dark:text-dark rounded-small inline-flex items-center border px-2 py-0.5 font-bold whitespace-nowrap">
							{releaseStatus}
						</span>
						<span className="hidden whitespace-nowrap sm:inline">{developmentStatus}</span>
					</div>
				</div>

				<div className="cursor-pointer p-4 md:hidden">
					<button onClick={() => setShowNav((prev) => !prev)} type="button">
						{!showNav ? (
							<svg width="24" height="24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M12 6v.01M12 12v.01M12 18v.01M12 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						) : (
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
								<path
									fill="currentColor"
									d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 10.5858L14.8284 7.75736L16.2426 9.17157L13.4142 12L16.2426 14.8284L14.8284 16.2426L12 13.4142L9.17157 16.2426L7.75736 14.8284L10.5858 12L7.75736 9.17157L9.17157 7.75736L12 10.5858Z"
								/>
							</svg>
						)}
					</button>
					{showNav ? (
						<div className="absolute top-14 right-2 flex flex-col space-y-3 rounded-sm border border-black/10 bg-white p-1 pt-4 text-center text-sm font-bold shadow-lg backdrop-blur-sm dark:border-white/20 dark:bg-gray-950 dark:shadow-white/20">
							<a
								href={currentRoute.includes('/guide') ? 'javascript:void(0)' : '/guide'}
								className={`px-4 py-1 text-center ${currentRoute.includes('/guide') ? 'text-primary dark:text-dark' : ''}`}
							>
								{isZh ? '指南' : 'Guide'}
							</a>
							<a
								href={currentRoute.includes('/components') ? 'javascript:void(0)' : '/components?nav=button&tab=0'}
								className={`px-4 py-1 text-center ${currentRoute.includes('/components') ? 'text-primary dark:text-dark' : ''}`}
							>
								{isZh ? '组件' : 'Components'}
							</a>
							<button ref={themeSwitchMobileRef} className="relative px-4 py-1 text-center" onClick={toggleThemeSwitch} type="button">
								{isZh ? '主题' : 'Theme'}
								{showThemeSwitch ? (
									<div
										className="absolute top-0 min-w-44 rounded-lg bg-white p-3 shadow-lg dark:bg-black/95 dark:shadow-white/40"
										style={{ right: isZh ? '66px' : '128px' }}
									>
										<ModeSwitch />
										<ThemeSwitch vertical />
									</div>
								) : null}
							</button>
							<button className="px-4 py-1 text-center" onClick={toggleFund} type="button">
								{isZh ? '支持' : 'Support'}
							</button>
							<button
								onClick={switchLang}
								aria-label={isZh ? '跳转英文站点' : 'Jump to Chinese Site'}
								className="cursor-pointer px-4 py-1 text-center"
								type="button"
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="inline-block">
									<path fill="none" d="M0 0h24v24H0z" />
									<path
										fill="currentColor"
										d="M5 15v2a2 2 0 0 0 1.85 1.995L7 19h3v2H7a4 4 0 0 1-4-4v-2h2zm13-5l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16 10h2zm-1 2.885L15.753 16h2.492L17 12.885zM8 2v2h4v7H8v3H6v-3H2V4h4V2h2zm9 1a4 4 0 0 1 4 4v2h-2V7a2 2 0 0 0-2-2h-3V3h3zM6 6H4v3h2V6zm4 0H8v3h2V6z"
									/>
								</svg>
							</button>
							<a
								href="https://github.com/any-tdf/rtdf"
								className="px-4 py-1 text-center"
								target="_blank"
								aria-label={isZh ? '跳转至 GitHub' : 'Jump to GitHub'}
							>
								<svg width="20" height="20" viewBox="0 0 24 24" className="inline-block" xmlns="http://www.w3.org/2000/svg">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M12 2.23999C6.475 2.23999 2 6.71499 2 12.24C2 16.665 4.8625 20.4025 8.8375 21.7275C9.3375 21.815 9.525 21.515 9.525 21.2525C9.525 21.015 9.5125 20.2275 9.5125 19.39C7 19.8525 6.35 18.7775 6.15 18.215C6.0375 17.9275 5.55 17.04 5.125 16.8025C4.775 16.615 4.275 16.1525 5.1125 16.14C5.9 16.1275 6.4625 16.865 6.65 17.165C7.55 18.6775 8.9875 18.2525 9.5625 17.99C9.65 17.34 9.9125 16.9025 10.2 16.6525C7.975 16.4025 5.65 15.54 5.65 11.715C5.65 10.6275 6.0375 9.72749 6.675 9.02749C6.575 8.77749 6.225 7.75249 6.775 6.37749C6.775 6.37749 7.6125 6.11499 9.525 7.40249C10.325 7.17749 11.175 7.06499 12.025 7.06499C12.875 7.06499 13.725 7.17749 14.525 7.40249C16.4375 6.10249 17.275 6.37749 17.275 6.37749C17.825 7.75249 17.475 8.77749 17.375 9.02749C18.0125 9.72749 18.4 10.615 18.4 11.715C18.4 15.5525 16.0625 16.4025 13.8375 16.6525C14.2 16.965 14.5125 17.565 14.5125 18.5025C14.5125 19.84 14.5 20.915 14.5 21.2525C14.5 21.515 14.6875 21.8275 15.1875 21.7275C17.1727 21.0573 18.8977 19.7815 20.1198 18.0795C21.3419 16.3776 21.9995 14.3352 22 12.24C22 6.71499 17.525 2.23999 12 2.23999Z"
										fill="currentColor"
									/>
								</svg>
							</a>
						</div>
					) : null}
				</div>

				<div className="hidden items-center space-x-2 px-6 font-bold md:flex">
					<button
						className="flex cursor-pointer rounded-sm border border-black/10 p-0.5 text-xs font-normal text-black/40 transition-all hover:border-black/20 dark:border-white/10 dark:text-white/40 dark:hover:border-white/20"
						onClick={openCmdK}
						type="button"
					>
						<div className="mr-1 flex flex-col justify-center">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" style={{ fill: 'currentColor' }}>
								<path fill="none" d="M0 0h24v24H0z" />
								<path d="M11 2c4.968 0 9 4.032 9 9s-4.032 9-9 9-9-4.032-9-9 4.032-9 9-9zm0 16c3.867 0 7-3.133 7-7 0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7zm8.485.071l2.829 2.828-1.415 1.415-2.828-2.829 1.414-1.414z" />
							</svg>
						</div>
						<div className="mr-2 flex flex-col justify-center">{isZh ? '搜索...' : 'Search...'}</div>
						<div className="rounded-sm bg-black/5 px-1 dark:bg-white/5">{cmdKey} K</div>
					</button>
					<a
						href={currentRoute.includes('/guide') ? 'javascript:void(0)' : '/guide'}
						className={`px-2 py-1${currentRoute.includes('/guide') ? 'text-primary dark:text-dark' : ''}`}
					>
						{isZh ? '指南' : 'Guide'}
					</a>
					<a
						href={currentRoute.includes('/components') ? 'javascript:void(0)' : '/components?nav=button&tab=0'}
						className={`inline-block px-2 py-1 text-center${currentRoute.includes('/components') ? 'text-primary dark:text-dark pointer-events-none' : ''}`}
					>
						{isZh ? '组件' : 'Components'}
					</a>
					<div
						className="relative"
						role="button"
						tabIndex={0}
						ref={themeSwitchDesktopRef}
						onMouseEnter={() => setShowThemeSwitch(true)}
						onMouseLeave={() => setShowThemeSwitch(false)}
					>
						<button className="px-2 py-1 text-center" type="button">
							{isZh ? '主题' : 'Theme'}
						</button>
						{showThemeSwitch ? (
							<div className="absolute top-8 left-1/2 -translate-x-1/2 pt-2">
								<div className="w-max min-w-44 rounded-md bg-white px-3 pt-2 pb-1 shadow-lg dark:bg-black/95 dark:shadow-white/10">
									<div className="mb-2 flex items-center justify-between">
										<div className="w-auto">
											<ModeSwitch />
										</div>
										<a
											href="/guide/generator"
											target="_blank"
											className="text-primary hover:bg-primary/10 dark:text-dark dark:hover:bg-dark/10 flex shrink-0 items-center gap-1 rounded-sm px-2 py-1 text-xs whitespace-nowrap transition-all duration-300"
										>
											<svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
												<path
													className="fill-primary dark:fill-dark"
													d="M15.1986 9.94435C14.7649 9.53358 14.4859 8.98601 14.4085 8.39371L14.0056 5.31126L11.275 6.79711C10.7503 7.08262 10.1433 7.17876 9.55608 7.06936L6.49998 6.50003L7.06931 9.55612C7.17871 10.1434 7.08257 10.7503 6.79707 11.275L5.31121 14.0056L8.39367 14.4085C8.98596 14.4859 9.53353 14.7649 9.94431 15.1986L12.0821 17.4555L13.4178 14.6485C13.6745 14.1091 14.109 13.6745 14.6484 13.4179L17.4555 12.0821L15.1986 9.94435ZM15.2238 15.5078L13.0111 20.1579C12.8687 20.4572 12.5107 20.5843 12.2115 20.4419C12.1448 20.4102 12.0845 20.3664 12.0337 20.3127L8.49229 16.574C8.39749 16.4739 8.27113 16.4095 8.13445 16.3917L3.02816 15.7242C2.69958 15.6812 2.46804 15.3801 2.51099 15.0515C2.52056 14.9782 2.54359 14.9074 2.5789 14.8425L5.04031 10.3191C5.1062 10.198 5.12839 10.0579 5.10314 9.92241L4.16 4.85979C4.09931 4.53402 4.3142 4.22074 4.63997 4.16005C4.7126 4.14652 4.78711 4.14652 4.85974 4.16005L9.92237 5.10319C10.0579 5.12843 10.198 5.10625 10.319 5.04036L14.8424 2.57895C15.1335 2.42056 15.4979 2.52812 15.6562 2.81919C15.6916 2.88409 15.7146 2.95495 15.7241 3.02821L16.3916 8.13449C16.4095 8.27118 16.4739 8.39754 16.5739 8.49233L20.3127 12.0337C20.5533 12.2616 20.5636 12.6414 20.3357 12.8819C20.2849 12.9356 20.2246 12.9794 20.1579 13.0111L15.5078 15.2238C15.3833 15.2831 15.283 15.3833 15.2238 15.5078ZM16.0206 17.4349L17.4348 16.0207L21.6775 20.2633L20.2633 21.6775L16.0206 17.4349Z"
												/>
											</svg>
											{isZh ? '创建新主题' : 'Create'}
										</a>
									</div>
									<ThemeSwitch vertical />
								</div>
							</div>
						) : null}
					</div>
					<button className="cursor-pointer px-2 py-1 text-center" onClick={toggleFund} type="button">
						{isZh ? '支持' : 'Support'}
					</button>
					<button
						onClick={switchLang}
						className="cursor-pointer px-2 py-1 text-center"
						aria-label={isZh ? '跳转英文站点' : 'Jump to Chinese Site'}
						type="button"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="inline-block">
							<path fill="none" d="M0 0h24v24H0z" />
							<path
								fill="currentColor"
								d="M5 15v2a2 2 0 0 0 1.85 1.995L7 19h3v2H7a4 4 0 0 1-4-4v-2h2zm13-5l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16 10h2zm-1 2.885L15.753 16h2.492L17 12.885zM8 2v2h4v7H8v3H6v-3H2V4h4V2h2zm9 1a4 4 0 0 1 4 4v2h-2V7a2 2 0 0 0-2-2h-3V3h3zM6 6H4v3h2V6zm4 0H8v3h2V6z"
							/>
						</svg>
					</button>
					<a
						href="https://github.com/any-tdf/rtdf"
						className="inline-block px-2 py-1"
						target="_blank"
						aria-label={isZh ? '跳转至 GitHub' : 'Jump to GitHub'}
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M12 2.23999C6.475 2.23999 2 6.71499 2 12.24C2 16.665 4.8625 20.4025 8.8375 21.7275C9.3375 21.815 9.525 21.515 9.525 21.2525C9.525 21.015 9.5125 20.2275 9.5125 19.39C7 19.8525 6.35 18.7775 6.15 18.215C6.0375 17.9275 5.55 17.04 5.125 16.8025C4.775 16.615 4.275 16.1525 5.1125 16.14C5.9 16.1275 6.4625 16.865 6.65 17.165C7.55 18.6775 8.9875 18.2525 9.5625 17.99C9.65 17.34 9.9125 16.9025 10.2 16.6525C7.975 16.4025 5.65 15.54 5.65 11.715C5.65 10.6275 6.0375 9.72749 6.675 9.02749C6.575 8.77749 6.225 7.75249 6.775 6.37749C6.775 6.37749 7.6125 6.11499 9.525 7.40249C10.325 7.17749 11.175 7.06499 12.025 7.06499C12.875 7.06499 13.725 7.17749 14.525 7.40249C16.4375 6.10249 17.275 6.37749 17.275 6.37749C17.825 7.75249 17.475 8.77749 17.375 9.02749C18.0125 9.72749 18.4 10.615 18.4 11.715C18.4 15.5525 16.0625 16.4025 13.8375 16.6525C14.2 16.965 14.5125 17.565 14.5125 18.5025C14.5125 19.84 14.5 20.915 14.5 21.2525C14.5 21.515 14.6875 21.8275 15.1875 21.7275C17.1727 21.0573 18.8977 19.7815 20.1198 18.0795C21.3419 16.3776 21.9995 14.3352 22 12.24C22 6.71499 17.525 2.23999 12 2.23999Z"
								fill="currentColor"
							/>
						</svg>
					</a>
				</div>
			</div>
		</div>
	);
};

export default Header;
