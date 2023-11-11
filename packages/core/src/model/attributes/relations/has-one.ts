import type { Schema as NormalizrSchema } from 'normalizr'

import type { Collection, Element } from '../../../data/types'
import type { Query } from '../../../query/query'
import type { Schema } from '../../../schema/schema'
import type { Model } from '../../Model'
import type { Dictionary } from './relation'
import { Relation } from './relation'

export class HasOne extends Relation {
  /**
   * The foreign key of the parent model.
   */
  protected foreignKey: string

  /**
   * The local key of the parent model.
   */
  protected localKey: string

  /**
   * Create a new has-one relation instance.
   */
  constructor(parent: Model, related: Model, foreignKey: string, localKey: string) {
    super(parent, related)
    this.foreignKey = foreignKey
    this.localKey = localKey
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
  public define(schema: Schema): NormalizrSchema {
    return schema.one(this.related, this.parent)
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

      dictionary[key] ? model.$setRelation(relation, dictionary[key][0]) : model.$setRelation(relation, null)
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
  protected buildDictionary(results: Collection): Dictionary {
    return this.mapToDictionary(results, (result) => {
      return [result[this.foreignKey], result]
    })
  }
}
