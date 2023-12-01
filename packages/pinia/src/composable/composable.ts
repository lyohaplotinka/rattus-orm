import type { Model, Repository } from '@rattus-orm/core'
import { pickFromClass } from '@rattus-orm/utils/pickFromClass'
import { computedProxify } from '@rattus-orm/utils/vueComputedUtils'
import { getCurrentInstance, inject } from 'vue'

import { RattusOrmInjectionKey } from '../plugin/const'
import type { RattusContext } from '../types/pinia'
import type { ComputedPickedRepository, PickedRepository, RepositoryCustomKeys } from './types'
import { pullRepositoryGettersKeys, pullRepositoryKeys } from './types'

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

export function useRepository<
  T extends typeof Model,
  CK extends RepositoryCustomKeys<R>,
  R extends Repository<InstanceType<T>> = Repository<InstanceType<T>>,
>(model: T, pullCustomKeys: CK[] = []): PickedRepository<T, R, CK> {
  const context = useRattusContext()
  const repository = context.$repo(model) as R

  const combinedKeys = Array.from(new Set([...pullRepositoryKeys, ...pullCustomKeys]))

  return pickFromClass(repository, combinedKeys) as PickedRepository<T, R, CK>
}

export function useRepositoryComputed<
  T extends typeof Model,
  CK extends RepositoryCustomKeys<R>,
  R extends Repository<InstanceType<T>> = Repository<InstanceType<T>>,
>(model: T, pullCustomKeys: CK[] = []): ComputedPickedRepository<T, R, CK> {
  return computedProxify(
    useRepository<T, CK, R>(model, pullCustomKeys),
    pullRepositoryGettersKeys,
  ) as unknown as ComputedPickedRepository<T, R, CK>
}
