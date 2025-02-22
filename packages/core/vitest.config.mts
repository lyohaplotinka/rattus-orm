import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@func-test': path.resolve(__dirname, '../../test'),
      '@core-shared-utils': path.resolve(__dirname, './shared-utils'),
    },
  },
  esbuild: {
    target: 'es2022',
    include: /\.(m?[jt]s|[jt]sx)$/,
    exclude: [],
  },
})
