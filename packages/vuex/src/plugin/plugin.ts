import '../types/vuex'

import type { Database } from '@rattus-orm/core'
import { DatabaseBuilder, Repository } from '@rattus-orm/core'
import type { Plugin, Store } from 'vuex'

import { VuexDataProvider } from '../data-provider/vuex-data-provider'

export interface InstallOptions {
  namespace?: string
}

type FilledInstallOptions = Required<InstallOptions>

/**
 * Install Vuex ORM to the store.
 */
export function install(options?: InstallOptions): Plugin<any> {
  return (store) => {
    mixin(store, createOptions(options))
  }
}

/**
 * Create options by merging the given user-provided options.
 */
function createOptions(options: InstallOptions = {}): FilledInstallOptions {
  return {
    namespace: options.namespace ?? 'entities',
  }
}

/**
 * Mixin Vuex ORM feature to the store.
 */
function mixin(store: Store<any>, options: FilledInstallOptions): void {
  createDatabase(store, options)

  mixinRepoFunction(store)

  startDatabase(store)
}

/**
 * Create a new database and connect to the store.
 */
function createDatabase(store: Store<any>, options: FilledInstallOptions): Database {
  const database = new DatabaseBuilder().dataProvider(VuexDataProvider).connection(options.namespace).run()

  store.$database = database

  if (!store.$databases) {
    store.$databases = {}
  }

  store.$databases[database.getConnection()] = database

  return database
}

/**
 * Start the database.
 */
function startDatabase(store: Store<any>): void {
  store.$database.start()
}

/**
 * Mixin repo function to the store.
 */
function mixinRepoFunction(store: Store<any>): void {
  store.$repo = function (modelOrRepository: any, connection?: string): any {
    let database: Database

    if (connection) {
      if (!(connection in store.$databases)) {
        database = createDatabase(store, { namespace: connection })
        database.start()
      } else {
        database = store.$databases[connection]
      }
    } else {
      database = store.$database
    }

    const repository = modelOrRepository._isRepository
      ? new modelOrRepository(database).initialize()
      : new Repository(database).initialize(modelOrRepository)

    try {
      database.register(repository.getModel())
    } catch (e) {
    } finally {
      return repository
    }
  }
}
