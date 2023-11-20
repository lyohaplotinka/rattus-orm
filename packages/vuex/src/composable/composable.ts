import '../types/vuex'

import type { Model, Repository } from '@rattus-orm/core'
import { isUnknownRecord } from '@rattus-orm/core'
import type { InjectionKey } from 'vue'
import { computed } from 'vue'
import type { Store } from 'vuex'
import { useStore } from 'vuex'

import type { ComputedPickedRepository, PickedRepository, RepositoryCustomKeys } from './types'
import { pullRepositoryGettersKeys, pullRepositoryKeys } from './types'

function pickFromClass<T, K extends keyof T>(instance: T, keys: K[]): Pick<T, K> {
  return keys.reduce<Pick<T, K>>(
    (result, currentKey) => {
      if (!isUnknownRecord(instance) || !(currentKey in instance)) {
        throw new Error(`[pickFromClass] key "${String(currentKey)}" not found in instance`)
      }

      const value = instance[currentKey]
      result[currentKey] = typeof value === 'function' ? value.bind(instance) : value

      return result
    },
    {} as Pick<T, K>,
  )
}

function computedProxify<T extends Record<any, any>>(object: T, keysToProxify: string[]) {
  return new Proxy(object, {
    get: (target: any, p: string): any => {
      if (keysToProxify.includes(p)) {
        return (...args: any[]) => {
          return computed(() => target[p](...args))
        }
      }

      return target[p]
    },
  })
}

export function useRepository<
  T extends typeof Model,
  CK extends RepositoryCustomKeys<R>,
  R extends Repository<InstanceType<T>> = Repository<InstanceType<T>>,
>(model: T, pullCustomKeys: CK[] = [], injectKey?: InjectionKey<Store<any>>): PickedRepository<T, R, CK> {
  const store = useStore(injectKey)
  const repository = store.$repo(model) as R

  const combinedKeys = Array.from(new Set([...pullRepositoryKeys, ...pullCustomKeys]))

  return pickFromClass(repository, combinedKeys) as PickedRepository<T, R, CK>
}

export function useRepositoryComputed<
  T extends typeof Model,
  CK extends RepositoryCustomKeys<R>,
  R extends Repository<InstanceType<T>> = Repository<InstanceType<T>>,
>(model: T, pullCustomKeys: CK[] = [], injectKey?: InjectionKey<Store<any>>): ComputedPickedRepository<T, R, CK> {
  const picked = useRepository<T, CK, R>(model, pullCustomKeys, injectKey)
  const query = function (): ReturnType<typeof picked.query> {
    const result = picked.query()
    return result as any
    // const result = picked.query()
    // return computedProxify(result, pullRepositoryGettersKeys)
  }

  return {
    ...computedProxify(picked, pullRepositoryGettersKeys),
    query,
  }
}
