import { isUnknownRecord } from '@core-shared-utils/isUnknownRecord'

import { DataProviderHelpers } from './data-provider-helpers'
import type { DataProvider, Elements, ModulePath, SerializedStorage, State } from './types'

export class ObjectDataProvider extends DataProviderHelpers implements DataProvider {
  protected storage: SerializedStorage = {}

  public delete(module: ModulePath, ids: string[]): void {
    const moduleStore = this.getModuleByPath(module)
    for (const id of ids) {
      delete moduleStore.data[id]
    }
  }

  public flush(module: ModulePath): void {
    const moduleStore = this.getModuleByPath(module)
    moduleStore.data = {}
  }

  public replace(module: ModulePath, records: Elements): void {
    const moduleStore = this.getModuleByPath(module)
    moduleStore.data = records
  }

  public getModuleState(module: ModulePath): State {
    return this.getModuleByPath(module)
  }

  public insert(module: ModulePath, records: Elements): void {
    this.internalSave(module, records)
  }

  public registerConnection(name: string) {
    if (isUnknownRecord(this.storage[name])) {
      return
    }
    this.storage[name] = {}
  }

  public registerModule(path: ModulePath, initialState: State = { data: {} }): void {
    if (this.hasModule(path)) {
      return
    }

    const [connection, moduleName] = path
    this.storage[connection][moduleName] = initialState
    this.markModuleAsRegistered(path)
  }

  public hasModule(module: ModulePath): boolean {
    return this.isModuleRegistered(module)
  }

  public save(module: ModulePath, records: Elements): void {
    this.internalSave(module, records)
  }

  public update(module: ModulePath, records: Elements): void {
    this.internalSave(module, records)
  }

  public dump(): SerializedStorage {
    return JSON.parse(JSON.stringify(this.storage))
  }

  public restore(data: SerializedStorage) {
    super.restore(data)
  }

  protected getModuleByPath([connection, module]: ModulePath): State {
    const connectionState = this.storage[connection]
    return connectionState[module] ?? { data: {} }
  }

  protected internalSave(module: ModulePath, records: Elements) {
    const moduleStore = this.getModuleByPath(module)
    moduleStore.data = {
      ...moduleStore.data,
      ...records,
    }
  }
}
