import type { Model } from '@/model/Model'
import type { RecordKeysByValueType } from '@/types'

export type Item<M extends Model = Model> = M | null

export type Collection<M extends Model = Model> = M[]

export type RawModel<T extends Model> = Omit<
  T,
  keyof Model | RecordKeysByValueType<T, (...args: any) => any> | RecordKeysByValueType<T, Model>
> & {
  [key in RecordKeysByValueType<T, Model>]?: T[key] extends Model ? RawModel<T[key]> : never
}

export type ModulePath = [connection: string, module: string]
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

export type Entities = Record<string, Elements>

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
