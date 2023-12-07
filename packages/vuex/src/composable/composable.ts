import '../types/vuex'

import type { Model, Repository } from '@rattus-orm/core'
import type { RattusContext } from '@rattus-orm/core/rattus-context'
import { pickFromClass } from '@rattus-orm/utils/pickFromClass'
import { computedProxify } from '@rattus-orm/utils/vueComputedUtils'
import type { InjectionKey } from 'vue'
import { type Store, useStore } from 'vuex'

import type { ComputedPickedRepository, PickedRepository, RepositoryCustomKeys } from './types'
import { pullRepositoryGettersKeys, pullRepositoryKeys } from './types'

export function useRattusContext(injectKey?: InjectionKey<Store<any>>): RattusContext {
  const context = useStore(injectKey).$rattusContext
  if (!context) {
    throw new Error('[useRattusContext] rattus context not found. Did you use plugin correctly?')
  }

  return context
}

export function useRepository<
  T extends typeof Model,
  CK extends RepositoryCustomKeys<R>,
  R extends Repository<InstanceType<T>> = Repository<InstanceType<T>>,
>(model: T, pullCustomKeys: CK[] = [], injectKey?: InjectionKey<Store<any>>): PickedRepository<T, R, CK> {
  const repository = useRattusContext(injectKey).$repo(model) as R

  const combinedKeys = Array.from(new Set([...pullRepositoryKeys, ...pullCustomKeys]))

  return pickFromClass(repository, combinedKeys) as PickedRepository<T, R, CK>
}

export function useRepositoryComputed<
  T extends typeof Model,
  CK extends RepositoryCustomKeys<R>,
  R extends Repository<InstanceType<T>> = Repository<InstanceType<T>>,
>(model: T, pullCustomKeys: CK[] = [], injectKey?: InjectionKey<Store<any>>): ComputedPickedRepository<T, R, CK> {
  return computedProxify(
    useRepository<T, CK, R>(model, pullCustomKeys, injectKey),
    pullRepositoryGettersKeys,
  ) as unknown as ComputedPickedRepository<T, R, CK>
}
