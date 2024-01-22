import createTsupConfig from '../../tsup.config.base'

export default createTsupConfig(
  {
    'rattus-orm-core': './src/index.ts',
    'object-data-provider': './src/object-data-provider.ts',
    'rattus-context': './src/rattus-context.ts',
    'integrations-helpers': './src/integrations-helpers.ts',
  },
  {
    splitting: true,
  },
)
