import { isUnknownRecord } from '@core-shared-utils/isUnknownRecord'

import { isKindOf, isRelation, morphToKind } from '@/attributes/common/const'
import { AttributeFactory } from '@/attributes/common/contracts'
import type { Attribute, Type } from '@/attributes/field-types'
import type { MorphTo } from '@/attributes/relations/classes/morph-to'
import type { Relation } from '@/attributes/relations/classes/relation'
import type { Collection, Element, Item, RawModel } from '@/data/types'
import type { ModelConstructor } from '@/model/types'
import { assert, isArray, isNullish } from '@/support/utils'
import type { Constructor } from '@/types'

export type ModelFields = Record<string, Attribute<unknown>>
export type ModelSchemas = Record<string, ModelFields>
export type ModelRegistries = Record<string, ModelRegistry>
export type ModelRegistry = Record<string, AttributeFactory<unknown>>
export type ModelFieldsDefinition = Record<string, AttributeFactory<unknown>>

export interface ModelOptions {
  fill?: boolean
  relations?: boolean
}

export class Model {
  /**
   * The name of the model.
   */
  public static entity: string

  /**
   * Should or should not cast data types
   */
  public static dataTypeCasting = true

  /**
   * The primary key for the model.
   */
  public static primaryKey: string | string[] = 'id'

  /**
   * The schema for the model. It contains the result of the `fields`
   * method or the attributes defined by decorators.
   */
  protected static schemas: ModelSchemas = {}

  /**
   * The registry for the model. It contains predefined model schema generated
   * by the property decorators and gets evaluated, and stored, on the `schema`
   * property when registering models to the database.
   */
  protected static registries: ModelRegistries = {}

  /**
   * The array of booted models.
   */
  protected static booted: Record<string, boolean> = {}

  /**
   * Create a new model instance.
   */
  constructor(attributes?: Element, options: ModelOptions = {}) {
    this.$boot()
    if (options.fill ?? true) {
      this.$fill(attributes, options)
    }
  }

  /**
   * Create a new model fields definition.
   */
  public static fields(): ModelFieldsDefinition {
    return {}
  }

  /**
   * Set the attribute to the registry.
   *
   * @param {string} key model field name
   * @param {() => Attribute<unknown>} attribute attribute factory
   */
  public static setRegistry<M extends typeof Model>(
    this: M,
    key: string,
    attribute: AttributeFactory<unknown>,
  ): M {
    this.registries[this.entity] = {
      ...(this.registries[this.entity] ?? {}),
      [key]: attribute,
    }

    return this
  }

  /**
   * Clear the list of booted models, so they can be re-booted.
   */
  public static clearBootedModels(): void {
    this.booted = {}
    this.schemas = {}
  }

  /**
   * Clear registries.
   */
  public static clearRegistries(): void {
    this.registries = {}
  }

  /**
   * Create a new model instance without field values being populated.
   *
   * This method is mainly for the internal use when registering models to the
   * database. Since all pre-registered models are for referencing its model
   * setting during the various process, but the fields are not required.
   *
   * Use this method when you want create a new model instance for:
   * - Registering model to a component (eg. Repository, Query, etc.)
   * - Registering model to attributes (String, Has Many, etc.)
   */
  public static newRawInstance<M extends Model>(this: ModelConstructor<M>): M {
    return new this(undefined, { fill: false }) as M
  }

  protected static createType<T extends Type<any>>(TypeCtor: Constructor<T>, value?: any) {
    return new TypeCtor(this.thisAsModelConstructor().newRawInstance(), value)
  }

  protected static thisAsModelConstructor() {
    return this as ModelConstructor<any>
  }

  /**
   * Build the schema by evaluating fields and registry.
   */
  protected static initializeSchema(): void {
    this.schemas[this.entity] = {}

    for (const [key, attribute] of Object.entries({
      ...this.fields(),
      ...this.registries[this.entity],
    })) {
      this.schemas[this.entity][key] = attribute(this)
    }
  }

  /**
   * Get the constructor for this model.
   */
  public $self(): typeof Model {
    return this.constructor as typeof Model
  }

  /**
   * Get the entity for this model.
   */
  public $entity(): string {
    return this.$self().entity
  }

  /**
   * Get the primary key for this model.
   */
  public $primaryKey(): string | string[] {
    return this.$self().primaryKey
  }

  /**
   * Get the model fields for this model.
   */
  public $fields(): ModelFields {
    return this.$self().schemas[this.$entity()]
  }

  /**
   * Create a new instance of this model. This method provides a convenient way
   * to re-generate a fresh instance of this model. It's particularly useful
   * during hydration through Query operations.
   *
   * @param {Element} attributes data to fill new instance with
   * @param {ModelOptions} options options (should fill, include relations)
   */
  public $newInstance(attributes?: Element, options?: ModelOptions): this {
    const self = this.$self()
    return new self(attributes, options) as this
  }

  /**
   * Fill this model by the given attributes. Missing fields will be populated
   * by the attributes default value.
   *
   * @param {Element} attributes data to fill new instance with
   * @param {ModelOptions} options options (should fill, include relations)
   */
  public $fill(attributes: Element = {}, options: ModelOptions = {}): this {
    for (const [key, attr] of Object.entries(this.$fields())) {
      const value = attributes[key]
      if (isRelation(attr) && !(options.relations ?? true)) {
        continue
      }
      this.$fillField(key, attr, value)
    }

    return this
  }

  /**
   * Get the primary key field name.
   */
  public $getKeyName(): string | string[] {
    return this.$primaryKey()
  }

  /**
   * Get primary key value for the model. If the model has the composite key,
   * it will return an array of ids.
   *
   * @param {Element} record optional data of element to get key
   */
  public $getKey(record: Element = this): string | number | (string | number)[] | null {
    if (isArray(this.$getKeyName())) {
      return this.$getCompositeKey(record)
    }
    return record[this.$getKeyName() as string] ?? null
  }

