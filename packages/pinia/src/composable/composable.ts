import type { Model, Repository } from '@rattus-orm/core'
import { isUnknownRecord } from '@rattus-orm/core'
import { computed, type ComputedGetter, type DebuggerOptions, getCurrentInstance, inject } from 'vue'

import { RattusOrmInjectionKey } from '../plugin/const'
import type { RattusContext } from '../types/pinia'
import type { ComputedPickedRepository, ComputedRefExtended, PickedRepository, RepositoryCustomKeys } from './types'
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
