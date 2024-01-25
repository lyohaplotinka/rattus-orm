import { DataProviderHelpers } from '@rattus-orm/core'
import type { DataProvider, Elements, ModulePath, SerializedStorage, State } from '@rattus-orm/core/utils/sharedTypes'

import { SignalStore } from './signal-store'

export class ReactSignalsDataProvider extends DataProviderHelpers implements DataProvider {
  protected readonly storesMap = new Map<string, SignalStore>()

  public delete(module: ModulePath, ids: string[]): void {
    this.getSignalStore(module).destroy(ids)
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

  public flush(module: ModulePath): void {
    this.getSignalStore(module).flush()
  }

  public getModuleState(module: ModulePath): State {
    return this.getSignalStore(module).getData()
  }

  public hasModule(module: ModulePath): boolean {
    return this.storesMap.has(this.getModulePathAsString(module))
  }

  public insert(module: ModulePath, records: Elements): void {
    this.getSignalStore(module).save(records)
  }

  public registerConnection(): void {
    // no need to register connection
  }

  public registerModule(path: ModulePath, initialState?: State): void {
    const storeId = this.getModulePathAsString(path)

    if (this.storesMap.has(storeId)) {
      return
    }

    const newStore = new SignalStore(initialState)
    this.storesMap.set(storeId, newStore)
  }

  public replace(module: ModulePath, records: Elements): void {
    this.getSignalStore(module).fresh(records)
  }

  public save(module: ModulePath, records: Elements): void {
    this.getSignalStore(module).save(records)
  }

  public update(module: ModulePath, records: Elements): void {
    this.getSignalStore(module).save(records)
  }

  protected getModulePathAsString(modulePath: ModulePath) {
    return ([] as string[]).concat(modulePath).join('/')
  }

  protected getSignalStore(modulePath: ModulePath) {
    const storeId = this.getModulePathAsString(modulePath)
    if (!this.storesMap.has(storeId)) {
      throw new Error(`[ReactSignalsDataProvider] store "${storeId}" does not exists`)
    }

    return this.storesMap.get(storeId)!
  }
}
