import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const externalPackages = [/^react($|\/)/, /^react-dom($|\/)/, /^@any-tdf\/common($|\/)/, /^tailwindcss($|\/)/];

export default defineConfig({
	publicDir: false,
	plugins: [react()],
	build: {
		outDir: 'dist',
		emptyOutDir: true,
		lib: {
			entry: {
				index: resolve(__dirname, 'src/lib/index.ts'),
				'components/index': resolve(__dirname, 'src/lib/components/index.ts'),
				'types/index': resolve(__dirname, 'src/lib/types/index.ts'),
				'theme/index': resolve(__dirname, 'src/lib/theme/index.ts'),
				'theme/plugin': resolve(__dirname, 'src/lib/theme/plugin.ts'),
				'theme/runtime': resolve(__dirname, 'src/lib/theme/runtime.ts'),
				'svg/index': resolve(__dirname, 'src/lib/svg/index.ts'),
				'lang/index': resolve(__dirname, 'src/lib/lang/index.ts'),
				'components/utils/index': resolve(__dirname, 'src/lib/components/utils/index.ts'),
			},
			formats: ['es'],
		},
		rollupOptions: {
			external: externalPackages,
			output: {
				entryFileNames: '[name].js',
				chunkFileNames: 'chunks/[name]-[hash].js',
			},
		},
	},
});
