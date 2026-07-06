import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';

type CheckResult = {
	name: string;
	ok: boolean;
	detail: string;
	missing?: string[];
	extra?: string[];
};

const workspaceRoot = resolve(process.cwd(), '../../..');
const stdfRoot = join(workspaceRoot, 'stdf');
const rtdfRoot = join(workspaceRoot, 'rtdf');
const siteRoot = join(rtdfRoot, 'docs/site');

const listDirs = (dir: string) => readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();

const listFiles = (dir: string) => readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => entry.name).sort();

const walkFiles = (dir: string): string[] => {
	const entries = readdirSync(dir, { withFileTypes: true });
	const files: string[] = [];
	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...walkFiles(fullPath));
		} else if (entry.isFile()) {
			files.push(fullPath);
		}
	}
	return files;
};

const difference = (left: string[], right: string[]) => {
	const rightSet = new Set(right);
	return left.filter((item) => !rightSet.has(item));
};

const check = (name: string, detail: string, missing: string[] = [], extra: string[] = []): CheckResult => ({
	name,
	ok: missing.length === 0,
	detail,
	missing,
	extra
});

const stdfComponentRoutes = listDirs(join(stdfRoot, 'packages/stdf/src/routes')).filter((component) => {
	return existsSync(join(stdfRoot, 'packages/stdf/src/routes', component, 'zh_CN/+page.svelte')) && existsSync(join(stdfRoot, 'packages/stdf/src/routes', component, 'en_US/+page.svelte'));
});

const rtdfComponentRoutes = listDirs(join(rtdfRoot, 'packages/rtdf/src/pages')).filter((component) => {
	return existsSync(join(rtdfRoot, 'packages/rtdf/src/pages', component, 'zh_CN.tsx')) && existsSync(join(rtdfRoot, 'packages/rtdf/src/pages', component, 'en_US.tsx'));
});

const stdfComponentDocFiles = walkFiles(join(stdfRoot, 'docs/mds/components')).map((file) => relative(join(stdfRoot, 'docs/mds/components'), file)).sort();
const rtdfComponentDocFiles = walkFiles(join(rtdfRoot, 'docs/mds/components')).map((file) => relative(join(rtdfRoot, 'docs/mds/components'), file)).sort();

const stdfGuideRouteRoot = join(stdfRoot, 'docs/site/src/routes/guide');
const stdfGuideRoutes = ['quick-start', ...listDirs(stdfGuideRouteRoot).filter((dir) => existsSync(join(stdfGuideRouteRoot, dir, '+page.svelte')))].sort();
const guideLayoutSource = readFileSync(join(siteRoot, 'src/pages/guide/GuideLayout.tsx'), 'utf8');
const rtdfGuideNavs = Array.from(guideLayoutSource.matchAll(/nav:\s*'([^']+)'/g)).map((match) => match[1]).sort();
const guidePageSource = readFileSync(join(siteRoot, 'src/pages/guide/GuidePage.tsx'), 'utf8');

const guideDocMap: Record<string, string> = {
	'quick-start': 'quickStart',
	'icon-plugin': 'iconPlugin',
	md: 'mdPlugin'
};
const customGuidePages = ['color', 'generator', 'logo', 'shortkey'];
const missingGuideDocs = rtdfGuideNavs
	.filter((nav) => !customGuidePages.includes(nav))
	.flatMap((nav) => {
		const docKey = guideDocMap[nav] || nav;
		const zhPath = join(rtdfRoot, `docs/mds/guide/${docKey}.md`);
		const enPath = join(rtdfRoot, `docs/mds/guide/${docKey}_en.md`);
		const missing: string[] = [];
		if (!existsSync(zhPath)) missing.push(`guide/${docKey}.md`);
		if (!existsSync(enPath)) missing.push(`guide/${docKey}_en.md`);
		return missing;
	});

const missingCustomGuidePages = customGuidePages.filter((nav) => {
	const componentName = `${nav.charAt(0).toUpperCase()}${nav.slice(1).replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())}Page.tsx`;
	return !existsSync(join(siteRoot, 'src/pages/guide', componentName));
});

const appSource = readFileSync(join(siteRoot, 'src/App.tsx'), 'utf8');
const requiredAppRoutes = ['path="/"', 'path="/guide/*"', 'path="/components"', 'path="*"'];
const missingAppRoutes = requiredAppRoutes.filter((route) => !appSource.includes(route));

const componentsPageSource = readFileSync(join(siteRoot, 'src/pages/components/ComponentsPage.tsx'), 'utf8');
const missingComponentsPageImports = [
	"import.meta.glob('../../../../../packages/rtdf/src/pages/**/zh_CN.tsx'",
	"import.meta.glob('../../../../../packages/rtdf/src/pages/**/en_US.tsx'",
	'<ComponentDoc'
].filter((pattern) => !componentsPageSource.includes(pattern));

const componentDocSource = readFileSync(join(siteRoot, 'src/pages/components/ComponentDoc.tsx'), 'utf8');
const missingComponentDocPatterns = ['../../../../../docs/mds/components/**/*.md', 'docType', 'lang'].filter((pattern) => !componentDocSource.includes(pattern));

const results: CheckResult[] = [
	check(
		'component demo routes',
		`STDF ${stdfComponentRoutes.length}, RTDF ${rtdfComponentRoutes.length}`,
		difference(stdfComponentRoutes, rtdfComponentRoutes),
		difference(rtdfComponentRoutes, stdfComponentRoutes)
	),
	check(
		'component markdown docs',
		`STDF ${stdfComponentDocFiles.length}, RTDF ${rtdfComponentDocFiles.length}`,
		difference(stdfComponentDocFiles, rtdfComponentDocFiles),
		difference(rtdfComponentDocFiles, stdfComponentDocFiles)
	),
	check(
		'guide route menu',
		`STDF ${stdfGuideRoutes.length}, RTDF ${rtdfGuideNavs.length}`,
		difference(stdfGuideRoutes, rtdfGuideNavs),
		difference(rtdfGuideNavs, stdfGuideRoutes)
	),
	check('guide markdown docs', `checked ${rtdfGuideNavs.length - customGuidePages.length} markdown-backed guide routes`, missingGuideDocs),
	check('custom guide pages', `checked ${customGuidePages.length} custom guide pages`, missingCustomGuidePages),
	check('app routes', `checked ${requiredAppRoutes.length} top-level routes`, missingAppRoutes),
	check('components page loaders', 'checked source loaders and doc renderer', missingComponentsPageImports),
	check('component doc loader', 'checked markdown glob and language selection', missingComponentDocPatterns),
	check('guide page renderer', 'checked custom page branch and markdown renderer', ['ColorPage', 'GeneratorPage', 'LogoPage', 'ShortkeyPage', 'guideDocs'].filter((pattern) => !guidePageSource.includes(pattern)))
];

let failed = false;
for (const result of results) {
	const status = result.ok ? 'PASS' : 'FAIL';
	console.log(`\n${status} ${result.name}`);
	console.log(`  ${result.detail}`);
	if (result.missing?.length) {
		console.log(`  missing: ${result.missing.join(', ')}`);
		failed = true;
	}
	if (result.extra?.length) {
		console.log(`  extra: ${result.extra.join(', ')}`);
	}
}

if (failed) {
	console.error('\nRTDF site verification failed.');
	process.exit(1);
}

console.log(`\nRTDF site verification passed for ${results.length} checks.`);
