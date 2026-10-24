import devtoolsJson from "vite-plugin-devtools-json";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-bun";

export default defineConfig({
  plugins: [
    sveltekit({
      preprocess: vitePreprocess(),
      experimental: {
        remoteFunctions: true,
      },
      adapter: adapter(),
      alias: {
        "@/*": "./path/to/lib/*",
      },
      compilerOptions: {
        experimental: {
          async: true,
        },
      },
    }),
    devtoolsJson(),
    tailwindcss(),
  ],
  build: {
    cssMinify: "esbuild",
    minify: "esbuild",
  },
  esbuild: {
    platform: "node",
    supported: {
      "dynamic-import": true,
    },
  },
});
