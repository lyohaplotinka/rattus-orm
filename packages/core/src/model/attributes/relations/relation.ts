import type { Element } from '@rattus-orm/utils/sharedTypes'

import type { Collection } from '@/data/types'
import type { Model } from '@/model/Model'
import type { Query } from '@/query/query'
import type { Schema } from '@/schema/schema'
import type { NormalizedSchema } from '@/schema/types'

import { Attribute } from '../attribute'

export interface Dictionary {
  [id: string]: Model[]
}

export abstract class Relation extends Attribute<any> {
  /**
   * Create a new relation instance.
   */
  constructor(
    protected readonly parent: Model,
    protected readonly related: Model,
  ) {
    super(parent)
  }

  /**
   * Get the related model of the relation.
   */
  public getRelated(): Model {
    return this.related
  }

  /**
   * Get all of the primary keys for an array of models.
   */
  protected getKeys(models: Collection, key: string): (string | number)[] {
    return models.map((model) => model[key])
  }

  /**
   * Run a dictionary map over the items.
   */
  protected mapToDictionary(models: Collection, callback: (model: Model) => [string, Model]): Dictionary {
    return models.reduce<Dictionary>((dictionary, model) => {
      const [key, value] = callback(model)

      if (!dictionary[key]) {
        dictionary[key] = []
      }

      dictionary[key].push(value)

      return dictionary
    }, {})
  }

  protected makeCasted(): any {}
  protected makeRaw(): any {}

  /**
   * Get all related models for the relationship.
   */
  public abstract getRelateds(): Model[]

  /**
   * Define the normalizr schema for the relation.
   */
  public abstract define(schema: Schema): NormalizedSchema

  /**
   * Attach the relational key to the given relation.
   */
  public abstract attach(record: Element, child: Element): void

  /**
   * Set the constraints for an eager loading relation.
   */
  public abstract addEagerConstraints(query: Query, models: Collection): void

  /**
   * Match the eagerly loaded results to their parents.
   */
  public abstract match(relation: string, models: Collection, query: Query): void
}
