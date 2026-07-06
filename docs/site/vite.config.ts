import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import md from '@any-tdf/vite-plugin-md-ts';
import svgSymbol from '@any-tdf/vite-plugin-svg-symbol';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, '../../..');
const siteNodeModules = path.resolve(__dirname, 'node_modules');

export default defineConfig({
	publicDir: 'static',
	plugins: [
		react(),
		tailwindcss(),
		md({ marked: {}, include: ['../mds/**/*.md', '../../packages/**/*.md'] }),
		svgSymbol([{ inFile: 'src/lib/symbol', outFile: 'static/fonts', fileName: 'symbol' }])
	],
	resolve: {
		alias: [
			{ find: /^@any-tdf\/common$/, replacement: path.resolve(siteNodeModules, '@any-tdf/common/dist/index.js') },
			{ find: /^@any-tdf\/common\/(.+)$/, replacement: path.resolve(siteNodeModules, '@any-tdf/common/dist/$1') },
			{ find: /^@any-tdf\/react-confetti$/, replacement: path.resolve(siteNodeModules, '@any-tdf/react-confetti/dist/index.js') },
			{ find: /^@any-tdf\/react-motion$/, replacement: path.resolve(siteNodeModules, '@any-tdf/react-motion/dist/index.js') },
			{ find: /^@any-tdf\/react-motion\/(.+)$/, replacement: path.resolve(siteNodeModules, '@any-tdf/react-motion/dist/$1') },
			{ find: /^@any-tdf\/site-common$/, replacement: path.resolve(siteNodeModules, '@any-tdf/site-common/dist/index.js') },
			{ find: /^@any-tdf\/site-common\/(.+)$/, replacement: path.resolve(siteNodeModules, '@any-tdf/site-common/dist/$1') },
			{ find: 'rtdf/components', replacement: path.resolve(__dirname, '../../packages/rtdf/src/lib/components') },
			{ find: 'rtdf/theme', replacement: path.resolve(__dirname, '../../packages/rtdf/src/lib/theme') },
			{ find: 'rtdf/types', replacement: path.resolve(__dirname, '../../packages/rtdf/src/lib/types') },
			{ find: 'rtdf/utils', replacement: path.resolve(__dirname, '../../packages/rtdf/src/lib/components/utils') }
		]
	},
	server: {
		hmr: true,
		host: '0.0.0.0',
		port: 5554,
		fs: {
			allow: [workspaceRoot]
		}
	},
	build: { assetsDir: 'build', emptyOutDir: true }
});
