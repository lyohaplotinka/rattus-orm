import type { PropertyDecorator } from '@/attributes/common/contracts'
import { createMorphToRelation } from '@/attributes/relations/createMorphToRelation'
import type { Model } from '@/model/Model'

/**
 * Create a morph-to attribute property decorator.
 */
export function MorphTo(
  related: () => (typeof Model)[],
  id: string,
  type: string,
  ownerKey?: string,
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()
    self.setRegistry(propertyKey, createMorphToRelation(related, id, type, ownerKey))
  }
}
