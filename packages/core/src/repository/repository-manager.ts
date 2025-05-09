import { RattusOrmError } from '@core-shared-utils/feedback'

import type { Database } from '@/database/database'
import type { Model } from '@/model/Model'
import type { Constructor } from '@/types'

import { Repository } from './repository'

export class RepositoryManager {
  protected readonly repoConstructors = new Map<string, Constructor<Repository<any>>>([
    ['*', Repository],
  ])

  public addRepositoryConstructor<T extends Repository>(
    repoCtor: Constructor<T, ConstructorParameters<typeof Repository>>,
    database: Database,
  ) {
    const repoInstance = new repoCtor(database)
    if (!repoInstance.use) {
      throw new RattusOrmError(
        'Custom repositories should have public "use" property with related model',
      )
    }
    const entity = repoInstance.use.entity
    this.repoConstructors.set(entity, repoCtor)
  }

  public getRepositoryCtorForModel<T extends Constructor<Repository>, M extends typeof Model>(
    model: M,
  ): T {
    if (this.repoConstructors.has(model.entity)) {
      return this.repoConstructors.get(model.entity) as T
    }

    return this.repoConstructors.get('*') as T
  }
}
