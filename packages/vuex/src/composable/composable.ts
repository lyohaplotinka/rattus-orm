import type { Model, Repository } from '@rattus-orm/core'
import { useRepositoryForDynamicContext } from '@rattus-orm/core/utils/integrationsHelpers'
import type { UseComputedRepository } from '@rattus-orm/core/utils/vueComposableUtils'
import { computifyUseRepository } from '@rattus-orm/core/utils/vueComposableUtils'

export function useRepository<
  R extends Repository<InstanceType<M>>,
  M extends typeof Model = typeof Model,
>(model: M, connection?: string): UseComputedRepository<R, M> {
  const repo = useRepositoryForDynamicContext<R, M>(model, connection)
  return computifyUseRepository<R, M>(repo)
}
