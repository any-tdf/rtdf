import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

type CDPResponse = {
	id?: number;
	result?: unknown;
	error?: { message: string };
	method?: string;
	params?: unknown;
};

type Scenario = {
	name: string;
	path: string;
	steps: Array<() => Promise<void>>;
};

const baseUrl = process.env.RTDF_SITE_VERIFY_BASE_URL || 'http://127.0.0.1:4173';
const chromePath =
	process.env.CHROME_PATH ||
	[
		'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
		'/Applications/Chromium.app/Contents/MacOS/Chromium',
		'/usr/bin/google-chrome',
		'/usr/bin/chromium',
		'/usr/bin/chromium-browser'
	].find((path) => existsSync(path));
const debugPort = Number(process.env.RTDF_SITE_BROWSER_DEBUG_PORT || 9230);
const userDataDir = mkdtempSync(join(tmpdir(), 'rtdf-site-browser-'));

if (!chromePath) {
	console.error('Chrome or Chromium executable was not found. Set CHROME_PATH to run browser verification.');
	process.exit(1);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const chrome = Bun.spawn(
	[
		chromePath,
		'--headless=new',
		'--disable-gpu',
		'--no-first-run',
		'--no-default-browser-check',
		'--disable-dev-shm-usage',
		'--window-size=1440,1000',
		`--remote-debugging-port=${debugPort}`,
		`--user-data-dir=${userDataDir}`,
		'about:blank'
	],
	{
		stdout: 'ignore',
		stderr: 'ignore'
	}
);

const cleanup = () => {
	chrome.kill();
	rmSync(userDataDir, { recursive: true, force: true });
};

process.on('exit', cleanup);
process.on('SIGINT', () => {
	cleanup();
	process.exit(130);
});

const waitForJson = async <T>(url: string) => {
	let lastError = '';
	for (let i = 0; i < 80; i += 1) {
		const response = await fetch(url).catch((error: Error) => {
			lastError = error.message;
			return undefined;
		});
		if (response?.ok) return response.json() as Promise<T>;
		await sleep(100);
	}
	throw new Error(`Unable to connect to Chrome DevTools: ${lastError}`);
};

class CDPClient {
	private id = 0;
	private pending = new Map<number, { resolve: (value: unknown) => void; reject: (error: Error) => void }>();
	private handlers = new Map<string, Array<(params: unknown) => void>>();
	private socket: WebSocket;

	private constructor(socket: WebSocket) {
		this.socket = socket;
		this.socket.onmessage = (event) => {
			const message = JSON.parse(String(event.data)) as CDPResponse;
			if (!message.id) {
				if (message.method) {
					this.handlers.get(message.method)?.forEach((handler) => handler(message.params));
				}
				return;
			}
			const pending = this.pending.get(message.id);
			if (!pending) return;
			this.pending.delete(message.id);
			if (message.error) {
				pending.reject(new Error(message.error.message));
				return;
			}
			pending.resolve(message.result);
		};
	}

	static create = async (webSocketDebuggerUrl: string) => {
		const socket = new WebSocket(webSocketDebuggerUrl);
		await new Promise<void>((resolve, reject) => {
			socket.onopen = () => resolve();
			socket.onerror = () => reject(new Error('Unable to open DevTools websocket'));
		});
		return new CDPClient(socket);
	};

	call = <T = unknown>(method: string, params: Record<string, unknown> = {}) => {
		const id = (this.id += 1);
		this.socket.send(JSON.stringify({ id, method, params }));
		return new Promise<T>((resolve, reject) => {
			this.pending.set(id, { resolve: resolve as (value: unknown) => void, reject });
		});
	};

	evaluate = async <T>(expression: string) => {
		const result = await this.call<{ result: { value: T }; exceptionDetails?: unknown }>('Runtime.evaluate', {
			expression,
			awaitPromise: true,
			returnByValue: true
		});
		if (result.exceptionDetails) throw new Error(`Browser evaluation failed: ${JSON.stringify(result.exceptionDetails)}`);
		return result.result.value;
	};

	on = (method: string, handler: (params: unknown) => void) => {
		const handlers = this.handlers.get(method) || [];
		handlers.push(handler);
		this.handlers.set(method, handlers);
	};

	close = () => this.socket.close();
}

await waitForJson<{ webSocketDebuggerUrl: string }>(`http://127.0.0.1:${debugPort}/json/version`);
const targetResponse = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: 'PUT' });
if (!targetResponse.ok) throw new Error(`Unable to create Chrome page target: ${targetResponse.status}`);
const target = (await targetResponse.json()) as { webSocketDebuggerUrl: string };
const page = await CDPClient.create(target.webSocketDebuggerUrl);
await page.call('Runtime.enable');
await page.call('Page.enable');

