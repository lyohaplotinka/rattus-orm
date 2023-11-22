import type { Model } from '@/model/Model'
import type { RecordKeysByValueType } from '@/types'

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

export interface DataProvider {
  // basics
  registerModule(path: ModulePath, initialState?: State): void
  getState(module: ModulePath): State

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

export type RawModel<
  T extends Model,
  PK extends string = 'id',
  PKV extends string | number | string[] | number[] = string,
> = Omit<T, keyof Model | RecordKeysByValueType<T, (...args: any) => any>> & { [key in PK]: PKV }

export type RawModelWithRelations<
  T extends Model,
  PK extends string = 'id',
  PKV extends string | number | string[] | number[] = string,
> = {
  [key in keyof RawModel<T, PK, PKV>]: RawModel<T, PK, PKV>[key] extends Model
    ? RawModelWithRelations<RawModel<T, PK, PKV>[key], PK, PKV>
    : RawModel<T, PK, PKV>[key]
}
