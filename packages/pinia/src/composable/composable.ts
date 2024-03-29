import type { Model, Repository } from '@rattus-orm/core'
import { useRepositoryForDynamicContext } from '@rattus-orm/core/utils/integrationsHelpers'
import type { RattusContext } from '@rattus-orm/core/utils/rattus-context'
import type { UseComputedRepository } from '@rattus-orm/core/utils/vueComposableUtils'
import { computifyUseRepository } from '@rattus-orm/core/utils/vueComposableUtils'
import { getCurrentInstance, inject } from 'vue'

import { RattusOrmInjectionKey } from '../plugin/const'

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
  connection?: string,
): UseComputedRepository<R, M> {
  const repo = useRepositoryForDynamicContext<R, M>(useRattusContext, model, connection)
  return computifyUseRepository<R, M>(repo)
}
