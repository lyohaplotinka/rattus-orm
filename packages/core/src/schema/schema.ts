import { isUnknownRecord } from '@core-shared-utils/isUnknownRecord'

import { Relation } from '@/attributes/classes/relations/relation'
import type { Uid } from '@/attributes/classes/types/Uid'
import type { Model } from '@/model/Model'
import { ArrayNormalizationSchema } from '@/normalization/schemas/array-normalization-schema'
import { EntityNormalizationSchema } from '@/normalization/schemas/entity-normalization-schema'
import type { NormalizationSchema, SchemaAttributeGetter, SchemaDefinition } from '@/normalization/schemas/types'
import type { IdentifierGetter } from '@/normalization/schemas/types'
import { UnionNormalizationSchema } from '@/normalization/schemas/union-normalization-schema'
import type { Schemas } from '@/schema/types'
import { isArray, isNullish } from '@/support/utils'

export class Schema {
  /**
   * The list of generated schemas.
   */
  protected readonly schemas: Schemas = {}

  /**
   * Create a new Schema instance.
   */
  constructor(protected readonly model: Model) {}

  /**
   * Create a single schema.
   */
  public one(model: Model = this.model, parent: Model = this.model): NormalizationSchema<any> {
    const entity = `${model.$entity()}${parent.$entity()}`

    if (this.schemas[entity]) {
      return this.schemas[entity]
    }

    this.schemas[entity] = this.newEntity(model, parent)
    const definition = this.definition(model)
    this.schemas[entity].define(definition)

    return this.schemas[entity]
  }

  /**
   * Create an array schema for the given model.
   */
  public many(model: Model, parent?: Model): NormalizationSchema<any> {
    return new ArrayNormalizationSchema(this.one(model, parent))
  }

  /**
   * Create an union schema for the given models.
   */
  public union(models: Model[], callback: SchemaAttributeGetter): NormalizationSchema<any> {
    const schemas = models.reduce<Schemas>((schemas, model) => {
      schemas[model.$entity()] = this.one(model)
      return schemas
    }, {})

    return new UnionNormalizationSchema(schemas, callback)
  }

  /**
   * Create a new normalizr entity.
   */
  private newEntity(model: Model, parent: Model): NormalizationSchema<any> {
    const entity = model.$entity()
    const idAttribute = this.idAttribute(model, parent)

    return new EntityNormalizationSchema(entity, {}, idAttribute)
  }

  /**
   * The `id` attribute option for the normalizr entity.
   *
   * Generates any missing primary keys declared by a Uid attribute. Missing
   * primary keys where the designated attributes do not exist will
   * throw an error.
   *
   * Note that this will only generate uids for primary key attributes since it
   * is required to generate the "index id" while the other attributes are not.
   *
   * It's especially important when attempting to "update" records since we'll
   * want to retain the missing attributes in-place to prevent them being
   * overridden by newly generated uid values.
   *
   * If uid primary keys are omitted, when invoking the "update" method, it will
   * fail because the uid values will never exist in the store.
   *
   * While it would be nice to throw an error in such a case, instead of
   * silently failing an update, we don't have a way to detect whether users
   * are trying to "update" records or "inserting" new records at this stage.
   * Something to consider for future revisions.
   */
  private idAttribute(model: Model, parent: Model): IdentifierGetter {
    // We'll first check if the model contains any uid attributes. If so, we
    // generate the uids during the normalization process, so we'll keep that
    // check result here. This way, we can use this result while processing each
    // record, instead of looping through the model fields each time.
    const uidFields = this.getUidPrimaryKeyPairs(model)

    return (record: any, parentRecord: any, key: any) => {
      // If the `key` is not `null`, that means this record is a nested
      // relationship of the parent model. In this case, we'll attach any
      // missing foreign keys to the record first.
      if (key !== null) {
        ;(parent.$fields()[key] as Relation).attach(parentRecord, record)
      }

      // Next, we'll generate any missing primary key fields defined as
      // uid field.
      for (const key in uidFields) {
        if (isNullish(record[key])) {
          record[key] = uidFields[key].make(record[key])
        }
      }

      // Finally, obtain the index id, attach it to the current record at the
      // special `__id` key. The `__id` key is used when we try to retrieve
      // the models via the `revive` method using the data that is currently
      // being normalized.
      const id = model.$getIndexId(record)

      return id
    }
  }

  /**
   * Get all primary keys defined by the Uid attribute for the given model.
   */
  private getUidPrimaryKeyPairs(model: Model): Record<string, Uid> {
    const fields = model.$fields()
    const key = model.$getKeyName()
    const keys = isArray(key) ? key : [key]

    const attributes = {} as Record<string, Uid>

    keys.forEach((k) => {
      const attr = fields[k]

      if (this.isUid(attr)) {
        attributes[k] = attr
      }
    })

    return attributes
  }

  /**
   * Create a definition for the given model.
   */
  private definition(model: Model): SchemaDefinition {
    const fields = model.$fields()
    const definition: SchemaDefinition = {}

    for (const key in fields) {
      const field = fields[key]

      if (field instanceof Relation) {
        definition[key] = field.define(this)
      }
    }

    return definition
  }

  /**
   * Checks if the given value is of type Uid.
   */
  private isUid(value: unknown): value is Uid {
    return isUnknownRecord(value) && value.__isUid === true
  }
}
