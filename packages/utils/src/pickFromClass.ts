import { isUnknownRecord } from './isUnknownRecord'

export function pickFromClass<T, K extends keyof T>(instance: T, keys: K[]): Pick<T, K> {
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
