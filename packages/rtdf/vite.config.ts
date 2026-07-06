import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import svgSymbol from '@any-tdf/vite-plugin-svg-symbol';
import { defineConfig } from 'vite';

const packageRoot = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		svgSymbol([
			{
				inFile: resolve(packageRoot, 'node_modules/@any-tdf/site-common/assets/svgs'),
				outFile: 'public/fonts',
				fileName: 'symbol',
				simple: false,
			},
		]),
	],
	resolve: {
		dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
	},
	server: {
		host: '0.0.0.0',
		port: 8887,
		fs: {
			allow: [packageRoot],
		},
	},
	build: {
		outDir: 'demo-dist',
	},
});
