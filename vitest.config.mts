import * as path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
    include: ['./test/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './packages/core/src'),
      '@func-test': path.resolve(__dirname, './test'),
      '@core-shared-utils': path.resolve(__dirname, './packages/core/shared-utils'),
      '@scripts': path.resolve(__dirname, './scripts/built'),
    },
  },
  esbuild: {
    target: 'es2022',
    include: /\.(m?[jt]s|[jt]sx)$/,
    exclude: [],
  },
})
