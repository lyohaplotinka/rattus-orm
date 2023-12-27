import type { Model } from '@rattus-orm/core'
import type { Repository } from '@rattus-orm/core'
import { pickFromClass } from '@rattus-orm/utils/pickFromClass'

import type { PickedRepository, RepositoryCustomKeys } from './types'
import { pullRepositoryKeys } from './types'
import { useRattusContext } from './useRattusContext'

export function useRepository<
  T extends typeof Model,
  CK extends RepositoryCustomKeys<R>,
  R extends Repository<InstanceType<T>> = Repository<InstanceType<T>>,
>(model: T, pullCustomKeys: CK[] = []): PickedRepository<T, R, CK> {
  const repo = useRattusContext().$repo(model) as R
  const combinedKeys = Array.from(new Set([...pullRepositoryKeys, ...pullCustomKeys]))

  return pickFromClass(repo, combinedKeys) as PickedRepository<T, R, CK>
}
