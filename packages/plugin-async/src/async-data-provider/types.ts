import type { ModulePath, SerializedStorage, State } from '@rattus-orm/core'

import type { QueryConstraintsWithActionAndPayload } from '../async-query/types'

export interface AsyncDataProvider<ConnectionParams> {
  /**
   * Register connection in your data storage
   * @param {string} name name of connection
   * @param {unknown} params
   */
  registerConnection(name: string, params: ConnectionParams): Promise<void>

  /**
   * Get all data from your data provider
   */
  dump(): Promise<SerializedStorage>

  /**
   * Set data to data provider
   * @param {SerializedStorage} data - data to set
   */
  restore(data: SerializedStorage): Promise<void>

  /**
   * Register module in your connection
   * @param {ModulePath} path tuple like [connection, <moduleName>]
   * @param {initialState} initialState optional initial module state
   */
  registerModule(path: ModulePath, initialState?: State): Promise<void>

  /**
   * Does specific module exist
   * @param {ModulePath} module tuple like [connection, <moduleName>]
   */
  hasModule(module: ModulePath): Promise<boolean>

  /**
   * Process query according to your data source
   * @param {QueryConstraintsWithActionAndPayload} constraints query action, payload and constraints
   */
  processQuery(constraints: QueryConstraintsWithActionAndPayload): Promise<unknown>
}
