import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Dev-server config: serves ./index.html + src/main.js with HMR.
export default defineConfig({
  plugins: [svelte()],
  define: {
    // Mirrors vite.lib.config.js's define so App.svelte's
    // `process.env.BASE_PATH` reference resolves the same way in dev as it
    // does in a real build (always '/' here, since dev always serves from
    // the root).
    'process.env.BASE_PATH': JSON.stringify('/'),
  },
});
