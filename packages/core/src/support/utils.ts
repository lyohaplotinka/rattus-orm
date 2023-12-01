/**
 * Check if the given value is the type of null.
 */
export function isNull(value: any): value is null {
  return value === null
}

/**
 * Check if the given value is the type of undefined or null.
 */
export function isNullish(value: any): value is undefined | null {
  return value === undefined || isNull(value)
}

/**
 * Check if the given value is the type of array.
 */
export function isArray(value: any): value is any[] {
  return Array.isArray(value)
}

/**
 * Check if the given value is the type of array.
 */
export function isFunction<T, Ags extends any[] = any[]>(value: any): value is (...args: Ags) => T {
  return typeof value === 'function'
}

export const isString = (value: unknown): value is string => {
  return typeof value === 'string'
}

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number'
}

/**
 * Check if the given array or object is empty.
 */
export function isEmpty(collection: any[] | object): boolean {
  return size(collection) === 0
}

/**
 * Gets the size of collection by returning its length for array-like values
 * or the number of own enumerable string keyed properties for objects.
 */
export function size(collection: any[] | object): number {
  return (isArray(collection) ? collection : Object.keys(collection)).length
}

/**
 * Creates an object composed of keys generated from the results of running
 * each element of collection through iteratee.
 */
export function groupBy<T>(collection: T[], iteratee: (record: T) => string): { [key: string]: T[] } {
  return collection.reduce((records, record) => {
    const key = iteratee(record)
    records[key] ? records[key].push(record) : (records[key] = [record])
    return records
  }, {})
}

/**
 * Deep clone the given target object.
 */
export function cloneDeep<T extends object>(target: T): T {
  return JSON.parse(JSON.stringify(target))
}

/**
 * Asserts that the condition is truthy, throwing immediately if not.
 */
export function assert(condition: boolean, message: string[]): asserts condition {
  if (!condition) {
    throw new Error(['[Rattus ORM]'].concat(message).join(' '))
  }
}
