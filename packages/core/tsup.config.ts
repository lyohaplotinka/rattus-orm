import createTsupConfig from '../../tsup.config.base'

export default createTsupConfig(
  {
    'rattus-orm-core': './src/index.ts',
    'object-data-provider': './src/object-data-provider.ts',
    'rattus-context': './src/rattus-context.ts',
  },
  {
    splitting: true,
  },
)
