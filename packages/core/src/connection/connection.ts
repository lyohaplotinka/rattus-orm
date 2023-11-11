import type { Element, Elements } from '@/data/types'
import type { Database } from '@/database/database'
import type { Model } from '@/model/Model'

export interface ConnectionNamespace {
  connection: string
  entity: string
}

export class Connection {
  /**
   * The database instance.
   */
  public database: Database

  /**
   * The entity name.
   */
  public model: Model

  /**
   * Create a new connection instance.
   */
  constructor(database: Database, model: Model) {
    this.database = database
    this.model = model
  }

  /**
   * Get all existing records.
   */
  public get(): Elements {
    const connection = this.database.connection
    const entity = this.model.$entity()

    return this.getStore().getState([connection, entity]).data
  }

  /**
   * Find a model by its index id.
   */
  public find(id: string): Element | null {
    return this.get()[id] ?? null
  }

  /**
   * Commit `save` mutation to the store.
   */
  public save(elements: Elements): void {
    this.getStore().save([this.database.connection, this.model.$entity()], elements)
  }

  /**
   * Commit `insert` mutation to the store.
   */
  public insert(records: Elements): void {
    this.getStore().insert([this.database.connection, this.model.$entity()], records)
  }

  /**
   * Commit `fresh` mutation to the store.
   */
  public fresh(records: Elements): void {
    this.getStore().fresh([this.database.connection, this.model.$entity()], records)
  }

  /**
   * Commit `update` mutation to the store.
   */
  public update(records: Elements): void {
    this.getStore().update([this.database.connection, this.model.$entity()], records)
  }

  /**
   * Commit `destroy` mutation to the store.
   */
  public destroy(ids: string[]): void {
    this.getStore().destroy([this.database.connection, this.model.$entity()], ids)
  }

  /**
   * Commit `delete` mutation to the store.
   */
  public delete(ids: string[]): void {
    this.getStore().delete([this.database.connection, this.model.$entity()], ids)
  }

  /**
   * Commit `flush` mutation to the store.
   */
  public flush(): string[] {
    const deleted = [] as string[]

    const data = this.get()

    for (const id in data) {
      deleted.push(id)
    }

    this.getStore().flush([this.database.connection, this.model.$entity()])

    return deleted
  }

  protected getStore() {
    return this.database.store
  }
}
