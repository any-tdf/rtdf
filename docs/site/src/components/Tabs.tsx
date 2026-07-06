import { useState } from 'react';
import { encodeData, rendererLine } from 'beautify-qrcode';
import { useAppContext } from '../store/appStore';

type TabsProps = {
	currentTab: number;
	onChange: (index: number) => void;
};

const tabList = [
	{ zh: '示例', en: 'Demo' },
	{ zh: 'API', en: 'API' },
	{ zh: '指南', en: 'Guide' },
	{ zh: 'FAQ', en: 'FAQ' },
	{ zh: '版本', en: 'Version' }
];

const sliderLeftMap: Record<number, string> = {
	0: 'left-1',
	1: 'left-17 md:left-21',
	2: 'left-33 md:left-41',
	3: 'left-49 md:left-61',
	4: 'left-65 md:left-81'
};

const sourceExtMap: Record<string, 'ts' | 'tsx'> = {
	calendar: 'ts',
	feedback: 'ts',
	grids: 'ts',
	numKeyboard: 'ts',
	placeholder: 'ts',
	skeleton: 'ts',
	timePicker: 'ts'
};

const Tabs = ({ currentTab, onChange }: TabsProps) => {
	const { lang, isWideScreen, setIsWideScreen, themeMode, sysTheme } = useAppContext();
	const isZh = lang === 'zh_CN';
	const currentNav = new URLSearchParams(window.location.search).get('nav') || 'button';
	const demoBaseUrl = import.meta.env.DEV ? `${window.location.protocol}//${window.location.hostname}:8887/` : 'https://demo.rtdf.dev/';
	const qrValue = `${demoBaseUrl}${currentNav}/${isZh ? 'zh_CN' : 'en_US'}`;
	const sourceExt = sourceExtMap[currentNav] || 'tsx';
	const sourceValue = `https://github.com/any-tdf/rtdf/blob/main/packages/rtdf/src/lib/components/${currentNav}/index.${sourceExt}`;
	const stackblitzValue = `https://stackblitz.com/github/any-tdf/demo-rtdf?file=src%2Fpages%2F${currentNav}%2F${
		isZh ? 'zh_CN' : 'en_US'
	}.tsx&startScript=${currentNav}${isZh ? '' : '_en'}`;
	const resolvedMode = themeMode === 'auto' ? sysTheme : themeMode;
	const [showQr, setShowQr] = useState(false);
	const [qrSvg, setQrSvg] = useState('');
	const [showCode, setShowCode] = useState(false);
	const [showStackblitz, setShowStackblitz] = useState(false);
	const [showFull, setShowFull] = useState(false);

	const handleQrEnter = () => {
		const qrcode = encodeData({
			text: qrValue,
			isSpace: false
		});
		const color = resolvedMode === 'dark' ? 'var(--color-dark)' : 'var(--color-primary)';
		setQrSvg(rendererLine(qrcode, { posType: 2, otherColor: color, posColor: color }));
		setShowQr(true);
	};

	const changeFullFunc = () => {
		if (isWideScreen) {
			setIsWideScreen(false);
			localStorage.setItem('isFull', 'notFull');
		} else {
			setIsWideScreen(true);
			localStorage.setItem('isFull', 'full');
		}
	};

	return (
		<div className="relative top-14 w-82 md:w-102">
			<div className="relative rounded-sm bg-black/5 p-1 dark:bg-white/5">
				<div
					className={`bg-bg-highlight dark:bg-bg-highlight-dark absolute top-1 h-10 w-16 rounded-sm transition-all duration-300 md:w-20 ${sliderLeftMap[currentTab] || 'left-1'}`}
				></div>
				{/* 二维码 */}
				<a href={qrValue} target="_blank" rel="noreferrer">
					<button
						onMouseLeave={() => setShowQr(false)}
						onMouseEnter={handleQrEnter}
						className="absolute top-0 left-106 hidden h-12 w-12 rounded-sm bg-black/5 p-3 md:block dark:bg-white/5"
						type="button"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" style={{ fill: 'currentColor' }}>
							<path fill="none" d="M0 0h24v24H0z" />
							<path d="M16 17v-1h-3v-3h3v2h2v2h-1v2h-2v2h-2v-3h2v-1h1zm5 4h-4v-2h2v-2h2v4zM3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zM6 6h2v2H6V6zm0 10h2v2H6v-2zM16 6h2v2h-2V6z" />
						</svg>
						{showQr ? (
							<div
								className="absolute top-14 left-0 z-50 hidden w-60 rounded-sm bg-black p-6 shadow-lg dark:block"
								dangerouslySetInnerHTML={{ __html: qrSvg }}
							></div>
						) : null}
						{showQr ? (
							<div
								className="absolute top-14 left-0 z-50 block w-60 rounded-sm bg-white p-6 shadow-lg dark:hidden"
								dangerouslySetInnerHTML={{ __html: qrSvg }}
							></div>
						) : null}
					</button>
				</a>
				{/* 组件源码 */}
				<a href={sourceValue} target="_blank" rel="noreferrer">
					<button
						onMouseLeave={() => setShowCode(false)}
						onMouseEnter={() => setShowCode(true)}
						className="absolute top-0 left-122 hidden h-12 w-12 rounded-sm bg-black/5 p-3 md:block dark:bg-white/5"
						type="button"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" style={{ fill: 'currentColor' }}>
							<path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM4 5V19H20V5H4ZM20 12L16.4645 15.5355L15.0503 14.1213L17.1716 12L15.0503 9.87868L16.4645 8.46447L20 12ZM6.82843 12L8.94975 14.1213L7.53553 15.5355L4 12L7.53553 8.46447L8.94975 9.87868L6.82843 12ZM11.2443 17H9.11597L12.7557 7H14.884L11.2443 17Z" />
						</svg>
						{showCode ? (
							<div
								className={`${isZh ? 'w-28' : 'w-52'} absolute top-14 left-0 z-50 h-12 rounded-sm bg-gray-700 py-3 text-center leading-6 text-white shadow-lg`}
							>
								{isZh ? '组件源码' : 'Component source code'}
							</div>
						) : null}
					</button>
				</a>
				{/* StackBlitz */}
				<a href={stackblitzValue} target="_blank" rel="noreferrer">
					<button
						onMouseLeave={() => setShowStackblitz(false)}
						onMouseEnter={() => setShowStackblitz(true)}
						className="absolute top-0 left-138 hidden h-12 w-12 rounded-sm bg-black/5 p-3 md:block dark:bg-white/5"
						type="button"
					>
						<svg viewBox="0 0 28 28" height="24">
							<path fill="#3275e7" d="M12.747 16.273h-7.46L18.925 1.5l-3.671 10.227h7.46L9.075 26.5l3.671-10.227z" />
						</svg>
						{showStackblitz ? (
							<div className="absolute top-14 left-0 z-50 h-12 w-44 rounded-sm bg-gray-700 py-3 text-center leading-6 text-white shadow-lg">
								{isZh ? '在 StackBlitz 中打开' : 'Open in StackBlitz'}
							</div>
						) : null}
					</button>
				</a>
				{/* 宽屏切换 */}
				<button
					onClick={changeFullFunc}
					onMouseLeave={() => setShowFull(false)}
					onMouseEnter={() => setShowFull(true)}
					onFocus={() => setShowFull(true)}
					onBlur={() => setShowFull(false)}
					className="absolute top-0 left-154 hidden h-12 w-12 cursor-pointer rounded-sm bg-black/5 p-3 md:block dark:bg-white/5"
					type="button"
				>
					{isWideScreen ? (
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path
								d="M20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20ZM11 5H5V19H11V15H13V19H19V5H13V9H11V5ZM15 9L18 12L15 15V13H9V15L6 12L9 9V11H15V9Z"
								fill="currentColor"
							/>
						</svg>
					) : (
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path
								d="M20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20ZM11 5H5V10.999H7V9L10 12L7 15V13H5V19H11V17H13V19H19V13H17V15L14 12L17 9V10.999H19V5H13V7H11V5ZM13 13V15H11V13H13ZM13 9V11H11V9H13Z"
								fill="currentColor"
							/>
						</svg>
					)}
					{showFull ? (
						<div
							className={`${isZh ? 'w-20' : 'w-32'} absolute top-14 left-0 z-50 h-12 rounded-sm bg-gray-700 py-3 text-center leading-6 text-white shadow-lg`}
						>
							{isZh ? '宽屏' : 'Full screen'}
						</div>
					) : null}
				</button>
				<div className="relative flex">
					{tabList.map((tab, index) => (
						<button
							key={tab.en}
							className="w-16 cursor-pointer rounded-sm py-2 text-center md:w-20"
							onClick={() => onChange(index)}
							type="button"
						>
							{isZh ? tab.zh : tab.en}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default Tabs;
