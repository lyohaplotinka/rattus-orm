import type { Model, Query, Repository } from '@rattus-orm/core'
import { useRepositoryForDynamicContext } from '@rattus-orm/core/integrations-helpers'
import type { RattusContext } from '@rattus-orm/core/rattus-context'
import { computed, getCurrentInstance, inject } from 'vue'

import { RattusOrmInjectionKey } from '../plugin/const'
import type { UseComputedRepository } from './types'

export function useRattusContext(): RattusContext {
  let context = inject<RattusContext>(RattusOrmInjectionKey)
  if (!context) {
    const currentInstance = getCurrentInstance()
    if (!currentInstance) {
      throw new Error('[useRattusContext] cannot find current Vue instance')
    }
    context = currentInstance.appContext.config.globalProperties.$rattusContext
    if (!context) {
      throw new Error('[useRattusContext] rattus context not found. Did you use plugin correctly?')
    }
  }

  return context
}

export function useRepository<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model>(
  model: M,
): UseComputedRepository<R, M> {
  const repo = useRepositoryForDynamicContext<R, M>(useRattusContext, model)

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
