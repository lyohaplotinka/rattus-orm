import type { Collection, Element, Elements, Item } from '@/data/types'
import type { Model } from '@/model/Model'

import type { Query } from './query'

export interface Where {
  field: WherePrimaryClosure | string
  value: WhereSecondaryClosure | any
  boolean: 'and' | 'or'
}

export type WherePrimaryClosure = (model: any) => boolean

export type WhereSecondaryClosure = (value: any) => boolean

export interface WhereGroup {
  and?: Where[]
  or?: Where[]
}

export interface Order {
  field: OrderBy
  direction: OrderDirection
}

export type OrderBy = string | ((model: any) => any)

export type OrderDirection = 'asc' | 'desc'

export interface EagerLoad {
  [name: string]: EagerLoadConstraint
}

export type EagerLoadConstraint = (query: Query) => void

export interface QueryInterface<
  M extends Model,
  InsertionType = M,
  SingleItemType = Item<M>,
  MultiItemType = Collection<M>,
> {
  find: {
    (id: string | number): SingleItemType
    (ids: (string | number)[]): MultiItemType
  }
  revive: {
    (schema: Element[]): MultiItemType
    (schema: Element): SingleItemType
  }
  save: {
    (records: Element[]): InsertionType[]
    (record: Element): InsertionType
  }
  insert: {
    (records: Element[]): MultiItemType
    (record: Element): SingleItemType
  }
  fresh: {
    (records: Element[]): MultiItemType
    (record: Element): SingleItemType
  }
  destroy: {
    (ids: (string | number)[]): MultiItemType
    (id: string | number): SingleItemType
  }
  new: () => InsertionType
  all(): MultiItemType
  get(): MultiItemType
  first(): SingleItemType
  findIn(ids: (string | number)[]): MultiItemType
  select(): MultiItemType
  load(models: Collection<M>): MultiItemType
  reviveOne(schema: Element): SingleItemType
  reviveMany(schema: Element[]): MultiItemType
  saveElements(elements: Elements): unknown
  update(record: Element): MultiItemType
  delete(): InsertionType[]
  flush(): MultiItemType
}
