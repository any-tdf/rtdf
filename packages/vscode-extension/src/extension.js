const vscode = require('vscode');
const path = require('node:path');
const fs = require('node:fs/promises');
const { execFile } = require('node:child_process');

const menuList = require('./menuList');

const sourceFileMap = {
	calendar: 'Calendar.tsx',
	feedback: 'Feedback.tsx',
	grids: 'grids.tsx',
	numKeyboard: 'NumKeyboard.tsx',
	placeholder: 'placeholder.tsx',
	skeleton: 'skeleton.tsx',
	timePicker: 'TimePicker.tsx',
};

const flattenMenuList = list => {
	const componentMap = new Map();
	for (const group of list) {
		for (const item of group.childs || []) {
			componentMap.set(item.title_en, {
				name: item.title_en,
				nav: item.nav,
				source: `packages/rtdf/src/lib/components/${item.nav}/${sourceFileMap[item.nav] || 'index.tsx'}`,
			});
		}
	}

	componentMap.set('ConfigProvider', {
		name: 'ConfigProvider',
		nav: null,
		source: 'packages/rtdf/src/lib/components/config-provider/index.tsx',
		apiZh: `### ConfigProvider

配置 RTDF 全局上下文。

| 属性 | 说明 |
| --- | --- |
| locale | 语言包，通常使用 \`zh_CN\` 或 \`en_US\`。 |
| theme | 当前主题名称或主题配置。 |
| mode | 亮暗模式，支持 \`primary\` 和 \`dark\`。 |
| iconPath | 默认 SVG Symbol 文件路径。 |
| children | React 子节点。 |`,
		apiEn: `### ConfigProvider

Configure the global RTDF context.

| Prop | Description |
| --- | --- |
| locale | Locale object, usually \`zh_CN\` or \`en_US\`. |
| theme | Current theme name or theme config. |
| mode | Light or dark mode, supports \`primary\` and \`dark\`. |
| iconPath | Default SVG Symbol file path. |
| children | React children. |`,
	});

	return componentMap;
};

const componentMap = flattenMenuList(menuList);

const getWorkspacePath = () => vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

const readWorkspacePackageJson = async workspacePath => {
	if (!workspacePath) return null;

	const packageJsonPath = path.join(workspacePath, 'package.json');
	const content = await fs.readFile(packageJsonPath, 'utf-8').catch(() => null);
	return content ? await Promise.resolve(content).then(JSON.parse).catch(() => null) : null;
};

const hasRtdfDependency = packageJson => Boolean(packageJson?.dependencies?.rtdf || packageJson?.devDependencies?.rtdf);

const normalizeVersion = version => (version || '').replace(/^[^\d]*/, '');

const runVersionCommand = (command, args, cwd) =>
	new Promise(resolve => {
		execFile(command, args, { cwd, timeout: 8000 }, (error, stdout) => {
			resolve(error ? null : stdout.trim());
		});
	});

const getLatestVersion = async workspacePath => {
	const bunVersion = await runVersionCommand('bun', ['pm', 'view', 'rtdf', 'version'], workspacePath);
	if (bunVersion) return bunVersion;
	return await runVersionCommand('npm', ['show', 'rtdf', 'version'], workspacePath);
};

const getApiContent = async (component, isZh) => {
	if (component.apiZh || component.apiEn) {
		return isZh ? component.apiZh : component.apiEn;
	}

	const apiPath = path.join(__dirname, 'docs/components', component.nav, `api${isZh ? '' : '_en'}.md`);
	return await fs.readFile(apiPath, 'utf-8').catch(() => (isZh ? '暂未找到 API 文档。' : 'API docs not found.'));
};

const createLinks = (component, isZh) => {
	const sourceUrl = `https://github.com/any-tdf/rtdf/blob/main/${component.source}`;
	if (!component.nav) {
		return `**[${isZh ? '源码' : 'Source code'}](${sourceUrl})**`;
	}

	const lang = isZh ? 'zh_CN' : 'en_US';
	const baseUrl = 'https://rtdf.dev/components?nav=';
	return `**[${isZh ? '示例' : 'Demo'}](${baseUrl}${component.nav}&tab=0&lang=${lang}) &nbsp; [API](${baseUrl}${component.nav}&tab=1&lang=${lang}) &nbsp; [${
		isZh ? '指南' : 'Guide'
	}](${baseUrl}${component.nav}&tab=2&lang=${lang}) &nbsp; [${isZh ? '版本' : 'Version'}](${baseUrl}${component.nav}&tab=4&lang=${lang}) &nbsp; [${
		isZh ? '源码' : 'Source code'
	}](${sourceUrl})**`;
};

const activate = async context => {
	const workspacePath = getWorkspacePath();
	const packageJson = await readWorkspacePackageJson(workspacePath);

	if (!hasRtdfDependency(packageJson)) return;

	const currentVersion = normalizeVersion(packageJson.dependencies?.rtdf || packageJson.devDependencies?.rtdf);
	const latestVersionPromise = getLatestVersion(workspacePath);
	const selector = ['typescriptreact', 'javascriptreact'];

	const provider = vscode.languages.registerHoverProvider(selector, {
		provideHover: async (document, position) => {
			const config = vscode.workspace.getConfiguration('RTDF');
			const isZh = !config.get('English', false);
			const wordRange = document.getWordRangeAtPosition(position, /[A-Za-z][A-Za-z0-9]*/);
			if (!wordRange) return null;

			const word = document.getText(wordRange);
			const component = componentMap.get(word);
			if (!component) return null;

			const latestVersion = (await latestVersionPromise) || (isZh ? '获取失败' : 'Failed to get');
			const versionContent = `RTDF ${isZh ? '当前' : 'Current'}: ${currentVersion} &nbsp; ${isZh ? '最新' : 'Latest'}: ${latestVersion}`;
			const apiContent = await getApiContent(component, isZh);
			const links = createLinks(component, isZh);
			const markdown = new vscode.MarkdownString(`${versionContent}

---

${apiContent}

---

${links}

---`);
			markdown.isTrusted = true;
			return new vscode.Hover(markdown);
		},
	});

	context.subscriptions.push(provider);
};

const deactivate = () => {};

module.exports = {
	activate,
	deactivate,
};