const browserErrors: string[] = [];
const baselineBrowserErrorMessages = ['width 或 height 小于 20 会使移动端点击困难！'];
page.on('Runtime.exceptionThrown', (params) => {
	browserErrors.push(JSON.stringify(params));
});
page.on('Runtime.consoleAPICalled', (params) => {
	const event = params as { type?: string; args?: Array<{ value?: unknown; description?: string }> };
	if (event.type !== 'error') return;
	browserErrors.push(event.args?.map((arg) => String(arg.value ?? arg.description ?? '')).join(' ') || 'console.error');
});

const runInPage = <T>(body: string) => {
	return page.evaluate<T>(`(async () => {
		${body}
	})()`);
};

const waitFor = async (predicate: () => Promise<boolean>, label: string, timeout = 8000) => {
	const started = Date.now();
	while (Date.now() - started < timeout) {
		if (await predicate()) return;
		await sleep(100);
	}
	throw new Error(`Timed out waiting for ${label}`);
};

const goto = async (path: string) => {
	browserErrors.length = 0;
	const url = new URL(path, baseUrl);
	if (!url.searchParams.has('lang')) url.searchParams.set('lang', 'zh_CN');
	await page.call('Page.navigate', { url: url.toString() });
	await waitFor(
		() => runInPage<boolean>(`return document.readyState === 'complete' && document.body.innerText.length > 0;`),
		`load ${path}`
	);
	await sleep(200);
};

const bodyIncludes = (text: string) => {
	return runInPage<boolean>(`return document.body.innerText.includes(${JSON.stringify(text)});`);
};

const assertBodyIncludes = async (text: string) => {
	const ok = await bodyIncludes(text);
	if (!ok) throw new Error(`Expected page body to include: ${text}`);
};

const assertBodyExcludes = async (text: string) => {
	const ok = await bodyIncludes(text);
	if (ok) throw new Error(`Expected page body not to include: ${text}`);
};

const assertSelector = async (selector: string, label: string) => {
	const ok = await runInPage<boolean>(`
		const element = document.querySelector(${JSON.stringify(selector)});
		if (!element) return false;
		const rect = element.getBoundingClientRect();
		return rect.width > 0 && rect.height > 0;
	`);
	if (!ok) throw new Error(`Expected visible selector: ${label}`);
};

const assertToolbarIcon = async (label: string, symbolIds: string[], size: number) => {
	const result = await runInPage<{ found: boolean; href: string; width: number; height: number }>(`
		const label = ${JSON.stringify(label)};
		const visible = (el) => {
			const rect = el.getBoundingClientRect();
			const style = getComputedStyle(el);
			return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
		};
		const normalize = (value) => (value || '').replace(/\\s+/g, ' ').trim();
		const target = [...document.querySelectorAll('button')]
			.filter(visible)
			.find((el) => normalize(\`\${el.textContent || ''} \${el.getAttribute('aria-label') || ''}\`).includes(label));
		const svg = target?.querySelector('svg');
		const use = svg?.querySelector('use');
		const rect = svg?.getBoundingClientRect();
		const href = use?.getAttribute('href') || use?.getAttribute('xlink:href') || use?.href?.baseVal || '';
		return {
			found: Boolean(target && svg && use && rect && rect.width > 0 && rect.height > 0),
			href,
			width: Math.round(rect?.width || 0),
			height: Math.round(rect?.height || 0)
		};
	`);
	const hasExpectedSymbol = symbolIds.some((symbolId) => result.href.endsWith(`#${symbolId}`));
	if (!result.found || !hasExpectedSymbol || result.width !== size || result.height !== size) {
		throw new Error(
			`Unexpected toolbar icon for ${label}: ${JSON.stringify({ ...result, expectedSymbols: symbolIds, expectedSize: size })}`
		);
	}
};

