import createTsupConfig from '../../tsup.config.base'

export default createTsupConfig(
  {
    'rattus-orm-vuex-provider': './src/index.ts',
  },
  {
    external: ['vue', 'vuex', '@vue/reactivity', '@rattus-orm/utils'],
  },
)
