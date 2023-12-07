import { RattusContext } from '@rattus-orm/core/rattus-context'
import type { RattusOrmInstallerOptions } from '@rattus-orm/utils/sharedTypes'
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
      const { connection = 'entities', pinia } = options ?? {}

      const globalProperties = app._context.config.globalProperties

      const piniaInstance = pinia ?? globalProperties.$pinia
      if (!piniaInstance) {
        throw new Error(
          '[Rattus ORM Pinia Vue plugin] Pinia instance not found. ' +
            'Please call "app.use(pinia)" BEFORE using this plugin, or pass the Pinia instance ' +
            'as the second argument to the plugin function',
        )
      }

      if (!globalProperties.$pinia) {
        app.use(piniaInstance)
      }

      if (!globalProperties.$rattusContext) {
        const context = new RattusContext(new PiniaDataProvider(piniaInstance))
        context.createDatabase(connection, true)
        globalProperties.$rattusContext = context
      }

      app.provide(RattusOrmInjectionKey, globalProperties.$rattusContext)
    },
  }
}