const assertGeneratorPaletteMetrics = async () => {
	const result = await runInPage<{
		paletteHeight: number;
		expectedPaletteHeight: number;
		expectedCodeHeight: number;
		codeHeights: number[];
		copyButtonCount: number;
		copySvgCount: number;
		hasRequiredLabels: boolean;
		highlightedCodeCount: number;
		highlightSpanCount: number;
	}>(`
		const palette = [...document.querySelectorAll('main > div[style*="height"]')]
			.find((element) => element.textContent?.includes('@plugin "rtdf/theme"'));
		const paletteRect = palette?.getBoundingClientRect();
		const codeBlocks = [...(palette?.querySelectorAll('article.prose') || [])]
			.map((article) => article.parentElement)
			.filter(Boolean);
		const text = palette?.textContent || '';
		return {
			paletteHeight: Math.round(paletteRect?.height || 0),
			expectedPaletteHeight: window.innerHeight - 114,
			expectedCodeHeight: window.innerWidth >= 1280 ? window.innerHeight - 334 : (window.innerHeight - 334) / 2,
			codeHeights: codeBlocks.map((block) => Math.round(block.getBoundingClientRect().height)),
			copyButtonCount: palette?.querySelectorAll('button[aria-label="copy"]').length || 0,
			copySvgCount: palette?.querySelectorAll('button[aria-label="copy"] svg').length || 0,
			hasRequiredLabels: ['Light BG', 'Dark BG', 'Text', 'base', 'surface', 'overlay', 'highlight', 'light', 'dark', 'onPri-L', 'onDark']
				.every((label) => text.includes(label)),
			highlightedCodeCount: palette?.querySelectorAll('code.hljs.language-css').length || 0,
			highlightSpanCount: palette?.querySelectorAll('code.hljs.language-css span').length || 0
		};
	`);
	const heightMatches = Math.abs(result.paletteHeight - result.expectedPaletteHeight) <= 1;
	const codeHeightsMatch =
		result.codeHeights.length === 2 && result.codeHeights.every((height) => Math.abs(height - result.expectedCodeHeight) <= 1);
	if (
		!heightMatches ||
		!codeHeightsMatch ||
		result.copyButtonCount !== 2 ||
		result.copySvgCount !== 2 ||
		!result.hasRequiredLabels ||
		result.highlightedCodeCount !== 2 ||
		result.highlightSpanCount < 10
	) {
		throw new Error(`Unexpected generator palette metrics: ${JSON.stringify(result)}`);
	}
};

const assertGeneratorColorPickerSpacing = async () => {
	const result = await runInPage<{
		found: boolean;
		normalGaps: number[];
		textGaps: number[];
		normalButtonClasses: string[];
		textButtonClasses: string[];
	}>(`
		const visible = (element) => {
			const rect = element.getBoundingClientRect();
			const style = getComputedStyle(element);
			return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
		};
		const panel = [...document.querySelectorAll('aside, main div, body > div div')]
			.filter((element) => {
				const rect = element.getBoundingClientRect();
				const text = element.textContent || '';
				return visible(element) && rect.width > 150 && rect.width < 260 && rect.left < 260 && text.includes('primary') && (text.includes('Extended colors') || text.includes('扩展色'));
			})
			.sort((a, b) => {
				const aRect = a.getBoundingClientRect();
				const bRect = b.getBoundingClientRect();
				return Math.abs(aRect.width - 208) - Math.abs(bRect.width - 208);
			})[0];
		const items = [...(panel?.querySelectorAll('div.flex.flex-1.flex-col.items-center') || [])]
			.map((root) => {
				const button = root.querySelector('button');
				const span = [...root.children].find((child) => child.tagName === 'SPAN');
				if (!button || !span || !visible(button) || !visible(span)) return null;
				const buttonRect = button.getBoundingClientRect();
				const spanRect = span.getBoundingClientRect();
				return {
					gap: Math.round((spanRect.top - buttonRect.bottom) * 100) / 100,
					buttonClass: button.className || ''
				};
			})
			.filter(Boolean)
			.slice(0, 18);
		const normalItems = [...items.slice(0, 10), ...items.slice(14, 18)];
		const textItems = items.slice(10, 14);
		return {
			found: Boolean(panel) && items.length >= 18,
			normalGaps: normalItems.map((item) => item.gap),
			textGaps: textItems.map((item) => item.gap),
			normalButtonClasses: normalItems.map((item) => item.buttonClass),
			textButtonClasses: textItems.map((item) => item.buttonClass)
		};
	`);
	const normalSpacingMatches = result.normalGaps.length === 14 && result.normalGaps.every((gap) => gap >= 6 && gap <= 8);
	const textSpacingMatches = result.textGaps.length === 4 && result.textGaps.every((gap) => gap >= 1 && gap <= 3);
	const normalButtonsMatch = result.normalButtonClasses.every((className) => !className.includes('items-center'));
	const textButtonsMatch = result.textButtonClasses.every((className) => className.includes('items-center'));
	if (!result.found || !normalSpacingMatches || !textSpacingMatches || !normalButtonsMatch || !textButtonsMatch) {
		throw new Error(`Unexpected generator color picker spacing: ${JSON.stringify(result)}`);
	}
};

