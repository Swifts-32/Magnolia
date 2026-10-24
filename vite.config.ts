import devtoolsJson from "vite-plugin-devtools-json";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-node";

export default defineConfig({
  plugins: [
    sveltekit({
      preprocess: vitePreprocess(),
      experimental: {
        remoteFunctions: true,
      },
      adapter: adapter(),
      paths: {
        origin: "http://localhost:3000",
      },
      alias: {
        "@/*": "./path/to/lib/*",
      },
      compilerOptions: {
        experimental: {
          async: true,
        },
      },
      csrf: {
        trustedOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],
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
