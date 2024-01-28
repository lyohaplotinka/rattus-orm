import type { Element } from '@core-shared-utils/sharedTypes'

import type { Collection, Item } from '@/data/types'
import type { Database } from '@/database/database'
import type { Model } from '@/model/Model'
import type { ModelConstructor } from '@/model/types'
import { Query } from '@/query/query'
import type {
  EagerLoadConstraint,
  OrderBy,
  OrderDirection,
  WherePrimaryClosure,
  WhereSecondaryClosure,
} from '@/query/types'
import { assert } from '@/support/utils'

export class Repository<M extends Model = Model> {
  /**
   * A special flag to indicate if this is the repository class or not. It's
   * used when retrieving repository instance from `store.$repo()` method to
   * determine whether the passed in class is either a repository or a model.
   */
  public static _isRepository: boolean = true

  /**
   * The model object to be used for the custom repository.
   */
  public use?: typeof Model

  /**
   * The model instance.
   */
  protected model!: M

  /**
   * Create a new Repository instance.
   *
   * @param {Database} database database to work with
   */
  constructor(public database: Database) {}

  /**
   * Initialize the repository by setting the model instance.
   *
   * @param {ModelConstructor} model model to initialize repository
   */
  public initialize(model?: ModelConstructor<M>): this {
    // If there's a model passed in, just use that and return immediately.
    if (model) {
      this.model = model.newRawInstance()

      return this
    }

    // If no model was passed to the initializer, that means the user has
    // passed repository to the `store.$repo` method instead of a model.
    // In this case, we'll check if the user has set model to the `use`
    // property and instantiate that.
    if (this.use) {
      this.model = (this.use as ModelConstructor<any>).newRawInstance() as M

      return this
    }

    // Else just return for now. If the user tries to call methods that require
    // a model, the error will be thrown at that time.
    return this
  }

  /**
   * Get the model instance. If the model is not registered to the repository,
   * it will throw an error. It happens when users use a custom repository
   * without setting `use` property.
   */
  public getModel(): M {
    assert(!!this.model, [
      'The model is not registered. Please define the model to be used at',
      '`use` property of the repository class.',
    ])

    return this.model
  }

  /**
   * Create a new repository with the given model.
   *
   * @param {Model} model model to create new repository for
   */
  public repo<M extends typeof Model>(model: M): Repository<InstanceType<M>> {
    return this.database.getRepository(model)
  }

  /**
   * Create a new Query instance.
   */
  public query(): Query<M> {
    return new Query(this.database, this.getModel())
  }

  /**
   * Add a basic where clause to the query.
   *
   * @param {WherePrimaryClosure | string} field field name to work with
   * @param {WhereSecondaryClosure | any} value optional value to match
   */
  public where(field: WherePrimaryClosure | string, value?: WhereSecondaryClosure | any): Query<M> {
    return this.query().where(field, value)
  }

  /**
   * Add an "or where" clause to the query.
   *
   * @param {WherePrimaryClosure | string} field field name to work with
   * @param {WhereSecondaryClosure | any} value optional value to match
   */
  public orWhere(field: WherePrimaryClosure | string, value?: WhereSecondaryClosure | any): Query<M> {
    return this.query().orWhere(field, value)
  }

  /**
   * Add an "order by" clause to the query.
   *
   * @param {OrderBy} field field name to work with
   * @param {OrderDirection} direction direction of order (asc | desc)
   */
  public orderBy(field: OrderBy, direction?: OrderDirection): Query<M> {
    return this.query().orderBy(field, direction)
  }

  /**
   * Set the "limit" value of the query.
   *
   * @param {number} value limit records to count
   */
  public limit(value: number): Query<M> {
    return this.query().limit(value)
  }

  /**
   * Set the "offset" value of the query.
   *
   * @param {number} value offset for records
   */
  public offset(value: number): Query<M> {
    return this.query().offset(value)
  }

  /**
   * Set the relationships that should be eager loaded.
   *
   * @param {string} name relation name
   * @param {EagerLoadConstraint} callback callback to load
   */
  public with(name: string, callback?: EagerLoadConstraint): Query<M> {
    return this.query().with(name, callback)
  }

  /**
   * Set to eager load all top-level relationships. Constraint is set for all relationships.
   *
   * @param {EagerLoadConstraint} callback callback to load
   * */
  public withAll(callback?: EagerLoadConstraint): Query<M> {
    return this.query().withAll(callback)
  }

  /**
   * Set to eager load all top-level relationships. Constraint is set for all relationships.
   *
   * @param {number} depth relations depth to load
   */
  public withAllRecursive(depth?: number): Query<M> {
    return this.query().withAllRecursive(depth)
  }

  /**
   * Get all models from the store.
   */
  public all(): Collection<M> {
    return this.query().get()
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
  public find(ids: any): Item<any> {
    return this.query().find(ids)
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
    return this.query().revive(schema)
  }

  /**
   * Create a new model instance. This method will not save the model to the
   * store. It's pretty much the alternative to `new Model()`, but it injects
   * the store instance to support model instance methods in SSR environment.
   *
   * @param {Element} attributes values for new model instance
   */
  public make(attributes?: Element): M {
    return this.getModel().$newInstance(attributes, {
      relations: true,
    })
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
    return this.query().save(records)
  }

  /**
   * Create and persist model with default values.
   */
  public new(): M {
    return this.query().new()
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
    return this.query().insert(records)
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
    return this.query().fresh(records)
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
    return this.query().destroy(ids)
  }

  /**
   * Delete all records in the store.
   */
  public flush(): M[] {
    return this.query().flush()
  }
}