const assertGeneratorRadiusLayout = async () => {
	const result = await runInPage<{
		found: boolean;
		groups: Array<{
			title: string;
			titleToGrid: number;
			titleToFirstTile: number;
			buttonCount: number;
			columnCount: number;
			columnGap: number;
			rowGap: number;
			metrics: Array<{
				label: string;
				buttonGap: number;
				tileHeight: number;
				tileBackground: string;
				labelGap: number;
				innerTop: number;
				innerLeft: number;
				innerWidth: number;
				innerHeight: number;
				innerBackground: string;
			}>;
		}>;
	}>(`
		const normalize = (value) => (value || '').replace(/\\s+/g, ' ').trim();
		const visible = (element) => {
			const rect = element.getBoundingClientRect();
			const style = getComputedStyle(element);
			return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
		};
		const panel = [...document.querySelectorAll('aside, main div, body > div div')]
			.filter((element) => {
				const rect = element.getBoundingClientRect();
				const text = normalize(element.textContent || '');
				return visible(element) && rect.width > 150 && rect.width < 260 && rect.left < 260 && (text.includes('Radius') || text.includes('圆角')) && (text.includes('Popup/Card') || text.includes('弹窗/卡片'));
			})
			.sort((a, b) => {
				const aRect = a.getBoundingClientRect();
				const bRect = b.getBoundingClientRect();
				return Math.abs(aRect.width - 208) - Math.abs(bRect.width - 208);
			})[0];
		const titleTexts = [
			['容器类（弹窗/卡片/单元格/骨架屏）', 'Box (Popup/Card/Cell/Skeleton)'],
			['表单类（按钮/输入框/日历/分页）', 'Form (Button/Input/Calendar/Pagination)'],
			['小型控件类（开关/进度/滑块/步进器）', 'Small (Switch/Progress/Slider/Stepper)']
		];
		const groups = titleTexts.map((titles) => {
			const title = [...(panel?.querySelectorAll('div') || [])].find((element) => titles.includes(normalize(element.textContent || '')));
			const grid = title?.nextElementSibling;
			const gridStyle = grid ? getComputedStyle(grid) : undefined;
			const buttons = [...(grid?.querySelectorAll(':scope > button') || [])];
			const titleRect = title?.getBoundingClientRect();
			const gridRect = grid?.getBoundingClientRect();
			const firstTileRect = buttons[0]?.querySelector(':scope > div')?.getBoundingClientRect();
			const metrics = buttons.map((button) => {
				const buttonStyle = getComputedStyle(button);
				const tile = button.querySelector(':scope > div');
				const inner = tile?.querySelector(':scope > div');
				const label = button.querySelector(':scope > span');
				const tileRect = tile?.getBoundingClientRect();
				const innerRect = inner?.getBoundingClientRect();
				const labelRect = label?.getBoundingClientRect();
				const tileStyle = tile ? getComputedStyle(tile) : undefined;
				const innerStyle = inner ? getComputedStyle(inner) : undefined;
				return {
					label: normalize(label?.textContent || ''),
					buttonGap: Math.round(parseFloat(buttonStyle.gap) * 100) / 100,
					tileHeight: Math.round(tileRect?.height || 0),
					tileBackground: tileStyle?.backgroundColor || '',
					labelGap: Math.round(((labelRect?.top || 0) - (tileRect?.bottom || 0)) * 100) / 100,
					innerTop: Math.round(((innerRect?.top || 0) - (tileRect?.top || 0)) * 100) / 100,
					innerLeft: Math.round(((innerRect?.left || 0) - (tileRect?.left || 0)) * 100) / 100,
					innerWidth: Math.round(innerRect?.width || 0),
					innerHeight: Math.round(innerRect?.height || 0),
					innerBackground: innerStyle?.backgroundColor || ''
				};
			});
			return {
				title: normalize(title?.textContent || ''),
				titleToGrid: Math.round(((gridRect?.top || 0) - (titleRect?.bottom || 0)) * 100) / 100,
				titleToFirstTile: Math.round(((firstTileRect?.top || 0) - (titleRect?.bottom || 0)) * 100) / 100,
				buttonCount: buttons.length,
				columnCount: gridStyle?.gridTemplateColumns.split(' ').filter(Boolean).length || 0,
				columnGap: Math.round(parseFloat(gridStyle?.columnGap || '0') * 100) / 100,
				rowGap: Math.round(parseFloat(gridStyle?.rowGap || '0') * 100) / 100,
				metrics
			};
		});
		return { found: Boolean(panel), groups };
	`);
	const expectedLabels = [
		['0', '0.25', '0.375', '0.5', '0.75', '1', '1.5', '2'],
		['0', '0.25', '0.375', '0.5', '0.75', '1', '1.5', 'full'],
		['0', '0.25', '0.375', '0.5', '0.75', '1', '1.5', 'full'],
	];
	const isBlackAlphaBackground = (value: string, alpha: string) => {
		const normalized = value.replace(/\s+/g, ' ').trim();
		return (
			normalized === `rgba(0, 0, 0, ${alpha})` ||
			normalized === `oklab(0 0 0 / ${alpha})` ||
			normalized === `color(srgb 0 0 0 / ${alpha})`
		);
	};
	const groupsMatch =
		result.groups.length === 3 &&
			result.groups.every((group, index) => {
				const labelsMatch = group.metrics.map((item) => item.label).join('|') === expectedLabels[index].join('|');
				const tileBackgrounds = new Set(group.metrics.map((item) => item.tileBackground));
				const innerBackgrounds = new Set(group.metrics.map((item) => item.innerBackground));
				const tileBackground = [...tileBackgrounds][0] || '';
				const innerBackground = [...innerBackgrounds][0] || '';
				const layoutMatches =
					group.buttonCount === 8 &&
					group.columnCount === 4 &&
					group.columnGap === 4 &&
					group.rowGap === 4 &&
					group.titleToGrid === 4 &&
					group.titleToFirstTile === 8 &&
					tileBackgrounds.size === 1 &&
					innerBackgrounds.size === 1 &&
					isBlackAlphaBackground(tileBackground, '0.05') &&
					isBlackAlphaBackground(innerBackground, '0.1');
			const titleMatches = group.title.includes('/') && !group.title.includes('、');
			const metricsMatch = group.metrics.every((item) => {
				return (
					item.buttonGap === 2 &&
					item.tileHeight === 32 &&
					item.labelGap >= 1 &&
					item.labelGap <= 3 &&
					item.innerTop === 8 &&
					item.innerLeft === -56 &&
					item.innerWidth === 96 &&
					item.innerHeight === 64
				);
			});
			return labelsMatch && layoutMatches && titleMatches && metricsMatch;
		});
	if (!result.found || !groupsMatch) {
		throw new Error(`Unexpected generator radius layout: ${JSON.stringify(result)}`);
	}
};

