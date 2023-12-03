import type { Constructor, DataProvider, State } from '@rattus-orm/utils/sharedTypes'

import { Relation } from '@/model/attributes/relations/relation'
import type { Model } from '@/model/Model'
import type { ModelConstructor } from '@/model/types'
import { Repository } from '@/repository/repository'
import { Schema } from '@/schema/schema'
import type { EntitySchema, Schemas } from '@/schema/types'

export class Database {
  /**
   * The store instance.
   */
  protected dataProvider: DataProvider

  /**
   * The name of storage namespace. ORM will create objects from
   * the registered models, and modules, and define them under this namespace.
   */
  protected connection: string

  /**
   * The list of registered models.
   */
  protected models: Record<string, Model> = {}

  /**
   * The schema definition for the registered models.
   */
  protected schemas: Schemas = {}

  /**
   * Whether the database has already been installed or not.
   * The model registration procedure depends on this flag.
   */
  protected started: boolean = false

  public isStarted() {
    return this.started
  }

  public buildRepository<R extends Repository>(repoConstructor: Constructor<R>): R {
    const repo = new repoConstructor(this).initialize()
    this.register(repo.getModel())
    return repo
  }

  public getRepository<M extends typeof Model>(model: M): Repository<InstanceType<M>> {
    const repo = new Repository<ModelConstructor<any>>(this).initialize(model)
    this.register(repo.getModel())
    return repo as Repository<InstanceType<M>>
  }

  /**
   * Set the store.
   */
  public setDataProvider(store: DataProvider): this {
    this.dataProvider = store
    return this
  }

  public getDataProvider() {
    return this.dataProvider
  }

  /**
   * Set the connection.
   */
  public setConnection(connection: string): this {
    this.connection = connection
    return this
  }

  public getConnection(): string {
    return this.connection
  }

  /**
   * Initialize the database before a user can start using it.
   */
  public start(): void {
    this.createRootModule()
    this.started = true
  }

  /**
   * Register the given model.
   */
  public register<M extends Model>(model: M): void {
    const entity = model.$entity()

    if (!this.models[entity]) {
      this.models[entity] = model
      this.createModule(model)
      this.createSchema(model)
      this.registerRelatedModels(model)
    }
  }

  /**
   * Get a model by the specified entity name.
   */
  public getModel<M extends Model>(name: string): M {
    return this.models[name] as M
  }

  /**
   * Get schema by the specified entity name.
   */
  public getSchema(name: string): EntitySchema {
    return this.schemas[name]
  }

  /**
   * Register all related models.
   */
  protected registerRelatedModels<M extends Model>(model: M): void {
    for (const attr of Object.values(model.$fields())) {
      if (attr instanceof Relation) {
        attr.getRelateds().forEach((m) => {
          this.register(m)
        })
      }
    }
  }

  /**
   * Create root module.
   */
  protected createRootModule(): void {
    this.dataProvider.registerConnection(this.connection)
  }

  /**
   * Create sub module.
   */
  protected createModule<M extends Model>(model: M): void {
    const entity = model.$entity()
    this.dataProvider.registerModule([this.connection, entity], this.createState())
  }

  /**
   * Create sub state.
   */
  protected createState(): State {
    return {
      data: {},
    }
  }

  /**
   * Create schema from the given model.
   */
  protected createSchema<M extends Model>(model: M): EntitySchema {
    return (this.schemas[model.$entity()] = new Schema(model).one())
  }
}
