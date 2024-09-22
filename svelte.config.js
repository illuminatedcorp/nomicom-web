import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import postcss from 'postcss';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({ postcss: true, typescript: true }),
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : ''
		},
		alias: {
			'@/*': './src/lib/*',
			$lib: resolve('./src/lib')
		}
	}
};

export default config;
