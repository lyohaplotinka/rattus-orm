import type { Element, Elements, ModulePath } from '@rattus-orm/utils/sharedTypes'

import type { Database } from '@/database/database'
import type { Model } from '@/model/Model'

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
    return this.getDataProvider().getModuleState(this.getThisModulePath()).data
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
    this.getDataProvider().save(this.getThisModulePath(), elements)
  }

  /**
   * Commit `insert` mutation to the store.
   */
  public insert(records: Elements): void {
    this.getDataProvider().insert(this.getThisModulePath(), records)
  }

  /**
   * Commit `fresh` mutation to the store.
   */
  public fresh(records: Elements): void {
    this.getDataProvider().replace(this.getThisModulePath(), records)
  }

  /**
   * Commit `update` mutation to the store.
   */
  public update(records: Elements): void {
    this.getDataProvider().update(this.getThisModulePath(), records)
  }

  /**
   * Commit `destroy` mutation to the store.
   */
  public destroy(ids: string[]): void {
    this.getDataProvider().delete(this.getThisModulePath(), ids)
  }

  /**
   * Commit `delete` mutation to the store.
   */
  public delete(ids: string[]): void {
    this.getDataProvider().delete(this.getThisModulePath(), ids)
  }

  /**
   * Commit `flush` mutation to the store.
   */
  public flush(): string[] {
    const deleted = Object.keys(this.get())
    this.getDataProvider().flush(this.getThisModulePath())

    return deleted
  }

  protected getDataProvider() {
    return this.database.getDataProvider()
  }

  protected getDatabaseConnection() {
    return this.database.getConnection()
  }

  protected getThisModulePath(): ModulePath {
    return [this.getDatabaseConnection(), this.model.$entity()]
  }
}
