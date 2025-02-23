import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [viteReact()],
  test: {
    globals: true,
    environment: 'jsdom',
    fileParallelism: false,
    name: 'react-signals:local',
  },
  esbuild: {
    target: 'es2020',
    include: /\.(m?[jt]s|[jt]sx)$/,
    exclude: [],
  },
})
