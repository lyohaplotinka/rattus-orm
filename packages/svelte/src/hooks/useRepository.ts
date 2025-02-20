import type { Collection, Database, Item, Model, Query, Repository } from '@rattus-orm/core'
import { RattusEvents } from '@rattus-orm/core'
import type { RepositoryGettersKeys, UseRepository } from '@rattus-orm/core/utils/integrationsHelpers'
import { useRepositoryForDynamicContext } from '@rattus-orm/core/utils/integrationsHelpers'
import type { Readable } from 'svelte/store'
import { get } from 'svelte/store'
import { readable } from 'svelte/store'

import { useDatabase } from './useDatabase'

type SvelteComputed<R> = Readable<R> & {
  value: R
}

export type UseComputedRepository<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model> = Omit<
  UseRepository<R>,
  RepositoryGettersKeys
> & {
  find: {
    (id: string | number): SvelteComputed<Item<InstanceType<M>>>
    (ids: (string | number)[]): SvelteComputed<Collection<InstanceType<M>>>
  }
  all: () => SvelteComputed<ReturnType<R['all']>>
  withQuery: <R>(computedCb: (query: Query<InstanceType<M>>) => R) => SvelteComputed<R>
}

function computed<R>(cb: () => R, database: Database, modelEntity: string): SvelteComputed<R> {
  const readableStore = readable(cb(), (set) => {
    return database.on(RattusEvents.DATA_CHANGED, (_data, [connection, entity]) => {
      if (database.getConnection() !== connection || entity !== modelEntity) {
        return
      }
      set(cb())
    })
  })

  Object.defineProperty(readableStore, 'value', {
    get(): R {
      return get(this)
    },
  })

  return readableStore as SvelteComputed<R>
}

export function useRepository<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model>(
  model: M,
  connection?: string,
): UseComputedRepository<R, M> {
  const repo = useRepositoryForDynamicContext(model, connection)
  const db = useDatabase()

  return {
    ...repo,
    find(ids: any) {
      return computed(() => repo.find(ids), db, model.entity)
    },
    all() {
      return computed(() => repo.all(), db, model.entity)
    },
    withQuery<R>(cb: (query: Query<InstanceType<M>>) => R) {
      return computed(() => cb(repo.query()), db, model.entity)
    },
  } as unknown as UseComputedRepository<R, M>
}
