import { MorphTo } from '@/attributes/classes/relations/morph-to'
import { Relation } from '@/attributes/classes/relations/relation'
import { Constraintor } from '@/constraintor/constraintor'
import type { Collection, Element, Elements, Entities, Item, ModulePath } from '@/data/types'
import type { Database } from '@/database/database'
import type { Model } from '@/model/Model'
import { Normalizer } from '@/normalization/normalizer'
import type { NormalizationSchemaParam } from '@/normalization/schemas/types'
import { assert, groupBy, isArray, isEmpty, isFunction, isNumber, isString } from '@/support/utils'

import type {
  EagerLoad,
  EagerLoadConstraint,
  Order,
  OrderBy,
  OrderDirection,
  QueryInterface,
  Where,
  WherePrimaryClosure,
  WhereSecondaryClosure,
} from './types'

export class Query<M extends Model = Model> extends Constraintor<M> implements QueryInterface<M> {
  /**
   * Create a new query instance.
   *
   * @param {Database} database database to work with
   * @param {Model} model model to work with
   * @param {EagerLoad} eagerLoad the relationships that should be eager loaded, default {}
   * @param {number} skip the number of records to skip, default 0
   * @param {number | null} take the maximum number of records to return, default null
   * @param {Order[]} orders the orderings for the query, default []
   * @param {Where[]} wheres the where constraints for the query, default []
   */
  constructor(
    protected readonly database: Database,
    model: M,
    eagerLoad: EagerLoad = {},
    skip: number = 0,
    take: number | null = null,
    orders: Order[] = [],
    wheres: Where[] = [],
  ) {
    super(model, eagerLoad, skip, take, orders, wheres)
  }

  /**
   * Create a new query instance for the given model.
   *
   * @param {string} model model entity to work with
   */
  public newQuery(model: string): Query<Model> {
    return new Query(this.database, this.database.getModel(model))
  }

  /**
   * Create a new query instance with constraints for the given model.
   *
   * @param {string} model model entity to work with
   */
  public newQueryWithConstraints(model: string): Query<Model> {
    return new Query(
      this.database,
      this.database.getModel(model),
      this.eagerLoad,
      this.skip,
      this.take,
      this.orders,
      this.wheres,
    )
  }

  /**
   * Create a new query instance from the given relation.
   *
   * @param {Relation} relation relation to get model from
   */
  public newQueryForRelation(relation: Relation): Query<Model> {
    return new Query(this.database, relation.getRelated())
  }

  /**
   * Add a basic where clause to the query.
   *
   * @param {WherePrimaryClosure | string} field field name to work with
   * @param {WhereSecondaryClosure | any} value optional value to match
   */
  public where(field: WherePrimaryClosure | string, value?: WhereSecondaryClosure | any): this {
    super.where(field, value)
    return this
  }

  /**
   * Add a "where in" clause to the query.
   *
   * @param {string} field field name to work with
   * @param {any[]} values values to match
   */
  public whereIn(field: string, values: any[]): this {
    super.whereIn(field, values)
    return this
  }

  /**
   * Add a where clause on the primary key to the query.
   *
   * @param {string | number | (string | number)[]} ids primary keys to match
   */
  public whereId(ids: string | number | (string | number)[]): this {
    return this.where(this.model.$getKeyName() as any, ids)
  }

  /**
   * Add an "or where" clause to the query.
   *
   * @param {WherePrimaryClosure | string} field field name to work with
   * @param {WhereSecondaryClosure | any} value optional value to match
   */
  public orWhere(field: WherePrimaryClosure | string, value?: WhereSecondaryClosure | any): this {
    super.orWhere(field, value)
    return this
  }

  /**
   * Add an "order by" clause to the query.
   *
   * @param {OrderBy} field field name to work with
   * @param {OrderDirection} direction direction of order (asc | desc)
   */
  public orderBy(field: OrderBy, direction: OrderDirection = 'asc'): this {
    super.orderBy(field, direction)
    return this
  }

  /**
   * Set the "limit" value of the query.
   *
   * @param {number} value limit records to count
   */
  public limit(value: number): this {
    super.limit(value)
    return this
  }

  /**
   * Set the "offset" value of the query.
   *
   * @param {number} value offset for records
   */
  public offset(value: number): this {
    super.offset(value)
    return this
  }

  /**
   * Set the relationships that should be eager loaded.
   *
   * @param {string} name relation name
   * @param {EagerLoadConstraint} callback callback to load
   */
  public with(name: string, callback: EagerLoadConstraint = () => {}): this {
    super.with(name, callback)
    return this
  }

