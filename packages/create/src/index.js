import fs from 'fs-extra';
import { execFile } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as p from '@clack/prompts';
import { blue, bold, cyan, grey, red } from 'kleur/colors';
import minimist from 'minimist';
import pacote from 'pacote';

import * as langAll from './lang.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(currentDir, '..');
const packageJsonPath = path.join(packageRoot, 'package.json');
const { version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const fallbackVersions = {
	'@any-tdf/vite-plugin-svg-symbol': '0.0.3',
	'@iconify-json/bitcoin-icons': '1.2.5',
	'@iconify-json/duo-icons': '1.2.2',
	'@iconify-json/fluent-color': '1.2.21',
	'@iconify/tailwind4': '1.1.0',
	'@unocss/preset-icons': '66.7.4',
	'@unocss/preset-wind4': '66.7.4',
	rtdf: '3.0.0-alpha.0',
	unocss: '66.7.4',
};

const getRegistryPackageName = packageName => packageName.replace('/', '%2F');
const getPackageSpec = (packageName, tag = 'latest') => (tag === 'latest' ? packageName : `${packageName}@${tag}`);
const getDependencyVersion = version => (version.includes('-') ? version : `^${version}`);

const getBunManifest = (packageName, tag = 'latest') =>
	new Promise(resolve => {
		execFile('bun', ['pm', 'view', getPackageSpec(packageName, tag), '--json'], { cwd: packageRoot, timeout: 8000 }, (error, stdout) => {
			if (error || !stdout.trim()) {
				resolve(null);
				return;
			}

			try {
				resolve(JSON.parse(stdout));
			} catch {
				resolve(null);
			}
		});
	});

const getLatestManifest = async (packageName, tag = 'latest') => {
	const bunManifest = await getBunManifest(packageName, tag);
	if (bunManifest?.version) {
		return bunManifest;
	}

	try {
		const response = await fetch(`https://registry.npmjs.org/${getRegistryPackageName(packageName)}/${tag}`);
		if (response.ok) {
			return await response.json();
		}
	} catch {}

	try {
		return await pacote.manifest(getPackageSpec(packageName, tag));
	} catch {
		return null;
	}
};

const getLatestVersion = async (packageName, tag = 'latest') => {
	const manifest = await getLatestManifest(packageName, tag);
	return manifest?.version || fallbackVersions[packageName] || null;
};

const createRtdfV = await getLatestVersion('create-rtdf');

console.log(`
${grey(`create-rtdf@${version}`)}
`);

if (createRtdfV && version !== createRtdfV) {
	console.log(
		red(`Recommended to use the latest version: ${createRtdfV}
		`),
	);
}

const spinner = p.spinner();

p.intro('Welcome to use RTDF!');

let lang = langAll.en_US;

const argv = minimist(process.argv.slice(2));
const argvProjectName = argv._[0];
const argvTemplate = argv.template || argv.t;
const argvLanguage = argv.language || argv.l;
const argvIconUsage = argv.iconUsage || argv['icon-usage'] || argv.i;
const argvThemeMode = argv.themeMode || argv['theme-mode'] || argv.theme || argv.m;

const languages = [];

for (const key in langAll) {
	languages.push({ value: key, label: langAll[key].name, sort: langAll[key].sort });
}

languages.sort((a, b) => a.sort - b.sort);
lang = argvLanguage && languages.find(item => item.value === argvLanguage) ? langAll[argvLanguage] : langAll.en_US;

const templateOptions = [
	{ value: 'vrtt', label: 'Vite & React & Tailwind CSS & TypeScript', template: 'vrtt', ts: true, css: 'tailwind', finish: true },
	{ value: 'vrut', label: 'Vite & React & UnoCSS & TypeScript', template: 'vrut', ts: true, css: 'unocss', finish: true },
];

const packageManagerOptions = [
	{ value: 'bun', label: 'Bun', install: 'bun i', dev: 'bun dev' },
	{ value: 'npm', label: 'NPM', install: 'npm i', dev: 'npm run dev' },
	{ value: 'pnpm', label: 'PNPM', install: 'pnpm i', dev: 'pnpm dev' },
	{ value: 'yarn', label: 'Yarn', install: 'yarn', dev: 'yarn run dev' },
];

const iconUsageOptions = [
	{ value: 'any-tdf-icon', label: '@any-tdf/vite-plugin-svg-symbol', hintKey: 'iconSvgSymbolHint' },
	{ value: 'iconify', label: 'Iconify', hintKey: 'iconIconifyHint' },
	{ value: 'both', label: '@any-tdf/vite-plugin-svg-symbol & Iconify', hintKey: 'iconBothHint' },
	{ value: 'none', label: 'none', hintKey: 'iconNoneHint' },
];

const themeModeOptions = [
	{ value: 'single', labelKey: 'tms' },
	{ value: 'multi', labelKey: 'tmm' },
	{ value: 'all', labelKey: 'tma' },
];

const getThemeModeOptions = () =>
	themeModeOptions.map(item => ({
		value: item.value,
		label: lang[item.labelKey],
	}));

const writeJson = (filePath, data) => {
	fs.writeFileSync(filePath, `${JSON.stringify(data, null, '\t')}\n`, 'utf-8');
};

const addLatestDependency = async (packageJson, section, packageName, versionPrefix = '^') => {
	const latestVersion = await getLatestVersion(packageName);
	if (latestVersion) {
		packageJson[section][packageName] = `${versionPrefix}${latestVersion}`;
	}
};

const replaceFileContent = (filePath, replacements) => {
	let content = fs.readFileSync(filePath, 'utf-8');
	for (const [from, to] of replacements) {
		content = content.replace(from, to);
	}
	fs.writeFileSync(filePath, content, 'utf-8');
};

const formatBlockForMarker = (block, indent) => (block ? block.trimEnd().replace(/\n/g, `\n${indent}`) : '');

const addTailwindIconify = async (projectDir, packageJson) => {
	await addLatestDependency(packageJson, 'devDependencies', '@iconify/tailwind4');
	await addLatestDependency(packageJson, 'devDependencies', '@iconify-json/bitcoin-icons');
	await addLatestDependency(packageJson, 'devDependencies', '@iconify-json/duo-icons');
	await addLatestDependency(packageJson, 'devDependencies', '@iconify-json/fluent-color');

	const appCssPath = path.join(projectDir, 'src/index.css');
	const appCss = fs.readFileSync(appCssPath, 'utf-8');
	const iconifyBlock = '@plugin "@iconify/tailwind4" {\n\tprefixes: duo-icons, bitcoin-icons, fluent-color;\n}\n\n';
	const nextAppCss = appCss.includes('@plugin "@iconify/tailwind4"')
		? appCss
		: appCss.replace('@theme', `${iconifyBlock}@theme`);
	fs.writeFileSync(appCssPath, nextAppCss, 'utf-8');

	const appPath = fs.existsSync(path.join(projectDir, 'src/App.tsx')) ? path.join(projectDir, 'src/App.tsx') : path.join(projectDir, 'src/App.jsx');
	const iconifySnippet = fs.readFileSync(path.join(packageRoot, 'snippet/iconify.txt'), 'utf-8');
	replaceFileContent(appPath, [['{/* RTDF_ICON_EXAMPLES */}', `${formatBlockForMarker(iconifySnippet, '\t\t\t\t')}\n\t\t\t\t{/* RTDF_ICON_EXAMPLES */}`]]);
};

const addUnoCssIconify = async (projectDir, packageJson) => {
	await addLatestDependency(packageJson, 'devDependencies', '@unocss/preset-icons');
	await addLatestDependency(packageJson, 'devDependencies', '@iconify-json/bitcoin-icons');
	await addLatestDependency(packageJson, 'devDependencies', '@iconify-json/duo-icons');
	await addLatestDependency(packageJson, 'devDependencies', '@iconify-json/fluent-color');

	const unoConfigPath = path.join(projectDir, 'uno.config.ts');
	replaceFileContent(unoConfigPath, [
		['/* RTDF_UNOCSS_ICON_IMPORT */', "import presetIcons from '@unocss/preset-icons';"],
		[
			'/* RTDF_UNOCSS_ICON_PRESET */',
			`presetIcons({
\t\t\textraProperties: {
\t\t\t\tdisplay: 'inline-block',
\t\t\t\t'vertical-align': 'middle',
\t\t\t},
\t\t}),`,
		],
		[
			'/* RTDF_UNOCSS_ICON_SAFE_LIST */',
			`'i-duo-icons:cake',
\t'i-duo-icons:brush',
\t'i-bitcoin-icons:miner-filled',
\t'i-bitcoin-icons:magic-wand-outline',
\t'i-fluent-color:building-store-20',`,
		],
	]);

	const appPath = path.join(projectDir, 'src/App.tsx');
	const iconifySnippet = fs.readFileSync(path.join(packageRoot, 'snippet/iconify-unocss.txt'), 'utf-8');
	replaceFileContent(appPath, [['{/* RTDF_ICON_EXAMPLES */}', `${formatBlockForMarker(iconifySnippet, '\t\t\t\t')}\n\t\t\t\t{/* RTDF_ICON_EXAMPLES */}`]]);
};

const addIconify = async (projectDir, packageJson, templateItem) => {
	if (templateItem.css === 'unocss') {
		await addUnoCssIconify(projectDir, packageJson);
		return;
	}
	await addTailwindIconify(projectDir, packageJson);
};

const addSvgSymbol = async (projectDir, packageJson, isTs) => {
	await addLatestDependency(packageJson, 'devDependencies', '@any-tdf/vite-plugin-svg-symbol');

	const viteConfigPath = path.join(projectDir, `vite.config.${isTs ? 'ts' : 'js'}`);
	replaceFileContent(viteConfigPath, [
		['/* RTDF_SVG_SYMBOL_IMPORT */', "import svgSymbol from '@any-tdf/vite-plugin-svg-symbol';"],
		[
			'/* RTDF_SVG_SYMBOL_PLUGIN */',
			`svgSymbol([
\t\t\t{ inFile: 'src/lib/svgs/Heroicons', outFile: 'public/symbols' },
\t\t\t{ inFile: 'src/lib/svgs/IconPark', outFile: 'public/symbols' },
\t\t\t{ inFile: 'src/lib/svgs/Remix', outFile: 'public/symbols' },
\t\t])`,
		],
	]);

	fs.copySync(path.join(packageRoot, 'snippet/svgs'), path.join(projectDir, 'src/lib/svgs'));

	const appPath = fs.existsSync(path.join(projectDir, 'src/App.tsx')) ? path.join(projectDir, 'src/App.tsx') : path.join(projectDir, 'src/App.jsx');
	const svgSymbolSnippet = fs.readFileSync(path.join(packageRoot, 'snippet/svg-symbol.txt'), 'utf-8');
	replaceFileContent(appPath, [['{/* RTDF_ICON_EXAMPLES */}', `${formatBlockForMarker(svgSymbolSnippet, '\t\t\t\t')}\n\t\t\t\t{/* RTDF_ICON_EXAMPLES */}`]]);
};

const updateThemeCss = (cssContent, mode, templateItem) => {
	if (templateItem.css === 'unocss') return cssContent;

	const pluginRegex = /@plugin "rtdf\/theme(?:\/plugin)?" \{[\s\S]*?\}\n\n?/;
	const singlePlugin = '@plugin "rtdf/theme/plugin" {\n\tname: "ANYTDF";\n}\n\n';
	const multiPlugin = '@plugin "rtdf/theme/plugin" {\n\tname: "ANYTDF, Sage, GoldWood";\n}\n\n';
	const allPlugin = '@plugin "rtdf/theme/plugin" {\n\tall: true;\n}\n\n';
	const insertPlugin = (content, pluginBlock) => {
		if (content.match(pluginRegex)) {
			return content.replace(pluginRegex, pluginBlock);
		}
		return content.replace('@theme', `${pluginBlock}@theme`);
	};

	if (mode === 'single') {
		return insertPlugin(cssContent, singlePlugin);
	}
	if (mode === 'all') {
		return insertPlugin(cssContent, allPlugin);
	}
	return insertPlugin(cssContent, multiPlugin);
};

const getThemeBlocks = mode => {
	if (mode === 'single') {
		return { state: "const activeTheme = 'ANYTDF';", control: '' };
	}

	if (mode === 'all') {
		return {
			state: `const themeNames = useMemo(() => themes.map(item => item.name), []);
\tconst [theme, setTheme] = useState('ANYTDF');
\tconst activeTheme = theme;
\tconst randomThemeFun = () => {
\t\tif (themeNames.length === 0) return;
\t\tconst nextIndex = Math.floor(Math.random() * themeNames.length);
\t\tsetTheme(themeNames[nextIndex] || 'ANYTDF');
\t};`,
			control: `<div className='my-6 flex flex-col gap-3 px-4 text-center'>
\t<Button fill='lineState' onClick={randomThemeFun}>{isZh ? '随机主题' : 'Random theme'}</Button>
\t<div className='text-xs opacity-70'>{isZh ? '当前主题' : 'Current theme'}: {activeTheme}</div>
</div>`,
		};
	}

	return {
		state: `const themeOptions = [
\t\t{ name: 'ANYTDF', labelZh: 'ANYTDF', labelEn: 'ANYTDF' },
\t\t{ name: 'Sage', labelZh: '草绿粉紫', labelEn: 'Sage' },
\t\t{ name: 'GoldWood', labelZh: '金色森林', labelEn: 'GoldWood' },
\t];
\tconst [themeIndex, setThemeIndex] = useState(0);
\tconst themeLabels = useMemo(
\t\t() => themeOptions.map(item => ({ text: isZh ? item.labelZh : item.labelEn })),
\t\t[isZh],
\t);
\tconst activeTheme = themeOptions[themeIndex]?.name || 'ANYTDF';`,
		control: `<div className='my-6 px-4'>
\t<Tabs tab={{ labels: themeLabels }} active={themeIndex} onChange={setThemeIndex} transition={false} />
</div>`,
	};
};

const updateThemeApp = (appContent, mode) => {
	const themeBlocks = getThemeBlocks(mode);
	return appContent
		.replace('/* RTDF_THEME_STATE */', formatBlockForMarker(themeBlocks.state, '\t'))
		.replace('{/* RTDF_THEME_CONTROL */}', formatBlockForMarker(themeBlocks.control, '\t\t\t\t'));
};

const finalizeOptionalMarkers = projectDir => {
	const appPath = fs.existsSync(path.join(projectDir, 'src/App.tsx')) ? path.join(projectDir, 'src/App.tsx') : path.join(projectDir, 'src/App.jsx');
	replaceFileContent(appPath, [['{/* RTDF_ICON_EXAMPLES */}', '']]);
	const viteConfigPath = fs.existsSync(path.join(projectDir, 'vite.config.ts')) ? path.join(projectDir, 'vite.config.ts') : path.join(projectDir, 'vite.config.js');
	replaceFileContent(viteConfigPath, [
		['/* RTDF_SVG_SYMBOL_IMPORT */', ''],
		['/* RTDF_SVG_SYMBOL_PLUGIN */', ''],
	]);
	const unoConfigPath = path.join(projectDir, 'uno.config.ts');
	if (fs.existsSync(unoConfigPath)) {
		replaceFileContent(unoConfigPath, [
			['/* RTDF_UNOCSS_ICON_IMPORT */', ''],
			['/* RTDF_UNOCSS_ICON_PRESET */', ''],
			['/* RTDF_UNOCSS_ICON_SAFE_LIST */', ''],
		]);
	}
};

const runCreateFunc = (...args) => {
	createFunc(...args).catch(err => {
		spinner.stop();
		console.error(red(`${lang.cferror} -- ${err.message || err}`));
		process.exit(1);
	});
};

const createFunc = async (projectName, templateItem, iconUsageItem, packageManagerItem, themeModeItem) => {
	if (typeof projectName === 'number') {
		projectName = projectName.toString();
	}

	const projectDir = path.resolve(projectName);
	const themeMode = themeModeItem?.value || 'multi';

	spinner.start('🚀 ' + lang.cfsing);
	fs.mkdirSync(projectDir);

	const templatePath = path.join(packageRoot, `templates/${templateItem.template}`);
	await fs.copy(templatePath, projectDir);

	const packageJsonPathInner = path.join(projectDir, 'package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPathInner, 'utf-8'));
	packageJson.name = projectName;

	const rtdfManifest = await getLatestManifest('rtdf', 'alpha');
	const rtdfVersion = rtdfManifest?.version || fallbackVersions.rtdf;
	if (rtdfVersion) {
		packageJson.dependencies.rtdf = getDependencyVersion(rtdfVersion);
	}
	if (iconUsageItem.value === 'iconify') {
		await addIconify(projectDir, packageJson, templateItem);
	}
	if (iconUsageItem.value === 'any-tdf-icon') {
		await addSvgSymbol(projectDir, packageJson, templateItem.ts);
	}
	if (iconUsageItem.value === 'both') {
		await addIconify(projectDir, packageJson, templateItem);
		await addSvgSymbol(projectDir, packageJson, templateItem.ts);
	}

	const appCssPath = path.join(projectDir, 'src/index.css');
	const appCssContent = fs.readFileSync(appCssPath, 'utf-8');
	fs.writeFileSync(appCssPath, updateThemeCss(appCssContent, themeMode, templateItem), 'utf-8');

	const appPath = path.join(projectDir, `src/App.${templateItem.ts ? 'tsx' : 'jsx'}`);
	const appContent = fs.readFileSync(appPath, 'utf-8');
	fs.writeFileSync(appPath, updateThemeApp(appContent, themeMode), 'utf-8');

	finalizeOptionalMarkers(projectDir);
	writeJson(packageJsonPathInner, packageJson);

	spinner.stop();
	p.outro(`🎉🎉🎉 ${projectName} - ${lang.pcsucc}`);

	const versions = {
		react: packageJson.dependencies.react.replace('^', ''),
		rtdf: packageJson.dependencies.rtdf.replace('^', ''),
		vite: packageJson.devDependencies.vite.replace('^', ''),
	};
	if (templateItem.css === 'tailwind') {
		versions.tailwindcss = packageJson.devDependencies.tailwindcss.replace('^', '');
	} else {
		versions.unocss = packageJson.devDependencies.unocss.replace('^', '');
	}

	let versionsString = '';
	for (const key in versions) {
		versionsString += bold(key) + ': ' + cyan(versions[key]) + ' ';
	}

	console.log(`📦 ${versionsString}
	`);

	console.log(
		`👉 ${bold(lang.tgs)}
    ${blue(`1. cd ${projectName}`)}
    ${blue(`2. ${packageManagerItem.install}`)}
    ${blue(`3. ${packageManagerItem.dev}`)}
    `,
	);

	console.log(`🎨 ${grey(templateItem.css === 'tailwind' ? lang.pcyt_vt : lang.pcyt_vu)}`);
	process.exit(0);
};

if (argvProjectName) {
	let itemTemplate = null;
	if (argvTemplate) {
		itemTemplate = templateOptions.find(item => item.value === argvTemplate);
		if (!itemTemplate) {
			p.intro(red(lang.pectn + ' (' + templateOptions.map(item => item.value).join(', ') + ')'));
			process.exit(0);
		}
	} else {
		itemTemplate = templateOptions[0];
	}

	let itemIconUsage = null;
	if (argvIconUsage) {
		itemIconUsage = iconUsageOptions.find(item => item.value === argvIconUsage);
		if (!itemIconUsage) {
			p.intro(red(lang.pic + ' (' + iconUsageOptions.map(item => item.value).join(', ') + ')'));
			process.exit(0);
		}
	} else {
		itemIconUsage = iconUsageOptions[0];
	}

	let itemThemeMode = null;
	if (argvThemeMode) {
		itemThemeMode = themeModeOptions.find(item => item.value === argvThemeMode);
		if (!itemThemeMode) {
			p.intro(red(lang.ptm + ' (' + themeModeOptions.map(item => item.value).join(', ') + ')'));
			process.exit(0);
		}
	} else {
		itemThemeMode = themeModeOptions.find(item => item.value === 'multi');
	}

	if (fs.existsSync(argvProjectName)) {
		p.intro(red('🚫 ' + argvProjectName + ' ' + lang.pane));
		process.exit(0);
	}

	runCreateFunc(argvProjectName, itemTemplate, itemIconUsage, packageManagerOptions[0], itemThemeMode);
} else {
	const languageType = await p.select({
		message: bold('Please select your preferred language'),
		options: languages,
	});
	if (p.isCancel(languageType)) {
		p.cancel(red('⛔ ') + lang.oc);
		process.exit(0);
	}
	lang = langAll[languageType];

	const template = await p.select({
		message: bold(lang.psat),
		options: templateOptions.map(item => ({
			...item,
			label: item.finish ? item.label : `(${lang.hnay}) ${item.label}`,
			disabled: !item.finish,
		})),
	});
	if (p.isCancel(template)) {
		p.cancel(red('⛔ ') + lang.oc);
		process.exit(0);
	}

	const iconUsage = await p.select({
		message: bold(lang.psai),
		options: iconUsageOptions.map(item => ({
			value: item.value,
			label: `${item.label} - ${lang[item.hintKey]}`,
		})),
	});
	if (p.isCancel(iconUsage)) {
		p.cancel(red('⛔ ') + lang.oc);
		process.exit(0);
	}

	const themeMode = await p.select({
		message: bold(lang.pstm) + ' - ' + grey(lang.themeGeneratorHint),
		options: getThemeModeOptions(),
	});
	if (p.isCancel(themeMode)) {
		p.cancel(red('⛔ ') + lang.oc);
		process.exit(0);
	}

	const projectName = await p.text({
		message: bold(lang.pn),
		placeholder: 'rtdf-project',
		validate: value => {
			if (!value) {
				return lang.pncbne;
			}
			if (fs.existsSync(value)) {
				return '🚫 ' + value + ' ' + lang.pane;
			}
		},
	});
	if (p.isCancel(projectName)) {
		p.cancel(red('⛔ ') + lang.oc);
		process.exit(0);
	}

	const packageManager = await p.select({
		message: bold(lang.pm),
		options: packageManagerOptions,
	});
	if (p.isCancel(packageManager)) {
		p.cancel(red('⛔ ') + lang.oc);
		process.exit(0);
	}

	runCreateFunc(
		projectName,
		templateOptions.find(item => item.value === template),
		iconUsageOptions.find(item => item.value === iconUsage),
		packageManagerOptions.find(item => item.value === packageManager),
		themeModeOptions.find(item => item.value === themeMode),
	);
}
