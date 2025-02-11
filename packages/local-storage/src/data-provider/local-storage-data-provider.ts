import type { DataProvider, Elements, ModulePath, SerializedStorage, State } from '@rattus-orm/core'
import { DataProviderHelpers } from '@rattus-orm/core'
import { RattusOrmError } from '@rattus-orm/core/utils/feedback'

import { LocalStorageStore } from './local-storage-store'

export class LocalStorageDataProvider extends DataProviderHelpers implements DataProvider {
  protected readonly modules = new Map<string, LocalStorageStore>()

  public dump(): SerializedStorage {
    const result: SerializedStorage = {}

    for (const storeId of this.modules.keys()) {
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

  public getModuleState(module: ModulePath): State {
    return this.getLocalStorageStore(module).getData()
  }

  public hasModule(module: ModulePath): boolean {
    return this.modules.has(this.getModulePathAsString(module))
  }

  public save(module: ModulePath, records: Elements): void {
    this.getLocalStorageStore(module).save(records)
  }

  public insert(module: ModulePath, records: Elements): void {
    this.getLocalStorageStore(module).save(records)
  }

  public replace(module: ModulePath, records: Elements): void {
    this.getLocalStorageStore(module).fresh(records)
  }

  public update(module: ModulePath, records: Elements): void {
    this.getLocalStorageStore(module).save(records)
  }

  public delete(module: ModulePath, ids: string[]): void {
    this.getLocalStorageStore(module).destroy(ids)
  }

  public flush(module: ModulePath): void {
    this.getLocalStorageStore(module).flush()
  }

  public registerConnection(): void {
    // no need to register connection
  }

  public registerModule(path: ModulePath, initialState?: State): void {
    const storeId = this.getModulePathAsString(path)

    if (this.modules.has(storeId)) {
      return
    }

    const newStore = new LocalStorageStore(path, initialState)
    this.modules.set(storeId, newStore)
  }

  protected getModulePathAsString(modulePath: ModulePath) {
    return modulePath.join('/')
  }

  protected getLocalStorageStore(modulePath: ModulePath) {
    const storeId = this.getModulePathAsString(modulePath)
    if (!this.modules.has(storeId)) {
      throw new RattusOrmError(`store "${storeId}" does not exists`, 'LocalStorageDataProvider')
    }

    return this.modules.get(storeId)!
  }
}
