import type { DataProvider, RattusOrmInstallerOptions } from '@core-shared-utils/sharedTypes'

import { isDataProvider } from '../data/guards'
import { Database } from '../database/database'
import type { Model } from '../model/Model'
import type { Repository } from '../repository/repository'

export class RattusContext {
  /**
   * instance of first (main) database
   * @type Database
   * @public
   */
  public $database: Database

  public $databases: Record<string, Database> = {}
  protected storedRepos = new Map<string, Repository>()
  protected readonly dataProvider: DataProvider

  /**
   * Create context with DataProvider passed
   *
   * @param {DataProvider} dataProvider chosen DataProvider
   */
  constructor(dataProvider: DataProvider)
  /**
   * Create context with Database passed. DataProvider will be inferred
   * from database.
   *
   * @param {DataProvider} mainDatabase main database in context
   */
  constructor(mainDatabase: Database)
  constructor(dataProviderOrDatabase: DataProvider | Database) {
    if (dataProviderOrDatabase instanceof Database) {
      this.dataProvider = dataProviderOrDatabase.getDataProvider()
      this.$database = dataProviderOrDatabase
      this.$databases[dataProviderOrDatabase.getConnection()] = dataProviderOrDatabase
    } else if (isDataProvider(dataProviderOrDatabase)) {
      this.dataProvider = dataProviderOrDatabase
    } else {
      throw new Error(
        '[RattusContext] no dataProvider and mainDatabase passed to context. You should pass at least one of them.',
      )
    }
  }

  /**
   * Create database, save it in context and return.
   *
   * @param {string} connection connection name for new database
   * @param {Boolean} isPrimary should new database become "main" database
   */
  public createDatabase(connection: string = 'entities', isPrimary = false): Database {
    const newDb = new Database().setConnection(connection).setDataProvider(this.dataProvider)
    newDb.start()

    if (isPrimary && !this.$database) {
      this.$database = newDb
    }
    this.$databases[connection] = newDb

    return newDb
  }

  /**
   * Get repository for model from database from specific connection
   *
   * @param {Model} model model for which a repository is needed
   * @param {string} [connection] database connection name
   * @returns {R extends Repository} Repository instance (or custom if generic argument passed)
   */
  public $repo<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model>(
    model: M,
    connection?: string,
  ): R {
    if (this.storedRepos.has(model.entity)) {
      return this.storedRepos.get(model.entity) as R
    }

    let localDb: Database

    if (connection) {
      if (!(connection in this.$databases)) {
        localDb = this.createDatabase(connection, false)
        localDb.start()
      } else {
        localDb = this.$databases[connection]
      }
    } else {
      localDb = this.$database
    }

    const repo = localDb.getRepository<R>(model)
    this.storedRepos.set(model.entity, repo)

    return repo
  }
}

export function createRattusContext(
  params: RattusOrmInstallerOptions<Database>,
  dataProvider?: DataProvider,
): RattusContext {
  if (params.database) {
    for (const repo of params.customRepositories ?? []) {
      params.database.registerCustomRepository(repo)
    }

    return new RattusContext(params.database)
  }

  if (!isDataProvider(dataProvider)) {
    throw new Error(
      '[CreateRattusContext] no dataProvider and mainDatabase passed to context. You should pass at least one of them.',
    )
  }

  const context = new RattusContext(dataProvider)
  const db = context.createDatabase(params.connection, true)

  for (const repo of params.customRepositories ?? []) {
    db.registerCustomRepository(repo)
  }

  if (params.plugins?.length) {
    params.plugins.forEach((plugin) => db.use(plugin))
  }

  return context
}