const assertGeneratorLineChartLayout = async () => {
	const result = await runInPage<{
		found: boolean;
		viewBox: string;
		legendFlexWrap: string;
		legendItemCount: number;
		lineCount: number;
		pathCount: number;
		circleCount: number;
		textLabels: string[];
		circlePoints: string[];
		pathDs: string[];
	}>(`
		const normalize = (value) => (value || '').replace(/\\s+/g, ' ').trim();
		const svg = [...document.querySelectorAll('svg[viewBox="0 0 320 160"]')].find((element) => {
			const text = normalize(element.textContent || '');
			return text.includes('600') && text.includes('10-13') && text.includes('10-16');
		});
		const legend = svg?.previousElementSibling;
		const legendStyle = legend ? getComputedStyle(legend) : undefined;
		const textLabels = [...(svg?.querySelectorAll('text') || [])].map((element) => normalize(element.textContent || ''));
		const circlePoints = [...(svg?.querySelectorAll('circle') || [])].map((element) =>
			\`\${element.getAttribute('cx')},\${element.getAttribute('cy')},\${element.getAttribute('r')}\`
		);
		const pathDs = [...(svg?.querySelectorAll('path') || [])].map((element) => element.getAttribute('d') || '');
		return {
			found: Boolean(svg && legend),
			viewBox: svg?.getAttribute('viewBox') || '',
			legendFlexWrap: legendStyle?.flexWrap || '',
			legendItemCount: legend?.children.length || 0,
			lineCount: svg?.querySelectorAll('line').length || 0,
			pathCount: svg?.querySelectorAll('path').length || 0,
			circleCount: svg?.querySelectorAll('circle').length || 0,
			textLabels,
			circlePoints,
			pathDs
		};
	`);
	const expectedLabels = ['600', '450', '300', '150', '0', '10-13', '10-14', '10-15', '10-16'];
	const expectedPoints = [
		'70,25,3',
		'147,95,3',
		'223,70,3',
		'300,55,3',
		'70,35,3',
		'147,65,3',
		'223,120,3',
		'300,20,3',
		'70,80,3',
		'147,50,3',
		'223,85,3',
		'300,40,3',
		'70,110,3',
		'147,75,3',
		'223,100,3',
		'300,85,3'
	];
	const expectedPaths = [
		'M70 25 Q108 60 147 95 T223 70 T300 55',
		'M70 35 Q108 55 147 65 T223 120 T300 20',
		'M70 80 Q108 45 147 50 T223 85 T300 40',
		'M70 110 Q108 100 147 75 T223 100 T300 85'
	];
	const labelsMatch = expectedLabels.every((label) => result.textLabels.includes(label));
	const pointsMatch = expectedPoints.every((point) => result.circlePoints.includes(point));
	const pathsMatch = expectedPaths.every((path) => result.pathDs.includes(path));
	if (
		!result.found ||
		result.viewBox !== '0 0 320 160' ||
		result.legendFlexWrap !== 'nowrap' ||
		result.legendItemCount !== 4 ||
		result.lineCount !== 5 ||
		result.pathCount !== 4 ||
		result.circleCount !== 16 ||
		!labelsMatch ||
		!pointsMatch ||
		!pathsMatch
	) {
		throw new Error(`Unexpected generator line chart layout: ${JSON.stringify(result)}`);
	}
};

