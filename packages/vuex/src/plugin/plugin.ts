import '../types/vuex'

import type { Model, Repository } from '@rattus-orm/core'
import { Database } from '@rattus-orm/core'
import type { Plugin, Store } from 'vuex'

import { VuexDataProvider } from '../data-provider/vuex-data-provider'

export interface InstallOptions {
  namespace?: string
}

type FilledInstallOptions = Required<InstallOptions>

export function installRattusORM(options?: InstallOptions): Plugin<any> {
  return (store) => {
    mixin(store, createOptions(options))
  }
}

function createOptions(options: InstallOptions = {}): FilledInstallOptions {
  return {
    namespace: options.namespace ?? 'entities',
  }
}

function mixin(store: Store<any>, options: FilledInstallOptions): void {
  createDatabase(store, options)

  mixinRepoFunction(store)

  startDatabase(store)
}

function createDatabase(store: Store<any>, options: FilledInstallOptions): Database {
  const database = new Database().setDataProvider(new VuexDataProvider(store)).setConnection(options.namespace)

  store.$database = database

  if (!store.$databases) {
    store.$databases = {}
  }

  store.$databases[database.getConnection()] = database

  return database
}

function startDatabase(store: Store<any>): void {
  store.$database.start()
}

function mixinRepoFunction(store: Store<any>): void {
  const storedRepos = new Map<string, Repository<any>>()

  store.$repo = function <T extends typeof Model>(model: T, connection?: string): Repository<InstanceType<T>> {
    if (storedRepos.has(model.entity)) {
      return storedRepos.get(model.entity) as Repository<InstanceType<T>>
    }

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

    const repo = database.getRepository(model)
    storedRepos.set(model.entity, repo)

    return repo
  }
}
