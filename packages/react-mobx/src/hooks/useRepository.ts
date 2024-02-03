import type { Model, Repository } from '@rattus-orm/core'
import type { UseRepository } from '@rattus-orm/core/utils/integrationsHelpers'
import { useRepositoryForDynamicContext } from '@rattus-orm/core/utils/integrationsHelpers'

import { useRattusContext } from './useRattusContext'

export function useRepository<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model>(
  model: M,
): UseRepository<R, M> {
  return useRepositoryForDynamicContext(useRattusContext, model)
}
