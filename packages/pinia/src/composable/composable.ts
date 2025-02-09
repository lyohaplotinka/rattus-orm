import type { Model, Repository } from '@rattus-orm/core'
import { RattusOrmError } from '@rattus-orm/core/utils/feedback'
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
      throw new RattusOrmError('Cannot find current Vue instance', 'useRattusContext')
    }
    context = currentInstance.appContext.config.globalProperties.$rattusContext
    if (!context) {
      throw new RattusOrmError('Rattus context not found. Did you use plugin correctly?', 'useRattusContext')
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