const assertGeneratorNoticeBarContent = async () => {
	const result = await runInPage<{
		found: boolean;
		hasEmoji: boolean;
		hasExpectedText: boolean;
		hasWrongCharacter: boolean;
		hasMagicIcon: boolean;
		text: string;
	}>(`
		const normalize = (value) => (value || '').replace(/\\s+/g, ' ').trim();
		const block = [...document.querySelectorAll('div')]
			.filter((element) => {
				const rect = element.getBoundingClientRect();
				const text = normalize(element.textContent || '');
				return rect.width > 250 && rect.width < 520 && text.includes('NoticeBar') && text.includes('Welcome to RTDF Theme Generator');
			})
			.sort((a, b) => a.getBoundingClientRect().height - b.getBoundingClientRect().height)[0];
		const text = normalize(block?.textContent || '');
		const svgHrefs = [...(block?.querySelectorAll('use') || [])].map((element) => element.getAttribute('href') || element.getAttribute('xlink:href') || '');
		return {
			found: Boolean(block),
			hasEmoji: text.includes('🥳'),
			hasExpectedText: text.includes('Welcome to RTDF Theme Generator, customize your own theme now!'),
			hasWrongCharacter: text.includes('叭'),
			hasMagicIcon: svgHrefs.some((href) => href.includes('ri-magic-line')),
			text
		};
	`);
	if (!result.found || !result.hasEmoji || !result.hasExpectedText || result.hasWrongCharacter || result.hasMagicIcon) {
		throw new Error(`Unexpected generator notice bar content: ${JSON.stringify(result)}`);
	}
};

const assertThemePanelLayout = async () => {
	const result = await runInPage<{
		found: boolean;
		gridTemplateColumns: string;
		columnCount: number;
		gridScrollWidth: number;
		gridClientWidth: number;
		panelWidth: number;
		textOverflow: boolean;
		createHeight: number;
		createScrollWidth: number;
		createClientWidth: number;
	}>(`
		const normalize = (value) => (value || '').replace(/\\s+/g, ' ').trim();
		const grid = document.querySelector('.theme-switch-grid');
		const panel = grid?.parentElement;
		const create = [...document.querySelectorAll('a')].find((element) => normalize(element.textContent) === 'Create');
		const gridStyle = grid ? getComputedStyle(grid) : undefined;
		const createRect = create?.getBoundingClientRect();
		const panelRect = panel?.getBoundingClientRect();
		const textOverflow = [...(grid?.querySelectorAll('button') || [])].some((button) => {
			const label = button.children[1];
			const labelRect = label?.getBoundingClientRect();
			const buttonRect = button.getBoundingClientRect();
			return Boolean(labelRect && (labelRect.right > buttonRect.right + 1 || labelRect.left < buttonRect.left - 1));
		});
		return {
			found: Boolean(grid && panel && create),
			gridTemplateColumns: gridStyle?.gridTemplateColumns || '',
			columnCount: gridStyle?.gridTemplateColumns.split(' ').filter(Boolean).length || 0,
			gridScrollWidth: grid?.scrollWidth || 0,
			gridClientWidth: grid?.clientWidth || 0,
			panelWidth: Math.round(panelRect?.width || 0),
			textOverflow,
			createHeight: Math.round(createRect?.height || 0),
			createScrollWidth: create?.scrollWidth || 0,
			createClientWidth: create?.clientWidth || 0
		};
	`);
	const hasNoHorizontalScroll = result.gridScrollWidth <= result.gridClientWidth + 1;
	const createFits = result.createScrollWidth <= result.createClientWidth + 1 && result.createHeight <= 32;
	if (
		!result.found ||
		result.columnCount !== 3 ||
		!hasNoHorizontalScroll ||
		result.textOverflow ||
		!createFits ||
		result.panelWidth <= 176
	) {
		throw new Error(`Unexpected theme panel layout: ${JSON.stringify(result)}`);
	}
};

