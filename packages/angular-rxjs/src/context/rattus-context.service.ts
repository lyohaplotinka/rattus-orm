import { Inject, Injectable } from '@angular/core'
import type { Model, RattusOrmInstallerOptions, Repository } from '@rattus-orm/core'
import type { Database } from '@rattus-orm/core'
import { ObjectDataProvider } from '@rattus-orm/core/object-data-provider'
import type { RattusContext } from '@rattus-orm/core/utils/rattus-context'
import { createRattusContext } from '@rattus-orm/core/utils/rattus-context'

import { RATTUS_CONFIG } from '../const/const'
import type { RxjsRepository } from '../rxjs/repository-mixin'
import { repoToRxjsRepository } from '../rxjs/repository-mixin'
import type { DecoratedDatabase } from './types'

@Injectable({
  providedIn: 'root',
})
export class RattusContextService {
  protected readonly context: RattusContext

  constructor(@Inject(RATTUS_CONFIG) config?: RattusOrmInstallerOptions) {
    this.context = createRattusContext(config ?? {}, new ObjectDataProvider())
    const database = this.context.getDatabase()
    const decorated = this.decorateDatabase(database)
    this.context.getDatabaseManager().addDatabase(decorated as Database)
  }

  public getDatabase(connection?: string): DecoratedDatabase {
    return this.context.getDatabase(connection)
  }

  public createDatabase(connection: string): Database {
    const db = this.context.createDatabase(connection)
    const decoratedDb = this.decorateDatabase(db)
    return decoratedDb as Database
  }

  public getRepository<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model>(
    model: M,
    connection?: string,
  ): RxjsRepository<R, M> {
    const repo = this.context.$repo<R, M>(model, connection)
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
