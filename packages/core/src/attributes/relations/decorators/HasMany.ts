import type { PropertyDecorator } from '@/attributes/common/contracts'
import { createHasManyRelation } from '@/attributes/relations/createHasManyRelation'
import type { Model } from '@/model/Model'

/**
 * Create a has-many attribute property decorator.
 */
export function HasMany(
  related: () => typeof Model,
  foreignKey: string,
  localKey?: string,
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () =>
      createHasManyRelation(self, related(), foreignKey, localKey),
    )
  }
}
