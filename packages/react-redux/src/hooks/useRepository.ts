import type { Model } from '@rattus-orm/core'
import type { Repository } from '@rattus-orm/core'
import { type UseRepository, useRepositoryForDynamicContext } from '@rattus-orm/core/utils/integrationsHelpers'

import { useRattusContext } from './useRattusContext'

export function useRepository<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model>(
  model: M,
): UseRepository<R, M> {
  return useRepositoryForDynamicContext(useRattusContext, model)
}
