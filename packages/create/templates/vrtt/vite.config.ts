import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
/* RTDF_SVG_SYMBOL_IMPORT */

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		/* RTDF_SVG_SYMBOL_PLUGIN */
	],
});
