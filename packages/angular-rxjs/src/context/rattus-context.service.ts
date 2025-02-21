import { Inject, Injectable } from '@angular/core'
import type { Database, Model, Repository } from '@rattus-orm/core'
import { getDatabaseManager } from '@rattus-orm/core'
import { ObjectDataProvider } from '@rattus-orm/core/object-data-provider'
import type { RattusOrmInstallerOptions } from '@rattus-orm/core/utils/integrationsHelpers'
import { contextBootstrap } from '@rattus-orm/core/utils/integrationsHelpers'

import { RATTUS_CONFIG } from '../const/const'
import type { RxjsRepository } from '../rxjs/repository-mixin'
import { repoToRxjsRepository } from '../rxjs/repository-mixin'
import type { DecoratedDatabase } from './types'

@Injectable({
  providedIn: 'root',
})
export class RattusContextService {
  protected readonly databaseManager: any = getDatabaseManager()

  constructor(@Inject(RATTUS_CONFIG) config?: RattusOrmInstallerOptions) {
    const database = contextBootstrap(config ?? {}, new ObjectDataProvider())
    const decorated = this.decorateDatabase(database)
    this.databaseManager.addDatabase(decorated as Database)
  }

  public getDatabase(connection?: string): DecoratedDatabase {
    return this.databaseManager.getDatabase(connection)
  }

  public createDatabase(connection: string): Database {
    const db = this.databaseManager.createDatabase(connection)
    const decoratedDb = this.decorateDatabase(db)
    this.databaseManager.addDatabase(db)
    return decoratedDb as Database
  }

  public getRepository<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model>(
    model: M,
    connection?: string,
  ): RxjsRepository<R, M> {
    const repo = this.getDatabase(connection).getRepository<R, M>(model)
    return repoToRxjsRepository<R, M>(repo)
  }

  protected decorateDatabase(db: Database): DecoratedDatabase {
    const originalGetRepository = db.getRepository

    Object.defineProperty(db, 'getRepository', {
      value: function (...args: Parameters<typeof originalGetRepository>) {
        const repo = originalGetRepository.call(db, ...args)
        return repoToRxjsRepository(repo)
      },
    })

    return db
  }
}
