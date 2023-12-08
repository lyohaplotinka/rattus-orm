import '../types/vuex'

import { createRattusContext } from '@rattus-orm/core/rattus-context'
import type { RattusOrmInstallerOptions } from '@rattus-orm/utils/sharedTypes'
import type { Plugin } from 'vuex'

import { VuexDataProvider } from '../data-provider/vuex-data-provider'

export function installRattusORM(options?: RattusOrmInstallerOptions): Plugin<any> {
  return (store) => {
    store.$rattusContext = createRattusContext(options ?? { connection: 'entities' }, new VuexDataProvider(store))
  }
}
