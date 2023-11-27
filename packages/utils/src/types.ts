export type Constructor<T> = T extends { constructor: (...args: infer P) => any }
  ? {
      new (...args: P): T
    }
  : never

export type ModulePath = [connection: string, module: string]

export interface DataProvider {
  // basics
  registerConnection(name: string): void
  dump(): SerializedStorage
  restore(data: SerializedStorage): void

  // modules
  registerModule(path: ModulePath, initialState?: State): void
  getModuleState(module: ModulePath): State
  hasModule(module: ModulePath): boolean

  // data operations
  save(module: ModulePath, records: Elements): void
  insert(module: ModulePath, records: Elements): void
  replace(module: ModulePath, records: Elements): void
  update(module: ModulePath, records: Elements): void
  delete(module: ModulePath, ids: string[]): void
  flush(module: ModulePath): void
}

export type SerializedStorage = {
  [connection: string]: Record<string, State>
}

export type State = {
  data: Elements
}

export type Element = Record<string, any>

export interface Elements {
  [id: string]: Element
}
