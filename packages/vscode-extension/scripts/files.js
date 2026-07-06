const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { execFileSync } = require('node:child_process');

const extensionRoot = path.resolve(__dirname, '..');
const rtdfRoot = path.resolve(extensionRoot, '../..');
const workspaceRoot = path.resolve(rtdfRoot, '..');

const generateComponentDocs = () => {
	const commonRoot = path.join(workspaceRoot, 'site-common');
	const generator = path.join(commonRoot, 'scripts/generate-component-docs.mjs');
	if (!fs.existsSync(generator)) {
		console.warn('Skipped component docs generation because site-common is unavailable.');
		return;
	}

	execFileSync('bun', ['run', 'scripts/generate-component-docs.mjs', '--target', 'rtdf'], {
		cwd: commonRoot,
		stdio: 'inherit',
	});
};

const copyDocs = () => {
	const sourceDir = path.join(rtdfRoot, 'docs/mds/components');
	const targetDir = path.join(extensionRoot, 'src/docs/components');
	fs.rmSync(targetDir, { recursive: true, force: true });
	fs.mkdirSync(targetDir, { recursive: true });

	const components = fs.readdirSync(sourceDir).filter(item => item !== '.DS_Store');
	for (const component of components) {
		const componentSourceDir = path.join(sourceDir, component);
		const componentTargetDir = path.join(targetDir, component);
		fs.mkdirSync(componentTargetDir, { recursive: true });

		for (const fileName of ['api.md', 'api_en.md']) {
			const sourceFile = path.join(componentSourceDir, fileName);
			if (fs.existsSync(sourceFile)) {
				fs.copyFileSync(sourceFile, path.join(componentTargetDir, fileName));
			}
		}
	}

	console.log(`Copied API docs for ${components.length} components.`);
};

const writeMenuList = async () => {
	const dataPath = path.join(workspaceRoot, 'site-common/dist/data.js');
	const { menuList } = await import(pathToFileURL(dataPath).href);
	const content = `module.exports = ${JSON.stringify(menuList, null, '\t')};\n`;
	fs.writeFileSync(path.join(extensionRoot, 'src/menuList.js'), content, 'utf-8');
	console.log('Generated src/menuList.js.');
};

const main = async () => {
	generateComponentDocs();
	copyDocs();
	await writeMenuList();
};

main();
