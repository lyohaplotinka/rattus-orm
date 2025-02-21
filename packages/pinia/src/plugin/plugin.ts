import { RattusOrmError } from '@rattus-orm/core/utils/feedback'
import type { RattusOrmInstallerOptions } from '@rattus-orm/core/utils/integrationsHelpers'
import { contextBootstrap } from '@rattus-orm/core/utils/integrationsHelpers'
import type { Pinia } from 'pinia'
import type { Plugin } from 'vue'

import { PiniaDataProvider } from '../data-provider/pinia-data-provider'
import { RattusOrmInjectionKey } from './const'

export type PiniaPluginOptions = RattusOrmInstallerOptions & {
  pinia?: Pinia
}

export function installRattusORM(options?: PiniaPluginOptions): Plugin {
  return {
    install(app) {
      const { connection = 'entities', pinia, database } = options ?? {}

      const globalProperties = app._context.config.globalProperties

      const piniaInstance = pinia ?? globalProperties.$pinia
      if (!piniaInstance) {
        throw new RattusOrmError(
          'Pinia instance not found. ' +
            'Please call "app.use(pinia)" BEFORE using this plugin, or pass the Pinia instance ' +
            'as the second argument to the plugin function',
          'Rattus ORM Pinia Vue plugin]',
        )
      }

      if (!globalProperties.$pinia) {
        app.use(piniaInstance)
      }

      contextBootstrap(
        {
          ...options,
          connection,
          database,
        },
        new PiniaDataProvider(piniaInstance),
      )

      app.provide(RattusOrmInjectionKey, globalProperties.$rattusContext)
    },
  }
}
