import { isUnknownRecord } from '@core-shared-utils/isUnknownRecord'

import { BaseSchema } from '@/normalization/schemas/base-schema'
import { isArray, isNullish } from '@/support/utils'

import type { Normalizer } from '../normalizer'
import { isNormalizationSchema } from './guards'
import type { Identifier, NormalizationSchema, SchemaDefinition } from './types'
import type { SchemaAttributeGetter } from './types'

export class ArrayNormalizationSchema extends BaseSchema<
  Record<string, unknown>[] | Identifier[],
  NormalizationSchema<any> | SchemaDefinition
> {
  constructor(
    public definition: NormalizationSchema<any> | SchemaDefinition,
    public schemaAttribute?: SchemaAttributeGetter,
  ) {
    super('_array', definition)
  }

  public define(definition: SchemaDefinition): void {
    if (isNormalizationSchema(this.definition)) {
      this.definition.define(definition)
      return
    }
    super.define(definition)
  }

  public normalize(
    input: unknown,
    parent: unknown,
    key: unknown,
    visitor: Normalizer,
  ): Record<string, unknown>[] | Identifier[] | undefined {
    const values = this.getValues(input)

    return values.map((value) => {
      const schema = this.inferSchema(value)
      if (!schema) {
        return value as Record<string, unknown>
      }

      const normalizedValue = visitor.visit(value, parent, key, schema)

      if (!isNormalizationSchema(this.definition) && this.schemaAttribute) {
        return isNullish(normalizedValue)
          ? undefined
          : { id: normalizedValue, schema: this.schemaAttribute(value, value) }
      }

      return isNullish(normalizedValue) ? undefined : (normalizedValue as string[])
    }) as Record<string, unknown>[] | Identifier[] | undefined
  }

  protected inferSchema(input: unknown): NormalizationSchema<unknown> {
    if (isNormalizationSchema(this.definition)) {
      return this.definition
    }
    if (!this.schemaAttribute) {
      throw new Error('No schema attribute')
    }
    const attr = this.schemaAttribute(input, input)
    return this.definition[attr]
  }

  protected getValues(input: unknown): unknown[] {
    if (isArray(input)) {
      return input
    }
    if (isUnknownRecord(input)) {
      return Object.values(input)
    }
    throw new Error('Unknown input type')
  }
}
