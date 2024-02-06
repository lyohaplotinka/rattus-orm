import type {
  Collection,
  Database,
  EagerLoad,
  EagerLoadConstraint,
  Element,
  Entities,
  Item,
  Model,
  NormalizationSchemaParam,
  Order,
  OrderBy,
  OrderDirection,
  WherePrimaryClosure,
} from '@rattus-orm/core'
import { Normalizer, Relation } from '@rattus-orm/core'
import { assert, isArray } from '@rattus-orm/core/utils/utils'

import { QueryActions } from './const'
import type { AsyncWhere, QueryAction, QueryConstraintsWithActionAndPayload } from './types'

export class AsyncQuery<M extends Model = Model> {
  constructor(
    protected readonly database: Database,
    protected readonly model: M,
    protected eagerLoad: EagerLoad = {},
    protected skip = 0,
    protected take: number | null = null,
    protected orders: Order[] = [],
    protected wheres: AsyncWhere[] = [],
  ) {}

  public newQuery(model: string): AsyncQuery<Model> {
    return new AsyncQuery(this.database, this.database.getModel(model))
  }

  public newQueryWithConstraints(model: string): AsyncQuery<Model> {
    return new AsyncQuery(
      this.database,
      this.database.getModel(model),
      this.eagerLoad,
      this.skip,
      this.take,
      this.orders,
      this.wheres,
    )
  }

  public newQueryForRelation(relation: Relation): AsyncQuery<Model> {
    return new AsyncQuery(this.database, relation.getRelated())
  }

  public where(field: WherePrimaryClosure | string, value: any): this {
    this.wheres.push({ field, value, boolean: 'and' })
    return this
  }

  public whereIn(field: string, values: any[]): this {
    this.wheres.push({ field, value: values, boolean: 'and' })
    return this
  }

  public whereId(ids: string | number | (string | number)[]): this {
    return this.where(this.model.$getKeyName() as any, ids)
  }

  public orWhere(field: WherePrimaryClosure | string, value: any): this {
    this.wheres.push({ field, value, boolean: 'or' })
    return this
  }

  public orderBy(field: OrderBy, direction: OrderDirection = 'asc'): this {
    this.orders.push({ field, direction })
    return this
  }

  public limit(value: number): this {
    this.take = value
    return this
  }

  public offset(value: number): this {
    this.skip = value
    return this
  }

  public with(name: string, callback: EagerLoadConstraint = () => {}): this {
    this.eagerLoad[name] = callback
    return this
  }

  public withAll(callback: EagerLoadConstraint = () => {}): this {
    for (const [name, value] of Object.entries(this.model.$fields())) {
      value instanceof Relation && this.with(name, callback)
    }
    return this
  }

  public withAllRecursive(depth: number = 3): this {
    this.withAll((query) => {
      depth > 0 && query.withAllRecursive(depth - 1)
    })
    return this
  }

  public all(): Promise<Collection<M>> {
    const constraints: QueryConstraintsWithActionAndPayload = { action: QueryActions.SELECT }
    console.log(constraints)
    // @todo how to pass it in data provider?
    return Promise.resolve([])
  }

  public get(): Promise<Collection<M>> {
    const constraints = this.getConstraintsWithAction(QueryActions.SELECT)
    console.log(constraints)
    // @todo how to pass it with all processing?
    return Promise.resolve([])
  }

  public first(): Promise<Item<M>> {
    this.limit(1)
    const constraints = this.getConstraintsWithAction(QueryActions.SELECT)
    console.log(constraints)
    // @todo how to pass it with all processing?
    return Promise.resolve({} as M)
  }

  public find(id: string | number): Promise<Item<M>>
  public find(ids: (string | number)[]): Promise<Collection<M>>
  public find(ids: any): any {
    return Array.isArray(ids) ? this.findIn(ids) : this.whereId(ids).first()
  }

