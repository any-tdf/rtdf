import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { encodeData, rendererLine } from 'beautify-qrcode';
import Confetti from '@any-tdf/react-confetti';
import { Avatar, Button, Card, Icon, Input, Loading, NoticeBar, Pagination, Rate, Slider, Swiper, Switch, Tab } from 'rtdf/components';
import { themes } from 'rtdf/theme';
import LazyLoad from '../components/LazyLoad';
import ApiPlayground from '../components/home/ApiPlayground';
import ApiRichness from '../components/home/ApiRichness';
import ComponentsGrid from '../components/home/ComponentsGrid';
import MobileAdvantages from '../components/home/MobileAdvantages';
import StatCounter from '../components/home/StatCounter';
import TechStack from '../components/home/TechStack';
import TerminalDemo from '../components/home/TerminalDemo';
import ThemeSystem from '../components/home/ThemeSystem';
import {
	avatarImgs,
	bottomInfo,
	descList,
	getRandomEmoji,
	getRandomSwiperOption,
	inputStyleList,
	paginationTypeList,
	randomBool,
	randomPick,
	randomRange,
	sliderShowTipList,
	switchInsideList,
	themeLabels,
	thinkGithub,
	ugly
} from '../data/homeData';
import { menuList, type MenuList, type MenuListChild } from '../data/menuList';
import { useFadeInUp, useStaggerChildren } from '../hooks/animations';
import { useAppContext } from '../store/appStore';

const flattenMenuList = (list: MenuList[]) =>
	list.reduce<MenuListChild[]>((acc, cur) => {
		if (cur.childs) acc.push(...cur.childs);
		return acc;
	}, []);

