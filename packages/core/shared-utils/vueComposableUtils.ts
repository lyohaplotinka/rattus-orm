import type { ComputedRef } from 'vue'
import { computed } from 'vue'

import type { Collection, Item, Model, Query, Repository } from '../src'
import type { RepositoryGettersKeys } from './integrationsHelpers'
import { type UseRepository } from './integrationsHelpers'
import { isUnknownRecord } from './isUnknownRecord'

export type UseComputedRepository<
  R extends Repository<InstanceType<M>>,
  M extends typeof Model = typeof Model,
> = Omit<UseRepository<R>, RepositoryGettersKeys> & {
  find: {
    (id: string | number): ComputedRef<Item<InstanceType<M>>>
    (ids: (string | number)[]): ComputedRef<Collection<InstanceType<M>>>
  }
  all: () => ComputedRef<ReturnType<R['all']>>
  withQuery: <R>(computedCb: (query: Query<InstanceType<M>>) => R) => ComputedRef<R>
}

export function computifyUseRepository<
  R extends Repository<InstanceType<M>>,
  M extends typeof Model = typeof Model,
>(repo: UseRepository<R, M>): UseComputedRepository<R, M> {
  return {
    ...repo,
    find(ids: any) {
      return computed(() => repo.find(ids))
    },
    all() {
      return computed(() => repo.all())
    },
    withQuery<R>(cb: (query: Query<InstanceType<M>>) => R) {
      return computed(() => cb(repo.query()))
    },
  } as unknown as UseComputedRepository<R, M>
}

export const isComputed = (value: unknown): value is ComputedRef<any> => {
  return isUnknownRecord(value) && 'effect' in value && 'value' in value
}
