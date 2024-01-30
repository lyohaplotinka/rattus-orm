import type { Model, Repository } from '../src'
import type { RattusContext } from '../src/context/rattus-context'
import { isFunction, isString } from '../src/support/utils'

const useRepositorySkippedKeys = ['database', 'use', 'model', 'constructor'] as const
type UseRepositorySkippedKeys = (typeof useRepositorySkippedKeys)[number]
const isSkippedKey = (value: unknown): value is UseRepositorySkippedKeys => {
  return isString(value) && useRepositorySkippedKeys.includes(value as UseRepositorySkippedKeys)
}

export type ContextRetriever = () => RattusContext
export type UseRepository<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model> = Omit<
  R,
  UseRepositorySkippedKeys
>

function getAllKeys<T extends Record<any, any>>(obj: T): Array<keyof T> {
  const keys = new Set<keyof T>()

  do {
    Object.getOwnPropertyNames(obj).forEach((key) => keys.add(key))
    Object.getOwnPropertySymbols(obj).forEach((sym) => keys.add(sym))
    obj = Object.getPrototypeOf(obj)
  } while (obj && obj !== Object.prototype)

  return Array.from(keys)
}

export function useRepositoryForDynamicContext<
  R extends Repository<InstanceType<M>>,
  M extends typeof Model = typeof Model,
>(contextRetriever: ContextRetriever, model: M): UseRepository<R> {
  const context = contextRetriever()
  const repo = context.$repo<R, M>(model)
  const allRepoKeys = getAllKeys(repo)
  const result = {} as UseRepository<R>

  for (const key of allRepoKeys) {
    if (isSkippedKey(key)) {
      continue
    }
    const repoValue = repo[key]

    if (isFunction(repoValue)) {
      result[key as string] = repoValue.bind(repo)
      continue
    }

    Object.defineProperty(repoValue, key, {
      get(): R[typeof key] {
        return repo[key]
      },
      set(v: any) {
        repo[key] = v
      },
    })
  }

  return result
}

export const pullRepositoryGettersKeys = ['find', 'all'] satisfies Array<keyof Repository>
export const pullRepositoryKeys = [
  'save',
  'insert',
  'fresh',
  'destroy',
  'flush',
  ...pullRepositoryGettersKeys,
] satisfies Array<keyof Repository>
export type RepositoryGettersKeys = (typeof pullRepositoryGettersKeys)[number]