const Home = () => {
	const { lang, currentColor, themeMode, sysTheme, setCurrentColor } = useAppContext();
	const isZh = lang === 'zh_CN';
	const resolvedMode = themeMode === 'auto' ? sysTheme : themeMode;
	const dataMode = resolvedMode === 'dark' ? 'dark' : 'primary';

	const menuChildList = useMemo(() => flattenMenuList(menuList), []);
	const randomMenuChildList = useMemo(() => {
		const next = [...menuChildList];
		return next.sort(() => Math.random() - 0.5).slice(0, 3);
	}, [menuChildList]);
	const labels = useMemo(
		() => randomMenuChildList.map((item) => ({ text: isZh ? item.title_zh : item.title_en })),
		[isZh, randomMenuChildList]
	);
	const textList = useMemo(
		() =>
			randomMenuChildList.map((item, index) =>
				`${index + 1}. ${isZh ? item.tip : item.tip_en}`
			),
		[isZh, randomMenuChildList]
	);
	const inputList = useMemo(() => randomPick(randomMenuChildList), [randomMenuChildList]);
	const inputTitle = isZh ? inputList.title_zh : inputList.title_en;
	const [inputValue, setInputValue] = useState(isZh ? inputList.tip : inputList.tip_en);
	const showInputConfetti = inputValue === inputTitle;

	const randomNumStr = useMemo(() => `1_${randomRange(1, 53)}`, []);
	const swiperOption = useMemo(() => getRandomSwiperOption(), []);
	const avatar = useMemo(() => randomPick(avatarImgs), []);
	const switchInside = useMemo(() => randomPick(switchInsideList), []);
	const sliderValue = useMemo(() => randomRange(0, 100), []);
	const sliderShowTip = useMemo(() => randomPick(sliderShowTipList), []);
	const inputStyle = useMemo(() => randomPick(inputStyleList), []);
	const emoji = useMemo(() => getRandomEmoji(), []);
	const lineType = useMemo(() => randomBool(), []);
	const paginationTotal = useMemo(() => randomRange(50, 200), []);
	const paginationCurrent = useMemo(() => randomRange(1, Math.floor(paginationTotal / 10)), [paginationTotal]);
	const paginationType = useMemo(() => randomPick(paginationTypeList), []);

	const [showConfetti, setShowConfetti] = useState(false);
	const [showQr, setShowQr] = useState(false);
	const [qrSvg, setQrSvg] = useState('');
	const demoUrl = import.meta.env.DEV
		? `${window.location.protocol}//${window.location.hostname}:8887?lang=${isZh ? 'zh_CN' : 'en_US'}`
		: `https://demo.rtdf.dev?lang=${isZh ? 'zh_CN' : 'en_US'}`;

	const descListRef = useStaggerChildren<HTMLDivElement>({ stagger: 100, duration: 600 });
	const warningTitleRef = useFadeInUp<HTMLDivElement>({ delay: 0, duration: 800, distance: 30 });
	const warningCardsRef = useStaggerChildren<HTMLDivElement>({ stagger: 100, duration: 600 });
	const contributorsTitleRef = useFadeInUp<HTMLDivElement>({ delay: 0, duration: 800, distance: 30 });
	const contributorsListRef = useFadeInUp<HTMLDivElement>({ delay: 100, duration: 800, distance: 30 });
	const sponsorsTitleRef = useFadeInUp<HTMLDivElement>({ delay: 0, duration: 800, distance: 30 });
	const sponsorsListRef = useFadeInUp<HTMLDivElement>({ delay: 100, duration: 800, distance: 30 });

	useEffect(() => {
		setInputValue(isZh ? inputList.tip : inputList.tip_en);
	}, [inputList, isZh]);

	const handleDemoEnter = () => {
		const qrcode = encodeData({
			text: demoUrl,
			isSpace: false
		});
		const color = resolvedMode === 'dark' ? 'var(--color-dark)' : 'var(--color-primary)';
		setQrSvg(rendererLine(qrcode, { posType: 2, otherColor: color, posColor: color }));
		setShowQr(true);
	};

	const randomTheme = () => {
		const next = randomPick(themes);
		setCurrentColor(next.name);
	};

	const currentThemeRadius = useMemo(() => {
		const theme = themes.find((t) => t.name === currentColor) || themes[0];
		return {
			radiusBox: theme['radius-box'],
			radiusForm: theme['radius-form'],
			radiusSmall: theme['radius-small']
		};
	}, [currentColor]);

	return (
		<div className="relative">
			<div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
				<div className="animate-blob from-primary/20 dark:from-dark/15 absolute -left-40 -top-40 h-125 w-125 rounded-full bg-linear-to-r to-purple-500/20 blur-3xl dark:to-cyan-500/15"></div>
				<div className="animation-delay-2000 animate-blob absolute -bottom-40 -right-40 h-125 w-125 rounded-full bg-linear-to-r from-pink-500/20 to-orange-500/20 blur-3xl dark:from-blue-500/15 dark:to-purple-500/15"></div>
				<div className="animation-delay-4000 animate-blob absolute left-1/4 top-1/3 h-100 w-100 rounded-full bg-linear-to-r from-cyan-500/15 to-blue-500/15 blur-3xl dark:from-emerald-500/10 dark:to-teal-500/10"></div>
				<div className="site-home-grid-bg absolute inset-0"></div>
			</div>

			<div className="relative z-10 mx-auto max-w-screen-2xl">
				<div className="justify-center lg:flex">
					<div className="flex basis-2/5 flex-col justify-center py-16 text-center md:py-20">
						<div className="relative mb-20 mt-16 flex h-20 flex-col items-center justify-center md:h-28">
							<div className="animate-dynamicsBg absolute rounded-full opacity-50 blur-xl md:opacity-100 md:blur-3xl">
								<svg viewBox="0 0 100 100">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M50 0V100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0Z"
										className="fill-dark"
									/>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M50 100V0C77.6142 0 100 22.3858 100 50C100 77.6142 77.6142 100 50 100Z"
										className="fill-primary"
									/>
									<circle cx="50" cy="25" r="25" className="fill-primary" />
									<circle cx="50" cy="75" r="25" className="fill-dark" />
									<circle cx="50.25" cy="25.25" r="6.25" className="fill-dark" />
									<circle cx="50.25" cy="75.25" r="6.25" className="fill-primary" />
								</svg>
							</div>
							<div
								className="absolute h-full w-28 md:w-36"
								style={{ filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.05)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))' }}
							>
								<svg viewBox="0 0 90 80">
									<path
										className="fill-primary dark:fill-dark"
										d="M0 0H20H40H50C64.8056 0 77.7325 8.04398 84.6487 20H50H40V22.6757V30H50C55.5229 30 60 34.4771 60 40C60 45.5229 55.5229 50 50 50H40V57.3243V78.7398V80H20V66.4583V20H15.3513H0V0ZM50 80C72.0914 80 90 62.0914 90 40C90 36.547 89.5625 33.1962 88.7398 30H67.3244C69.0261 32.9417 70 36.3571 70 40C70 51.0457 61.0457 60 50 60V80Z"
									/>
									<path className="fill-dark dark:fill-primary" d="M20 30V0L0 50H20V80L40 30H20Z" />
								</svg>
							</div>
						</div>
						<div className="text-6xl md:text-8xl">RTDF</div>
						<div className="md:text-md mb-10 mt-4 px-4 text-gray-700 md:mb-0 dark:text-gray-300">
							{isZh ? (
								<>
									基于{' '}
									<a
										href="https://react.dev"
										className="decoration-react hover:text-react underline underline-offset-2 transition-all"
										target="_blank"
										rel="noreferrer"
										title={isZh ? '打开 React 官方站点' : 'Open React official website'}
									>
										React
									</a>
									{' '}与{' '}
									<a
										href="https://tailwindcss.com/"
										className="decoration-tailwind hover:text-tailwind underline underline-offset-2 transition-all"
										target="_blank"
										rel="noreferrer"
										title={isZh ? '打开 Tailwind CSS 官方站点' : 'Open Tailwind CSS official website'}
									>
										Tailwind CSS
									</a>
									{' '}的移动 Web 组件库
								</>
							) : (
								<>
									Mobile web component
									<br className="md:hidden" />
									library based on{' '}
									<a
										href="https://react.dev"
										className="decoration-react hover:text-react underline underline-offset-2 transition-all"
										target="_blank"
										rel="noreferrer"
									>
										React
									</a>
									{' '}and{' '}
									<a
										href="https://tailwindcss.com/"
										className="decoration-tailwind hover:text-tailwind underline underline-offset-2 transition-all"
										target="_blank"
										rel="noreferrer"
									>
										Tailwind CSS
									</a>
								</>
							)}
						</div>
						<div className="mb-16 mt-8 flex justify-center gap-8 md:mt-16">
							<Link
								to="/guide"
								onMouseEnter={() => setShowConfetti(true)}
								onMouseLeave={() => setShowConfetti(false)}
								className="bg-primary hover:bg-primary/80 dark:bg-dark hover:dark:bg-dark/80 group relative rounded-sm px-6 py-2 text-white transition-all dark:text-black"
							>
								<div className="group flex items-center gap-2">
									{isZh ? '开始使用' : 'Get Started'}
									<div className="size-3 translate-y-px">
										<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
											<rect
												x="6"
												y="14"
												width="10"
												height="2"
												fill="currentColor"
												className="scale-x-135 -translate-x-2 -translate-y-2 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0"
											/>
											<path
												d="M8.48535 7.07129L1.41406 14.1426L0 12.7275L5.65625 7.07031L0 1.41406L1.41406 0L8.48535 7.07129Z"
												fill="currentColor"
												className="translate-x-2 transition-all duration-500 group-hover:translate-x-0"
											/>
										</svg>
									</div>
									{showConfetti ? (
										<span className="absolute left-1/2 top-0">
											<Confetti rounded />
										</span>
									) : null}
								</div>
							</Link>
							<a
								href={demoUrl}
								target="_blank"
								rel="noreferrer"
								onMouseEnter={handleDemoEnter}
								onMouseLeave={() => setShowQr(false)}
								className="border-primary dark:border-dark relative hidden rounded-sm border border-solid px-6 py-2 transition-all md:block"
							>
								{isZh ? '示例' : 'Demo'}
								{showQr ? (
									<>
										<div className="z-100 absolute left-full top-0 block w-44 -translate-y-1/3 translate-x-1 rounded-lg border border-black/5 p-2 shadow-lg dark:hidden">
											<span dangerouslySetInnerHTML={{ __html: qrSvg }} />
										</div>
										<div className="z-100 absolute left-full top-0 hidden w-44 -translate-y-1/3 translate-x-1 rounded-lg border bg-black p-2 shadow-lg shadow-white/10 dark:block dark:border-white/10">
											<span dangerouslySetInnerHTML={{ __html: qrSvg }} />
										</div>
									</>
								) : null}
							</a>
							<a
								href={demoUrl}
								target="_blank"
								rel="noreferrer"
								className="border-primary dark:border-dark block rounded-sm border border-solid px-6 py-2 transition-all md:hidden"
							>
								{isZh ? '示例' : 'Demo'}
							</a>
						</div>
					</div>
					<div
						className="relative mt-10 hidden basis-3/5 xl:mt-0 xl:block"
						data-theme={currentColor}
						data-mode={dataMode}
						style={{
							['--radius-box' as string]: currentThemeRadius.radiusBox,
							['--radius-form' as string]: currentThemeRadius.radiusForm,
							['--radius-small' as string]: currentThemeRadius.radiusSmall
						}}
					>
						<div className="animate-elementUpDownMove1 -translate-x-18 absolute inset-1/2 size-20 -translate-y-12">
							{avatar ? <Avatar size="md" image={avatar} injClass="shadow-lg dark:shadow-white/10" /> : <Avatar size="md" injClass="shadow-lg dark:shadow-white/10" />}
						</div>
						<div className="animate-elementUpDownMove1 absolute inset-1/2 -translate-x-96 -translate-y-40">
							<Loading type={randomNumStr} theme lazyAnimation={false} />
						</div>
						<div className="animate-elementUpDownMove3 absolute inset-1/2 -translate-y-48 translate-x-52">
							<Switch inside={switchInside} active />
						</div>
						<div className="animate-elementUpDownMove6 -translate-y-42 absolute inset-1/2 w-96 -translate-x-72">
							<Tab labels={labels} lineType={lineType} />
						</div>
						<div className="animate-elementUpDownMove5 absolute inset-1/2 h-24 w-96 translate-x-20 translate-y-6">
							<Card bg="gray" injClass="shadow-lg dark:shadow-white/10 px-2">
								<Input
									title={inputTitle}
									value={inputValue}
										placeholder={isZh ? `请输入${inputTitle}` : `Input ${inputTitle}`}
										inputStyle={inputStyle}
									lineTransition="left"
									clear
									onChange={setInputValue}
								/>
							</Card>
							<span className={`absolute left-0 top-1/2 ${showInputConfetti ? 'block' : 'hidden'}`}>
								<Confetti infinite rounded x={[-0.5, 0.5]} y={[-0.5, 0.5]} />
							</span>
						</div>
						<div className="animate-elementUpDownMove6 absolute inset-1/2 w-96 translate-x-2 translate-y-48">
							<Pagination total={paginationTotal} type={paginationType} current={paginationCurrent} injClass="shadow-lg dark:shadow-white/10" />
						</div>
						<div className="animate-elementUpDownMove4 absolute inset-1/2 w-64 -translate-x-80 -translate-y-8">
							{emoji === 'default' ? (
								<Rate />
							) : (
								<Rate half opacity="0.2" value={3.5}>
									{emoji === 'love' ? <Icon name="ri-heart-3-fill" injClass="text-red-500" /> : <div className="text-xl">{emoji}</div>}
								</Rate>
							)}
						</div>
						<div className="animate-elementUpDownMove3 absolute inset-1/2 w-96 -translate-x-96 -translate-y-80">
							<Card bg="gray" injClass="shadow-lg dark:shadow-white/10 p-3">
								<NoticeBar vertical textList={textList}></NoticeBar>
							</Card>
						</div>
						<div className="animate-elementUpDownMove1 absolute inset-1/2 w-64 -translate-y-20 translate-x-32">
							<Slider value={sliderValue} showTip={sliderShowTip} />
						</div>
						<div className="animate-elementUpDownMove5 h-54 -translate-x-110 absolute inset-1/2 w-97.5 translate-y-16 overflow-hidden">
							<Swiper {...swiperOption} />
						</div>
						<div className="animate-elementUpDownMove1 -translate-y-74 group absolute inset-1/2 w-64 translate-x-32">
							<Button heightIn="2" onClick={randomTheme}>
								<span className="transition-all duration-500 group-hover:translate-x-1">
									{isZh ? themeLabels[currentColor] || currentColor : currentColor}
								</span>
								<span className="ml-1 size-4 -translate-x-4 text-white opacity-0 transition-all delay-100 duration-500 group-hover:translate-x-0 group-hover:opacity-100 dark:text-black">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
										<path d="M1.99974 13.0001L1.9996 11.0002L18.1715 11.0002L14.2218 7.05044L15.636 5.63623L22 12.0002L15.636 18.3642L14.2218 16.9499L18.1716 13.0002L1.99974 13.0001Z" />
									</svg>
								</span>
							</Button>
						</div>
					</div>
				</div>
				<div ref={descListRef} className="mt-16 flex flex-wrap justify-around gap-12 px-8 xl:flex-nowrap">
					{descList.map((desc) => (
						<div
							key={desc.title}
							className="shadow-primary/10 dark:shadow-dark/20 group flex w-full flex-col space-y-5 overflow-hidden rounded-2xl shadow-xl transition-all duration-300 sm:w-2/3 md:w-80 lg:w-96"
						>
							<div className="relative w-full">
								<img className="aspect-5/3 block h-full w-full object-cover transition-all duration-500 group-hover:scale-125 dark:hidden" src={desc.icon} alt="" />
								<img className="aspect-5/3 hidden h-full w-full object-cover transition-all duration-500 group-hover:scale-125 dark:block" src={desc.icon_d} alt="" />
								<div className="text-shadow-lg bg-primary/10 dark:bg-dark/10 absolute bottom-1.5 left-0 right-0 mx-1.5 flex flex-col justify-center rounded-2xl border border-white/30 px-3 py-1.5 text-white backdrop-blur-sm">
									<div className="mb-0.5 text-3xl font-bold transition-all duration-500 group-hover:translate-x-4">{desc.title}</div>
									<div className="text-xs font-bold transition-all duration-500">{isZh ? desc.desc : desc.descEn}</div>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="mt-16 px-8">
					<TerminalDemo />
				</div>

				<div className="mt-16 px-4">
					<ThemeSystem />
				</div>

				<div className="mt-16 px-8">
					<LazyLoad height="600px">
						<StatCounter />
					</LazyLoad>
				</div>

				<div className="mt-16 flex flex-col gap-8 px-8 xl:flex-row xl:items-start xl:gap-12">
					<div className="xl:w-1/2">
						<LazyLoad height="600px">
							<ApiPlayground />
						</LazyLoad>
					</div>
					<div className="xl:w-1/2">
						<LazyLoad height="600px">
							<ApiRichness />
						</LazyLoad>
					</div>
				</div>

				<div className="mt-16 px-8">
					<LazyLoad height="800px">
						<MobileAdvantages />
					</LazyLoad>
				</div>

				<div className="mt-16 px-8">
					<LazyLoad height="700px">
						<TechStack />
					</LazyLoad>
				</div>

				<div className="mt-16 px-8">
					<LazyLoad height="600px">
						<ComponentsGrid />
					</LazyLoad>
				</div>

				<section className="py-20 md:py-32">
					<div className="mx-auto max-w-6xl px-4">
						<div ref={warningTitleRef} className="mb-12 text-center">
							<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-sm text-amber-600 dark:border-amber-400/20 dark:bg-amber-400/5 dark:text-amber-400">
								<svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12.866 3l9.526 16.5a1 1 0 0 1-.866 1.5H2.474a1 1 0 0 1-.866-1.5L11.134 3a1 1 0 0 1 1.732 0zM11 16v2h2v-2h-2zm0-7v5h2V9h-2z" />
								</svg>
								<span>{isZh ? '提前警告' : 'Early Warning'}</span>
							</div>

							<h2 className="mb-4 bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-3xl font-bold text-transparent md:text-4xl dark:from-white dark:via-gray-300 dark:to-white">
								{isZh ? '使用前须知' : 'Before You Start'}
							</h2>
							<p className="mx-auto max-w-2xl text-base text-gray-600 dark:text-gray-400">
								{isZh ? '一些需要提前了解的事项' : 'Things you need to know in advance'}
							</p>
						</div>

						<div ref={warningCardsRef} className="grid grid-cols-1 gap-6 md:grid-cols-2">
							{ugly.data.map((item, index) => {
								const warningIcons = [
									'M12 6.99999C16.4183 6.99999 20 10.5817 20 15C20 19.4183 16.4183 23 12 23C7.58172 23 4 19.4183 4 15C4 10.5817 7.58172 6.99999 12 6.99999ZM12 8.99999C8.68629 8.99999 6 11.6863 6 15C6 18.3137 8.68629 21 12 21C15.3137 21 18 18.3137 18 15C18 11.6863 15.3137 8.99999 12 8.99999ZM12 10.5L13.3225 13.1797L16.2798 13.6094L14.1399 15.6953L14.645 18.6406L12 17.25L9.35497 18.6406L9.86012 15.6953L7.72025 13.6094L10.6775 13.1797L12 10.5ZM18 1.99999V4.99999L16.6366 6.13755C15.5305 5.5577 14.3025 5.17884 13.0011 5.04948L13 1.99899L18 1.99999ZM11 1.99899L10.9997 5.04939C9.6984 5.17863 8.47046 5.55735 7.36441 6.13703L6 4.99999V1.99999L11 1.99899Z',
									'M3.16113 4.46875C5.58508 2.0448 9.44716 1.9355 12.0008 4.14085C14.5528 1.9355 18.4149 2.0448 20.8388 4.46875C23.2584 6.88836 23.3716 10.741 21.1785 13.2947L13.4142 21.0858C12.6686 21.8313 11.4809 21.8652 10.6952 21.1874L10.5858 21.0858L2.82141 13.2947C0.628282 10.741 0.741522 6.88836 3.16113 4.46875ZM4.57534 5.88296C2.86819 7.59011 2.81942 10.3276 4.42902 12.0937L4.57534 12.2469L12 19.6715L17.3026 14.3675L13.7677 10.8327L12.7071 11.8934C11.5355 13.0649 9.636 13.0649 8.46443 11.8934C7.29286 10.7218 7.29286 8.8223 8.46443 7.65073L10.5656 5.54823C8.85292 4.17713 6.37076 4.23993 4.7286 5.73663L4.57534 5.88296ZM13.0606 8.71139C13.4511 8.32086 14.0843 8.32086 14.4748 8.71139L18.7168 12.9533L19.4246 12.2469C21.1819 10.4896 21.1819 7.64032 19.4246 5.88296C17.7174 4.17581 14.9799 4.12704 13.2139 5.73663L13.0606 5.88296L9.87864 9.06494C9.51601 9.42757 9.49011 9.99942 9.80094 10.3919L9.87864 10.4792C10.2413 10.8418 10.8131 10.8677 11.2056 10.5569L11.2929 10.4792L13.0606 8.71139Z',
									'M10.6144 17.7956C10.277 18.5682 9.20776 18.5682 8.8704 17.7956L7.99275 15.7854C7.21171 13.9966 5.80589 12.5726 4.0523 11.7942L1.63658 10.7219C.868536 10.381.868537 9.26368 1.63658 8.92276L3.97685 7.88394C5.77553 7.08552 7.20657 5.60881 7.97427 3.75892L8.8633 1.61673C9.19319.821767 10.2916.821765 10.6215 1.61673L11.5105 3.75894C12.2782 5.60881 13.7092 7.08552 15.5079 7.88394L17.8482 8.92276C18.6162 9.26368 18.6162 10.381 17.8482 10.7219L15.4325 11.7942C13.6789 12.5726 12.2731 13.9966 11.492 15.7854L10.6144 17.7956ZM4.53956 9.82234C6.8254 10.837 8.68402 12.5048 9.74238 14.7996 10.8008 12.5048 12.6594 10.837 14.9452 9.82234 12.6321 8.79557 10.7676 7.04647 9.74239 4.71088 8.71719 7.04648 6.85267 8.79557 4.53956 9.82234ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899ZM18.3745 19.0469 18.937 18.4883 19.4878 19.0469 18.937 19.5898 18.3745 19.0469Z',
									'M6 5C5.44772 5 5 5.44772 5 6C5 6.55228 5.44772 7 6 7C6.55228 7 7 6.55228 7 6C7 5.44772 6.55228 5 6 5ZM3 6C3 4.34315 4.34315 3 6 3C7.65685 3 9 4.34315 9 6C9 7.30622 8.16519 8.41746 7 8.82929V15.1707C8.16519 15.5825 9 16.6938 9 18C9 19.6569 7.65685 21 6 21C4.34315 21 3 19.6569 3 18C3 16.6938 3.83481 15.5825 5 15.1707V8.82929C3.83481 8.41746 3 7.30622 3 6ZM15.2929 3.29289C15.6834 2.90237 16.3166 2.90237 16.7071 3.29289L18 4.58579L19.2929 3.29289C19.6834 2.90237 20.3166 2.90237 20.7071 3.29289C21.0976 3.68342 21.0976 4.31658 20.7071 4.70711L19.4142 6L20.7071 7.29289C21.0976 7.68342 21.0976 8.31658 20.7071 8.70711C20.3166 9.09763 19.6834 9.09763 19.2929 8.70711L18 7.41421L16.7071 8.70711C16.3166 9.09763 15.6834 9.09763 15.2929 8.70711C14.9024 8.31658 14.9024 7.68342 15.2929 7.29289L16.5858 6L15.2929 4.70711C14.9024 4.31658 14.9024 3.68342 15.2929 3.29289ZM18 10C18.5523 10 19 10.4477 19 11V15.1707C20.1652 15.5825 21 16.6938 21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18C15 16.6938 15.8348 15.5825 17 15.1707V11C17 10.4477 17.4477 10 18 10ZM6 17C5.44772 17 5 17.4477 5 18C5 18.5523 5.44772 19 6 19C6.55228 19 7 18.5523 7 18C7 17.4477 6.55228 17 6 17ZM18 17C17.4477 17 17 17.4477 17 18C17 18.5523 17.4477 19 18 19C18.5523 19 19 18.5523 19 18C19 17.4477 18.5523 17 18 17Z'
								];
								return (
									<div
										key={item.p}
										className="group rounded-2xl bg-white/50 p-6 transition-all duration-500 ease-out hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/80"
									>
										<div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-amber-500/10 transition-transform duration-300 group-hover:scale-110 dark:bg-amber-400/10">
											<svg className="size-6 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="currentColor">
												<path d={warningIcons[index]} />
											</svg>
										</div>
										<p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{isZh ? item.p : item.p_en}</p>
									</div>
								);
							})}
						</div>
					</div>
				</section>

				<div className="px-4 pb-10 text-center md:px-12 md:pb-20">
					<div ref={contributorsTitleRef} className="my-5 text-2xl font-bold transition-all ease-out md:my-10 md:text-4xl">
						🎖 {isZh ? '贡献者' : 'Contributors'}
					</div>
					<div ref={contributorsListRef} className="flex justify-center">
						<a href="https://github.com/any-tdf/rtdf/graphs/contributors" target="_blank" rel="noreferrer">
							<img src="https://contrib.nn.ci/api?repo=any-tdf/rtdf&cols=7" title={isZh ? '贡献者' : 'Contributors'} alt="" />
						</a>
					</div>
				</div>

				<div className="px-4 pb-20 text-center md:px-12 md:pb-40">
					<div ref={sponsorsTitleRef} className="my-5 text-2xl font-bold transition-all ease-out md:my-10 md:text-4xl">
						🙏 {isZh ? '赞助者' : 'Sponsors'}
					</div>
					<div ref={sponsorsListRef}>
						<div className="mb-4">GitHub</div>
						<div className="flex flex-wrap justify-center gap-4">
							{thinkGithub.map((item) => (
								<a key={item.name} href={`https://github.com/${item.name}`} target="_blank" rel="noreferrer">
									<img className="h-16 w-16 overflow-hidden rounded-full" src={`https://avatars.githubusercontent.com/${item.name}`} title={(isZh ? '感谢 ' : 'Thanks ') + item.name} alt="" />
								</a>
							))}
						</div>
					</div>
				</div>
			</div>
			<div>
				<div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-10 px-6 py-10 md:grid-cols-4 md:px-20">
					{bottomInfo.map((item) => (
						<div key={item.title}>
							<div className="mb-2 text-lg font-bold">{isZh ? item.title : item.title_en}</div>
							<div className="flex flex-col gap-2">
								{item.list.map((link) => (
									<a key={link.title} href={link.link} target={link._blank ? '_blank' : '_self'} title={link.link} className="text-sm hover:underline">
										{isZh ? link.title : link.title_en}
									</a>
								))}
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="py-4 text-center text-xs">
				<div className="flex justify-center gap-1">
					<div>
						<span title="React · Tailwind · DuFu">RTDF</span> DESIGN • MADE BY DUFU
					</div>
					<div>
						{isZh ? (
							<>
								• <a href="https://beian.miit.gov.cn" target="_blank" rel="noreferrer">
									滇 ICP 备 17004037 号 - 4
								</a>
							</>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
