import createTsupConfig from '../../tsup.config.base'

export default createTsupConfig(
  {
    'rattus-orm-react-redux-provider': './src/index.ts',
  },
  {
    external: ['react', 'redux'],
  },
)
