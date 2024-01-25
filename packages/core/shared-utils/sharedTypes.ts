import type { Repository } from '@/repository/repository'

export type Constructor<T, Args extends any[] = any[]> = new (...args: Args) => T
export type Callback<P extends any[] = [], R = void> = (...args: P) => R

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

export interface DatabaseLike {
  setDataProvider(provider: DataProvider): this
  start(): void
}

export type DatabasePlugin<DB> = (database: DB) => void

export type RattusOrmInstallerOptions<DB> = {
  connection?: string
  database?: DatabaseLike
  plugins?: DatabasePlugin<DB>[]
  customRepositories?: Constructor<Repository>[]
}