  /**
   * Set to eager load all top-level relationships. Constraint is set for all relationships.
   *
   * @param {EagerLoadConstraint} callback callback to load
   */
  public withAll(callback: EagerLoadConstraint = () => {}): this {
    super.withAll(callback)
    return this
  }

  /**
   * Set to eager load all relationships recursively.
   *
   * @param {number} depth relations depth to load
   */
  public withAllRecursive(depth: number = 3): this {
    this.withAll((query) => {
      depth > 0 && query.withAllRecursive(depth - 1)
    })

    return this
  }

  /**
   * Get all models from the store. The difference with the `get` is that this
   * method will not process any query chain. It'll always retrieve all models.
   */
  public all(): Collection<M> {
    return Object.values(this.getAll()).map((record) => {
      return this.hydrate(record)
    })
  }

  /**
   * Retrieve models by processing whole query chain.
   */
  public get(): Collection<M> {
    const models = this.select()
    return !isEmpty(models) ? this.load(models) : models
  }

  /**
   * Execute the query and get the first result.
   */
  public first(): Item<M> {
    return this.limit(1).get()[0] ?? null
  }

  /**
   * Find a model by its primary key.
   *
   * @param {string | number} id primary key value of needed item
   */
  public find(id: string | number): Item<M>
  /**
   * Find multiple models by their primary keys.
   *
   * @param {(string | number)[]} ids primary keys array of needed items
   */
  public find(ids: (string | number)[]): Collection<M>

  public find(ids: any): any {
    return isArray(ids) ? this.findIn(ids) : this.whereId(ids).first()
  }

  /**
   * Find multiple models by their primary keys.
   *
   * @param {(string | number)[]} ids primary keys array of needed items
   */
  public findIn(ids: (string | number)[]): Collection<M> {
    return this.whereId(ids).get()
  }

  /**
   * Retrieve models by processing all filters set to the query chain.
   */
  public select(): Collection<M> {
    return this.filterLimit(this.filterOrder(this.filterWhere(this.all())))
  }

  /**
   * Eager load relations on the model.
   *
   * @param {Collection<Model>} models models array for relations load
   */
  public load(models: Collection<M>): Collection<M> {
    for (const name in this.eagerLoad) {
      this.eagerLoadRelation(models, name, this.eagerLoad[name])
    }
    return models
  }

  /**
   * Retrieves the models from the store by following the given
   * normalized schema.
   *
   * @param {Element[]} schema elements to revive
   */
  public revive(schema: Element[]): Collection<M>
  /**
   * Retrieves the model from the store by following the given
   * normalized schema.
   *
   * @param {Element} schema element to revive
   */
  public revive(schema: Element): Item<M>
  public revive(schema: Element | Element[]): Item<M> | Collection<M> {
    return isArray(schema) ? this.reviveMany(schema) : this.reviveOne(schema)
  }

  /**
   * Revive single model from the given schema.
   *
   * @param {Element} schema element to revive
   */
  public reviveOne(schema: Element): Item<M> {
    const item = this.getAll()[this.model.$getIndexId(schema)]
    if (!item) {
      return null
    }

    return this.reviveRelations(this.hydrate(item), schema)
  }

  /**
   * Revive multiple models from the given schema.
   *
   * @param {Element[]} schema elements to revive
   */
  public reviveMany(schema: Element[]): Collection<M> {
    return schema.reduce<Collection<M>>((collection, item) => {
      const model = this.reviveOne(item)
      model && collection.push(model)

      return collection
    }, [])
  }

  /**
   * Create and persist model with default values.
   */
  public new(): M {
    const model = this.hydrate({})

    this.getDataProvider().insert(this.getThisModulePath(), this.compile(model))
    return model
  }

  /**
   * Save the given records to the store with data normalization.
   *
   * @param {Element[]} records elements to save
   */
  public save(records: Element[]): M[]
  /**
   * Save the given records to the store with data normalization.
   *
   * @param {Element} record element to save
   */
  public save(record: Element): M
  public save(records: Element | Element[]): M | M[] {
    const [data, entities] = this.getNormalizedEntities(records)

    for (const entity in entities) {
      const query = this.newQuery(entity)
      const elements = entities[entity]

      query.saveElements(elements)
    }

    return this.revive(data) as M | M[]
  }

