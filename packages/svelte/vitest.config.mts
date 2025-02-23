import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
  plugins: [svelte({ compilerOptions: { hmr: false } })],
  test: {
    globals: true,
    environment: 'jsdom',
    fileParallelism: false,
    name: 'svelte:local',
  },
  esbuild: {
    target: 'es2020',
    include: /\.(m?[jt]s|[jt]sx)$/,
    exclude: [],
  },
  resolve: {
    conditions: mode === 'test' ? ['browser'] : [],
  },
}))
