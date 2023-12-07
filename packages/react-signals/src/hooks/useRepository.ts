import type { Model } from '@rattus-orm/core'
import { pickFromClass } from '@rattus-orm/utils/pickFromClass'

import { pullRepositoryKeys } from './types'
import { useRattusContext } from './useRattusContext'

export function useRepository<T extends typeof Model>(model: T) {
  const repo = useRattusContext().$repo(model)

  return pickFromClass(repo, pullRepositoryKeys)
}
