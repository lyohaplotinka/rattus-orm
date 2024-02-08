import {
  type DataProvider,
  DataProviderHelpers,
  type Elements,
  type ModulePath,
  type SerializedStorage,
  type State,
} from '@rattus-orm/core'

import { SolidStore } from '../solidjs/solid-store'

export class SolidjsDataProvider extends DataProviderHelpers implements DataProvider {
  protected readonly storesMap = new Map<string, SolidStore>()

  public delete(module: ModulePath, ids: string[]): void {
    this.getSolidStore(module).destroy(ids)
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
    this.getSolidStore(module).flush()
  }

  public getModuleState(module: ModulePath): State {
    return this.getSolidStore(module).data
  }

  public hasModule(module: ModulePath): boolean {
    return this.storesMap.has(this.getModulePathAsString(module))
  }

  public insert(module: ModulePath, records: Elements): void {
    this.getSolidStore(module).save(records)
  }

  public registerConnection(): void {
    // no need to register connection
  }

  public registerModule(path: ModulePath, initialState?: State): void {
    const storeId = this.getModulePathAsString(path)

    if (this.storesMap.has(storeId)) {
      return
    }

    const newStore = new SolidStore(initialState)
    this.storesMap.set(storeId, newStore)
  }

  public replace(module: ModulePath, records: Elements): void {
    this.getSolidStore(module).fresh(records)
  }

  public save(module: ModulePath, records: Elements): void {
    this.getSolidStore(module).save(records)
  }

  public update(module: ModulePath, records: Elements): void {
    this.getSolidStore(module).save(records)
  }

  protected getModulePathAsString(modulePath: ModulePath) {
    return modulePath.join('/')
  }

  protected getSolidStore(modulePath: ModulePath) {
    const storeId = this.getModulePathAsString(modulePath)
    if (!this.storesMap.has(storeId)) {
      throw new Error(`[SolidJsDataProvider] store "${storeId}" does not exists`)
    }

    return this.storesMap.get(storeId)!
  }
}
