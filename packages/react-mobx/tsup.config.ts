import createTsupConfig from '../../tsup.config.base'

export default createTsupConfig(
  {
    'rattus-orm-react-mobx-provider': './src/index.ts',
  },
  {
    skipNodeModulesBundle: true,
  },
)
