import type { schema as Normalizr } from 'normalizr'

import type { DataProvider, State } from '@/data/types'
import { Relation } from '@/model/attributes/relations/relation'
import type { Model } from '@/model/Model'
import type { ModelConstructor } from '@/model/types'
import { Repository } from '@/repository/repository'
import type { Schemas } from '@/schema/schema'
import { Schema } from '@/schema/schema'

export class Database {
  /**
   * The store instance.
   */
  public store!: DataProvider

  /**
   * The name of storage namespace. ORM will create objects from
   * the registered models, and modules, and define them under this namespace.
   */
  public connection!: string

  /**
   * The list of registered models.
   */
  public models: Record<string, Model> = {}

  /**
   * The schema definition for the registered models.
   */
  public schemas: Schemas = {}

  /**
   * Whether the database has already been installed or not.
   * The model registration procedure depends on this flag.
   */
  public started: boolean = false

  public getRepository<M extends Model>(model: ModelConstructor<M>): Repository<M> {
    const repo = new Repository<M>(this).initialize(model)
    this.register(repo.getModel())
    return repo
  }

  /**
   * Set the store.
   */
  public setStore(store: DataProvider): this {
    this.store = store

    return this
  }

  /**
   * Set the connection.
   */
  public setConnection(connection: string): this {
    this.connection = connection

    return this
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
  public getSchema(name: string): Normalizr.Entity {
    return this.schemas[name]
  }

  /**
   * Register all related models.
   */
  private registerRelatedModels<M extends Model>(model: M): void {
    const fields = model.$fields()

    for (const name in fields) {
      const attr = fields[name]

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
  private createRootModule(): void {
    this.store.registerModule(this.connection)
  }

  /**
   * Create sub module.
   */
  private createModule<M extends Model>(model: M): void {
    const entity = model.$entity()

    this.store.registerModule([this.connection, entity], this.createState())
  }

  /**
   * Create sub state.
   */
  private createState(): State {
    return {
      data: {},
    }
  }

  /**
   * Create schema from the given model.
   */
  private createSchema<M extends Model>(model: M): Normalizr.Entity {
    return (this.schemas[model.$entity()] = new Schema(model).one())
  }
}
