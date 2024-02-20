import '../types/vuex'

import type { Model, Repository } from '@rattus-orm/core'
import { isInitializedContext, useRepositoryForDynamicContext } from '@rattus-orm/core/utils/integrationsHelpers'
import type { RattusContext } from '@rattus-orm/core/utils/rattus-context'
import type { UseComputedRepository } from '@rattus-orm/core/utils/vueComposableUtils'
import { computifyUseRepository } from '@rattus-orm/core/utils/vueComposableUtils'
import type { InjectionKey } from 'vue'
import { type Store, useStore } from 'vuex'

export function useRattusContext(injectKey?: InjectionKey<Store<any>>): RattusContext {
  const context = useStore(injectKey).$rattusContext
  if (!isInitializedContext(context)) {
    throw new Error('[useRattusContext] rattus context not found. Did you use plugin correctly?')
  }

  return context
}

export function useRepository<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model>(
  model: M,
  connection?: string,
  injectKey?: InjectionKey<Store<any>>,
): UseComputedRepository<R, M> {
  const repo = useRepositoryForDynamicContext<R, M>(() => useRattusContext(injectKey), model, connection)
  return computifyUseRepository<R, M>(repo)
}
