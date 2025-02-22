import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    fileParallelism: false,
  },
  esbuild: {
    target: 'es2022',
    include: /\.(m?[jt]s|[jt]sx)$/,
    exclude: [],
  },
})
