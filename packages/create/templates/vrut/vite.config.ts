import react from '@vitejs/plugin-react';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
/* RTDF_SVG_SYMBOL_IMPORT */

export default defineConfig({
	plugins: [
		UnoCSS(),
		react(),
		/* RTDF_SVG_SYMBOL_PLUGIN */
	],
});
