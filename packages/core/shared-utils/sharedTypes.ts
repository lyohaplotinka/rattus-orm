import type { Database } from '@/database/database'
import type { Repository } from '@/repository/repository'

export type Constructor<T, Args extends any[] = any[]> = new (...args: Args) => T
export type Callback<P extends any[] = [], R = void> = (...args: P) => R

export type ModulePath = [connection: string, module: string]

// credits goes to https://stackoverflow.com/a/50375286
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

// Converts union to overloaded function
type UnionToOvlds<U> = UnionToIntersection<U extends any ? (f: U) => void : never>

type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true

// Finally me)
export type UnionToArray<T, A extends unknown[] = []> =
  IsUnion<T> extends true ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]> : [T, ...A]

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

export type DatabasePlugin<DB> = (database: DB) => void

export type RattusOrmInstallerOptions<DB> = {
  connection?: string
  database?: Database
  plugins?: DatabasePlugin<DB>[]
  customRepositories?: Constructor<Repository>[]
}
