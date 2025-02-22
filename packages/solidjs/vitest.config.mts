import solidPlugin from 'vite-plugin-solid'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    solidPlugin({
      babel: {
        plugins: ['@babel/plugin-syntax-explicit-resource-management'],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    fileParallelism: false,
    testTransformMode: { web: ['/.[jt]sx?$/'] },
  },
  optimizeDeps: {
    disabled: 'dev',
  },
  esbuild: {
    target: 'es2020',
    include: /\.(m?[jt]s|[jt]sx)$/,
    exclude: [],
  },
})
