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

  /**
   * Creates and initializes a new database using the provided connection string and data provider.
   * If no default database exists, the newly created database is set as the default.
   * The newly created database is added to the database manager.
   *
   * @param {string} [connection='entities'] - The connection string used to create the database.
   * @return {Database} The newly created and initialized database object.
   */
  public createDatabase(connection = 'entities'): Database {
    const newDb = createDatabase({ connection, dataProvider: this.defaultDataProvider }).start()
    if (!this.hasDefaultDatabase()) {
      this.defaultDatabaseConnection = connection
    }

    this.databaseManager.addDatabase(newDb)
    return newDb
  }

  /**
   * Retrieves a repository instance for the specified model and connection parameters. If a repository
   * for the given model and connection is already cached, it returns the cached instance; otherwise,
   * it creates a new one, caches it, and then returns it.
   *
   * @param model The model class for which the repository needs to be retrieved.
   * @param connectionParam An optional parameter specifying the connection to use. If not provided, a default connection is used.
   * @return The repository instance for the specified model and connection.
   */
  public getRepository<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model>(
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

  /**
   * @deprecated will be removed in the next minor version, please use RattusContext.getRepository
   */
  public $repo<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model>(
    model: M,
    connectionParam?: string,
  ): R {
    return this.getRepository<R, M>(model, connectionParam)
  }

  /**
   * Retrieves the instance of the DatabaseManager.
   *
   * @return {DatabaseManager} The current instance of the DatabaseManager.
   */
  public getDatabaseManager(): DatabaseManager {
    return this.databaseManager
  }

  /**
   * Retrieves the Database instance associated with the provided connection parameter.
   *
   * @param {string} [connectionParam] - An optional parameter specifying the connection identifier to use. If not provided, the default connection will be used.
   * @return {Database} The Database instance associated with the specified or default connection.
   */
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

/**
 * Creates a new instance of RattusContext with the provided parameters.
 *
 * @param {RattusOrmInstallerOptions} params - The configuration options for creating the context, including database, connection, and custom repositories.
 * @param {DataProvider} [dataProvider] - An optional data provider for the context.
 * @return {RattusContext} An initialized RattusContext instance based on provided configurations.
 * @throws {RattusOrmError} If neither a dataProvider nor mainDatabase is provided.
 */
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