  public findIn(ids: (string | number)[]): Promise<Collection<M>> {
    return this.whereId(ids).get()
  }

  public select(): Promise<Collection<M>> {
    const constraints = this.getConstraintsWithAction(QueryActions.SELECT)
    console.log(constraints)
    // @todo how to pass it in data provider?
    return Promise.resolve([])
  }

  public save(records: Element[]): Promise<M[]>
  public save(record: Element): Promise<M>
  public save(records: Element | Element[]): Promise<M | M[]> {
    const [data, entities] = this.getNormalizedEntities(records)
    const constraints: QueryConstraintsWithActionAndPayload = { action: QueryActions.SAVE, payload: { data, entities } }
    console.log(constraints)

    // @todo how to pass it in data provider?
    return Promise.resolve([])
  }

  public insert(records: Element[]): Promise<Collection<M>>
  public insert(record: Element): Promise<M>
  public insert(records: Element | Element[]): Promise<M | Collection<M>> {
    const models = this.hydrate(records)
    const constraints: QueryConstraintsWithActionAndPayload = { action: QueryActions.INSERT, payload: models }
    console.log(constraints)

    // @todo how to pass it in data provider?
    return Promise.resolve([])
  }

  public fresh(records: Element[]): Promise<Collection<M>>
  public fresh(record: Element): Promise<M>
  public fresh(records: Element | Element[]): Promise<M | Collection<M>> {
    const models = this.hydrate(records)
    const constraints: QueryConstraintsWithActionAndPayload = { action: QueryActions.FRESH, payload: models }
    console.log(constraints)

    // @todo how to pass it in data provider?
    return Promise.resolve([])
  }

  public update(record: Element): Promise<Collection<M>> {
    const constraints = this.getConstraintsWithAction(QueryActions.UPDATE, record)
    console.log(constraints)

    // @todo how to pass it in data provider?
    return Promise.resolve([])
  }

  public destroy(ids: (string | number)[]): Promise<Collection<M>>
  public destroy(id: string | number): Promise<Item<M>>
  public destroy(ids: any): Promise<any> {
    assert(!isArray(this.model.$getKeyName()), [
      "You can't use the `destroy` method on a model with a composite key.",
      'Please use `delete` method instead.',
    ])

    const constraints: QueryConstraintsWithActionAndPayload = { action: QueryActions.DELETE, payload: ids }
    console.log(constraints)

    // @todo how to pass it in data provider?
    return Promise.resolve([])
  }

  public delete(): Promise<M[]> {
    const constraints = this.getConstraintsWithAction(QueryActions.DELETE)
    console.log(constraints)

    // @todo how to pass it in data provider?
    return Promise.resolve([])
  }

  public flush(): Promise<Collection<M>> {
    const constraints: QueryConstraintsWithActionAndPayload = { action: QueryActions.FLUSH }
    console.log(constraints)

    // @todo how to pass it in data provider?
    return Promise.resolve([])
  }

  /**
   * Instantiate new models with the given record.
   */
  protected hydrate(record: Element): M
  protected hydrate(records: Element[]): Collection<M>
  protected hydrate(records: Element | Element[]): M | Collection<M> {
    return isArray(records)
      ? records.map((record) => this.hydrate(record))
      : this.model.$newInstance(records, { relations: false })
  }

  protected getNormalizedEntities(records: Element | Element[]): [data: Element | Element[], entities: Entities] {
    const schema = this.database.getSchema(this.model.$entity())
    const toNormalizrSchema: NormalizationSchemaParam = isArray(records) ? [schema] : schema
    const entities = new Normalizer().normalize(records, toNormalizrSchema).entities

    return [records, entities]
  }

  protected getConstraintsWithAction(action: QueryAction, payload?: any): QueryConstraintsWithActionAndPayload {
    return {
      action,
      payload,
      wheres: this.wheres,
      orders: this.orders,
      limit: this.take ?? undefined,
      offset: this.skip,
    }
  }
}
