import type { Element } from '@rattus-orm/utils/sharedTypes'

import type { NormalizedData } from '@/data/types'
import type { Database } from '@/database/database'
import type { Model } from '@/model/Model'
import { Normalizer } from '@/normalization/normalizer'
import type { NormalizedSchema } from '@/schema/types'
import { isArray } from '@/support/utils'

export class Interpreter {
  /**
   * Create a new Interpreter instance.
   */
  constructor(
    protected readonly database: Database,
    protected readonly model: Model,
  ) {}

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
  protected normalize(data: Element | Element[]): NormalizedData {
    const schema = isArray(data) ? [this.getSchema()] : this.getSchema()
    return new Normalizer().normalize(data, schema).entities
  }

  /**
   * Get the schema from the database.
   */
  protected getSchema(): NormalizedSchema {
    return this.database.getSchema(this.model.$entity())
  }
}
