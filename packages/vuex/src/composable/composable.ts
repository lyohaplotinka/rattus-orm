import '../types/vuex'

import type { Model, Query, Repository } from '@rattus-orm/core'
import { useRepositoryForDynamicContext } from '@rattus-orm/core/integrations-helpers'
import type { RattusContext } from '@rattus-orm/core/rattus-context'
import { computed, type InjectionKey } from 'vue'
import { type Store, useStore } from 'vuex'

import type { UseComputedRepository } from './types'

export function useRattusContext(injectKey?: InjectionKey<Store<any>>): RattusContext {
  const context = useStore(injectKey).$rattusContext
  if (!context) {
    throw new Error('[useRattusContext] rattus context not found. Did you use plugin correctly?')
  }

  return context
}

export function useRepository<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model>(
  model: M,
  injectKey?: InjectionKey<Store<any>>,
): UseComputedRepository<R, M> {
  const repo = useRepositoryForDynamicContext<R, M>(() => useRattusContext(injectKey), model)

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
