import type { DataProvider, Elements, ModulePath, State } from '@rattus-orm/core'
import { defineStore, type Pinia } from 'pinia'

import type { OrmActionsTree, OrmGettersTree, OrmStoreDefinition } from './types'

export class PiniaDataProvider implements DataProvider {
  protected readonly storesMap = new Map<string, OrmStoreDefinition>()

  constructor(protected readonly piniaInstance: Pinia) {}

  public delete(module: ModulePath, ids: string[]): void {
    this.commit(module, 'destroy', ids)
  }

  public destroy(module: ModulePath, ids: string[]): void {
    this.commit(module, 'destroy', ids)
  }

  public flush(module: ModulePath): void {
    this.commit(module, 'flush')
  }

  public fresh(module: ModulePath, records: Elements): void {
    this.commit(module, 'fresh', records)
  }

  public getState(module: ModulePath): State {
    return {
      data: this.useModuleStore(module).data,
    }
  }

  public insert(module: ModulePath, records: Elements): void {
    this.commit(module, 'save', records)
  }

  public registerModule(path: ModulePath, initialState?: State): void {
    const storeId = this.getModulePathAsString(path)
    const newStore = this.createPiniaStore(storeId, initialState)

    if (this.storesMap.has(storeId)) {
      return
    }
    this.storesMap.set(storeId, newStore)
  }

  public save(module: ModulePath, records: Elements): void {
    this.commit(module, 'save', records)
  }

  public update(module: ModulePath, records: Elements): void {
    this.commit(module, 'save', records)
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
          const data = {}

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

  protected commit(module: ModulePath, action: 'save' | 'fresh' | 'destroy' | 'flush', payload?: any) {
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
