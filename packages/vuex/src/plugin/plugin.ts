import '../types/vuex'

import type { RattusOrmInstallerOptions } from '@rattus-orm/core'
import { createRattusContext } from '@rattus-orm/core/utils/rattus-context'
import type { Plugin } from 'vuex'

import { VuexDataProvider } from '../data-provider/vuex-data-provider'

export function installRattusORM(options?: RattusOrmInstallerOptions): Plugin<any> {
  return (store) => {
    store.$rattusContext = createRattusContext(options ?? { connection: 'entities' }, new VuexDataProvider(store))
  }
}
