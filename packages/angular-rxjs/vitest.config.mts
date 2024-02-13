import angular from '@analogjs/vite-plugin-angular'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  // @ts-ignore
  plugins: [angular.default()],
  test: {
    globals: true,
    setupFiles: ['test/setup-tests.ts'],
    environment: 'jsdom',
    include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    fileParallelism: false
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}))
