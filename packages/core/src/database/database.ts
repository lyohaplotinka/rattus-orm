import { Relation } from '@/attributes/classes/relations/relation'
import type { DataProvider, Elements, SerializedStorage, State } from '@/data/types'
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
import type { Model } from '@/model/Model'
import type { ModelConstructor } from '@/model/types'
import type { Repository } from '@/repository/repository'
import { RepositoryManager } from '@/repository/repository-manager'
import { Schema } from '@/schema/schema'
import type { EntitySchema, Schemas } from '@/schema/types'
import type { Constructor } from '@/types'

export class Database {
  /**
   * Repository constructors manager (for custom repositories)
   */
  protected readonly repositoryManager = new RepositoryManager()

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

  protected started: boolean = false

  /**
   * Whether the database has already been installed or not.
   * The model registration procedure depends on this flag.
   */
  public isStarted() {
    return this.started
  }

  /**
   * Get repository for model
   *
   * @param {Model} model model for which a repository is needed
   * @returns {R extends Repository} Repository instance (or custom if generic argument passed)
   */
  public getRepository<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model>(model: M): R {
    const RepoCtor = this.repositoryManager.getRepositoryCtorForModel(model)
    const repo = new RepoCtor(this).initialize(model as ModelConstructor<any>)
    this.register(repo.getModel())
    return repo as R
  }

  /**
   * Add custom repository constructor
   *
   * @template R
   * @param {Constructor<R>} repo constructor of your repository
   */
  public registerCustomRepository<R extends Repository>(repo: Constructor<R>): this {
    this.repositoryManager.addRepositoryConstructor(repo, this)
    return this
  }

  /**
   * Set data provider
   *
   * @param {DataProvider} dataProvider instance of chosen DataProvider
   */
  public setDataProvider(dataProvider: DataProvider): this {
    this.dataProvider = new EventsDataProviderWrapper(dataProvider)
    return this
  }

  /**
   * Get current database DataProvider.
   * Returns initial DataProvider, not wrapped with
   * EventsDataProviderWrapper.
   */
  public getDataProvider() {
    return this.dataProvider.getWrappedProvider()
  }

  /**
   * Get current DataProvider wrapped in
   * EventsDataProviderWraper
   */
  public getWrappedDataProvider() {
    return this.dataProvider
  }

  /**
   * Set the connection.
   *
   * @param {string} connection connection name
   */
  public setConnection(connection: string): this {
    this.connection = connection
    return this
  }

  /**
   * Get current database connection
   */
  public getConnection(): string {
    return this.connection
  }

  /**
   * Initialize the database before a user can start using it.
   */
  public start(): this {
    this.createRootModule()
    this.started = true
    return this
  }

  /**
   * Register the given model.
   *
   * @param {Model} model model to register
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
   *
   * @param {string} name model name (from static entity field)
   */
  public getModel<M extends Model>(name: string): M {
    return this.models[name] as M
  }

  /**
   * Get schema by the specified entity name.
   *
   * @param {string} name model name (from static entity field)
   */
  public getSchema(name: string): EntitySchema {
    return this.schemas[name]
  }

  /**
   * Listen to RattusEvent which can modify data it operates with.
   * Should return an updated data.
   *
   * @param {RattusEvent.SAVE | RattusEvents.INSERT | RattusEvents.UPDATE | RattusEvents.REPLACE} event event to listen to
   * @param {DataEventCallback} callback callback, accepts Elements, returns Elements
   */
  public on(
    event: Extract<RattusEvent, 'save' | 'insert' | 'update' | 'replace'>,
    callback: DataEventCallback<Elements, Elements>,
  ): CancelSubscriptionCallback
  /**
   * Listen to RattusEvent on delete data. Should return an array of
   * primary keys that will be deleted
   *
   * @param {RattusEvent.DELETE} event event to listen to
   * @param {DataEventCallback<string[], string[]>} callback callback, accepts Array<string | number>, returns Array<string | number>
   */
  public on(
    event: typeof RattusEvents.DELETE,
    callback: DataEventCallback<string[], string[]>,
  ): CancelSubscriptionCallback
  /**
   * Listen to RattusEvent on register new module. Should return special
   * metadata payload: { path: ModulePath, initialState?: State }
   *
   * @param {RattusEvent.MODULE_REGISTER} event event to listen to
   * @param {DataEventCallback<ModuleRegisterEventPayload, ModuleRegisterEventPayload>} callback callback, accepts ModuleRegisterEventPayload, returns ModuleRegisterEventPayload
   */
  public on(
    event: typeof RattusEvents.MODULE_REGISTER,
    callback: DataEventCallback<ModuleRegisterEventPayload, ModuleRegisterEventPayload>,
  ): CancelSubscriptionCallback
  /**
   * Listen to RattusEvent on flush data. Can't modify data.
   *
   * @param {RattusEvent.FLUSH} event event to listen to
   * @param {DataEventCallback} callback void callback
   */
  public on(event: typeof RattusEvents.FLUSH, callback: DataEventCallback<undefined>): CancelSubscriptionCallback
  /**
   * Listen to RattusEvent on connection register. Can't modify data.
   *
   * @param {RattusEvent.CONNECTION_REGISTER} event event to listen to
   * @param {DataEventCallback} callback void callback, accepts connection name.
   */
  public on(
    event: typeof RattusEvents.CONNECTION_REGISTER,
    callback: DataEventCallback<string>,
  ): CancelSubscriptionCallback
  /**
   * Listen to RattusEvent on any data changed. Can't modify data.
   *
   * @param {RattusEvent.DATA_CHANGED} event event to listen to
   * @param {DataEventCallback} callback void callback, accepts { path: ModulePath, state: State }
   */
  public on(
    event: typeof RattusEvents.DATA_CHANGED,
    callback: DataEventCallback<DataChangedEventPayload>,
  ): CancelSubscriptionCallback
  public on(event: RattusEvent, callback: DataEventCallback<any, any>): CancelSubscriptionCallback {
    return this.dataProvider.listen(event, callback)
  }

  /**
   * Reset listeners for specific event
   *
   * @param {RattusEvent} event reset for this event
   */
  public resetListeners(event?: RattusEvent) {
    return this.dataProvider.resetListeners(event)
  }

  /**
   * Use plugin
   *
   * @param {DatabasePlugin} plugin database plugin function
   */
  public use(plugin: DatabasePlugin): this {
    plugin(this)
    return this
  }

  /**
   * Export all data from current connection
   * as JavaScript object
   */
  public dump(): SerializedStorage {
    const connection = this.getConnection()
    return {
      [connection]: this.dataProvider.dump()[connection],
    }
  }

  /**
   * Import data into database
   *
   * @param {SerializedStorage} data data to import
   */
  public restore(data: SerializedStorage) {
    this.dataProvider.restore(data)
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
   * Create sub-state.
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
