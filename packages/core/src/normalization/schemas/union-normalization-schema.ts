import { BaseSchema } from '@/normalization/schemas/base-schema'
import { isNullish } from '@/support/utils'

import type { Normalizer } from '../normalizer'
import type { SchemaAttributeGetter, SchemaDefinition } from './types'

export class UnionNormalizationSchema extends BaseSchema<Record<string, unknown>> {
  constructor(
    public definition: SchemaDefinition,
    public schemaAttribute: SchemaAttributeGetter,
  ) {
    super('_union', definition)
  }

  public normalize(
    input: unknown,
    parent: unknown,
    key: unknown,
    visitor: Normalizer,
  ): Record<string, unknown> | undefined {
    const schema = this.inferSchema(input, parent)
    if (!schema) {
      return input as Record<string, unknown>
    }

    const normalizedValue = visitor.visit(input, parent, key, schema)
    return isNullish(normalizedValue) ? undefined : { id: normalizedValue, schema: this.schemaAttribute(input, parent) }
  }

  protected inferSchema(input: unknown, parent: unknown) {
    const attr = this.schemaAttribute(input, parent)
    return this.definition[attr]
  }
}
