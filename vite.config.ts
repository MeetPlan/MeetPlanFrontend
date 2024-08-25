import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default {
    optimizeDeps: { exclude: ["svelte-routing"] },
    plugins: [
        svelte({}),
        viteCompression(),
    ],
};