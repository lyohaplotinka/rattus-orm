import '../types/vuex'

import type { Database } from '@rattus-orm/core'
import { createRattusContext } from '@rattus-orm/core/rattus-context'
import type { RattusOrmInstallerOptions } from '@rattus-orm/core/utils/sharedTypes'
import type { Plugin } from 'vuex'

import { VuexDataProvider } from '../data-provider/vuex-data-provider'

export function installRattusORM(options?: RattusOrmInstallerOptions<Database>): Plugin<any> {
  return (store) => {
    store.$rattusContext = createRattusContext(options ?? { connection: 'entities' }, new VuexDataProvider(store))
  }
}
