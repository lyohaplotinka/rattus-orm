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
