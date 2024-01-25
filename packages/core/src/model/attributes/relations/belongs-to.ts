import type { Element } from '@core-shared-utils/sharedTypes'

import type { Collection } from '@/data/types'
import type { Query } from '@/query/query'
import type { Schema } from '@/schema/schema'
import type { NormalizedSchema } from '@/schema/types'

import type { Model } from '../../Model'
import { Relation } from './relation'

export class BelongsTo extends Relation {
  /**
   * Create a new belongs-to relation instance.
   */
  constructor(
    parent: Model,
    protected readonly child: Model,
    protected readonly foreignKey: string,
    protected readonly ownerKey: string,
  ) {
    super(parent, child)
  }

  /**
   * Get all related models for the relationship.
   */
  public getRelateds(): Model[] {
    return [this.child]
  }

  /**
   * Define the normalizr schema for the relation.
   */
  public define(schema: Schema): NormalizedSchema {
    return schema.one(this.child, this.parent)
  }

  /**
   * Attach the relational key to the given relation.
   */
  public attach(record: Element, child: Element): void {
    record[this.foreignKey] = child[this.ownerKey]
  }

  /**
   * Set the constraints for an eager load of the relation.
   */
  public addEagerConstraints(query: Query, models: Collection): void {
    query.whereIn(this.ownerKey, this.getEagerModelKeys(models))
  }

  /**
   * Match the eagerly loaded results to their respective parents.
   */
  public match(relation: string, models: Collection, query: Query): void {
    const dictionary = this.buildDictionary(query.get())

    models.forEach((model) => {
      const key = model[this.foreignKey]

      dictionary[key] ? model.$setRelation(relation, dictionary[key]) : model.$setRelation(relation, null)
    })
  }

  /**
   * Make a related model.
   */
  public make(element?: Element): Model | null {
    return element ? this.child.$newInstance(element) : null
  }

  /**
   * Gather the keys from a collection of related models.
   */
  protected getEagerModelKeys(models: Collection): (string | number)[] {
    return models.reduce<(string | number)[]>((keys, model) => {
      if (model[this.foreignKey] !== null) {
        keys.push(model[this.foreignKey])
      }

      return keys
    }, [])
  }

  /**
   * Build model dictionary keyed by relation's parent key.
   */
  protected buildDictionary(models: Collection): Record<string, Model> {
    return models.reduce<Record<string, Model>>((dictionary, model) => {
      dictionary[model[this.ownerKey]] = model

      return dictionary
    }, {})
  }
}
