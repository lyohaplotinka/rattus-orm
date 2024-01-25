import type { Element } from '@core-shared-utils/sharedTypes'

import type { Collection, Item } from '@/data/types'
import type { ModelConstructor } from '@/model/types'
import { assert, isArray, isNullish } from '@/support/utils'

import type { Attribute } from './attributes/attribute'
import { BelongsTo } from './attributes/relations/belongs-to'
import { HasMany } from './attributes/relations/has-many'
import { HasManyBy } from './attributes/relations/has-many-by'
import { HasOne } from './attributes/relations/has-one'
import { MorphOne } from './attributes/relations/morph-one'
import { MorphTo } from './attributes/relations/morph-to'
import { Relation } from './attributes/relations/relation'
import { Attr } from './attributes/types/Attr'
import { Boolean as Bool } from './attributes/types/Boolean'
import { Number as Num } from './attributes/types/Number'
import { String as Str } from './attributes/types/String'
import { Uid } from './attributes/types/Uid'

export type ModelFields = Record<string, Attribute<unknown>>
export type ModelSchemas = Record<string, ModelFields>
export type ModelRegistries = Record<string, ModelRegistry>
export type ModelRegistry = Record<string, () => Attribute<unknown>>

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
  public static dataTypeCasting: boolean = true

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

    const fill = options.fill ?? true

    fill && this.$fill(attributes, options)
  }

  /**
   * Create a new model fields definition.
   */
  public static fields(): ModelFields {
    return {}
  }

  /**
   * Set the attribute to the registry.
   */
  public static setRegistry<M extends typeof Model>(this: M, key: string, attribute: () => Attribute<unknown>): M {
    if (!this.registries[this.entity]) {
      this.registries[this.entity] = {}
    }

    this.registries[this.entity][key] = attribute

    return this
  }

  /**
   * Clear the list of booted models so they can be re-booted.
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

  /**
   * Create a new Attr attribute instance.
   */
  public static attr(value: any): Attr {
    return new Attr(this.thisAsModelConstructor().newRawInstance(), value)
  }

  /**
   * Create a new String attribute instance.
   */
  public static string(value: string | null): Str {
    return new Str(this.thisAsModelConstructor().newRawInstance(), value)
  }

  /**
   * Create a new Number attribute instance.
   */
  public static number(value: number | null): Num {
    return new Num(this.thisAsModelConstructor().newRawInstance(), value)
  }

  /**
   * Create a new Boolean attribute instance.
   */
  public static boolean(value: boolean | null): Bool {
    return new Bool(this.thisAsModelConstructor().newRawInstance(), value)
  }

  /**
   * Create a new Uid attribute instance.
   */
  public static uid(): Uid {
    return new Uid(this.thisAsModelConstructor().newRawInstance())
  }

  /**
   * Create a new HasOne relation instance.
   */
  public static hasOne(related: ModelConstructor<any>, foreignKey: string, localKey?: string): HasOne {
    const model = this.thisAsModelConstructor().newRawInstance()

    localKey = localKey ?? model.$getLocalKey()

    return new HasOne(model, related.newRawInstance(), foreignKey, localKey as string)
  }

  /**
   * Create a new BelongsTo relation instance.
   */
  public static belongsTo(related: ModelConstructor<any>, foreignKey: string, ownerKey?: string): BelongsTo {
    const instance = related.newRawInstance()

    ownerKey = ownerKey ?? instance.$getLocalKey()

    return new BelongsTo(this.thisAsModelConstructor().newRawInstance(), instance, foreignKey, ownerKey as string)
  }

  /**
   * Create a new HasMany relation instance.
   */
  public static hasMany(related: ModelConstructor<any>, foreignKey: string, localKey?: string): HasMany {
    const model = this.thisAsModelConstructor().newRawInstance()

    localKey = localKey ?? model.$getLocalKey()

    return new HasMany(model, related.newRawInstance(), foreignKey, localKey as string)
  }

  /**
   * Create a new HasManyBy relation instance.
   */
  public static hasManyBy(related: ModelConstructor<Model>, foreignKey: string, ownerKey?: string): HasManyBy {
    const instance = related.newRawInstance()

    ownerKey = ownerKey ?? instance.$getLocalKey()

    return new HasManyBy(this.thisAsModelConstructor().newRawInstance(), instance, foreignKey, ownerKey)
  }

  /**
   * Create a new MorphOne relation instance.
   */
  public static morphOne(related: ModelConstructor<Model>, id: string, type: string, localKey?: string): MorphOne {
    const model = this.thisAsModelConstructor().newRawInstance()

    localKey = localKey ?? model.$getLocalKey()

    return new MorphOne(model, related.newRawInstance(), id, type, localKey as string)
  }

  /**
   * Create a new MorphTo relation instance.
   */
  public static morphTo(related: ModelConstructor<any>[], id: string, type: string, ownerKey: string = ''): MorphTo {
    const instance = this.thisAsModelConstructor().newRawInstance()
    const relatedModels = related.map((model) => model.newRawInstance())

    return new MorphTo(instance, relatedModels, id, type, ownerKey)
  }

  protected static thisAsModelConstructor() {
    return this as ModelConstructor<any>
  }

  /**
   * Build the schema by evaluating fields and registry.
   */
  protected static initializeSchema(): void {
    this.schemas[this.entity] = {}

    const registry = {
      ...this.fields(),
      ...this.registries[this.entity],
    }

    for (const key in registry) {
      const attribute = registry[key]

      this.schemas[this.entity][key] = typeof attribute === 'function' ? attribute() : attribute
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
   */
  public $newInstance(attributes?: Element, options?: ModelOptions): this {
    const self = this.$self()
    return new self(attributes, options) as this
  }

  /**
   * Fill this model by the given attributes. Missing fields will be populated
   * by the attributes default value.
   */
  public $fill(attributes: Element = {}, options: ModelOptions = {}): this {
    const fields = this.$fields()
    const fillRelation = options.relations ?? true

    for (const key in fields) {
      const attr = fields[key]
      const value = attributes[key]

      if (attr instanceof Relation && !fillRelation) {
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
   */
  public $getKey(record?: Element): string | number | (string | number)[] | null {
    record = record ?? this

    if (this.$hasCompositeKey()) {
      return this.$getCompositeKey(record)
    }

    const id = record[this.$getKeyName() as string]

    return isNullish(id) ? null : id
  }

  /**
   * Check whether the model has composite key.
   */
  public $hasCompositeKey(): boolean {
    return isArray(this.$getKeyName())
  }

  /**
   * Get the index id of this model or for a given record.
   */
  public $getIndexId(record?: Element): string {
    const target = record ?? this

    const id = this.$getKey(target)

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
    assert(!this.$hasCompositeKey(), [
      'Please provide the local key for the relationship. The model with the',
      "composite key can't infer its local key.",
    ])

    return this.$getKeyName() as string
  }

  /**
   * Get the relation instance for the given relation name.
   */
  public $getRelation(name: string): Relation {
    const relation = this.$fields()[name]

    assert(relation instanceof Relation, [`Relationship [${name}] on model [${this.$entity()}] not found.`])

    return relation
  }

  /**
   * Set the given relationship on the model.
   */
  public $setRelation(relation: string, model: Model | Model[] | null): this {
    this[relation] = model

    return this
  }

  /**
   * Get the serialized model attributes.
   */
  public $getAttributes(): Element {
    return this.$toJson(this, { relations: false })
  }

  /**
   * Serialize this model, or the given model, as POJO.
   */
  public $toJson(model?: Model, options: ModelOptions = {}): Element {
    model = model ?? this

    const fields = model.$fields()
    const withRelation = options.relations ?? true
    const record: Element = {}

    for (const key in fields) {
      const attr = fields[key]
      const value = model[key]

      if (!(attr instanceof Relation)) {
        record[key] = this.serializeValue(value)
        continue
      }

      if (withRelation) {
        record[key] = this.serializeRelation(value)
      }
    }

    return record
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
   */
  public $sanitize(record: Element): Element {
    const sanitizedRecord = {} as Element
    const attrs = this.$fields()

    for (const key in record) {
      const attr = attrs[key]
      const value = record[key]

      if (attr !== undefined && !(attr instanceof Relation)) {
        sanitizedRecord[key] = attr.make(value)
      }
    }

    return sanitizedRecord
  }

  /**
   * Same as `$sanitize` method, but it produces missing model fields with its
   * default value.
   */
  public $sanitizeAndFill(record: Element): Element {
    const sanitizedRecord = {} as Element

    const attrs = this.$fields()

    for (const key in attrs) {
      const attr = attrs[key]
      const value = record[key]

      if (!(attr instanceof Relation)) {
        sanitizedRecord[key] = attr.make(value)
      }
    }

    return sanitizedRecord
  }

  /**
   * Bootstrap this model.
   */
  protected $boot(): void {
    if (!this.$self().booted[this.$entity()]) {
      this.$self().booted[this.$entity()] = true

      this.$initializeSchema()
    }
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
      this[key] = attr instanceof MorphTo ? attr.make(value, this[attr.getType()]) : attr.make(value)

      return
    }

    if (this[key] === undefined) {
      this[key] = attr.make()
    }
  }

  /**
   * Get the composite key values for the given model as an array of ids.
   */
  protected $getCompositeKey(record: Element): (string | number)[] | null {
    let ids = [] as (string | number)[] | null

    ;(this.$getKeyName() as string[]).every((key) => {
      const id = record[key]

      if (isNullish(id)) {
        ids = null
        return false
      }

      ;(ids as (string | number)[]).push(id)
      return true
    })

    return ids === null ? null : ids
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

    if (isArray(value)) {
      return this.serializeArray(value)
    }

    if (typeof value === 'object') {
      return this.serializeObject(value)
    }

    return value
  }

  /**
   * Serialize the given array to JSON.
   */
  protected serializeArray(value: any[]): any[] {
    return value.map((v) => this.serializeValue(v))
  }

  /**
   * Serialize the given object to JSON.
   */
  protected serializeObject(value: object): object {
    const obj = {}

    for (const key in value) {
      obj[key] = this.serializeValue(value[key])
    }

    return obj
  }

  /**
   * Serialize the given relation to JSON.
   */
  protected serializeRelation(relation: Item): Element | null

  protected serializeRelation(relation: Collection): Element[]

  protected serializeRelation(relation: any): any {
    if (relation === undefined) {
      return undefined
    }

    if (relation === null) {
      return null
    }

    return isArray(relation) ? relation.map((model) => model.$toJson()) : relation.$toJson()
  }
}
