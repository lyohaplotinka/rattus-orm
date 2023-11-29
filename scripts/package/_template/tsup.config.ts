// @ts-ignore
import createTsupConfig from '../../tsup.config.base'

export default createTsupConfig({
  'rattus-orm-{{ PACKAGE }}-provider': './src/index.ts',
})
