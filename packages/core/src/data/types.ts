import type { Model } from '@/model/Model'

export type Element = Record<string, any>

export interface Elements {
  [id: string]: Element
}

export interface NormalizedData {
  [entity: string]: Elements
}

export type Item<M extends Model = Model> = M | null

export type Collection<M extends Model = Model> = M[]
export type ModulePath = string | string[]

export interface DataProvider<StorageType extends Record<string, any> = DataProviderStorage> {
  // basics
  registerModule(path: ModulePath, initialState?: State): void
  getState(module: ModulePath): State
  fill(data: StorageType): void

  // mutations
  save(module: ModulePath, records: Elements): void
  insert(module: ModulePath, records: Elements): void
  fresh(module: ModulePath, records: Elements): void
  update(module: ModulePath, records: Elements): void
  destroy(module: ModulePath, ids: string[]): void
  delete(module: ModulePath, ids: string[]): void
  flush(module: ModulePath): void
}

export type DataProviderStorage = {
  [connection: string]: RootState
}

export type State = {
  data: Elements
}

export type RootState = {
  [entity: string]: State
}
