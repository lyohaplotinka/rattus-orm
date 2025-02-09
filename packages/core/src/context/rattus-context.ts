import { RattusOrmError } from '../../shared-utils/feedback'
import { isDataProvider } from '../data/guards'
import type { DataProvider } from '../data/types'
import { createDatabase } from '../database/create-database'
import { Database } from '../database/database'
import type { DatabaseManager } from '../database/database-manager'
import { databaseManager } from '../database/database-manager'
import type { Model } from '../model/Model'
import type { Repository } from '../repository/repository'
import type { RattusOrmInstallerOptions } from './types'

export class RattusContext {
  protected readonly databaseManager: DatabaseManager = databaseManager
  protected readonly repositoryCache = new Map<string, Repository>()
  protected readonly defaultDataProvider: DataProvider
  protected defaultDatabaseConnection: string | undefined

  constructor(dataProvider: DataProvider)
  constructor(mainDatabase: Database)
  constructor(arg: DataProvider | Database) {
    if (isDataProvider(arg)) {
      this.defaultDataProvider = arg
    } else if (arg instanceof Database) {
      this.defaultDataProvider = arg.getDataProvider()
      this.defaultDatabaseConnection = arg.getConnection()
      this.databaseManager.addDatabase(arg)
    }
  }

  public createDatabase(connection = 'entities'): Database {
    const newDb = createDatabase({ connection, dataProvider: this.defaultDataProvider }).start()
    if (!this.hasDefaultDatabase()) {
      this.defaultDatabaseConnection = connection
    }

    this.databaseManager.addDatabase(newDb)
    return newDb
  }

  public $repo<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model>(
    model: M,
    connectionParam?: string,
  ): R {
    const connection = this.getConnectionToOperateWith(connectionParam)
    const repoCacheKey = this.getRepositoryCacheKey(connection, model)

    if (this.repositoryCache.has(repoCacheKey)) {
      return this.repositoryCache.get(repoCacheKey) as R
    }

    const database = this.getDatabaseForConnection(connection)
    const repo = database.getRepository(model) as R
    this.repositoryCache.set(repoCacheKey, repo)

    return repo
  }

  public getDatabaseManager(): DatabaseManager {
    return this.databaseManager
  }

  public getDatabase(connectionParam?: string): Database {
    const connection = this.getConnectionToOperateWith(connectionParam)
    return this.databaseManager.get(connection)
  }

  protected getDatabaseForConnection(connection: string) {
    if (this.databaseManager.has(connection)) {
      return this.databaseManager.get(connection)!
    }

    return this.createDatabase(connection)
  }

  protected hasDefaultDatabase() {
    return !!this.defaultDatabaseConnection
  }

  protected getConnectionToOperateWith(connectionParam: string | undefined): string {
    if (!connectionParam && !this.defaultDatabaseConnection) {
      throw new RattusOrmError('No database connection for desired operation', 'RattusContext')
    }
    return (connectionParam || this.defaultDatabaseConnection) as string
  }

  protected getRepositoryCacheKey(connection: string, model: typeof Model) {
    return `${connection}::${model.entity}`
  }
}

function registerCustomRepos(db: Database, repos: RattusOrmInstallerOptions['customRepositories'] = []) {
  for (const repo of repos) {
    db.registerCustomRepository(repo)
  }
}

export function createRattusContext(params: RattusOrmInstallerOptions, dataProvider?: DataProvider): RattusContext {
  if (params.database) {
    registerCustomRepos(params.database, params.customRepositories)
    return new RattusContext(params.database)
  }

  if (!isDataProvider(dataProvider)) {
    throw new RattusOrmError(
      'No dataProvider and mainDatabase passed to context. You should pass at least one of them.',
      'CreateRattusContext',
    )
  }

  const context = new RattusContext(dataProvider)
  const db = context.createDatabase(params.connection)
  registerCustomRepos(db, params.customRepositories)

  if (params.plugins?.length) {
    params.plugins.forEach((plugin) => db.use(plugin))
  }

  return context
}
