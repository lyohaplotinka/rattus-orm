import type { Collection, Element } from '@/data/types'
import type { Model } from '@/model/Model'
import type { Query } from '@/query/query'
import type { Schema } from '@/schema/schema'
import type { NormalizedSchema } from '@/schema/types'

import { Relation } from './relation'

export class MorphOne extends Relation {
  /**
   * Create a new morph-one relation instance.
   */
  constructor(
    parent: Model,
    related: Model,
    protected readonly morphId: string,
    protected readonly morphType: string,
    protected readonly localKey: string,
  ) {
    super(parent, related)
  }

  /**
   * Get all related models for the relationship.
   */
  public getRelateds(): Model[] {
    return [this.related]
  }

  /**
   * Define the normalizr schema for the relation.
   */
  public define(schema: Schema): NormalizedSchema {
    return schema.one(this.related, this.parent)
  }

  /**
   * Attach the parent type and id to the given relation.
   */
  public attach(record: Element, child: Element): void {
    child[this.morphId] = record[this.localKey]
    child[this.morphType] = this.parent.$entity()
  }

  /**
   * Set the constraints for an eager load of the relation.
   */
  public addEagerConstraints(query: Query, models: Collection): void {
    query.where(this.morphType, this.parent.$entity()).whereIn(this.morphId, this.getKeys(models, this.localKey))
  }

  /**
   * Match the eagerly loaded results to their parents.
   */
  public match(relation: string, models: Collection, query: Query): void {
    const dictionary = this.buildDictionary(query.get())

    models.forEach((model) => {
      const key = model.$getThisNonStrict()[this.localKey]

      dictionary[key] ? model.$setRelation(relation, dictionary[key]) : model.$setRelation(relation, null)
    })
  }

  /**
   * Make a related model.
   */
  public make(element?: Element): Model | null {
    return element ? this.related.$newInstance(element) : null
  }

  /**
   * Build model dictionary keyed by the relation's foreign key.
   */
  protected buildDictionary(models: Collection): Record<string, Model> {
    return models.reduce<Record<string, Model>>((dictionary, model) => {
      dictionary[model.$getThisNonStrict()[this.morphId]] = model

      return dictionary
    }, {})
  }
}
