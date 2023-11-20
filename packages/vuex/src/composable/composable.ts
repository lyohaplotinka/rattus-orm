import '../types/vuex'

import type { Model, Repository } from '@rattus-orm/core'
import { isUnknownRecord } from '@rattus-orm/core'
import type { ComputedGetter, DebuggerOptions } from '@vue/reactivity'
import type { InjectionKey } from 'vue'
import { computed } from 'vue'
import type { Store } from 'vuex'
import { useStore } from 'vuex'

import type { ComputedPickedRepository, ComputedRefExtended, PickedRepository, RepositoryCustomKeys } from './types'
import { pullRepositoryGettersKeys, pullRepositoryKeys } from './types'

function extendedComputed<T = any>(getter: ComputedGetter<T>, debugOptions?: DebuggerOptions): ComputedRefExtended<T> {
  const ref = computed<T>(getter, debugOptions)

  Object.defineProperties(ref, {
    filter: {
      value: (...args: Parameters<typeof Array.prototype.filter>) => {
        if (!Array.isArray(ref.value)) {
          throw new TypeError('[extendedComputed] Unable to filter by computed value: it is not an array')
        }
        return ref.value.filter(...args)
      },
    },
  })

  return ref as ComputedRefExtended<T>
}

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

function computedProxify<T extends Record<any, any>>(object: T, keysToProxify: string[]): T {
  return new Proxy(object, {
    get: (target: any, p: string): any => {
      if (keysToProxify.includes(p)) {
        return (...args: any[]) => {
          return extendedComputed(() => object[p](...args))
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
  return computedProxify(
    useRepository<T, CK, R>(model, pullCustomKeys, injectKey),
    pullRepositoryGettersKeys,
  ) as unknown as ComputedPickedRepository<T, R, CK>
}