  /**
   * Save the given elements to the store.
   *
   * @param {Elements} elements elements map to save
   */
  public saveElements(elements: Elements): void {
    const newData = Object.entries(elements).reduce<Elements>((result, [id, record]) => {
      result[id] = this.hydrate({ ...(this.data()[id] ?? {}), ...record }).$getAttributes()
      return result
    }, {})

    this.getDataProvider().save(this.getThisModulePath(), newData)
  }

  /**
   * Insert the given record to the store.
   *
   * @param {Element[]} records elements to insert
   */
  public insert(records: Element[]): Collection<M>
  /**
   * Insert the given record to the store.
   *
   * @param {Element} record element to insert
   */
  public insert(record: Element): M
  public insert(records: Element | Element[]): M | Collection<M> {
    const models = this.hydrate(records)
    this.getDataProvider().insert(this.getThisModulePath(), this.compile(models))
    return models
  }

  /**
   * Insert the given records to the store by replacing any existing records.
   *
   * @param {Element[]} records new elements
   */
  public fresh(records: Element[]): Collection<M>
  /**
   * Insert the given record to the store by replacing any existing records.
   *
   * @param {Element} record new element
   */
  public fresh(record: Element): M
  public fresh(records: Element | Element[]): M | Collection<M> {
    const models = this.hydrate(records)
    this.getDataProvider().replace(this.getThisModulePath(), this.compile(models))
    return models
  }

  /**
   * Update the record matching the query chain.
   *
   * @param {Element} record element update payload
   */
  public update(record: Element): Collection<M> {
    const models = this.get()

    if (isEmpty(models)) {
      return []
    }
    const newModels = models.map((model) => {
      return this.hydrate({ ...model.$getAttributes(), ...record })
    })

    this.getDataProvider().update(this.getThisModulePath(), this.compile(newModels))
    return newModels
  }

  /**
   * Destroy the models for the given ids.
   *
   * @param {(string | number)[]} ids primary keys to destroy
   */
  public destroy(ids: (string | number)[]): Collection<M>
  /**
   * Destroy the models for the given id.
   *
   * @param {string | number} id primary key to destroy
   */
  public destroy(id: string | number): Item<M>
  public destroy(ids: any): any {
    assert(!isArray(this.model.$getKeyName()), [
      "You can't use the `destroy` method on a model with a composite key.",
      'Please use `delete` method instead.',
    ])

    return isArray(ids) ? this.destroyMany(ids) : this.destroyOne(ids)
  }

  /**
   * Delete records resolved by the query chain.
   */
  public delete(): M[] {
    const models = this.get()

    if (isEmpty(models)) {
      return []
    }

    this.getDataProvider().delete(this.getThisModulePath(), this.getIndexIdsFromCollection(models))
    return models
  }

  /**
   * Delete all records in the store.
   */
  public flush(): Collection<M> {
    const models = this.get()
    this.getDataProvider().flush(this.getThisModulePath())

    return models
  }

  /**
   * Get raw elements from the store.
   */
  protected data(): Elements {
    return this.getAll()
  }

  /**
   * Filter the given collection by the registered where clause.
   */
  protected filterWhere(models: Collection<M>): Collection<M> {
    if (isEmpty(this.wheres)) {
      return models
    }

    const comparator = this.getWhereComparator()
    return models.filter((model) => comparator(model))
  }

  /**
   * Get comparator for the where clause.
   */
  protected getWhereComparator(): (model: any) => boolean {
    const { and, or } = groupBy(this.wheres, (where) => where.boolean)

    return (model) => {
      const results: boolean[] = []

      and && results.push(and.every((w) => this.whereComparator(model, w)))
      or && results.push(or.some((w) => this.whereComparator(model, w)))

      return results.indexOf(true) !== -1
    }
  }

  /**
   * The function to compare where clause to the given model.
   */
  protected whereComparator(model: M, where: Where): boolean {
    if (isFunction<boolean>(where.field)) {
      return where.field(model)
    }

    if (isArray(where.value)) {
      return where.value.includes(model.getThisNonStrict()[where.field])
    }

    if (isFunction<boolean>(where.value)) {
      return where.value(model.getThisNonStrict()[where.field])
    }

    return model.getThisNonStrict()[where.field] === where.value
  }

