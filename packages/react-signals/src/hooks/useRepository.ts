import type { Model, Repository } from '@rattus-orm/core'
import type { UseRepository } from '@rattus-orm/core/utils/integrationsHelpers'
import { useRepositoryForDynamicContext } from '@rattus-orm/core/utils/integrationsHelpers'

export function useRepository<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model>(
  model: M,
  connection?: string,
): UseRepository<R, M> {
  return useRepositoryForDynamicContext(model, connection)
}
