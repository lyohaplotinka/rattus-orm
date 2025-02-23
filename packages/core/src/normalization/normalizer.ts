import { isUnknownRecord } from '@core-shared-utils/isUnknownRecord'

import type { Element, Entities } from '@/data/types'
import { isArray, isNullish } from '@/support/utils'

import { isNormalizationSchema } from './schemas/guards'
import type { Identifier, NormalizationSchema, NormalizationSchemaParam } from './schemas/types'

export class Normalizer {
  public entities: Entities = {}
  public cache = new Map<unknown, Identifier>()

  public addEntity(schema: NormalizationSchema<unknown>, id: Identifier, processedEntity: Element) {
    const obj = (this.entities[schema.key] ||= {})
    obj[id] = processedEntity
  }

  public visit(
    input: unknown,
    parent: unknown,
    key: unknown,
    schema: NormalizationSchemaParam,
  ): unknown {
    if (!isUnknownRecord(input)) {
      return input
    }

    if (isArray(schema)) {
      return this.visitSchemaArray(input, parent, key, schema)
    }

    if (isNormalizationSchema(schema)) {
      return this.visitEntity(input, parent, key, schema)
    }

    return this.visitObject(
      input as Record<string, unknown>,
      parent,
      key,
      schema as unknown as Record<string, NormalizationSchema<unknown>>,
    )
  }

  public normalize(input: any, schema: NormalizationSchemaParam) {
    const normalized = this.visit(input, input, null, schema)

    return {
      result: normalized,
      entities: this.entities,
    }
  }

  protected visitSchemaArray(
    input: Record<string, unknown>,
    parent: unknown,
    key: unknown,
    [schema]: [NormalizationSchema<unknown>],
  ) {
    return Object.values(input).map((value) => this.visit(value, parent, key, schema))
  }

  protected visitObject(
    input: Record<string, unknown>,
    parent: unknown,
    rootKey: unknown,
    schemasDictionary: Record<string, NormalizationSchemaParam>,
  ) {
    const result = { ...input }

    for (const key in schemasDictionary) {
      const currentSchema = schemasDictionary[key]
      if (isNullish(currentSchema)) {
        continue
      }
      const value = this.visit(input[key], parent, rootKey, currentSchema)

      if (value === undefined) {
        delete result[key]
      } else {
        result[key] = value
      }
    }

    return result
  }

  protected visitEntity(
    input: Record<string, unknown>,
    parent: unknown,
    key: unknown,
    schema: NormalizationSchema<unknown>,
  ): Identifier {
    if (this.cache.has(input)) {
      return this.cache.get(input)!
    }
    return schema.normalize(input, parent, key, this) as Identifier
  }
}
