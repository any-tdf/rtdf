import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFadeInUp } from '../../hooks/animations';
import { useAppContext } from '../../store/appStore';
import codeGroupSvgData from '../../utils/code-group-svg-data';

type PackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn';

const packageManagers: PackageManager[] = ['bun', 'npm', 'pnpm', 'yarn'];

const TerminalDemo = () => {
	const { lang } = useAppContext();
	const isZh = lang === 'zh_CN';
	const containerRef = useFadeInUp<HTMLDivElement>({ delay: 200, duration: 800, distance: 30 });
	const sectionRef = useRef<HTMLElement | null>(null);
	const typingTimer = useRef<number | null>(null);
	const cursorTimer = useRef<number | null>(null);
	const stepTimer = useRef<number | null>(null);
	const copiedTimer = useRef<number | null>(null);
	const hasStarted = useRef(false);
	const currentStepRef = useRef(0);

	const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

	const getManagerIcon = useCallback((pm: PackageManager) => {
		const item = codeGroupSvgData.find((d) => d.name === pm);
		return item?.svg || '';
	}, []);

	const getCommands = useCallback(
		(pm: PackageManager) => {
			const createCmd = {
				bun: 'bun create rtdf@latest',
				npm: 'npm create rtdf@latest',
				pnpm: 'pnpm create rtdf@latest',
				yarn: 'yarn create rtdf@latest'
			};
			const installCmd = {
				bun: 'bun i',
				npm: 'npm i',
				pnpm: 'pnpm i',
				yarn: 'yarn'
			};
			const devCmd = {
				bun: 'bun dev',
				npm: 'npm run dev',
				pnpm: 'pnpm dev',
				yarn: 'yarn dev'
			};

			const devOutput = `  VITE v6.0.0  ready in 320 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose`;

			return [
				{ cmd: createCmd[pm], output: isZh ? '正在创建 RTDF 项目……' : 'Creating RTDF project...', delay: 800 },
				{ cmd: 'cd my-rtdf', output: '', delay: 200 },
				{ cmd: installCmd[pm], output: isZh ? '安装依赖中……' : 'Installing dependencies...', delay: 1000 },
				{ cmd: devCmd[pm], output: devOutput, delay: 600, isDevOutput: true }
			];
		},
		[isZh]
	);

	const highlightCommand = useCallback((cmd: string) => {
		const keywords = ['bun', 'npm', 'pnpm', 'yarn', 'cd', 'create', 'install', 'i', 'run', 'dev'];
		const parts = cmd.split(' ');

		return parts
			.map((part, index) => {
				if (index === 0 || keywords.includes(part)) {
					return `<span class="text-primary dark:text-dark">${part}</span>`;
				}
				if (part.startsWith('rtdf@') || part === 'rtdf') {
					return `<span class="text-cyan-600 dark:text-cyan-400">${part}</span>`;
				}
				if (part.startsWith('my-')) {
					return `<span class="text-amber-600 dark:text-amber-400">${part}</span>`;
				}
				return `<span class="text-gray-700 dark:text-gray-300">${part}</span>`;
			})
			.join(' ');
	}, []);

	const [activeManager, setActiveManager] = useState<PackageManager>('bun');
	const [currentStep, setCurrentStep] = useState(0);
	const [currentText, setCurrentText] = useState('');
	const [showOutput, setShowOutput] = useState(false);
	const [showCursor, setShowCursor] = useState(true);
	const [completedCommands, setCompletedCommands] = useState<{ cmd: string; output: string; isDevOutput?: boolean }[]>([]);
	const [isAnimating, setIsAnimating] = useState(true);
	const [copied, setCopied] = useState(false);

	const commands = useMemo(() => getCommands(activeManager), [activeManager, getCommands]);

	const typeCommand = useCallback((text: string, callback: () => void) => {
		let index = 0;
		setCurrentText('');
		setShowOutput(false);

		if (typingTimer.current) {
			window.clearInterval(typingTimer.current);
		}

		typingTimer.current = window.setInterval(() => {
			if (index < text.length) {
				setCurrentText(text.slice(0, index + 1));
				index += 1;
			} else {
				if (typingTimer.current) {
					window.clearInterval(typingTimer.current);
				}
				callback();
			}
		}, 80);
	}, []);

	const nextStep = useCallback(
		(manager = activeManager) => {
			const cmds = getCommands(manager);
			if (currentStepRef.current >= cmds.length) {
				setIsAnimating(false);
				return;
			}

			const command = cmds[currentStepRef.current];
			typeCommand(command.cmd, () => {
				setShowOutput(true);
				stepTimer.current = window.setTimeout(() => {
					setCompletedCommands((prev) => [...prev, { cmd: command.cmd, output: command.output, isDevOutput: command.isDevOutput }]);
					currentStepRef.current += 1;
					setCurrentStep(currentStepRef.current);
					setCurrentText('');
					setShowOutput(false);
					nextStep(manager);
				}, command.delay);
			});
		},
		[activeManager, getCommands, typeCommand]
	);

	const startAnimation = useCallback(
		(manager = activeManager) => {
			setIsAnimating(true);
			nextStep(manager);
		},
		[activeManager, nextStep]
	);

	const resetAnimation = useCallback(
		(manager = activeManager) => {
			if (typingTimer.current) window.clearInterval(typingTimer.current);
			if (stepTimer.current) window.clearTimeout(stepTimer.current);
			setCompletedCommands([]);
			currentStepRef.current = 0;
			setCurrentStep(0);
			setCurrentText('');
			setShowOutput(false);
			startAnimation(manager);
		},
		[activeManager, startAnimation]
	);

	const switchManager = (pm: PackageManager) => {
		if (pm === activeManager) return;
		setActiveManager(pm);
	};

	const copyFirstCommand = () => {
		const firstCmd = getCommands(activeManager)[0].cmd;
		navigator.clipboard.writeText(firstCmd).then(() => {
			setCopied(true);
			if (copiedTimer.current) {
				window.clearTimeout(copiedTimer.current);
			}
			copiedTimer.current = window.setTimeout(() => {
				setCopied(false);
			}, 2000);
		});
	};

	useEffect(() => {
		cursorTimer.current = window.setInterval(() => {
			setShowCursor((prev) => !prev);
		}, 530);

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !hasStarted.current) {
					hasStarted.current = true;
					startAnimation();
				}
			},
			{ threshold: 0.3 }
		);

		if (sectionRef.current) observer.observe(sectionRef.current);

		const handleVisibility = () => {
			if (document.visibilityState === 'hidden') {
				if (typingTimer.current) window.clearInterval(typingTimer.current);
				if (stepTimer.current) window.clearTimeout(stepTimer.current);
			}
		};

		window.addEventListener('visibilitychange', handleVisibility);

		return () => {
			observer.disconnect();
			window.removeEventListener('visibilitychange', handleVisibility);
			if (typingTimer.current) window.clearInterval(typingTimer.current);
			if (cursorTimer.current) window.clearInterval(cursorTimer.current);
			if (stepTimer.current) window.clearTimeout(stepTimer.current);
			if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
		};
	}, [startAnimation]);

	useEffect(() => {
		if (!hasStarted.current) return;
		resetAnimation(activeManager);
	}, [activeManager, isZh, resetAnimation]);

	return (
		<section id="terminal-demo" ref={sectionRef} className="relative overflow-hidden py-8">
			<div className="relative z-10 mx-auto">
				<div className="mb-12 text-center">
					<div className="border-primary/20 bg-primary/5 text-primary dark:border-dark/20 dark:bg-dark/5 dark:text-dark mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm">
						<svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
							<path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM4 5V19H20V5H4ZM6 7H8V9H6V7ZM10 7H18V9H10V7ZM6 11H8V13H6V11ZM10 11H18V13H10V11Z" />
						</svg>
						<span>{isZh ? '快速开始' : 'Quick Start'}</span>
					</div>

					<h2 className="mb-4 bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-3xl font-bold text-transparent md:text-4xl dark:from-white dark:via-gray-300 dark:to-white">
						{isZh ? '一个命令，即刻启程' : 'One Command to Start'}
					</h2>
					<p className="mx-auto max-w-2xl text-base opacity-70">
						{isZh ? '一键创建项目，快速开始开发。' : 'Create project with one command and start developing quickly.'}
					</p>
				</div>

				<div ref={containerRef} className="mx-auto w-full max-w-xl">
					<div className="bg-bg-overlay dark:bg-bg-overlay-dark flex h-95 flex-col overflow-hidden rounded-xl border border-gray-200/30 shadow-xl backdrop-blur-md dark:border-gray-700/20">
						<div className="bg-bg-surface dark:bg-bg-surface-dark flex items-center justify-between border-b border-gray-200/30 px-4 py-3 dark:border-gray-700/20">
							{isMac ? (
								<>
									<div className="flex gap-2">
										<div className="size-3 rounded-full bg-red-400/80"></div>
										<div className="size-3 rounded-full bg-yellow-400/80"></div>
										<div className="size-3 rounded-full bg-green-400/80"></div>
									</div>
									<button
										onClick={() => resetAnimation()}
										className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
											!isAnimating && currentStep >= commands.length
												? 'text-gray-500 hover:bg-gray-200/60 hover:text-gray-700 dark:hover:bg-gray-700/60 dark:hover:text-gray-300'
												: 'pointer-events-none invisible'
										}`}
										type="button"
									>
										<svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
											<path d="M5.46257 4.43262C7.21556 2.91688 9.5007 2 12 2C17.5228 2 22 6.47715 22 12C22 14.1361 21.3302 16.1158 20.1892 17.7406L17 12H20C20 7.58172 16.4183 4 12 4C9.84982 4 7.89777 4.84827 6.46023 6.22842L5.46257 4.43262ZM18.5374 19.5674C16.7844 21.0831 14.4993 22 12 22C6.47715 22 2 17.5228 2 12C2 9.86386 2.66979 7.88416 3.8108 6.25944L7 12H4C4 16.4183 7.58172 20 12 20C14.1502 20 16.1022 19.1517 17.5398 17.7716L18.5374 19.5674Z" />
										</svg>
										{isZh ? '重播' : 'Replay'}
									</button>
								</>
							) : (
								<>
									<button
										onClick={() => resetAnimation()}
										className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
											!isAnimating && currentStep >= commands.length
												? 'text-gray-500 hover:bg-gray-200/60 hover:text-gray-700 dark:hover:bg-gray-700/60 dark:hover:text-gray-300'
												: 'pointer-events-none invisible'
										}`}
										type="button"
									>
										<svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
											<path d="M5.46257 4.43262C7.21556 2.91688 9.5007 2 12 2C17.5228 2 22 6.47715 22 12C22 14.1361 21.3302 16.1158 20.1892 17.7406L17 12H20C20 7.58172 16.4183 4 12 4C9.84982 4 7.89777 4.84827 6.46023 6.22842L5.46257 4.43262ZM18.5374 19.5674C16.7844 21.0831 14.4993 22 12 22C6.47715 22 2 17.5228 2 12C2 9.86386 2.66979 7.88416 3.8108 6.25944L7 12H4C4 16.4183 7.58172 20 12 20C14.1502 20 16.1022 19.1517 17.5398 17.7716L18.5374 19.5674Z" />
										</svg>
										{isZh ? '重播' : 'Replay'}
									</button>
									<div className="flex gap-1.5">
										<div className="flex size-4 items-center justify-center rounded-sm hover:bg-gray-300/60 dark:hover:bg-gray-600/60">
											<svg className="size-2.5 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
												<path d="M6 19H18V21H6V19Z" />
											</svg>
										</div>
										<div className="flex size-4 items-center justify-center rounded-sm hover:bg-gray-300/60 dark:hover:bg-gray-600/60">
											<svg className="size-2.5 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
												<path d="M4 3H20V21H4V3ZM6 5V19H18V5H6Z" />
											</svg>
										</div>
										<div className="flex size-4 items-center justify-center rounded-sm hover:bg-red-500/80">
											<svg className="size-2.5 text-gray-600 hover:text-white dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
												<path d="M12 10.5858L6.34315 4.92893L4.92893 6.34315L10.5858 12L4.92893 17.6569L6.34315 19.0711L12 13.4142L17.6569 19.0711L19.0711 17.6569L13.4142 12L19.0711 6.34315L17.6569 4.92893L12 10.5858Z" />
											</svg>
										</div>
									</div>
								</>
							)}
						</div>

						<div className="bg-bg-surface dark:bg-bg-surface-dark flex border-b border-gray-200/30 dark:border-gray-700/20">
							{packageManagers.map((pm) => (
								<button
									key={pm}
									onClick={() => switchManager(pm)}
									className={`relative flex items-center gap-1.5 px-4 py-2 text-sm transition-colors ${
										activeManager === pm ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
									}`}
									type="button"
								>
									<span className="size-4" dangerouslySetInnerHTML={{ __html: getManagerIcon(pm) }}></span>
									{pm}
									{activeManager === pm ? <div className="bg-primary dark:bg-dark absolute right-0 bottom-0 left-0 h-0.5"></div> : null}
								</button>
							))}
						</div>

						<div className="bg-bg-base dark:bg-bg-base-dark flex-1 overflow-hidden p-4 font-mono text-sm leading-relaxed">
							{completedCommands.map((item, index) => (
								<div key={`${item.cmd}-${index}`} className="mb-4">
									<div className="flex items-center gap-2">
										<span className="text-green-600 dark:text-green-400">$</span>
										<span dangerouslySetInnerHTML={{ __html: highlightCommand(item.cmd) }}></span>
										{index === 0 ? (
											<button
												onClick={copyFirstCommand}
												className="ml-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
												title={isZh ? '复制命令' : 'Copy command'}
												type="button"
											>
												{copied ? (
													<svg className="size-3.5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
														<path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z" />
													</svg>
												) : (
													<svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
														<path d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V21C16.9998 21.5523 16.5521 22 15.9998 22H3.9998C3.44752 22 2.9998 21.5523 2.9998 21V7C2.9998 6.44772 3.44752 6 3.9998 6H6.9998ZM8.9998 6H15.9998C16.5521 6 16.9998 6.44772 16.9998 7V16H18.9998V4H8.9998V6ZM4.9998 8V20H14.9998V8H4.9998Z" />
													</svg>
												)}
											</button>
										) : null}
									</div>
									{item.output ? (
										item.isDevOutput ? (
											<div className="ml-4 text-xs whitespace-pre">
												<span className="text-green-500">➜</span>
												<span className="text-gray-500"> Local: </span>
												<span className="text-cyan-500">http://localhost:5173/</span>
												<br />
												<span className="text-gray-600 dark:text-gray-400">➜ Network: use --host to expose</span>
											</div>
										) : (
											<div className="ml-4 text-gray-500 dark:text-gray-500">{item.output}</div>
										)
									) : null}
								</div>
							))}
							{currentStep < commands.length ? (
								<>
									<div className="flex items-center gap-2">
										<span className="text-green-600 dark:text-green-400">$</span>
										<span dangerouslySetInnerHTML={{ __html: highlightCommand(currentText) }}></span>
										<span className={`inline-block h-4 w-2 ${showCursor ? 'bg-gray-800 dark:bg-gray-100' : 'bg-transparent'}`}></span>
									</div>
									{showOutput && commands[currentStep]?.output ? (
										commands[currentStep]?.isDevOutput ? (
											<div className="ml-4 text-xs whitespace-pre">
												<span className="text-green-500">➜</span>
												<span className="text-gray-500"> Local: </span>
												<span className="text-cyan-500">http://localhost:5173/</span>
												<br />
												<span className="text-gray-600 dark:text-gray-400">➜ Network: use --host to expose</span>
											</div>
										) : (
											<div className="ml-4 text-gray-500 dark:text-gray-500">{commands[currentStep].output}</div>
										)
									) : null}
								</>
							) : (
								<div className="flex items-center gap-2">
									<span className="text-green-600 dark:text-green-400">✓</span>
									<span className="text-green-600 dark:text-green-400">
										{isZh ? '项目已就绪！访问' : 'Project is ready! Visit'} <span className="text-cyan-500">http://localhost:5173</span>
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default TerminalDemo;
