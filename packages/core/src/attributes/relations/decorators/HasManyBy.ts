import type { PropertyDecorator } from '@/attributes/common/contracts'
import { createHasManyByRelation } from '@/attributes/relations/createHasManyByRelation'
import type { ModelConstructor } from '@/model/types'

/**
 * Create a has-many-by attribute property decorator.
 */
export function HasManyBy(
  related: () => ModelConstructor<any>,
  foreignKey: string,
  ownerKey?: string,
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()
    self.setRegistry(propertyKey, createHasManyByRelation(related, foreignKey, ownerKey))
  }
}
