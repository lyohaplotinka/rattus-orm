import {
  type DataProvider,
  DataProviderHelpers,
  type Elements,
  type ModulePath,
  type SerializedStorage,
  type State,
} from '@rattus-orm/core'

import MobxStore from '../mobx/mobx-store'

export class ReactMobxDataProvider extends DataProviderHelpers implements DataProvider {
  protected readonly storesMap = new Map<string, MobxStore>()

  public delete(module: ModulePath, ids: string[]): void {
    this.getMobxStore(module).destroy(ids)
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
    this.getMobxStore(module).flush()
  }

  public getModuleState(module: ModulePath): State {
    return this.getMobxStore(module).data
  }

  public hasModule(module: ModulePath): boolean {
    return this.storesMap.has(this.getModulePathAsString(module))
  }

  public insert(module: ModulePath, records: Elements): void {
    this.getMobxStore(module).save(records)
  }

  public registerConnection(): void {
    // no need to register connection
  }

  public registerModule(path: ModulePath, initialState?: State): void {
    const storeId = this.getModulePathAsString(path)

    if (this.storesMap.has(storeId)) {
      return
    }

    const newStore = new MobxStore(initialState)
    this.storesMap.set(storeId, newStore)
  }

  public replace(module: ModulePath, records: Elements): void {
    this.getMobxStore(module).fresh(records)
  }

  public save(module: ModulePath, records: Elements): void {
    this.getMobxStore(module).save(records)
  }

  public update(module: ModulePath, records: Elements): void {
    this.getMobxStore(module).save(records)
  }

  protected getModulePathAsString(modulePath: ModulePath) {
    return modulePath.join('/')
  }

  protected getMobxStore(modulePath: ModulePath) {
    const storeId = this.getModulePathAsString(modulePath)
    if (!this.storesMap.has(storeId)) {
      throw new Error(`[ReactMobxDataProvider] store "${storeId}" does not exists`)
    }

    return this.storesMap.get(storeId)!
  }
}
