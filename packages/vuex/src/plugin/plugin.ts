import '../types/vuex'

import { RattusContext } from '@rattus-orm/core/rattus-context'
import type { RattusOrmInstallerOptions } from '@rattus-orm/utils/sharedTypes'
import type { Plugin } from 'vuex'

import { VuexDataProvider } from '../data-provider/vuex-data-provider'

export function installRattusORM(options?: RattusOrmInstallerOptions): Plugin<any> {
  return (store) => {
    store.$rattusContext = new RattusContext(new VuexDataProvider(store))
    store.$rattusContext.createDatabase(options?.connection ?? 'entities', true)
  }
}
