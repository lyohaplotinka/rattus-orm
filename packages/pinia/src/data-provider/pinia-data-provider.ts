import type { DataProvider, Elements, ModulePath, SerializedStorage, State } from '@rattus-orm/core'
import { DataProviderHelpers } from '@rattus-orm/core'
import { type Pinia, defineStore } from 'pinia'

import type { OrmActionsTree, OrmGettersTree, OrmStoreDefinition } from './types'

export class PiniaDataProvider extends DataProviderHelpers implements DataProvider {
  protected readonly storesMap = new Map<string, OrmStoreDefinition>()

  constructor(protected readonly piniaInstance: Pinia) {
    super()
  }

  public delete(module: ModulePath, ids: string[]): void {
    this.commit(module, 'destroy', ids)
  }

  public flush(module: ModulePath): void {
    this.commit(module, 'flush')
  }

  public replace(module: ModulePath, records: Elements): void {
    this.commit(module, 'fresh', records)
  }

  public getModuleState(module: ModulePath): State {
    return {
      data: this.useModuleStore(module).data,
    }
  }

  public insert(module: ModulePath, records: Elements): void {
    this.commit(module, 'save', records)
  }

  public registerConnection() {
    // no need to register connection
  }

  public registerModule(path: ModulePath, initialState?: State): void {
    const storeId = this.getModulePathAsString(path)

    if (this.storesMap.has(storeId)) {
      return
    }

    const newStore = this.createPiniaStore(storeId, initialState)
    this.storesMap.set(storeId, newStore)
  }

  public save(module: ModulePath, records: Elements): void {
    this.commit(module, 'save', records)
  }

  public update(module: ModulePath, records: Elements): void {
    this.commit(module, 'save', records)
  }

  public hasModule(module: ModulePath): boolean {
    const storeId = this.getModulePathAsString(module)
    return this.storesMap.has(storeId)
  }

  public dump(): SerializedStorage {
    const result: SerializedStorage = {}

    for (const storeId of this.storesMap.keys()) {
      const modulePath = storeId.split('/') as ModulePath
      const [connection, moduleName] = modulePath
      if (!result[connection]) {
        result[connection] = {
          [moduleName]: this.getModuleState(modulePath),
        }
        continue
      }
      result[connection][moduleName] = this.getModuleState(modulePath)
    }

    return result
  }

  protected getModulePathAsString(modulePath: ModulePath) {
    return ([] as string[]).concat(modulePath).join('/')
  }

  protected createPiniaStore(storeId: string, initialState?: State) {
    return defineStore<string, State, OrmGettersTree, OrmActionsTree>(storeId, {
      state: () => initialState ?? { data: {} },
      getters: {
        getStateData: (state) => state.data,
      },
      actions: {
        save(records: Elements) {
          this.data = { ...this.data, ...records }
        },
        fresh(records: Elements) {
          this.data = records
        },
        destroy(ids: string[]) {
          const data: Record<string, any> = {}

          for (const id in this.data) {
            if (!ids.includes(id)) {
              data[id] = this.data[id]
            }
          }

          this.data = data
        },
        flush() {
          this.data = {}
        },
      },
    })
  }

  protected commit(
    module: ModulePath,
    action: 'save' | 'fresh' | 'destroy' | 'flush',
    payload?: any,
  ) {
    return this.useModuleStore(module)[action](payload)
  }

  protected useModuleStore(path: ModulePath) {
    const storeId = this.getModulePathAsString(path)
    if (!this.storesMap.has(storeId)) {
      throw new Error(`[PiniaDataProvider] store "${storeId}" does not exists`)
    }
    const store = this.storesMap.get(storeId)!
    return store(this.piniaInstance)
  }
}
