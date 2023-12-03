import type { Elements } from '@rattus-orm/utils/sharedTypes'

import type { Model } from '@/model/Model'
import type { RecordKeysByValueType } from '@/types'

export type Item<M extends Model = Model> = M | null

export type Collection<M extends Model = Model> = M[]

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

export type Entities = Record<string, Elements>
