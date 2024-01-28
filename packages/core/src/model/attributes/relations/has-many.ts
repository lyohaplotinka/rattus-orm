import type { Collection, Element } from '@/data/types'
import type { Model } from '@/model/Model'
import type { Query } from '@/query/query'
import type { Schema } from '@/schema/schema'
import type { NormalizedSchema } from '@/schema/types'

import type { Dictionary } from './relation'
import { Relation } from './relation'

export class HasMany extends Relation {
  /**
   * Create a new has-many relation instance.
   */
  constructor(
    parent: Model,
    related: Model,
    protected readonly foreignKey: string,
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
    return schema.many(this.related, this.parent)
  }

  /**
   * Attach the relational key to the given relation.
   */
  public attach(record: Element, child: Element): void {
    child[this.foreignKey] = record[this.localKey]
  }

  /**
   * Set the constraints for an eager load of the relation.
   */
  public addEagerConstraints(query: Query, models: Collection): void {
    query.whereIn(this.foreignKey, this.getKeys(models, this.localKey))
  }

  /**
   * Match the eagerly loaded results to their parents.
   */
  public match(relation: string, models: Collection, query: Query): void {
    const dictionary = this.buildDictionary(query.get())

    models.forEach((model) => {
      const key = model[this.localKey]

      dictionary[key] ? model.$setRelation(relation, dictionary[key]) : model.$setRelation(relation, [])
    })
  }

  /**
   * Make related models.
   */
  public make(elements?: Element[]): Model[] {
    return elements ? elements.map((element) => this.related.$newInstance(element)) : []
  }

  /**
   * Build model dictionary keyed by the relation's foreign key.
   */
  protected buildDictionary(results: Collection): Dictionary {
    return this.mapToDictionary(results, (result) => {
      return [result[this.foreignKey], result]
    })
  }
}
