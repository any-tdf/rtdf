import terser from '@rollup/plugin-terser';

export default {
	input: 'src/index.js',
	output: [{ file: 'dist/index.js', format: 'es', banner: '#!/usr/bin/env node' }],
	external: ['node:child_process', 'node:path', 'node:url', 'fs-extra', '@clack/prompts', 'kleur/colors', 'minimist', 'pacote'],
	plugins: [terser()],
};
