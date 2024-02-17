import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte';


export default defineConfig({
  plugins: [
    svelte({ hot: false })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    fileParallelism: false,
  }
})
