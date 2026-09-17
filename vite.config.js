import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Dev-server config: serves ./index.html + src/main.js with HMR.
export default defineConfig({
  plugins: [svelte()],
});
