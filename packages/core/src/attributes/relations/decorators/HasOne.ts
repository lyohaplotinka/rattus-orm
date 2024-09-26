import type { PropertyDecorator } from '@/attributes/common/contracts'
import { createHasOneRelation } from '@/attributes/relations/createHasOneRelation'
import type { Model } from '@/model/Model'

/**
 * Create a has-one attribute property decorator.
 */
export function HasOne(related: () => typeof Model, foreignKey: string, localKey?: string): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => createHasOneRelation(self, related(), foreignKey, localKey))
  }
}
