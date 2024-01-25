import type { Repository } from '@rattus-orm/core'
import type { Model, Query } from '@rattus-orm/core'
import type { Collection, Item } from '@rattus-orm/core'
import type { UseRepository } from '@rattus-orm/core/utils/integrationsHelpers'
import type { ComputedRef } from 'vue'

export const pullRepositoryGettersKeys = ['find', 'all'] satisfies Array<keyof Repository>
export const pullRepositoryKeys = [
  'save',
  'insert',
  'fresh',
  'destroy',
  'flush',
  ...pullRepositoryGettersKeys,
] satisfies Array<keyof Repository>
export type RepositoryGettersKeys = (typeof pullRepositoryGettersKeys)[number]

export type UseComputedRepository<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model> = Omit<
  UseRepository<R>,
  RepositoryGettersKeys
> & {
  find: {
    (id: string | number): ComputedRef<Item<InstanceType<M>>>
    (ids: (string | number)[]): ComputedRef<Collection<InstanceType<M>>>
  }
  all: () => ComputedRef<ReturnType<R['all']>>
  withQuery: <R>(computedCb: (query: Query<InstanceType<M>>) => R) => ComputedRef<R>
}