  /**
   * Get the index id of this model or for a given record.
   *
   * @param {Element} record optional data of element to index id
   */
  public $getIndexId(record: Element = this): string {
    const id = this.$getKey(record)

    assert(id !== null, [
      'The record is missing the primary key. If you want to persist record',
      'without the primary key, please define the primary key field with the',
      '`uid` attribute.',
    ])

    return this.$stringifyId(id)
  }

  /**
   * Get the local key name for the model.
   */
  public $getLocalKey(): string {
    // If the model has a composite key, we can't use it as a local key for the
    // relation. The user must provide the key name explicitly, so we'll throw
    // an error here.
    assert(!isArray(this.$getKeyName()), [
      'Please provide the local key for the relationship. The model with the',
      "composite key can't infer its local key.",
    ])

    return this.$getKeyName() as string
  }

  /**
   * Get the relation instance for the given relation name.
   *
   * @param {string} name name of relation to get instance
   */
  public $getRelation(name: string): Relation {
    const relation = this.$fields()[name]

    assert(isRelation(relation), [`Relationship [${name}] on model [${this.$entity()}] not found.`])

    return relation
  }

  /**
   * Set the given relationship on the model.
   *
   * @param {string} relation relation name
   * @param {Model | Model[] | null} model model to set relation
   */
  public $setRelation(relation: string, model: Model | Model[] | null): this {
    this.getThisNonStrict()[relation] = model

    return this
  }

  /**
   * Get the serialized model attributes.
   */
  public $getAttributes(): Element {
    return this.$toJson({ relations: false })
  }

  /**
   * Serialize this model, or the given model, as POJO.
   *
   * @param {ModelOptions} options optional options to apply
   */
  public $toJson(options: ModelOptions = { relations: true }): RawModel<this> {
    return Object.entries(this.$fields()).reduce((result, [key, attr]) => {
      ;(result as any)[key] =
        isRelation(attr) && options.relations
          ? this.serializeRelation(this.getThisNonStrict()[key])
          : this.serializeValue(this.getThisNonStrict()[key])
      return result
    }, {}) as RawModel<this>
  }

  /**
   * Sanitize the given record. This method is similar to `$toJson` method, but
   * the difference is that it doesn't instantiate the full model. The method
   * is used to sanitize the record before persisting to the store.
   *
   * It removes fields that don't exist in the model field schema or if the
   * field is relationship fields.
   *
   * Note that this method only sanitizes existing fields in the given record.
   * It will not generate missing model fields. If you need to generate all
   * model fields, use `$sanitizeAndFill` method instead.
   *
   * @param {Element} record data to sanitize
   */
  public $sanitize(record: Element): Element {
    return Object.entries(record).reduce<Element>((result, [key, value]) => {
      const attr = this.$fields()[key]
      if (attr !== undefined && !isRelation(attr)) {
        result[key] = attr.make(value)
      }
      return result
    }, {})
  }

  /**
   * Same as `$sanitize` method, but it produces missing model fields with its
   * default value.
   *
   * @param {Element} record data to sanitize
   */
  public $sanitizeAndFill(record: Element): Element {
    return Object.entries(this.$fields()).reduce<Element>((result, [key, attr]) => {
      const value = record[key]
      if (attr !== undefined && !isRelation(attr)) {
        result[key] = attr.make(value)
      }
      return result
    }, {})
  }

  public getThisNonStrict() {
    return this as Record<string, any>
  }

  /**
   * Bootstrap this model.
   */
  protected $boot(): void {
    if (this.$self().booted[this.$entity()]) {
      return
    }
    this.$self().booted[this.$entity()] = true
    this.$initializeSchema()
  }

  /**
   * Build the schema by evaluating fields and registry.
   */
  protected $initializeSchema(): void {
    this.$self().initializeSchema()
  }

  /**
   * Fill the given attribute with a given value specified by the given key.
   */
  protected $fillField(key: string, attr: Attribute<unknown>, value: any): void {
    if (value !== undefined) {
      this.getThisNonStrict()[key] = isKindOf<MorphTo>(attr, morphToKind)
        ? attr.make(value, this.getThisNonStrict()[attr.getType()])
        : attr.make(value)
      return
    }

    if (this.getThisNonStrict()[key] === undefined) {
      this.getThisNonStrict()[key] = attr.make()
    }
  }

  /**
   * Get the composite key values for the given model as an array of ids.
   */
  protected $getCompositeKey(record: Element): (string | number)[] | null {
    const ids = (this.$getKeyName() as string[]).map((key) => record[key])
    return ids.some(isNullish) ? null : ids
  }

  /**
   * Stringify the given id.
   */
  protected $stringifyId(id: string | number | (string | number)[]): string {
    return isArray(id) ? JSON.stringify(id) : String(id)
  }

  /**
   * Serialize the given value.
   */
  protected serializeValue(value: any): any {
    if (value === null) {
      return null
    }

    if (value instanceof Date) {
      return value.toISOString()
    }

    if (isArray(value) || isUnknownRecord(value)) {
      return Object.keys(value).reduce(
        (result, key) => {
          ;(result as any)[key] = this.serializeValue((value as any)[key])
          return result
        },
        isArray(value) ? [] : {},
      )
    }

    return value
  }

  /**
   * Serialize the given relation to JSON.
   */
  protected serializeRelation(relation: Item): Element | null

  protected serializeRelation(relation: Collection): Element[]

  protected serializeRelation(relation: any): any {
    if (isNullish(relation)) {
      return relation
    }

    return isArray(relation) ? relation.map((model) => model.$toJson()) : relation.$toJson()
  }
}
