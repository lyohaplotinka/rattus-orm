import type { ComputedRef } from 'vue'
import { computed } from 'vue'

import type { Collection, Item, Model, Query, Repository } from '../src'
import { type UseRepository } from './integrationsHelpers'

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

export function computifyUseRepository<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model>(
  repo: UseRepository<R, M>,
): UseComputedRepository<R, M> {
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
