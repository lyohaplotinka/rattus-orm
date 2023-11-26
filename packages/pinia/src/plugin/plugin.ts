import type { DataProvider, Model, Repository } from '@rattus-orm/core'
import { Database } from '@rattus-orm/core'
import type { Pinia } from 'pinia'
import type { Plugin } from 'vue'

import { PiniaDataProvider } from '../data-provider/pinia-data-provider'
import type { RattusContext } from '../types/pinia'
import { RattusOrmInjectionKey } from './const'

function createDatabase(connectionName: string, dataProvider: DataProvider): Database {
  const database = new Database().setConnection(connectionName).setDataProvider(dataProvider)
  database.start()

  return database
}

function createRattusContext(connectionName: string, pinia: Pinia): RattusContext {
  const dataProvider = new PiniaDataProvider(pinia)
  const database = createDatabase(connectionName, dataProvider)
  const databases = {
    [connectionName]: database,
  }

  const storedRepos = new Map<string, Repository<any>>()

  return {
    $database: database,
    $databases: databases,
    $repo<M extends typeof Model>(model: M, connection = connectionName): Repository<InstanceType<M>> {
      if (storedRepos.has(model.entity)) {
        return storedRepos.get(model.entity) as Repository<InstanceType<M>>
      }

      let localDb: Database

      if (connection) {
        if (!(connection in databases)) {
          localDb = createDatabase(connection, dataProvider)
          localDb.start()
        } else {
          localDb = databases[connection]
        }
      } else {
        localDb = database
      }

      const repo = localDb.getRepository(model)
      storedRepos.set(model.entity, repo)

      return repo
    },
  }
}

export const rattusOrmPiniaVuePlugin = (connectionName = 'entities', pinia?: Pinia): Plugin => {
  return {
    install(app) {
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
        globalProperties.$rattusContext = createRattusContext(connectionName, piniaInstance)
      }

      app.provide(RattusOrmInjectionKey, globalProperties.$rattusContext)
    },
  }
}
