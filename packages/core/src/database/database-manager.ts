import { RattusOrmError } from '@core-shared-utils/feedback'

import type { DataProvider } from '@/data/types'
import { createDatabase } from '@/database/create-database'
import type { Model } from '@/model/Model'
import type { Repository } from '@/repository/repository'
import { BaseManager } from '@/support/base-manager'
import { assert } from '@/support/utils'

import type { Database } from './database'

class DatabaseManager extends BaseManager<Database> {
  protected readonly repositoryCache = new Map<string, Repository>()
  protected defaultDataProvider: DataProvider | undefined
  protected defaultDatabaseConnection: string | undefined

  public createDatabase(connection = 'entities', dataProviderParam?: DataProvider): Database {
    const dataProvider = dataProviderParam || this.defaultDataProvider
    assert(!!dataProvider, ['Missing data provider in createDatabase'])

    const newDb = createDatabase({ connection, dataProvider }).start()
    this.addDatabase(newDb)
    return newDb
  }

  public addDatabase(database: Database) {
    if (!this.defaultDatabaseConnection) {
      this.defaultDatabaseConnection = database.getConnection()
      this.defaultDataProvider = database.getDataProvider()
    }

    return this.add(database.getConnection(), database)
  }

  public getRepository<
    R extends Repository<InstanceType<M>>,
    M extends typeof Model = typeof Model,
  >(model: M, connectionParam?: string): R {
    const connection = this.getConnectionToOperateWith(connectionParam)
    const repoCacheKey = this.getRepositoryCacheKey(connection, model)

    if (this.repositoryCache.has(repoCacheKey)) {
      return this.repositoryCache.get(repoCacheKey) as R
    }

    const database = this.getOrCreateDatabaseForConnection(connection)
    const repo = database.getRepository(model) as R
    this.repositoryCache.set(repoCacheKey, repo)

    return repo
  }

  public getDatabase(connectionParam?: string): Database {
    const connection = this.getConnectionToOperateWith(connectionParam)
    return this.get(connection)
  }

  public clear() {
    super.clear()
    this.defaultDataProvider = undefined
    this.defaultDatabaseConnection = undefined
    this.repositoryCache.clear()
  }

  protected getOrCreateDatabaseForConnection(connection: string) {
    if (this.has(connection)) {
      return this.get(connection)!
    }

    return this.createDatabase(connection)
  }

  protected hasDefaultDatabase() {
    return !!this.defaultDatabaseConnection
  }

  protected getConnectionToOperateWith(connectionParam: string | undefined): string {
    if (!connectionParam && !this.defaultDatabaseConnection) {
      throw new RattusOrmError('No database connection for desired operation', 'DatabaseManager')
    }
    return (connectionParam || this.defaultDatabaseConnection) as string
  }

  protected getRepositoryCacheKey(connection: string, model: typeof Model) {
    return `${connection}::${model.entity}`
  }
}

const databaseManagerSingleton = new DatabaseManager()

export const getDatabaseManager = () => databaseManagerSingleton