const clickText = async (text: string, index = 0) => {
	const ok = await runInPage<boolean>(`
		const text = ${JSON.stringify(text)};
		const index = ${index};
		const visible = (el) => {
			const rect = el.getBoundingClientRect();
			const style = getComputedStyle(el);
			return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
		};
		const normalize = (value) => (value || '').replace(/\\s+/g, ' ').trim();
		const candidates = [...document.querySelectorAll('button,[role="button"],a')].filter(visible);
		const exact = candidates.filter((el) => normalize(el.textContent || el.getAttribute('aria-label') || '') === text);
		const loose = candidates
			.filter((el) => normalize(el.textContent || el.getAttribute('aria-label') || '').includes(text))
			.sort((a, b) => normalize(a.textContent || '').length - normalize(b.textContent || '').length);
		const target = exact[index] || loose[index];
		if (!target) return false;
		target.scrollIntoView({ block: 'center', inline: 'center' });
		target.click();
		return true;
	`);
	if (!ok) throw new Error(`Unable to click text: ${text}`);
	await sleep(250);
};

const clickByAriaLabel = async (label: string) => {
	const ok = await runInPage<boolean>(`
		const label = ${JSON.stringify(label)};
		const target = [...document.querySelectorAll('[aria-label]')].find((element) => element.getAttribute('aria-label') === label);
		if (!target) return false;
		target.scrollIntoView({ block: 'center', inline: 'center' });
		target.click();
		return true;
	`);
	if (!ok) throw new Error(`Unable to click aria-label: ${label}`);
	await sleep(300);
};

const hoverText = async (text: string) => {
	const ok = await runInPage<boolean>(`
		const text = ${JSON.stringify(text)};
		const visible = (el) => {
			const rect = el.getBoundingClientRect();
			const style = getComputedStyle(el);
			return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
		};
		const normalize = (value) => (value || '').replace(/\\s+/g, ' ').trim();
		const target = [...document.querySelectorAll('button,[role="button"],a')]
			.filter(visible)
			.find((el) => normalize(el.textContent || el.getAttribute('aria-label') || '') === text);
		if (!target) return false;
		target.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, view: window }));
		target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false, view: window }));
		return true;
	`);
	if (!ok) throw new Error(`Unable to hover text: ${text}`);
	await sleep(300);
};

const assertIframeUrl = async (component: string, lang: 'zh_CN' | 'en_US') => {
	await waitFor(() => runInPage<boolean>(`return Boolean(document.querySelector('#iframe-id'));`), `iframe for ${component}`);
	const src = await runInPage<string>(`return document.querySelector('#iframe-id')?.getAttribute('src') || '';`);
	if (!src.includes(`/${component}/${lang}`)) throw new Error(`Unexpected iframe src for ${component}: ${src}`);
	if (!src.includes(`lang=${lang}`)) throw new Error(`Iframe src is missing lang=${lang}: ${src}`);
	if (!src.includes('channel=iframe')) throw new Error(`Iframe src is missing channel=iframe: ${src}`);
};

const assertNoBrowserErrors = (label: string) => {
	const unexpectedErrors = browserErrors.filter((message) => !baselineBrowserErrorMessages.some((baseline) => message.includes(baseline)));
	if (unexpectedErrors.length > 0) {
		throw new Error(`${label}: ${unexpectedErrors.slice(0, 3).join(' | ')}`);
	}
};

