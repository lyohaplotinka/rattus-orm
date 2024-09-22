import { Relation } from '@/attributes/classes/relations/relation'
import type { Model } from '@/model/Model'
import type {
  EagerLoad,
  EagerLoadConstraint,
  Order,
  OrderBy,
  OrderDirection,
  Where,
  WherePrimaryClosure,
  WhereSecondaryClosure,
} from '@/query/types'

export class Constraintor<M extends Model> {
  constructor(
    protected readonly model: M,
    protected eagerLoad: EagerLoad = {},
    protected skip: number = 0,
    protected take: number | null = null,
    protected orders: Order[] = [],
    protected wheres: Where[] = [],
  ) {}

  public clone(): Constraintor<M> {
    return new Constraintor(this.model, this.eagerLoad, this.skip, this.take, this.orders, this.wheres)
  }

  public where(field: WherePrimaryClosure | string, value?: WhereSecondaryClosure | any) {
    this.wheres.push({ field, value, boolean: 'and' })
  }

  public whereIn(field: string, values: any[]) {
    this.wheres.push({ field, value: values, boolean: 'and' })
  }

  public whereId(ids: string | number | (string | number)[]) {
    return this.where(this.model.$getKeyName() as any, ids)
  }

  public orWhere(field: WherePrimaryClosure | string, value?: WhereSecondaryClosure | any) {
    this.wheres.push({ field, value, boolean: 'or' })
  }

  public orderBy(field: OrderBy, direction: OrderDirection = 'asc') {
    this.orders.push({ field, direction })
  }

  public limit(value: number) {
    this.take = value
  }

  public offset(value: number) {
    this.skip = value
  }

  public with(name: string, callback: EagerLoadConstraint = () => {}) {
    this.eagerLoad[name] = callback
  }

  public withAll(callback: EagerLoadConstraint = () => {}) {
    for (const [name, value] of Object.entries(this.model.$fields())) {
      value instanceof Relation && this.with(name, callback)
    }
  }

  public withAllRecursive(depth: number = 3) {
    this.withAll((query) => {
      depth > 0 && query.withAllRecursive(depth - 1)
    })
  }
}
