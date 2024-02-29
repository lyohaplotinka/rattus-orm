import { defineConfig } from 'vitest/config'
import { vitePluginTypescriptTransform } from './vite-plugin/index.mjs';

export default defineConfig({
  plugins: [
    // need this because esbuild cannot handle ES2023 decorators
    vitePluginTypescriptTransform({ enforce: 'pre' })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    fileParallelism: false,
  },
})
