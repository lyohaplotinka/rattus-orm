import type { DataProvider, DataProviderStorage, Elements, ModulePath, State } from '@/data/types'
import { isUnknownRecord } from '@/support/utils'

export class ObjectDataProvider implements DataProvider<DataProviderStorage> {
  protected storage: DataProviderStorage = {}

  public fill(data: DataProviderStorage) {
    this.storage = data
  }

  public delete(module: ModulePath, ids: string[]): void {
    const moduleStore = this.getModuleByPath(module)
    for (const id of ids) {
      delete moduleStore.data[id]
    }
  }

  public destroy(module: ModulePath, ids: string[]): void {
    return this.delete(module, ids)
  }

  public flush(module: ModulePath): void {
    const moduleStore = this.getModuleByPath(module)
    moduleStore.data = {}
  }

  public fresh(module: ModulePath, records: Elements): void {
    const moduleStore = this.getModuleByPath(module)
    moduleStore.data = records
  }

  public getState(module: ModulePath): State {
    return this.getModuleByPath(module)
  }

  public insert(module: ModulePath, records: Elements): void {
    const moduleStore = this.getModuleByPath(module)
    moduleStore.data = {
      ...moduleStore.data,
      ...records,
    }
  }

  public registerModule(path: ModulePath, initialState: State = { data: {} }): void {
    if (typeof path === 'string') {
      if (this.storage[path]) {
        return
      }
      this.storage[path] = {}
      return
    }
    const lastSlug = path.pop() as string

    const module = this.getModuleByPath(path)
    if (module[lastSlug]) {
      return
    }
    module[lastSlug] = initialState
  }

  public save(module: ModulePath, records: Elements): void {
    return this.insert(module, records)
  }

  public update(module: ModulePath, records: Elements): void {
    return this.insert(module, records)
  }

  protected getModuleByPath(path: ModulePath, state: DataProviderStorage | State = this.storage): State {
    if (!Array.isArray(path)) {
      const module = state[path]
      if (!isUnknownRecord(module)) {
        throw new ReferenceError(`Module "${path}" not found`)
      }
      return state[path] as unknown as State
    }
    if (path.length === 1) {
      return this.getModuleByPath(path[0], state)
    }

    const pathCopy = path.slice()

    const slug = pathCopy.shift() as string
    if (!isUnknownRecord(state[slug])) {
      throw new ReferenceError(`Module "${slug}" not found`)
    }
    return this.getModuleByPath(pathCopy, state[slug])
  }
}