  /**
   * Filter the given collection by the registered order conditions.
   */
  protected filterOrder(models: Collection<M>): Collection<M> {
    if (isEmpty(this.orders)) {
      return models
    }

    return models.sort((elemA, elemB) => {
      for (const order of this.orders) {
        const isAsc = order.direction === 'asc'
        const aValue: unknown = isFunction(order.field) ? order.field(elemA) : elemA.getThisNonStrict()[order.field]
        const bValue: unknown = isFunction(order.field) ? order.field(elemB) : elemB.getThisNonStrict()[order.field]

        if (isString(aValue) && isString(bValue)) {
          const result = (isAsc ? aValue : bValue).localeCompare(isAsc ? bValue : aValue, undefined, { numeric: true })

          if (result) {
            return result
          }
        }

        if (isNumber(aValue) && isNumber(bValue)) {
          const result = isAsc ? aValue - bValue : bValue - aValue
          if (result) {
            return result
          }
        }
      }

      return 0
    })
  }

  /**
   * Filter the given collection by the registered limit and offset values.
   */
  protected filterLimit(models: Collection<M>): Collection<M> {
    return this.take !== null ? models.slice(this.skip, this.skip + this.take) : models.slice(this.skip)
  }

  /**
   * Eagerly load the relationship on a set of models.
   */
  protected eagerLoadRelation(models: Collection<M>, name: string, constraints: EagerLoadConstraint): void {
    // First we will "back up" the existing where conditions on the query so we can
    // add our eager constraints. Then we will merge the wheres that were on the
    // query back to it in order that any where conditions might be specified.
    const relation = this.getRelation(name)

    const query = this.newQueryForRelation(relation)

    relation.addEagerConstraints(query, models)

    constraints(query)

    // Once we have the results, we just match those back up to their parent models
    // using the relationship instance. Then we just return the finished arrays
    // of models which have been eagerly hydrated and are readied for return.
    relation.match(name, models, query)
  }

  /**
   * Get the relation instance for the given relation name.
   */
  protected getRelation(name: string): Relation {
    return this.model.$getRelation(name)
  }

  /**
   * Revive relations for the given schema and entity.
   */
  protected reviveRelations(model: M, schema: Element): M {
    Object.entries(this.model.$fields()).forEach(([key, attr]) => {
      if (attr instanceof Relation && schema[key]) {
        const relatedSchema = schema[key]
        if (attr instanceof MorphTo) {
          const relatedType = model.getThisNonStrict()[attr.getType()]

          model.getThisNonStrict()[key] = this.newQuery(relatedType).reviveOne(relatedSchema)
        } else {
          model.getThisNonStrict()[key] = isArray(relatedSchema)
            ? this.newQueryForRelation(attr).reviveMany(relatedSchema)
            : this.newQueryForRelation(attr).reviveOne(relatedSchema)
        }
      }
    })

    return model
  }

  protected destroyOne(id: string | number): Item<M> {
    const model = this.find(id)

    if (!model) {
      return null
    }

    this.getDataProvider().delete(this.getThisModulePath(), [model.$getIndexId()])
    return model
  }

  protected destroyMany(ids: (string | number)[]): Collection<M> {
    const models = this.find(ids)

    if (isEmpty(models)) {
      return []
    }

    this.getDataProvider().delete(this.getThisModulePath(), this.getIndexIdsFromCollection(models))
    return models
  }

  /**
   * Get an array of index ids from the given collection.
   */
  protected getIndexIdsFromCollection(models: Collection<M>): string[] {
    return models.map((model) => model.$getIndexId())
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

  /**
   * Convert given models into an indexed object that is ready to be saved to
   * the store.
   */
  protected compile(models: M | Collection<M>): Elements {
    const collection = isArray(models) ? models : [models]

    return collection.reduce<Elements>((records, model) => {
      records[model.$getIndexId()] = model.$getAttributes()
      return records
    }, {})
  }

  protected getNormalizedEntities(records: Element | Element[]): [data: Element | Element[], entities: Entities] {
    const schema = this.database.getSchema(this.model.$entity())
    const toNormalizrSchema: NormalizationSchemaParam = isArray(records) ? [schema] : schema
    const entities = new Normalizer().normalize(records, toNormalizrSchema).entities

    return [records, entities]
  }

  protected getDataProvider() {
    return this.database.getWrappedDataProvider()
  }

  protected getDatabaseConnection() {
    return this.database.getConnection()
  }

  protected getThisModulePath(): ModulePath {
    return [this.getDatabaseConnection(), this.model.$entity()]
  }

  protected getAll() {
    return this.getDataProvider().getModuleState(this.getThisModulePath()).data
  }
}
