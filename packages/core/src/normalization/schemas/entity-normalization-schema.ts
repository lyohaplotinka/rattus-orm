import { isUnknownRecord } from '@core-shared-utils/isUnknownRecord'

import { BaseSchema } from '@/normalization/schemas/base-schema'
import { isString } from '@/support/utils'

import type { Normalizer } from '../normalizer'
import type { Identifier, IdentifierGetter, SchemaDefinition } from './types'

export class EntityNormalizationSchema extends BaseSchema<Identifier> {
  constructor(
    public readonly key: string,
    public readonly definition: SchemaDefinition = {},
    public readonly idAttribute: IdentifierGetter = 'id',
  ) {
    super(key, definition)
  }

  public normalize(
    input: Record<string, unknown>,
    parent: unknown,
    key: unknown,
    visitor: Normalizer,
  ): string | number {
    const idAttribute = isString(this.idAttribute)
      ? this.idAttribute
      : this.idAttribute(input, parent, key)
    const id = isString(this.idAttribute)
      ? (input[idAttribute] as Identifier)
      : this.idAttribute(input, parent, key)

    visitor.cache.set(input, id)

    const processedEntity: Record<string, unknown> = Object.assign({}, input)

    for (const key in this.definition) {
      if (!isUnknownRecord(processedEntity[key])) {
        continue
      }
      processedEntity[key] = visitor.visit(
        processedEntity[key],
        processedEntity,
        key,
        this.definition[key],
      )
    }

    visitor.addEntity(this, id, processedEntity)

    return id
  }
}
