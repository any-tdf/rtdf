import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { menuList, type MenuList, type MenuListChild } from '../data/menuList';
import { useAppContext } from '../store/appStore';

type LatelyList = MenuListChild[];

const flattenMenuList = (list: MenuList[]) => {
	return list.reduce<MenuListChild[]>((acc, cur) => {
		if (cur.childs) acc.push(...cur.childs);
		return acc;
	}, []);
};

const CmdK = () => {
	const { lang, isCmdK, setIsCmdK } = useAppContext();
	const isZh = lang === 'zh_CN';
	const navigate = useNavigate();
	const menuChildList = useMemo(() => flattenMenuList(menuList), []);
	const [cmdKValue, setCmdKValue] = useState('');
	const [currentIndex, setCurrentIndex] = useState(0);
	const [currentTab, setCurrentTab] = useState(0);
	const [cmdFocus, setCmdFocus] = useState(false);
	const [isDemoShake, setIsDemoShake] = useState(false);
	const [isGuideShake, setIsGuideShake] = useState(false);
	const [latelyList, setLatelyList] = useState<LatelyList>(() => {
		const stored = localStorage.getItem('latelyList');
		return stored ? (JSON.parse(stored) as LatelyList) : [];
	});
	const inputRef = useRef<HTMLInputElement | null>(null);

	const cmdKList = useMemo(() => {
		if (cmdKValue === '') return latelyList;
		const value = cmdKValue.toLowerCase();
		return menuChildList.filter((item) => item.alias.toLowerCase().includes(value));
	}, [cmdKValue, latelyList, menuChildList]);

	const currentMenu = cmdKList[currentIndex];

	const closeCmdK = () => {
		setIsCmdK(false);
		setCmdFocus(false);
		setCmdKValue('');
		setIsDemoShake(false);
		setIsGuideShake(false);
	};

	const shakeButton = (setShake: (value: boolean) => void) => {
		setShake(true);
		window.setTimeout(() => {
			setShake(false);
		}, 820);
	};

	const recordLately = (menu: MenuListChild) => {
		let nextList = [...latelyList];
		if (nextList.length > 0 && nextList[0]?.nav) {
			const index = nextList.findIndex((item) => item.nav === menu.nav);
			if (index > -1) {
				nextList = nextList.filter((item) => item.nav !== menu.nav);
				nextList.unshift(menu);
			} else {
				nextList.unshift(menu);
			}
		} else {
			nextList.push(menu);
		}
		if (nextList.length > 3) nextList.pop();
		setLatelyList(nextList);
		localStorage.setItem('latelyList', JSON.stringify(nextList));
	};

	const selectMenu = (menu: MenuListChild, tabIndex: number) => {
		recordLately(menu);
		setIsCmdK(false);
		setCmdFocus(false);
		setCmdKValue('');
		setIsDemoShake(false);
		setIsGuideShake(false);
		navigate(`/components?nav=${menu.nav}&tab=${tabIndex}`);
		setTimeout(() => {
			if (window.location.pathname.includes('/components')) {
				window.location.reload();
			}
		}, 10);
	};

	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
			const isCmdKEvent = event.key.toLowerCase() === 'k' && (isMac ? event.metaKey : event.ctrlKey);

			if (isCmdKEvent) {
				const stored = localStorage.getItem('latelyList');
				setLatelyList(stored ? (JSON.parse(stored) as LatelyList) : []);
				if (isCmdK) {
					setIsCmdK(false);
					setCmdFocus(false);
				} else {
					setIsCmdK(true);
					setCmdFocus(true);
					setCmdKValue('');
					setCurrentIndex(0);
					setCurrentTab(0);
					setIsDemoShake(false);
					setIsGuideShake(false);
					setTimeout(() => {
						inputRef.current?.focus();
					}, 0);
				}
				event.preventDefault();
				return;
			}

			if (isCmdK && event.key === 'Escape') {
				event.preventDefault();
				if (!cmdFocus) {
					setCmdFocus(true);
					setTimeout(() => {
						inputRef.current?.focus();
						inputRef.current?.select();
					}, 0);
				} else {
					closeCmdK();
				}
				return;
			}

			if (isCmdK && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
				event.preventDefault();
				if (cmdKList.length === 0) return;
				setCmdFocus(false);
				inputRef.current?.blur();
				if (event.key === 'ArrowUp') {
					if (currentIndex === 0 && currentTab === 0) {
						shakeButton(setIsDemoShake);
						return;
					}
					if (currentTab === 0) {
						setCurrentIndex((prev) => (prev === 0 ? cmdKList.length - 1 : prev - 1));
						setCurrentTab(2);
					} else {
						setCurrentTab((prev) => prev - 1);
					}
				}
				if (event.key === 'ArrowDown') {
					if (currentIndex === cmdKList.length - 1 && currentTab === 2) {
						shakeButton(setIsGuideShake);
						return;
					}
					if (currentTab === 2) {
						setCurrentIndex((prev) => (prev === cmdKList.length - 1 ? 0 : prev + 1));
						setCurrentTab(0);
					} else {
						setCurrentTab((prev) => prev + 1);
					}
				}
				return;
			}

			if (isCmdK && event.key === 'Enter' && currentMenu) {
				selectMenu(currentMenu, currentTab);
			}
		};

		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [cmdFocus, cmdKList.length, currentIndex, currentMenu, currentTab, isCmdK, setIsCmdK]);

	useEffect(() => {
		if (!isCmdK) return;
		setCmdFocus(true);
		setCurrentIndex(0);
		setCurrentTab(0);
		setIsDemoShake(false);
		setIsGuideShake(false);
		setTimeout(() => {
			inputRef.current?.focus();
		}, 0);
	}, [isCmdK]);

	useEffect(() => {
		if (currentIndex >= cmdKList.length) {
			setCurrentIndex(0);
		}
	}, [cmdKList.length, currentIndex]);

	if (!isCmdK) return null;

	return (
		<div
			className="animate-cmdk-fade fixed top-0 left-0 flex h-screen w-screen flex-col bg-black/20 pt-20 text-left backdrop-blur-sm"
			style={{ zIndex: 10000 }}
			onClick={closeCmdK}
		>
			<div className="animate-cmdk-scale mx-auto rounded-xl bg-white shadow-lg dark:bg-black" onClick={(event) => event.stopPropagation()}>
				<div className="flex items-center border-b border-black/10 px-4 py-3 text-sm text-gray-500 dark:border-white/10">
					<div>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style={{ fill: 'currentColor' }}>
							<path fill="none" d="M0 0h24v24H0z" />
							<path d="M11 2c4.968 0 9 4.032 9 9s-4.032 9-9 9-9-4.032-9-9 4.032-9 9-9zm0 16c3.867 0 7-3.133 7-7 0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7zm8.485.071l2.829 2.828-1.415 1.415-2.828-2.829 1.414-1.414z" />
						</svg>
					</div>
					<div className="grow px-3 text-gray-800 dark:text-gray-200">
						<input
							ref={inputRef}
							value={cmdKValue}
							onChange={(event) => setCmdKValue(event.target.value)}
							className="caret-primary dark:caret-dark w-full placeholder:text-black/20 focus:outline-hidden dark:bg-black dark:placeholder:text-white/30"
							type="text"
							placeholder={isZh ? '请输入组件关键字' : 'Please enter the component keyword'}
						/>
					</div>
					<div className="rounded-sm border border-black/10 px-2 py-1 text-xs font-bold dark:border-white/10">ESC</div>
				</div>
				<div className="overflow-y-auto px-6 pb-6" style={{ maxHeight: `${(document.documentElement.clientHeight * 3) / 4}px` }}>
					{cmdKValue === '' ? (
						<div className="mt-2 text-xs text-black/50 dark:text-white/30">
							{latelyList.length === 0
								? isZh
									? '最近无搜索，请输入关键字搜索。'
									: 'No recent searches, please enter a keyword to search.'
								: isZh
									? `最近搜索 ${latelyList.length} 条结果`
									: `Recent search ${latelyList.length} results`}
						</div>
					) : cmdKList.length === 0 ? (
						<div className="mt-2 text-xs text-black/50 dark:text-white/30">{isZh ? '没有搜索到结果。' : 'No results found.'}</div>
					) : (
						<div className="mt-2 text-xs text-black/50 dark:text-white/30">
							{isZh
								? `搜索到包含 “${cmdKValue}” 的 ${cmdKList.length} 条结果`
								: `Found ${cmdKList.length} results containing "${cmdKValue}"`}
						</div>
					)}
					{cmdKList.map((item, index) => (
						<div key={item.nav}>
							<div className="flex items-center">
								<div
									className={`mr-2 w-lg transition-all ${
										index === currentIndex ? 'text-primary dark:text-dark text-xl font-bold' : 'text-lg text-black dark:text-white'
									}`}
								>
									{isZh ? item.title : item.title_en}
								</div>
								<div className="w-full dark:border-white/10">
									<button
										className={`my-1 flex w-full cursor-pointer justify-between rounded-sm border py-1 pl-2 ${
											index === currentIndex && currentTab === 0
												? 'border-primary dark:border-dark text-primary dark:text-dark'
												: 'border-transparent text-black dark:text-white'
										} ${isDemoShake && index === 0 ? 'animate-shake' : ''}`}
										onClick={() => selectMenu(item, 0)}
										type="button"
									>
										<div>{isZh ? '示例' : 'Demo'}</div>
										<div>
											<svg
												className={index === currentIndex && currentTab === 0 ? 'fill-primary dark:fill-dark' : 'fill-gray-500'}
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												width="24"
												height="24"
											>
												<path fill="none" d="M0 0h24v24H0z" />
												<path d="M12.172 12L9.343 9.172l1.414-1.415L15 12l-4.243 4.243-1.414-1.415z" />
											</svg>
										</div>
									</button>
									<button
										className={`my-1 flex w-full cursor-pointer justify-between rounded-sm border py-1 pl-2 ${
											index === currentIndex && currentTab === 1
												? 'border-primary dark:border-dark text-primary dark:text-dark'
												: 'border-transparent text-black dark:text-white'
										}`}
										onClick={() => selectMenu(item, 1)}
										type="button"
									>
										<div>API</div>
										<div>
											<svg
												className={index === currentIndex && currentTab === 1 ? 'fill-primary dark:fill-dark' : 'fill-gray-500'}
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												width="24"
												height="24"
											>
												<path fill="none" d="M0 0h24v24H0z" />
												<path d="M12.172 12L9.343 9.172l1.414-1.415L15 12l-4.243 4.243-1.414-1.415z" />
											</svg>
										</div>
									</button>
									<button
										className={`my-1 flex w-full cursor-pointer justify-between rounded-sm border py-1 pl-2 ${
											index === currentIndex && currentTab === 2
												? 'border-primary dark:border-dark text-primary dark:text-dark'
												: 'border-transparent text-black dark:text-white'
										} ${isGuideShake && index === cmdKList.length - 1 ? 'animate-shake' : ''}`}
										onClick={() => selectMenu(item, 2)}
										type="button"
									>
										<div>{isZh ? '指南' : 'Guide'}</div>
										<div>
											<svg
												className={index === currentIndex && currentTab === 2 ? 'fill-primary dark:fill-dark' : 'fill-gray-500'}
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												width="24"
												height="24"
											>
												<path fill="none" d="M0 0h24v24H0z" />
												<path d="M12.172 12L9.343 9.172l1.414-1.415L15 12l-4.243 4.243-1.414-1.415z" />
											</svg>
										</div>
									</button>
								</div>
							</div>
							<div className="h-px bg-black/5 dark:bg-white/10"></div>
						</div>
					))}
				</div>
				<div className="flex gap-4 border-t border-black/10 px-4 py-2 text-xs opacity-60 dark:border-white/10">
					<div className="flex gap-1">
						<div className="flex size-4 flex-col items-center justify-center rounded-xs bg-black/10 p-0.5 dark:bg-white/30">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-black dark:fill-white">
								<path d="M19.0003 13.9999L19.0004 5.00003L17.0004 5L17.0003 11.9999L6.82845 12L10.7782 8.05027L9.36396 6.63606L3 13L9.36396 19.364L10.7782 17.9498L6.8284 14L19.0003 13.9999Z" />
							</svg>
						</div>
						{isZh ? '选择' : 'Select'}
					</div>
					<div className="flex gap-1">
						<div className="flex size-4 flex-col items-center justify-center rounded-xs bg-black/10 p-0.5 dark:bg-white/30">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-black dark:fill-white">
								<path d="M12.9999 16.1716L18.3638 10.8076L19.778 12.2218L11.9999 20L4.22168 12.2218L5.63589 10.8076L10.9999 16.1716V4H12.9999V16.1716Z" />
							</svg>
						</div>
						{isZh ? '向下' : 'Down'}
					</div>
					<div className="flex gap-1">
						<div className="flex size-4 flex-col items-center justify-center rounded-xs bg-black/10 p-0.5 dark:bg-white/30">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-black dark:fill-white">
								<path d="M12.9999 7.82843V20H10.9999V7.82843L5.63589 13.1924L4.22168 11.7782L11.9999 4L19.778 11.7782L18.3638 13.1924L12.9999 7.82843Z" />
							</svg>
						</div>
						{isZh ? '向上' : 'Up'}
					</div>
					<div className="flex gap-1">
						<div className="rounded-xs bg-black/10 px-1 text-xs dark:bg-white/30">Esc</div>
						{isZh ? '关闭' : 'Close'}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CmdK;
