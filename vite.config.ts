import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from "@tailwindcss/vite"
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-node';


export default defineConfig({
	plugins: [
		sveltekit({
			preprocess: vitePreprocess(),
			experimental: {
				remoteFunctions: true
			},
			adapter: adapter({
				out: "build",
			}),
			alias: {
				"@/*": "./path/to/lib/*",
			},
			compilerOptions: {
				experimental: {
					async: true
				}
			}
		}),
		devtoolsJson(),
		tailwindcss()
	]
});
