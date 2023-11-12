import type { DataProvider, DataProviderStorage, Elements, ModulePath, State } from '@/data/types'

export class ObjectDataProvider implements DataProvider {
  protected storage: DataProviderStorage = {}

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

  protected getModuleByPath(path: ModulePath): State {
    return ([] as string[]).concat(path).reduce<Record<string, any>>((result, key) => {
      if (!(key in result)) {
        return {}
      }
      return result[key]
    }, this.storage) as State
  }
}
