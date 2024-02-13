import type { Database, Model, Repository } from '@rattus-orm/core'

import type { RxjsRepository } from '../rxjs/repository-mixin'

export type DecoratedDatabase = Omit<Database, 'getRepository'> & {
  getRepository<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model>(
    model: M,
  ): RxjsRepository<R>
}
