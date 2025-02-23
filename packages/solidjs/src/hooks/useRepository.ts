import type { Collection, Item, Model, Query, Repository } from '@rattus-orm/core'
import type {
  RepositoryGettersKeys,
  UseRepository,
} from '@rattus-orm/core/utils/integrationsHelpers'
import { useRepositoryForDynamicContext } from '@rattus-orm/core/utils/integrationsHelpers'
import type { Accessor } from 'solid-js'
import { createComputed, createSignal } from 'solid-js'

export type UseComputedRepository<
  R extends Repository<InstanceType<M>>,
  M extends typeof Model = typeof Model,
> = Omit<UseRepository<R>, RepositoryGettersKeys> & {
  find: {
    (id: string | number): Accessor<Item<InstanceType<M>>>
    (ids: (string | number)[]): Accessor<Collection<InstanceType<M>>>
  }
  all: () => Accessor<ReturnType<R['all']>>
  withQuery: <R>(computedCb: (query: Query<InstanceType<M>>) => R) => Accessor<R>
}

function computed<T>(cb: () => T): Accessor<T> {
  const [value, setter] = createSignal<T>(cb())

  createComputed(() => {
    const newValue = cb()
    setter(() => newValue)
  })

  Object.defineProperty(value, '__rattus__accessor', {
    writable: false,
    enumerable: false,
    value: true,
  })

  return value
}

export function useRepository<
  R extends Repository<InstanceType<M>>,
  M extends typeof Model = typeof Model,
>(model: M, connection?: string): UseComputedRepository<R, M> {
  const repo = useRepositoryForDynamicContext(model, connection)

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
  } as UseComputedRepository<R, M>
}
