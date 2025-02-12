import type { RattusOrmInstallerOptions } from '@rattus-orm/core/utils/integrationsHelpers'
import { contextBootstrap } from '@rattus-orm/core/utils/integrationsHelpers'
import type { Plugin } from 'vuex'

import { VuexDataProvider } from '../data-provider/vuex-data-provider'

export function installRattusORM(options?: RattusOrmInstallerOptions): Plugin<any> {
  return (store) => {
    contextBootstrap(options ?? { connection: 'entities' }, new VuexDataProvider(store))
  }
}
