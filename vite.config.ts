import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import replace from "@rollup/plugin-replace";

const production = 'import.meta.env.PROD';
const tauri = process.env.TAURI;

// https://vitejs.dev/config/
export default {
    optimizeDeps: { exclude: ["svelte-navigator"] },
    plugins: [
        replace({
            isProduction: production,
            isTauriApp: tauri === "true",
        }),
        svelte()
    ],
};
