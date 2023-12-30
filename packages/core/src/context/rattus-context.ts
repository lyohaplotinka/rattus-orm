import type { DataProvider, RattusOrmInstallerOptions } from '@rattus-orm/utils/sharedTypes'

import { Database } from '../database/database'
import type { Model } from '../model/Model'
import type { Repository } from '../repository/repository'

export class RattusContext {
  public $database: Database
  public $databases: Record<string, Database> = {}
  protected storedRepos = new Map<string, Repository>()
  protected readonly dataProvider: DataProvider

  constructor(dataProvider?: DataProvider, mainDatabase?: Database) {
    if (mainDatabase) {
      this.dataProvider = mainDatabase.getDataProvider()
      this.$database = mainDatabase
      this.$databases[mainDatabase.getConnection()] = mainDatabase
    } else if (dataProvider) {
      this.dataProvider = dataProvider
    } else {
      throw new Error(
        '[RattusContext] no dataProvider and mainDatabase passed to context. You should pass at least one of them.',
      )
    }
  }

  public createDatabase(connection: string = 'entities', isPrimary = false) {
    const newDb = new Database().setConnection(connection).setDataProvider(this.dataProvider)
    newDb.start()

    if (isPrimary && !this.$database) {
      this.$database = newDb
    }
    this.$databases[connection] = newDb

    return newDb
  }

  public $repo<M extends typeof Model>(model: M, connection?: string): Repository<InstanceType<M>> {
    if (this.storedRepos.has(model.entity)) {
      return this.storedRepos.get(model.entity) as Repository<InstanceType<M>>
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

    const repo = localDb.getRepository(model)
    this.storedRepos.set(model.entity, repo)

    return repo
  }
}

export function createRattusContext(
  params: RattusOrmInstallerOptions<Database>,
  dataProvider?: DataProvider,
): RattusContext {
  if (params.database && params.database instanceof Database) {
    return new RattusContext(undefined, params.database)
  }
  const context = new RattusContext(dataProvider)
  context.createDatabase(params.connection, true)

  return context
}
