import type { PropertyDecorator } from '@/attributes/common/contracts'
import { createBelongsToRelation } from '@/attributes/relations/createBelongsToRelation'
import type { Model } from '@/model/Model'

/**
 * Create a belongs-to attribute property decorator.
 */
export function BelongsTo(
  related: () => typeof Model,
  foreignKey: string,
  ownerKey?: string,
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () =>
      createBelongsToRelation(self, related(), foreignKey, ownerKey),
    )
  }
}
