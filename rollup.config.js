import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import replace from "@rollup/plugin-replace";
import del from "rollup-plugin-delete";
import gzipPlugin from 'rollup-plugin-gzip';

const production = !process.env.ROLLUP_WATCH;
const tauri = process.env.TAURI;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'esm',
		name: 'app',
		dir: 'public/build'
	},
	plugins: [
		del({targets: [
			"public/build/*.js",
			"public/build/*.js.map",
			"public/build/*.js.gz",
			"public/build/*.css.gz",
		]}),

		gzipPlugin({additionalFiles: ["public/build/smui.css", "public/build/smui-dark.css"]}),

		replace({
			isProduction: production,
			isTauriApp: tauri === "true",
		}),

		svelte({
			preprocess: sveltePreprocess({ sourceMap: !production }),
			compilerOptions: {
				// disable sourcemap to save some more space
				sourcemap: !production,
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production,
			rootDir: "./src",
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		// TODO: Not include this delay
		!production && livereload({watch: 'public', delay: 25000,}),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
