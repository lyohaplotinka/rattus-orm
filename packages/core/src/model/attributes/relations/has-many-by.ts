import type { Collection, Element } from '@/data/types'
import type { Model } from '@/model/Model'
import type { Query } from '@/query/query'
import type { Schema } from '@/schema/schema'
import type { NormalizedSchema } from '@/schema/types'

import { Relation } from './relation'

export class HasManyBy extends Relation {
  /**
   * Create a new has-many-by relation instance.
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
    return schema.many(this.child, this.parent)
  }

  /**
   * Attach the relational key to the given relation.
   */
  public attach(record: Element, child: Element): void {
    // If the child doesn't contain the owner key, just skip here. This happens
    // when child items have uid attribute as its primary key, and it's missing
    // when inserting records. Those ids will be generated later and will be
    // looped again. At that time, we can attach the correct owner key value.
    if (child[this.ownerKey] === undefined) {
      return
    }

    if (!record[this.foreignKey]) {
      record[this.foreignKey] = []
    }

    this.attachIfMissing(record[this.foreignKey], child[this.ownerKey])
  }

  /**
   * Set the constraints for an eager load of the relation.
   */
  public addEagerConstraints(query: Query, models: Collection): void {
    query.whereIn(this.ownerKey, this.getEagerModelKeys(models))
  }

  /**
   * Match the eagerly loaded results to their parents.
   */
  public match(relation: string, models: Collection, query: Query): void {
    const dictionary = this.buildDictionary(query.get())

    models.forEach((model) => {
      const relatedModels = this.getRelatedModels(dictionary, model[this.foreignKey])

      model.$setRelation(relation, relatedModels)
    })
  }

  /**
   * Make related models.
   */
  public make(elements?: Element[]): Model[] {
    return elements ? elements.map((element) => this.child.$newInstance(element)) : []
  }

  /**
   * Push owner key to foregin key array if owner key doesn't exist in foreign
   * key array.
   */
  protected attachIfMissing(foreignKey: (string | number)[], ownerKey: string | number): void {
    if (foreignKey.indexOf(ownerKey) === -1) {
      foreignKey.push(ownerKey)
    }
  }

  /**
   * Gather the keys from a collection of related models.
   */
  protected getEagerModelKeys(models: Collection): (string | number)[] {
    return models.reduce<(string | number)[]>((keys, model) => {
      return [...keys, ...model[this.foreignKey]]
    }, [])
  }

  /**
   * Build model dictionary keyed by the relation's foreign key.
   */
  protected buildDictionary(models: Collection): Record<string, Model> {
    return models.reduce<Record<string, Model>>((dictionary, model) => {
      dictionary[model[this.ownerKey]] = model

      return dictionary
    }, {})
  }

  /**
   * Get all related models from the given dictionary.
   */
  protected getRelatedModels(dictionary: Record<string, Model>, keys: (string | number)[]): Model[] {
    return keys.reduce<Model[]>((items, key) => {
      const item = dictionary[key]

      item && items.push(item)

      return items
    }, [])
  }
}
