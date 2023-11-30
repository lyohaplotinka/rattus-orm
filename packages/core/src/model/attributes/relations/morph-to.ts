import type { Element } from '@rattus-orm/utils/sharedTypes'
import type { Schema as NormalizrSchema } from 'normalizr'

import type { Collection } from '@/data/types'
import type { Model } from '@/model/Model'
import type { Query } from '@/query/query'
import type { Schema } from '@/schema/schema'
import { assert } from '@/support/utils'

import { Relation } from './relation'

interface DictionaryByEntities {
  [entity: string]: {
    [id: string]: Model
  }
}

export class MorphTo extends Relation {
  /**
   * The related models.
   */
  protected relatedModels: Model[]

  /**
   * The related model dictionary.
   */
  protected relatedTypes: Record<string, Model>

  /**
   * The field name that contains id of the parent model.
   */
  protected morphId: string

  /**
   * The field name that contains type of the parent model.
   */
  protected morphType: string

  /**
   * The associated key of the child model.
   */
  protected ownerKey: string

  /**
   * Create a new morph-to relation instance.
   */
  constructor(parent: Model, relatedModels: Model[], morphId: string, morphType: string, ownerKey: string) {
    super(parent, parent)

    this.relatedModels = relatedModels
    this.relatedTypes = this.createRelatedTypes(relatedModels)

    this.morphId = morphId
    this.morphType = morphType
    this.ownerKey = ownerKey
  }

  /**
   * Get the type field name.
   */
  public getType(): string {
    return this.morphType
  }

  /**
   * Get all related models for the relationship.
   */
  public getRelateds(): Model[] {
    return this.relatedModels
  }

  /**
   * Define the normalizr schema for the relation.
   */
  public define(schema: Schema): NormalizrSchema {
    return schema.union(this.relatedModels, (value, parent) => {
      // Assign missing parent id since the child model is not related back
      // and `attach` will not be called.
      const type = parent[this.morphType]
      const model = this.relatedTypes[type]
      const key = this.ownerKey || (model.$getKeyName() as string)

      parent[this.morphId] = value[key]

      return type
    })
  }

  /**
   * Attach the relational key to the given record. Since morph-to relationship
   * doesn't have any foreign key, it would do nothing.
   */
  public attach(): void {
    return
  }

  /**
   * Add eager constraints. Since we do not know the related model ahead of time,
   * we cannot add any eager constraints.
   */
  public addEagerConstraints(): void {
    return
  }

  /**
   * Find and attach related children to their respective parents.
   */
  public match(relation: string, models: Collection, query: Query): void {
    // Create dictionary that contains relationships.
    const dictionary = this.buildDictionary(query, models)

    models.forEach((model) => {
      const type = model[this.morphType]
      const id = model[this.morphId]

      const related = dictionary[type]?.[id] ?? null

      model.$setRelation(relation, related)
    })
  }

  /**
   * Make a related model.
   */
  public make(element?: Element, type?: string): Model | null {
    if (!element || !type) {
      return null
    }

    return this.relatedTypes[type].$newInstance(element)
  }

  /**
   * Create a dictionary of relations keyed by their entity.
   */
  protected createRelatedTypes(models: Model[]): Record<string, Model> {
    return models.reduce<Record<string, Model>>((types, model) => {
      types[model.$entity()] = model

      return types
    }, {})
  }

  /**
   * Build model dictionary keyed by the owner key for each entity.
   */
  protected buildDictionary(query: Query, models: Collection): DictionaryByEntities {
    const keys = this.getKeysByEntity(models)

    const dictionary = {} as DictionaryByEntities

    for (const entity in keys) {
      const model = this.relatedTypes[entity]

      // If we can't find a model, it means the user did not provide model
      // that corresponds with the type.
      assert(!!model, [`Trying to load "morph to" relation of \`${entity}\``, 'but the model could not be found.'])

      const ownerKey = (this.ownerKey || model.$getKeyName()) as string

      const results = query.newQueryWithConstraints(entity).whereIn(ownerKey, keys[entity]).get()

      dictionary[entity] = results.reduce<Record<string, Model>>((dic, result) => {
        dic[result[ownerKey]] = result

        return dic
      }, {})
    }

    return dictionary
  }

  /**
   * Get the relation's primary keys grouped by its entity.
   */
  protected getKeysByEntity(models: Collection): Record<string, (string | number)[]> {
    return models.reduce<Record<string, (string | number)[]>>((keys, model) => {
      const type = model[this.morphType]
      const id = model[this.morphId]

      if (id !== null && this.relatedTypes[type] !== undefined) {
        if (!keys[type]) {
          keys[type] = []
        }

        keys[type].push(id)
      }

      return keys
    }, {})
  }
}
