import type { Constructor, DataProvider, Elements, State } from '@rattus-orm/utils/sharedTypes'

import type { DatabasePlugin } from '@/database/types'
import { EventsDataProviderWrapper } from '@/events/events-data-provider-wrapper'
import type {
  CancelSubscriptionCallback,
  DataChangedEventPayload,
  DataEventCallback,
  ModuleRegisterEventPayload,
  RattusEvent,
  RattusEvents,
} from '@/events/types'
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
  protected dataProvider: EventsDataProviderWrapper

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
   * Set the data provider.
   */
  public setDataProvider(dataProvider: DataProvider): this {
    this.dataProvider = new EventsDataProviderWrapper(dataProvider)
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

  public on(
    event: Extract<RattusEvent, 'save' | 'insert' | 'update' | 'replace'>,
    callback: DataEventCallback<Elements, Elements>,
  ): CancelSubscriptionCallback
  public on(
    event: typeof RattusEvents.DELETE,
    callback: DataEventCallback<string[], string[]>,
  ): CancelSubscriptionCallback
  public on(
    event: typeof RattusEvents.MODULE_REGISTER,
    callback: DataEventCallback<ModuleRegisterEventPayload, ModuleRegisterEventPayload>,
  ): CancelSubscriptionCallback
  public on(event: typeof RattusEvents.FLUSH, callback: DataEventCallback<undefined>): CancelSubscriptionCallback
  public on(
    event: typeof RattusEvents.CONNECTION_REGISTER,
    callback: DataEventCallback<string>,
  ): CancelSubscriptionCallback
  public on(
    event: typeof RattusEvents.DATA_CHANGED,
    callback: DataEventCallback<DataChangedEventPayload>,
  ): CancelSubscriptionCallback
  public on(event: RattusEvent, callback: DataEventCallback<any, any>): CancelSubscriptionCallback {
    return this.dataProvider.listen(event, callback)
  }

  public resetListeners(event?: RattusEvent) {
    return this.dataProvider.resetListeners(event)
  }

  public use(plugin: DatabasePlugin): this {
    plugin(this)
    return this
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
