import type { Model, Repository } from '@rattus-orm/core'
import type { BehaviorSubject } from 'rxjs'

import { RattusBehaviorSubject } from './rattus-behavior-subject'

export type RxjsRepository<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model> = R & {
  observe<RT>(cb: (repo: R) => RT): BehaviorSubject<RT>
}

export function repoToRxjsRepository<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model>(
  repo: R,
): RxjsRepository<R> {
  if ('observe' in repo && typeof repo.observe === 'function') {
    return repo as RxjsRepository<R, M>
  }

  Object.defineProperty(repo, 'observe', {
    value: function <RT>(this: R, cb: (repo: R) => RT): BehaviorSubject<RT> {
      return new RattusBehaviorSubject<RT>(() => cb(this), this.database, this.model.$entity())
    },
  })

  return repo as RxjsRepository<R, M>
}
