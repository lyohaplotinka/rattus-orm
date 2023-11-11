import type { Element, Elements } from '@/data/types'
import type { Database } from '@/database/database'
import type { Model } from '@/model/Model'

export interface ConnectionNamespace {
  connection: string
  entity: string
}

export class Connection {
  /**
   * Create a new connection instance.
   */
  constructor(
    protected readonly database: Database,
    protected readonly model: Model,
  ) {}

  /**
   * Get all existing records.
   */
  public get(): Elements {
    const connection = this.getDatabaseConnection()
    const entity = this.model.$entity()

    return this.getDataProvider().getState([connection, entity]).data
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
    this.getDataProvider().save([this.getDatabaseConnection(), this.model.$entity()], elements)
  }

  /**
   * Commit `insert` mutation to the store.
   */
  public insert(records: Elements): void {
    this.getDataProvider().insert([this.getDatabaseConnection(), this.model.$entity()], records)
  }

  /**
   * Commit `fresh` mutation to the store.
   */
  public fresh(records: Elements): void {
    this.getDataProvider().fresh([this.getDatabaseConnection(), this.model.$entity()], records)
  }

  /**
   * Commit `update` mutation to the store.
   */
  public update(records: Elements): void {
    this.getDataProvider().update([this.getDatabaseConnection(), this.model.$entity()], records)
  }

  /**
   * Commit `destroy` mutation to the store.
   */
  public destroy(ids: string[]): void {
    this.getDataProvider().destroy([this.getDatabaseConnection(), this.model.$entity()], ids)
  }

  /**
   * Commit `delete` mutation to the store.
   */
  public delete(ids: string[]): void {
    this.getDataProvider().delete([this.getDatabaseConnection(), this.model.$entity()], ids)
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

    this.getDataProvider().flush([this.getDatabaseConnection(), this.model.$entity()])

    return deleted
  }

  protected getDataProvider() {
    return this.database.getDataProvider()
  }

  protected getDatabaseConnection() {
    return this.database.getConnection()
  }
}
