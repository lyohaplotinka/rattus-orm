import createTsupConfig from '../../tsup.config.base'

export default createTsupConfig(
  {
    'rattus-orm-solidjs-provider': './src/index.ts',
  },
  {
    esbuildOptions: (options) => {
      options.jsx = 'preserve'
      options.jsxImportSource = 'solid-js'
    },
    outExtension({ format }) {
      return {
        js: `.${format}.jsx`,
      }
    },
  },
)
