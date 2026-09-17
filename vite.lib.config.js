import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Package build: bundles src/main.js into dist/bundle.js + dist/bundle.css,
// the artifact consumer repos install and serve directly (see README).
export default defineConfig({
  plugins: [svelte()],
  define: {
    // If serving from a subpath (e.g. GitHub Pages project site) rather than
    // the domain root, set BASE_PATH when building: BASE_PATH=/maperture/ yarn build
    'process.env.BASE_PATH': JSON.stringify(process.env.BASE_PATH || '/'),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    sourcemap: true,
    lib: {
      entry: 'src/main.js',
      name: 'app',
      formats: ['es'],
      fileName: () => 'bundle.js',
    },
    rollupOptions: {
      output: {
        assetFileNames: 'bundle.[ext]',
      },
    },
  },
});
