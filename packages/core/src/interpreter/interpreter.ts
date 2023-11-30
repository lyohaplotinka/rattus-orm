import type { Element } from '@rattus-orm/utils/sharedTypes'
import type { schema as Normalizr } from 'normalizr'
import { normalize } from 'normalizr'

import type { NormalizedData } from '@/data/types'
import type { Database } from '@/database/database'
import type { Model } from '@/model/Model'
import { isArray } from '@/support/utils'

export class Interpreter {
  /**
   * The database instance.
   */
  public database: Database

  /**
   * The model object.
   */
  public model: Model

  /**
   * Create a new Interpreter instance.
   */
  constructor(database: Database, model: Model) {
    this.database = database
    this.model = model
  }

  /**
   * Perform interpretation for the given data.
   */
  public process(data: Element): [Element, NormalizedData]
  public process(data: Element[]): [Element[], NormalizedData]
  public process(data: Element | Element[]): [Element | Element[], NormalizedData] {
    const normalizedData = this.normalize(data)

    return [data, normalizedData]
  }

  /**
   * Normalize the given data.
   */
  private normalize(data: Element | Element[]): NormalizedData {
    const schema = isArray(data) ? [this.getSchema()] : this.getSchema()

    return normalize(data, schema).entities as NormalizedData
  }

  /**
   * Get the schema from the database.
   */
  private getSchema(): Normalizr.Entity {
    return this.database.getSchema(this.model.$entity())
  }
}
