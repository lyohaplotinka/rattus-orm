import type { Database } from '@/database/database'
import type { Repository } from '@/repository/repository'

export type Constructor<T, Args extends any[] = any[]> = new (...args: Args) => T
export type Callback<P extends any[] = [], R = void> = (...args: P) => R

export type ModulePath = [connection: string, module: string]

// credits goes to https://stackoverflow.com/a/50375286
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

// Converts union to overloaded function
type UnionToOvlds<U> = UnionToIntersection<U extends any ? (f: U) => void : never>

type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true

// Finally me)
export type UnionToArray<T, A extends unknown[] = []> =
  IsUnion<T> extends true ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]> : [T, ...A]

export interface DataProvider {
  /**
   * Register connection in your data storage
   * @param {string} name name of connection
   */
  registerConnection(name: string): void
  /**
   * Get all data from your data provider
   */
  dump(): SerializedStorage
  /**
   * Set data to data provider
   * @param {SerializedStorage} data - data to set
   */
  restore(data: SerializedStorage): void

  /**
   * Register module in your connection
   * @param {ModulePath} path tuple like [connection, <moduleName>]
   * @param {initialState} initialState optional initial module state
   */
  registerModule(path: ModulePath, initialState?: State): void
  /**
   * Get state of specific module
   * @param {ModulePath} module tuple like [connection, <moduleName>]
   */
  getModuleState(module: ModulePath): State
  /**
   * Does specific module exist
   * @param {ModulePath} module tuple like [connection, <moduleName>]
   */
  hasModule(module: ModulePath): boolean

  /**
   * Save data
   * @param {ModulePath} module tuple like [connection, <moduleName>]
   * @param {Elements} records record like { [id: string]: Entity }
   */
  save(module: ModulePath, records: Elements): void
  /**
   * Insert data
   * @param {ModulePath} module tuple like [connection, <moduleName>]
   * @param {Elements} records record like { [id: string]: Entity }
   */
  insert(module: ModulePath, records: Elements): void
  /**
   * Replace part of data with new data
   * @param {ModulePath} module tuple like [connection, <moduleName>]
   * @param {Elements} records record like { [id: string]: Entity }
   */
  replace(module: ModulePath, records: Elements): void
  /**
   * Update part of data
   * @param {ModulePath} module tuple like [connection, <moduleName>]
   * @param {Elements} records record like { [id: string]: Entity }
   */
  update(module: ModulePath, records: Elements): void
  /**
   * Delete data
   * @param {ModulePath} module tuple like [connection, <moduleName>]
   * @param {string[]} ids primaryKey array of elements which will be deleted
   */
  delete(module: ModulePath, ids: string[]): void
  /**
   * Remove all data from module
   * @param {ModulePath} module tuple like [connection, <moduleName>]
   */
  flush(module: ModulePath): void
}

export type SerializedStorage = {
  [connection: string]: Record<string, State>
}

export type State = {
  data: Elements
}

export type Element = Record<string, any>

export interface Elements {
  [id: string]: Element
}

export type DatabasePlugin<DB> = (database: DB) => void

export type RattusOrmInstallerOptions<DB> = {
  connection?: string
  database?: Database
  plugins?: DatabasePlugin<DB>[]
  customRepositories?: Constructor<Repository>[]
}