const scenarios: Scenario[] = [
	{
		name: 'Home renders zh',
		path: '/',
		steps: [
			() => assertBodyIncludes('RTDF'),
			() => assertBodyIncludes('基于'),
			() => assertSelector('a[aria-label="首页"]', 'home logo link')
		]
	},
	{
		name: 'Home renders en',
		path: '/?lang=en_US',
		steps: [
			() => assertBodyIncludes('RTDF'),
			() => assertBodyIncludes('Mobile web component'),
			() => assertSelector('a[aria-label="Home"]', 'home logo link')
		]
	},
	{
		name: 'Header language switch keeps route',
		path: '/components?nav=button&tab=0',
		steps: [
			() => clickByAriaLabel('跳转英文站点'),
			() => waitFor(() => bodyIncludes('Button'), 'English component title'),
			() => assertIframeUrl('button', 'en_US')
		]
	},
	{
		name: 'Components demo tab renders source and iframe',
		path: '/components?nav=button&tab=0',
		steps: [
			() => assertBodyIncludes('Button'),
			() => waitFor(() => runInPage<boolean>(`return document.querySelectorAll('pre code').length > 0;`), 'highlighted code'),
			() => assertIframeUrl('button', 'zh_CN')
		]
	},
	{
		name: 'Components API tab renders markdown',
		path: '/components?nav=button&tab=1',
		steps: [
			() => waitFor(() => bodyIncludes('Button Props'), 'Button API markdown'),
			() => assertBodyIncludes('Button Events'),
			() => assertBodyIncludes('fill')
		]
	},
	{
		name: 'Components guide tab renders markdown',
		path: '/components?nav=button&tab=2&lang=en_US',
		steps: [
			() => assertBodyIncludes('Button'),
			() => assertBodyIncludes('Button group'),
			() => clickText('API'),
			() => waitFor(() => bodyIncludes('Button Props'), 'tab click to API')
		]
	},
	{
		name: 'Components keyboard navigation changes tab',
		path: '/components?nav=calendar&tab=0&lang=en_US',
		steps: [
			() => page.call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 }),
			() => waitFor(() => bodyIncludes('Calendar Props'), 'calendar API after ArrowRight')
		]
	},
	{
		name: 'Guide quick start renders zh',
		path: '/guide',
		steps: [() => waitFor(() => bodyIncludes('bun create rtdf@latest'), 'quick start command'), () => assertBodyIncludes('安装')]
	},
	{
		name: 'Guide theme renders en',
		path: '/guide/theme?lang=en_US',
		steps: [() => assertBodyIncludes('Theme'), () => assertBodyIncludes('@plugin "rtdf/theme"')]
	},
	{
		name: 'Guide color page renders generated swatches',
		path: '/guide/color?lang=en_US',
		steps: [
			() => assertBodyIncludes('RTDF follows Tailwind CSS v4'),
			() => assertBodyIncludes('primary'),
			() => assertBodyIncludes('success')
		]
	},
	{
		name: 'Guide generator page renders live preview',
		path: '/guide/generator?lang=en_US',
		steps: [
			() => assertBodyIncludes('Theme Generator'),
			() => assertBodyExcludes('Live Preview'),
			() => assertSelector('svg[viewBox="0 0 614 383.76"]', 'generator STDF landscape illustration'),
			() => assertToolbarIcon('Preview', ['ri-eye-line'], 14),
			() => assertToolbarIcon('Config', ['ri-palette-line'], 14),
			() => assertToolbarIcon('Switch to', ['ri-sun-line', 'ri-moon-line'], 16),
			() => assertToolbarIcon('Random', ['ri-dice-line'], 14),
			() => assertToolbarIcon('Reset', ['ri-refresh-line'], 14),
			() => assertToolbarIcon('Cache', ['ri-save-line'], 14),
			() => assertGeneratorColorPickerSpacing(),
			() => assertGeneratorRadiusLayout(),
			() => assertGeneratorLineChartLayout(),
			() => assertGeneratorNoticeBarContent(),
			() => clickText('Config'),
			() => waitFor(() => bodyIncludes('@plugin "rtdf/theme"'), 'generator plugin config'),
			() => assertGeneratorPaletteMetrics()
		]
	},
	{
		name: 'Guide shortcut page renders keyboard docs',
		path: '/guide/shortkey?lang=en_US',
		steps: [() => assertBodyIncludes('The whole website'), () => assertBodyIncludes('arrow keys')]
	},
	{
		name: 'Header theme panel changes data mode',
		path: '/components?nav=button&tab=0&lang=en_US',
		steps: [
			() => hoverText('Theme'),
			() => assertThemePanelLayout(),
			() => clickByAriaLabel('Dark'),
			() => waitFor(() => runInPage<boolean>(`return document.documentElement.getAttribute('data-mode') === 'dark';`), 'dark mode'),
			() => assertIframeUrl('button', 'en_US')
		]
	}
];

const failures: Array<{ name: string; reason: string }> = [];

for (const scenario of scenarios) {
	try {
		await goto(scenario.path);
		for (const step of scenario.steps) {
			await step();
		}
		assertNoBrowserErrors(scenario.name);
		console.log(`PASS ${scenario.name}`);
	} catch (error) {
		failures.push({ name: scenario.name, reason: error instanceof Error ? error.message : String(error) });
		console.log(`FAIL ${scenario.name}`);
	}
}

page.close();
cleanup();

console.log(JSON.stringify({ baseUrl, checked: scenarios.length, failedCount: failures.length, failures }, null, 2));

if (failures.length > 0) process.exit(1);
