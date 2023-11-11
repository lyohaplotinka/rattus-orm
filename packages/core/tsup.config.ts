import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'rattus-orm-core': './src/index.ts',
    'object-data-provider': './src/object-data-provider.ts'
  },
  name: 'Rattus ORM: core',
  format: ['esm', 'cjs'],
  clean: true,
  splitting: false,
  minify: false,
  dts: {
    entry: {
      'rattus-orm-core': './src/index.ts',
      'object-data-provider': './src/object-data-provider.ts'
    },
  },
})
